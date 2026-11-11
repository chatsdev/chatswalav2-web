"use client";

import { WeeklyMessagesChartData } from "@/src/types/dashboard";
import type { ApexOptions } from "apexcharts";
import { MessageSquare, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const WeeklyMessagesChart = ({ data, isLoading }: WeeklyMessagesChartData) => {
  const { t } = useTranslation();
  const categories = data.map((d) => {
    const date = new Date(d._id);
    const month = t(date.toLocaleDateString("en-US", { month: "short" }).toLowerCase());
    const day = date.toLocaleDateString("en-US", { day: "numeric" });
    return `${month} ${day}`;
  });

  const series = [
    { name: t("incoming"), type: "area" as const, data: data.map((d) => d.incoming) },
    { name: t("outgoing"), type: "bar" as const, data: data.map((d) => d.outgoing) },
    { name: t("activity_index"), type: "line" as const, data: data.map((d) => d.total) },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      height: 320,
      stacked: false,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
      dropShadow: { enabled: true, top: 10, left: 0, blur: 15, color: "var(--success-green)", opacity: 0.1 },
    },
    colors: ["var(--success-green)", "rgba(22,163,74,0.15)", "var(--warning-amber)"],
    fill: {
      type: ["gradient", "solid", "gradient"],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    stroke: { width: [3, 0, 4], curve: "smooth", dashArray: [0, 0, 0] },
    plotOptions: {
      bar: { columnWidth: "35%", borderRadius: 6, borderRadiusApplication: "end" },
    },
    dataLabels: { enabled: false },
    markers: {
      size: [0, 0, 6],
      strokeColors: "#fff",
      strokeWidth: 3,
      strokeOpacity: 1,
      hover: { size: 8 },
    },
    xaxis: {
      categories,
      labels: { style: { colors: "var(--slate-500)", fontSize: "11px", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "var(--slate-500)", fontSize: "11px", fontWeight: 600 }, formatter: (v) => String(Math.round(v)) },
      min: 0,
    },
    grid: { borderColor: "rgba(148,163,184,0.08)", strokeDashArray: 5 },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
      fontWeight: 700,
      labels: { colors: "var(--slate-500)" },
      markers: { size: 8 },
      itemMargin: { horizontal: 10 },
    },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      y: { formatter: (v) => `${v} ${t("messages_unit")}` },
    },
  };

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-8 p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3 sm:gap-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <MessageSquare size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{t("conversation_flow")}</h3>
            <p className="text-sm text-slate-400 font-bold">{t("traffic_analysis_desc")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-light-primary dark:bg-primary-darker/30 rounded-full">
          <Zap size={14} className="text-primary" />
          <span className="text-[10px] font-black text-primary dark:text-primary uppercase tracking-wider">{t("live_tracking")}</span>
        </div>
      </div>

      <div className="relative min-h-80">{isLoading ? <div className="absolute inset-0 bg-slate-50 dark:bg-(--card-color)! rounded-2xl animate-pulse" /> : <ReactApexChart options={options} series={series} type="line" height={320} />}</div>
    </div>
  );
};

export default WeeklyMessagesChart;
