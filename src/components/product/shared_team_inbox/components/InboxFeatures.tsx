"use client";

import { InboxFeaturesProps } from "@/src/types/product";
import * as LucideIcons from "lucide-react";

const getIconComponent = (iconName?: string) => {
  if (!iconName) return (LucideIcons as any).Sparkles;
  return (LucideIcons as any)[iconName] || (LucideIcons as any).Sparkles;
};

export default function InboxFeatures({
  features,
  primaryColor,
}: InboxFeaturesProps) {
  const featureCards = Array.isArray(features.cards) ? features.cards : [];

  if (featureCards.length === 0) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white border-b border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-sm font-bold bg-primary/10 rounded-full text-primary px-4.5 py-1 uppercase tracking-wide font-mono inline-block"
            style={{ color: primaryColor }}
          >
            {features.badge || "Engineered for Results"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {features.title ||
              "Everything You Need to Automate Customer Success"}
          </h2>
        </div>

        {/* Custom styled features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[calc(16px+(32-16)*((100vw-320px)/(1920-320)))] max-w-7xl mx-auto">
          {featureCards.map((card: any, idx: number) => {
            const IconComp = getIconComponent(card.icon);
            const bgColors = [
              `${primaryColor}10`,
              "bg-teal-50 text-teal-600",
              "bg-purple-50 text-purple-600",
              "bg-orange-50 text-orange-600",
              "bg-yellow-50 text-yellow-600",
              "bg-red-50 text-red-600",
            ];
            const textColors = [
              primaryColor,
              "text-teal-600",
              "text-purple-600",
              "text-orange-600",
              "text-yellow-600",
              "text-red-600",
            ];
            const bgClass = idx === 0 ? "" : bgColors[idx % bgColors.length];
            const textClass =
              idx === 0 ? "" : textColors[idx % textColors.length];

            return (
              <div
                key={idx}
                className="feature-box sm:p-6 p-4 relative border-none bg-transparent text-left"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 shrink-0 ${idx === 0 ? "" : bgClass}`}
                  style={
                    idx === 0
                      ? {
                          backgroundColor: primaryColor + "10",
                          color: primaryColor,
                        }
                      : {}
                  }
                >
                  <IconComp size={22} className={idx === 0 ? "" : textClass} />
                </div>
                <h4 className="text-lg font-black text-slate-800">
                  {card.title}
                </h4>
                <p className="text-[15px] font-medium text-slate-600 mt-3 leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
