/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { CardHeader } from "@/src/elements/ui/card";
import { ActivePlanCardProps } from "@/src/types/subscription";
import { Calendar, Clock, ShieldCheck, Loader2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { useCancelSubscriptionMutation } from "@/src/redux/api/subscriptionApi";
import { useAppSelector } from "@/src/redux/hooks";
import { toast } from "sonner";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ActivePlanCard: React.FC<ActivePlanCardProps> = ({ currentSubscription }) => {
  const { t } = useTranslation();
  const { setting } = useAppSelector((state) => state.setting);
  const isCancelled = currentSubscription?.cancelled_at && !currentSubscription?.auto_renew;
  const pendingRequest = currentSubscription?.pending_request;
  const [isPayNowLoading, setIsPayNowLoading] = React.useState(false);

  const [cancelSubscription, { isLoading: isCancelling }] = useCancelSubscriptionMutation();

  const handlePayNow = async () => {
    if (!pendingRequest) return;

    if (pendingRequest.payment_gateway === "razorpay") {
      const razorpayKeyId = (pendingRequest as any)?.razorpay_key_id || (currentSubscription as any)?.razorpay_key_id || (setting as any)?.razorpay_key_id;
      const subId = pendingRequest.razorpay_subscription_id;

      if (razorpayKeyId && subId) {
        setIsPayNowLoading(true);
        const isLoaded = await loadRazorpayScript();
        setIsPayNowLoading(false);

        if (isLoaded && (window as any).Razorpay) {
          const options = {
            key: razorpayKeyId,
            subscription_id: subId,
            name: "WhatsDesk",
            description: (pendingRequest.plan_id as any)?.name || "Plan Subscription",
            handler: function () {
              toast.success(t("plan_changed_success") || "Payment completed successfully!");
              window.location.reload();
            },
            modal: {
              ondismiss: function () {
                toast.info(t("payment_cancelled") || "Payment cancelled");
              },
            },
            theme: {
              color: "#25D366",
            },
          };
          
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
          return;
        }
      }
    }

    if (pendingRequest.metadata?.payment_link) {
      window.open(pendingRequest.metadata.payment_link, "_blank", "noopener,noreferrer");
    }
  };

  const handleCancelPending = async () => {
    if (!pendingRequest?._id) return;
    try {
      const res = await cancelSubscription({
        id: pendingRequest._id,
        cancel_at_period_end: false,
      }).unwrap();
      toast.success(res?.message || "Pending request cancelled successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel pending request");
    }
  };

  return (
    <CardHeader className="flex flex-col md:flex-row items-center justify-between p-4 border-b border-slate-100 dark:border-(--card-border-color) gap-6 bg-white dark:bg-(--page-body-bg)">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-6">
        <div className="flex items-center gap-5 sm:mr-auto mr-[unset] flex-col sm:flex-row">
          <div className="w-16 h-16 rounded-lg bg-slate-50 dark:bg-(--dark-body) flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-none">
            <ShieldCheck className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center md:text-left">
            <div className="flex flex-wrap items-center justify-start gap-3">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t("current_plan_label")}</h3>
              <Badge variant="outline" className="border-primary/20 text-primary bg-light-primary dark:bg-transparent font-bold px-3 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
                {(currentSubscription.plan_id as any)?.name || "N/A"}
              </Badge>
            </div>
            <div className="flex items-center justify-start gap-4 mt-1.5 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                {t("status_label")}: <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                <span className="font-bold text-slate-700 dark:text-slate-300">{currentSubscription.status}</span>
              </div>
              {currentSubscription.current_period_end ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="dark:text-gray-400">
                    {isCancelled ? t("expires_prefix") : t("renewing_prefix")}
                    {new Date(currentSubscription.current_period_end).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary dark:text-primary">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t("plan_billing_lifetime") || "Lifetime"} &bull; {t("one_time_payment") || "One-time payment"}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {pendingRequest && (
          <div className="flex-1 max-w-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg p-4 animate-in fade-in slide-in-from-right-4 duration-500 ml-auto">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mt-0.5">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">
                  {pendingRequest.payment_gateway === "manual"
                    ? "Plan Change Pending Admin Approval"
                    : "Payment Pending Completion"}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                  {pendingRequest.payment_gateway === "manual"
                    ? `Your manual payment request for ${(pendingRequest.plan_id as any)?.name || "New Plan"} is pending admin approval.`
                    : `Your subscription request for ${(pendingRequest.plan_id as any)?.name || "New Plan"} via ${pendingRequest.payment_gateway === "razorpay" ? "Razorpay" : pendingRequest.payment_gateway === "stripe" ? "Stripe" : pendingRequest.payment_gateway === "paypal" ? "PayPal" : pendingRequest.payment_gateway === "midtrans" ? "Midtrans" : pendingRequest.payment_gateway} is pending payment completion.`}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  {pendingRequest.metadata?.payment_link && (
                    <Button
                      onClick={handlePayNow}
                      disabled={isPayNowLoading}
                      className="h-8 px-4 text-xs bg-primary hover:bg-primary/95 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                    >
                      {isPayNowLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                      Pay Now
                    </Button>
                  )}
                  <Button
                    onClick={handleCancelPending}
                    disabled={isCancelling}
                    variant="outline"
                    className="h-8 px-4 text-xs bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    {isCancelling ? <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-500" /> : null}
                    Cancel Request
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isCancelled && !pendingRequest && (
          <div className="flex-1 max-w-lg bg-amber-50 dark:bg-orange-900/20 border border-amber-200 dark:border-none rounded-lg p-4 animate-in fade-in slide-in-from-right-4 duration-500 ml-auto">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 dark:bg-orange-400/50 rounded-lg mt-0.5">
                <Calendar className="h-4 w-4 text-amber-600 dark:text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900 dark:text-orange-100">{t("subscription_cancelled_title")}</p>
                <p className="text-xs text-amber-700 dark:text-orange-400 mt-1 leading-relaxed">
                  {t("access_until")} <span className="font-bold">{new Date(currentSubscription.current_period_end).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>. {t("not_charged_again")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CardHeader>
  );
};

export default ActivePlanCard;
