/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { cn } from "@/src/lib/utils";
import { useGetAllPlansQuery } from "@/src/redux/api/planApi";
import {
  useCancelSubscriptionMutation,
  useGetUserSubscriptionQuery,
} from "@/src/redux/api/subscriptionApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Plan } from "@/src/types/subscription";
import { LayoutGrid, Settings2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ActivePlanCard from "./ActivePlanCard";
import BillingInfo from "./BillingInfo";
import EmptyState from "./EmptyState";
import ManagePlanModal from "./ManagePlanModal";
import NoPlansState from "./NoPlansState";
import PlanSlider from "./PlanSlider";
import SubscriptionModal from "./SubscriptionModal";
import UsageStatsGrid from "./UsageStatsGrid";
import Can from "../shared/Can";

const Subscription = () => {
  const { t } = useTranslation();
  const { data: subscriptionResponse, isLoading: isSubLoading } =
    useGetUserSubscriptionQuery();
  const { data: plansResponse, isLoading: isPlansLoading } =
    useGetAllPlansQuery({});
  const [cancelSubscription, { isLoading: isCancelling }] =
    useCancelSubscriptionMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showAllPlans, setShowAllPlans] = useState(false);
  const [filterMode, setFilterMode] = useState<
    "upgrade" | "downgrade" | "none"
  >("none");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  const { setting } = useAppSelector((state) => state.setting);
  const isFreeTrialEnabled = setting?.free_trial_enabled ?? false;

  const currentSubscription =
    subscriptionResponse?.data &&
    (!Array.isArray(subscriptionResponse?.data) ||
      subscriptionResponse?.data.length > 0)
      ? subscriptionResponse.data
      : null;
  const allPlans = plansResponse?.data?.plans || [];

  // Filter plans: if isFreeTrialEnabled is false, hide free plans (price === 0)
  const plans = isFreeTrialEnabled
    ? allPlans
    : allPlans.filter((p: Plan) => p.price > 0);

  const handleSubscribe = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  const handleShowUpgrade = () => {
    setFilterMode("upgrade");
    setShowAllPlans(true);
  };

  const handleShowDowngrade = () => {
    setFilterMode("downgrade");
    setShowAllPlans(true);
  };

  const currentPlanPrice = (currentSubscription?.plan_id as any)?.price || 0;

  const filteredPlans = showAllPlans
    ? filterMode === "upgrade"
      ? plans.filter((p: Plan) => p.price > currentPlanPrice)
      : filterMode === "downgrade"
        ? plans.filter((p: Plan) => p.price < currentPlanPrice)
        : plans
    : [];

  const handleCancelSubscription = async () => {
    try {
      const res = await cancelSubscription({
        id: currentSubscription?._id,
        cancel_at_period_end: true,
      }).unwrap();
      toast.success(res?.message || t("cancel_success"));
      setIsConfirmOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("cancel_error"));
    }
  };

  if (isSubLoading || isPlansLoading) {
    return (
      <div className="min-h-full sm:p-8 p-5 space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
        <div className="space-y-6">
          <div className="h-48 w-full bg-white dark:bg-(--card-color) rounded-xl border border-slate-100 dark:border-(--card-border-color) p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-lg" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-white dark:bg-(--card-color) rounded-xl border border-slate-100 dark:border-(--card-border-color) p-6 space-y-3"
              >
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-2 w-full rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const activePlanFeatures =
    currentSubscription?.features &&
    Object.keys(currentSubscription.features).length > 0
      ? { ...currentSubscription.features }
      : { ...((currentSubscription?.plan_id as any)?.features || {}) };
  const enabledFeatures =
    currentSubscription?.enabled_features &&
    Object.keys(currentSubscription.enabled_features).length > 0
      ? { ...currentSubscription.enabled_features }
      : { ...((currentSubscription?.plan_id as any)?.enabled_features || {}) };
  const currentUsage = currentSubscription?.usage || {};

  const isCancelled =
    currentSubscription?.cancelled_at && !currentSubscription?.auto_renew;

  return (
    <div className="min-h-full sm:p-8 p-5 bg-(--page-body-bg) pt-0! dark:bg-(--dark-body) overflow-x-hidden">
      <CommonHeader
        title={
          showAllPlans ? t("available_plans") : t("subscriptions_page_title")
        }
        description={
          showAllPlans
            ? t("available_plans_desc")
            : t("subscriptions_page_description")
        }
        isLoading={isSubLoading}
        backBtn={showAllPlans ? true : false}
        onBack={() => setShowAllPlans(false)}
        rightContent={
          currentSubscription ? (
            <Can permission="update.subscriptions">
              <div className="flex items-center gap-4 flex-wrap">
                {!isCancelled && (
                  <Button
                    onClick={() => setIsManageModalOpen(true)}
                    className="px-6 py-5 h-12 rounded-lg font-bold bg-primary text-white transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Settings2 className="h-4 w-4" />
                    {t("manage_plan")}
                  </Button>
                )}
              </div>
            </Can>
          ) : (
            <Can permission="create.subscriptions">
              <Button
                variant="outline"
                onClick={() => setShowAllPlans(!showAllPlans)}
                className={cn(
                  "flex items-center gap-2.5 px-6! py-5 h-12 rounded-lg font-bold transition-all active:scale-95 group ml-auto sm:ml-0 shadow-sm",
                  showAllPlans
                    ? "bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) text-slate-700 dark:text-slate-200 hover:bg-slate-50"
                    : "bg-primary border-none text-white",
                )}
              >
                {showAllPlans ? (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>{t("my_subscription")}</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="h-4 w-4" />
                    <span>{t("compare_plans")}</span>
                  </>
                )}
              </Button>
            </Can>
          )
        }
      />

      <div className="mx-auto">
        {showAllPlans ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredPlans.length > 0 ? (
              <PlanSlider
                plans={filteredPlans}
                activePlanId={(currentSubscription?.plan_id as any)?._id}
                mode={filterMode}
                onSubscribe={handleSubscribe}
                onBack={() => setShowAllPlans(!showAllPlans)}
                isFreeTrial={isFreeTrialEnabled}
              />
            ) : (
              <NoPlansState
                mode={filterMode}
                onBack={() => setShowAllPlans(false)}
              />
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {currentSubscription ? (
              <div className="space-y-6 mx-auto">
                <Card className="border border-slate-100 dark:border-(--card-border-color) shadow-sm dark:shadow-none bg-white dark:bg-(--page-body-bg) rounded-lg overflow-hidden">
                  <ActivePlanCard currentSubscription={currentSubscription} />

                  <CardContent className="sm:p-6 p-4">
                    <div className="space-y-12">
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                            {t("usage_stats_label")}
                          </p>
                        </div>
                        <UsageStatsGrid
                          currentUsage={currentUsage}
                          activePlanFeatures={activePlanFeatures}
                          enabledFeatures={enabledFeatures}
                        />
                      </div>

                      <BillingInfo currentSubscription={currentSubscription} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <EmptyState onShowPlans={() => setShowAllPlans(true)} />
            )}
          </div>
        )}
      </div>

      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
        mode={filterMode}
        currentSubscriptionId={currentSubscription?._id}
        currentPaymentGateway={currentSubscription?.payment_gateway}
      />

      <ManagePlanModal
        isOpen={isManageModalOpen}
        onOpenChange={setIsManageModalOpen}
        onUpgrade={handleShowUpgrade}
        onDowngrade={handleShowDowngrade}
        onCancel={() => setIsConfirmOpen(true)}
        upgradePlansCount={
          plans.filter((p: Plan) => p.price > currentPlanPrice).length
        }
        downgradePlansCount={
          plans.filter((p: Plan) => p.price < currentPlanPrice).length
        }
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleCancelSubscription}
        isLoading={isCancelling}
        title={t("cancel_confirm_title")}
        subtitle={t("cancel_confirm_subtitle")}
        confirmText={t("cancel_confirm_btn")}
        cancelText={t("keep_plan_btn")}
        variant="danger"
      />
    </div>
  );
};

export default Subscription;
