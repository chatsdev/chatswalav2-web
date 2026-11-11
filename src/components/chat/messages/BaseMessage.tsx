/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/src/lib/utils";
import { useSendMessageMutation } from "@/src/redux/api/chatApi";
import { useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
import { BaseMessageProps } from "@/src/types/components/chat";
import { maskSensitiveData } from "@/src/utils/masking";
import { safeParseDate } from "@/src/utils/safeDate";
import { AlertCircle, Check, CheckCheck, Clock, FileText, Image as ImageIcon, Mic, Video } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import MessageActions from "./MessageActions";
import MessageInfoModal from "./MessageInfoModal";
import MessageReactionPicker from "./MessageReactionPicker";
import MessageTranslation from "./MessageTranslation";
import PlanFeature from "@/src/shared/PlanFeature";

const StatusIcon = ({ status }: { status: string | null }) => {
  switch (status) {
    case "pending":
      return <Clock size={12} className="text-slate-400" />;
    case "sent":
      return <Check size={12} className="text-slate-400" />;
    case "delivered":
      return <CheckCheck size={12} className="text-slate-400" />;
    case "read":
      return <CheckCheck size={12} className="text-blue-500" />;
    case "failed":
      return <AlertCircle size={12} className="text-rose-500" />;
    default:
      return <Check size={12} className="text-slate-400" />;
  }
};

const BaseMessage: React.FC<BaseMessageProps> = ({ message, children, isWindowExpired, isTransparent }) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const { user } = useAppSelector((state) => state.auth);
  const { selectedChat, selectedPhoneNumberId } = useAppSelector((state: RootState) => state.chat);
  const [sendMessage] = useSendMessageMutation();
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const isAgent = user?.role === "agent";
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const dateObj = safeParseDate(message.createdAt);
  const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const isOutgoing = message?.direction === "outbound";
  const showSenderName = !isOutgoing;

  const handleRemoveReaction = async () => {
    if (!selectedChat || !selectedPhoneNumberId || !message.wa_message_id) return;

    try {
      await sendMessage({
        contact_id: selectedChat.contact.id,
        whatsapp_phone_number_id: selectedPhoneNumberId,
        messageType: "reaction",
        type: "reaction",
        provider: "business_api",
        reactionEmoji: "",
        reactionMessageId: message.wa_message_id,
      }).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.error || error?.message || "Failed to remove reaction");
    }
  };

  return (
    <>
      <div id={`message-${message.id}`} className={cn("group/bubble flex w-full mb-0.5 px-3 sm:px-4", isOutgoing ? "justify-end" : "justify-start")}>
        <div className={cn("relative max-w-[85%] sm:max-w-[70%] lg:max-w-[60%] group flex flex-col", isOutgoing ? "items-end" : "items-start")}>
          {!isOutgoing && showSenderName && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[13px] font-semibold" style={{ color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" }}>
                {isAgent && user?.is_phoneno_hide ? "Customer" : maskSensitiveData(message.sender.name, "phone", is_demo_mode)}
              </span>
            </div>
          )}

          <div className="relative flex items-start">
            <div className={cn("absolute z-50 whitespace-nowrap transition-all duration-300", "sm:top-1/2 sm:-translate-y-1/2", isOutgoing ? "sm:end-full sm:me-3" : "sm:start-full sm:ms-3", "-top-5 flex items-center gap-1 sm:flex-row", isOutgoing ? "end-0 flex-row" : "start-0 flex-row-reverse")}>
              <PlanFeature feature="ai_prompts">
                {!isOutgoing && message.content && <MessageTranslation messageText={message.content || ""} onTranslated={setTranslatedText} />}
              </PlanFeature>
              <MessageReactionPicker message={message} isOutgoing={isOutgoing} isBaileys={isBaileys} isWindowExpired={isWindowExpired} />
              <MessageActions message={message} isOutgoing={isOutgoing} onInfoClick={() => setIsInfoModalOpen(true)} isBaileys={isBaileys} isWindowExpired={isWindowExpired} />
            </div>

            <div
              className={cn(
                "relative min-w-15 dark:bg-(--page-body-bg)!",
                isTransparent
                  ? "bg-transparent shadow-none border-none p-0"
                  : cn("shadow-sm", isOutgoing ? "px-4 py-1.5 rounded-lg rounded-te-none border border-black/5" : "px-4 py-1.5 rounded-lg rounded-ts-none border border-black/5")
              )}
              style={
                isTransparent
                  ? { backgroundColor: "transparent", color: "inherit" }
                  : {
                      backgroundColor: isOutgoing ? (userSettingData?.user_bubble_color == "null" ? "var(--chat-user-bg)" : "var(--chat-user-bubble)") : userSettingData?.contact_bubble_color == "null" ? "var(--light-background)" : "var(--chat-contact-bubble)",
                      color: isOutgoing ? (userSettingData?.user_text_color == "null" ? "text-slate-800" : "var(--chat-user-text)") : userSettingData?.contact_text_color == "null" ? "text-slate-800" : "var(--chat-contact-text)",
                    }
              }
            >
              <div className="w-full">
                {message.reply_message && (
                  <div
                    className={cn(`mb-1.5 p-2 rounded-lg border-s-4 text-xs cursor-pointer hover:opacity-80 transition-opacity`, isOutgoing ? "bg-black/5 dark:bg-black/20" : "bg-white/60 dark:bg-black/30")}
                    style={{ borderColor: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" }}
                    onClick={() => {
                      const el = document.getElementById(`message-${message.reply_message?.id}`);
                      el?.scrollIntoView({ behavior: "smooth", block: "center" });
                      el?.classList.add("bg-primary/20", "dark:bg-primary/40", "transition-colors", "duration-500", "py-4");
                      setTimeout(() => {
                        el?.classList.remove("bg-primary/20", "dark:bg-primary/40", "transition-colors", "duration-500", "py-4");
                      }, 2000);
                    }}
                  >
                    <div className="font-bold text-[10px] uppercase mb-0.5" style={{ color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" }}>
                      {message.reply_message.sender.name || "User"}
                    </div>
                    <div className="flex items-center gap-1.5 opacity-70 italic text-[11px]">
                      {message.reply_message.messageType === "image" && <ImageIcon size={10} />}
                      {message.reply_message.messageType === "video" && <Video size={10} />}
                      {message.reply_message.messageType === "audio" && <Mic size={10} />}
                      {message.reply_message.messageType === "document" && <FileText size={10} />}
                      <p className="truncate break-all whitespace-normal dark:text-white">{message.reply_message.content}</p>
                    </div>
                  </div>
                )}
                <div className={cn("w-full text-[14px] leading-normal", message.messageType === "text" ? "pe-5 pb-2" : "")}>
                  {children}
                  {translatedText && (
                    <div className="mt-2 pt-2 border-t border-slate-200 dark:border-(--card-border-color)">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">AI Translation</span>
                      </div>
                      <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[14px] text-slate-700 dark:text-gray-500">{translatedText}</p>
                    </div>
                  )}
                </div>

                <div className={cn("flex items-center gap-1 mt-0.5 justify-end h-3", isOutgoing ? "text-slate-500" : "text-slate-400 dark:text-slate-500")}>
                  <span className="text-[10px] tabular-nums dark:text-gray-400">{time}</span>
                  {isOutgoing && <StatusIcon status={message.wa_status || message.delivery_status} />}
                </div>
              </div>

              {message.reactions && message.reactions.length > 0 && (
                <div className={cn("absolute -bottom-3 start-2 z-10 flex flex-wrap gap-1")}>
                  {message.reactions.map((reaction, i) => {
                    const ourId = isOutgoing ? message.sender.id : message.recipient.id;
                    const hasUserReacted = reaction.users?.some((u) => u.id === ourId || u.id === "current-user");

                    return (
                      <div
                        key={i}
                        className={cn("flex items-center gap-1 bg-white dark:bg-(--dark-body) border border-slate-200 dark:border-(--card-border-color) rounded-lg px-1.5 py-1.5 shadow-md text-[14px] animate-in zoom-in-50 duration-200 hover:scale-110 transition-transform", hasUserReacted ? "cursor-pointer border-primary/50" : "cursor-default")}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveReaction();
                        }}
                        title={reaction.users?.map((u) => u.name).join(", ") || ""}
                      >
                        <span className="leading-none">{reaction.emoji}</span>
                        {reaction.users && reaction.users.length > 1 && <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">{reaction.users.length}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MessageInfoModal message={message} open={isInfoModalOpen} onOpenChange={setIsInfoModalOpen} />
    </>
  );
};

export default BaseMessage;
