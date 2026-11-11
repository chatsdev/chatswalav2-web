"use client";

import { ICON_MAP } from "@/src/data/product";
import { Button } from "@/src/elements/ui/button";
import { BroadcastTemplatesProps } from "@/src/types/product";
import {
  Check,
  Tag
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function BroadcastTemplates({
  templateTypes,
  getResolvedImageUrl,
}: BroadcastTemplatesProps) {
  const [selectedType, setSelectedType] = useState(0);
  const types = Array.isArray(templateTypes.types) ? templateTypes.types : [];
  const activeType = types[selectedType] || null;

  if (types.length === 0) return null;

  return (
    <section
      id="template-types"
      className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-[#f8fafc] border-b border-slate-200/50"
    >
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="bg-white border border-slate-200/60 rounded-lg sm:p-6 p-4 max-w-7xl mx-auto shadow-sm">
          <div className="text-center max-w-4xl mx-auto mb-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))]">
            <span className="text-sm font-bold text-primary font-mono inline-block bg-[var(--primary-opacity-20)] px-4 py-1.5 rounded-full uppercase tracking-wide">
              {templateTypes.badge || "Template Builder"}
            </span>
            <h3 className="text-[calc(20px+8*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight mt-2.5 mb-1">
              {templateTypes.title}
            </h3>
            {templateTypes.description && (
              <p className="text-[17px] font-semibold text-slate-600 leading-relaxed max-w-xl mx-auto">
                {templateTypes.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-[calc(14px+(40-14)*((100vw-320px)/(1920-320)))] items-stretch">
            {/* Type selector grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {types.map((type: any, idx: number) => (
                <Button
                  key={idx}
                  onClick={() => setSelectedType(idx)}
                  className={`sm:p-5 p-4 rounded-lg h-[118px] text-left border cursor-pointer transition-all flex items-center justify-between ${idx === 0 ? "col-span-1 md:col-span-2" : ""} ${
                    selectedType === idx
                      ? "bg-white border-primary hover:bg-white shadow-md border-2"
                      : "bg-[#FCFCFD] border-slate-200/80 hover:bg-white border"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${selectedType === idx ? "bg-light-primary text-primary" : "bg-slate-100 text-slate-500"}`}
                    >
                      {ICON_MAP[type.icon] || <Tag size={18} />}
                    </div>
                    <div>
                      <h4
                        className={`text-[16px] font-black ${selectedType === idx ? "text-primary" : "text-slate-800"}`}
                      >
                        {type.title}
                      </h4>
                      <p className="text-[13px] font-medium text-slate-500 mt-0.5 break-all whitespace-normal line-clamp-3">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  {selectedType === idx && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white shrink-0">
                      <Check size={12} className="stroke-[3]" />
                    </div>
                  )}
                </Button>
              ))}
            </div>

            {/* Dynamic image display on the right side */}
            <div className="relative w-full max-w-[420px] mx-auto z-10 lg:self-end pt-6 lg:pt-0 -mb-4 sm:-mb-6">
              <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[500px]">
                <Image
                  src={getResolvedImageUrl(activeType?.image)}
                  alt={activeType?.title || "Template Preview"}
                  fill
                  unoptimized
                  className="object-contain object-bottom"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
