"use client";

import React from "react";
import * as LucideIcons from "lucide-react";
import { Sparkles } from "lucide-react";
import { FacebookToolsProps } from "@/src/types/channel";



export default function FacebookTools({ toolsSection, fbGradient, fbGradientLight }: FacebookToolsProps) {
  if (toolsSection.tools.length === 0) return null;

  const getToolIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5 text-[#1877f2]" />;
    }
    return <Sparkles className="w-5 h-5 text-[#1877f2]" />;
  };

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-slate-50/60 border-y border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(18px+(64-18)*((100vw-320px)/(1920-320)))]">
          {toolsSection.badge && (
            <span className="text-[12px] font-bold text-white px-4 py-1.5 rounded-full uppercase tracking-wide inline-block mb-3.5" style={{ background: fbGradient }}>
              {toolsSection.badge}
            </span>
          )}
          <h2 className="text-[calc(22px+14*((100vw-320px)/1600))] font-bold text-slate-900 tracking-tight leading-tight">
            {toolsSection.title}
          </h2>
          {toolsSection.sub_title && (
            <p className="text-[15px] font-medium text-slate-600 leading-relaxed">
              {toolsSection.sub_title}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {toolsSection.tools.map((tool: any, idx: number) => (
            <div key={idx} className="bg-white sm:p-6 p-4 rounded-lg border border-slate-200/80 shadow-xs flex gap-4 items-start text-left">
              <div className="shrink-0 p-2.5 rounded-lg" style={{ background: fbGradientLight }}>
                {getToolIcon(tool.icon)}
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-slate-900 mb-1 leading-tight">{tool.title}</h4>
                <p className="text-[14px] font-medium text-slate-500 leading-normal">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
