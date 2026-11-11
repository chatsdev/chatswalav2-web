"use client";

import CurrencyValue from "@/src/shared/CurrencyValue";
import { SubscriptionModal } from "@/src/types/subscription";
import { CreditCard, RefreshCcw } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const BillingInfo: React.FC<SubscriptionModal> = ({ currentSubscription }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8 border-t border-slate-100 dark:border-(--card-border-color)">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-(--dark-body) flex items-center justify-center text-slate-500 border border-slate-100 dark:border-none shrink-0">
          <CreditCard className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">{t("payment_details_label")}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white capitalize">
            {currentSubscription.payment_gateway} • {currentSubscription.payment_method || t("secured_card")}
          </p>
          <div className="text-xs font-medium text-slate-500 dark:text-gray-400">
            <CurrencyValue
              amount={currentSubscription.amount_paid}
              fromCode={currentSubscription.currency}
              fallbackSymbol={currentSubscription.currency}
            />{" "}
            {currentSubscription.payment_status}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-(--dark-body) flex items-center justify-center text-slate-500 border border-slate-100 dark:border-none shrink-0">
          <RefreshCcw className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-gray-400">{t("next_billing_cycle")}</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">{currentSubscription.current_period_end ? new Date(currentSubscription.current_period_end).toLocaleDateString(undefined, { month: "long", day: "numeric" }) : "N/A"}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-gray-400">{currentSubscription.auto_renew ? t("renews_automatically") : t("one_time_payment")}</p>
        </div>
      </div>
    </div>
  );
};

export default BillingInfo;
