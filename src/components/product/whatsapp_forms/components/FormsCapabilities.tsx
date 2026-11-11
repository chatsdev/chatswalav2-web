"use client";

import { FormsCapabilitiesProps } from "@/src/types/product";
import * as LucideIcons from "lucide-react";

const getIconComponent = (iconName?: string) => {
  if (!iconName) return LucideIcons.Sparkles;
  return (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
};

export default function FormsCapabilities({
  capabilities,
  primaryColor,
}: FormsCapabilitiesProps) {
  const items = Array.isArray(capabilities.items) ? capabilities.items : [];

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 text-left">
        <div className="max-w-6xl mx-auto">
          <div className="mb-[calc(14px+(56-14)*((100vw-320px)/(1920-320)))]">
            <span
              className="text-xs bg-[var(--primary-opacity-20)] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
              style={{ color: primaryColor }}
            >
              {capabilities.badge || "Capabilities"}
            </span>
            <h2 className="text-[calc(20px+(30-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 tracking-tight mt-2">
              {capabilities.title ||
                "Everything you need to build powerful forms"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, i) => {
              const IconComponent = getIconComponent(item.icon);

              return (
                <div
                  key={i}
                  className="group flex gap-5 sm:p-5 p-4 rounded-lg bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div
                    className="w-1 shrink-0 rounded-full transition-colors"
                    style={{ backgroundColor: primaryColor + "40" }}
                  />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: primaryColor + "10",
                          borderColor: primaryColor + "20",
                          color: primaryColor,
                        }}
                      >
                        <IconComponent size={18} />
                      </div>
                      <h3 className="text-[16px] font-black text-slate-900">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-[14px] text-slate-500 leading-relaxed font-medium ml-12 font-sans">
                      {item.description || item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
