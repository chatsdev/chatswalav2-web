"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Images from "../../shared/Image";
import { PlatformProps } from "../../types/landingPage";

const HowItWorks: React.FC<PlatformProps> = ({ data }) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const steps = data.items || [];

  if (steps.length === 0) return null;

  return (
    <section id="how-it-works" className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-[calc(16px+(65-16)*((100vw-320px)/(1920-320)))]">
          <span className="inline-block text-[12px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            {data.badge || "HOW IT WORKS"}
          </span>

          <h2 className="text-[calc(20px+(36-20)*((100vw-320px)/(1920-320)))] font-black text-slate-900 mb-[calc(12px+(24-12)*((100vw-320px)/(1920-320)))] leading-tight">
            {data.title}
          </h2>
        </div>

        {/* Steps */}
        <div className={`grid grid-cols-1 gap-8 lg:gap-10 mb-[calc(20px+(64-20)*((100vw-320px)/(1920-320)))] ${
          steps.length === 1 ? "md:grid-cols-1 max-w-md mx-auto" :
          steps.length === 2 ? "md:grid-cols-2 max-w-3xl mx-auto" :
          steps.length === 4 ? "md:grid-cols-2 lg:grid-cols-4" :
          steps.length >= 5  ? "md:grid-cols-2 lg:grid-cols-3" :
          "md:grid-cols-3"
        }`}>
          {steps.map((step, index) => (
            <div key={index} className="relative h-full">
              {/* Connector Line (except last item) */}
              {index < steps.length - 1 && steps.length <= 3 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2 z-0" />
              )}

              <div className="relative h-full flex flex-col justify-between bg-white rounded-lg shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="p-[calc(15px+(32-15)*((100vw-320px)/(1920-320)))] pb-0!">
                  {/* Step Number */}
                  <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary text-white font-black text-2xl mb-6 shadow-lg shadow-primary/25">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Tagline */}
                  {step.tagline && (
                    <span className="text-xs font-bold text-primary mb-2 block">
                      {step.tagline}
                    </span>
                  )}

                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-black text-slate-900 mb-4 leading-tight">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 leading-relaxed sm:mb-6 mb-4">
                    {step.description}
                  </p>

                  {/* Bullets */}
                  {step.bullets && step.bullets.length > 0 && (
                    <ul className="space-y-3">
                      {step.bullets.map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                          <span className="text-sm text-slate-500">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>  
                {/* Step Image */}
                {step.image && (
                  <div className="w-full mt-3">
                    <div className="rounded-b-lg overflow-hidden">
                      <Images
                        src={step.image}
                        alt={step.title}
                        width={400}
                        height={250}
                        className="w-full h-auto"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button
            className="group bg-primary hover:bg-primary/90 text-white px-8! py-4! h-12! rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 inline-flex items-center gap-2"
            onClick={() => {
              if (isAuthenticated) {
                router.push(ROUTES.Dashboard);
              } else {
                router.push(ROUTES.Login);
              }
            }}
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
