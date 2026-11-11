"use client";

import React from "react";
import { Card } from "@/src/elements/ui/card";
import { DollarSign, Eye, MousePointer2, Target, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/src/elements/ui/skeleton";
import CountUp from "react-countup";
import { InsightsStatsGridProps } from "@/src/types/facebook";



const InsightsStatsGrid: React.FC<InsightsStatsGridProps> = ({ summary, isLoading }) => {
  const { t } = useTranslation();

  const stats = [
    {
      label: t("total_spend", "Total Spend"),
      value: summary?.total_spend || 0,
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary",
      lightBg: "bg-primary/10",
      prefix: "$",
    },
    {
      label: t("total_impressions", "Impressions"),
      value: summary?.total_impressions || 0,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-600",
      lightBg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      label: t("total_reach", "Reach"),
      value: summary?.total_reach || 0,
      icon: Target,
      color: "text-violet-600",
      bg: "bg-violet-600",
      lightBg: "bg-violet-50 dark:bg-violet-500/10",
    },
    {
      label: t("total_clicks", "Link Clicks"),
      value: summary?.total_clicks || 0,
      icon: MousePointer2,
      color: "text-orange-600",
      bg: "bg-orange-600",
      lightBg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      label: t("cost_per_result", "Cost per Result"),
      value: summary?.cost_per_result || 0,
      icon: TrendingUp,
      color: "text-rose-600",
      bg: "bg-rose-600",
      lightBg: "bg-rose-50 dark:bg-rose-500/10",
      prefix: "$",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="p-4 sm:p-6 border-slate-200 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-sm transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
              <Skeleton className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg" />
              <div className="space-y-2 flex-1 w-full">
                <Skeleton className="h-3 w-16 mx-auto sm:mx-0" />
                <Skeleton className="h-5 w-12 mx-auto sm:mx-0" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid [@media(max-width:728px)]:grid-cols-2! md:grid-cols-3 [@media(max-width:1520px)]:grid-cols-3! 2xl:grid-cols-5! gap-4 sm:gap-6">
      {stats.map((stat, i) => (
        <Card
          key={i}
          className={`sm:p-6 p-4 border-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color) shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${i === 4 ? "col-span-2 md:col-span-1" : ""
            }`}
        >
          {/* Glow Effect */}
          <div
            className={`absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-15 transition-all duration-500 group-hover:opacity-25 ${stat.bg}`}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 text-center sm:text-left">
            <div
              className={`p-2.5 sm:p-3 rounded-lg ${stat.lightBg} ${stat.color} transition-colors shrink-0 group-hover:scale-110 duration-300`}
            >
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider lg:line-clamp-1 xl:line-clamp-2">
                {stat.label}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                {stat.prefix}
                <CountUp end={stat.value} duration={1.5} />
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default InsightsStatsGrid;
