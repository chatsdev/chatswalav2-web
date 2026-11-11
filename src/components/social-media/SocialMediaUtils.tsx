/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Info,
  CheckCircle,
  Calendar,
  Loader2,
  XCircle,
  AlertCircle
} from "lucide-react";

// SVG Brand Icons
export const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
  </svg>
);

export const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

export const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.524 3.545 12 3.545 12 3.545s-7.525 0-9.388.51a3.002 3.002 0 0 0-2.11 2.108C0 8.029 0 12 0 12s0 3.971.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.475 20.455 12 20.455 12 20.455s7.524 0 9.388-.51a3.002 3.002 0 0 0 2.11-2.108C24 15.971 24 12 24 12s0-3.971-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const ThreadsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 192 192" width="1em" height="1em" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z"
      fill="currentColor"
    />
  </svg>
);

export const getPlatformIcon = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case "facebook":
      return FacebookIcon;
    case "instagram":
      return InstagramIcon;
    case "twitter":
    case "x":
      return TwitterIcon;
    case "linkedin":
      return LinkedinIcon;
    case "youtube":
      return YoutubeIcon;
    case "threads":
      return ThreadsIcon;
    default:
      return Info;
  }
};

export const getPlatformBadge = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case "facebook":
      return "bg-[#1877F2] text-white border-transparent";
    case "instagram":
      return "bg-gradient-to-tr from-[#FFB13B] via-[#E4405F] to-[#833AB4] text-white border-transparent";
    case "twitter":
    case "x":
      return "bg-black text-white dark:bg-slate-800 border-slate-700";
    case "linkedin":
      return "bg-[#0A66C2] text-white border-transparent";
    case "youtube":
      return "bg-[#FF0000] text-white border-transparent";
    case "threads":
      return "bg-black text-white dark:bg-slate-800 border-slate-700";
    default:
      return "bg-slate-500 text-white border-transparent";
  }
};

export const getPlatformBrandColor = (platformId: string) => {
  switch (platformId) {
    case "facebook":
      return "bg-[#1877F2] text-white border-[#1877F2]";
    case "instagram":
      return "bg-[#E4405F] text-white border-[#E4405F]";
    case "twitter":
      return "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white";
    case "linkedin":
      return "bg-[#0A66C2] text-white border-[#0A66C2]";
    case "youtube":
      return "bg-[#FF0000] text-white border-[#FF0000]";
    case "threads":
      return "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white";
    default:
      return "bg-primary text-white border-primary";
  }
};

export const STATUS_BADGES: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  published: {
    label: "Published",
    bg: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250/30",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle
  },
  scheduled: {
    label: "Scheduled",
    bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-250/30",
    text: "text-blue-700 dark:text-blue-400",
    icon: Calendar
  },
  pending: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-250/30",
    text: "text-amber-700 dark:text-amber-400",
    icon: Loader2
  },
  failed: {
    label: "Failed",
    bg: "bg-rose-50 dark:bg-rose-950/20 border-rose-250/30",
    text: "text-rose-700 dark:text-rose-400",
    icon: XCircle
  },
  cancelled: {
    label: "Cancelled",
    bg: "bg-slate-50 dark:bg-slate-900 border-slate-200",
    text: "text-slate-600 dark:text-slate-400",
    icon: AlertCircle
  }
};

export const getStatusColorConfig = (status: string) => {
  switch (status) {
    case "published":
      return {
        label: "Published",
        icon: CheckCircle,
        bgBorder: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250/30 text-emerald-800 dark:text-emerald-400"
      };
    case "scheduled":
      return {
        label: "Scheduled",
        icon: Calendar,
        bgBorder: "bg-blue-50 dark:bg-blue-950/20 border-blue-250/30 text-blue-800 dark:text-blue-400"
      };
    case "pending":
      return {
        label: "Pending",
        icon: Loader2,
        bgBorder: "bg-amber-50 dark:bg-amber-950/20 border-amber-250/30 text-amber-800 dark:text-amber-400"
      };
    case "failed":
      return {
        label: "Failed",
        icon: XCircle,
        bgBorder: "bg-rose-50 dark:bg-rose-950/20 border-rose-250/30 text-rose-800 dark:text-rose-400"
      };
    default:
      return {
        label: status || "Unknown",
        icon: AlertCircle,
        bgBorder: "bg-slate-50 dark:bg-slate-900 border-slate-200 text-slate-800 dark:text-slate-300"
      };
  }
};

export const isValidUrl = (url: any): boolean => {
  if (typeof url !== "string") return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("/");
};

export const renderCaptionText = (text: string) => {
  if (!text) return <span className="italic text-slate-400 dark:text-slate-600 font-normal">No caption content</span>;
  const hashtagRegex = /(#\w+)/g;
  const parts = text.split(hashtagRegex);
  return parts.map((part, index) => {
    if (part.match(hashtagRegex)) {
      return (
        <span key={index} className="text-primary font-bold hover:underline cursor-pointer">
          {part}
        </span>
      );
    }
    return part;
  });
};

export const getPlatformBrandTextColor = (platformId: string) => {
  switch (platformId?.toLowerCase()) {
    case "facebook":
      return "text-[#1877F2]";
    case "instagram":
      return "text-[#E4405F]";
    case "twitter":
    case "x":
      return "text-slate-800 dark:text-slate-200";
    case "linkedin":
      return "text-[#0A66C2]";
    case "youtube":
      return "text-[#FF0000]";
    case "threads":
      return "text-black dark:text-white";
    default:
      return "text-slate-500";
  }
};
