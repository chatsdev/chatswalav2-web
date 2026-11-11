/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { cn } from "@/src/lib/utils";
import {
  useCancelScheduledPostMutation,
  useDeletePostMutation,
  useGetPostHistoryQuery
} from "@/src/redux/api/socialPublishApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Pagination } from "@/src/shared/Pagination";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar as CalendarIcon, Info, LayoutGrid } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { usePermissions } from "@/src/hooks/usePermissions";
import { PostCard, SkeletonCard } from "./PostCard";
import PostDetailModal from "./PostDetailModal";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  ThreadsIcon,
  TwitterIcon,
  YoutubeIcon,
  getPlatformBrandTextColor,
  getPlatformIcon
} from "./SocialMediaUtils";

const getPlatformGradient = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case "facebook":
      return "linear-gradient(135deg, #1877F2 0%, #0c5bbd 100%)";
    case "instagram":
      return "linear-gradient(135deg, #F09433 0%, #E6683C 25%, #DC2743 50%, #CC2366 75%, #BC1888 100%)";
    case "twitter":
    case "x":
      return "linear-gradient(135deg, #111111 0%, #2d2d2d 100%)";
    case "linkedin":
      return "linear-gradient(135deg, #0A66C2 0%, #074b8f 100%)";
    case "youtube":
      return "linear-gradient(135deg, #FF0000 0%, #b30000 100%)";
    case "threads":
      return "linear-gradient(135deg, #101010 0%, #2c2c2c 100%)";
    default:
      return "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)";
  }
};

export default function SocialMediaActivity() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const canPublish = hasPermission("publish.social_publish");
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const { sidebarToggle } = useAppSelector((state: any) => state.layout);
  const workspaceId = selectedWorkspace?._id;

  // Filter and Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid");

  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    if (viewMode === "calendar" && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const timer = setTimeout(() => {
        calendarApi.updateSize();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [sidebarToggle, viewMode]);

  // Modals state
  const [selectedPostDetails, setSelectedPostDetails] = useState<any | null>(null);
  const [postToDelete, setPostToDelete] = useState<any | null>(null);
  const [postToCancel, setPostToCancel] = useState<any | null>(null);

  // Platforms definition
  const platforms = [
    { id: "all", label: "All Platforms", icon: undefined },
    { id: "facebook", label: "Facebook", icon: FacebookIcon },
    { id: "instagram", label: "Instagram", icon: InstagramIcon },
    { id: "twitter", label: "Twitter", icon: TwitterIcon },
    { id: "linkedin", label: "LinkedIn", icon: LinkedinIcon },
    { id: "youtube", label: "YouTube", icon: YoutubeIcon },
    { id: "threads", label: "Threads", icon: ThreadsIcon },
  ];

  // Queries
  const {
    data: historyRes,
    isLoading: isLoadingHistory,
    isFetching: isFetchingHistory,
    refetch
  } = useGetPostHistoryQuery(
    {
      workspace_id: workspaceId,
      page: viewMode === "calendar" ? 1 : page,
      limit: viewMode === "calendar" ? 1000 : limit,
      search: searchTerm || undefined,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
      platform: selectedPlatform !== "all" ? selectedPlatform : undefined,
      date: selectedDate || undefined
    },
    { skip: !workspaceId }
  );

  // Mutations
  const [cancelScheduledPost, { isLoading: isCancelling }] = useCancelScheduledPostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const posts = useMemo(() => historyRes?.data || [], [historyRes]);
  const totalCount = useMemo(() => historyRes?.pagination?.total || posts.length, [historyRes, posts]);

  const calendarEvents = useMemo(() => {
    return posts.map((post: any) => {
      const postDate = post.scheduled_at || post.published_at || post.created_at;
      const gradient = getPlatformGradient(post.platform);
      
      let color = "#6366f1"; // default indigo
      if (post.platform === "facebook") color = "#1877F2";
      else if (post.platform === "instagram") color = "#E4405F";
      else if (post.platform === "twitter") color = "#1DA1F2";
      else if (post.platform === "linkedin") color = "#0A66C2";
      else if (post.platform === "youtube") color = "#FF0000";
      else if (post.platform === "threads") color = "#000000";

      return {
        id: post._id,
        title: post.caption || "Untitled Post",
        start: postDate,
        extendedProps: { ...post, gradient },
        backgroundColor: color,
        borderColor: color,
      };
    });
  }, [posts]);

  const handleDateClick = (arg: any) => {
    if (!canPublish) return;
    router.push(`${ROUTES.SocialMediaPublish}?date=${encodeURIComponent(arg.dateStr)}`);
  };

  const handleEventClick = (arg: any) => {
    setSelectedPostDetails(arg.event.extendedProps);
  };

  const renderEventContent = (eventInfo: any) => {
    const post = eventInfo.event.extendedProps;
    const PlatformIcon = getPlatformIcon(post.platform);
    const gradient = post.gradient || "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)";
    
    // Status styles
    let statusClass = "";
    if (post.status === "failed") {
      statusClass = "border border-rose-500/50 shadow-[0_0_8px_rgba(239,68,68,0.2)]";
    } else if (post.status === "scheduled") {
      statusClass = "border border-blue-300/40 shadow-[0_0_8px_rgba(147,197,253,0.15)]";
    } else if (post.status === "published") {
      statusClass = "border border-emerald-400/30";
    }

    return (
      <div 
        className={cn(
          "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-white max-w-full font-medium cursor-pointer shadow-md hover:brightness-105 active:scale-[0.98] transition-all w-full select-none",
          statusClass
        )}
        style={{ background: gradient }}
        title={`${post.platform?.toUpperCase()} - ${post.status?.toUpperCase()}: ${post.caption || "Untitled Post"}`}
      >
        <div className="shrink-0 w-4.5 h-4.5 rounded-full flex items-center justify-center bg-white/20 backdrop-blur-xs">
          <PlatformIcon className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="truncate flex-1 font-semibold tracking-wide text-[11px] leading-tight">
          {post.caption || "Untitled Post"}
        </span>
        {post.status === "scheduled" && (
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shrink-0" title="Scheduled" />
        )}
        {post.status === "published" && (
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Published" />
        )}
        {post.status === "failed" && (
          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0 animate-ping" title="Failed" />
        )}
      </div>
    );
  };

  const handleCancelClick = async (post: any) => {
    setPostToCancel(post);
  };

  const handleConfirmCancel = async () => {
    if (!postToCancel) return;
    try {
      const res = await cancelScheduledPost(postToCancel._id).unwrap();
      if (res.success) {
        toast.success("Scheduled post cancelled successfully!");
        setPostToCancel(null);
        refetch();
      } else {
        toast.error(res.error || "Failed to cancel scheduled post");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || "Error cancelling post");
    }
  };

  const handleDeleteClick = (post: any) => {
    setPostToDelete(post);
  };

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      const res = await deletePost(postToDelete._id).unwrap();
      if (res.success) {
        toast.success("Post history record deleted successfully");
        setPostToDelete(null);
        refetch();
      } else {
        toast.error(res.error || "Failed to delete post record");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || "Error deleting post");
    }
  };

  return (
    <div className="bg-(--page-body-bg) dark:bg-(--dark-body) space-y-6 animate-in fade-in duration-500">
      <CommonHeader
        title={t("social_media_activity")}
        description="Monitor, update and track the performance of all your composed posts."
        onSearch={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Search activity..."
        onRefresh={refetch}
        isLoading={isLoadingHistory || isFetchingHistory}
        onAddClick={canPublish ? () => router.push(ROUTES.SocialMediaPublish) : undefined}
        addLabel={canPublish ? "Compose Post" : undefined}
        rightContent={
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === "grid" ? "calendar" : "grid")}
            className="flex items-center gap-2 px-4 h-12 rounded-lg font-medium border border-slate-200 dark:border-(--card-border-color) text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-(--table-hover) cursor-pointer transition-all active:scale-95 mr-2"
          >
            {viewMode === "grid" ? (
              <>
                <CalendarIcon className="w-4 h-4 text-primary" />
                <span>Scheduled Calendar</span>
              </>
            ) : (
              <>
                <LayoutGrid className="w-4 h-4 text-primary" />
                <span>Card View</span>
              </>
            )}
          </Button>
        }
      >
        {/* Platform Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Select
            value={selectedPlatform}
            onValueChange={(value) => {
              setSelectedPlatform(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-44 py-5.5 text-xs font-medium rounded-lg bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) text-slate-700 dark:text-slate-350">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <SelectItem key={p.id} value={p.id}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className={cn("w-3.5 h-3.5", getPlatformBrandTextColor(p.id))} />}
                      <span>{p.label}</span>
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-11 w-40 py-5.5 text-xs font-medium rounded-lg bg-white dark:bg-(--page-body-bg) border border-slate-200 dark:border-(--card-border-color) text-slate-700 dark:text-slate-350">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CommonHeader>

      {/* Content body based on viewMode */}
      {viewMode === "calendar" ? (
        <div className="bg-white dark:bg-(--card-color) border border-slate-200/60 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 full-calendar-container shadow-sm animate-in fade-in duration-300">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={calendarEvents}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            eventDisplay="block"
            height="auto"
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short",
            }}
            dayMaxEvents={true}
          />
        </div>
      ) : isLoadingHistory && posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-16 text-center text-slate-400">
          <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <Info size={24} />
            </div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
              {searchTerm
                ? `No social activity found matching "${searchTerm}"`
                : "No social media posts found. Let's create your first post!"}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {posts.map((post: any) => (
              <PostCard
                key={post._id}
                post={post}
                onDetail={() => setSelectedPostDetails(post)}
                onCancel={() => handleCancelClick(post)}
                onDelete={() => handleDeleteClick(post)}
              />
            ))}
          </div>

          <Pagination
            totalCount={totalCount}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            isLoading={isLoadingHistory || isFetchingHistory}
            total={totalCount}
            className="bg-white dark:bg-(--page-body-bg) border border-slate-200/60 dark:border-(--card-border-color) rounded-lg shadow-xs mt-6"
          />
        </div>
      )}

      {/* DETAIL MODAL: Post Info */}
      <PostDetailModal
        post={selectedPostDetails}
        isOpen={!!selectedPostDetails}
        onClose={() => setSelectedPostDetails(null)}
      />

      {/* Cancel scheduled post confirmation */}
      <ConfirmModal
        isOpen={!!postToCancel}
        onClose={() => setPostToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Scheduled Post"
        subtitle="Are you sure you want to cancel this scheduled post? It will not be published."
        confirmText="Cancel Schedule"
        isLoading={isCancelling}
      />

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Post Record"
        subtitle="Are you sure you want to delete this post from your publishing history? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
