"use client";

import { FormsWorkflowProps } from "@/src/types/product";
import { getResolvedImageUrl } from "@/src/utils/image";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FormsWorkflow({
  workflow,
  primaryColor,
}: FormsWorkflowProps) {
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const stepsList = Array.isArray(workflow.steps) ? workflow.steps : [];

  // Auto loop the slider steps
  useEffect(() => {
    if (stepsList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % stepsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [stepsList.length]);

  if (stepsList.length === 0) return null;

  return (
    <section
      id="forms-workflow"
      className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] border-y border-slate-100 bg-[#fcfcfd]"
    >
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 text-left">
        <div className="max-w-7xl mx-auto">
          <div className="mb-[calc(14px+(56-14)*((100vw-320px)/(1920-320)))]">
            <span
              className="text-xs bg-[var(--primary-opacity-20)] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
              style={{ color: primaryColor }}
            >
              {workflow.badge || "Workflow"}
            </span>
            <h2 className="text-[calc(20px+(30-20)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 tracking-tight mt-2">
              {workflow.title || "From design to delivery in three steps"}
            </h2>
            {workflow.description && (
              <p className="text-[17px] text-slate-600 mt-2 font-medium font-sans">
                {workflow.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[calc(8px+(48-8)*((100vw-320px)/(1920-320)))] items-center">
            {/* Left Column: Interactive Timeline (7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative">
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-slate-100 hidden md:block" />

                <div className="space-y-10">
                  {stepsList.map((step, idx) => {
                    const isActive = idx === activeStepIdx;
                    const stepNum = String(idx + 1).padStart(2, "0");

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveStepIdx(idx)}
                        className={`relative md:pl-16 cursor-pointer group transition-all mb-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))] duration-300 ${
                          isActive
                            ? "opacity-100 scale-[1.01]"
                            : "opacity-50 hover:opacity-80"
                        }`}
                      >
                        {/* Step Indicator */}
                        <div
                          className="hidden md:flex absolute left-0 w-10 h-10 rounded-full text-white items-center justify-center font-mono font-black text-[15px] shadow-md z-10 transition-all duration-300"
                          style={{
                            backgroundColor: isActive
                              ? primaryColor
                              : "#cbd5e1",
                            boxShadow: isActive
                              ? `0 0 0 4px ${primaryColor}20`
                              : "none",
                          }}
                        >
                          {stepNum}
                        </div>

                        <div className="md:pl-0">
                          <h3
                            className={`text-[20px] font-bold transition-colors ${isActive ? "text-slate-900" : "text-slate-700"}`}
                          >
                            {step?.title}
                          </h3>
                          <p className="text-[17px] text-slate-600 mt-2 leading-relaxed max-w-2xl font-medium font-sans">
                            {step?.description}
                          </p>

                          {idx === 0 && !step.customTags && (
                            <div className="mt-4 flex flex-wrap gap-2">
                              {[
                                "Text Input",
                                "Text Area",
                                "Number",
                                "Email",
                                "Phone",
                                "Dropdown",
                                "Checkbox",
                                "Date Picker",
                              ].map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[11px] font-bold bg-white border px-3 py-1 rounded-full text-slate-650"
                                  style={{ borderColor: primaryColor + "40" }}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Slider Image View (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div
                  className="absolute -inset-4 rounded-lg blur-2xl"
                  style={{ backgroundColor: primaryColor + "05" }}
                />

                <div className="relative rounded-lg overflow-hidden flex items-center justify-center min-h-[350px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeStepIdx}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full"
                    >
                      {(() => {
                        const stepImage = stepsList[activeStepIdx]?.image;
                        return (
                          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                            <Image
                              src={getResolvedImageUrl(stepImage)}
                              alt={stepsList[activeStepIdx]?.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
