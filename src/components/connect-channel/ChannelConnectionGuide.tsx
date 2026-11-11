import { ChannelConnectionGuideProps } from "@/src/types/channel";
import { Info, Lightbulb } from "lucide-react";

export const ChannelConnectionGuide = ({
  info,
}: ChannelConnectionGuideProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Brand Card with subtle gradient */}
      <div
        className={`sm:p-6 p-4 rounded-lg bg-gradient-to-br ${info.gradientClass} border border-slate-200/60 dark:border-white/5 shadow-sm`}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm border border-slate-100 dark:border-(--card-border-color)">
            {info.icon}
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {info.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {info.subtitle}
            </p>
          </div>
        </div>

        {/* Requirements */}
        <div className="mt-5 pt-4 border-t border-slate-200/40 dark:border-(--card-border-color)">
          <h5 className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" /> Prerequisites
          </h5>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {info.requirements.map((req, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Steps List (Vertical Timeline Style) */}
      <div className="sm:p-6 p-4 rounded-lg bg-white dark:bg-(--card-color) border border-slate-200/60 dark:border-(--card-border-color) shadow-sm">
        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6">
          Connection Steps
        </h5>
        <div className="relative pl-6 rtl:pl-0 rtl:pr-6 border-l-2 rtl:border-l-0 rtl:border-r-2 border-slate-100 dark:border-(--card-border-color) space-y-6">
          {info.steps.map((step, idx) => (
            <div key={idx} className="relative group">
              {/* Step indicator dot */}
              <div className="absolute -left-10 rtl:left-auto rtl:-right-10 top-0.5 w-9 h-9 rounded-full bg-slate-50 dark:bg-(--dark-body) border border-slate-200 dark:border-(--card-border-color) flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:border-primary group-hover:text-primary transition-all shadow-sm">
                {step.icon}
              </div>
              <div className="pl-2">
                <span className="text-xs font-bold text-primary bg-primary/10 dark:bg-primary/20 px-2 py-0.5 rounded-full">
                  Step {idx + 1}
                </span>
                <h6 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1.5">
                  {step.title}
                </h6>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 break-all whitespace-normal ">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Grid */}
      <div className="sm:p-6 p-4 rounded-lg bg-white dark:bg-(--card-color) border border-slate-200/60 dark:border-(--card-border-color) shadow-sm">
        <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
          What's Unlocked?
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {info.features.map((feat, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-50 dark:bg-white/2 border border-slate-100 dark:border-(--card-border-color) space-y-2 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="p-2 bg-white dark:bg-(--dark-body) w-fit rounded-lg shadow-sm border border-slate-100 dark:border-(--card-border-color)">
                {feat.icon}
              </div>
              <h6 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {feat.title}
              </h6>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pro Tip Box */}
      <div className="sm:p-5 p-4 rounded-lg bg-amber-500/8 dark:bg-amber-500/4 border border-amber-500/20 text-amber-800 dark:text-amber-300/80 flex gap-3.5">
        <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h6 className="text-sm font-bold">Configuration Tip</h6>
          <p className="text-xs leading-relaxed">{info.proTip}</p>
        </div>
      </div>
    </div>
  );
};
export default ChannelConnectionGuide;
