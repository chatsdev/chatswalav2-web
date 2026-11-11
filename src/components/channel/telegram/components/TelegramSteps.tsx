"use client";

import { defaultTelegramSteps } from "@/src/data/ChannelConnectionInfo";
import { TelegramStepsProps } from "@/src/types/channel";
import { Cpu, FileText, Layers, Zap } from "lucide-react";

export default function TelegramSteps({
  stepsSection,
  primaryColor,
  tgGradient,
}: TelegramStepsProps) {
  const steps =
    Array.isArray(stepsSection.steps) && stepsSection.steps.length > 0
      ? stepsSection.steps
      : defaultTelegramSteps;

  const getStepIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Cpu size={20} className="text-[#0088cc]" />;
      case 1:
        return <Layers size={20} className="text-[#0088cc]" />;
      case 2:
        return <FileText size={20} className="text-[#0088cc]" />;
      default:
        return <Zap size={20} className="text-[#0088cc]" />;
    }
  };

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-slate-50/50 border-t border-slate-100">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(18px+(64-18)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-xs font-bold text-white px-4 py-1.5 rounded-full inline-block mb-4"
            style={{ background: tgGradient }}
          >
            {stepsSection.badge || "How It Works"}
          </span>
          <h2 className="text-[calc(24px+16*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight">
            {stepsSection.title || "Start in under 2 minutes."}
          </h2>
          {stepsSection.subtitle && (
            <p className=" text-[15px] font-medium text-slate-600 leading-relaxed">
              {stepsSection.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 max-w-7xl mx-auto">
          {steps.map((step: any, idx: number) => {
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/60 rounded-lg p-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] pt-[calc(14px+(36-14)*((100vw-320px)/(1920-320)))] shadow-xs relative flex flex-col justify-between text-left transition-all duration-300 hover:shadow-md"
              >
                <div
                  className="absolute -top-2 left-6 px-3 py-0.5 text-[9.5px] font-black uppercase tracking-wider text-white rounded-full"
                  style={{ background: tgGradient }}
                >
                  Step {idx + 1}
                </div>
                <div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-5"
                    style={{
                      background:
                        "color-mix(in oklab, oklch(0.72 0.13 235) 12%, white)",
                    }}
                  >
                    {getStepIcon(idx)}
                  </div>
                  <h4 className="text-[17px] font-black text-slate-900 mb-2 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
