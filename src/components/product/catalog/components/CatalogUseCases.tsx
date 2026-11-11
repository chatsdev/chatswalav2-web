"use client";

import { Button } from "@/src/elements/ui/button";
import { CatalogUseCasesProps } from "@/src/types/product";
import { getResolvedImageUrl } from "@/src/utils/image";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function CatalogUseCases({
  useCases,
  primaryColor,
}: CatalogUseCasesProps) {
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const tabs = Array.isArray(useCases.tabs) ? useCases.tabs : [];
  const activeTab = tabs[activeTabIdx];

  if (tabs.length === 0) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white border-b border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-xs bg-[#d9770610] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
            style={{ color: primaryColor }}
          >
            {useCases.badge || "Use Cases"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {useCases.title}
          </h2>
          {useCases.description && (
            <p className="text-[17px] font-medium text-slate-600 mt-4 leading-relaxed">
              {useCases.description}
            </p>
          )}
        </div>

        {/* Tabs switcher */}
        <div className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-[calc(16px+(48-16)*((100vw-320px)/(1920-320)))]">
          {tabs.map((tab, idx) => (
            <Button
              key={idx}
              onClick={() => setActiveTabIdx(idx)}
              className={`px-6 py-3 rounded-lg text-[12px] font-bold cursor-pointer border ${
                activeTabIdx === idx
                  ? "text-white border-none shadow-md"
                  : "bg-slate-50 text-slate-500 border-slate-200/80 hover:bg-slate-100"
              }`}
              style={
                activeTabIdx === idx
                  ? {
                      backgroundColor: primaryColor,
                      boxShadow: `0 8px 20px ${primaryColor}30`,
                    }
                  : {}
              }
            >
              {tab.heading}
            </Button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg sm:p-6 p-4 md:p-10 max-w-6xl mx-auto shadow-sm">
          <AnimatePresence mode="wait">
            {activeTab && (
              <motion.div
                key={activeTabIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))] items-center"
              >
                <div>
                  <h4 className="text-xl font-black text-slate-900 leading-tight">
                    {activeTab.title}
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed mt-4 font-semibold font-sans">
                    {activeTab.description}
                  </p>

                  {Array.isArray(activeTab.bullets) && (
                    <div className="space-y-3 mt-6">
                      {activeTab.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex gap-3 items-start">
                          <CheckCircle2
                            size={16}
                            className="shrink-0 mt-0.5"
                            style={{ color: primaryColor }}
                          />
                          <span className="text-xs font-semibold text-slate-650 font-sans">
                            {bullet}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right side dynamic image representation */}
                <div className="relative w-full aspect-[4/3]  overflow-hidden">
                  <Image
                    src={getResolvedImageUrl(activeTab.image)}
                    alt={activeTab.title || "Use case preview"}
                    fill
                    unoptimized
                    className="object-cover rounded-lg"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
