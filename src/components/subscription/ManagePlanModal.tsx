"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { ManagePlanModalProps } from "@/src/types/subscription";
import { cn } from "@/src/lib/utils";
import { ArrowDownCircle, ArrowUpCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/elements/ui/button";

const ManagePlanModal = ({ isOpen, onOpenChange, onUpgrade, onDowngrade, onCancel, upgradePlansCount = 0, downgradePlansCount = 0 }: ManagePlanModalProps) => {
  const { t } = useTranslation();
  const isUpgradeDisabled = upgradePlansCount <= 0;
  const isDowngradeDisabled = downgradePlansCount <= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! p-0! overflow-hidden border-none bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="sm:p-6 p-4 pb-0! text-left rtl:text-right">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white ">{t("manage_plan")}</DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400 font-medium text-sm">{t("manage_plan_desc")}</DialogDescription>
        </DialogHeader>
        <div className="sm:p-6 p-4 pt-2! space-y-3">
          <Button
            onClick={() => {
              if (isUpgradeDisabled) return;
              onUpgrade();
              onOpenChange(false);
            }}
            disabled={isUpgradeDisabled}
            className={cn("w-full h-[80px] flex items-center justify-between p-4 rounded-xl transition-all group border", isUpgradeDisabled ? "bg-slate-50 dark:bg-(--dark-body) border-slate-100 dark:border-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60" : "bg-light-primary dark:bg-primary/10 hover:bg-[var(--primary-opacity-20)] dark:hover:bg-primary/20 text-primary-dark dark:text-primary border-[var(--primary-opacity-20)]/50 dark:border-primary/20")}
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm transition-colors", !isUpgradeDisabled && "group-hover:bg-light-primary dark:group-hover:bg-primary/20")}>
                <ArrowUpCircle className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-medium text-md ">{t("upgrade_plan")}</p>
                <p className={cn("text-sm font-medium opacity-80 mt-0.5", isUpgradeDisabled && "text-slate-400 dark:text-slate-600")}>{isUpgradeDisabled ? t("no_upgrade_plans_available") : t("upgrade_plan_desc")}</p>
              </div>
            </div>
          </Button>

          <Button
            onClick={() => {
              if (isDowngradeDisabled) return;
              onDowngrade();
              onOpenChange(false);
            }}
            disabled={isDowngradeDisabled}
            className={cn("w-full h-[80px] flex items-center justify-between p-4 rounded-xl transition-all group border", isDowngradeDisabled ? "bg-slate-50 dark:bg-(--dark-body) border-slate-100 dark:border-slate-800/40 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60" : "bg-slate-50 dark:bg-(--page-body-bg) hover:bg-slate-100 dark:hover:bg-(--card-border-color) text-slate-700 dark:text-slate-300 border-slate-100 dark:border-slate-800/60")}
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm transition-colors", !isDowngradeDisabled && "group-hover:bg-slate-100 dark:group-hover:bg-(--card-border-color)")}>
                <ArrowDownCircle className="h-6 w-6" />
              </div>
              <div className="text-left">
                <p className="font-medium text-md">{t("downgrade_plan")}</p>
                <p className={cn("text-sm font-medium opacity-80 mt-0.5", isDowngradeDisabled && "text-slate-400 dark:text-slate-600")}>{isDowngradeDisabled ? t("no_downgrade_plans_available") : t("downgrade_plan_desc")}</p>
              </div>
            </div>
          </Button>

          <div className="pt-2">
            <Button
              onClick={() => {
                onCancel();
                onOpenChange(false);
              }}
              className="w-full h-[80px] flex items-center justify-between p-4 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl transition-all group border border-red-100/50 dark:border-red-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm">
                  <XCircle className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-md ">{t("cancel_subscription")}</p>
                  <p className="text-sm font-medium opacity-80 mt-0.5">{t("cancel_subscription_desc")}</p>
                </div>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManagePlanModal;
