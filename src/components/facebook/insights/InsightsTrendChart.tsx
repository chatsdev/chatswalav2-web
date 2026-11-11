/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/src/elements/ui/card";
import { InsightsTrendChartProps } from "@/src/types/facebook";
import type { ApexOptions } from "apexcharts";
import { Activity, TrendingUp } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const InsightsTrendChart: React.FC<InsightsTrendChartProps> = ({
  data = [],
  isLoading,
}) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const textColor = isDark ? "#cbd5e1" : "#475569";
  const legendColor = isDark ? "#94a3b8" : "#64748b";

  const categories = data.map((d) => {
    const date = new Date(d.date);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  });

  const series = [
    {
      name: t("spend", "Spend"),
      type: "area",
      data: data.map((d) => d.spend),
    },
    {
      name: t("impressions", "Impressions"),
      type: "line",
      data: data.map((d) => d.impressions),
    },
    {
      name: t("clicks", "Clicks"),
      type: "line",
      data: data.map((d) => d.clicks),
    },
  ];

  const options: ApexOptions = {
    chart: {
      height: 350,
      type: "line",
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#10b981", "#3b82f6", "#f59e0b"],
    stroke: {
      width: [4, 3, 3],
      curve: "smooth",
      dashArray: [0, 5, 5],
    },
    fill: {
      type: ["gradient", "solid", "solid"],
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 100],
      },
    },
    markers: {
      size: [5, 0, 0],
      strokeWidth: 2,
      hover: { size: 7 },
    },
    xaxis: {
      categories,
      labels: {
        style: { colors: textColor, fontSize: "12px", fontWeight: 500 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: t("spend", "Spend ($)"), style: { color: legendColor } },
        labels: {
          formatter: (v) => `$${v.toFixed(0)}`,
          style: { colors: textColor },
        },
      },
      {
        opposite: true,
        title: { text: t("volume", "Volume"), style: { color: legendColor } },
        labels: {
          formatter: (v) => v.toLocaleString(),
          style: { colors: textColor },
        },
      },
    ],
    grid: {
      borderColor: "rgba(148,163,184,0.1)",
      strokeDashArray: 4,
    },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
      fontWeight: 600,
      labels: { colors: legendColor },
      markers: { radius: 12 } as any,
    },
    tooltip: {
      theme: "dark",
      shared: true,
      intersect: false,
      y: {
        formatter: (v, opts) => {
          const seriesIndex = opts?.seriesIndex;
          if (seriesIndex === 0) return `$${v.toFixed(2)}`;
          return v.toLocaleString();
        },
      },
    },
  };

  return (
    <Card className="sm:p-6 p-4 border-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-sm h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-light-primary dark:bg-primary/10 rounded-lg text-primary shrink-0">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-tight">
              {t("performance_trend", "Performance Trend")}
            </h4>
            <p className="text-[11px] sm:text-sm text-slate-400 font-bold">
              {t("last_7_days_analysis", "Daily analysis for the last 7 days")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 bg-slate-50 dark:bg-(--dark-body) rounded-full text-slate-500 self-end sm:self-auto">
          <Activity size={14} className="sm:w-4 sm:h-4" />
          <span className="text-[10px] sm:text-xs font-semibold capitalize tracking-wider">
            {t("live_insights", "Live Insights")}
          </span>
        </div>
      </div>

      <div className="min-h-[300px] relative outline-none">
        {isLoading ? (
          <div className="absolute inset-0 bg-slate-100/50 dark:bg-(--card-color) rounded-lg animate-pulse flex items-center justify-center">
            <p className="text-slate-400 font-bold">
              {t("loading_charts", "Loading charts...")}
            </p>
          </div>
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={300}
          />
        )}
      </div>
    </Card>
  );
};

export default InsightsTrendChart;
