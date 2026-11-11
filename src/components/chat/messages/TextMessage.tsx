import { TextMessageProps } from "@/src/types/components/chat";
import React from "react";
import BaseMessage from "./BaseMessage";

const TextMessage: React.FC<TextMessageProps> = ({ message, isWindowExpired }) => {
  const formatText = (text: string | null) => {
    if (!text) return null;

    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const boldPattern = /\*(.*?)\*/g;
    const italicPattern = /_(.*?)_/g;

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

      const boldParts = part.split(boldPattern);
      return (
        <React.Fragment key={index}>
          {boldParts.map((boldPart, bIdx) => {
            if (bIdx % 2 === 1) {
              return <strong key={bIdx}>{boldPart}</strong>;
            }
            const italicParts = boldPart.split(italicPattern);
            return italicParts.map((italicPart, iIdx) => {
              if (iIdx % 2 === 1) {
                return <em key={iIdx}>{italicPart}</em>;
              }
              return italicPart;
            });
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <BaseMessage message={message} isWindowExpired={isWindowExpired}>
      <p className="whitespace-normal break-all leading-relaxed text-[14px] dark:text-white">
        {formatText(message.content)}
      </p>
    </BaseMessage>
  );
};

export default TextMessage;
