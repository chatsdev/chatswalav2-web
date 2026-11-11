"use client";

import { FeatureShowcaseProps } from "@/src/types/channel";
import { getResolvedImageUrl } from "@/src/utils/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/src/elements/ui/button";


export default function FeatureShowcase({
  featuresSection,
  activeFeatureIndex,
  setActiveFeatureIndex,
  setImageError,
  getWhatsAppIcon,
}: FeatureShowcaseProps) {
  if (featuresSection.features.length === 0) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-slate-50/60 border-y border-slate-200/50 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-[calc(14px+(64-14)*((100vw-320px)/(1920-320)))]">
          {featuresSection.badge && (
            <span className="text-[12px] font-bold text-primary uppercase tracking-wide  bg-primary/15 px-4.5 py-1.5 rounded-full inline-block mb-3.5">
              {featuresSection.badge}
            </span>
          )}
          <h2 className="text-[calc(24px+14*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight">
            {featuresSection.title}
          </h2>
          {featuresSection.sub_title && (
            <p className="mt-4 text-[15px] font-medium text-slate-600 leading-relaxed">
              {featuresSection.sub_title}
            </p>
          )}
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_2.1fr] rounded-lg border border-slate-200/80 bg-white overflow-hidden shadow-2xl shadow-slate-100/90 min-h-[500px]">
          <div className="border-r border-slate-200 sm:p-6 p-4 flex flex-col justify-start gap-2 bg-slate-50/60">
            <div className="pb-3 mb-4 border-b border-slate-200 text-[14px] font-black text-slate-600">
              Select Capabilities
            </div>
            <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1.5 custom-scrollbar">
              {featuresSection.features.map((feat: any, index: number) => {
                const isActive = activeFeatureIndex === index;
                return (
                  <Button variant="unstyled"
                    key={index}
                    onClick={() => setActiveFeatureIndex(index)}
                    className={`w-full flex items-center gap-3.5 sm:px-5 px-4 py-4 rounded-lg cursor-pointer transition-all duration-300 text-left border-none ${
                      isActive
                        ? "bg-primary! text-white! font-extrabold shadow-sm border-l-4 border-[#25D366]"
                        : "bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100/80"
                    }`}
                  >
                    <div
                      className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-455"}`}
                    >
                      {getWhatsAppIcon(index)}
                    </div>
                    <span className="text-[14.5px] font-extrabold tracking-tight">
                      {feat.title}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="p-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))]  flex flex-col justify-between bg-white relative">
            <div className="w-full mb-[calc(16px+(32-16)*((100vw-320px)/(1920-320)))] relative z-10">
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-100/60 overflow-hidden">
                <div className="relative aspect-[16/9] md:aspect-[16/9] w-full bg-slate-50 flex items-center justify-center overflow-hidden ">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFeatureIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full"
                    >
                      {(() => {
                        const feat =
                          featuresSection.features[activeFeatureIndex];
                        return (
                          <Image
                            src={getResolvedImageUrl(feat?.image)}
                            alt={feat?.title}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                            width={100}
                            height={100}
                            unoptimized
                          />
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="text-left relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeatureIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <h3 className="text-[25px] font-black text-slate-900 tracking-tight mb-3">
                    {featuresSection.features[activeFeatureIndex]?.title}
                  </h3>
                  <p className="text-[14.5px] font-semibold text-slate-550 leading-relaxed mb-[calc(12px+(24-12)*((100vw-320px)/(1920-320)))] max-w-3xl">
                    {featuresSection.features[activeFeatureIndex]?.description}
                  </p>

                  {Array.isArray(
                    featuresSection.features[activeFeatureIndex]?.bullets,
                  ) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                      {featuresSection.features[activeFeatureIndex].bullets.map(
                        (bullet: string, bIdx: number) => (
                          <div
                            key={bIdx}
                            className="flex items-center gap-2.5 text-[13px] font-bold text-slate-600"
                          >
                            <Check size={15} className="text-[#25D366]" />
                            <span>{bullet}</span>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
