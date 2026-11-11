/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MoreHorizontal, ThumbsUp, MessageCircle, Share2 } from "lucide-react";
import { SocialAvatar } from "../SocialAvatar";
import { Card, CardContent } from "@/src/elements/ui/card";
import { HighlightHashtags, MediaCarousel } from "./SharedComponents";

export function InstagramPreview({ account, caption, mediaList }: any) {
  return (
    <Card className="border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-white dark:bg-(--card-color) shadow max-w-md mx-auto">
      <CardContent className="p-4 space-y-0">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[1.5px]">
            <SocialAvatar
              src={account?.profile_picture}
              name={account?.account_name || "Instagram Account"}
              className="w-full h-full rounded-full object-cover border border-white dark:border-slate-900"
              fallbackClassName="w-full h-full rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-500 uppercase border border-white dark:border-slate-900"
            />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:underline cursor-pointer">
              {account?.account_name || "Instagram Account"}
            </h4>
            <p className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              Sponsored
            </p>
          </div>
          <button className="ml-auto text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Media */}
        <MediaCarousel mediaList={mediaList} />

        {/* Action Row */}
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-slate-800 dark:text-slate-200">
            <button className="hover:scale-105 transition-transform"><ThumbsUp size={18} /></button>
            <button className="hover:scale-105 transition-transform"><MessageCircle size={18} /></button>
            <button className="hover:scale-105 transition-transform"><Share2 size={18} /></button>
          </div>
          <div className="text-xs leading-relaxed">
            <span className="font-extrabold mr-1.5 text-slate-900 dark:text-slate-100">
              {account?.account_name || "instagram_user"}
            </span>
            <HighlightHashtags text={caption} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
