import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { useAppSelector } from "@/src/redux/hooks";
import PlanFeature from "@/src/shared/PlanFeature";
import { ExpiredWindowBannerProps } from "@/src/types/components/chat";
import { LayoutTemplate, Lock, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ExpiredWindowBanner: React.FC<ExpiredWindowBannerProps> = ({
  contactId,
  isAgent,
  isNew = false,
}) => {
  const { isCustom } = useChatTheme();
  const router = useRouter();
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const handleRedirect = () => {
    if (isAgent) return;
    router.push(
      `${ROUTES.MessageCampaignsAdd}?contact_id=${contactId}&redirect_to=${ROUTES.WAChat}`,
    );
  };

  return (
    <div
      className="p-2 px-5 border-t border-gray-200 dark:bg-(--card-color)! dark:border-(--card-border-color) flex-wrap flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500"
      style={
        isCustom
          ? {
              backgroundColor:
                "color-mix(in srgb, var(--chat-theme-color), transparent 85%)",
            }
          : {}
      }
    >
      <div className="">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 pb-1">
          {isNew ? (
            <Sparkles
              size={16}
              style={
                isCustom
                  ? {
                      color:
                        userSettingData?.theme_color == "null"
                          ? "var(--primary)"
                          : "var(--chat-theme-color)",
                    }
                  : {}
              }
            />
          ) : (
            <Lock size={16} />
          )}
          <p className="text-sm font-medium">
            {isNew
              ? "Start a new conversation"
              : "The 24-hour service window has closed."}
          </p>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-md pb-2">
          {isNew
            ? "To begin chatting, you must first send a template message."
            : "To resume the conversation, you must send a template message."}
          {isAgent
            ? " Please contact an administrator to initiate a campaign."
            : " Select a template to re-engage with the customer."}
        </p>
      </div>
      <PlanFeature feature="template_bots">
        {!isAgent ? (
          <Button
            onClick={handleRedirect}
            className="text-white flex items-center gap-2 px-6 h-10 rounded-md shadow-lg transition-all active:scale-95"
            style={
              isCustom
                ? {
                    backgroundColor:
                      userSettingData?.theme_color == "null"
                        ? "var(--primary)"
                        : "var(--chat-theme-color)",
                    boxShadow:
                      "0 10px 15px -3px color-mix(in srgb, var(--chat-theme-color), transparent 80%)",
                  }
                : {}
            }
          >
            <LayoutTemplate size={18} />
            <span className="text-xs font-medium tracking-widest">
              Send Template
            </span>
          </Button>
        ) : (
          <div className="px-6 py-2.5 rounded-xl bg-slate-200 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest border border-slate-300 dark:border-white/10 opacity-70 cursor-not-allowed">
            Campaign Access Restricted
          </div>
        )}
      </PlanFeature>
    </div>
  );
};

export default ExpiredWindowBanner;
