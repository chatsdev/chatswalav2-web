"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { Copy, CheckCircle2, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { toast } from "sonner";
import { WidgetSuccessProps } from "@/src/types/widget";

const WidgetSuccess: React.FC<WidgetSuccessProps> = ({ script, onBack }) => {
  const { t } = useTranslation();
  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    toast.success("Script copied to clipboard!");
  };

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
      <div className="sm:p-8 p-4 space-y-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-16 h-16 bg-[var(--primary-opacity-20)] dark:bg-(--dark-body) text-primary rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("widget_generated_success")}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">{t("widget_ready_desc")}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-0">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">Integration Script</h3>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="text-primary hover:text-primary/80 h-8 gap-2">
              <Copy size={14} /> Copy Script
            </Button>
          </div>

          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <pre className="relative bg-slate-900 custom-scrollbar dark:bg-slate-950 p-6 rounded-lg text-primary text-sm overflow-x-auto font-mono border border-slate-800 shadow-inner">{script || "No script available"}</pre>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="p-5 rounded-lg border border-slate-100 dark:border-none bg-slate-50/50 dark:bg-(--page-body-bg) space-y-2">
            <h4 className="font-bold text-sm">Where to paste?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Paste this snippet just before the closing <code>&lt;/body&gt;</code> tag on every page where you want the widget to appear.
            </p>
          </div>
          <div className="p-5 rounded-lg border border-slate-100 dark:border-none bg-slate-50/50 dark:bg-(--page-body-bg) space-y-2">
            <h4 className="font-bold text-sm">Need help?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Check our documentation for more detailed integration options and advanced customization.</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 flex-wrap gap-3 sm:gap-0">
          <Button variant="ghost" onClick={onBack} className="gap-2 text-slate-500">
            <ArrowLeft size={16} /> Edit Widget
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary text-white px-4.5! py-5 border-none shadow-lg shadow-primary/20">
            View Live Demo <ExternalLink size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WidgetSuccess;
