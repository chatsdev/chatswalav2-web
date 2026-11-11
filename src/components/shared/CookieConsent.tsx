"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Switch } from "@/src/elements/ui/switch";
import { useAppSelector } from "@/src/redux/hooks";
import { CookieIcon, SettingsIcon, ShieldAlertIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { COOKIE_CONSENT_KEY } from "@/src/data/shared";
import { useLogCookieConsentMutation } from "@/src/redux/api/settingsApi";
import { CookiePreferences } from "@/src/types/shared";

export default function CookieConsent() {
  const pathname = usePathname();
  const cookieEnabled = useAppSelector((state) => state.setting.cookie_enabled);
  const [logCookieConsent] = useLogCookieConsentMutation();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytical: true,
    marketing: true,
  });

  useEffect(() => {
    setMounted(true);
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      setVisible(true);
    }
  }, []);

  const isLandingRoute =
    pathname === "/" ||
    pathname === "/landing" ||
    pathname.startsWith("/page/") ||
    pathname.startsWith("/product/") ||
    pathname.startsWith("/channel/") ||
    pathname.startsWith("/auth/") ||
    pathname === "/pricing" ||
    pathname === "/features" ||
    pathname === "/contact" ||
    pathname === "/privacy-policy" ||
    pathname === "/terms";

  if (!mounted || !cookieEnabled || !isLandingRoute || !visible) return null;

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`;
  };

  const handleConsent = async (
    type: "accept" | "decline" | "preferences",
    customPrefs?: CookiePreferences,
  ) => {
    const consentId = `consent_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const finalPrefs = customPrefs || {
      essential: true,
      analytical: type === "accept",
      marketing: type === "accept",
    };

    const consentData = {
      consentId,
      ...finalPrefs,
    };

    // Save locally
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentData));
    setCookie(COOKIE_CONSENT_KEY, JSON.stringify(consentData), 365);

    // Send log to backend
    try {
      await logCookieConsent({
        consent_id: consentId,
        consent_type: type,
        preferences: finalPrefs,
        user_agent: typeof window !== "undefined" ? navigator.userAgent : "",
      }).unwrap();
    } catch (error) {
      console.error("Failed to log cookie consent:", error);
    }

    setVisible(false);
    setShowPreferences(false);

    // Dispatch global event for custom scripts listening to consent updates
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cookie-consent-updated", { detail: finalPrefs }),
      );
    }
  };

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[999] animate-in slide-in-from-bottom-5 duration-300">
        <div className="bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/80 shadow-2xl rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex gap-3 items-start">
            <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
              <CookieIcon className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                Cookie Preferences
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                We use cookies to enhance your browsing experience, serve
                personalized ads or content, and analyze our traffic. By
                clicking &quot;Accept All&quot;, you consent to our use of
                cookies.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 justify-end text-xs">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreferences(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-1 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <SettingsIcon className="size-3.5" />
              Manage Settings
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleConsent("decline")}
              className="w-full sm:w-auto hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Reject All
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleConsent("accept")}
              className="w-full sm:w-auto"
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className="max-w-md bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-zinc-900 dark:text-zinc-50">
              <ShieldAlertIcon className="size-5 text-primary" />
              Customize Consent Preferences
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              You can choose which categories of cookies you want to accept or
              decline. Essential cookies cannot be disabled.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 my-4">
            {/* Essential */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Strictly Necessary Cookies (Always Active)
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  These cookies are essential for website security, user
                  authentication, and basic functions.
                </span>
              </div>
              <Switch checked disabled size="sm" />
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Analytical/Performance Cookies
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  These allow us to count visits, analyze traffic sources, and
                  monitor platform performance to improve user experience.
                </span>
              </div>
              <Switch
                checked={preferences.analytical}
                onCheckedChange={(val) =>
                  setPreferences((prev) => ({ ...prev, analytical: val }))
                }
                size="sm"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800/40">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                  Marketing/Advertising Cookies
                </span>
                <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  These track users across websites to enable display of
                  relevant ads, campaigns, and audience segmentation.
                </span>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(val) =>
                  setPreferences((prev) => ({ ...prev, marketing: val }))
                }
                size="sm"
              />
            </div>
          </div>

          <DialogFooter className="flex sm:flex-row gap-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreferences(false)}
              className="text-xs border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => handleConsent("preferences", preferences)}
              className="text-xs"
            >
              Save Preferences
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
