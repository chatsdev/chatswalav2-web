/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/src/elements/ui/card";
import { InsightsPlatformsChartProps } from "@/src/types/facebook";
import type { ApexOptions } from "apexcharts";
import { Share2, Smartphone } from "lucide-react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import React from "react";
import { useTranslation } from "react-i18next";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const InsightsPlatformsChart: React.FC<InsightsPlatformsChartProps> = ({
  data = [],
  isLoading,
}) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const textColor = isDark ? "#cbd5e1" : "#475569";
  const valueColor = isDark ? "#ffffff" : "#1e293b";

  const series = data.map((d) => d.reach);
  const labels = data.map((d) => {
    if (d.platform === "facebook") return "Facebook";
    if (d.platform === "instagram") return "Instagram";
    return d.platform;
  });

  const options: ApexOptions = {
    chart: {
      type: "donut",
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    labels,
    colors: ["#3b82f6", "#ec4899", "#8b5cf6", "#f59e0b"],
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontWeight: 600,
      labels: { colors: textColor },
      markers: { size: 6 } as any,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            total: {
              show: true,
              label: t("total_reach", "Total Reach"),
              fontSize: "12px",
              fontWeight: 700,
              color: textColor,
              formatter: () =>
                series.reduce((a, b) => a + b, 0).toLocaleString(),
            },
            value: {
              fontSize: "24px",
              fontWeight: 900,
              color: valueColor,
              formatter: (val) => Number(val).toLocaleString(),
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  return (
    <Card className="sm:p-6 p-4 border-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 shrink-0">
            <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-tight">
              {t("platform_breakdown", "Platform Breakdown")}
            </h4>
            <p className="text-[11px] sm:text-sm text-slate-400 font-bold">
              {t("distribution_by_network", "Distribution by Network")}
            </p>
          </div>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-(--dark-body) rounded-lg text-slate-400 self-end sm:self-auto">
          <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative min-h-75 outline-none">
        {isLoading ? (
          <div className="absolute inset-0 bg-slate-100/50 dark:bg-(--card-color) rounded-lg animate-pulse" />
        ) : (
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={300}
          />
        )}
      </div>
    </Card>
  );
};

export default InsightsPlatformsChart;
