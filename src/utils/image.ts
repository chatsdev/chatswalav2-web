/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL, ImageBaseUrl, ImagePath } from "@/src/constants";
import { getUrlWithBasePath } from "./index";

export const isAbsoluteUrl = (url: string): boolean => {
  return /^(https?:|data:|\/\/|blob:)/i.test(url);
};
 
export const getResolvedImageUrl = (src: any, fallbackSrc?: string): string => {
  const defaultPlaceholder = `${ImagePath}/default3.png`;

  const getUrl = (): string => {
    if (!src) {
      return fallbackSrc || defaultPlaceholder;
    }

    try {
      let sourceString: string;

      if (typeof src === "string") {
        sourceString = src.trim();
      }
      else if (typeof src === "object" && src !== null) {
        sourceString = (src.src || src.url || "").trim();
      }
      else {
        sourceString = String(src).trim();
      }

      if (!sourceString) {
        return fallbackSrc || defaultPlaceholder;
      }

      if (sourceString.includes("/uploads/")) {
        sourceString = sourceString.substring(sourceString.indexOf("/uploads/"));
      } else if (sourceString.startsWith("uploads/")) {
        sourceString = "/" + sourceString;
      }

      if (isAbsoluteUrl(sourceString)) {
        if (sourceString.includes("/uploads/") && !sourceString.includes("amazonaws.com")) {
          const storageUrl = ImageBaseUrl || API_BASE_URL || "";
          const baseUrl = storageUrl.endsWith("/") ? storageUrl : `${storageUrl}/`;
          const uploadPath = sourceString.substring(sourceString.indexOf("/uploads/"));
          return `${baseUrl}${uploadPath.substring(1)}`;
        }
        return sourceString;
      }

      if (sourceString.startsWith("/assets/")) {
        return sourceString;
      }

      if (sourceString.startsWith(ImagePath)) {
        return sourceString;
      }

      if (sourceString.startsWith("/_next/")) {
        return sourceString;
      }

      const storageUrl = ImageBaseUrl || API_BASE_URL || "";
      const baseUrl = storageUrl.endsWith("/") ? storageUrl : `${storageUrl}/`;

      if (sourceString.startsWith("/uploads/")) {
        return `${baseUrl}${sourceString.substring(1)}`;
      }

      if (sourceString.startsWith("./")) {
        return `${baseUrl}${sourceString.replace("./", "")}`;
      }

      if (sourceString.startsWith("/images/")) {
        return `/assets${sourceString}`;
      }

      if (sourceString.startsWith("/")) {
        return `${ImagePath}${sourceString}`;
      }

      if (!sourceString.includes("/") && sourceString.includes(".")) {
        return `${baseUrl}${sourceString}`;
      }

      return sourceString.includes("/") ? `${baseUrl}${sourceString.replace(/^\//, "")}` : `${ImagePath}/${sourceString}`;
    } catch (error) {
      console.error("Error resolving image source:", error);
      return fallbackSrc || defaultPlaceholder;
    }
  };

  const resolved = getUrl();
  if (resolved && resolved.startsWith("/") && !resolved.startsWith("//")) {
    return getUrlWithBasePath(resolved);
  }
  return resolved;
};
