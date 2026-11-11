/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { Label } from "@/src/elements/ui/label";
import { useUpdateUserSettingsMutation } from "@/src/redux/api/settingsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { Loader2, X, Settings2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { QuickReplySettingsModalProps } from "@/src/types/replyMaterial";


const QuickReplySettingsModal = ({ isOpen, onClose }: QuickReplySettingsModalProps) => {
  const { t } = useTranslation();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation();
  const { userSetting } = useAppSelector((state) => state.setting);

  if (!isOpen) return null;

  const handleToggle = async (checked: boolean) => {
    try {
      await updateSettings({
        disable_admin_quick_reply: checked,
      }).unwrap();
      toast.success(t("settings_updated_successfully"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_update_settings"));
    }
  };

  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white dark:bg-(--card-color) rounded-lg shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-(--card-border-color) animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between sm:p-6 p-4 border-b border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings2 size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t("quick_reply_settings")}</h2>
              <p className="text-sm text-slate-500 dark:text-gray-400">{t("manage_quick_reply_preferences")}</p>
            </div>
          </div>
          <Button onClick={onClose} variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-(--table-hover)">
            <X size={16} />
          </Button>
        </div>

        {/* Body */}
        <div className="sm:p-6 p-4 space-y-6">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color)">
            <div className="space-y-1">
              <Label className="text-sm font-bold text-slate-900 dark:text-white cursor-pointer" htmlFor="disable-admin">
                {t("disable_admin_quick_reply")}
              </Label>
              <p className="text-xs text-slate-500 dark:text-gray-400 leading-relaxed">{t("disable_admin_quick_reply_desc")}</p>
            </div>
            <div className="flex items-center gap-2">
              {isUpdating && <Loader2 size={14} className="animate-spin text-primary" />}
              <Switch id="disable-admin" checked={userSetting?.data?.disable_admin_quick_reply || false} onCheckedChange={handleToggle} disabled={isUpdating} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/30 dark:bg-(--page-body-bg)/30 border-t border-slate-100 dark:border-(--card-border-color) flex justify-end">
          <Button onClick={onClose} className="bg-primary text-white font-bold h-10 px-6 rounded-lg">
            {t("done")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickReplySettingsModal;
