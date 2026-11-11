"use client";

import { FEATURE_ICON_STYLES, FEATURE_ICONS } from "@/src/data/product";
import { BroadcastFeaturesProps } from "@/src/types/product";

export default function BroadcastFeatures({
  campaignSettings,
}: BroadcastFeaturesProps) {
  const features = Array.isArray(campaignSettings.features)
    ? campaignSettings.features
    : [];

  if (features.length === 0) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white border-y border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
          <span className="text-xs bg-[var(--primary-opacity-20)] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono">
            {campaignSettings.badge || "Campaign Settings"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {campaignSettings.title}
          </h2>
          {campaignSettings.subtitle && (
            <p className="text-[15px] font-medium text-slate-600 leading-relaxed">
              {campaignSettings.subtitle}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feat: any, idx: number) => (
            <div
              key={idx}
              className="sm:p-6 p-4 rounded-lg bg-[#FCFCFD] border border-slate-200/60 shadow-sm hover:border-primary hover:shadow-md transition-all flex flex-col text-left"
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 shrink-0 border ${FEATURE_ICON_STYLES[idx % FEATURE_ICON_STYLES.length]}`}
              >
                {FEATURE_ICONS[idx % FEATURE_ICONS.length]}
              </div>
              <h4 className="text-md font-black text-slate-800">
                {feat.title}
              </h4>
              <p className="text-[15px] font-medium text-slate-500 mt-3 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
