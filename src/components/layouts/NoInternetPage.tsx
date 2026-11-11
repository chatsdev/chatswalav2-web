"use client";

import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { NoInternetPageProps } from "@/src/types/components";
import { Loader2, RotateCw, WifiOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NoInternetPage = ({ onRetry, isRetrying = false }: NoInternetPageProps) => {
  const { t } = useTranslation();
  const { app_name, no_internet_title, no_internet_content } = useAppSelector((state) => state.setting);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-dark-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-150 h-150 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-150 h-150 bg-purple-600/15 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-100 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="relative bg-white/3 backdrop-blur-2xl border border-white/10 rounded-lg sm:p-8 p-4 shadow-2xl text-center overflow-hidden flex flex-col items-center space-y-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-linear-to-r from-transparent via-primary/60 to-transparent" />

          <div className="relative">
            <div className="absolute -inset-4 rounded-full border border-primary/20 animate-spin animation-duration-[8s]" />
            <div className="absolute -inset-2 rounded-full border border-dashed border-primary/30 animate-spin animation-duration-[5s] direction-[reverse]" />

            <div className="w-24 h-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center relative z-10">
              <WifiOff className="w-10 h-10 text-primary" />
            </div>

            {isRetrying && (
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-(--border-line-color) animate-spin z-20">
                <RotateCw className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-800 uppercase tracking-widest">Connection Lost</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-[calc(20px+10*((100vw-320px)/1600))]! font-black text-white leading-tight tracking-tight">{no_internet_title || "No Internet Connection"}</h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-sm mx-auto font-medium">{no_internet_content || `It looks like you're offline. Please check your connection to continue using ${app_name || t("app_name")}.`}</p>
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />

          <div className="w-full">
            <Button onClick={onRetry} disabled={isRetrying} className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-95 gap-3 px-4.5 py-5">
              {isRetrying ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Checking connection...
                </>
              ) : (
                <>
                  <RotateCw className="w-5 h-5" />
                  Try Again
                </>
              )}
            </Button>
          </div>

          <p className="text-[11px] font-bold text-slate-500">Make sure your Wi-Fi or mobile data is turned on</p>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-primary/30 blur-sm animate-bounce [animation-delay:0.5s]" />
        <div className="absolute -bottom-3 -left-3 w-4 h-4 rounded-full bg-purple-500/30 blur-sm animate-bounce [animation-delay:1s]" />
      </div>
    </div>
  );
};

export default NoInternetPage;
