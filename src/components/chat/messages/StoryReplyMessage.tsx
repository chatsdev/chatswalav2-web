import { TextMessageProps } from "@/src/types/components/chat";
import React from "react";
import BaseMessage from "./BaseMessage";
import Image from "next/image";

const StoryReplyMessage: React.FC<TextMessageProps> = ({ message, isWindowExpired }) => {
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

  const isEmojiOnly = (text: string | null) => {
    if (!text) return false;
    const emojiRegex = /^[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F1E0}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{3030}\u{2B50}\u{2B55}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}\u{FE0F}]+$/u;
    return emojiRegex.test(text.replace(/\s/g, ''));
  };

  const isReaction = isEmojiOnly(message.content);

  return (
    <BaseMessage message={message} isWindowExpired={isWindowExpired}>
      <div className="flex flex-col gap-2">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium pt-1">
          {isReaction ? "Reacted to story" : "Replied to story"}
        </div>

        {message.fileUrl && (
          <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 max-w-[200px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src={message.fileUrl}
              alt="Story"
              className="w-full object-cover"
              style={{ maxHeight: '300px' }}
              width={100}
              height={100}
              unoptimized
            />
          </div>
        )}

        {message.content && !isReaction && (
          <p className="whitespace-normal break-all leading-relaxed text-[12px] dark:text-white mt-1">
            {formatText(message.content)}
          </p>
        )}
        {message.content && isReaction && (
          <p className="text-[32px] leading-none mt-1">
            {message.content}
          </p>
        )}
      </div>
    </BaseMessage>
  );
};

export default StoryReplyMessage;
