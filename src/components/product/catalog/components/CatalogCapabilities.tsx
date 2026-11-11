"use client";

import { featureIcons } from "@/src/data/product";
import { CatalogCapabilitiesProps } from "@/src/types/product";
import * as LucideIcons from "lucide-react";

const getIconComponent = (iconName: string) => {
  return (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
};

export default function CatalogCapabilities({
  capabilities,
  primaryColor,
}: CatalogCapabilitiesProps) {
  const features = Array.isArray(capabilities.features)
    ? capabilities.features
    : [];

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-slate-50 border-b border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-xs bg-[#d9770610] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
            style={{ color: primaryColor }}
          >
            {capabilities.badge || "Capabilities"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {capabilities.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))] max-w-7xl mx-auto">
          {features.map((feature, idx) => {
            const iconName = featureIcons[idx % featureIcons.length];
            const IconComp = getIconComponent(iconName);

            return (
              <div
                key={idx}
                className="bg-white sm:p-6 p-4 rounded-lg border border-slate-200/60 shadow-sm hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 shrink-0 border"
                    style={{
                      backgroundColor: primaryColor + "10",
                      borderColor: primaryColor + "20",
                      color: primaryColor,
                    }}
                  >
                    <IconComp size={22} />
                  </div>
                  <h4 className="text-md font-black text-slate-800">
                    {feature.title}
                  </h4>
                  <p className="text-[15px] font-medium text-slate-500 mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
