import { Button } from "@/src/elements/ui/button";
import { EmptyStateProps } from "@/src/types/subscription";
import { ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import React from "react";

const EmptyState: React.FC<EmptyStateProps> = ({ onShowPlans }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) rounded-lg shadow-sm animate-in fade-in duration-700">
      <div className="w-16 h-16 bg-slate-50 dark:bg-(--dark-body) dark:border-none rounded-lg flex items-center justify-center mb-6 text-slate-400 border border-slate-100 dark:border-slate-700">
        <ShieldCheck className="h-8 w-8" />
      </div>
      <h2 className="text-3xl font-medium text-slate-900 dark:text-white mb-4 tracking-tighter">{t("ready_to_scale")}</h2>
      <p className="text-slate-500 dark:text-gray-500 max-w-md mx-auto mb-8 text-[15px] font-normal px-6">{t("ready_to_scale_desc")}</p>
      <Button size="sm" onClick={onShowPlans} className="px-11 h-12 bg-primary text-white font-black rounded-lg shadow-xl transition-all hover:-translate-y-1 active:scale-95 text-[15px] tracking-tight">
        {t("get_started")}
      </Button>

      <div className="mt-12 flex items-center gap-10">
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold text-slate-900 dark:text-white">100%</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t("secure")}</p>
        </div>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold text-slate-900 dark:text-white">24/7</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{t("support")}</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
