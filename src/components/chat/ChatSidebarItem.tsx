/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/src/elements/ui/badge";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import {
  ChatSidebarItemProps
} from "@/src/types/components/chat";
import { getInitials } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { CircleCheck, Pin } from "lucide-react";
import Image from "next/image";
import React from "react";
import ChatListItemDropdown from "./ChatListItemDropdown";

const ChatSidebarItem: React.FC<ChatSidebarItemProps> = ({
  chat,
  isSelected,
  isSelectionMode,
  selectedChatId,
  isAgent,
  user,
  app_name,
  selectedPhoneNumberId,
  onSelect,
  onToggleSelection,
  onTogglePin,
}) => {
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const { isCustom } = useChatTheme();
  const { isFeatureEnabled } = useFeatureAccess();
  const contact = chat.contact;
  const lastMessage = chat.lastMessage;
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;
  const finalColor =
    userSettingData?.theme_color == "null"
      ? "var(--primary)"
      : "var(--chat-theme-color)";

  let parsedLocation: any;
  if (lastMessage.messageType === "location" && lastMessage.content) {
    try {
      parsedLocation = JSON.parse(lastMessage.content);
    } catch (e) {
      console.error("Failed to parse location content", e);
    }
  }

  const getMessagePreview = () => {
    if (!lastMessage || !lastMessage.id) return "No messages yet";

    if (lastMessage.messageType === "location") {
      return parsedLocation?.address || "Location";
    }

    if (lastMessage.content) {
      return lastMessage.content;
    }

    switch (lastMessage.messageType) {
      case "template":
        return "Template Message";
      case "image":
        return "📷 Photo";
      case "video":
        return "🎥 Video";
      case "audio":
        return "🎵 Audio";
      case "document":
        return "📄 Document";
      case "sticker":
        return "Sticker";
      case "video_note":
        return "🎥 Video Note";
      case "interactive":
        return "Interactive Message";
      case "poll":
        return "📊 Poll";
      case "reaction":
        return "Reaction";
      default:
        return "No messages yet";
    }
  };

  return (
    <div
      onClick={() =>
        isSelectionMode ? onToggleSelection(contact.id) : onSelect(chat)
      }
      className={cn(
        "group p-2 cursor-pointer rounded-lg transition-all border-s hover:bg-slate-50 dark:hover:bg-(--table-hover) dark:bg-(--page-body-bg)! dark:[@media(max-width:991px)]:bg-(--card-color) relative",
        selectedChatId === contact.id
          ? userSettingData?.theme_color !== "null"
            ? "border-primary"
            : "bg-(--light-primary) dark:bg-(--dark-body) border-primary"
          : "border-transparent bg-gray-50",
        isSelectionMode && isSelected
          ? "ring-1 ring-primary ring-inset bg-light-primary dark:bg-primary/10"
          : "",
      )}
      style={
        isCustom
          ? {
              backgroundColor:
                selectedChatId === contact.id &&
                userSettingData?.theme_color !== "null"
                  ? "color-mix(in srgb, var(--chat-theme-color), transparent 93%)"
                  : undefined,
              borderColor:
                selectedChatId === contact.id ? finalColor : undefined,
              ...(isSelectionMode && isSelected
                ? {
                    ringColor: finalColor,
                    backgroundColor: userSettingData?.theme_color
                      ? "color-mix(in srgb, var(--chat-theme-color), transparent 90%)"
                      : "",
                  }
                : {}),
            }
          : {}
      }
    >
      {!isSelectionMode && (
        <div
          onClick={(e) => onTogglePin(e, chat)}
          className={cn(
            "absolute inset-s-0.5 top-0.5 z-10 p-1 rounded-full transition-all bg-slate-200 rotate-45",
            chat.is_pinned
              ? "opacity-100 flex"
              : "text-slate-400 opacity-0 group-hover:opacity-100 hidden group-hover:flex hover:bg-slate-100 dark:hover:bg-(--dark-body)",
          )}
          style={chat.is_pinned && isCustom ? { color: finalColor } : {}}
        >
          <Pin size={13} className={chat.is_pinned ? "fill-current" : ""} />
        </div>
      )}

      <div className="flex gap-3">
        {isSelectionMode ? (
          <div className="flex items-center justify-center shrink-0 w-10">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onToggleSelection(contact.id)}
              className="h-5 w-5 rounded-md border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <div className="relative shrink-0">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold border border-slate-100 dark:border-(--card-border-color) overflow-hidden"
              style={{ backgroundColor: finalColor }}
            >
              {contact.avatar ? (
                <Image
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                  unoptimized
                />
              ) : (
                getInitials(app_name || "W")
              )}
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5 ms-0">
          <div className="flex justify-between items-center pe-2">
            <div className="flex items-center gap-2 truncate">
              <h3
                className={cn(
                  "font-semibold truncate text-sm",
                  selectedChatId === contact.id
                    ? ""
                    : "text-slate-900 dark:text-white",
                )}
                style={
                  selectedChatId === contact.id ? { color: finalColor } : {}
                }
              >
                {isAgent && user?.is_phoneno_hide
                  ? "Customer"
                  : maskSensitiveData(contact.number, "phone", is_demo_mode)}
              </h3>
              {contact.chat_status === "resolved" && (
                <Badge className="h-4 px-1.5 text-[8px] bg-[var(--primary-opacity-20)] text-primary-dark border-[var(--primary-opacity-30)] dark:bg-primary/10 dark:text-primary dark:border-primary/20 font-bold uppercase tracking-tighter">
                  Resolved
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {!isSelectionMode && (
                <>
                  <span
                    className={cn(
                      "text-[11px] whitespace-nowrap",
                      lastMessage.unreadCount && lastMessage.unreadCount !== "0"
                        ? "text-primary font-bold"
                        : "text-slate-500 dark:text-gray-400",
                    )}
                  >
                    {lastMessage.createdAt
                      ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Now"}
                  </span>
                  <ChatListItemDropdown
                    contactId={contact.id}
                    contactName={contact.name}
                    contactNumber={contact.number}
                    phoneNumberId={selectedPhoneNumberId}
                    isSnoozed={chat.is_snoozed}
                  />
                </>
              )}
              {isSelectionMode && isSelected && (
                <div className="flex items-center gap-1">
                  <CircleCheck size={14} style={{ color: finalColor }} />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center gap-2">
            <p
              className={cn(
                "text-xs truncate max-w-45",
                lastMessage.unreadCount && lastMessage.unreadCount !== "0"
                  ? "text-slate-900 dark:text-white font-medium"
                  : "text-slate-500 dark:text-gray-500",
              )}
            >
              {getMessagePreview()}
            </p>
            {lastMessage.unreadCount && lastMessage.unreadCount !== "0" && (
              <span
                className="flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] font-bold text-white rounded-full shrink-0"
                style={{ backgroundColor: finalColor }}
              >
                {lastMessage.unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
      {isFeatureEnabled("tags") &&
        contact.labels &&
        contact.labels.length > 0 && (
          <div className="flex mt-3 ms-2 gap-2 flex-wrap">
            {contact.labels.map((label: any, idx: number) => (
              <Badge
                key={idx}
                variant="secondary"
                className="py-1 px-2.5 rounded-lg border-rose-100 bg-rose-50 text-rose-500 font-medium flex items-center gap-1.5"
                style={
                  label.color
                    ? {
                        backgroundColor: `${label.color}15`,
                        color: label.color,
                        borderColor: label.color,
                      }
                    : undefined
                }
              >
                {label.label}
              </Badge>
            ))}
          </div>
        )}
    </div>
  );
};

export default ChatSidebarItem;
