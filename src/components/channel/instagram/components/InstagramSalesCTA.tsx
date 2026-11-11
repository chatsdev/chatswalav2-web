"use client";

import { defaultInstagramSales } from "@/src/data/ChannelConnectionInfo";
import { Button } from "@/src/elements/ui/button";
import { InstagramSalesCTAProps } from "@/src/types/channel";
import { Check } from "lucide-react";

export default function InstagramSalesCTA({
  sales,
  isAuthenticated,
  router,
}: InstagramSalesCTAProps) {
  const title = sales.title || defaultInstagramSales.title;
  const subtitle = sales.subtitle || defaultInstagramSales.subtitle;
  const button1_title =
    sales.button1_title || defaultInstagramSales.button1_title;
  const button1_url = sales.button1_url || defaultInstagramSales.button1_url;
  const button2_title =
    sales.button2_title || defaultInstagramSales.button2_title;
  const button2_url =
    sales.button2_url ||
    sales.button2_description ||
    defaultInstagramSales.button2_url;
  const bullets = Array.isArray(sales.bullets)
    ? sales.bullets
    : defaultInstagramSales.bullets;

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-white">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="max-w-6xl mx-auto rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-pink-950 p-[calc(10px+(30-10)*((100vw-320px)/(1920-320)))] text-white text-center relative overflow-hidden shadow-2xl shadow-pink-950/20">
          <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] rounded-full bg-[#E1306C]/15 blur-[130px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-[calc(22px+16*((100vw-320px)/1600))] font-bold tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-[16px] text-slate-300 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              {button2_title && (
                <Button
                  onClick={() => router.push(button2_url)}
                  className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 px-8! py-5! h-12! rounded-lg font-bold text-[15px] cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {button2_title}
                </Button>
              )}
            </div>

            {bullets.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center text-xs font-bold text-slate-600">
                {bullets.map((bullet: string, idx: number) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <Check size={14} style={{ color: "oklch(0.86 0.14 85)" }} />{" "}
                    {bullet}
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
