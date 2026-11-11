/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { TONES } from "@/src/data/chat";
import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from "@/src/redux/api/settingsApi";
import { NotificationSettingsModalProps } from "@/src/types/components/chat";
import { useNotifications } from "@/src/utils/hooks/useNotifications";
import {
  Bell,
  BellOff,
  Check,
  Play,
  ShieldAlert,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const NotificationSettingsModal: React.FC<
  NotificationSettingsModalProps
> = ({ isOpen, onClose }) => {
  const { permission, requestPermission } = useNotifications();
  const { data: userSettings, refetch } = useGetUserSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateUserSettingsMutation();

  const [selectedTone, setSelectedTone] = useState("default");
  const [isDND, setIsDND] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (userSettings?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTone(userSettings.data.notification_tone || "default");
      setIsDND(!userSettings.data.notifications_enabled);
    }
  }, [userSettings]);

  const handleSave = async () => {
    try {
      await updateSettings({
        notification_tone: selectedTone,
        notifications_enabled: !isDND,
      } as any).unwrap();
      toast.success("Notification settings saved");
      refetch();
      onClose();
    } catch {
      toast.error("Failed to save settings");
    }
  };

  const playTone = (toneFile: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    audioRef.current = new Audio(toneFile);
    audioRef.current
      .play()
      .catch((e) => console.error("Error playing audio:", e));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! p-0! overflow-hidden border-none dark:bg-(--card-color) gap-0 flex flex-col max-h-[calc(100dvh-2rem)]">
        <DialogHeader className="px-6 py-4 border-b border-slate-100 dark:border-(--card-border-color) shrink-0">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Settings
          </DialogTitle>
        </DialogHeader>

        <div className="sm:p-6 p-4 overflow-y-auto flex-1 custom-scrollbar space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-400">
              Browser Notifications
            </Label>
            <div
              className={cn(
                "p-4 rounded-lg border flex items-center justify-between transition-all flex-wrap gap-3",
                permission === "granted"
                  ? "bg-light-primary/50 border-[var(--primary-opacity-20)] dark:bg-primary/5 dark:border-primary/20"
                  : "bg-amber-50/50 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/20",
              )}
            >
              <div className="flex items-center gap-3">
                {permission === "granted" ? (
                  <ShieldCheck className="w-5 h-5 text-primary" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-amber-500" />
                )}
                <div>
                  <p className="text-sm font-semibold dark:text-white">
                    {permission === "granted"
                      ? "Notifications Enabled"
                      : "Permission Required"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {permission === "granted"
                      ? "Ready to receive alerts"
                      : "Allow in your browser to get alerts"}
                  </p>
                </div>
              </div>
              {permission !== "granted" && (
                <Button
                  size="sm"
                  onClick={requestPermission}
                  className="h-8 px-3 text-xs bg-amber-500 hover:bg-amber-600 text-white border-none"
                >
                  Enable
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-400">
              Mute Mode
            </Label>
            <Button
              variant="outline"
              onClick={() => setIsDND(!isDND)}
              className={cn(
                "w-full h-12 justify-between px-4 rounded-lg border transition-all",
                isDND
                  ? "bg-rose-50 border-rose-100 text-red-600 hover:text-red-700 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400"
                  : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color) dark:hover:bg-(--table-hover) dark:text-slate-300",
              )}
            >
              <div className="flex items-center gap-3">
                {isDND ? <BellOff size={18} /> : <Bell size={18} />}
                <span className={`font-semibold`}>
                  {isDND ? "Do Not Disturb Active" : "Notifications Active"}
                </span>
              </div>
              <div
                className={cn(
                  "w-10 h-5 rounded-full relative transition-all",
                  isDND
                    ? "bg-red-500"
                    : "bg-slate-300 dark:bg-(--page-body-bg)",
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                    isDND ? "left-6" : "left-1",
                  )}
                />
              </div>
            </Button>
          </div>


          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Notification Sounds</Label>
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-2 pr-1">
              {TONES.map((tone) => (
                <div
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all group",
                    selectedTone === tone.id
                      ? "bg-primary/5 border-primary dark:bg-primary/10"
                      : "bg-transparent border-slate-100 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover)",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                        selectedTone === tone.id
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-(--dark-body) text-slate-400",
                      )}
                    >
                      <Volume2 size={16} />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        selectedTone === tone.id
                          ? "text-primary dark:text-primary"
                          : "text-slate-600 dark:text-slate-400",
                      )}
                    >
                      {tone.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full hover:bg-primary/10 text-slate-500 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        playTone(tone.file);
                      }}
                    >
                      <Play size={14} className="fill-current" />
                    </Button>
                    {selectedTone === tone.id && (
                      <Check size={16} className="text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 sm:px-6 px-4 bg-slate-50 dark:bg-(--card-color) border-t border-slate-100 dark:border-(--card-border-color) flex justify-end gap-3 shrink-0">
          <Button
            variant="ghost"
            onClick={onClose}
            className="font-semibold dark:bg-(--page-body-bg)"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isUpdating}
            className="px-8 font-bold dark:text-white"
          >
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
