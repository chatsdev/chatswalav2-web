/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetDashboardQuery } from "@/src/redux/api/dashboardApi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/redux/hooks";
import CampaignStatsSection from "./CampaignStatsSection";
import CatalogStatsSection from "./CatalogStatsSection";
import ContactYearlyChart from "./ContactYearlyChart";
import { DashboardDateFilter } from "./DashboardDateFilter";
import QuickActionsCard from "./QuickActionsCard";
import StatCards from "./StatCards";
import SubscriptionCard from "./SubscriptionCard";
import TemplateInsightsSection from "./TemplateInsightsSection";
import WabaStatusCard from "./WabaStatusCard";
import WeeklyMessagesChart from "./WeeklyMessagesChart";
import WelcomeCard from "./WelcomeCard";
import confetti from "canvas-confetti";
import { usePermissions } from "@/src/hooks/usePermissions";

const Dashboard = () => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const [filters, setFilters] = useState<{ dateRange: string; startDate?: string; endDate?: string }>({
    dateRange: "this_year",
  });
  const selectedWorkspace = useAppSelector((state) => state.workspace?.selectedWorkspace);
  const workspaceId = selectedWorkspace?._id;

  const { data, isLoading } = useGetDashboardQuery({
    ...filters,
    workspace_id: workspaceId,
  });
  const d = data?.data;

  const enhancedCounts = {
    ...d?.counts,
    totalOrders: d?.catalogData?.ordersFromWhatsApp || 0,
    totalWebhooks: (d?.counts as any)?.totalWebhooks || 0,
  };

  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const isNewRegistration = localStorage.getItem("whatsappcrm_new_registration");
    if (isNewRegistration && btoa(user?.email || "") === isNewRegistration) {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
        zIndex: 9999,
        colors: ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "var(--primary)"],
      });
      localStorage.removeItem("whatsappcrm_new_registration");
    }
  }, [user]);

  return (
    <div className="p-4 pt-0! sm:p-8 space-y-6 bg-(--page-body-bg) min-h-screen dark:bg-(--dark-body)">
      <div className="sticky top-0 z-20 bg-(--page-body-bg) dark:bg-(--dark-body) -mx-4 sm:-mx-8 px-4 sm:px-8 py-4 sm:py-6 transition-all duration-300 mb-0!">
        <div className="flex justify-between items-center flex-wrap gap-3 sm:gap-0">
          <div className="space-y-1">
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t("dashboard_page_title")}</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">{t("dashboard_page_description")}</p>
          </div>
          <div className="flex justify-end items-center gap-4">
            <DashboardDateFilter onFilterChange={setFilters} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        <div className="flex flex-col gap-3 h-full">
          <WelcomeCard />
          <QuickActionsCard />
        </div>
        {hasPermission("view.waba_configuration") && <WabaStatusCard />}
        {hasPermission("view.subscriptions") && (
          <div className="md:col-span-2 xl:col-span-1 flex-1 h-full">
            <SubscriptionCard />
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-bold text-slate-800 dark:text-white tracking-wider">{t("resource_usage")}</h5>
          </div>
          <StatCards section="usage" counts={enhancedCounts as any} isLoading={isLoading} />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h5 className="text-lg font-bold text-slate-800 dark:text-white tracking-wider">{t("real_time_metrics")}</h5>
          </div>
          <StatCards section="metrics" counts={enhancedCounts as any} isLoading={isLoading} />
        </div>
      </div>

      <div className="rounded-lg overflow-hidden shadow-sm border border-slate-100 dark:border-(--card-border-color)">{hasPermission("view.contacts") && <ContactYearlyChart data={d?.contactYearlyChart ?? []} isLoading={isLoading} />}</div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-start">
        {hasPermission("view.campaigns") && (
          <div className="lg:col-span-2 flex-1 h-full">
            <CampaignStatsSection data={d?.campaignStatistics ?? ({} as never)} isLoading={isLoading} filters={filters.dateRange} />
          </div>
        )}
        {hasPermission("view.template") && (
          <div className="lg:col-span-4 flex-1 h-full">
            <TemplateInsightsSection data={d?.templateInsights ?? ({} as never)} isLoading={isLoading} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {hasPermission("manage.conversations") && (
          <div className="lg:col-span-3 flex-1 h-full">
            <WeeklyMessagesChart data={d?.weeklyMessagesChart ?? []} isLoading={isLoading} />
          </div>
        )}
        {hasPermission("view.ecommerce_catalogs") && (
          <div className="lg:col-span-2">
            <CatalogStatsSection data={d?.catalogData ?? ({} as never)} isLoading={isLoading} filters={filters.dateRange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
