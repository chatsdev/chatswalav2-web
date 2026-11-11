import { Button } from "@/src/elements/ui/button";
import { CheckCircle2, RefreshCw } from "lucide-react";
import React from "react";
import { useUpdateChatStatusMutation } from "@/src/redux/api/chatApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ResolvedChatBannerProps } from "@/src/types/components/chat";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { updateSelectedChatStatus } from "@/src/redux/reducers/messenger/chatSlice";

const ResolvedChatBanner: React.FC<ResolvedChatBannerProps> = ({ contactId, phoneNumberId }) => {
  const { isCustom } = useChatTheme();
  const dispatch = useAppDispatch();
  const [updateStatus, { isLoading }] = useUpdateChatStatusMutation();
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const handleReopen = async () => {
    try {
      await updateStatus({
        contact_id: contactId,
        whatsapp_phone_number_id: phoneNumberId,
        status: "open",
      }).unwrap();
      dispatch(updateSelectedChatStatus("open"));
      toast.success("Chat reopened successfully");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reopen chat");
    }
  };

  return (
    <div className="p-4 px-6 border-t border-gray-200 dark:border-(--card-border-color) flex-wrap flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 85%)" } : {}}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full flex items-center justify-center" style={isCustom ? { backgroundColor: userSettingData?.theme_color == "null" ? "var(--light-primary)" : "color-mix(in srgb, var(--chat-theme-color), transparent 90%)", color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : { backgroundColor: "var(--primary-light)", color: "var(--primary)" }}>
          <CheckCircle2 size={24} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900 dark:text-white">This chat has been marked as resolved.</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">To start chatting again, please reopen this conversation.</p>
        </div>
      </div>

      <Button
        onClick={handleReopen}
        disabled={isLoading}
        className="text-white flex items-center gap-2 px-6 h-10 rounded-md shadow-lg transition-all active:scale-95"
        style={
          isCustom
            ? {
                backgroundColor: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)",
                boxShadow: `0 10px 15px -3px color-mix(in srgb, var(--chat-theme-color), transparent 80%)`,
              }
            : {}
        }
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
        <span className="text-xs font-medium tracking-widest">Reopen Chat</span>
      </Button>
    </div>
  );
};

export default ResolvedChatBanner;
