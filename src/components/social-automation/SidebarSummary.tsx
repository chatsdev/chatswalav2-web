import { MATCHING_METHODS } from "@/src/data/KeywordActionData";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import { SidebarSummaryProps } from "@/src/types/socialAutomation";
import {
  ExternalLink,
  Facebook,
  Instagram,
  Settings,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const SidebarSummary: React.FC<SidebarSummaryProps> = ({
  platform,
  mediaType,
  mediaUrl,
  permalink,
  caption,
  keywords,
  matchingMethod,
  partialPercentage,
  selectedReplyId,
  activeTypeConfig,
  selectedMaterial,
  autoLikeComment,
  autoHideComment,
  requiresFollowing,
  delaySeconds,
}) => {
  return (
    <div className="space-y-4">
      {/* Target Content Preview Card */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) sm:p-5 p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {platform === "facebook" ? (
              <span className="p-1.5 bg-blue-500/10 text-blue-500 rounded-md">
                <Facebook size={16} />
              </span>
            ) : (
              <span className="p-1.5 bg-pink-500/10 text-pink-500 rounded-md">
                <Instagram size={16} />
              </span>
            )}
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Target Content
            </span>
          </div>
          {permalink && (
            <Link
              href={permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
            >
              View Post <ExternalLink size={14} />
            </Link>
          )}
        </div>

        {mediaUrl && (
          <div className="relative aspect-video w-full rounded-lg dark:bg-(--page-body-bg) overflow-hidden border border-slate-200 dark:border-(--card-border-color) bg-slate-100 flex items-center justify-center">
            {mediaUrl.includes(".mp4") ? (
              <video
                src={mediaUrl}
                className="object-contain w-full h-full"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <Image
                src={mediaUrl}
                alt="Target Content"
                width={100}
                height={100}
                unoptimized
                className="object-contain w-full h-full"
              />
            )}
          </div>
        )}

        {mediaType !== "story" && (
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-slate-400">
              Caption
            </Label>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-medium line-clamp-3 bg-slate-50 dark:bg-(--page-body-bg) p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {caption || (
                <span className="italic text-slate-400">No caption</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Summary details card */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) sm:p-5 p-4 shadow-sm space-y-4">
        <h3 className="text-sm font-black text-slate-500">Summary</h3>

        <div className="space-y-1.5">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Trigger Keywords
          </p>
          {keywords.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary break-all whitespace-normal line-clamp-1"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No keywords yet</p>
          )}
        </div>

        <div className="space-y-1.5">
          <p className="text-sm font-medium text-slate-400">Matching</p>
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
            {MATCHING_METHODS.find((m) => m.value === matchingMethod)?.label ||
              matchingMethod}
            {matchingMethod === "partial" && (
              <span className="ml-1.5 text-amber-500">
                ({partialPercentage}%)
              </span>
            )}
          </p>
        </div>

        {selectedReplyId && (
          <div className="space-y-1.5">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Reply Material
            </p>
            <div className="flex items-center gap-2">
              <span className={cn("shrink-0", activeTypeConfig.color)}>
                {activeTypeConfig.icon}
              </span>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                {(selectedMaterial as any)?.name || "—"}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-(--card-border-color)">
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
            <Settings size={12} /> Auto Actions
          </p>
          <div className="text-xs space-y-1 text-slate-600 dark:text-slate-300 font-medium">
            {mediaType !== "story" && (
              <>
                <p>Auto-Like: {autoLikeComment ? "Enabled" : "Disabled"}</p>
                <p>Auto-Hide: {autoHideComment ? "Enabled" : "Disabled"}</p>
              </>
            )}
            <p>
              Requires Following: {requiresFollowing ? "Enabled" : "Disabled"}
            </p>
            <p>
              Delay: {delaySeconds > 0 ? `${delaySeconds} seconds` : "Instant"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10 p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-primary" />
          <p className="text-xs font-black text-primary uppercase tracking-wider">
            Tips
          </p>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside leading-relaxed">
          <li>
            Suggested keywords are retrieved from Meta AI matching of media
            captions.
          </li>
          {mediaType !== "story" && (
            <li>
              Toggle Auto-Hide to keep your posts clean from bot replies or
              competitor scraping.
            </li>
          )}
          <li>
            Delays simulate human interaction and make the automation feel
            organic.
          </li>
        </ul>
      </div>
    </div>
  );
};
