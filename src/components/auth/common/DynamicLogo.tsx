"use client";

import { Skeleton } from "@/src/elements/ui/skeleton";
import { useGetIsDemoModeQuery } from "@/src/redux/api/authApi";
import { DynamicLogoProps } from "@/src/types/auth";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { getUrlWithBasePath } from "@/src/utils";

const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

const resolveUrl = (url?: string, fallbackUrl: string = "/assets/logos/logo3.png"): string => {
  if (!url || url.length <= 0) return getUrlWithBasePath(fallbackUrl);
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return getUrlWithBasePath(url);
  }
  const cleanUrl = url.replace(/\\/g, "/").startsWith("/") ? url.replace(/\\/g, "/") : `/${url.replace(/\\/g, "/")}`;
  const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
  return getUrlWithBasePath(`${baseUrl}${cleanUrl}`);
};

export const DynamicLogo = ({ width = 200, height = 56, className = "h-14 w-auto object-contain", skeletonClassName = "h-14 w-48 animate-pulse bg-transparent", logoType = "dark" }: DynamicLogoProps) => {
  const { data: demoModeRes, isLoading } = useGetIsDemoModeQuery();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (isLoading) {
    return <Skeleton className={skeletonClassName} />;
  }

  const isDarkTheme = mounted && resolvedTheme === "dark";
  const activeLogoType = logoType === "dark" || isDarkTheme ? "dark" : "light";

  const fallback = activeLogoType === "dark" ? "/assets/logos/logo1.png" : "/assets/logos/logo3.png";
  const logoUrl = resolveUrl(
    activeLogoType === "dark" ? demoModeRes?.logo_dark_url : demoModeRes?.logo_light_url,
    fallback
  );

  return <Image src={logoUrl} alt="App Logo" width={width} height={height} className={className} unoptimized priority />;
};
