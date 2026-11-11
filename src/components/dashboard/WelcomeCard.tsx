"use client";

import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { getUrlWithBasePath } from "@/src/utils";
import { UserCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const WelcomeCard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t("good_morning");
    if (h < 17) return t("good_afternoon");
    return t("good_evening");
  };

  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-primary via-primary/95 to-primary sm:p-5 p-3 text-white shadow-2xl shadow-primary/30 flex flex-col justify-between transition-all duration-500 hover:shadow-primary/40 group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/15 transition-colors" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full -ml-16 -mb-16 blur-2xl group-hover:bg-primary/30 transition-colors" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold capitalize text-white dark:text-white ">
              {selectedWorkspace?.name} {t("workspace_label")}
            </span>
          </div>
          <Button onClick={() => router.push("/manage_profile")} className="absolute -top-1 -right-1 h-10.5 rtl:right-[unset]! rtl:-left-1 z-10 flex items-center bg-white/15 backdrop-blur-md border border-white/20 rounded-full p-2.5 w-fit hover:bg-white/20 transition-all font-bold text-md">
            <UserCircle size={20} className="text-white dark:text-white group-hover/btn:text-primary transition-colors" />
          </Button>
        </div>

        <div className="mt-5 space-y-1.5">
          <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100/20 dark:bg-slate-100/10 border border-slate-300 mb-1">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white">{greeting()}</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight tracking-tight flex flex-wrap items-center gap-x-2 gap-y-1 text-white dark:text-white">
            <span className="whitespace-nowrap">{t("hello")}</span>
            <span className="capitalize text-white">{user?.name?.split(" ")[0] || t("partner")}</span>
            <Image src={getUrlWithBasePath("/assets/images/greeting.gif")} alt="greeting" width={36} height={36} className="w-8 h-8 sm:w-9 sm:h-9 object-contain ml-0.5" unoptimized />
          </h2>
          <div className="flex items-center gap-2 text-slate-200 dark:text-slate-400">
            <p className="text-sm font-semibold dark:text-white">{formattedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
