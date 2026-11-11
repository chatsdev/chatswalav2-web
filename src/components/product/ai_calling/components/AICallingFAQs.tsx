"use client";

import { Button } from "@/src/elements/ui/button";
import { AICallingFAQsProps } from "@/src/types/product";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function AICallingFAQs({
  faqs,
  primaryColor,
}: AICallingFAQsProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const items = Array.isArray(faqs.items) ? faqs.items : [];

  if (items.length === 0) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-slate-50 border-t border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-xs bg-[#7c3aed10] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
            style={{ color: primaryColor }}
          >
            {faqs.badge || "FAQs"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight mt-2.5">
            {faqs.title || "Frequently Asked Questions"}
          </h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/60 rounded-lg overflow-hidden shadow-sm"
            >
              <Button
                onClick={() =>
                  setOpenFaqIndex(openFaqIndex === idx ? null : idx)
                }
                className="w-full h-[68px] flex hover:bg-[unset] justify-between items-center sm:p-5 p-4 text-left bg-transparent border-none cursor-pointer outline-none"
              >
                <span className="text-[15px] font-bold text-slate-800">
                  {item.question}
                </span>
                <span className="text-slate-400 font-black text-lg transition-transform">
                  {openFaqIndex === idx ? "−" : "+"}
                </span>
              </Button>

              <AnimatePresence>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 pt-1 text-[14.5px] font-semibold text-slate-500 leading-relaxed border-t border-slate-100 text-left">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
