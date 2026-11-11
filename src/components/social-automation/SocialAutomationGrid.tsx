/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useGetFacebookPagesQuery } from "@/src/redux/api/facebookApi";
import { useFetchSocialMediaMutation, useDeleteSocialAutomationMutation, useRetriggerCommentsMutation } from "@/src/redux/api/socialAutomationApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import {
  AlertCircle,
  Calendar,
  ExternalLink,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Sparkles,
  Video,
  Zap,
  Trash2,
  RotateCw,
  Copy,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ReelPreviewProps } from "@/src/types/socialAutomation";


const ReelPreview: React.FC<ReelPreviewProps> = ({ mediaUrl, thumbnailUrl, mediaType, childrenData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);

  React.useEffect(() => {
    setVideoError(false);
  }, [mediaUrl]);

  const displayImage = thumbnailUrl || mediaUrl;
  const isPlayable = mediaUrl && !mediaUrl.includes("facebook.com/stories/") && !mediaUrl.includes("instagram.com/");

  if (mediaType === "CAROUSEL_ALBUM" && childrenData && childrenData.length > 0) {
    const currentMedia = childrenData[currentIndex];
    const isVideo = currentMedia?.media_type === "VIDEO";
    const currentDisplayImage = (isVideo ? currentMedia?.thumbnail_url : currentMedia?.media_url) || displayImage;
    const isCarouselVideoPlayable = currentMedia?.media_url && !currentMedia.media_url.includes("facebook.com/stories/") && !currentMedia.media_url.includes("instagram.com/");

    return (
      <div
        className="relative w-full h-full cursor-pointer flex items-center justify-center bg-slate-950 dark:bg-(--card-color)"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (childrenData.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % childrenData.length);
          }
        }}
      >
        {isHovered && isVideo && isCarouselVideoPlayable && !videoError ? (
          <video
            src={currentMedia.media_url}
            className="object-cover w-full h-full absolute inset-0 z-10 pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
          />
        ) : null}

        {currentDisplayImage ? (
          <Image
            key={currentDisplayImage}
            src={currentDisplayImage}
            alt="Carousel Media"
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            width={300}
            height={300}
            unoptimized
          />
        ) : (
          <div className="text-slate-500 dark:text-slate-600 flex flex-col items-center gap-2">
            <ImageIcon size={32} />
            <span className="text-xs">No media preview</span>
          </div>
        )}

        {childrenData.length > 1 && (
          <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-1.5 z-20 pointer-events-none drop-shadow-md">
            {childrenData.map((_: any, idx: number) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full shadow-sm transition-all duration-300 ${idx === currentIndex ? "bg-white scale-125" : "bg-white/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (mediaType === "VIDEO" && mediaUrl) {
    return (
      <div
        className="relative w-full h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered && isPlayable && !videoError ? (
          <video
            src={mediaUrl}
            className="object-cover w-full h-full absolute inset-0 z-10 pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
            onError={() => setVideoError(true)}
          />
        ) : null}
        {displayImage ? (
          <Image
            src={displayImage}
            alt="Social Media Reel"
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            width={300}
            height={300}
            unoptimized
          />
        ) : (
          <div className="text-slate-500 dark:text-slate-600 flex flex-col items-center gap-2">
            <Video size={32} />
            <span className="text-xs">No preview</span>
          </div>
        )}
      </div>
    );
  }

  return displayImage ? (
    <Image
      src={displayImage}
      alt="Social Media Post"
      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
      width={300}
      height={300}
      unoptimized
    />
  ) : (
    <div className="text-slate-500 dark:text-slate-600 flex flex-col items-center gap-2">
      <ImageIcon size={32} />
      <span className="text-xs">No media preview</span>
    </div>
  );
};

interface SocialAutomationGridProps {
  platform: "facebook" | "instagram";
  mediaType: "post" | "story" | "reel";
}

const SocialAutomationGrid: React.FC<SocialAutomationGridProps> = ({ platform, mediaType }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  const [search, setSearch] = useState("");
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>("");

  const [fetchMedia, { isLoading, error }] = useFetchSocialMediaMutation();
  const [deleteSocialAutomation, { isLoading: isDeleting }] = useDeleteSocialAutomationMutation();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAutomationId, setSelectedAutomationId] = useState("");

  const { isFeatureEnabled } = useFeatureAccess();
  const [retriggerComments, { isLoading: isRetriggering }] = useRetriggerCommentsMutation();
  const [isRetriggerConfirmOpen, setIsRetriggerConfirmOpen] = useState(false);
  const [selectedMediaId, setSelectedMediaId] = useState("");
  const isRetriggerEnabled = isFeatureEnabled(platform === "facebook" ? "fb_retrigger" : "ig_retrigger");

  // Fetch Facebook Pages if platform is facebook
  const { data: pagesResult, isLoading: isPagesLoading } = useGetFacebookPagesQuery(undefined, {
    skip: platform !== "facebook",
  });
  const pages = pagesResult?.data || [];

  // Auto-select first page when pages list loads
  useEffect(() => {
    if (platform === "facebook" && pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].page_id);
    }
  }, [pages, selectedPageId, platform]);

  const pluralMediaType = mediaType === "story" ? "stories" : mediaType + "s";
  const titleKey = `${platform}_${pluralMediaType}_automation_title`;
  const descKey = `${platform}_${pluralMediaType}_automation_desc`;

  const loadMedia = async (pageIdToUse = selectedPageId) => {
    if (!workspaceId) return;
    // For Facebook, wait for page selection
    if (platform === "facebook" && pages.length > 0 && !pageIdToUse) return;

    try {
      const res = await fetchMedia({
        platform,
        media_type: mediaType,
        workspace_id: workspaceId,
        ...(platform === "facebook" && pageIdToUse ? { page_id: pageIdToUse } : {})
      }).unwrap();

      if (res.success) {
        setMediaItems(res.data || []);
      } else {
        toast.error(res.error || "Failed to fetch media");
      }
    } catch (err: any) {
      console.error("Error loading media:", err);
      toast.error(err?.data?.error || "Failed to connect and fetch media. Please check your channel connection.");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMedia(selectedPageId);
  }, [workspaceId, platform, mediaType, selectedPageId]);

  const filteredItems = mediaItems.filter((item) => {
    const caption = item.caption || "";
    return caption.toLowerCase().includes(search.toLowerCase());
  });

  const handleAction = (item: any) => {
    console.log("[SocialAutomationGrid] handleAction item:", item);
    if (item.has_automation && item.automation_id) {
      router.push(`/social_automation/create?automation_id=${item.automation_id}`);
    } else {
      if (typeof window !== "undefined") {
        const setupData = {
          platform,
          media_type: mediaType,
          media_id: item.id,
          media_url: item.thumbnail_url || item.media_url || "",
          permalink: item.permalink || "",
          caption: item.caption || "",
          suggested_keywords: item.suggested_keywords || [],
        };
        sessionStorage.setItem("chatswala_setup_media_data", JSON.stringify(setupData));
      }

      const queryParams = new URLSearchParams({
        platform,
        media_type: mediaType,
        media_id: item.id,
      });
      console.log("[SocialAutomationGrid] Redirecting to setup with queryParams:", queryParams.toString());
      router.push(`/social_automation/create?${queryParams.toString()}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedAutomationId) return;
    try {
      const res = await deleteSocialAutomation(selectedAutomationId).unwrap();
      if (res.success) {
        toast.success("Automation deleted successfully");
        setIsDeleteDialogOpen(false);
        setSelectedAutomationId("");
        loadMedia(selectedPageId);
      } else {
        toast.error(res.error || "Failed to delete automation");
      }
    } catch (err: any) {
      console.error("Error deleting automation:", err);
      toast.error(err?.data?.error || "Failed to delete automation");
    }
  };

  const handleRetrigger = async () => {
    if (!selectedMediaId) return;
    try {
      const res = await retriggerComments({ media_id: selectedMediaId, platform, workspace_id: workspaceId }).unwrap();
      if (res.success) {
        toast.success("Comments retriggered successfully");
        setIsRetriggerConfirmOpen(false);
        setSelectedMediaId("");
      } else {
        toast.error(res.error || "Failed to retrigger comments");
      }
    } catch (err: any) {
      console.error("Error retriggering comments:", err);
      toast.error(err?.data?.error || "Failed to retrigger comments");
    }
  };

  const rightContent = platform === "facebook" && pages.length > 0 ? (
    <div className="w-64">
      <Select
        value={selectedPageId}
        onValueChange={(val) => {
          setSelectedPageId(val);
        }}
      >
        <SelectTrigger className="w-full h-12 py-6 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) rounded-md shadow-sm">
          <SelectValue placeholder={t("select_facebook_page")} />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-xl">
          {pages.map((p: any) => (
            <SelectItem key={p.page_id} value={p.page_id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-(--table-hover)">
              <div className="flex flex-col text-start py-2 px-2">
                <span className="font-medium">{p.page_name}</span>
                <span className="text-xs text-gray-500">{p.category}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : null;

  return (
    <div className="p-4 sm:p-8 space-y-6 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader
        title={t(titleKey)}
        description={t(descKey)}
        searchTerm={search}
        onSearch={setSearch}
        searchPlaceholder={t("Search by caption...")}
        onRefresh={() => loadMedia(selectedPageId)}
        isLoading={isLoading || isPagesLoading}
        rightContent={rightContent}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-(--card-color) border border-gray-200 dark:border-(--card-border-color) rounded-2xl overflow-hidden shadow-xs animate-pulse">
              <div className="aspect-square bg-gray-200 dark:bg-(--card-color)" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-(--page-body-bg) rounded-sm w-3/4" />
                <div className="h-3 bg-gray-200 dark:bg-(--page-body-bg) rounded-sm w-1/2" />
                <div className="h-9 bg-gray-200 dark:bg-(--page-body-bg) rounded-lg w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-(--card-color) border border-gray-200 dark:border-(--card-border-color) rounded-2xl shadow-xs text-center space-y-4 max-w-lg mx-auto">
          <div className="bg-red-500/10 text-red-600 dark:text-red-400 p-4 rounded-full">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Connection Error</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {typeof error === "object" && "data" in error
              ? (error as any).data?.error || "Unable to fetch media from Meta APIs. Make sure your account is connected."
              : "Unable to fetch media. Check your connection or plan permissions."}
          </p>
          <Button onClick={() => loadMedia(selectedPageId)} className="bg-primary hover:bg-primary text-white font-medium px-6 py-2.5 rounded-lg shadow-sm">
            Try Again
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white dark:bg-(--card-color) border border-gray-200 dark:border-(--card-border-color) rounded-2xl shadow-xs text-center space-y-4">
          <div className="bg-gray-100 dark:bg-(--card-color) text-gray-400 p-5 rounded-full">
            {mediaType === "reel" ? <Video size={36} /> : mediaType === "story" ? <Sparkles size={36} /> : <ImageIcon size={36} />}
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            {search ? "No matches found" : `No ${pluralMediaType} found`}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
            {search
              ? "Try adjusting your keywords or search query to find the desired post."
              : `We couldn't retrieve any active ${pluralMediaType} from your connected page.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => {
            const formattedDate = item.timestamp
              ? new Date(item.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              : "Unknown date";

            return (
              <div
                key={index}
                className="group bg-white dark:bg-(--card-color) border border-gray-200 dark:border-(--card-border-color) rounded-lg overflow-hidden shadow-xs hover:shadow-md hover:border-primary/20 dark:hover:border-primary/30 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Preview Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-(--card-color) flex items-center justify-center">
                  <ReelPreview
                    mediaUrl={item.media_url}
                    thumbnailUrl={item.thumbnail_url}
                    mediaType={item.media_type}
                    childrenData={item.children?.data}
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 group-hover:from-black/90 transition-all duration-300 pointer-events-none" />

                  {/* Upper Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    {/* Media Type Icon */}
                    <div className="bg-black/60 backdrop-blur-md text-white p-2 rounded-lg flex items-center justify-center">
                      {item.media_type === "VIDEO" ? <Video size={14} /> : item.media_type === "CAROUSEL_ALBUM" ? <Copy size={14} /> : <ImageIcon size={14} />}
                    </div>

                    {/* Automation Status Badge */}
                    {item.has_automation ? (
                      <Badge className="bg-primary text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        <Zap size={10} className="fill-current" />
                        Active
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-800/80 backdrop-blur-md text-slate-300 font-bold text-[10px] px-2.5 py-1 rounded-full border border-slate-700/50">
                        No Automation
                      </Badge>
                    )}
                  </div>

                  {/* Permalink Link */}
                  {item.permalink && (
                    <a
                      href={item.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-3 right-3 text-white/70! hover:text-white bg-black/40 hover:bg-black/60 p-2 rounded-xl backdrop-blur-xs transition-all duration-300 shadow-sm"
                      title="View on platform"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}

                  {/* Date on image overlay */}
                  <div className="absolute bottom-3 left-3 text-white/95 flex items-center gap-1.5 text-xs font-semibold drop-shadow-sm pointer-events-none">
                    <Calendar size={12} className="opacity-80" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-4 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Caption */}
                    {mediaType !== "story" && (
                      <p className="text-gray-700 dark:text-gray-400 text-sm font-medium line-clamp-2 h-10 overflow-hidden leading-relaxed">
                        {item.caption || <span className="text-gray-400 dark:text-gray-400">No caption description</span>}
                      </p>
                    )}

                    {/* Suggested Keywords tags */}
                    {item.suggested_keywords && item.suggested_keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.suggested_keywords.slice(0, 3).map((keyword: string) => (
                          <span
                            key={keyword}
                            className="bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-light text-[10px] font-bold px-2 py-0.5 rounded-md border border-primary/10"
                          >
                            #{keyword}
                          </span>
                        ))}
                        {item.suggested_keywords.length > 3 && (
                          <span className="text-gray-400 dark:text-gray-500 text-[10px] font-semibold self-center">
                            +{item.suggested_keywords.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex gap-2 w-full overflow-hidden">
                    <Button
                      onClick={() => handleAction(item)}
                      variant={item.has_automation ? "outline" : "default"}
                      className={`flex-1 py-5 px-2 sm:px-3 lg:px-4 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer shadow-xs active:scale-98 overflow-hidden
                        ${item.has_automation
                          ? "border-primary/30 text-primary dark:text-primary hover:bg-primary/5 dark:hover:bg-primary/10"
                          : "bg-primary hover:bg-primary text-white"
                        }`}
                    >
                      {item.has_automation ? (
                        <>
                          <MessageSquare size={14} className="shrink-0" />
                          <span className="truncate">Manage Automation</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} className="shrink-0" />
                          <span className="truncate">Setup Automation</span>
                        </>
                      )}
                    </Button>

                    {item.has_automation && item.automation_id && isRetriggerEnabled && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMediaId(item.id);
                          setIsRetriggerConfirmOpen(true);
                        }}
                        variant="outline"
                        type="button"
                        className="py-5 px-3 sm:px-4.5 rounded-lg border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:border-(--card-border-color) dark:hover:border-(--card-border-color) dark:hover:bg-(--card-border-color) text-blue-500 hover:text-blue-600 transition-all flex items-center justify-center shrink-0"
                        title="Retrigger Comments"
                      >
                        <RotateCw size={14} className="shrink-0" />
                      </Button>
                    )}

                    {item.has_automation && item.automation_id && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAutomationId(item.automation_id);
                          setIsDeleteDialogOpen(true);
                        }}
                        variant="outline"
                        type="button"
                        className="py-5 px-3 sm:px-4.5 rounded-lg border-red-200 hover:border-red-300 hover:bg-red-50 dark:border-(--card-border-color) dark:hover:border-(--card-border-color) dark:hover:bg-(--card-border-color) text-red-500 hover:text-red-600 transition-all flex items-center justify-center shrink-0"
                        title="Delete Automation"
                      >
                        <Trash2 size={14} className="shrink-0" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Automation?"
        subtitle="Are you sure you want to delete this automation? This action cannot be undone and all associated responses and settings will be permanently removed."
        confirmText="Delete"
      />

      <ConfirmModal
        isOpen={isRetriggerConfirmOpen}
        onClose={() => setIsRetriggerConfirmOpen(false)}
        onConfirm={handleRetrigger}
        isLoading={isRetriggering}
        title="Retrigger Comments?"
        subtitle="This will re-fetch the latest comments from this post and trigger auto-replies for any new comments that match your keyword setup."
        confirmText="Retrigger"
        variant="primary"
      />
    </div>
  );
};

export default SocialAutomationGrid;
