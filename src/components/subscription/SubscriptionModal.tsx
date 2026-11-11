/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PAYMENTMETHODLIST } from "@/src/data";
import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import { useChangePlanSubscriptionMutation, useCreateManualSubscriptionMutation, useCreatePayPalSubscriptionMutation, useCreateRazorpaySubscriptionMutation, useCreateStripeSubscriptionMutation, useCreateMidtransSubscriptionMutation, useCreateMollieSubscriptionMutation } from "@/src/redux/api/subscriptionApi";
import CurrencyValue from "@/src/shared/CurrencyValue";
import { SubscriptionModalProps } from "@/src/types/subscription";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ManualPaymentModal from "./ManualPaymentModal";

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

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, selectedPlan, mode = "none", currentSubscriptionId, currentPaymentGateway }) => {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<string>("stripe");
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && (mode === "upgrade" || mode === "downgrade") && currentPaymentGateway) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPaymentMethod(currentPaymentGateway === "manual" ? "pending" : currentPaymentGateway);
    }
  }, [isOpen]);

  const [createStripe, { isLoading: isStripeLoading }] = useCreateStripeSubscriptionMutation();
  const [createRazorpay, { isLoading: isRazorpayLoading }] = useCreateRazorpaySubscriptionMutation();
  const [createPayPal, { isLoading: isPayPalLoading }] = useCreatePayPalSubscriptionMutation();
  const [createMidtrans, { isLoading: isMidtransLoading }] = useCreateMidtransSubscriptionMutation();
  const [createMollie, { isLoading: isMollieLoading }] = useCreateMollieSubscriptionMutation();
  const [, { isLoading: isManualLoading }] = useCreateManualSubscriptionMutation();
  const [changePlan, { isLoading: isChangeLoading }] = useChangePlanSubscriptionMutation();

  const isUpgradeOrDowngrade = mode === "upgrade" || mode === "downgrade";

  const openRazorpayCheckout = async (data: any, planName: string, fallbackUrl?: string) => {
    const razorpayKeyId = data?.razorpay_key_id;
    const subId = data?.razorpay_subscription_id || data?.subscription?.razorpay_subscription_id;

    if (razorpayKeyId && subId) {
      const isLoaded = await loadRazorpayScript();
      if (isLoaded && (window as any).Razorpay) {
        const options = {
          key: razorpayKeyId,
          subscription_id: subId,
          name: "WhatsDesk",
          description: planName,
          handler: function () {
            toast.success(t("plan_changed_success") || "Payment completed successfully!");
            onClose();
            window.location.href = "/billing_plans";
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
        // Close the subscription dialog so its overlay and focus-trap do not conflict with Razorpay's checkout modal
        onClose();
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return true;
      }
    }

    if (fallbackUrl) {
      window.location.href = fallbackUrl;
      return true;
    }
    return false;
  };

  const handleManualPaymentSubmit = () => {
    setIsManualModalOpen(false);
    onClose();
  };

  const handlePay = async () => {
    if (!selectedPlan) return;

    try {
      if (isUpgradeOrDowngrade && currentSubscriptionId) {
        if (paymentMethod === "pending") {
          setIsManualModalOpen(true);
          return;
        }

        // Upgrade or downgrade plan, passing both new plan ID and selected payment gateway
        const response = await changePlan({
          id: currentSubscriptionId,
          body: {
            new_plan_id: selectedPlan._id,
            payment_gateway: paymentMethod,
          },
        }).unwrap();

        if (response.success) {
          if (paymentMethod === "razorpay") {
            const fallbackUrl = response.data?.payment_link || (response.data as any)?.subscription_link || (response.data as any)?.approval_url;
            const opened = await openRazorpayCheckout(response.data, selectedPlan.name, fallbackUrl);
            if (opened) return;
          }

          const redirectUrl = response.data?.payment_link || (response.data as any)?.subscription_link || (response.data as any)?.approval_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            toast.success(response.message || t("plan_changed_success"));
            onClose();
          }
        }
        return;
      }

      if (paymentMethod === "stripe") {
        const response = await createStripe({ plan_id: selectedPlan._id }).unwrap();
        if (response.success && response.data.payment_link) {
          window.location.href = response.data.payment_link;
        } else {
          toast.error(t("stripe_link_not_found"));
        }
      } else if (paymentMethod === "razorpay") {
        const response = await createRazorpay({ plan_id: selectedPlan._id }).unwrap();
        if (response.success) {
          const fallbackUrl = response.data.payment_link || (response.data as any).subscription_link;
          const opened = await openRazorpayCheckout(response.data, selectedPlan.name, fallbackUrl);
          if (!opened) {
            toast.error(t("razorpay_link_not_found"));
          }
        }
      } else if (paymentMethod === "paypal") {
        const response = await createPayPal({ plan_id: selectedPlan._id }).unwrap();
        if (response.success) {
          const redirectUrl = response.data.payment_link || (response.data as any).approval_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            toast.error(t("paypal_link_not_found"));
          }
        }
      } else if (paymentMethod === "midtrans") {
        const response = await createMidtrans({ plan_id: selectedPlan._id }).unwrap();
        if (response.success) {
          const redirectUrl = response.data.payment_link;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            toast.error(t("midtrans_link_not_found") || "Midtrans payment link not found");
          }
        }
      } else if (paymentMethod === "mollie") {
        const response = await createMollie({ plan_id: selectedPlan._id }).unwrap();
        if (response.success) {
          const redirectUrl = response.data.payment_link || (response.data as any).transaction_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
          } else {
            toast.error(t("mollie_link_not_found") || "Mollie payment link not found");
          }
        }
      } else if (paymentMethod === "pending") {
        setIsManualModalOpen(true);
      } else {
        toast.info(t("unknown_payment_method"));
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("initiate_payment_failed"));
    }
  };

  const isLoading = isStripeLoading || isRazorpayLoading || isPayPalLoading || isMidtransLoading || isMollieLoading || isManualLoading || isChangeLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)]! max-h-[90vh] no-scrollbar gap-0! border-none shadow-2xl overflow-auto p-0! bg-white dark:bg-(--card-color) rounded-lg">
        <div className="bg-slate-50 dark:bg-(--card-color) sm:px-5 px-4 py-6 border-b border-slate-100 dark:border-(--card-border-color)">
          <DialogHeader>
            <DialogTitle className="text-2xl text-left font-black text-slate-900 dark:text-white tracking-tight">{t("checkout_title")}</DialogTitle>
          </DialogHeader>
        </div>

        <div className="sm:p-5 p-4 overflow-y-auto custom-scrollbar max-h-106.25">
          <div className="mb-5 sm:p-6 p-4 pt-2 bg-light-primary/30 dark:bg-(--page-body-bg) rounded-lg border border-[var(--primary-opacity-20)] dark:border-none shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="h-20 w-20 text-primary" />
            </div>
            <div className="relative z-10 flex justify-between flex-wrap gap-2 sm:gap-0 items-start">
              <div>
                <p className="text-sm font-black text-primary mb-1">{t("selected_plan_label")}</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white capitalize">{selectedPlan?.name}</h4>
              </div>
              <div className="text-right [@media(max-width:497px)]:ml-auto">
                <p className="text-sm font-black text-primary mb-1">{t("total_amount_label")}</p>
                <div className="text-3xl font-black text-primary flex items-center justify-end">
                  <CurrencyValue amount={selectedPlan?.price || 0} fromCode={selectedPlan?.currency?.code || "USD"} fallbackSymbol={selectedPlan?.currency.symbol} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Label className="text-sm font-black text-slate-400 ml-2">{t("payment_method_title")}</Label>
            <div className="grid grid-cols-1 [@media(min-width:525px)_and_(max-width:639px)]:grid-cols-2 sm:grid-cols-4 gap-4">
              {PAYMENTMETHODLIST.map((method) => (
                <Button key={method.id} onClick={() => setPaymentMethod(method.id as string)} className={cn("flex h-[150px] flex-col items-center text-center sm:p-6 p-4 border rounded-lg transition-all duration-300 group relative", paymentMethod === method.id ? "border-primary hover:bg-primary/5 bg-primary/5" : "border-slate-100 hover:bg-white dark:hover:bg-(--table-hover) dark:border-(--card-border-color) bg-white dark:bg-(--table-hover) dark:hover:border-(--card-border-color) hover:border-slate-200")}>
                  <div className={cn("w-12 h-12 p-4 rounded-lg flex items-center justify-center mb-4 transition-all duration-300", paymentMethod === method.id ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" : "bg-slate-50 dark:bg-(--dark-body) text-slate-400 group-hover:bg-(--card-color)")}>
                    <method.icon className="h-6 w-6" />
                  </div>
                  <span className={cn("text-sm font-black mb-1", paymentMethod === method.id ? "text-slate-900 dark:text-white" : "text-slate-500")}>{method.name}</span>
                  <p className="text-[10px] font-bold text-slate-400 leading-tight">{method.description}</p>

                  {paymentMethod === method.id && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-primary text-white p-1 rounded-full animate-in zoom-in-50">
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 flex-wrap flex gap-4">
          <Button variant="ghost" className="flex-1 h-12 font-semibold bg-slate-100 dark:bg-(--page-body-bg) text-xs tracking-widest text-slate-500 px-4.5 py-5 hover:bg-slate-200/50 rounded-lg" onClick={onClose} disabled={isLoading}>
            {t("go_back_btn")}
          </Button>
          <Button className="flex-1 h-12 bg-primary text-white font-semibold text-xs tracking-widest rounded-lg active:scale-[0.98] transition-all px-4.5 py-5" onClick={handlePay} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : t("complete_purchase_btn")}
          </Button>
        </div>
      </DialogContent>

      <ManualPaymentModal isOpen={isManualModalOpen} onClose={handleManualPaymentSubmit} selectedPlan={selectedPlan} mode={mode} currentSubscriptionId={currentSubscriptionId} />
    </Dialog>
  );
};

export default SubscriptionModal;
