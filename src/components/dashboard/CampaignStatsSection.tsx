"use client";

import { CampaignStatsSectionProps } from "@/src/types/dashboard";
import { ArrowUpRight, CheckCircle2, Eye, Megaphone, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import DashboardStatCard from "./DashboardStatCard";
import { ROUTES } from "@/src/constants";

const CampaignStatsSection = ({ data, isLoading, filters }: CampaignStatsSectionProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const getMockData = (key: string) => {
    const trends = {
      totalCampaignsCreated: { value: 12, isUp: true, data: [10, 15, 8, 20, 15, 25, 22, 30] },
      totalSent: { value: 8, isUp: true, data: [20, 25, 30, 25, 35, 40, 38, 45] },
      messagesDelivered: { value: 5, isUp: false, data: [45, 40, 35, 30, 25, 20, 15, 10] },
      messagesRead: { value: 15, isUp: true, data: [5, 10, 15, 12, 18, 25, 22, 30] },
    };
    return trends[key as keyof typeof trends] || { value: 0, isUp: true, data: [10, 10, 10, 10] };
  };

  const STATS_CONFIG = [
    { label: t("total_campaigns_label"), key: "totalCampaignsCreated" as const, icon: <Megaphone size={14} />, color: "text-orange-500" },
    { label: t("messages_sent_label"), key: "totalSent" as const, icon: <Send size={14} />, color: "text-primary" },
    { label: t("delivered_label"), key: "messagesDelivered" as const, icon: <CheckCircle2 size={14} />, color: "text-primary" },
    { label: t("read_label"), key: "messagesRead" as const, icon: <Eye size={14} />, color: "text-violet-500" },
  ];

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-500/10 rounded-lg">
            <Megaphone size={22} className="text-orange-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{t("campaign_statistics")}</h3>
            <p className="text-sm text-slate-400 font-bold">{t("performance_overview")}</p>
          </div>
        </div>
        <div onClick={() => router.push(ROUTES.MessageCampaigns)} className="p-1.5 bg-primary/10 border border-primary/60 rounded-full cursor-pointer">
          <ArrowUpRight size={17} className="text-primary/60" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {STATS_CONFIG.map((stat) => {
          const mock = getMockData(stat.key);
          return <DashboardStatCard key={stat.key} label={stat.label} value={data?.[stat.key] || 0} icon={stat.icon} color={stat.color} isLoading={isLoading} chartData={mock.data} trend={{ value: mock.value, isUp: mock.isUp }} filters={filters} />;
        })}
      </div>
    </div>
  );
};

export default CampaignStatsSection;
