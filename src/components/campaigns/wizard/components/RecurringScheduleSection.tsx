import { PREDEFINED_CRONS } from "@/src/data/campaign";
import { DatePicker } from "@/src/elements/ui/date-picker";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { CampaignFormValues } from "@/src/types/components";
import { format, parse } from "date-fns";
import { FormikProps } from "formik";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface RecurringScheduleSectionProps {
  formik: FormikProps<CampaignFormValues>;
}

export const RecurringScheduleSection = ({
  formik,
}: { formik: FormikProps<CampaignFormValues> } & RecurringScheduleSectionProps) => {
  const { t } = useTranslation();
  const [isCustomCronSelected, setIsCustomCronSelected] = useState(() => {
    if (!formik.values.cron_expression) return false;
    return !PREDEFINED_CRONS.some(
      (c) => c.value === formik.values.cron_expression,
    );
  });

  const getCronLabel = (cron: { label: string; value: string }) => {
    const key = cron.value === "custom"
      ? "cron_label_custom"
      : `cron_label_${cron.value.replace(/\s+/g, "_").replace(/\*/g, "star").replace(/\//g, "_slash_")}`;
    return t(key, cron.label);
  };

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-primary/20 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <h3 className="font-bold text-lg text-primary">
        {t("campaign_wizard_schedule_recurring_title")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="scheduled_at" className="text-sm font-medium">
            {t("campaign_wizard_schedule_start_date")}
          </Label>
          <div className="relative">
            <DatePicker
              date={
                formik.values.scheduled_at
                  ? parse(
                      formik.values.scheduled_at,
                      "yyyy-MM-dd'T'HH:mm",
                      new Date(),
                    )
                  : undefined
              }
              onChange={(date) =>
                formik.setFieldValue(
                  "scheduled_at",
                  date ? format(date, "yyyy-MM-dd'T'HH:mm") : "",
                )
              }
              showTime={true}
              disabled={{ before: new Date() }}
              className="h-12 pl-10 font-bold text-sm border-primary/30 bg-white dark:bg-(--page-body-bg) w-full"
            />
            <Calendar
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
              size={16}
              aria-hidden="true"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="recurring_end_date" className="text-sm font-medium">
            {t("campaign_wizard_schedule_end_date")}
          </Label>
          <div className="relative">
            <DatePicker
              date={
                formik.values.recurring_end_date
                  ? parse(
                      formik.values.recurring_end_date,
                      "yyyy-MM-dd",
                      new Date(),
                    )
                  : undefined
              }
              onChange={(date) =>
                formik.setFieldValue(
                  "recurring_end_date",
                  date ? format(date, "yyyy-MM-dd") : "",
                )
              }
              disabled={{ before: new Date() }}
              className="h-12 pl-10 font-bold text-sm border-primary/30 bg-white dark:bg-(--page-body-bg) w-full"
            />
            <Calendar
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
              size={16}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="recurring_pattern" className="text-sm font-medium">
            {t("campaign_wizard_schedule_repeat_pattern")}
          </Label>
          <Select
            value={formik.values.recurring_pattern || "daily"}
            onValueChange={(val) => {
              formik.setFieldValue("recurring_pattern", val);
              if (val !== "custom_cron") {
                formik.setFieldValue("cron_expression", "");
              }
            }}
          >
            <SelectTrigger className="h-12 py-5.5 font-semibold text-sm border-primary/30 bg-white dark:bg-(--page-body-bg)">
              <SelectValue placeholder={t("campaign_wizard_schedule_select_repeat_pattern")} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--page-body-bg)">
              <SelectItem className="dark:hover:bg-(--table-hover)" value="daily">
                {t("campaign_wizard_schedule_pattern_daily")}
              </SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="weekly">
                {t("campaign_wizard_schedule_pattern_weekly")}
              </SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="monthly">
                {t("campaign_wizard_schedule_pattern_monthly")}
              </SelectItem>
              <SelectItem
                className="dark:hover:bg-(--table-hover)"
                value="custom_cron"
              >
                {t("campaign_wizard_schedule_pattern_custom")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formik.values.recurring_pattern === "custom_cron" && (
          <div className="space-y-3">
            <Label
              htmlFor="predefined_cron"
              className="text-sm font-medium tracking-widest"
            >
              {t("campaign_wizard_schedule_select_schedule")}
            </Label>
            <Select
              value={
                isCustomCronSelected
                  ? "custom"
                  : formik.values.cron_expression || ""
              }
              onValueChange={(val) => {
                if (val === "custom") {
                  setIsCustomCronSelected(true);
                  const currentVal = formik.values.cron_expression;
                  const wasPredefined = PREDEFINED_CRONS.some(
                    (c) => c.value === currentVal,
                  );
                  if (wasPredefined || !currentVal) {
                    formik.setFieldValue("cron_expression", "* * * * *");
                  }
                } else {
                  setIsCustomCronSelected(false);
                  formik.setFieldValue("cron_expression", val);
                }
              }}
            >
              <SelectTrigger className="h-12 py-5.5 font-semibold text-sm border-primary/30 bg-white dark:bg-(--page-body-bg)">
                <SelectValue placeholder={t("campaign_wizard_schedule_select_cron_interval")} />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--page-body-bg)">
                {PREDEFINED_CRONS.map((cron) => (
                  <SelectItem key={cron.value} value={cron.value}>
                    {getCronLabel(cron)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {formik.values.recurring_pattern === "custom_cron" &&
        isCustomCronSelected && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label
              htmlFor="cron_expression"
              className="text-xs font-black text-primary"
            >
              {t("campaign_wizard_schedule_enter_custom_cron")}
            </Label>
            <Input
              id="cron_expression"
              name="cron_expression"
              placeholder="e.g. 0 9 * * 1 (Every Monday at 9:00 AM)"
              value={formik.values.cron_expression || ""}
              onChange={formik.handleChange}
              className="h-12 font-bold text-sm border-primary/30 bg-white dark:bg-(--page-body-bg)"
            />
            <p className="text-[11px] text-slate-400 font-medium ml-1">
              {t("campaign_wizard_schedule_cron_format_desc")}
            </p>
          </div>
        )}
    </div>
  );
};
export default RecurringScheduleSection;
