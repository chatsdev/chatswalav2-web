"use client";

import { Button } from "@/src/elements/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import EmojiPickerReact, { Theme } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { useAppSelector } from "@/src/redux/hooks";
import { EmojiPickerProps } from "@/src/types/components/chat";



const EmojiPicker = ({ onEmojiSelect }: EmojiPickerProps) => {
  const { theme } = useTheme();
  const { isCustom } = useChatTheme();
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="
          bg-gray-100!
          hover:bg-gray-100!
            dark:hover:bg-(--table-hover)!
            rounded-lg 
            dark:bg-(--page-body-bg)!
            dark:text-gray-400
            transition-all 
            duration-200 
            hover:scale-110 
            active:scale-95
          "
          style={
            isCustom
              ? {
                color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)",
                backgroundColor: "transparent",
              }
              : {}
          }
          onMouseEnter={(e) => {
            if (isCustom) {
              e.currentTarget.style.backgroundColor = "color-mix(in srgb, var(--chat-theme-color), transparent 90%)";
            } else {
              e.currentTarget.style.backgroundColor = "";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "";
          }}
        >
          <Smile size={22} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={10}
        className="
          w-75
          p-0
          rounded-lg
          border
          border-gray-200
          dark:border-(--card-border-color)
          bg-white
          dark:bg-(--card-color)
          shadow-2xl
        "
      >
        <EmojiPickerReact className="dark:bg-(--page-body-bg)! dark:border-(--card-border-color)!" theme={(theme === "dark" || theme === "system" ? "dark" : "light") as Theme} onEmojiClick={(emojiData) => onEmojiSelect(emojiData.emoji)} autoFocusSearch={false} lazyLoadEmojis previewConfig={{ showPreview: false }} skinTonesDisabled searchPlaceHolder="Search emoji..." width="100%" height={420} />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
