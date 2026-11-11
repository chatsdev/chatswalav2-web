/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect, useRef } from "react";
import Can from "@/src/components/shared/Can";
import { SocialAvatar } from "./SocialAvatar";
import {
  Video,
  Calendar,
  X,
  Eye,
  Trash2,
  Image as ImageIcon
} from "lucide-react";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { cn } from "@/src/lib/utils";
import {
  STATUS_BADGES,
  getPlatformBadge,
  getPlatformIcon,
  isValidUrl,
  renderCaptionText
} from "./SocialMediaUtils";

// Skeleton loader for Grid View
export const SkeletonCard = () => (
  <div className="bg-white dark:bg-(--card-border-color) border border-slate-200/60 dark:border-(--card-border-color) rounded-lg sm:p-5 p-4 space-y-4 shadow-sm">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-2.5 w-16" />
        </div>
      </div>
      <Skeleton className="h-5.5 w-16 rounded-full" />
    </div>
    <div className="aspect-[16/10] w-full rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    <div className="space-y-2">
      <Skeleton className="h-3.5 w-full" />
      <Skeleton className="h-3.5 w-5/6" />
    </div>
    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center">
      <Skeleton className="h-3 w-28" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  </div>
);

export const PostMediaPreview = ({ post }: { post: any }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);

  // Extract all media items
  const mediaItems = useMemo(() => {
    // 1. If we have children (e.g. from Facebook/Instagram Graph API)
    if (post.children && Array.isArray(post.children)) {
      return post.children;
    }
    if (post.children?.data && Array.isArray(post.children.data)) {
      return post.children.data;
    }
    // 2. If we have media_urls
    if (post.media_urls && Array.isArray(post.media_urls) && post.media_urls.length > 0) {
      return post.media_urls.map((url: string) => {
        const isVid = url.toLowerCase().includes(".mp4") || 
                      url.toLowerCase().includes(".mov") || 
                      url.toLowerCase().includes(".webm") ||
                      post.media_type?.toLowerCase() === "video" ||
                      post.content_type?.toLowerCase() === "video";
        return {
          media_url: url,
          media_type: isVid ? "VIDEO" : "IMAGE"
        };
      });
    }
    // 3. Fallback to single media_url
    if (post.media_url || post.thumbnail_url) {
      const isVid = post.media_type?.toLowerCase() === "video" || 
                    post.content_type?.toLowerCase() === "video" || 
                    post.media_url?.toLowerCase().includes(".mp4") ||
                    post.media_url?.toLowerCase().includes(".mov") ||
                    post.media_url?.toLowerCase().includes(".webm");
      return [{
        media_url: post.media_url || post.thumbnail_url,
        media_type: isVid ? "VIDEO" : "IMAGE",
        thumbnail_url: post.thumbnail_url
      }];
    }
    return [];
  }, [post]);

  useEffect(() => {
    setVideoError(false);
  }, [currentIndex, mediaItems]);

  if (mediaItems.length === 0) {
    return (
      <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-indigo-50/20 to-violet-50/20 dark:from-slate-900/40 dark:to-slate-950/40 border border-slate-100 dark:border-slate-850 flex flex-col items-center justify-center gap-1.5 text-slate-400 dark:text-slate-600">
        <ImageIcon size={22} className="opacity-60" />
        <span className="text-[9px] font-bold uppercase tracking-wider opacity-70">Text Post Only</span>
      </div>
    );
  }

  const currentMedia = mediaItems[currentIndex];
  // Determine if current item is video
  const isVideo = currentMedia?.media_type?.toLowerCase() === "video" || 
                  (typeof currentMedia === "string" && (
                    currentMedia.toLowerCase().includes(".mp4") ||
                    currentMedia.toLowerCase().includes(".mov") ||
                    currentMedia.toLowerCase().includes(".webm")
                  )) ||
                  currentMedia?.media_url?.toLowerCase().includes(".mp4") ||
                  currentMedia?.media_url?.toLowerCase().includes(".mov") ||
                  currentMedia?.media_url?.toLowerCase().includes(".webm");

  const mediaUrl = currentMedia?.media_url || (typeof currentMedia === "string" ? currentMedia : "");
  const hasThumbnail = !!(currentMedia?.thumbnail_url || post.thumbnail_url);
  const displayImage = !isVideo 
    ? (currentMedia?.thumbnail_url || post.thumbnail_url || (typeof currentMedia === "string" ? currentMedia : currentMedia?.media_url))
    : (currentMedia?.thumbnail_url || post.thumbnail_url || null);

  const isPlayable = mediaUrl && !mediaUrl.includes("facebook.com/stories/") && !mediaUrl.includes("instagram.com/");

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        if (!hasThumbnail) {
          videoRef.current.currentTime = 0;
        }
      }
    }
  }, [isHovered, hasThumbnail]);

  const showVideo = isVideo && (isHovered || !hasThumbnail);

  return (
    <div
      className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-slate-100 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) flex items-center justify-center group-hover:opacity-95 transition-opacity"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={mediaItems.length > 1 ? handleNext : undefined}
      style={{ cursor: mediaItems.length > 1 ? "pointer" : "default" }}
    >
      {/* Video Element */}
      {showVideo && isPlayable && !videoError ? (
        <video
          ref={videoRef}
          src={mediaUrl}
          className="object-cover w-full h-full absolute inset-0 z-10 pointer-events-none"
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setVideoError(true)}
        />
      ) : null}

      {/* Main Image fallback/default */}
      {displayImage ? (
        <img
          src={displayImage}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt="Post attachment"
        />
      ) : !showVideo ? (
        <div className="text-slate-500 dark:text-slate-600 flex flex-col items-center gap-2">
          <ImageIcon size={32} />
          <span className="text-xs">No preview</span>
        </div>
      ) : null}

      {/* Badges / Indicators */}
      {/* Video Indicator */}
      {isVideo && (
        <div className="absolute top-2 left-2 z-15 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg flex items-center justify-center pointer-events-none">
          <Video size={12} />
        </div>
      )}

      {/* Multi-media indicators/pagination dots */}
      {mediaItems.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-1 z-15 pointer-events-none">
          {mediaItems.map((_: any, idx: number) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full shadow-xs transition-all duration-300 ${
                idx === currentIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const PostCard = ({ 
  post, 
  onDetail, 
  onCancel, 
  onDelete 
}: { 
  post: any; 
  onDetail: () => void; 
  onCancel: () => void; 
  onDelete: () => void; 
}) => {
  const statusMeta = STATUS_BADGES[post.status] || {
    label: post.status,
    bg: "bg-slate-100",
    text: "text-slate-600",
    icon: InfoIcon
  };
  const StatusIcon = statusMeta.icon;
  const PlatformIcon = getPlatformIcon(post.platform);

  return (
    <div 
      className="group bg-white dark:bg-(--card-color) border border-slate-200/85 dark:border-(--card-border-color) hover:border-primary/50 dark:hover:border-primary/50 rounded-lg sm:p-5 p-4 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all duration-300 relative"
    >
      <div className="space-y-4">
        {/* Card Header: Channel & Platform & Status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <SocialAvatar
                src={post.account?.profile_picture}
                name={post.account?.account_name || post.platform}
                className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                fallbackClassName="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-sm uppercase border border-slate-200 dark:border-slate-800 shadow-inner"
              />
              {/* Overlapping platform badge */}
              <div className={cn("absolute -bottom-1.5 -right-1.5 w-5.5 h-5.5 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center bg-white dark:bg-slate-900 shadow-md", getPlatformBadge(post.platform))}>
                <PlatformIcon className="w-2.8 h-2.8" />
              </div>
            </div>
            <div className="min-w-0 leading-tight">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {post.account?.account_name || `${post.platform?.charAt(0).toUpperCase() + post.platform?.slice(1)} Page`}
              </h5>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 capitalize tracking-wide">
                {post.content_type || "Post"}
              </span>
            </div>
          </div>
          <Badge variant="outline" className={`text-[9px] font-bold capitalize border px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 ${statusMeta.bg} ${statusMeta.text}`}>
            <StatusIcon size={9} className={post.status === "pending" ? "animate-spin" : ""} />
            <span>{statusMeta.label}</span>
          </Badge>
        </div>
 
        {/* Media Preview Area */}
        <PostMediaPreview post={post} />

        {/* Caption */}
        <div className="space-y-1.5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-350 line-clamp-3 leading-relaxed min-h-[4.5rem]">
            {renderCaptionText(post.caption)}
          </p>
        </div>
      </div>

      {/* Card Footer: Date & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-(--card-border-color) flex justify-between items-center">
        <p className="text-sm font-semibold text-slate-400 dark:text-slate-400 flex items-center gap-1">
          <Calendar size={12} />
          <span>
            {new Date(post.scheduled_at || post.published_at || post.created_at).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })}{" "}{new Date(post.scheduled_at || post.published_at || post.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit"
            })}
          </span>
        </p>

        <div className="flex items-center gap-1.5">
          {post.status === "scheduled" && (
            <Can permission="publish.social_publish">
              <Button
                size="sm"
                variant="outline"
                onClick={onCancel}
                className="h-8 px-3 text-[10px] font-bold border-amber-250 bg-amber-50/50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:hover:bg-amber-950/30 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
              >
                <X size={10} />
                Cancel
              </Button>
            </Can>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={onDetail}
            className="w-8 h-8 rounded-full bg-slate-50 dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
            title="Preview Post"
          >
            <Eye size={14} />
          </Button>
          <Can permission="publish.social_publish">
            <Button
              variant="outline"
              size="icon"
              onClick={onDelete}
              className="w-8 h-8 rounded-full bg-slate-50 dark:bg-(--card-color) border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
              title="Delete record"
            >
              <Trash2 size={14} />
            </Button>
          </Can>
        </div>
      </div>
    </div>
  );
};

// Simple Fallback Icon helper for typescript compiler safety
const InfoIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);
