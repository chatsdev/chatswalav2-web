"use client";

import { Button } from "@/src/elements/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { useAppSelector } from "@/src/redux/hooks";
import { useTranslation } from "react-i18next";
import { ProfileClearChatProps } from "@/src/types/components/chat";



const ProfileClearChat = ({ onClearChat, isLoading }: ProfileClearChatProps) => {
  const { t } = useTranslation();
  const { isCustom } = useChatTheme();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const handleConfirmClear = async () => {
    try {
      await onClearChat();
    } finally {
      setIsConfirmOpen(false);
    }
  };

  return (
    <div
      className="dark:border-none dark:bg-(--table-hover)! border-b border-gray-100 dark:border-(--card-border-color) p-5 space-y-4 mb-0"
      style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 95%)" } : {}}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
          <div
            className="p-1.5 rounded-lg"
            style={
              isCustom
                ? {
                    backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 90%)",
                    color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)",
                  }
                : {}
            }
          >
            <Trash2 size={18} />
          </div>
          <span>{t("clear_chat", { defaultValue: "Clear Chat" })}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs text-slate-500 dark:text-neutral-400 leading-relaxed">
          {t("clear_chat_description", {
            defaultValue: "Permanently delete all messages in this conversation. This action cannot be undone.",
          })}
        </p>
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => setIsConfirmOpen(true)}
          className="w-full mt-2 border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 hover:text-red-700 transition-all font-semibold rounded-lg h-9 text-xs"
        >
          <Trash2 size={14} className="mr-1.5" />
          {t("clear_chat_button", { defaultValue: "Clear Chat History" })}
        </Button>
      </div>

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        isLoading={isLoading}
        title={t("clear_chat_confirm_title", { defaultValue: "Clear Chat History?" })}
        subtitle={t("clear_chat_confirm_subtitle", {
          defaultValue: "Are you sure you want to delete all messages in this conversation? All text and media history will be permanently lost.",
        })}
        confirmText={t("clear_chat_confirm_action", { defaultValue: "Clear All" })}
        variant="danger"
      />
    </div>
  );
};

export default ProfileClearChat;
