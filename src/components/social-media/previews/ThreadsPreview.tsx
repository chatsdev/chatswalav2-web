/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { SocialAvatar } from "../SocialAvatar";
import { Card, CardContent } from "@/src/elements/ui/card";
import { HighlightHashtags, MediaCarousel } from "./SharedComponents";

export function ThreadsPreview({ account, caption, mediaList }: any) {
  return (
    <Card className="border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden bg-white dark:bg-(--card-color) shadow-sm max-w-md mx-auto">
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-3">
          <SocialAvatar
            src={account?.profile_picture}
            name={account?.account_name || "Threads Account"}
            className="w-9 h-9 rounded-full object-cover shrink-0"
            fallbackClassName="w-9 h-9 rounded-full bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center font-bold text-xs text-slate-500 uppercase shrink-0"
          />
          <div className="flex-1 space-y-1.5 text-left">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {account?.account_name || "Threads Account"}
              </span>
              <span className="text-[10px] text-slate-400">Just now</span>
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 break-all leading-relaxed whitespace-normal line-clamp-3">
              <HighlightHashtags text={caption} />
            </p>
            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-(--card-border-color) mt-2">
              <MediaCarousel mediaList={mediaList} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
