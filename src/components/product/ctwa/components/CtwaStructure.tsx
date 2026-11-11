"use client";

import { CtwaStructureProps } from "@/src/types/product";

export default function CtwaStructure({
  structure,
  primaryColor,
}: CtwaStructureProps) {
  const steps = Array.isArray(structure.steps) ? structure.steps : [];

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))]">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-[calc(18px+(56-18)*((100vw-320px)/(1920-320)))]">
            <span
              className="text-xs bg-[#4f46e510]! px-4 py-1.5 rounded-full uppercase tracking-wide  font-bold text-primary font-mono"
              style={{ color: primaryColor }}
            >
              {structure.badge || "Structure"}
            </span>
            <h2 className="text-[calc(20px+(30-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 tracking-tight mt-2">
              {structure.title || "Campaign hierarchy, visualized"}
            </h2>
            {structure.subtitle && (
              <p className="text-[15px] text-slate-600 mt-2 font-medium leading-relaxed font-sans">
                {structure.subtitle}
              </p>
            )}
          </div>

          {/* Funnel visualization */}
          <div className="flex flex-col items-center gap-0">
            {steps.map((step, i) => {
              const widths = [
                "max-w-[500px]",
                "max-w-[400px]",
                "max-w-[320px]",
                "max-w-[260px]",
              ];
              const w = widths[i % widths.length];
              return (
                <div
                  key={i}
                  className={`w-full ${w} group`}
                  style={{ contentVisibility: "auto" }}
                >
                  <div className="relative bg-white border border-slate-200/80 rounded-lg sm:p-6 p-4 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <h3
                      className="text-[20px] font-bold text-slate-900"
                      style={{ color: primaryColor }}
                    >
                      {step.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 font-semibold mt-1 font-sans">
                      {step.description}
                    </p>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-0.5 h-6 mx-auto opacity-60"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
