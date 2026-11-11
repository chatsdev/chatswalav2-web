import { DatePicker } from "@/src/elements/ui/date-picker";
import { Label } from "@/src/elements/ui/label";
import { CampaignFormValues } from "@/src/types/components";
import { format, parse } from "date-fns";
import { FormikProps } from "formik";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

interface OneTimeScheduleSectionProps {
  formik: FormikProps<CampaignFormValues>;
}

export const OneTimeScheduleSection = ({
  formik,
}: OneTimeScheduleSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="p-4 sm:p-6 rounded-lg border border-primary/20 bg-light-primary/30 dark:bg-primary/5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-300">
      <h3 className="font-bold text-lg text-primary">
        {t("campaign_wizard_schedule_one_time_title")}
      </h3>
      <div className="space-y-3 max-w-md">
        <Label
          htmlFor="scheduled_at"
          className="text-sm font-medium text-primary"
        >
          {t("campaign_wizard_schedule_pick_date")}
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
            className="h-12 sm:h-13 pl-10 sm:pl-11 font-bold text-sm sm:text-base border-primary/30 bg-white dark:bg-(--page-body-bg)"
          />
          <Calendar
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
            size={16}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};
export default OneTimeScheduleSection;
