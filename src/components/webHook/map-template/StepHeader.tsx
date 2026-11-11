"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { StepHeaderProps } from "@/src/types/webhook";
import { ArrowLeft } from "lucide-react";

const StepHeader = ({ step, router, setStep, type }: StepHeaderProps) => (
  <div className="flex flex-col gap-6">
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => (step === 1 ? router.push(ROUTES.Webhooks) : setStep(1))}
        className="rounded-lg bg-white dark:bg-(--page-body-bg) hover:bg-light-primary dark:hover:bg-primary/10 h-10 w-10 transition-colors shadow-xs"
      >
        <ArrowLeft size={20} />
      </Button>
      <div className="flex justify-between items-center w-full">
        <div className="flex flex-wrap flex-col gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              Webhook Configuration
            </h1>
            {type && (
              <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md border border-primary/20 mt-1">
                {type === "owner" ? "Map for Owner" : "Map for Customer"}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium tracking-tight">
            {step === 1
              ? "Select your WABA and message template"
              : "Map your webhook payload fields to template variables"}
          </p>
        </div>
        <div className="text-sm font-medium text-primary bg-primary/10 dark:bg-primary/10 px-3 py-1 rounded-full border border-primary/20 dark:border-primary/20">
          Step {step} of 2
        </div>
      </div>
    </div>
  </div>
);

export default StepHeader;
