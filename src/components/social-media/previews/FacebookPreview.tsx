/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Globe, MoreHorizontal, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { SocialAvatar } from "../SocialAvatar";
import { Card, CardContent } from "@/src/elements/ui/card";
import { HighlightHashtags, MediaCarousel } from "./SharedComponents";

export function FacebookPreview({ account, caption, mediaList }: any) {
  return (
    <Card className="border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-white dark:bg-(--card-color) shadow max-w-md mx-auto">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SocialAvatar
            src={account?.profile_picture}
            name={account?.account_name || "Facebook Page"}
            className="w-10 h-10 rounded-full object-cover"
            fallbackClassName="w-10 h-10 rounded-full bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center font-bold text-sm text-slate-500 dark:text-slate-600 uppercase"
          />
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 hover:underline cursor-pointer">
              {account?.account_name || "Facebook Page"}
            </h4>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mt-0.5">
              <span>Just now</span>
              <span>·</span>
              <Globe size={13} />
            </div>
          </div>
          <button className="ml-auto text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Text */}
        <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-normal break-all">
          <HighlightHashtags text={caption} />
        </p>

        {/* Media */}
        <MediaCarousel mediaList={mediaList} />

        {/* Interactions Row */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <button className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-(--table-hover) py-1.5 px-3 rounded-lg font-semibold transition-colors">
            <ThumbsUp size={16} />
            Like
          </button>
          <button className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-(--table-hover) py-1.5 px-3 rounded-lg font-semibold transition-colors">
            <MessageCircle size={16} />
            Comment
          </button>
          <button className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-(--table-hover) py-1.5 px-3 rounded-lg font-semibold transition-colors">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
