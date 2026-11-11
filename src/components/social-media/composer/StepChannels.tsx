/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/src/elements/ui/badge";
import { SocialAvatar } from "../SocialAvatar";
import { Label } from "@/src/elements/ui/label";
import {
  AlertTriangle,
  Check,
  Image as ImageIcon,
  Info,
  Play,
  Share2,
  Sparkles,
  Tv,
  Video
} from "lucide-react";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  ThreadsIcon,
  TwitterIcon,
  YoutubeIcon
} from "../SocialMediaUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../SocialPreviews";
import { getPlatformStyle } from "./utils";

interface StepChannelsProps {
  connections: any[];
  selectedAccounts: any[];
  handleAccountToggle: (conn: any) => void;
  intersectedContentTypes: string[];
  selectedContentType: string;
  setSelectedContentType: (type: string) => void;
  onManageChannels: () => void;
}

const getContentFormatDetails = (type: string) => {
  const lower = type?.toLowerCase();
  if (lower === "posts" || lower === "post") {
    return {
      label: "Post",
      description: "Feed post with text or media attachment",
      icon: ImageIcon
    };
  }
  if (lower === "stories" || lower === "story") {
    return {
      label: "Story",
      description: "Ephemeral image or video story",
      icon: Sparkles
    };
  }
  if (lower === "reels" || lower === "reel") {
    return {
      label: "Reels",
      description: "Short vertical immersive video format",
      icon: Video
    };
  }
  if (lower === "videos" || lower === "video") {
    return {
      label: "Video",
      description: "Standard long-form video content upload",
      icon: Play
    };
  }
  if (lower === "shorts" || lower === "short") {
    return {
      label: "Shorts",
      description: "Short vertical Youtube video content",
      icon: Tv
    };
  }
  return {
    label: type,
    description: "Publish content to social channel",
    icon: Share2
  };
};

export function StepChannels({
  connections,
  selectedAccounts,
  handleAccountToggle,
  intersectedContentTypes,
  selectedContentType,
  setSelectedContentType,
  onManageChannels
}: StepChannelsProps) {
  
  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "facebook":
        return <FacebookIcon className="w-2.5 h-2.5 fill-current" />;
      case "instagram":
        return <InstagramIcon className="w-2.5 h-2.5 stroke-[2.5px]" />;
      case "linkedin":
        return <LinkedinIcon className="w-2.5 h-2.5 fill-current" />;
      case "twitter":
      case "x":
        return <TwitterIcon className="w-2.5 h-2.5 fill-current" />;
      case "youtube":
        return <YoutubeIcon className="w-2.5 h-2.5 fill-current" />;
      case "threads":
        return <ThreadsIcon className="w-2.5 h-2.5 fill-current" />;
      default:
        return <Share2 className="w-2.5 h-2.5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Channels List */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 justify-between items-center">
          <div>
            <Label className="text-sm font-semibold text-slate-800 dark:text-gray-200 flex items-center gap-2">
              <span>Select Channels</span>
              <Badge className="text-md font-semibold bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full">
                {selectedAccounts.length} selected
              </Badge>
            </Label>
            <p className="text-sm text-slate-450 dark:text-slate-400 mt-0.5 font-medium">
              Select one or more connected social platforms to publish to.
            </p>
          </div>
          <button
            type="button"
            className="text-xs text-primary font-semibold cursor-pointer bg-transparent border-none p-0"
            onClick={onManageChannels}
          >
            Manage channels
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {connections.map((conn: any) => {
            const isSelected = selectedAccounts.some((acc) => acc._id === conn._id);
            const style = getPlatformStyle(conn.platform);
            return (
              <button
                key={conn._id}
                type="button"
                onClick={() => handleAccountToggle(conn)}
                className={`flex items-center gap-3.5 p-4 rounded-lg border transition-all duration-300 text-left relative overflow-hidden group active:scale-[0.98] ${
                  isSelected
                    ? `${style.border} ${style.bg} ${style.glow}`
                    : "border-slate-200/80 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) hover:border-slate-350 dark:hover:border-(--card-border-color) hover:shadow-xs"
                }`}
              >
                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shadow-sm">
                    <Check size={10} strokeWidth={3} />
                  </div>
                )}

                <div className="relative shrink-0">
                    <SocialAvatar
                      src={conn.profile_picture}
                      name={conn.account_name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-100 dark:border-slate-850 group-hover:scale-105 transition-transform"
                      fallbackClassName="w-11 h-11 rounded-full bg-slate-100 dark:bg-(--dark-body) text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm uppercase group-hover:scale-105 transition-transform"
                    />
                  {/* Platform Icon Badge */}
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md ${style.badgeBg} border-2 border-white dark:border-slate-900`}>
                    {getPlatformIcon(conn.platform)}
                  </div>
                </div>
                
                <div className="pr-4 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {conn.account_name}
                  </p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 font-semibold capitalize mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-(--white)" />
                    {conn.platform}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Publishing Formats (Content Type Selection) */}
      {selectedAccounts.length > 0 && intersectedContentTypes.length > 0 && (
        <div className="space-y-4 pt-5 border-t border-slate-150 dark:border-slate-850">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold text-slate-800 dark:text-gray-200 flex items-center gap-1.5">
              <span>Publishing Formats</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info size={13} className="text-slate-450 cursor-pointer hover:text-slate-650" />
                  </TooltipTrigger>
                  <TooltipContent className="w-64 bg-slate-850 text-white text-xs p-2.5 rounded-lg border border-slate-800 shadow-xl">
                    Publishing format must be supported by all selected channels.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {intersectedContentTypes.map((type) => {
              const isActive = selectedContentType === type;
              const details = getContentFormatDetails(type);
              const Icon = details.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedContentType(type)}
                  className={`flex flex-col items-center justify-center text-center sm:p-5 p-4 rounded-lg border transition-all duration-300 relative group active:scale-[0.98] ${
                    isActive
                      ? "border-primary bg-primary/5 text-primary shadow-xs"
                      : "border-slate-200/80 dark:border-(--card-border-color) bg-white dark:bg-slate-900/30 text-slate-600 dark:text-slate-450 hover:border-slate-350 dark:hover:border-(--card-border-color) hover:shadow-xs"
                  }`}
                >
                  {/* Selection Checkmark */}
                  {isActive && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center text-white shadow-xs">
                      <Check size={9} strokeWidth={3.5} />
                    </div>
                  )}
                  <div className={`p-3 rounded-full mb-3 transition-colors ${isActive ? "bg-primary/10 text-primary" : "bg-slate-50 dark:bg-slate-950/80 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 text-slate-500"}`}>
                    <Icon size={18} />
                  </div>
                  <span className="text-md font-medium capitalize">{details.label}</span>
                  <span className="text-sm text-slate-400 dark:text-slate-500 mt-1 font-medium max-w-[190px] leading-normal">
                    {details.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedAccounts.length > 0 && intersectedContentTypes.length === 0 && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg flex gap-3 text-amber-750 dark:text-amber-400">
          <AlertTriangle className="shrink-0 text-amber-500" size={20} />
          <div className="space-y-1 text-left">
            <p className="text-sm font-black">No Shared Content Types</p>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              The selected accounts do not support any common content type (e.g. YouTube only supports videos/shorts while LinkedIn supports posts). Please select accounts that support matching post types to publish simultaneously.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
