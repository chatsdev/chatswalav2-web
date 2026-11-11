/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DEFAULT_WEEK, WEEK_DAYS } from "@/src/data/defaultAction";
import { Button } from "@/src/elements/ui/button";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { cn } from "@/src/lib/utils";
import {
  useGetWorkingHoursQuery,
  useUpsertWorkingHoursMutation,
} from "@/src/redux/api/workingHoursApi";
import {
  DayState,
  WeekState,
  WorkingHoursFormProps,
} from "@/src/types/defaultAction";
import {
  DaySchedule,
  WeekDay,
  WorkingHoursPayload,
} from "@/src/types/workingHours";
import { AlertCircle, ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import DayRow from "./working-hours/DayRow";
import Toggle from "./working-hours/Toggle";

const WorkingHoursForm: React.FC<WorkingHoursFormProps> = ({ wabaId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [weekState, setWeekState] = useState<WeekState>(DEFAULT_WEEK);
  const [isHolidayMode, setIsHolidayMode] = useState(false);
  const initializedWabaId = useRef<string | null>(null);

  const { data, isLoading: isFetching } = useGetWorkingHoursQuery(wabaId, {
    skip: !wabaId,
  });

  const [upsert, { isLoading: isSaving }] = useUpsertWorkingHoursMutation();

  useEffect(() => {
    if (data?.data && initializedWabaId.current !== wabaId) {
      const d = data.data;
      setIsHolidayMode(d.is_holiday_mode ?? false);

      const newState = { ...DEFAULT_WEEK };
      WEEK_DAYS.forEach(({ key }) => {
        const saved = d[key] as DaySchedule | undefined;
        if (saved) {
          newState[key] = {
            status: saved.status as "opened" | "closed",
            hours: saved.hours?.map((h) => ({ from: h.from, to: h.to })) || [],
          };
        }
      });
      setWeekState(newState);
      initializedWabaId.current = wabaId;
    }
  }, [data, wabaId]);

  const updateDay = useCallback((key: WeekDay, s: DayState) => {
    setWeekState((prev) => ({ ...prev, [key]: s }));
  }, []);

  const handleSave = async () => {
    const payload: WorkingHoursPayload = {
      waba_id: wabaId,
      is_holiday_mode: isHolidayMode,
    };
    WEEK_DAYS.forEach(({ key }) => {
      payload[key] = weekState[key];
    });

    try {
      await upsert(payload).unwrap();
      toast.success(t("working_hours_save_success"));
    } catch (err: any) {
      toast.error(err?.data?.message || t("working_hours_save_failed"));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
              {t("working_hours_title")}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {t("working_hours_desc")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="h-11 px-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-slate-400 bg-white dark:bg-(--card-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all font-bold"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || isFetching}
            className="h-11 px-8 rounded-lg bg-primary hover:bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all border-none gap-2"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Save size={18} />
            )}
            {t("save_working_hours")}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 shadow-sm space-y-8">
        <div
          className={cn(
            "flex flex-wrap gap-4 items-center justify-between sm:p-6 p-4 rounded-lg border transition-all",
            isHolidayMode
              ? "bg-amber-50/50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30"
              : "bg-slate-50/50 border-slate-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color)",
          )}
        >
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "p-3 rounded-xl",
                isHolidayMode
                  ? "bg-amber-100 text-amber-600"
                  : "bg-white dark:bg-(--card-color) text-slate-400 shadow-sm border border-slate-100 dark:border-none",
              )}
            >
              <AlertCircle size={24} />
            </div>
            <div>
              <p
                className={cn(
                  "text-base font-bold",
                  isHolidayMode
                    ? "text-amber-800 dark:text-amber-400"
                    : "text-slate-800 dark:text-white",
                )}
              >
                {t("holiday_mode")}
              </p>
              <p
                className={cn(
                  "text-sm mt-1",
                  isHolidayMode
                    ? "text-amber-600 dark:text-amber-400/70"
                    : "text-slate-500",
                )}
              >
                {t("holiday_mode_desc")}
              </p>
            </div>
          </div>
          <Toggle checked={isHolidayMode} onChange={setIsHolidayMode} />
        </div>

        {isFetching && !initializedWabaId.current ? (
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 animate-pulse">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 dark:border-(--card-border-color) p-4 bg-white dark:bg-(--card-color) space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-11 h-6 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="w-20 h-9 rounded-lg" />
                    <Skeleton className="w-20 h-9 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
              {WEEK_DAYS.map((day) => (
                <DayRow
                  key={day.key}
                  day={day}
                  state={weekState[day.key]}
                  onChange={(s) => updateDay(day.key, s)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkingHoursForm;
