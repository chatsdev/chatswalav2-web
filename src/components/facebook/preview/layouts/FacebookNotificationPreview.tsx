/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FacebookNotificationPreviewProps } from "@/src/types/facebook";
import { Facebook } from "lucide-react";
import React from "react";

export const FacebookNotificationPreview: React.FC<
  FacebookNotificationPreviewProps
> = ({ ad }) => {
  return (
    <div className="w-full max-w-[340px] sm:max-w-sm h-[500px] sm:h-125 border border-slate-200 dark:border-(--card-border-color) rounded-lg bg-white dark:bg-(--card-color) shadow-sm relative overflow-hidden lg:scale-95 origin-top">
      <div className="absolute top-0 left-0 right-0 h-10 bg-slate-50 dark:bg-(--card-color) border-b border-slate-100 dark:border-(--card-border-color) flex items-center px-4 gap-4">
        <div className="w-3 h-3 rounded-full bg-rose-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-primary" />
      </div>
      <div className="mt-10 sm:p-6 p-4 space-y-6 custom-scrollbar overflow-auto h-[545px]">
        <div className="space-y-3 opacity-20">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-2 bg-slate-200 rounded w-1/3" />
              <div className="h-2 bg-slate-200 rounded w-1/2" />
            </div>
          </div>
          <div className="h-24 bg-slate-100 rounded-lg" />
        </div>

        <div className="p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border-l-4 border-blue-500 shadow-md ring-1 ring-black/5 animate-pulse-slow">
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="w-12 h-12 rounded-full dark:bg-(--dark-body) bg-slate-300 shrink-0 relative">
              <div className="absolute -bottom-1 -right-1 p-1 bg-blue-600 rounded-full border-2 border-white dark:border-slate-800">
                <Facebook size={10} className="text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-800 dark:text-white leading-normal">
                <span className="font-black">Creator page</span> has something
                you might like:{" "}
                <span className="italic">{`"${ad.ad_creative?.title || "new ad"}"`}</span>
              </p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">Ad</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 opacity-20">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-2 bg-slate-200 rounded w-1/4" />
              <div className="h-2 bg-slate-200 rounded w-3/4" />
            </div>
          </div>
          <div className="h-32 bg-slate-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
};
