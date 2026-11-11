"use client";

import { Button } from "@/src/elements/ui/button";
import { InboxFAQsProps } from "@/src/types/product";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function InboxFAQs({ faqs, primaryColor }: InboxFAQsProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const faqItems = Array.isArray(faqs.items) ? faqs.items : [];

  if (faqItems.length === 0) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-[#f8fafc] border-t border-slate-200/60">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-4xl mx-auto mb-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-sm font-bold bg-primary/10 rounded-full text-primary px-4.5 py-1 uppercase tracking-wide font-mono inline-block"
            style={{ color: primaryColor }}
          >
            {faqs.badge || "FAQs"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight mt-2.5">
            {faqs.title || "Got Questions about the Shared Inbox?"}
          </h2>
        </div>

        <div className="max-w-5xl mx-auto space-y-4">
          {faqItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/60 rounded-lg overflow-hidden shadow-sm"
            >
              <Button
                onClick={() =>
                  setOpenFaqIndex(openFaqIndex === idx ? null : idx)
                }
                className="w-full h-[81px] hover:bg-slate-50 break-all whitespace-normal  text-left px-6! py-4.5 font-bold text-[15px] text-slate-850 flex justify-between items-center cursor-pointer border-none bg-transparent outline-none"
              >
                {item.question}
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openFaqIndex === idx ? "rotate-180" : ""}`}
                />
              </Button>
              <AnimatePresence>
                {openFaqIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-1 text-[14.5px] font-semibold text-slate-505 leading-relaxed border-t border-slate-101 text-left">
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
