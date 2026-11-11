"use client";

import { presets } from "@/src/data/dashboard";
import { DashboardStatCardData } from "@/src/types/dashboard";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import CountUp from "react-countup";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const DashboardStatCard = ({ label, value, icon, color, isLoading, chartData, prefix = "", decimals = 0, className = "", filters }: DashboardStatCardData) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: "area",
      sparkline: { enabled: true },
      animations: { enabled: true },
    },
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [20, 100],
      },
    },
    tooltip: { enabled: false },
    colors: [color.includes("primary") ? "var(--success-green)" : color.includes("orange") ? "var(--orange-500)" : color.includes("emerald") ? "var(--emerald-500)" : color.includes("violet") ? "var(--violet-500)" : color.includes("amber") ? "var(--warning-amber)" : "var(--success-green)"],
  };

  return (
    <div className={`flex-1 h-full bg-white dark:bg-(--dark-body) rounded-lg overflow-hidden border-2 border-slate-100 dark:border-none p-5 transition-all hover:shadow-md group ${className}`}>
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) group-hover:bg-white dark:group-hover:bg-(--table-hover) transition-colors ${color}`}>{icon}</div>
          <span className="text-[14px] font-medium text-slate-500 dark:text-slate-400 tracking-tight lg:line-clamp-1 xl:line-clamp-2">{label}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-4 mt-auto [@media(max-width:1500px)]:flex-wrap">
        <div className="flex-1">
          {isLoading ? (
            <div className="h-8 w-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg mb-1" />
          ) : (
            <h4 className="text-3xl font-black text-slate-800 dark:text-white leading-none mb-2">
              {prefix}
              <CountUp end={value} duration={1.5} separator="," decimals={decimals} />
            </h4>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-medium">{presets.find((item) => item.value === filters)?.label}</span>
          </div>
        </div>

        <div className="w-24 flex items-end [@media(max-width:1500px)]:w-full">
          {!isLoading && (
            <div className="w-full h-full">
              <ReactApexChart options={chartOptions} series={[{ name: label, data: chartData }]} type="area" height={100} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCard;
