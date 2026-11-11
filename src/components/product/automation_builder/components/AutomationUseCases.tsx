"use client";

import { Button } from "@/src/elements/ui/button";
import { AutomationUseCasesProps } from "@/src/types/product";
import { getResolvedImageUrl } from "@/src/utils/image";
import Image from "next/image";
import React, { useState } from "react";

export default function AutomationUseCases({
  useCases,
  primaryColor,
}: AutomationUseCasesProps) {
  const [selectedTabIdx, setSelectedTabIdx] = useState<number>(0);
  const useCaseTabs = Array.isArray(useCases.tabs) ? useCases.tabs : [];

  const activeTab = useCaseTabs[selectedTabIdx] || useCaseTabs[0];
  const activeSteps = activeTab?.steps || [];

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-[#f8fafc] border-b border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 text-left">
        <div className="text-center max-w-4xl mx-auto mb-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-xs bg-[var(--primary-opacity-20)] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
            style={{ color: primaryColor }}
          >
            {useCases.badge || "Use Cases"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {useCases.title || "Proven Chatbot Flow Recipes"}
          </h2>
          {useCases.description && (
            <p className="text-[17px] font-medium text-slate-600 mt-3 leading-relaxed font-sans">
              {useCases.description}
            </p>
          )}
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto mb-[calc(16px+(48-16)*((100vw-320px)/(1920-320)))]">
          {useCaseTabs.map((tab, idx) => (
            <Button
              key={idx}
              onClick={() => setSelectedTabIdx(idx)}
              className={`sm:p-5 min-h-[75px] h-auto flex-col justify-center text-left! items-start p-4 hover:bg-[#e2e8f0] rounded-lg border cursor-pointer bg-white overflow-hidden min-w-0`}
              style={{
                borderColor: selectedTabIdx === idx ? primaryColor : "#e2e8f0",
                boxShadow:
                  selectedTabIdx === idx
                    ? `0 4px 12px ${primaryColor}10`
                    : "none",
              }}
            >
              <p
                className="text-[12px] font-black font-mono w-full truncate"
                style={{ color: primaryColor }}
              >
                {tab.sub_title}
              </p>
              <h4 className="text-sm font-medium text-slate-800 mt-1 w-full truncate">
                {tab.title}
              </h4>
            </Button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="bg-white border border-slate-200/60 rounded-lg sm:p-6 p-4 max-w-7xl mx-auto shadow-sm">
          <div
            className={`grid grid-cols-1 ${activeTab?.side_image ? "lg:grid-cols-2" : ""} gap-10 items-center`}
          >
            {/* Steps */}
            <div className="flex flex-col gap-4">
              <h4 className="text-md font-black text-slate-800 mb-2">
                Visual Logic Map:
              </h4>
              <div className="space-y-4">
                {activeSteps.map((step, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <div
                        className="w-8 h-8 rounded-lg text-white flex items-center justify-center shrink-0 font-bold text-xs"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {sIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate font-mono w-full mb-2">
                          {step.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 font-sans font-medium line-clamp-3 break-words">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    {sIdx < activeSteps.length - 1 && (
                      <div className="h-4 border-l-2 border-dashed border-slate-350 ml-7" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Side Image (if set) */}
            {activeTab?.side_image && (
              <div className="flex items-center justify-center">
                <div className="relative w-full max-w-xl aspect-[4/3] rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden bg-slate-50">
                  <Image
                    src={getResolvedImageUrl(activeTab.side_image)}
                    alt={activeTab.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
