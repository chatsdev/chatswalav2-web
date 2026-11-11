"use client";

import { InboxCounterProps } from "@/src/types/product";

export default function InboxCounter({
  counter,
  primaryColor,
}: InboxCounterProps) {
  const counterItems = Array.isArray(counter.counters) ? counter.counters : [];

  if (counterItems.length === 0) return null;

  return (
    <section className="relative py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white border-b border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-[calc(4px+(20-4)*((100vw-320px)/(1920-320)))]  items-center max-w-7xl mx-auto">
          {/* Left Column: Heading and Context */}
          <div className="text-left">
            <span
              className="text-sm font-bold bg-primary/10 rounded-full text-primary px-4.5 py-1 uppercase tracking-wide font-mono inline-block"
              style={{ color: primaryColor }}
            >
              {counter.badge || "Performance Impact"}
            </span>
            <h2 className="text-[calc(20px+10*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-[1.1] mt-2.5">
              {counter.title || "Grow Your Business on Solid Numbers"}
            </h2>
            {counter.subtitle && (
              <p className="text-[14.5px] font-semibold text-slate-500 leading-relaxed mt-4">
                {counter.subtitle}
              </p>
            )}
          </div>

          {/* Right Column: Dynamic Light Metrics Row Cards */}
          <div className="space-y-5 text-left">
            {counterItems.map((item: any, idx: number) => (
              <div
                key={idx}
                className="sm:p-5 p-4 rounded-lg flex-col sm:flex-row bg-slate-50/50 border border-slate-200/60 shadow-sm flex items-center gap-6 hover:border-emerald-300 transition-colors"
              >
                <div className="w-24 shrink-0 text-left">
                  <span
                    className="text-[44px] font-black bg-clip-text text-transparent leading-none font-mono"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${primaryColor}, ${primaryColor}cc)`,
                    }}
                  >
                    {item.counts}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-800">
                    {item.title}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1 leading-normal">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
