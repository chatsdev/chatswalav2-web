/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { InstagramFeedPreviewProps } from "@/src/types/facebook";
import {
  Bookmark,
  Heart,
  Images,
  MessageCircle,
  PlayCircle,
  Send,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export const InstagramFeedPreview: React.FC<InstagramFeedPreviewProps> = ({
  ad,
  videoUrl,
  imageUrl,
  isVideo,
}) => {
  const isCarousel = ad?.creative_type === "CAROUSEL";
  const cards = ad?.ad_creative?.carousel_cards || [];

  return (
    <div className="w-full bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-xl overflow-hidden shadow-sm scale-95 origin-top">
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-(--dark-body) ring-2 ring-pink-500 ring-offset-2 dark:ring-offset-slate-900" />
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900 dark:text-white leading-none">
              Your Brand
            </span>
            <span className="text-[10px] text-slate-400 font-bold mt-1 leading-none">
              Sponsored
            </span>
          </div>
        </div>
        <Button type="button" className="text-slate-400 bg-[unset]!">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 12c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"></path>
          </svg>
        </Button>
      </div>

      {isCarousel ? (
        <div className="flex overflow-x-auto snap-x custom-scrollbar pb-1">
          {cards.length > 0 ? (
            cards.map((card: any, idx: number) => (
              <div
                key={idx}
                className="min-w-full aspect-square bg-slate-100 dark:bg-slate-800 snap-center relative"
              >
                {card.image_url ? (
                  <Image
                    src={card.image_url || ""}
                    className="w-full h-full object-cover"
                    width={100}
                    height={100}
                    unoptimized
                    alt={"image"}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Images size={48} />
                  </div>
                )}
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/50 text-white text-[10px] rounded-full font-bold">
                  {idx + 1}/{cards.length}
                </div>
              </div>
            ))
          ) : (
            <div className="min-w-full aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
              <Images size={48} />
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-square bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center relative overflow-hidden">
          {isVideo ? (
            videoUrl ? (
              <div className="w-full h-full relative">
                <video
                  src={videoUrl}
                  poster={imageUrl}
                  className="w-full h-full object-cover"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <PlayCircle className="text-white opacity-80" size={48} />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <PlayCircle size={48} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  No Video Selected
                </span>
              </div>
            )
          ) : imageUrl ? (
            <Image
              src={imageUrl}
              className="w-full h-full object-cover"
              alt="Preview"
              width={400}
              height={400}
              unoptimized
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <Images size={48} />
              <span className="text-xs font-bold uppercase tracking-widest">
                No Media Selected
              </span>
            </div>
          )}
        </div>
      )}

      <div className="p-3 border-b border-slate-100 dark:border-(--card-border-color) flex items-center justify-between bg-white dark:bg-(--page-body-bg) group cursor-pointer transition-colors active:bg-slate-50">
        <span className="text-sm font-bold text-blue-500 group-hover:text-blue-600 transition-colors">
          Send WhatsApp message
        </span>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          className="text-slate-400"
        >
          <path
            d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"
            fill="currentColor"
          ></path>
        </svg>
      </div>

      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-4">
            <Heart size={22} />
            <MessageCircle size={22} />
            <Send size={22} />
          </div>
          <Bookmark size={22} />
        </div>
        <div className="space-x-2">
          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
            Your Brand
          </span>
          <span className="text-[13px] text-slate-800 dark:text-slate-200 line-clamp-2">
            {ad.ad_creative?.body || "..."}
          </span>
        </div>
      </div>
    </div>
  );
};
