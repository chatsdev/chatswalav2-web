"use client";

import { stepGradients } from "@/src/data/product";
import { CtwaWizardProps } from "@/src/types/product";

export default function CtwaWizard({
  stepsLaunch,
  primaryColor,
}: CtwaWizardProps) {
  const steps = Array.isArray(stepsLaunch.steps) ? stepsLaunch.steps : [];

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))]">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-[calc(18px+(56-18)*((100vw-320px)/(1920-320)))]">
            <span
              className="text-xs bg-[#4f46e510] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
              style={{ color: primaryColor }}
            >
              {stepsLaunch.badge || "Wizard"}
            </span>
            <h2 className="text-[calc(20px+(30-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 tracking-tight mt-2">
              {stepsLaunch.title || "Three simple steps to launch"}
            </h2>
            {stepsLaunch.description && (
              <p className="text-[17px] text-slate-600 mt-2 font-medium font-sans">
                {stepsLaunch.description}
              </p>
            )}
          </div>

          <div className="relative text-left">
            <div className="space-y-10">
              {steps.map((step, i) => {
                const g = stepGradients[i % stepGradients.length];
                return (
                  <div
                    key={i}
                    className="relative md:pl-20 mb-[calc(14px+(40-14)*((100vw-320px)/(1920-320)))]"
                  >
                    <div
                      className="absolute left-[23px] w-px hidden md:block z-0"
                      style={{
                        backgroundColor: primaryColor + "40",
                        top: i === 0 ? "50%" : "0",
                        bottom:
                          i === steps.length - 1
                            ? "50%"
                            : "calc(-1 * max(2.5rem, 14px + (40 - 14) * ((100vw - 320px) / (1920 - 320))))",
                      }}
                    />
                    <div
                      className={`hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-lg text-white items-center justify-center font-mono font-black text-lg shadow-lg ${g.shadow} z-10`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <div className="bg-white border border-slate-200/60 rounded-lg p-[calc(10px+(28-10)*((100vw-320px)/(1920-320)))] shadow-sm hover:shadow-md transition-all">
                      <h3 className="text-[calc(14px+(18-14)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 mb-2 break-all whitespace-normal">
                        {step.title}
                      </h3>
                      <p className="text-[14px] text-slate-600 font-medium leading-relaxed font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
