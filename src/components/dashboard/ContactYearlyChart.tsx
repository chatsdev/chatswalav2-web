"use client";

import { ROUTES } from "@/src/constants";
import { MONTH_NAMES } from "@/src/data/dashboard";
import { ContactYearlyChartProps } from "@/src/types/dashboard";
import type { ApexOptions } from "apexcharts";
import { ArrowUpRight, Users } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });



const ContactYearlyChart = ({ data, isLoading }: ContactYearlyChartProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const categories = data.map((d) => {
    const [year, month] = d._id.split("-");
    const monthName = t(MONTH_NAMES[parseInt(month) - 1].toLowerCase());
    return `${monthName} ${year}`;
  });

  // Use bar chart when only 1 data point (area needs 2+ points to render)
  const useBar = data.length <= 1;

  const series = [
    { name: t("lead"), data: data.map((d) => d.lead) },
    { name: t("active"), data: data.map((d) => d.active) },
    { name: t("customer"), data: data.map((d) => d.customer) },
    { name: t("prospect"), data: data.map((d) => d.prospect) },
    { name: t("inactive"), data: data.map((d) => d.inactive) },
  ];

  const commonOptions: ApexOptions = {
    chart: {
      height: 280,
      toolbar: { show: false },
      zoom: { enabled: false },
      background: "transparent",
      fontFamily: "inherit",
      dropShadow: { enabled: !useBar, top: 4, left: 0, blur: 6, color: "var(--success-green)", opacity: 0.15 },
    },
    colors: ["var(--success-green)", "var(--blue-500)", "var(--warning-amber)", "var(--violet-500)", "var(--slate-400)"],
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: { style: { colors: "var(--slate-400)", fontSize: "11px", fontWeight: "500" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: "var(--slate-400)", fontSize: "11px" }, formatter: (v) => String(Math.round(v)) },
      min: 0,
    },
    grid: { borderColor: "rgba(148,163,184,0.12)", strokeDashArray: 4, xaxis: { lines: { show: false } } },
    legend: { position: "top", horizontalAlign: "right", fontSize: "12px", fontWeight: "600", labels: { colors: "var(--slate-400)" }, markers: { size: 6 } },
    tooltip: { theme: "dark", shared: true, intersect: false },
  };

  const areaOptions: ApexOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: "area" },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.02, stops: [0, 95, 100] } },
    stroke: { curve: "smooth", width: 2.5 },
    markers: { size: data.length === 1 ? 6 : 0, strokeWidth: 2, hover: { size: 7 } },
  };

  const barOptions: ApexOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: "bar" },
    plotOptions: { bar: { columnWidth: "40%", borderRadius: 5, borderRadiusApplication: "end" } },
    stroke: { show: false },
  };

  const options = useBar ? barOptions : areaOptions;
  const type = useBar ? "bar" : "area";

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Users size={22} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-800 dark:text-white leading-tight">{t("contact_growth")}</h3>
            <p className="text-sm text-slate-400 font-bold">{t("yearly_status_overview")}</p>
          </div>
        </div>
        <div onClick={() => router.push(ROUTES.ContactDirectory)} className="p-1.5 bg-primary/10 border border-primary/60 rounded-full cursor-pointer">
          <ArrowUpRight size={17} className="text-primary/60" />
        </div>
      </div>
      {isLoading ? <div className="h-70 w-full bg-slate-100 dark:bg-(--card-color) rounded-lg animate-pulse" /> : <ReactApexChart options={options} series={series} type={type} height={280} />}
    </div>
  );
};

export default ContactYearlyChart;
