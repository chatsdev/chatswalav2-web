import React from "react";
import { Skeleton } from "@/src/elements/ui/skeleton";

export const SocialAutomationSkeleton: React.FC = () => {
  return (
    <div className="mx-auto p-4 sm:p-8 space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 rounded" />
            <Skeleton className="h-4 w-32 rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-2xl p-6 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-40 rounded" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
          {/* Footer Buttons */}
          <div className="flex gap-3">
            <Skeleton className="h-11 flex-1 rounded-lg" />
            <Skeleton className="h-11 flex-1 rounded-lg" />
          </div>
        </div>

        {/* Right Column Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-2xl p-6 space-y-6">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-4 w-3/4 rounded" />
            </div>
            <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
              <Skeleton className="h-6 w-24 rounded" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
