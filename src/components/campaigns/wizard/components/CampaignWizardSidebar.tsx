import { cn } from "@/src/lib/utils";
import { Check } from "lucide-react";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface CampaignWizardSidebarProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (index: number) => void;
}

export const CampaignWizardSidebar = ({
  steps,
  currentStep,
  onStepClick,
}: CampaignWizardSidebarProps) => {
  return (
    <div className="[@media(min-width:1427px)]:col-span-3 space-y-4 custom-scrollbar [@media(max-width:1426px)]:flex [@media(max-width:1426px)]:snap-x [@media(max-width:1426px)]:snap-mandatory [@media(max-width:1426px)]:overflow-x-auto">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        return (
          <div
            key={step.id}
            className={cn(
              "relative flex items-start gap-4 p-4 [@media(max-width:1426px)]:min-w-70 rounded-lg transition-all duration-300 mb-4 cursor-pointer group",
              isActive
                ? "bg-white dark:bg-(--card-color) shadow-lg shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/50 dark:ring-(--card-border-color)"
                : "opacity-60 hover:opacity-100",
            )}
            onClick={() => onStepClick(index)}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold transition-all",
                isCompleted
                  ? "bg-primary text-white"
                  : isActive
                    ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20"
                    : "bg-slate-100 dark:bg-(--dark-sidebar) text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700",
              )}
            >
              {isCompleted ? <Check size={20} /> : index + 1}
            </div>
            <div className="min-w-0">
              <h3
                className={cn(
                  "font-bold text-base line-clamp-1 transition-colors",
                  isActive
                    ? "text-primary dark:text-white"
                    : "text-slate-500 dark:text-gray-400 group-hover:text-slate-700 dark:group-hover:text-slate-200",
                )}
              >
                {step.title}
              </h3>
              <p className="text-[12px] text-slate-400 font-medium truncate">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
