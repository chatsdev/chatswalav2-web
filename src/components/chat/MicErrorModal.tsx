"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { MicOff, Settings, AlertCircle, Info } from "lucide-react";
import { MicErrorModalProps } from "@/src/types/components/chat";
import { useTranslation } from "react-i18next";

const MicErrorModal: React.FC<MicErrorModalProps> = ({ isOpen, onClose, errorType }) => {
  const { t } = useTranslation();
  const getErrorInfo = () => {
    switch (errorType) {
      case "no-device":
        return {
          title: t("mic_not_found_title"),
          description: t("mic_not_found_desc"),
          icon: <MicOff className="text-rose-500" size={48} />,
          advice: [t("mic_advice_plug_in"), t("mic_advice_switch"), t("mic_advice_refresh")],
        };
      case "permission-denied":
        return {
          title: t("mic_blocked_title"),
          description: t("mic_blocked_desc"),
          icon: <Settings className="text-amber-500" size={48} />,
          advice: [t("mic_advice_browser_settings"), t("mic_advice_reset_permissions"), t("mic_advice_exclusive_use")],
        };
      default:
        return {
          title: t("recording_error_title"),
          description: t("recording_error_desc"),
          icon: <AlertCircle className="text-blue-500" size={48} />,
          advice: [t("mic_advice_generic_refresh"), t("mic_advice_support"), t("mic_advice_contact_support")],
        };
    }
  };

  const info = getErrorInfo();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) flex flex-col p-0! overflow-hidden gap-0 max-h-[calc(100dvh-2rem)]">
        <DialogHeader className="flex flex-col items-center gap-4 pt-8 sm:px-6 px-4 shrink-0">
          <div className="p-4 bg-slate-50 dark:bg-(--dark-body) rounded-full">{info.icon}</div>
          <DialogTitle className="text-xl font-bold text-center">{info.title}</DialogTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center px-4">{info.description}</p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scrollbar sm:px-6 px-4 py-4">
          <div className="bg-slate-50 dark:bg-(--page-body-bg) rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3 text-slate-700 dark:text-slate-200">
              <Info size={16} className="text-primary" />
              <span className="text-sm font-semibold">{t("what_you_can_do")}</span>
            </div>
            <ul className="space-y-2">
              {info.advice.map((item, index) => (
                <li key={index} className="flex gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <span className="text-primary">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="sm:justify-center sm:px-6 px-4 pb-6 pt-2 shrink-0">
          <Button onClick={onClose} className="w-full sm:w-32 bg-primary hover:bg-primary/90 text-white font-bold h-11 rounded-lg">
            {t("got_it")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MicErrorModal;
