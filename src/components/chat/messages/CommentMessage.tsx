import { TextMessageProps } from "@/src/types/components/chat";
import React from "react";
import BaseMessage from "./BaseMessage";
import { MessageSquare } from "lucide-react";

const CommentMessage: React.FC<TextMessageProps> = ({ message, isWindowExpired }) => {
  const formatText = (text: string | null) => {
    if (!text) return null;

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlPattern);

    return parts.map((part, index) => {
      if (part.match(urlPattern)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500! hover:underline break-all transition-colors"
          >
            {part}
          </a>
        );
      }
      return <React.Fragment key={index}>{part}</React.Fragment>;
    });
  };

  return (
    <BaseMessage message={message} isWindowExpired={isWindowExpired}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 py-2 pt-1 mb-1 w-full text-[10px] font-semibold">
          <MessageSquare size={12} className="opacity-70" />
          <span>Post Comment</span>
        </div>
        <p className="whitespace-normal break-all leading-relaxed text-[12px] dark:text-white">
          {formatText(message.content)}
        </p>
      </div>
    </BaseMessage>
  );
};

export default CommentMessage;
