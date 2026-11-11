"use client";

import { Button } from "@/src/elements/ui/button";
import { SalesCTAProps } from "@/src/types/channel";
import { Check } from "lucide-react";

export default function SalesCTA({
  sales,
  isAuthenticated,
  primaryColor,
  router,
}: SalesCTAProps) {
  if (!sales.title) return null;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="max-w-6xl mx-auto rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-[calc(10px+(30-10)*((100vw-320px)/(1920-320)))] text-white text-center relative overflow-hidden shadow-2xl shadow-primary-darker/20">
          <div
            className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] rounded-full blur-[130px] pointer-events-none"
            style={{ backgroundColor: primaryColor, opacity: 0.15 }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-[calc(22px+16*((100vw-320px)/1600))] font-bold tracking-tight leading-tight">
              {sales.title}
            </h2>
            {sales.subtitle && (
              <p className="mt-4 text-[16px] text-slate-300 font-medium leading-relaxed">
                {sales.subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {sales.button2_title && sales.button2_url && (
                <Button
                  onClick={() => router.push(sales.button2_url || "")}
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 px-8 py-5 h-12 rounded-lg font-black text-[15px] cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {sales.button2_title}
                </Button>
              )}
            </div>

            {sales.bullets.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs font-bold text-slate-600">
                {sales.bullets.map((bullet: string, idx: number) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <Check size={14} style={{ color: primaryColor }} /> {bullet}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
