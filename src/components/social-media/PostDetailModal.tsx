/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import React, { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Video, Info, CheckCircle, Calendar, Loader2, XCircle, AlertCircle, ExternalLink } from "lucide-react";
import { cn } from "@/src/lib/utils";
import {
  FacebookPreview,
  InstagramPreview,
  LinkedInPreview,
  TwitterPreview,
  YouTubePreview,
  ThreadsPreview
} from "./previews";
import {
  STATUS_BADGES,
  getPlatformBadge,
  getPlatformIcon,
  getStatusColorConfig
} from "./SocialMediaUtils";

interface PostDetailModalProps {
  post: any | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PostDetailModal({ post, isOpen, onClose }: PostDetailModalProps) {
  const mediaList = useMemo(() => {
    if (!post) return [];
    const urls = post.media_urls && post.media_urls.length > 0 ? post.media_urls : (post.media_url ? [post.media_url] : []);
    const validUrls = urls.filter((url: string) => {
      if (!url || typeof url !== "string") return false;
      return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("/");
    });
    return validUrls.map((url: string) => {
      const isVideo = url.endsWith(".mp4") || post.content_type?.toLowerCase() === "video";
      return {
        fileUrl: url,
        mimeType: isVideo ? "video/mp4" : "image/jpeg"
      };
    });
  }, [post]);

  if (!post) return null;

  const PlatformIcon = getPlatformIcon(post.platform);
  const statusStyles = getStatusColorConfig(post.status);
  const StatusIcon = statusStyles.icon;
  const postUrl = post.post_url || post.permalink || post.url;

  const renderPlatformPreview = () => {
    const platform = post.platform?.toLowerCase();
    const props = {
      account: post.account,
      caption: post.caption || "",
      mediaList
    };

    switch (platform) {
      case "facebook":
        return <FacebookPreview {...props} />;
      case "instagram":
        return <InstagramPreview {...props} />;
      case "linkedin":
        return <LinkedInPreview {...props} />;
      case "twitter":
      case "x":
        return <TwitterPreview {...props} />;
      case "youtube":
        return <YouTubePreview {...props} />;
      case "threads":
        return <ThreadsPreview {...props} />;
      default:
        return (
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 p-4 shadow-xs max-w-md mx-auto space-y-4 w-full">
            <div className="flex items-center gap-2">
              <span className="capitalize font-bold text-sm text-slate-800 dark:text-slate-200">{post.platform} Post</span>
            </div>
            {mediaList[0] && (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-900 flex items-center justify-center">
                {mediaList[0].mimeType?.startsWith("video/") ? (
                  <video src={mediaList[0].fileUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <img src={mediaList[0].fileUrl} className="w-full h-full object-contain" alt="" />
                )}
              </div>
            )}
            <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line">{post.caption}</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)]! max-h-[95vh] overflow-y-auto bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg p-0! gap-0">
        {/* Header */}
        <div className="flex gap-2 flex-wrap items-center justify-between border-b border-slate-100 dark:border-(--card-border-color) sm:p-5 p-4 bg-white dark:bg-(--page-body-bg)">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border", getPlatformBadge(post.platform))}>
              <PlatformIcon className="w-5 h-5" />
            </div>
            <div className="text-left leading-tight">
              <DialogTitle className="text-slate-900 dark:text-white font-extrabold text-base flex items-center gap-2 capitalize">
                {post.platform} Post Overview
              </DialogTitle>
              <p className="text-sm text-slate-450 dark:text-slate-400 font-semibold mt-0.5">
                {post.account?.account_name || `${post.platform?.charAt(0).toUpperCase() + post.platform?.slice(1)} Channel`} {post.account?.account_username ? `• @${post.account.account_username}` : ""}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-8">
            {postUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(postUrl, "_blank")}
                className="h-11 px-3.5 text-xs font-bold bg-primary/10 hover:bg-primary/20 dark:bg-(--dark-body) rounded-lg text-primary border-none  flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ExternalLink size={13} />
                View Post
              </Button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 bg-slate-50/40 dark:bg-(--dark-body)">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Live Social Preview */}
            <div className="md:col-span-6 flex flex-col justify-start">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 block">
                Post Feed Preview
              </h4>
                <div className="w-full max-w-sm">
                  {renderPlatformPreview()}
                </div>
            </div>

            {/* Right Column: Status & Metadata */}
            <div className="md:col-span-6 flex flex-col space-y-4">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 block">
                Publishing Details
              </h4>
              
              <div className="flex-1 space-y-4">
                {/* Status indicator widget */}
                <div className={cn("p-4 rounded-lg border flex items-center justify-between", statusStyles.bgBorder)}>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-75">Publishing Status</span>
                    <span className="capitalize font-extrabold text-sm">{statusStyles.label}</span>
                  </div>
                  <div className="h-9 w-9 rounded-full flex items-center justify-center bg-white/90 dark:bg-(--dark-body) border border-slate-100 dark:border-(--card-border-color)">
                    <StatusIcon size={16} className={post.status === "pending" ? "animate-spin" : ""} />
                  </div>
                </div>

                {/* Metadata details card */}
                <div className="bg-white dark:bg-(--card-color) border border-slate-200/80 dark:border-(--card-border-color) rounded-lg sm:p-5 p-4 space-y-4">
                  <h5 className="text-sm font-extrabold text-slate-450 dark:text-slate-400">Metadata Information</h5>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Platform</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 capitalize mt-0.5">{post.platform}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Format</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 capitalize mt-0.5">{post.content_type || "Post"}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">Created At</span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {new Date(post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}{" "}{new Date(post.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wide">
                        {post.status === "scheduled" ? "Scheduled For" : "Published At"}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                        {new Date(post.scheduled_at || post.published_at || post.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}{" "}{new Date(post.scheduled_at || post.published_at || post.created_at).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Media attachments */}
                {mediaList.length > 0 && (
                  <div className="bg-white dark:bg-(--card-color) border border-slate-200/80 dark:border-(--card-border-color) rounded-lg sm:p-5 p-4 space-y-3">
                    <h5 className="text-sm font-extrabold text-slate-450 dark:text-slate-400">Media Attachments</h5>
                    <div className="flex flex-wrap gap-2">
                      {mediaList.map((_: any, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/5 text-primary border border-primary/10 transition-colors"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          File #{i + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Failure Reason */}
                {post.status === "failed" && post.error_message && (
                  <div className="p-4 bg-destructive/50 dark:bg-destructive/10 border border-destructive/60 dark:border-destructive/30 rounded-lg text-rose-700 dark:text-rose-450 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500" />
                    <div className="space-y-0.5 text-left">
                      <span className="text-sm font-bold text-rose-500">Failure Reason</span>
                      <p className="text-xs leading-relaxed font-semibold">{post.error_message}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 bg-slate-50/40 dark:bg-(--page-body-bg)">
          <Button variant="outline" onClick={onClose} className="h-10 text-xs font-medium rounded-lg cursor-pointer">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
