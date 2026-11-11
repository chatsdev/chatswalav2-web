"use client";

import { ROUTES } from "@/src/constants";
import { cn } from "@/src/lib/utils";
import { ChevronRight, MessageSquare, Rocket, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/elements/ui/button";


const QuickActionsCard = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const actions = [
    {
      title: t("campaigns_label"),
      icon: <Rocket size={18} className="text-blue-500" />,
      path: ROUTES.MessageCampaigns,
      color: "blue",
      description: t("campaigns_desc"),
    },
    {
      title: t("tools_label"),
      icon: <Users size={18} className="text-primary" />,
      path: ROUTES.Tools,
      color: "emerald",
      description: t("tools_desc"),
    },
  ];

  return (
    <div className="relative flex-1 overflow-hidden rounded-lg bg-white dark:bg-(--card-color) p-5 border border-slate-100 dark:border-(--card-border-color) shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[12px] font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <MessageSquare size={14} className="text-primary" />
          {t("quick_actions")}
        </h3>
      </div>

      <div className="gap-3 flex flex-col sm:flex-row items-center justify-between [@media(max-width:1461px)]:flex-col [@media(max-width:1461px)]:flex-none! flex-1">
        {actions.map((action, i) => (
          <Button variant="unstyled" key={i} onClick={() => router.push(action.path)} className="w-full flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-none hover:border-primary/30 hover:bg-primary/5 transition-all group">
            <div className="flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", action.color === "blue" && "bg-blue-50 dark:bg-blue-500/10", action.color === "emerald" && "bg-light-primary dark:bg-primary/10", action.color === "amber" && "bg-amber-50 dark:bg-amber-500/10")}>{action.icon}</div>
              <div className="text-left rtl:text-right">
                <p className="text-sm font-bold text-slate-700 dark:text-white lg:line-clamp-1 xl:line-clamp-2">{action.title}</p>
                <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{action.description}</p>
              </div>
            </div>
            <ChevronRight size={14} className="text-slate-300 group-hover:text-primary transition-colors mt-1" />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
