import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { PercentageSliderProps } from "@/src/types/socialAutomation";
import React from "react";

export const PercentageSlider: React.FC<PercentageSliderProps> = ({
  value,
  onChange,
}) => (
  <div className="space-y-3 p-4 bg-amber-50/60 dark:bg-amber-500/5 rounded-lg border border-amber-100 dark:border-amber-500/20">
    <div className="flex items-center justify-between">
      <Label className="text-xs font-bold text-amber-700 dark:text-amber-400">
        Match Sensitivity
      </Label>
      <span className="text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1 rounded-lg">
        {value}%
      </span>
    </div>
    <div className="relative h-2.5">
      <div className="absolute inset-0 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 dark:bg-amber-500 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <Input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-2.5"
      />
    </div>
    <div className="flex justify-between text-[10px] text-amber-500/70 font-bold">
      <span>0% — Any similar</span>
      <span>100% — Exact</span>
    </div>
  </div>
);
