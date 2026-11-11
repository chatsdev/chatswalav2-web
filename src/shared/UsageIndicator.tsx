/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from "@/src/redux/hooks";
import { ChartNoAxesColumn } from "lucide-react";
import { USAGE_MAPPING } from "@/src/data/UsageMap";
import { cn } from "@/src/lib/utils";

interface UsageIndicatorProps {
  featureKey: string;
}

const UsageIndicator = ({ featureKey }: UsageIndicatorProps) => {
  const { subscription } = useAppSelector((state) => state.setting);

  if (!subscription || !featureKey) return null;

  const usageData = subscription?.usage || {};
  const planData = (subscription?.plan_id as any)?.features || {};

  const config = (USAGE_MAPPING as any)[featureKey];
  if (!config) return null;

  const used = usageData[featureKey] || 0;
  const limit = planData[config.featureKey];

  if (limit === undefined || limit === false) return null;

  const isUnlimited =
    (typeof limit === "boolean" && limit === true) ||
    (typeof limit === "number" && limit <= 0) ||
    (typeof limit === "string" && (limit === "0" || parseInt(limit, 10) <= 0));
  const limitValue = isUnlimited ? "∞" : typeof limit === "number" ? limit : 0;
  const remaining = isUnlimited ? Infinity : Math.max(0, (typeof limit === "string" ? parseInt(limit, 10) : (limit as number)) - used);
  const percentage = isUnlimited ? 100 : Math.min(100, (remaining / (typeof limit === "string" ? parseInt(limit, 10) : (limit as number))) * 100);

  const Icon = config.icon || ChartNoAxesColumn;

  const getStatusColor = () => {
    if (isUnlimited || percentage > 50) return "emerald";
    if (percentage > 20) return "amber";
    return "rose";  
  };

  const statusColor = getStatusColor();

  return (
    <div className={cn("flex flex-col justify-center px-4 h-12.5 rounded-xl border transition-all duration-500 animate-in fade-in zoom-in-95 group", statusColor === "emerald" ? "bg-light-primary/50 border-[var(--primary-opacity-20)] dark:bg-primary/5 dark:border-primary/20" : statusColor === "amber" ? "bg-amber-50/50 border-amber-100 dark:bg-amber-500/5 dark:border-amber-500/20" : "bg-rose-50/50 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/20")}>
      <div className="flex items-center gap-3">
        <div className={cn("p-1.5 rounded-lg transition-transform duration-500 group-hover:scale-110", statusColor === "emerald" ? "bg-[var(--primary-opacity-20)] text-primary dark:bg-primary/20 dark:text-primary" : statusColor === "amber" ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" : "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400")}>
          <Icon size={14} strokeWidth={2.5} />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-none">Quota Availability</span>
            <span className={cn("text-[10px] font-black leading-none px-1.5 py-0.5 rounded-full", statusColor === "emerald" ? "text-primary bg-[var(--primary-opacity-20)]/50 dark:text-primary" : statusColor === "amber" ? "text-amber-600 bg-amber-100/50 dark:text-amber-400" : "text-rose-600 bg-rose-100/50 dark:text-rose-400")}>{isUnlimited ? "UNLIMITED" : `${Math.round(percentage)}%`}</span>
          </div>
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="text-[16px] font-bold tabular-nums tracking-tighter dark:text-white">{isUnlimited ? "∞" : remaining.toLocaleString()}</span>
            {!isUnlimited && <span className="text-[10px] font-bold text-gray-500 dark:text-gray-600">/ {limitValue}</span>}
          </div>
        </div>
      </div>
      {!isUnlimited && (
        <div className="mt-1.5 w-full h-1 bg-gray-200 dark:bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full transition-all duration-1000 ease-out", statusColor === "emerald" ? "bg-primary" : statusColor === "amber" ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${percentage}%` }} />
        </div>
      )}
    </div>
  );
};

export default UsageIndicator;
