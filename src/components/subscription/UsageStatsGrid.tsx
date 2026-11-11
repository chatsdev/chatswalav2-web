"use client";

import { USAGE_MAPPING } from "@/src/data/UsageMap";
import { cn } from "@/src/lib/utils";
import { UsageStatsGridProps } from "@/src/types/subscription";
import React from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/redux/hooks";
import { isFeaturePlatformAllowed } from "@/src/utils";

const UsageStatsGrid: React.FC<Omit<UsageStatsGridProps, "usageMapping">> = ({ currentUsage, activePlanFeatures, enabledFeatures }) => {
  const { t } = useTranslation();
  const { setting } = useAppSelector((state) => state.setting);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 [@media(min-width:525px)_and_(max-width:639px)]:grid-cols-2">
      {Object.entries(USAGE_MAPPING).map(([key, config]) => {
        const used = currentUsage[key] || 0;
        const limit = activePlanFeatures[config.featureKey];
        
        // Filter based on setting's omnichannel platforms
        if (!isFeaturePlatformAllowed(config.featureKey, setting?.omnichannel_platforms)) {
          return null;
        }
        
        // Filter based on enabledFeatures toggle
        if (enabledFeatures && enabledFeatures[config.featureKey] === false) {
          return null;
        }

        const isUnlimited =
          (typeof limit === "boolean" && limit === true) ||
          (typeof limit === "number" && limit <= 0) ||
          (typeof limit === "string" && (limit === "0" || parseInt(limit, 10) <= 0));
        const limitValue = isUnlimited ? "∞" : typeof limit === "number" ? limit : 0;
        const percentage = isUnlimited ? 0 : typeof limitValue === "number" && limitValue > 0 ? (used / limitValue) * 100 : 0;

        if (limit === undefined || limit === false) return null;

        const Icon = config.icon;

        return (
          <div key={key} className="p-4 rounded-lg bg-white dark:bg-(--card-color) border border-slate-100 dark:border-none flex flex-col justify-between transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-(--dark-body) text-slate-500 dark:text-gray-500 border border-slate-100 dark:border-none">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-slate-600 dark:text-gray-400">{t(config.label)}</span>
              </div>
            </div>
            {isUnlimited && config.featureKey !== "whatsapp_webhook" && <span className="text-[10px] font-bold text-primary tracking-tight">{t("unlimited_label")}</span>}
            <div className="flex items-baseline justify-between gap-2 mt-auto">
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">{used.toLocaleString()}</h4>
              {config.featureKey !== "whatsapp_webhook" && (
                <span className="text-xs font-medium text-slate-400">{t("of_label")} {typeof limitValue === "number" ? limitValue.toLocaleString() : limitValue}</span>
              )}
            </div>

            {!isUnlimited && config.featureKey !== "whatsapp_webhook" && (
              <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-(--dark-body) rounded-full overflow-hidden">
                <div className={cn("h-full transition-all duration-700 ease-out rounded-full", percentage > 90 ? "bg-rose-500" : percentage > 70 ? "bg-amber-500" : "bg-primary dark:bg-primary")} style={{ width: `${Math.min(percentage, 100)}%` }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default UsageStatsGrid;
