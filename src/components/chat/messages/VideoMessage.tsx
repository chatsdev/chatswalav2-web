import { getResolvedImageUrl } from "@/src/utils/image";
import { VideoMessageProps } from "@/src/types/components/chat";
import React from "react";
import BaseMessage from "./BaseMessage";

const VideoMessage: React.FC<VideoMessageProps> = ({ message, isWindowExpired }) => {
  const resolvedUrl = getResolvedImageUrl(message.fileUrl);

  return (
    <BaseMessage message={message} isWindowExpired={isWindowExpired}>
      <div className="flex flex-col gap-2">
        {message.fileUrl && (
          <div className="relative rounded-lg overflow-hidden min-h-37.5 min-w-50 border border-black/5 dark:border-white/5 bg-black/10">
            <video src={resolvedUrl} className="w-full h-auto max-h-75 object-cover" controls poster="" />
          </div>
        )}
        {message.content && <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[13.5px]">{message.content}</p>}
      </div>
    </BaseMessage>
  );
};

export default VideoMessage;
