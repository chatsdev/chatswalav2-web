"use client";

import { defaultSteps } from "@/src/data/ChannelConnectionInfo";
import { InstagramStepsProps } from "@/src/types/channel";

export default function InstagramSteps({ stepsSection }: InstagramStepsProps) {
  const steps =
    Array.isArray(stepsSection.steps) && stepsSection.steps.length > 0
      ? stepsSection.steps
      : defaultSteps;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))]">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(18px+(64-18)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-[12px] font-bold text-white px-4 py-1.5 rounded-full uppercase tracking-wide inline-block mb-3.5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.86 0.14 85) 0%, oklch(0.74 0.16 45) 25%, oklch(0.66 0.2 5) 55%, oklch(0.58 0.19 310) 85%, oklch(0.58 0.17 265) 100%)",
            }}
          >
            {stepsSection.badge || "How It Works"}
          </span>
          <h2 className="text-[calc(22px+14*((100vw-320px)/1600))] font-bold text-slate-900 tracking-tight leading-tight">
            {stepsSection.title || "Start in 4 Easy Steps"}
          </h2>
          {stepsSection.subtitle && (
            <p className="mt-4 text-[15px] font-medium text-slate-600 leading-relaxed">
              {stepsSection.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))] max-w-7xl mx-auto">
          {steps.map((step: any, idx: number) => {
            return (
              <div
                key={idx}
                className="bg-white sm:p-6 p-4 rounded-lg border border-slate-200/80 shadow-sm relative group text-left"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm mb-4 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.86 0.14 85) 0%, oklch(0.74 0.16 45) 25%, oklch(0.66 0.2 5) 55%, oklch(0.58 0.19 310) 85%, oklch(0.58 0.17 265) 100%)",
                  }}
                >
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </div>
                <h4 className="text-[16px] font-bold text-slate-900 mb-2">
                  {step.title}
                </h4>
                <p className="text-[13px] font-medium text-slate-500 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
