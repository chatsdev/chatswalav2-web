import { getResolvedImageUrl } from "@/src/utils/image";
import { AudioMessageProps } from "@/src/types/components/chat";
import React from "react";
import BaseMessage from "./BaseMessage";

const AudioMessage: React.FC<AudioMessageProps> = ({ message, isWindowExpired }) => {
  const resolvedUrl = getResolvedImageUrl(message.fileUrl);

  return (
    <BaseMessage message={message} isWindowExpired={isWindowExpired}>
      <div className="flex flex-col gap-2 w-full min-w-[200px] sm:min-w-[350px]">
        {message.fileUrl && (
          <div className="bg-slate-50 dark:bg-(--card-color) rounded-lg p-3 border border-slate-100 dark:border-(--card-border-color)">
            <audio
              src={resolvedUrl}
              controls
              className="w-full h-10 custom-audio-player"
            />
          </div>
        )}
        {message.content && (
          <p className="px-1 whitespace-pre-wrap wrap-break-word font-medium leading-relaxed text-[13px] text-slate-700 dark:text-slate-300">
            {message.content}
          </p>
        )}
      </div>
    </BaseMessage>
  );
};

export default AudioMessage;
