import React from "react";
import { CalendarClock, Clock, Info, CheckCircle2 } from "lucide-react";
import { Label } from "@/src/elements/ui/label";
import { Input } from "@/src/elements/ui/input";
import { Switch } from "@/src/elements/ui/switch";

interface StepPublishingProps {
  isScheduled: boolean;
  setIsScheduled: (val: boolean) => void;
  scheduledAt: string;
  setScheduledAt: (val: string) => void;
}

export function StepPublishing({
  isScheduled,
  setIsScheduled,
  scheduledAt,
  setScheduledAt
}: StepPublishingProps) {
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  return (
    <div className="space-y-5">
      <div>
        <Label className="text-md font-semibold text-slate-800 dark:text-gray-200">
          Publishing Options
        </Label>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">
          Configure post release schedules and settings.
        </p>
      </div>

      <div className="space-y-4">
        {/* Toggle container */}
        <div className="flex justify-between items-center p-4 bg-slate-50/50 dark:bg-(--page-body-bg) border border-slate-200/80 dark:border-(--card-border-color) rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CalendarClock size={18} />
            </div>
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold text-gray-900 dark:text-gray-200 cursor-pointer" htmlFor="schedule-toggle">
                Schedule this post
              </Label>
              <p className="text-sm text-slate-400 dark:text-slate-400">
                Choose a future date and time to publish this post.
              </p>
            </div>
          </div>
          <Switch
            id="schedule-toggle"
            checked={isScheduled}
            onCheckedChange={setIsScheduled}
          />
        </div>

        {/* Dynamic State Layout */}
        {!isScheduled ? (
          <div className="p-4 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/25 rounded-lg flex gap-3.5 text-emerald-700 dark:text-emerald-400">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-semibold">Publish Immediately Selected</p>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                Your post content will be published instantly across all selected networks once you click the "Publish Post" button at the bottom.
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 border border-slate-200/80 dark:border-(--card-border-color) rounded-lg space-y-4 bg-slate-50/20 dark:bg-slate-950/10 animate-in fade-in duration-300">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-650 dark:text-slate-350">
                Publication Schedule Date & Time
              </Label>
              <div className="relative">
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="pl-11 h-11 text-sm rounded-lg border-slate-200/80 dark:border-(--card-border-color) focus:ring-2 focus:ring-primary/10 focus:border-primary bg-white dark:bg-(--page-body-bg)"
                />
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              </div>
            </div>

            <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-lg flex gap-2.5 text-amber-700 dark:text-amber-400">
              <Info size={15} className="shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-md font-semibold">Timezone Matching</p>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Post timings are set in your local system timezone: <strong className="text-slate-700 dark:text-slate-350">{localTimezone}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
