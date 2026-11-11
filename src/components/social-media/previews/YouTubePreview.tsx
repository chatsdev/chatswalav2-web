/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Video } from "lucide-react";
import { SocialAvatar } from "../SocialAvatar";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Button } from "@/src/elements/ui/button";
import { Attachment } from "@/src/types/components";

export function YouTubePreview({ account, caption, mediaList }: any) {
  const videoMedia = mediaList?.find((m: Attachment) => m.mimeType?.startsWith("video/") || m.fileUrl?.endsWith(".mp4"));
  const fallbackImage = mediaList?.find((m: Attachment) => m.mimeType?.startsWith("image/") || m.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i));
  return (
    <Card className="border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-white dark:bg-(--card-color) shadow-none max-w-md mx-auto">
      <CardContent className="p-4">
        {/* Video Player Area */}
        <div className="relative aspect-video w-full bg-slate-950 dark:bg-(--dark-body) flex items-center justify-center">
          {videoMedia ? (
            <video
              src={videoMedia.fileUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              muted
              loop
            />
          ) : fallbackImage ? (
            <img
              src={fallbackImage.fileUrl}
              className="w-full h-full object-cover"
              alt=""
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-slate-500 text-center">
              <Video className="w-10 h-10 mb-2 animate-pulse text-slate-400" />
              <p className="text-sm dark:text-slate-600 font-bold">Select Video File</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[200px]">YouTube posts require video files to show live video playback.</p>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="pt-3 space-y-3.5">
          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 break-all line-clamp-4">
            {caption || "Your Video Title will appear here..."}
          </h4>
          <div className="flex items-center gap-3">
            <SocialAvatar
              src={account?.profile_picture}
              name={account?.account_name || "YouTube Channel"}
              className="w-9 h-9 rounded-full object-cover"
              fallbackClassName="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 uppercase"
            />
            <div className="flex-1">
              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {account?.account_name || "YouTube Channel"}
              </h5>
              <p className="text-xs text-slate-400 mt-0.5">
                0 subscribers
              </p>
            </div>
            <Button className="bg-[#CC0000] text-white hover:bg-[#990000] rounded-full h-8 px-4 text-[10px] font-bold border-none">
              Subscribe
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
