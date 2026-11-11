/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import dynamic from "next/dynamic";
import { Sparkles, Smile } from "lucide-react";
import { Label } from "@/src/elements/ui/label";
import { Button } from "@/src/elements/ui/button";
import { Textarea } from "@/src/elements/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";

// Dynamically import emoji picker to avoid SSR/hydration issues
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface StepCaptionProps {
  caption: string;
  setCaption: (cap: string) => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: (show: boolean) => void;
  handleAddEmoji: (emojiData: any) => void;
  emojiRef?: React.RefObject<HTMLDivElement | null>;
  onWriteWithAI: () => void;
}

export function StepCaption({
  caption,
  setCaption,
  showEmojiPicker,
  setShowEmojiPicker,
  handleAddEmoji,
  emojiRef,
  onWriteWithAI
}: StepCaptionProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 justify-between items-center">
        <div>
          <Label className="text-sm font-semibold text-slate-800 dark:text-gray-200">
            Write Post Caption
          </Label>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
            Compose your message. Use emojis and AI assistance if needed.
          </p>
        </div>
      </div>
      <div className="relative border border-slate-200/80 dark:border-(--card-border-color) rounded-lg bg-white dark:bg-(--page-body-bg) focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary transition-all overflow-hidden">
        <Textarea
          placeholder="What are we sharing today? Add links, text and emojis..."
          className="w-full min-h-[180px] rounded-[unset] p-5 bg-transparent border-none focus-visible:ring-0 text-sm placeholder:text-slate-400/85 dark:text-gray-150 resize-none font-medium leading-relaxed custom-scrollbar"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        <div className="flex justify-between items-center px-5 py-3 border-t border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) rounded-b-lg">
          <div className="flex items-center gap-2">
            <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="p-2 hover:bg-slate-200/50 dark:hover:bg-(--table-hover) rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
                  title="Add emoji"
                >
                  <Smile size={18} />
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                sideOffset={10}
                className="w-auto p-0 border-none shadow-2xl rounded-2xl overflow-hidden z-[500]"
              >
                <EmojiPicker 
                  onEmojiClick={handleAddEmoji} 
                  theme={document.documentElement.classList.contains("dark") ? "dark" as any : "light" as any}
                  autoFocusSearch={false}
                  previewConfig={{ showPreview: false }}
                  skinTonesDisabled
                  searchPlaceHolder="Search emoji..."
                  width={350}
                  height={400}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-(--dark-body) px-2.5 py-1 rounded-lg">
              {caption.length} characters
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

