/* eslint-disable @typescript-eslint/no-explicit-any */
import { COMMON_EMOJIS } from "@/src/data/chat";
import { Button } from "@/src/elements/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { cn } from "@/src/lib/utils";
import { useSendMessageMutation } from "@/src/redux/api/chatApi";
import { useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
import { MessageReactionPickerProps } from "@/src/types/components/chat";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Plus, Smile } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useState } from "react";
import { toast } from "sonner";

const MessageReactionPicker: React.FC<MessageReactionPickerProps> = ({ message, className, isOutgoing, isBaileys, isWindowExpired }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [sendMessage] = useSendMessageMutation();
  const { selectedChat, selectedPhoneNumberId } = useAppSelector((state: RootState) => state.chat);
  const { theme, resolvedTheme } = useTheme();

  if (isBaileys || isWindowExpired) return null;

  const pickerTheme = (resolvedTheme || theme) === "dark" ? Theme.DARK : Theme.LIGHT;

  const handleReact = async (emoji: string) => {
    if (!selectedChat || !selectedPhoneNumberId) return;

    if (message.id.startsWith("temp-") && !message.wa_message_id) {
      toast.error("Message is still sending, please wait a moment.");
      return;
    }

    const ourId = isOutgoing ? message.sender.id : message.recipient.id;
    const alreadyReactedWithThis = message.reactions?.some((r) => r.emoji === emoji && r.users?.some((u) => u.id === ourId || u.id === "current-user"));

    try {
      await sendMessage({
        contact_id: selectedChat.contact.id,
        whatsapp_phone_number_id: selectedPhoneNumberId,
        messageType: "reaction",
        type: "reaction",
        provider: "business_api",
        reactionEmoji: alreadyReactedWithThis ? "" : emoji,
        reactionMessageId: message.wa_message_id || message.id,
      }).unwrap();
      setIsExpanded(false);
      setIsPickerOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.error || error?.message || "Failed to send reaction");
    }
  };

  
  const displayEmojis = typeof window !== "undefined" && window.innerWidth < 640 ? COMMON_EMOJIS.slice(0, 4) : COMMON_EMOJIS;

  return (
    <div className={cn("relative flex items-center group/reaction h-full", className)} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
      <div className={cn("flex items-center bg-white dark:bg-(--page-body-bg) border border-neutral-400 dark:border-(--card-border-color) rounded-full transition-all duration-500 ease-out overflow-hidden h-8 px-1", isExpanded ? "w-40 sm:w-64 opacity-100" : "w-8 opacity-0 group-hover/bubble:opacity-100")}>
        {!isExpanded ? (
          <div className="flex items-center justify-center w-6 h-6 m-auto text-slate-400 hover:text-primary cursor-pointer transition-colors">
            <Smile size={18} />
          </div>
        ) : (
          <div className="h-9 flex items-center gap-1 sm:gap-2 animate-in fade-in zoom-in-95 duration-300 w-full overflow-hidden">
            {displayEmojis.map((emoji, index) => (
              <Button key={emoji} onClick={(e) => { e.stopPropagation(); handleReact(emoji); }} className="hover:scale-110 bg-[unset]! p-0! transition-transform duration-200 text-lg sm:text-xl leading-none origin-center hover:drop-shadow-md" style={{ animationDelay: `${index * 40}ms` }}>
                {emoji}
              </Button>
            ))}
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

            <Popover open={isPickerOpen} onOpenChange={setIsPickerOpen}>
              <PopoverTrigger asChild>
                <Button onClick={() => setIsPickerOpen(true)} className="w-6 h-6 bg-[unset]! p-0! flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 rounded-full transition-all group/plus">
                  <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" align={isOutgoing ? "end" : "start"} className="p-0 border-none bg-transparent shadow-none w-auto z-1002" sideOffset={8}>
                <EmojiPicker onEmojiClick={(emojiData) => handleReact(emojiData.emoji)} autoFocusSearch={false} theme={pickerTheme} width={320} height={400} lazyLoadEmojis={true} />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageReactionPicker;
