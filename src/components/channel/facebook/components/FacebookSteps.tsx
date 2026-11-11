"use client";

import { FacebookStepsProps } from "@/src/types/channel";
import React from "react";



export default function FacebookSteps({ stepsSection, fbGradient }: FacebookStepsProps) {
  if (stepsSection.steps.length === 0) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))]">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(18px+(64-18)*((100vw-320px)/(1920-320)))]">
          {stepsSection.badge && (
            <span className="text-[12px] font-bold text-white px-4 py-1.5 rounded-full  inline-block mb-3.5" style={{ background: fbGradient }}>
              {stepsSection.badge}
            </span>
          )}
          <h2 className="text-[calc(22px+14*((100vw-320px)/1600))] font-bold text-slate-900 tracking-tight leading-tight">
            {stepsSection.title}
          </h2>
          {stepsSection.subtitle && (
            <p className="text-[15px] font-medium text-slate-600 leading-relaxed">
              {stepsSection.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))] max-w-7xl mx-auto">
          {stepsSection.steps.map((step: any, idx: number) => {
            const isLast = idx === stepsSection.steps.length - 1;
            return (
              <div key={idx} className="bg-white sm:p-6 p-4 rounded-lg border border-slate-200/80 shadow-sm relative group text-left">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-sm mb-4 border ${isLast
                  ? "bg-blue-50 text-[#1877f2] border-blue-200/30"
                  : "bg-blue-50 text-[#1877f2] border-blue-200/30"
                  }`}>
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </div>
                <h4 className="text-[16px] font-bold text-slate-900 mb-2">{step.title}</h4>
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
