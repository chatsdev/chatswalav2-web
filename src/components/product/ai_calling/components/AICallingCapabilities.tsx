"use client";

import { AICallingCapabilitiesProps } from "@/src/types/product";
import * as LucideIcons from "lucide-react";

const getFeatureIcon = (index: number) => {
  const icons = ["Sparkles", "Mic", "Database", "MessageSquare", "Activity"];
  const iconName = icons[index % icons.length];
  return (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
};

export default function AICallingCapabilities({
  capabilities,
  primaryColor,
}: AICallingCapabilitiesProps) {
  const features = Array.isArray(capabilities.features)
    ? capabilities.features
    : [];

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-xs bg-[#7c3aed10] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
            style={{ color: primaryColor }}
          >
            {capabilities.badge || "PLATFORM FEATURES"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {capabilities.title || "Voice Agent Capabilities"}
          </h2>
          {capabilities.subtitle && (
            <p className="text-[17px] font-semibold text-slate-600 mt-3 leading-relaxed">
              {capabilities.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
          {features.map((feature, idx) => {
            const IconComp = getFeatureIcon(idx);
            return (
              <div
                key={idx}
                className="sm:p-6 p-4 rounded-lg bg-[#FCFCFD] border border-slate-200/60 shadow-sm hover:border-violet-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 border"
                    style={{
                      backgroundColor: primaryColor + "10",
                      borderColor: primaryColor + "20",
                      color: primaryColor,
                    }}
                  >
                    <IconComp size={18} />
                  </div>
                  <h4 className="text-[15px] font-black text-slate-800">
                    {feature.title}
                  </h4>
                  <p className="text-[14px] font-semibold text-slate-500 mt-2 leading-relaxed font-sans">
                    {feature.description}
                  </p>
                </div>
                {feature.example && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <span
                      className="text-[11.5px] font-bold bg-slate-50 border border-slate-200/60 px-2.5 py-1 rounded-lg block w-fit"
                      style={{ color: primaryColor }}
                    >
                      {feature.example}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
