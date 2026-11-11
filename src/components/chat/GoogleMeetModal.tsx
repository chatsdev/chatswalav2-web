"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Input } from "@/src/elements/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { useListGoogleAccountsQuery } from "@/src/redux/api/googleApi";
import { GoogleMeetModalProps } from "@/src/types/components/chat";
import { ROUTES } from "@/src/constants/route";
import {
  Video,
  Loader2,
  Link2,
  CalendarRange,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const GoogleMeetModal: React.FC<GoogleMeetModalProps> = ({
  isOpen,
  onClose,
  onSend,
  isSending,
}) => {
  const { t } = useTranslation();
  const router = useRouter();

  // State values for meet details (initialized to defaults on mount)
  const [googleAccountId, setGoogleAccountId] = useState<string>("");

  const [startTime, setStartTime] = useState<string>(() => {
    const start = new Date(Date.now() + 5 * 60 * 1000);
    return new Date(start.getTime() - start.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });

  const [endTime, setEndTime] = useState<string>(() => {
    const start = new Date(Date.now() + 5 * 60 * 1000);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    return new Date(end.getTime() - end.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });

  // Query connected Google accounts
  const { data: accountsData, isLoading: isLoadingAccounts } =
    useListGoogleAccountsQuery(undefined, { skip: !isOpen });

  const accounts = useMemo(() => accountsData?.accounts || [], [accountsData]);

  // Derive the active selected account ID
  const selectedAccountId = useMemo(() => {
    if (googleAccountId) return googleAccountId;
    if (accounts.length === 0) return "";
    const firstActive =
      accounts.find((acc) => acc.status === "active") || accounts[0];
    return firstActive?._id || "";
  }, [googleAccountId, accounts]);

  const handleSend = async () => {
    if (!selectedAccountId || !startTime || !endTime) {
      toast.error(
        t("please_fill_all_fields", {
          defaultValue: "Please fill in all fields",
        }),
      );
      return;
    }

    const startMs = new Date(startTime).getTime();
    const endMs = new Date(endTime).getTime();

    if (endMs <= startMs) {
      toast.error(
        t("end_time_must_be_after_start", {
          defaultValue: "End date/time must be after the start date/time",
        }),
      );
      return;
    }

    try {
      await onSend({
        google_account_id: selectedAccountId,
        meet_start_time: new Date(startTime).toISOString(),
        meet_end_time: new Date(endTime).toISOString(),
      });
      onClose();
    } catch {
      // Error message is handled by the parent
    }
  };

  const handleRedirectToConnection = () => {
    onClose();
    router.push(ROUTES.GoogleAccount);
  };

  const isFormValid = !!selectedAccountId && !!startTime && !!endTime;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) max-h-[90vh] flex flex-col p-0! overflow-auto no-scrollbar gap-0 border dark:border-(--card-border-color)">
        <DialogHeader className="sm:p-6 p-4 pb-2 shrink-0">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Video className="text-primary" size={22} />
            {t("google_meet_setup", { defaultValue: "Set Google Meet" })}
          </DialogTitle>
        </DialogHeader>

        <div className="sm:px-6 px-4 py-4 space-y-4 pt-0! flex-1 overflow-y-auto no-scrollbar">
          {isLoadingAccounts ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-3">
              <Loader2 className="animate-spin text-primary" size={32} />
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {t("loading_accounts", {
                  defaultValue: "Loading Google accounts...",
                })}
              </p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-10 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-200 dark:border-neutral-800 animate-in fade-in duration-200">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-amber-500 dark:text-amber-400 rounded-full mb-3">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-md font-bold text-slate-950 dark:text-white mb-1.5">
                {t("google_account_required", {
                  defaultValue: "Connect Google Account",
                })}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
                {t("google_account_meet_note", {
                  defaultValue:
                    "First connect your Google account in settings to automatically generate and share Google Meet links with customers.",
                })}
              </p>
              <Button
                onClick={handleRedirectToConnection}
                className="flex items-center gap-2 text-white bg-primary hover:bg-primary/95 transition-all shadow-sm"
              >
                <Link2 size={16} />
                {t("go_to_connections", {
                  defaultValue: "Go to Google connection page",
                })}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {t("select_google_account", {
                    defaultValue: "Select Google Account",
                  })}
                </Label>
                <Select
                  value={selectedAccountId}
                  onValueChange={setGoogleAccountId}
                >
                  <SelectTrigger className="h-11! border-slate-200 dark:border-(--card-border-color) bg-transparent">
                    <SelectValue
                      placeholder={t("select_account", {
                        defaultValue: "Select Account",
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-(--page-body-bg) dark:border-(--card-border-color) z-9999">
                    {accounts.map((account) => (
                      <SelectItem
                        className="dark:hover:bg-(--table-hover)"
                        key={account._id}
                        value={account._id}
                      >
                        <span className="font-medium">{account.email}</span>
                        {account.status === "inactive" && (
                          <span className="ml-2 text-xs text-rose-500 font-semibold">
                            ({t("inactive")})
                          </span>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("start_date_time", {
                      defaultValue: "Start Date & Time",
                    })}
                  </Label>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-11! border-slate-200 dark:border-(--card-border-color) bg-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {t("end_date_time", { defaultValue: "End Date & Time" })}
                  </Label>
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-11! border-slate-200 dark:border-(--card-border-color) bg-transparent"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/10 rounded-lg border border-blue-100/50 dark:border-blue-950/20 flex items-start gap-2.5">
                <CalendarRange
                  className="text-blue-500 shrink-0 mt-0.5"
                  size={16}
                />
                <p className="text-sm text-blue-600/90 dark:text-blue-400 leading-normal font-medium">
                  {t("meet_instructions", {
                    defaultValue:
                      "This will automatically schedule a Google Calendar event on the selected account and insert a Google Meet link directly into your chat conversation.",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="sm:p-6 p-4! pt-4 gap-2 border-t dark:border-(--card-border-color) shrink-0 sm:flex-row flex-col">
          <Button
            variant="outline"
            className="h-11 sm:w-auto w-full"
            onClick={onClose}
            disabled={isSending}
          >
            {t("cancel")}
          </Button>
          {accounts.length > 0 && (
            <Button
              onClick={handleSend}
              disabled={!isFormValid || isSending}
              className="flex h-11 text-white items-center gap-2 sm:w-auto w-full bg-primary"
            >
              {isSending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Video size={16} />
              )}
              {t("generate_meet", { defaultValue: "Generate & Send" })}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleMeetModal;
