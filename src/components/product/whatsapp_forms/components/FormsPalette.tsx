"use client";

import { FormsPaletteProps } from "@/src/types/product";
import * as LucideIcons from "lucide-react";

const getIconComponent = (iconName?: string) => {
  if (!iconName) return LucideIcons.Sparkles;
  return (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
};

export default function FormsPalette({
  componentsSection,
  primaryColor,
}: FormsPaletteProps) {
  const items = Array.isArray(componentsSection.components)
    ? componentsSection.components
    : [];

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))]">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 text-left">
        <div className="max-w-7xl mx-auto">
          <div className="mb-[calc(14px+(56-14)*((100vw-320px)/(1920-320)))] text-center max-w-2xl mx-auto">
            <span
              className="text-xs bg-[var(--primary-opacity-20)] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
              style={{ color: primaryColor }}
            >
              {componentsSection.badge || "Field Palette"}
            </span>
            <h2 className="text-[calc(20px+(30-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 tracking-tight mt-2">
              {componentsSection.title || "Available form components"}
            </h2>
            {componentsSection.description && (
              <p className="text-[17px] text-slate-600 mt-2 font-medium font-sans">
                {componentsSection.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {items.map((item, i) => {
              const IconComponent = getIconComponent(item.icon);

              return (
                <div
                  key={i}
                  className="group bg-white rounded-lg border border-slate-200/60 sm:p-5 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 border"
                    style={{
                      backgroundColor: primaryColor + "10",
                      borderColor: primaryColor + "20",
                      color: primaryColor,
                    }}
                  >
                    <IconComponent size={18} />
                  </div>
                  <h4 className="text-[14px] font-bold text-slate-900 break-all whitespace-normal line-clamp-4">
                    {item.label}
                  </h4>
                  <p className="text-[12px] text-slate-600 font-semibold mt-0.5 font-sans break-all whitespace-normal line-clamp-5">
                    {item.desc || item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
