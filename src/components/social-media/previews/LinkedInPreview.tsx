/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Globe, MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send } from "lucide-react";
import { SocialAvatar } from "../SocialAvatar";
import { Card, CardContent } from "@/src/elements/ui/card";
import { HighlightHashtags, MediaCarousel } from "./SharedComponents";

export function LinkedInPreview({ account, caption, mediaList }: any) {
  return (
    <Card className="border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-white dark:bg-(--card-color) shadow-sm max-w-md mx-auto">
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SocialAvatar
            src={account?.profile_picture}
            name={account?.account_name || "LinkedIn Profile"}
            className="w-10 h-10 rounded-full object-cover"
            fallbackClassName="w-10 h-10 rounded-full bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center font-bold text-sm text-slate-500 uppercase"
          />
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              {account?.account_name || "LinkedIn Profile"}
            </h4>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold mt-0.5">
              <span>Now</span>
              <span>·</span>
              <Globe size={13} />
            </div>
          </div>
          <button className="ml-auto text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={18} />
          </button>
        </div>

        {/* Text */}
        <p className="text-sm text-slate-700 dark:text-slate-350 leading-relaxed whitespace-normal break-all line-clamp-4">
          <HighlightHashtags text={caption} />
        </p>

        {/* Media */}
        <MediaCarousel mediaList={mediaList} />

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100 dark:border-(--card-border-color) pt-3">
          <button className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 py-1.5 px-3 rounded-lg font-semibold transition-colors">
            <ThumbsUp size={16} />
            Like
          </button>
          <button className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 py-1.5 px-3 rounded-lg font-semibold transition-colors">
            <MessageCircle size={16} />
            Comment
          </button>
          <button className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 py-1.5 px-3 rounded-lg font-semibold transition-colors">
            <Repeat2 size={16} />
            Repost
          </button>
          <button className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 py-1.5 px-3 rounded-lg font-semibold transition-colors">
            <Send size={16} />
            Send
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
