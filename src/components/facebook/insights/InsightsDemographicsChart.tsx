/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Users2, PieChart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Card } from "@/src/elements/ui/card";
import { InsightsDemographicsChartProps } from "@/src/types/facebook";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });



const InsightsDemographicsChart: React.FC<InsightsDemographicsChartProps> = ({ data = [], isLoading }) => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const textColor = isDark ? "#cbd5e1" : "#475569";
  const legendColor = isDark ? "#94a3b8" : "#64748b";

  const ageGroups = Array.from(new Set(data.map((d) => d.age))).sort();
  const femaleData = ageGroups.map((age) => data.find((d) => d.age === age && d.gender === "female")?.reach || 0);
  const maleData = ageGroups.map((age) => data.find((d) => d.age === age && d.gender === "male")?.reach || 0);

  const series = [
    { name: t("female", "Female"), data: femaleData },
    { name: t("male", "Male"), data: maleData },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: "60%",
        borderRadius: 4,
        borderRadiusApplication: "end",
      },
    },
    colors: ["#ec4899", "#3b82f6"],
    dataLabels: { enabled: false },
    stroke: { width: 1, colors: ["#fff"] },
    xaxis: {
      categories: ageGroups,
      labels: {
        style: { colors: textColor, fontSize: "12px", fontWeight: 500 },
        formatter: (v: any) => Math.abs(v).toLocaleString(),
      },
    },
    yaxis: {
      labels: { style: { colors: textColor, fontSize: "12px", fontWeight: 500 } },
    },
    grid: {
      borderColor: "rgba(148,163,184,0.1)",
      strokeDashArray: 4,
      xaxis: { lines: { show: true } },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      fontSize: "14px",
      fontWeight: 600,
      labels: { colors: legendColor },
      markers: { size: 6 } as any,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (v) => Math.abs(v).toLocaleString(),
      },
    },
  };

  return (
    <Card className="sm:p-6 p-4 border-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-sm h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="p-2 sm:p-3 bg-pink-50 dark:bg-pink-500/10 rounded-lg text-pink-600 shrink-0">
            <Users2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white leading-tight">{t("audience_demographics", "Audience Demographics")}</h4>
            <p className="text-[11px] sm:text-sm text-slate-400 font-bold">{t("age_gender_reach", "Reach by Age and Gender")}</p>
          </div>
        </div>
        <div className="p-2 bg-slate-50 dark:bg-(--dark-body) rounded-lg text-slate-400 self-end sm:self-auto">
          <PieChart className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
      </div>

      <div className="flex-1 min-h-[245px] relative outline-none">{isLoading ? <div className="absolute inset-0 bg-slate-100/50 dark:bg-(--card-color) dark:border-(--card-border-color) rounded-lg animate-pulse" /> : <ReactApexChart options={options} series={series} type="bar" height={245} />}</div>
    </Card>
  );
};

export default InsightsDemographicsChart;
