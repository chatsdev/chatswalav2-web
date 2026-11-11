"use client";

import { Badge } from "@/src/elements/ui/badge";
import { DataTable } from "@/src/shared/DataTable";
import { TemplateInsightsSectionData } from "@/src/types/dashboard";
import { Column } from "@/src/types/shared";
import { ArrowUpRight, CheckCircle2, LayoutTemplate, TrendingUp, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import CountUp from "react-countup";
import { ROUTES } from "@/src/constants";

const TemplateInsightsSection = ({ data, isLoading }: TemplateInsightsSectionData) => {
  const { t } = useTranslation();
  const router = useRouter();

  const columns: Column<{ _id: string; template_name: string; sent: string; delivered: string; read: string; status: string; usageCount: number }>[] = [
    {
      header: t("template_identifier"),
      accessorKey: "template_name",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs font-mono">{row.template_name}</span>
        </div>
      ),
    },
    {
      header: t("sent_label_message"),
      accessorKey: "sent",
      cell: (row) => <Badge className={`text-[12px] font-black uppercase tracking-wider border-none px-3 py-1 rounded-full bg-transparent text-primary`}>{row.sent}</Badge>,
    },
    {
      header: t("delivered_label"),
      accessorKey: "delivered",
      cell: (row) => <Badge className={`text-[12px] font-black uppercase tracking-wider border-none px-3 py-1 rounded-full bg-transparent text-amber-500`}>{row.delivered}</Badge>,
    },
    {
      header: t("read_label"),
      accessorKey: "read",
      cell: (row) => <Badge className={`text-[12px] font-black uppercase tracking-wider border-none px-3 py-1 rounded-full bg-transparent text-blue-500`}>{row.read}</Badge>,
    },
    {
      header: t("waba_status_label"),
      accessorKey: "status",
      cell: (row) => <Badge className={`text-[10px] font-black uppercase tracking-wider border-none px-3 py-1 rounded-full ${row.status === "approved" ? "bg-primary/10 text-primary dark:text-primary" : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"}`}>{row.status}</Badge>,
    },
    {
      header: t("usage_label"),
      accessorKey: "usageCount",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <TrendingUp size={12} className="text-primary/60" />
          <span className="font-black text-primary text-sm">{row.usageCount}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-lg">
            <LayoutTemplate size={22} className="text-indigo-500" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{t("template_insights")}</h3>
            <p className="text-sm text-slate-400 font-bold">{t("health_utilization_metrics")}</p>
          </div>
        </div>

        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3 bg-primary/5 dark:bg-primary/10 rounded-lg px-4 py-2 border border-primary/10 transition-transform hover:scale-[1.02] cursor-default">
              <div className="flex items-center gap-2 text-primary dark:text-primary">
                <CheckCircle2 size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">{t("approved")}</span>
              </div>
              {isLoading ? (
                <div className="h-6 w-8 bg-primary/10 dark:bg-(--card-color) rounded animate-pulse" />
              ) : (
                <p className="text-[11px] font-black text-primary dark:text-primary leading-none">
                  <CountUp end={data?.totalTemplatesApproved || 0} duration={1.5} />
                </p>
              )}
            </div>
            <div className="flex items-center gap-3 bg-red-500/5 dark:bg-red-500/10 rounded-lg px-4 py-2 border border-red-500/10 transition-transform hover:scale-[1.02] cursor-default">
              <div className="flex items-center gap-2 text-red-500 dark:text-red-500">
                <XCircle size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest">{t("rejected")}</span>
              </div>
              {isLoading ? (
                <div className="h-6 w-8 bg-red-100 dark:bg-(--card-color) rounded-lg animate-pulse" />
              ) : (
                <p className="text-[11px] font-black text-red-500 dark:text-red-500 leading-none">
                  <CountUp end={data?.rejectedTemplates || 0} duration={1.5} />
                </p>
              )}
            </div>
          </div>
          <div onClick={() => router.push(ROUTES.MessageTemplates)} className="p-1.5 bg-primary/10 border border-primary/60 rounded-full cursor-pointer">
            <ArrowUpRight size={17} className="text-primary/60" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-50/50 dark:bg-(--card-color) rounded-lg p-1 overflow-hidden">
        <DataTable data={data?.mostUsedTemplates || []} columns={columns} isLoading={isLoading} emptyMessage={t("no_template_usage")} className="border-none shadow-none rounded-none bg-transparent" getRowId={(row) => row._id} />
      </div>
    </div>
  );
};

export default TemplateInsightsSection;
