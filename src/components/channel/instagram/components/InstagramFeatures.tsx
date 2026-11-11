"use client";

import { InstagramFeaturesProps } from "@/src/types/channel";
import Image from "next/image";

export default function InstagramFeatures({
  featuresSection,
  getResolvedImageUrl,
  igGradient,
}: InstagramFeaturesProps) {
  if (!featuresSection.features || featuresSection.features.length === 0)
    return null;

  return (
    <section
      id="features-showcase"
      className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white border-t border-slate-100"
    >
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(18px+(64-18)*((100vw-320px)/(1920-320)))]">
          {featuresSection.badge && (
            <span
              className="text-[12px] font-bold text-white px-4 py-1.5 rounded-full uppercase tracking-wide inline-block mb-3.5"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.86 0.14 85) 0%, oklch(0.74 0.16 45) 25%, oklch(0.66 0.2 5) 55%, oklch(0.58 0.19 310) 85%, oklch(0.58 0.17 265) 100%)",
              }}
            >
              {featuresSection.badge}
            </span>
          )}
          <h2 className="text-[calc(22px+14*((100vw-320px)/1600))] font-bold text-slate-900 tracking-tight leading-tight">
            {featuresSection.title}
          </h2>
          {featuresSection.subtitle && (
            <p className="mt-1 text-[17px] font-medum text-slate-600 leading-relaxed">
              {featuresSection.subtitle}
            </p>
          )}
        </div>

        <div className="space-y-16 max-w-7xl mx-auto">
          {featuresSection.features.map((feat: any, idx: number) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))] items-center mb-[calc(18px+(64-18)*((100vw-320px)/(1920-320)))] ${isEven ? "" : "lg:flex-row-reverse"}`}
              >
                <div
                  className={
                    isEven ? "lg:order-1 text-left" : "lg:order-2 text-left"
                  }
                >
                  {feat.badge && (
                    <span className="text-xs font-bold text-[#E1306C] bg-pink-50 px-2.5 py-1 uppercase tracking-wide rounded-full inline-block mb-3">
                      {feat.badge}
                    </span>
                  )}
                  <h4 className="text-[20px] xl:text-[24px] font-bold leading-tight mb-4">
                    {feat.title}
                  </h4>
                  <p className="text-[15px] font-medium text-slate-600 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div
                  className={`relative w-full max-w-[550px] mx-auto z-10 p-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  <div className="w-full h-auto flex items-center justify-center">
                    <Image
                      src={getResolvedImageUrl(feat.image)}
                      alt={feat.title}
                      width={800}
                      height={600}
                      unoptimized
                      className="w-full h-auto object-contain rounded-lg transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
