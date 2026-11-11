import Images from "@/src/shared/Image";
import { ChatMessage, StickerMessageProps } from "@/src/types/components/chat";
import { ImageOff } from "lucide-react";
import React from "react";
import BaseMessage from "./BaseMessage";



const StickerMessage: React.FC<StickerMessageProps> = ({ message, isWindowExpired }) => {
  return (
    <BaseMessage message={message} isWindowExpired={isWindowExpired} isTransparent={!message.fileUrl ? false : true}>
      <div className="flex flex-col gap-1">
        {!message.fileUrl ? (
          <div className="flex items-center gap-2 py-1">
            <ImageOff size={16} className="text-slate-400" />
            <span className="text-[13px] text-slate-400 font-medium">Sticker unavailable</span>
          </div>
        ) : (
          <div className="relative overflow-hidden max-h-36 max-w-36 rounded-md">
            <Images
              src={message.fileUrl}
              alt="Sticker"
              width={144}
              height={144}
              className="w-full h-full object-contain"
              unoptimized
            />
          </div>
        )}
      </div>
    </BaseMessage>
  );
};

export default StickerMessage;
