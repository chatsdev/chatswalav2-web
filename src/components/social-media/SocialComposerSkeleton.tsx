import React from "react";
import { Skeleton } from "@/src/elements/ui/skeleton";

export default function SocialComposerSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Step Indicator Skeleton */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-6 shadow-sm">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                <div className="hidden sm:block space-y-1.5">
                  <Skeleton className="h-3.5 w-16 rounded" /> 
                  <Skeleton className="h-2.5 w-20 rounded" />
                </div>
              </div>
              {i < 3 && (
                <div className="hidden sm:block flex-1 h-[2px] mx-4 bg-slate-100 dark:bg-slate-800" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL: Form Wizard Skeleton */}
        <div className="lg:col-span-2 h-fit bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden flex flex-col justify-between min-h-[500px]">
          <div className="sm:p-6 p-4 space-y-6">
            
            {/* Step Content: Channels Skeleton */}
            <div className="space-y-6">
              {/* Select Channels Header */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-28 rounded" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-64 sm:w-80 rounded" />
                  </div>
                  <Skeleton className="h-3.5 w-24 rounded" />
                </div>

                {/* Grid of connected accounts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10"
                    >
                      <div className="relative shrink-0">
                        <Skeleton className="w-11 h-11 rounded-full" />
                        <Skeleton className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900" />
                      </div>
                      <div className="space-y-2 flex-1 min-w-0">
                        <Skeleton className="h-3 w-20 rounded" />
                        <Skeleton className="h-2.5 w-14 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publishing Formats Header & Content */}
              <div className="space-y-4 pt-5 border-t border-slate-150 dark:border-slate-850">
                <Skeleton className="h-4 w-36 rounded" />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center justify-center p-5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 space-y-3"
                    >
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-3.5 w-16 rounded" />
                      <Skeleton className="h-2.5 w-28 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Actions Navigation Footer */}
          <div className="sm:px-6 px-4 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-(--card-color) flex items-center gap-3">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-11 flex-1 rounded-lg" />
          </div>
        </div>

        {/* RIGHT PANEL: Sticky Live Previews Skeleton */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden min-h-[500px] flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-3.5 w-28 rounded" />
                    <Skeleton className="h-2 w-48 rounded" />
                  </div>
                </div>
              </div>

              {/* Platform Switcher */}
              <div className="px-5 py-3 flex border-b border-slate-200/60 dark:border-slate-850 gap-2 overflow-hidden">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-7 w-24 rounded-lg shrink-0" />
                ))}
              </div>

              {/* Simulated Post Mockup */}
              <div className="p-5">
                <div className="border border-slate-100 dark:border-slate-800 rounded-xl p-4 space-y-4">
                  {/* Account detail */}
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className="h-3 w-24 rounded" />
                      <Skeleton className="h-2 w-16 rounded" />
                    </div>
                  </div>
                  
                  {/* Caption lines */}
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full rounded" />
                    <Skeleton className="h-3 w-5/6 rounded" />
                    <Skeleton className="h-3 w-2/3 rounded" />
                  </div>
                  
                  {/* Media placeholder */}
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  
                  {/* Action buttons (like, comment, share) */}
                  <div className="flex justify-between border-t border-slate-100 dark:border-slate-850 pt-3 px-1">
                    <Skeleton className="h-4 w-10 rounded" />
                    <Skeleton className="h-4 w-10 rounded" />
                    <Skeleton className="h-4 w-10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
