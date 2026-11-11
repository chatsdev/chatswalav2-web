"use client";

import { ROUTES } from "@/src/constants";
import { DEFAULT_BILLING_TABS, PRICE_SUFFIX } from "@/src/data/landing";
import { useAppSelector } from "@/src/redux/hooks";
import CurrencyValue from "@/src/shared/CurrencyValue";
import { ArrowRight, Check, Crown, X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { PricingPlanProps } from "../../types/landingPage";
import { Button } from "@/src/elements/ui/button";
import { isFeaturePlatformAllowed } from "@/src/utils";


// ─── Billing cycle types

const getHeaderPillBg = (idx: number, name: string): string => {
  const n = name.toLowerCase();
  if (n.includes("pro") || n.includes("plus") || idx === 1)
    return "bg-sky-500 text-white shadow-sky-500/20";
  if (n.includes("ultimate") || n.includes("enterprise") || idx === 2)
    return "bg-amber-500 text-white shadow-amber-500/25";
  return "bg-primary text-white shadow-primary/20";
};

const PricingPlan: React.FC<PricingPlanProps> = ({ data }) => {
  const router = useRouter();

  const billingTabs = React.useMemo(() => {
    if (data.tabs && data.tabs.length > 0) {
      return data.tabs.map((tab: any) => ({
        id: tab.key,
        label: tab.value,
        badge: tab.badge || "",
      }));
    }
    return DEFAULT_BILLING_TABS;
  }, [data.tabs]);

  const [activeTabIndex, setActiveTabIndex] = useState<number>(() => {
    if (!data.tabs || data.tabs.length === 0) {
      return 0;
    }
    const availableCycles = new Set(
      (data.plans || [])
        .map((p) => (p._id?.billing_cycle || "monthly").toLowerCase())
        .filter(Boolean),
    );
    const foundIndex = data.tabs.findIndex((tab: any) =>
      availableCycles.has((tab.key || "").toLowerCase()),
    );
    return foundIndex !== -1 ? foundIndex : 0;
  });

  const billingTab = React.useMemo(() => {
    return billingTabs[activeTabIndex]?.id || "monthly";
  }, [billingTabs, activeTabIndex]);

  React.useEffect(() => {
    if (activeTabIndex >= billingTabs.length) {
      setActiveTabIndex(0);
    }
  }, [billingTabs, activeTabIndex]);

  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { setting } = useAppSelector((state) => state.setting);
  const { t } = useTranslation();

  const DEFAULT_VISIBLE = 10;

  // Filter & map plans for the active billing tab
  const plans = (data.plans || [])
    .filter((p) => {
      const cycle = (p._id?.billing_cycle || "monthly").toLowerCase();
      return cycle === billingTab.toLowerCase();
    })
    .map((p, idx) => {
      const planDoc = p._id;
      if (!planDoc) return null;

      const formattedFeatures = Object.entries(planDoc.features || {})
        .filter(([key]) => {
          if (["_id", "id", "__v"].includes(key)) return false;
          return isFeaturePlatformAllowed(key, setting?.omnichannel_platforms);
        })
        .map(([key, value]) => ({
          key,
          label: t(`plan_features_${key}`, key.replace(/_/g, " ")),
          value,
        }));

      return {
        name: planDoc.name,
        price: planDoc.price || 0,
        currencyCode: planDoc.currency,
        features: formattedFeatures,
        enabledFeatures: planDoc.enabled_features || {},
        is_featured: planDoc.is_featured,
        originalIdx: idx,
      };
    })
    .filter(Boolean);

  // Highlighted (featured) plan logic
  const featuredCount = plans.filter((p) => p?.is_featured).length;
  let highlightedIndex = -1;
  if (featuredCount === 1) {
    highlightedIndex = plans.findIndex((p) => p?.is_featured);
  } else if (plans.length > 0) {
    const proIdx = plans.findIndex((p) => p?.name.toLowerCase() === "pro");
    highlightedIndex = proIdx !== -1 ? proIdx : Math.floor(plans.length / 2);
  }

  const getFeatureInfoForPlan = (plan: any, label: string) => {
    const feature = plan.features.find((f: any) => f.label === label);
    if (!feature) return { value: undefined, isDisabled: true };

    const { key, value } = feature;
    let isDisabled = false;

    // Check if the toggle in enabledFeatures is explicitly false/disabled
    if (plan.enabledFeatures && key in plan.enabledFeatures) {
      if (!plan.enabledFeatures[key]) {
        isDisabled = true;
      }
    }

    let displayValue = value;
    const isBooleanFeature =
      ["rest_api", "whatsapp_webhook", "auto_replies", "analytics", "priority_support", "free_trial"].includes(key) ||
      key.startsWith("omnichannel_") ||
      key.startsWith("fb_") ||
      key.startsWith("ig_") ||
      key.startsWith("tg_") ||
      key.startsWith("tw_");

    if (value === false) {
      isDisabled = true;
    } else if (value === 0 || value === "0" || (typeof value === "number" && value <= 0)) {
      if (!isBooleanFeature) {
        displayValue = "Unlimited";
      } else {
        isDisabled = true;
      }
    }

    return { value: displayValue, isDisabled };
  };

  const getLabelSortPriority = (label: string) => {
    let hasUnlimited = false;
    let hasNumber = false;
    let hasTick = false;

    plans.forEach((plan) => {
      const { value, isDisabled } = getFeatureInfoForPlan(plan, label);
      if (isDisabled) return;

      if (value === "Unlimited" || value === "unlimited") {
        hasUnlimited = true;
      } else if (typeof value === "number" || (!isNaN(Number(value)) && typeof value !== "boolean")) {
        hasNumber = true;
      } else if (value === true || value === "Yes" || value === "yes" || value === "active") {
        hasTick = true;
      }
    });

    if (hasUnlimited) return 1; // "Unlimited" options first
    if (hasNumber) return 2;    // then numeric values
    if (hasTick) return 3;      // then tick options
    return 4;                   // then cross options (all disabled)
  };

  // All unique feature labels across visible plans, sorted by priority (Unlimited, Numbers, Ticks, Crosses)
  const allFeatureLabels = Array.from(
    new Set(plans.flatMap((plan) => plan!.features.map((f) => f.label))),
  ).sort((a, b) => {
    const priorityA = getLabelSortPriority(a);
    const priorityB = getLabelSortPriority(b);
    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }
    // Secondary sort: alphabetical
    return a.localeCompare(b);
  });

  const renderFeatureValue = (value: any, isDisabled: boolean) => {
    if (isDisabled) {
      return (
        <span className="bg-rose-100 text-rose-700 text-[10px] font-black p-2 rounded-full inline-block">
          <X size={16} />
        </span>
      );
    }
    if (typeof value === "boolean") {
      return value ? (
        <span className="bg-primary/10 text-primary text-[10px] font-black p-2 rounded-full inline-block">
          <Check size={16} />
        </span>
      ) : (
        <span className="bg-rose-100 text-rose-700 text-[10px] font-black p-2 rounded-full inline-block">
          <X size={16} />
        </span>
      );
    }
    if (value === null || value === undefined)
      return <span className="text-slate-400 font-semibold">—</span>;
    return <span className="text-sm font-bold text-slate-800">{value}</span>;
  };

  const handleChoosePlan = () => {
    if (isAuthenticated) {
      router.push(user?.role === "agent" ? ROUTES.WAChat : ROUTES.BillingPlans);
    } else {
      router.push(ROUTES.Login);
    }
  };

  return (
    <section
      id="pricing"
      className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-gray-50"
    >
      <div className="max-w-[1435px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-[calc(16px+(48-16)*((100vw-320px)/(1920-320)))]">
          <span className="inline-block text-[12px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            {data.badge || "PRICING"}
          </span>
          <h2 className="text-[calc(20px+(36-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 mb-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))] leading-tight">
            {data.title || "Simple, Transparent Pricing"}
          </h2>
          <p className="text-[17px] text-slate-600 leading-relaxed">
            {data.description ||
              "Choose the perfect plan for your business size and needs."}
          </p>

          <div className="mt-8 inline-flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-sm gap-1">
            {billingTabs.map((tab, idx) => (
              <Button variant="unstyled"
                key={`${tab.id}-${idx}`}
                type="button"
                onClick={() => {
                  setActiveTabIndex(idx);
                  setIsExpanded(false);
                }}
                className={`relative px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                  activeTabIndex === idx
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="absolute -top-2.5 -right-2 text-[9px] font-black bg-amber-400 text-white px-1.5 py-0.5 rounded-full leading-none">
                    {tab.badge}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 font-semibold text-base">
              No plans available for this billing cycle.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto table-custom-scrollbar rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-100">
            <table className="w-full border-collapse min-w-max text-left">
              <thead>
                <tr className="border-b border-slate-200">
                  {/* Feature Label Header */}
                  <th className="p-4 md:p-6 min-w-[130px] w-[130px] md:min-w-[250px] md:w-[250px] bg-slate-50 bg-clip-padding font-black text-slate-800 text-xs md:text-base sticky left-0 z-20">
                    Features Comparison
                  </th>

                  {plans.map((plan, idx) => {
                    const isFeatured = idx === highlightedIndex;
                    return (
                      <th
                        key={idx}
                        className="p-4 md:p-8 min-w-[220px] w-[220px] md:min-w-[280px] md:w-[280px] text-center bg-white border-r border-slate-200! last:border-r-0 align-top"
                      >
                        <div className="flex flex-col items-center">
                          <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center justify-center gap-1.5">
                            {plan!.name}
                            {isFeatured && (
                              <span className="inline-flex items-center justify-center bg-amber-500 text-white w-5 h-5 rounded-full shadow-md shadow-amber-500/25">
                                <Crown
                                  size={11}
                                  className="fill-white text-white"
                                />
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-slate-400 break-all whitespace-normal line-clamp-2 font-semibold mb-6">
                            {isFeatured
                              ? "Customized solutions"
                              : "Perfect for small teams"}
                          </p>

                          {/* Pricing Badge */}
                          <div
                            className={`inline-flex items-center gap-1.5 py-3! px-8! rounded-lg text-lg font-extrabold shadow-lg ${getHeaderPillBg(idx, plan!.name)}`}
                          >
                            <CurrencyValue
                              amount={plan!.price}
                              fromCode={plan!.currencyCode?.code}
                              className="font-black text-white"
                              fallbackSymbol={
                                plan!.currencyCode === "INR" ? "₹" : "$"
                              }
                            />
                            <span className="text-xs opacity-90 tracking-wide font-bold">
                              {PRICE_SUFFIX[billingTab.toLowerCase()] || ""}
                            </span>
                          </div>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody>
                {(isExpanded
                  ? allFeatureLabels
                  : allFeatureLabels.slice(0, DEFAULT_VISIBLE)
                ).map((label) => (
                  <tr
                    key={label}
                    className="border-b border-slate-200 hover:bg-slate-50/30 transition-colors last:border-b-0"
                  >
                    <td className="p-4 md:p-6 bg-slate-50 bg-clip-padding font-bold text-slate-700 text-xs md:text-sm border-r border-slate-200 capitalize sticky left-0 z-10">
                      {label}
                    </td>
                    {plans.map((plan, idx) => {
                      const { value, isDisabled } = getFeatureInfoForPlan(
                        plan,
                        label,
                      );
                      return (
                        <td
                          key={idx}
                          className="p-4 md:p-6 text-center border-r border-slate-200 last:border-r-0"
                        >
                          {renderFeatureValue(value, isDisabled)}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* View More / Less Toggle */}
                {allFeatureLabels.length > DEFAULT_VISIBLE && (
                  <tr className="border-b border-slate-200 bg-slate-50/20">
                    <td
                      colSpan={plans.length + 1}
                      className="py-4 text-left relative"
                    >
                      <div className="sticky left-1/2 -translate-x-1/2 w-max z-20 inline-block">
                        <Button variant="unstyled"
                          onClick={() => setIsExpanded(!isExpanded)}
                          className="inline-flex items-center gap-2 text-sm font-black text-primary hover:text-primary/80 bg-primary/5 hover:bg-primary/10 px-6 py-2.5 rounded-full transition-all cursor-pointer shadow-sm hover:shadow"
                        >
                          {isExpanded ? (
                            <>
                              <span>View Less</span>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="18 15 12 9 6 15" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span>
                                View More (
                                {allFeatureLabels.length - DEFAULT_VISIBLE} more
                                features)
                              </span>
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="6 9 12 15 18 9" />
                              </svg>
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}

                {/* Footer CTA Row */}
                <tr className="bg-slate-50/10">
                  <td className="p-4 md:p-8 border-r border-slate-200 bg-slate-50 bg-clip-padding sticky left-0 z-10" />
                  {plans.map((_, idx) => (
                    <td
                      key={idx}
                      className="p-4 md:p-8 text-center border-r border-slate-200 last:border-r-0"
                    >
                      <Button variant="unstyled"
                        onClick={handleChoosePlan}
                        className="group inline-flex items-center justify-between gap-6 border border-slate-200 hover:border-primary bg-white text-slate-800 font-extrabold text-sm py-2 pl-6 pr-2 rounded-lg transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        <span>Choose Plan</span>
                        <div className="bg-primary group-hover:bg-primary/95 text-white w-8 h-8 rounded-lg flex items-center justify-center transition-all">
                          <ArrowRight
                            size={14}
                            className="group-hover:translate-x-0.5 transition-transform text-white"
                          />
                        </div>
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default PricingPlan;
