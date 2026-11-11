"use client";

import { Button } from "@/src/elements/ui/button";
import { FormsFAQsProps } from "@/src/types/product";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function FormsFAQs({ faqs, primaryColor }: FormsFAQsProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const items = Array.isArray(faqs.items) ? faqs.items : [];

  if (items.length === 0) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 text-left">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-[calc(14px+(48-14)*((100vw-320px)/(1920-320)))]">
            <span
              className="text-xs bg-[var(--primary-opacity-20)] px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono"
              style={{ color: primaryColor }}
            >
              {faqs.badge || "FAQs"}
            </span>
            <h2 className="text-[calc(16px+(24-16)*((100vw-320px)/(1920-320)))] font-black text-slate-900 tracking-tight mt-2">
              {faqs.title || "Questions about WhatsApp Forms?"}
            </h2>
          </div>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200/60 rounded-lg overflow-hidden shadow-sm"
              >
                <Button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? null : i)}
                  className="w-full h-[77px] hover:bg-[unset] break-all whitespace-normal flex justify-between items-center sm:p-5 p-4 text-left bg-transparent border-none cursor-pointer outline-none"
                >
                  <span className="text-[15px] font-bold text-slate-800 pr-4">
                    {item.question || item.q}
                  </span>
                  <span
                    className="font-black text-lg shrink-0 transition-transform duration-300"
                    style={{
                      transform:
                        openFaqIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                      color: primaryColor,
                    }}
                  >
                    +
                  </span>
                </Button>

                <AnimatePresence>
                  {openFaqIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-[14.5px] font-semibold text-slate-500 leading-relaxed border-t border-slate-100 text-left">
                        {item.answer || item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
