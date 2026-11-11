"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { SequenceFormModalProps } from "@/src/types/replyMaterial";
import { Loader2, Zap, MessageSquare, Send, Facebook, Instagram, Check } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";

const SequenceFormModal: React.FC<SequenceFormModalProps> = ({ isOpen, onClose, onSubmit, isLoading, editItem }) => {
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("whatsapp");
  const { getEnabledChannels } = useFeatureAccess();
  const enabled = getEnabledChannels();

  const filteredOptions = useMemo(() => {
    return [
      { id: "whatsapp", name: "WhatsApp", icon: <MessageSquare size={16} />, gradient: "from-emerald-400 to-teal-500", textHover: "group-hover:text-primary" },
      { id: "telegram", name: "Telegram", icon: <Send size={16} />, gradient: "from-sky-400 to-blue-500", textHover: "group-hover:text-sky-500" },
      { id: "facebook", name: "Facebook", icon: <Facebook size={16} />, gradient: "from-blue-500 to-indigo-600", textHover: "group-hover:text-blue-500" },
      { id: "instagram", name: "Instagram", icon: <Instagram size={16} />, gradient: "from-pink-500 to-rose-500", textHover: "group-hover:text-pink-500" },
    ].filter((opt) => {
      if (opt.id === "whatsapp") return true;
      if (opt.id === "telegram") return enabled.telegram;
      if (opt.id === "facebook") return enabled.facebook;
      if (opt.id === "instagram") return enabled.instagram;
      return true;
    });
  }, [enabled]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editItem?.name ?? "");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlatform(editItem?.platform ?? "whatsapp");
    }
  }, [isOpen, editItem]);

  useEffect(() => {
    if (platform === "telegram" && !enabled.telegram) setPlatform("whatsapp");
    if (platform === "facebook" && !enabled.facebook) setPlatform("whatsapp");
    if (platform === "instagram" && !enabled.instagram) setPlatform("whatsapp");
  }, [platform, enabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ name: name.trim(), platform });
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! p-0! gap-0! overflow-hidden border-none bg-white dark:bg-(--card-color) rounded-xl shadow-2xl">
        <DialogHeader className="sm:px-6 px-4 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Zap size={20} />
            </div>
            <div className="text-left rtl:text-right">
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">{editItem ? "Edit Message Flow" : "Create Message Flow"}</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-medium">{editItem ? "Update your message flow details" : "Start by giving your message flow a name and channel"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
 
        <form onSubmit={handleSubmit} className="sm:p-6 p-4 pt-3 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-slate-700 dark:text-gray-300">Message Flow Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Onboarding Follow-up" required disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) focus:border-primary" />
          </div>
 
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-700 dark:text-gray-300">Select Platform</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {filteredOptions.map((opt) => {
                const isSelected = platform === opt.id;
                return (
                  <Button
                    key={opt.id}
                    type="button"
                    disabled={isLoading || !!editItem}
                    onClick={() => setPlatform(opt.id)}
                    className={`group relative h-[95px] flex flex-col items-center justify-center text-center rounded-lg p-3 border transition-all duration-300 outline-none select-none ${isSelected
                      ? "border-primary hover:bg-primary/5 bg-primary/5 dark:bg-primary/10 shadow-md scale-[0.98]"
                      : "border-slate-200 dark:border-zinc-800 bg-slate-50/50 hover:bg-slate-50/50 dark:bg-(--dark-body) hover:border-primary/40 hover:scale-[1.02] active:scale-95"
                      }`}
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-sm transition-all duration-300 group-hover:scale-110 bg-gradient-to-br ${opt.gradient} text-white mb-2`}>
                      {opt.icon}
                    </div>
                    <span className={`text-xs font-bold transition-colors duration-300 ${isSelected ? "text-primary font-extrabold" : "text-slate-700 dark:text-zinc-300 " + opt.textHover}`}>
                      {opt.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
                        <Check size={10} className="stroke-[3]" />
                      </div>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 h-11 rounded-lg border-slate-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color) text-slate-600 dark:text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()} className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold active:scale-95 transition-all">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving…
                </>
              ) : editItem ? (
                "Save Changes"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SequenceFormModal;
