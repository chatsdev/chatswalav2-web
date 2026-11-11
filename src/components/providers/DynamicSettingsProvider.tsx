/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { DEFAULT_FAVICON } from "@/src/data/product";
import { useGetAuthPageSetupQuery } from "@/src/redux/api/authApi";
import { useGetSettingsQuery } from "@/src/redux/api/settingsApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setAuthPageSetup, setSetting } from "@/src/redux/reducers/settingSlice";
import { DynamicSettingsProviderProps } from "@/src/types/product";
import { getUrlWithBasePath } from "@/src/utils";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

const resolveUrl = (url?: string): string => {
  if (!url) return "";

  // Replace backslashes with forward slashes for cross-platform compatibility
  const normalizedUrl = url.replace(/\\/g, "/");

  if (normalizedUrl.startsWith("http://") || normalizedUrl.startsWith("https://") || normalizedUrl.startsWith("data:")) {
    return normalizedUrl;
  }

  const baseUrl = (API_URL || "").endsWith("/") ? API_URL.slice(0, -1) : API_URL;

  if (normalizedUrl.startsWith("/uploads/")) {
    return `${baseUrl}${normalizedUrl}`;
  }
  if (normalizedUrl.startsWith("uploads/")) {
    return `${baseUrl}/${normalizedUrl}`;
  }
  if (normalizedUrl.startsWith("/")) {
    return getUrlWithBasePath(normalizedUrl);
  }
  return getUrlWithBasePath(`/${normalizedUrl}`);
};



function applyFavicon(href: string) {
  if (typeof window === "undefined" || !href) return;

  try {
    let normalizedHref = href;
    try {
      normalizedHref = (href.startsWith("http") || href.startsWith("data:")) ? href : new URL(href, window.location.origin).href;
    } catch (e) {
      console.warn("Failed to normalize target favicon href:", href, e);
    }

    const links = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']");

    if (links.length > 0) {
      links.forEach((link: any) => {
        try {
          const linkHref = link.getAttribute("href") || "";
          if (!linkHref) return;

          const normalizedLinkHref = (linkHref.startsWith("http") || linkHref.startsWith("data:"))
            ? linkHref
            : new URL(linkHref, window.location.origin).href;

          if (normalizedLinkHref !== normalizedHref) {
            link.href = href;
          }
        } catch (innerError) {
          console.warn("Failed to normalize icon link href:", link.href, innerError);
          // Safe fallback comparison
          if (link.href !== href) {
            link.href = href;
          }
        }
      });
    } else {
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = href;
      document.head.appendChild(link);
    }
  } catch (outerError) {
    console.error("Error applying favicon:", outerError);
  }
}


const DynamicSettingsProvider = ({ children }: DynamicSettingsProviderProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();
  const { data: settingsData, isLoading, isError, refetch: refetchSettings } = useGetSettingsQuery({}, { refetchOnMountOrArgChange: true });
  const { data: authSetupData, refetch: refetchAuthSetup } = useGetAuthPageSetupQuery(undefined, { refetchOnMountOrArgChange: true });
  const { app_name, favicon_url, app_description, pageTitle, pageDescription, landing_page_enabled, isSettingsLoaded, theme_primary_color, theme_light_background_color } = useAppSelector((state) => state.setting);
  const [mounted, setMounted] = useState(false);
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!isLoading && landing_page_enabled === false) {
      const isLandingRoute = pathname === "/" || pathname === ROUTES.Landing || pathname.startsWith("/product") || pathname.startsWith("/page");
      if (isLandingRoute) {
        router.replace(ROUTES.Login);
      }
    }
  }, [pathname, landing_page_enabled, isLoading, router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    try {
      const cached = localStorage.getItem("app_settings");
      if (cached) {
        const parsed = JSON.parse(cached);
        const settingsToSet = parsed.data || parsed;
        dispatch(setSetting({ ...settingsToSet, maintenance_mode: false }));
      }
    } catch {}
  }, [dispatch]);

  useEffect(() => {
    if (settingsData) {
      const dataToSet = settingsData.data || settingsData;
      dispatch(setSetting(dataToSet));
    }
  }, [settingsData, dispatch]);

  useEffect(() => {
    if (authSetupData?.data) {
      dispatch(setAuthPageSetup(authSetupData.data));
    }
  }, [authSetupData, dispatch]);

  useEffect(() => {
    const isAuthRoute = pathname.startsWith("/auth") || pathname === ROUTES.Login || pathname === ROUTES.SignUp || pathname === ROUTES.ForgotPassword || pathname === ROUTES.OTPVerification || pathname === ROUTES.ResetPassword;

    if (isAuthRoute && !authSetupData && mounted) {
      refetchAuthSetup();
      refetchSettings();
    }
  }, [pathname, authSetupData, mounted, refetchAuthSetup, refetchSettings]);

  useEffect(() => {
    if (mounted && settingsData?.data?.default_theme_mode) {
      const saved = localStorage.getItem("theme");
      if (!saved || saved === "system") {
        setTheme(settingsData.data.default_theme_mode);
      }
    }
  }, [mounted, settingsData, setTheme]);

  useEffect(() => {
    if (!mounted) return;

    let faviconHref = "";
    if (isLoading) {
      if (isSettingsLoaded && favicon_url) {
        const resolved = resolveUrl(favicon_url);
        faviconHref = resolved ? getUrlWithBasePath(resolved) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      } else {
        faviconHref = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
      }
    } else if (isSettingsLoaded) {
      const resolved = resolveUrl(favicon_url);
      faviconHref = resolved ? getUrlWithBasePath(resolved) : getUrlWithBasePath(DEFAULT_FAVICON);
    } else if (isError) {
      faviconHref = getUrlWithBasePath(DEFAULT_FAVICON);
    } else {
      faviconHref = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }

    const applyThemeColors = (primary?: string, lightBg?: string) => {
      const root = document.documentElement;
      if (primary) {
        root.style.setProperty("--primary", primary, "important");
        root.style.setProperty("--text-green-primary", primary, "important");
        root.style.setProperty("--sidebar-primary", primary, "important");
        root.style.setProperty("--ring", primary, "important");
        root.style.setProperty("--sidebar-ring", primary, "important");

        const hexToRgb = (hex: string) => {
          const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
          const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
          return result
            ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : null;
        };

        const rgb = hexToRgb(primary);
        if (rgb) {
          root.style.setProperty("--primary-rgb", rgb, "important");
          root.style.setProperty("--primary-opacity-30", `rgba(${rgb}, 0.34)`, "important");
          root.style.setProperty("--primary-opacity-20", `rgba(${rgb}, 0.20)`, "important");
        }

        root.style.setProperty("--primary-hover", primary, "important");
        root.style.setProperty("--primary-dark", primary, "important");
      }
      if (lightBg) {
        root.style.setProperty("--light-background", lightBg, "important");
      }
    };

    // Title update
    if (isSettingsLoaded) {
      const baseTitle = app_name || t("app_name");
      const fullTitle = pageTitle ? `${pageTitle} | ${baseTitle}` : `${baseTitle} | All-in-One WhatsApp Marketing & Automation Platform`;

      if (document.title !== fullTitle) {
        document.title = fullTitle;
      }

      // Description update
      const description = pageDescription || app_description;
      if (description) {
        let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        if (!meta) {
          meta = document.createElement("meta");
          meta.setAttribute("name", "description");
          document.head.appendChild(meta);
        }
        if (meta.getAttribute("content") !== description) {
          meta.setAttribute("content", description);
        }
      }
      applyThemeColors(theme_primary_color, theme_light_background_color);
    }

    // Favicon update
    if (faviconHref) {
      applyFavicon(faviconHref);
    }
  }, [app_name, app_description, favicon_url, pathname, mounted, pageTitle, pageDescription, t, isSettingsLoaded, isLoading, isError, theme_primary_color, theme_light_background_color]);

  return <>{children}</>;
};

export default DynamicSettingsProvider;
