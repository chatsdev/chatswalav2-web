/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { InstagramStoryPreviewProps } from "@/src/types/facebook";
import {
  ChevronRight,
  EllipsisVertical,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  PlayCircle,
  Send,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export const InstagramStoryPreview: React.FC<InstagramStoryPreviewProps> = ({
  ad,
  videoUrl,
  imageUrl,
  isVideo,
}) => {
  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px] h-[480px] sm:h-[580px] bg-black rounded-3xl overflow-hidden relative shadow-2xl lg:scale-90 origin-top border-4 border-slate-900 dark:border-(--card-border-color)">
      <div className="absolute inset-0 flex items-center justify-center bg-slate-900 dark:bg-(--dark-body)">
        {isVideo ? (
          videoUrl ? (
            <video
              src={videoUrl}
              poster={imageUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
            />
          ) : (
            <PlayCircle size={48} className="text-slate-700" />
          )
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            className="w-full h-full object-cover"
            alt="Story"
            width={400}
            height={800}
            unoptimized
          />
        ) : (
          <ImageIcon size={48} className="text-slate-700" />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
      </div>

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-300 ring-2 ring-pink-500 dark:bg-(--dark-body)" />
          <div className="flex flex-col">
            <span className="text-xs font-black text-white leading-none">
              Your Brand
            </span>
            <span className="text-[9px] text-white/70 font-bold mt-0.5">
              Sponsored
            </span>
          </div>
        </div>
        <Button type="button" className="text-white bg-[unset]!">
          <EllipsisVertical />{" "}
        </Button>
      </div>

      <div className="absolute bottom-16 left-4 right-4 text-white z-10">
        <div className="p-3 bg-white/10 dark:bg-(--card-color) backdrop-blur-md rounded-lg border border-white/20 dark:border-(--card-border-color)">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 overflow-hidden shrink-0">
              {(imageUrl || videoUrl) && (
                <Image
                  src={imageUrl || videoUrl}
                  className="w-full h-full object-cover"
                  alt="image"
                  width={100}
                  height={100}
                  unoptimized
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold leading-none mb-1 uppercase">
                {ad.ad_creative?.title || "new ad"}
              </p>
              <p className="text-xs font-bold leading-none truncate">
                Chat on WhatsApp
              </p>
            </div>
            <ChevronRight size={14} className="text-slate-400" />
          </div>
        </div>
        <p className="mt-4 text-sm font-bold text-white/90">
          {ad.ad_creative?.body || "..."}
        </p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 text-white/50 text-[10px] font-bold uppercase tracking-widest">
        <span>Ad</span>
        <div className="flex gap-4">
          <Heart size={22} />
          <MessageCircle size={22} />
          <Send size={22} />
        </div>
      </div>
    </div>
  );
};
