import type { ApexOptions } from "apexcharts";
import { TrendingUp } from "lucide-react";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

interface HourlyChartProps {
  data: Array<{
    hour: string;
    delivered: number;
    read: number;
    replies: number;
  }>;
}

export const HourlyChart = ({ data }: HourlyChartProps) => {
  const categories = data.map((d) => `${d.hour}:00`);
  const series = [
    { name: "Delivered", data: data.map((d) => d.delivered) },
    { name: "Read", data: data.map((d) => d.read) },
    { name: "Replies", data: data.map((d) => d.replies) },
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      background: "transparent",
      fontFamily: "Inter, sans-serif",
    },
    colors: ["#10b981", "#6366f1", "#f59e0b"],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.25,
        opacityTo: 0.01,
        stops: [0, 95, 100],
      },
    },
    stroke: { width: [2.5, 2.5, 2], curve: "smooth" },
    dataLabels: { enabled: false },
    xaxis: {
      categories,
      labels: {
        style: { colors: "var(--slate-500)", fontSize: "9px", fontWeight: 600 },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      forceNiceScale: true,
      labels: {
        style: { colors: "var(--slate-500)", fontSize: "9px", fontWeight: 600 },
        formatter: (v) => String(Math.round(v)),
      },
      min: 0,
    },
    grid: { borderColor: "rgba(148,163,184,0.05)", strokeDashArray: 4 },
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "11px",
      fontWeight: 700,
      labels: { colors: "var(--slate-500)" },
      markers: { size: 6 },
    },
    tooltip: { theme: "dark", shared: true },
  };

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-6 shadow">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={16} className="text-primary" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
          Hourly Engagement Timeline
        </h3>
      </div>
      <div className="relative min-h-76">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={300}
        />
      </div>
    </div>
  );
};
