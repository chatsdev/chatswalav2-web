"use client";

import { useGetUserSubscriptionQuery } from "@/src/redux/api/subscriptionApi";
import { useGetUserSettingsQuery } from "@/src/redux/api/settingsApi";
import { ArrowRight, Crown, Sparkles, Timer } from "lucide-react";
import { useRouter } from "next/navigation";
import { format, differenceInDays } from "date-fns";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import CurrencyValue from "@/src/shared/CurrencyValue";
import { SUBSCRIPTIONINFO } from "@/src/data";
import { useTranslation } from "react-i18next";
import { ROUTES } from "@/src/constants";

const SubscriptionCard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const { data: subData, isLoading: isSubLoading } = useGetUserSubscriptionQuery();
  const { data: userData, isLoading: isUserLoading } = useGetUserSettingsQuery();

  const subscription = subData?.data;
  const userSettings = userData?.data;

  const isActive = subscription && ["active", "trial"].includes(subscription?.status);
  const isFreeTrial = userSettings?.is_free_trial;
  const trialDaysRemaining = userSettings?.free_trial_days_remaining || 0;

  const planName = typeof subscription?.plan_id === "object" ? subscription?.plan_id?.name : t("professional_plan");

  if (isSubLoading || isUserLoading) {
    return <div className="h-full bg-white dark:bg-(--card-color) rounded-2xl p-7 border border-slate-100 dark:border-(--card-border-color) animate-pulse shadow-sm" />;
  }

  const getRenewalInfo = () => {
    if (!subscription?.current_period_end) return null;
    const endDate = new Date(subscription?.current_period_end);
    const daysLeft = differenceInDays(endDate, new Date());
    const formattedDate = format(endDate, "dd-MM-yyyy");

    let color = "text-slate-500 dark:text-slate-400";
    if (daysLeft <= 10) {
      color = "text-red-500 font-bold";
    } else if (daysLeft <= 30) {
      color = "text-amber-500 font-bold";
    }

    return {
      text: `${t("next_renewal")}: ${formattedDate} (${Math.max(0, daysLeft)} ${t("days_unit")})`,
      color,
    };
  };

  const renewalInfo = getRenewalInfo();

  if (isActive) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plan = typeof subscription?.plan_id === "object" ? (subscription?.plan_id as any) : null;

    return (
      <div className="h-full flex flex-col bg-white dark:bg-(--card-color) rounded-lg sm:p-6 p-4 border border-slate-100 dark:border-(--card-border-color) shadow-sm relative overflow-hidden group transition-all duration-500 hover:shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-amber-400/5 to-transparent rounded-full -mr-16 -mt-16 blur-3xl opacity-30" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 min-w-14 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
              <Crown className="h-7 w-7 text-amber-500" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight mb-2 leading-none">{planName}</h4>
              {renewalInfo && (
                <p className={`text-sm font-medium ${renewalInfo.color}`}>
                  {t("next_renewal")}: {format(new Date(subscription?.current_period_end), "dd-MM-yyyy")} ({Math.max(0, differenceInDays(new Date(subscription?.current_period_end), new Date()))} {t("days_unit")})
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
                <CurrencyValue amount={plan?.price || 0} fromCode={plan?.currency.code || "USD"} fallbackSymbol={plan?.currency.symbol} />
              </span>
              {plan?.billing_cycle !== "lifetime" && <span className="text-sm font-bold text-slate-400">/{plan?.billing_cycle || t("month_unit")}</span>}
            </div>
            <p className="text-[13px] font-semibold text-slate-400 mt-2 tracking-wide">
              {plan?.billing_cycle === "lifetime"
                ? `${t("plan_billing_lifetime") || "Lifetime"} • ${user?.email || t("account_owner")}`
                : `${t("billed_annually").split(" ")[0]} ${plan?.billing_cycle === "year" ? t("billed_annually").split(" ")[1] : t("billed_monthly").split(" ")[1]} • ${user?.email || t("account_owner")}`
              }
            </p>
          </div>

          <div className="mt-auto border-t border-slate-50 dark:border-slate-800/50">
            {plan?.billing_cycle === "lifetime" ? (
              <div className="flex items-center gap-2 py-1 mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("plan_billing_lifetime") || "Lifetime"}</span>
                <span className="text-xs font-medium text-primary">&bull; {t("one_time_payment") || "One-time payment"}</span>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t("renewal_in")}</span>
                  {renewalInfo && (
                    <span className={cn("text-sm font-semibold", renewalInfo.color.includes("red") ? "text-red-500" : "text-primary")}>
                      {Math.max(0, differenceInDays(new Date(subscription?.current_period_end), new Date()))} {t("days_unit").toLowerCase()}
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-(--table-hover) rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      (() => {
                        const daysLeft = differenceInDays(new Date(subscription?.current_period_end), new Date());
                        if (daysLeft <= 10) return "bg-red-400";
                        if (daysLeft <= 30) return "bg-amber-500";
                        return "bg-primary";
                      })()
                    )}
                    style={{
                      width: `${(() => {
                        if (!subscription?.current_period_start || !subscription?.current_period_end) return 10;
                        const start = new Date(subscription?.current_period_start);
                        const end = new Date(subscription?.current_period_end);
                        const total = differenceInDays(end, start);
                        const remaining = differenceInDays(end, new Date());
                        const elapsed = Math.max(0, total - remaining);
                        return Math.min(100, Math.max(10, (elapsed / (total || 1)) * 100));
                      })()}%`,
                    }}
                  />
                </div>
              </>
            )}

            <Button onClick={() => router.push(ROUTES.BillingPlans)} className="w-full mt-4 h-12  text-white  font-medium text-sm rounded-lg border-none shadow-lg transition-all active:scale-95  bg-primary ">
              {t("manage_subscription_plan")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isFreeTrial) {
    return (
      <div className="h-full flex flex-col bg-linear-to-br from-primary/5 to-emerald-500/5 dark:from-primary/10 dark:to-emerald-500/10 rounded-lg sm:p-6 p-4 border border-primary/20 dark:border-primary/20 shadow-sm relative overflow-hidden group transition-all duration-300 min-h-full">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="flex items-center gap-4">
            <div className="sm:p-3.5 p-2 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-primary/20 group-hover:scale-110 transition-transform">
              <Timer size={28} className="text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight">{t("days_trial", { count: trialDaysRemaining })}</h4>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{t("premium_activation_pending")}</p>
            </div>
          </div>

          <div className="my-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-primary/10  flex-1 h-full">
            <ul className="space-y-2">
              {SUBSCRIPTIONINFO.map((feat, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  {t(feat.toLowerCase().replace(/ /g, "_"))}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto">
            <Button onClick={() => router.push(ROUTES.BillingPlans)} className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-primary text-white rounded-lg text-sm font-bold  transition-all shadow-xl shadow-primary/20 active:scale-95 hover:-translate-y-0.5">
              <Sparkles size={16} />
              {t("upgrade_to_premium")}
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-(--card-color) rounded-lg sm:p-6 p-4 dark:border-white/5 shadow-sm relative overflow-hidden group transition-all duration-300 min-h-full hover:shadow-xl">
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-slate-50 dark:bg-white/5 rounded-2xl transition-colors">
            <Crown size={28} className="text-slate-300 dark:text-slate-700 transition-colors" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-bold text-slate-400 dark:text-slate-600 uppercase tracking-tight">{t("no_active_plan")}</h4>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-500 italic">{t("limited_functionality_enabled")}</p>
          </div>
        </div>

        <div className="my-4 flex-1 flex flex-col justify-center">
          <p className="text-center text-[13px] font-medium text-slate-400 dark:text-slate-500 px-4">{t("unlock_full_potential_desc")}</p>
        </div>

        <div className="">
          <Button onClick={() => router.push(ROUTES.BillingPlans)} className="w-full h-12 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-medium group-hover:bg-primary group-hover:text-white dark:hover:bg-primary dark:hover:text-white active:scale-95 transition-all duration-500 hover:shadow-xl">
            <Sparkles size={16} />
            {t("view_subscription_plans")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCard; 
