import { AllContactsAlertProps } from "@/src/types/campaign";
import { Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export const AllContactsAlert = ({ count, totalCount, avoidUnsubscribers }: AllContactsAlertProps) => {
  const { t } = useTranslation();
  const statusStr = avoidUnsubscribers
    ? t("campaign_wizard_recipients_alert_subscribed")
    : t("campaign_wizard_recipients_alert_active");

  const eligibleOrEntireStr = avoidUnsubscribers
    ? t("campaign_wizard_recipients_alert_eligible")
    : t("campaign_wizard_recipients_alert_entire");

  return (
    <div className="sm:p-8 p-4 rounded-lg bg-primary/5 dark:bg-(--dark-sidebar) flex-col sm:flex-row border border-primary/30 dark:border-none flex items-center gap-6">
      <div className="w-14 h-14 bg-(--light-primary) dark:bg-(--card-color) rounded-lg flex items-center justify-center text-primary">
        <Users size={24} />
      </div>
      <div>
        <p className="font-bold text-blue-900 dark:text-primary">
          {t("campaign_wizard_recipients_alert_targeting", { count, status: statusStr })}
          {avoidUnsubscribers && totalCount !== undefined && totalCount > count && (
            <span className="ml-2 text-xs font-medium text-slate-500">
              {t("campaign_wizard_recipients_alert_excluded", { count: totalCount - count })}
            </span>
          )}
        </p>
        <p className="text-xs text-blue-700/60 dark:text-gray-400 font-medium">
          {t("campaign_wizard_recipients_alert_broadcast_desc", { eligibleOrEntire: eligibleOrEntireStr })}
        </p>
      </div>
    </div>
  );
};
