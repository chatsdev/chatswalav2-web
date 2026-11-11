/* eslint-disable @typescript-eslint/no-explicit-any */
import { isToday, isYesterday } from "date-fns";
import { safeFormat, safeParseDate } from "./safeDate";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: string) => safeFormat(date, "MMMM dd, yyyy");
export const formatDateTime = (date: string) => safeFormat(date, "MMMM dd, yyyy | hh:mm aa");

export const formatChatDate = (date: string) => {
  const parsedDate = safeParseDate(date);
  if (isToday(parsedDate)) {
    return "Today";
  }
  if (isYesterday(parsedDate)) {
    return "Yesterday";
  }
  return formatDate(date);
};

export const getStorage = () => ({
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    const value = localStorage.getItem(key);
    if (!value) return null;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
  setItem: (key: string, value: any) => {
    if (typeof window === "undefined") return;
    if (value === undefined || value === null) {
      localStorage.removeItem(key);
      return;
    }
    if (typeof value === "object") {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.clear();
  },
});

export const getToken = () => {
  const storage = getStorage();
  const token = storage.getItem("token"); 
  return token;
};

export const getInitials = (name: string) => {
  return name.trim().charAt(0).toUpperCase();
};

export const getUrlWithBasePath = (path: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (path.startsWith("/")) {
    return `${basePath}${path}`;
  }
  return path;
};

export const isFeaturePlatformAllowed = (key: string, omnichannelPlatforms?: string[]) => {
  if (key === "omnichannel_twitter" || key.startsWith("tw_")) {
    return false;
  }

  const isPlatformFeature =
    key === "omnichannel_facebook" ||
    key.startsWith("fb_") ||
    key === "facebook_lead" ||
    key === "facebookAds_campaign" ||
    key === "omnichannel_instagram" ||
    key.startsWith("ig_") ||
    key === "omnichannel_telegram" ||
    key.startsWith("tg_");

  if (!omnichannelPlatforms) {
    return !isPlatformFeature;
  }

  if (
    key === "omnichannel_facebook" ||
    key.startsWith("fb_") ||
    key === "facebook_lead" ||
    key === "facebookAds_campaign"
  ) {
    return omnichannelPlatforms.includes("facebook");
  }

  if (key === "omnichannel_instagram" || key.startsWith("ig_")) {
    return omnichannelPlatforms.includes("instagram");
  }

  if (key === "omnichannel_telegram" || key.startsWith("tg_")) {
    return omnichannelPlatforms.includes("telegram");
  }

  return true;
};

