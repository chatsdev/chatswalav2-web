import { cn } from "@/src/lib/utils";
import { StepIndicatorProps } from "@/src/types/socialAutomation";
import { Check } from "lucide-react";
import React from "react";

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  current,
  total,
  labels,
  onStepClick,
}) => (
  <div className="flex items-center overflow-auto table-custom-scrollbar pb-2">
    {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
      <React.Fragment key={s}>
        <div
          className={cn(
            "flex items-center gap-2 cursor-pointer group transition-all",
            s > current && "opacity-60 hover:opacity-100",
          )}
          onClick={() => onStepClick(s)}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all shrink-0",
              s < current
                ? "bg-primary text-white"
                : s === current
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-slate-100 dark:bg-(--dark-body) text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700",
            )}
          >
            {s < current ? <Check size={14} strokeWidth={3} /> : s}
          </div>
          <span
            className={cn(
              "text-sm font-semibold hidden sm:block",
              s === current
                ? "text-primary"
                : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
            )}
          >
            {labels[s - 1]}
          </span>
        </div>
        {s < total && (
          <div
            className={cn(
              "flex-1 h-0.5 mx-4 rounded-full min-w-8",
              s < current
                ? "bg-primary"
                : "bg-slate-100 dark:bg-(--page-body-bg)",
            )}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);
