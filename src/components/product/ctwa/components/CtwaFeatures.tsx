"use client";

import { CtwaFeaturesProps } from "@/src/types/product";
import { getResolvedImageUrl } from "@/src/utils/image";
import * as LucideIcons from "lucide-react";
import Image from "next/image";

const getIconComponent = (iconName?: string) => {
  if (!iconName) return LucideIcons.Sparkles;
  return (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
};

export default function CtwaFeatures({
  features,
  primaryColor,
}: CtwaFeaturesProps) {
  const items = Array.isArray(features.items) ? features.items : [];

  return (
    <section
      id="ctwa-features"
      className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white"
    >
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center mb-[calc(18px+(56-18)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-xs bg-[#4f46e510] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
            style={{ color: primaryColor }}
          >
            {features.badge || "Features"}
          </span>
          <h2 className="text-[calc(20px+(30-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 tracking-tight mt-2">
            {features.title || "Built for campaign success"}
          </h2>
        </div>

        <div className="max-w-7xl mx-auto space-y-16">
          {items.map((feat, i) => {
            const IconComp = getIconComponent(feat.icon);
            const isFlipped = i % 2 !== 0;

            const textBlock = (
              <div className={isFlipped ? "lg:order-1 order-2" : ""}>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-[calc(4px+(16-4)*((100vw-320px)/(1920-320)))] border"
                  style={{
                    backgroundColor: primaryColor + "10",
                    borderColor: primaryColor + "20",
                    color: primaryColor,
                  }}
                >
                  <IconComp size={24} />
                </div>
                <h3 className="text-[calc(16px+(24-16)*((100vw-320px)/(1920-320)))] font-black text-slate-900 tracking-tight">
                  {feat.title}
                </h3>
                <p className="text-[15px] text-slate-500 mt-3 leading-relaxed font-medium font-sans">
                  {feat.description}
                </p>
              </div>
            );

            const visualBlock = (
              <div
                className={`relative ${isFlipped ? "lg:order-2 order-1" : ""}`}
              >
                <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden">
                  <Image
                    src={getResolvedImageUrl(feat.image)}
                    alt={feat.title}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            );

            return (
              <div
                key={i}
                className="grid grid-cols-1 lg:grid-cols-2 gap-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))] items-center mb-[calc(18px+(64-18)*((100vw-320px)/(1920-320)))]"
              >
                {isFlipped ? (
                  <>
                    {textBlock}
                    {visualBlock}
                  </>
                ) : (
                  <>
                    {visualBlock}
                    {textBlock}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
