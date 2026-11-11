/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { FacebookFeedPreviewProps } from "@/src/types/facebook";
import {
  Image as ImageIcon,
  MessageCircle,
  MessageSquare,
  PlayCircle,
  Share,
  Smartphone,
  ThumbsUp,
} from "lucide-react";
import Image from "next/image";
import React from "react";

export const FacebookFeedPreview: React.FC<FacebookFeedPreviewProps> = ({
  ad,
  videoUrl,
  imageUrl,
  isVideo,
}) => {
  const isCarousel = ad?.creative_type === "CAROUSEL";
  const cards = ad?.ad_creative?.carousel_cards || [];

  return (
    <div className="w-full max-w-[340px] sm:max-w-none bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden shadow-sm lg:scale-95 origin-top">
      <div className="p-2 sm:p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-400 text-base sm:text-lg">
            C
          </div>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
              Creator page
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400 font-bold flex items-center gap-1 leading-none mt-1">
              Ad · Not connected · <Smartphone size={10} />
            </span>
          </div>
        </div>
        <Button
          type="button"
          className="text-slate-400 hover:text-slate-600 transition-colors bg-[unset]!"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 12c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"></path>
          </svg>
        </Button>
      </div>

      <div className="px-3 pb-2 sm:pb-3">
        <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 line-clamp-3 whitespace-pre-wrap">
          {ad.ad_creative?.body || "Your ad body text will appear here..."}
        </p>
      </div>

      {isCarousel ? (
        <div className="flex gap-2 px-3 overflow-x-auto pb-4 table-custom-scrollbar snap-x">
          {cards.length > 0 ? (
            cards.map((card: any, idx: number) => (
              <div
                key={idx}
                className="min-w-[220px] sm:min-w-60 border border-slate-100 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-slate-50 dark:bg-(--card-color) snap-center"
              >
                <div className="h-32 sm:h-40 bg-slate-100 dark:bg-(--dark-body)">
                  {card.image_url ? (
                    <Image
                      src={card.image_url || ""}
                      className="w-full h-full object-cover"
                      alt={`Card ${idx}`}
                      width={100}
                      height={100}
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon size={24} className="sm:w-8 sm:h-8" />
                    </div>
                  )}
                </div>
                <div className="p-2 sm:p-3 bg-white dark:bg-(--page-body-bg) border-t border-slate-100 dark:border-(--card-border-color)">
                  <p className="text-[10px] sm:text-xs font-black text-slate-900 dark:text-white uppercase truncate">
                    {card.headline || "Headline"}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold truncate mt-1">
                    {card.description || "Description"}
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    className="w-full bg-slate-100 dark:bg-(--dark-body) text-slate-900 dark:text-white font-bold h-7 sm:h-8 mt-2 sm:mt-3 rounded-md text-[9px] sm:text-[10px]"
                  >
                    MESSAGE
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-32 sm:h-40 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border-2 border-dashed border-slate-200 dark:border-(--card-border-color) flex items-center justify-center text-slate-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
              No Cards Added
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
                  <PlayCircle
                    className="text-white opacity-80 sm:w-12 sm:h-12"
                    size={40}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <PlayCircle className="sm:w-12 sm:h-12" size={40} />
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                  No Video
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
              <ImageIcon className="sm:w-12 sm:h-12" size={40} />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                No Media Selected
              </span>
            </div>
          )}
        </div>
      )}

      {!isCarousel && (
        <div className="p-3 py-3 sm:py-4 bg-slate-50 dark:bg-(--card-color) flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-(--card-border-color)">
          <div className="flex-1 min-w-0 sm:pr-4">
            <p className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
              WHATSAPP
            </p>
            <p className="text-[13px] sm:text-[15px] font-semibold text-slate-900 dark:text-white leading-tight truncate sm:whitespace-normal">
              {ad.ad_creative?.title || "Send WhatsApp message"}
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white font-bold rounded-lg border-none flex items-center justify-center gap-2 px-3 h-9 sm:h-10"
          >
            <MessageCircle size={16} /> WhatsApp
          </Button>
        </div>
      )}

      <div className="p-2 sm:p-3 py-3 sm:py-4 border-t border-slate-100 dark:border-(--card-border-color) flex items-center justify-around text-slate-500 font-bold text-[11px] sm:text-[13px] flex-wrap gap-y-2">
        <span className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <ThumbsUp size={14} /> Like
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <MessageSquare size={14} /> Comment
        </span>
        <span className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <Share size={14} /> Share
        </span>
      </div>
    </div>
  );
};
