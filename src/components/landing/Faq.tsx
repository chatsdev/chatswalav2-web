"use client";

import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { FaqProps } from "../../types/landingPage";
import { Button } from "@/src/elements/ui/button";


const Faq: React.FC<FaqProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const faqs = (data.faqs || []).map((f) => f._id).filter(Boolean);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (faqs.length === 0) return null;

  return (
    <section id="faqs" className="py-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))] bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[12px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            {data.badge || "FAQ"}
          </span>
          
          <h2 className="text-[calc(20px+(36-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 mb-[calc(14px+(24-14)*((100vw-320px)/(1920-320)))] leading-tight">
            {data.title}
          </h2>
          
          {data.description && (
            <p className="text-lg text-slate-600 leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${
                activeIndex === index
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <Button variant="unstyled"
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className={`text-base font-bold pr-4 ${
                  activeIndex === index ? "text-primary" : "text-slate-900"
                }`}>
                  {item.title}
                </span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-transform duration-300 ${
                    activeIndex === index ? "rotate-180 text-primary" : "text-slate-400"
                  }`}
                />
              </Button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  activeIndex === index ? "max-h-96 pb-6" : "max-h-0"
                }`}
              >
                <div className="px-6">
                  <div
                    className="text-slate-600 leading-relaxed text-sm dynamic-content"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
