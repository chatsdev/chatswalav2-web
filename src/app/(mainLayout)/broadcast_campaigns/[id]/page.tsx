"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetCampaignByIdQuery } from "@/src/redux/api/campaignApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { OverviewTab } from "@/src/components/campaigns/detail/OverviewTab";
import { MessagesTab } from "@/src/components/campaigns/detail/MessagesTab";
import { InsightsTab } from "@/src/components/campaigns/detail/InsightsTab";
import { Tabs } from "@/src/elements/ui/tabs";
import { CAMPAIGNDATA } from "@/src/data";
import { AlertCircle, Clock } from "lucide-react";
import { Button } from "@/src/elements/ui/button";


const CampaignDetailPage = () => {
  const params = useParams();
  const id = params.id as string;
  const { data: campaignResult, isLoading } = useGetCampaignByIdQuery(id);
  const [activeTab, setActiveTab] = useState("overview");

  const campaign = campaignResult?.data;

  const stats = campaign?.stats || {
    total_recipients: 0,
    sent_count: 0,
    delivered_count: 0,
    read_count: 0,
    failed_count: 0,
    pending_count: 0,
  };

  const progress =
    stats.total_recipients > 0
      ? Math.round(
          ((stats.total_recipients - stats.pending_count) /
            stats.total_recipients) *
            100,
        )
      : 0;

  const headerTabs = (
    <div className="flex flex-wrap items-center gap-1.5 bg-slate-100/85 dark:bg-(--page-body-bg) p-1.5 rounded-lg border border-slate-200/50 dark:border-(--card-border-color) shadow-xs">
      {CAMPAIGNDATA.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <Button variant="unstyled"
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-primary text-white shadow-sm shadow-primary/10"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );

  return (
    <div className="p-4 sm:p-8 space-y-6 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) min-h-[calc(100vh-4rem)]">
      <CommonHeader
        backBtn
        title={campaign?.name || "Campaign Details"}
        description={
          campaign
            ? `Template: ${campaign.template_name || "-"} • Status: ${campaign.status.toUpperCase()}`
            : "Loading campaign information..."
        }
        rightContent={headerTabs}
      />

      <div className="space-y-6">
        {isLoading ? (
          <div className="bg-white dark:bg-(--card-color) rounded-2xl border border-slate-200/60 dark:border-(--card-border-color) shadow-xs p-6 sm:p-8 h-64 flex flex-col items-center justify-center space-y-4">
            <Clock className="w-10 h-10 text-primary opacity-50 animate-spin" />
            <p className="text-sm font-bold text-slate-400 animate-pulse">
              Loading campaign data...
            </p>
          </div>
        ) : campaign ? (
          <Tabs className="mt-0">
            <OverviewTab
              campaign={campaign}
              stats={stats}
              progress={progress}
              active={activeTab === "overview"}
            />
            <MessagesTab
              campaignId={id}
              active={activeTab === "messages"}
            />
            <InsightsTab campaignId={id} active={activeTab === "insights"} />
          </Tabs>
        ) : (
          <div className="bg-white dark:bg-(--card-color) rounded-2xl border border-slate-200/60 dark:border-(--card-border-color) shadow-xs p-6 sm:p-8 h-64 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <p className="font-bold text-slate-600 dark:text-slate-300">
              Campaign not found
            </p>
            <p className="text-xs font-medium text-slate-400">
              The campaign you requested could not be loaded.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailPage;
