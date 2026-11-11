
import { colors } from "@/src/data/campaign";
import { DetailRowProps, StatBoxProps } from "@/src/types/campaign";
import { cn } from "@/src/utils";

export const DetailRow = ({ label, value, icon: Icon }: DetailRowProps) => (
  <div className="flex items-center justify-between pb-3 border-b border-slate-100 [@media(max-width:480px)]:flex-col dark:border-(--card-border-color) last:border-0 last:pb-0">
    <div className="flex items-center gap-2 text-slate-500">
      <div className="p-1.5 bg-slate-100 dark:bg-(--page-body-bg) rounded-lg">
        <Icon size={14} className="text-slate-600 dark:text-gray-500" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wide dark:text-gray-500 text-slate-500">{label}</span>
    </div>
    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{value || "N/A"}</span>
  </div>
);

export const StatBox = ({ label, count, color }: StatBoxProps) => {
  

  return (
    <div className={cn("p-4 rounded-lg border flex flex-col items-center justify-center text-center transition-all hover:shadow-md", colors[color])}>
      <span className="text-2xl font-black tracking-tight">{count}</span>
      <span className="text-[10px] uppercase font-bold opacity-80 mt-1">{label}</span>
    </div>
  );
};
