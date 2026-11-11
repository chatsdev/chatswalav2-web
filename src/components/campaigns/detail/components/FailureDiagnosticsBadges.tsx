import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FailureDiagnosticsBadgesProps {
  list: Array<{ reason: string; count: number; percentage: number }>;
}

export const FailureDiagnosticsBadges = ({
  list,
}: FailureDiagnosticsBadgesProps) => {
  if (!list || list.length === 0) {
    return (
      <div className="flex items-center py-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-light-primary text-emerald-750 dark:bg-primary-darker/20 dark:text-primary border border-emerald-250 dark:border-primary-darker/50">
          <CheckCircle2 size={13} className="text-primary" />
          No failures detected
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2.5 py-1">
      {list.slice(0, 6).map((item, idx) => (
        <span
          key={idx}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400 border border-red-250 dark:border-red-900/50"
          title={item.reason}
        >
          <AlertCircle size={13} className="text-red-500 shrink-0" />
          <span className="truncate max-w-[180px] font-bold">
            {item.reason}
          </span>
          <span className="bg-red-100 dark:bg-red-900/50 px-1.5 py-0.2 rounded-full text-[10px] font-black text-red-800 dark:text-red-300">
            {item.count} ({item.percentage}%)
          </span>
        </span>
      ))}
    </div>
  );
};
