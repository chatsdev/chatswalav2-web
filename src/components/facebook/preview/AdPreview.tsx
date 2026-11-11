/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { AdPreviewProps } from "@/src/types/facebook";
import { ChevronLeft, ChevronRight, Facebook, Instagram } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FacebookFeedPreview } from "./layouts/FacebookFeedPreview";
import { FacebookNotificationPreview } from "./layouts/FacebookNotificationPreview";
import { InstagramFeedPreview } from "./layouts/InstagramFeedPreview";
import { InstagramStoryPreview } from "./layouts/InstagramStoryPreview";

export const AdPreview: React.FC<AdPreviewProps> = ({
  ad,
  platform = ["facebook", "instagram"],
}) => {
  const { t } = useTranslation();
  const [activePlatform, setActivePlatform] = useState<string>(
    platform[0] || "facebook",
  );
  const [previewType, setPreviewType] = useState<number>(0);

  const creative = ad?.ad_creative;
  const videoUrl = creative?.video_url || "";
  const imageUrl = creative?.image_url || "";
  const isVideo = ad?.creative_type === "VIDEO";

  const togglePreview = () => {
    setPreviewType((prev) => (prev === 0 ? 1 : 0));
  };

  return (
    <div className="flex flex-col w-full max-w-sm sm:max-w-md mx-auto h-full border border-slate-200 dark:border-(--card-border-color) rounded-lg bg-white dark:bg-(--page-body-bg) shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Platform & Type Tabs */}
      <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--page-body-bg)">
        <div className="flex flex-wrap flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex bg-slate-100 dark:bg-(--dark-body) p-1 rounded-lg w-full sm:w-auto">
            {platform.includes("facebook") && (
              <Button
                type="button"
                onClick={() => {
                  setActivePlatform("facebook");
                  setPreviewType(0);
                }}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all",
                  activePlatform === "facebook"
                    ? "bg-white! dark:bg-(--card-color)! text-blue-600 shadow-sm"
                    : "text-slate-500 bg-[unset]!",
                )}
              >
                <Facebook size={12} className="sm:w-3.5 sm:h-3.5" /> Facebook
              </Button>
            )}
            {platform.includes("instagram") && (
              <Button
                type="button"
                onClick={() => {
                  setActivePlatform("instagram");
                  setPreviewType(0);
                }}
                className={cn(
                  "flex-1 sm:flex-none flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all",
                  activePlatform === "instagram"
                    ? "bg-white! dark:bg-(--card-color)! text-pink-600 shadow-sm"
                    : "text-slate-500 bg-[unset]!",
                )}
              >
                <Instagram size={12} className="sm:w-3.5 sm:h-3.5" /> Instagram
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto px-1 sm:px-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={togglePreview}
              className="rounded-full w-7 h-7 sm:w-8 sm:h-8 hover:bg-slate-200 dark:hover:bg-(--table-hover) shrink-0"
            >
              <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
            </Button>
            <span className="text-[12px] font-black text-slate-400 truncate">
              {previewType === 0
                ? t("post_feed")
                : activePlatform === "facebook"
                  ? t("notification")
                  : t("reel_story")}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={togglePreview}
              className="rounded-full w-7 h-7 sm:w-8 sm:h-8 hover:bg-slate-200 dark:hover:bg-(--table-hover) shrink-0"
            >
              <ChevronRight size={14} className="sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Content Area */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto sm:p-6 p-4 flex flex-col items-center justify-start bg-slate-50 dark:bg-(--page-body-bg)">
        <div className="w-full flex justify-center items-start py-4 sm:py-0">
          {activePlatform === "facebook" ? (
            previewType === 0 ? (
              <FacebookFeedPreview
                ad={ad}
                videoUrl={videoUrl}
                imageUrl={imageUrl}
                isVideo={isVideo}
              />
            ) : (
              <FacebookNotificationPreview ad={ad} />
            )
          ) : previewType === 0 ? (
            <InstagramFeedPreview
              ad={ad}
              videoUrl={videoUrl}
              imageUrl={imageUrl}
              isVideo={isVideo}
            />
          ) : (
            <InstagramStoryPreview
              ad={ad}
              videoUrl={videoUrl}
              imageUrl={imageUrl}
              isVideo={isVideo}
            />
          )}
        </div>
      </div>
    </div>
  );
};
