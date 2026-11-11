"use client";

import { Button } from "@/src/elements/ui/button";
import { useGetFbAdInsightsQuery } from "@/src/redux/api/facebookApi";
import { ArrowLeft, BarChart3, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import CreativePerformanceTable from "./CreativePerformanceTable";
import InsightsDemographicsChart from "./InsightsDemographicsChart";
import InsightsPlatformsChart from "./InsightsPlatformsChart";
import InsightsStatsGrid from "./InsightsStatsGrid";
import InsightsTrendChart from "./InsightsTrendChart";

const FacebookInsightsDashboard: React.FC = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get("id") || "";
  const level = searchParams.get("level") || "campaign";

  const { data, isLoading, isFetching, refetch } = useGetFbAdInsightsQuery(
    { id, level },
    { skip: !id }
  );

  const insightsData = data?.data;

  return (
    <div className="flex flex-col gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost" size="icon"
            onClick={() => router.back()}
            className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </Button>
          <div className="flex flex-col">
            <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">
              {level} {t("performance_dashboard", "Performance Dashboard")}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            className="rounded-md gap-2 font-semibold border-slate-100 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all active:scale-95 shadow-sm text-sm sm:text-base"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFetching ? "animate-spin" : ""}`} />
            {t("refresh_data", "Refresh Data")}
          </Button>
        </div>
      </div>

      {!id ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl gap-4">
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full">
            <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300 dark:text-slate-700" />
          </div>
          <div className="text-center px-4">
            <h3 className="text-lg sm:text-xl font-black text-slate-800 dark:text-white">{t("invalid_resource", "Invalid Resource")}</h3>
            <p className="text-slate-400 font-bold max-w-xs text-sm sm:text-base">{t("no_id_provided_desc", "No ID was provided. Please select a campaign, ad set, or ad to view insights.")}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 sm:gap-8">
          <InsightsStatsGrid summary={insightsData?.summary} isLoading={isLoading} />

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <InsightsTrendChart data={insightsData?.chart} isLoading={isLoading} />
            </div>
            <div className="col-span-1">
              <InsightsPlatformsChart data={insightsData?.platforms} isLoading={isLoading} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InsightsDemographicsChart data={insightsData?.demographics} isLoading={isLoading} />
            <CreativePerformanceTable data={insightsData?.creative_performance} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FacebookInsightsDashboard;
