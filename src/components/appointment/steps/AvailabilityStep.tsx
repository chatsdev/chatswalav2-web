import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { AvailabilityStepProps, AppointmentSlot, AppointmentInterval } from "@/src/types/appointment";
import { Clock, Plus, Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const AvailabilityStep: React.FC<AvailabilityStepProps> = ({
  formData,
  toggleDay,
  addInterval,
  removeInterval,
  updateInterval,
}) => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("step_availability")}
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          {t("availability_info_desc", {
            defaultValue: "Define when you are available for appointments.",
          })}
        </p>
      </div>

      <div className="space-y-4">
        {formData.slots?.map((slot: AppointmentSlot, dayIdx: number) => (
          <div
            key={slot.day}
            className="sm:p-5 p-2 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) space-y-4 transition-all hover:border-primary/20"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <Switch
                  checked={slot.is_enabled}
                  onCheckedChange={() => toggleDay(dayIdx)}
                />
                <Label className="text-base font-bold capitalize">
                  {t(slot.day)}
                </Label>
              </div>
              {slot.is_enabled && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addInterval(dayIdx)}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Plus size={14} />
                  {t("add_interval")}
                </Button>
              )}
            </div>

            {slot.is_enabled && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {slot.intervals.length === 0 && (
                  <p className="text-xs text-slate-500 italic ml-14">
                    {t("no_intervals")}
                  </p>
                )}
                {slot.intervals.map((interval: AppointmentInterval, intIdx: number) => (
                  <div
                    key={intIdx}
                    className="flex items-center sm:gap-3 gap-1"
                  >
                    <Input
                      type="time"
                      value={interval.from}
                      onChange={(e) =>
                        updateInterval(dayIdx, intIdx, "from", e.target.value)
                      }
                      className="w-32.5 h-9 dark:bg-(--card-color)"
                    />
                    <span className="text-slate-400">{t("interval_to")}</span>
                    <Input
                      type="time"
                      value={interval.to}
                      onChange={(e) =>
                        updateInterval(dayIdx, intIdx, "to", e.target.value)
                      }
                      className="w-32.5 h-9 dark:bg-(--card-color)"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeInterval(dayIdx, intIdx)}
                      className="h-9 w-9 text-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailabilityStep;
