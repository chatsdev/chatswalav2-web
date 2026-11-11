"use client";

import { CampaignFormValues } from "@/src/types/components";
import { FormikProps } from "formik";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Rocket,
  Send,
} from "lucide-react";
import { CardItem } from "./components/CardItem";
import { OneTimeScheduleSection } from "./components/OneTimeScheduleSection";
import { RecurringScheduleSection } from "./components/RecurringScheduleSection";
import { BatchingThrottlingSection } from "./components/BatchingThrottlingSection";
import { useTranslation } from "react-i18next";

const StepScheduling = ({
  formik,
}: {
  formik: FormikProps<CampaignFormValues>;
}) => {
  const { t } = useTranslation();
  const isSendImmediately =
    !formik.values.is_scheduled && !formik.values.is_recurring;
  const isOneTimeScheduled =
    formik.values.is_scheduled && !formik.values.is_recurring;
  const isRecurringScheduled =
    formik.values.is_scheduled && !!formik.values.is_recurring;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-2.5 sm:p-3.5 bg-primary/10 rounded-lg">
          <Clock className="text-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="sm:text-xl text-lg font-bold text-primary ">
            {t("campaign_wizard_scheduling_title")}
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            {t("campaign_wizard_scheduling_desc")}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Three-way scheduling cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardItem
            title={t("campaign_wizard_schedule_immediately")}
            description={t("campaign_wizard_schedule_immediately_desc")}
            icon={<Rocket size={22} />}
            isActive={isSendImmediately}
            onClick={() => {
              formik.setFieldValue("is_scheduled", false);
              formik.setFieldValue("is_recurring", false);
            }}
          />
          <CardItem
            title={t("campaign_wizard_schedule_later")}
            description={t("campaign_wizard_schedule_later_desc")}
            icon={<Calendar size={22} />}
            isActive={isOneTimeScheduled}
            onClick={() => {
              formik.setFieldValue("is_scheduled", true);
              formik.setFieldValue("is_recurring", false);
            }}
          />
          <CardItem
            title={t("campaign_wizard_schedule_recurring")}
            description={t("campaign_wizard_schedule_recurring_desc")}
            icon={<Clock size={22} />}
            isActive={isRecurringScheduled}
            onClick={() => {
              formik.setFieldValue("is_scheduled", true);
              formik.setFieldValue("is_recurring", true);
            }}
          />
        </div>

        {/* Option 1: Send Immediately Info */}
        {isSendImmediately && (
          <div className="p-4 sm:p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--page-body-bg) space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <h3 className="font-bold text-base mb-1 text-slate-800 dark:text-slate-200">
              {t("campaign_wizard_schedule_immediately")}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {t("campaign_wizard_schedule_immediately_info_desc")}
            </p>
          </div>
        )}

        {/* Option 2: One-time Schedule Config */}
        {isOneTimeScheduled && (
          <OneTimeScheduleSection formik={formik} />
        )}

        {/* Option 3: Recurring Schedule Config */}
        {isRecurringScheduled && (
          <RecurringScheduleSection formik={formik} />
        )}

        {/* Batching & Throttling Section (Shown for ALL options) */}
        <BatchingThrottlingSection formik={formik} />
      </div>

      <div className="bg-slate-900 dark:bg-(--table-hover) sm:p-6 p-4 flex-col sm:flex-row rounded-lg flex items-center gap-6 text-white overflow-hidden relative group">
        <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 opacity-10 transition-transform group-hover:scale-110">
          <Send size={240} />
        </div>
        <div className="w-16 h-16 bg-white/10 dark:bg-(--dark-body) backdrop-blur-md rounded-lg flex items-center justify-center shrink-0">
          <CheckCircle2 size={32} className="dark:text-primary" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl mb-2 font-black">{t("campaign_wizard_schedule_ready_title")}</h3>
          <p className="text-white font-medium text-sm">
            {t("campaign_wizard_schedule_ready_desc")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepScheduling;
