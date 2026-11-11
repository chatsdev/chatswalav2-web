/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MoreHorizontal, MessageCircle, Repeat2, ThumbsUp, Share2 } from "lucide-react";
import { SocialAvatar } from "../SocialAvatar";
import { Card, CardContent } from "@/src/elements/ui/card";
import { HighlightHashtags, MediaCarousel } from "./SharedComponents";

export function TwitterPreview({ account, caption, mediaList }: any) {
  return (
    <Card className="border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-white dark:bg-(--card-color) shadow-sm max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <SocialAvatar
            src={account?.profile_picture}
            name={account?.account_name || "Twitter Profile"}
            className="w-10 h-10 rounded-full object-cover shrink-0"
            fallbackClassName="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-sm text-slate-500 uppercase shrink-0"
          />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm font-extrabold text-slate-900 dark:text-slate-100 truncate">
                  {account?.account_name || "Twitter Profile"}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-600 truncate">
                  @{account?.account_name?.toLowerCase().replace(/\s/g, "_")}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-600">·</span>
                <span className="text-xs text-slate-400 dark:text-slate-600 whitespace-nowrap">Just now</span>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreHorizontal size={18} />
              </button>
            </div>

            {/* Caption */}
            <p className="text-sm text-slate-800 dark:text-slate-300 leading-relaxed whitespace-normal break-all line-clamp-4">
              <HighlightHashtags text={caption} />
            </p>

            {/* Media */}
            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-(--card-border-color)">
              <MediaCarousel mediaList={mediaList} />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 pt-2 text-sm">
              <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><MessageCircle size={15} /> 0</button>
              <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors"><Repeat2 size={15} /> 0</button>
              <button className="flex items-center gap-1.5 hover:text-red-500 transition-colors"><ThumbsUp size={15} /> 0</button>
              <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors"><Share2 size={15} /></button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
