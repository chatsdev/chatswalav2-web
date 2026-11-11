"use client";

import { BookingJourneyProps } from "@/src/types/product";
import { getResolvedImageUrl } from "@/src/utils/image";
import * as LucideIcons from "lucide-react";
import Image from "next/image";

export default function BookingJourney({
  bookingJourney,
  primaryColor,
}: BookingJourneyProps) {
  const steps = Array.isArray(bookingJourney.steps) ? bookingJourney.steps : [];
  const fallbackIcons = ["Calendar", "ShieldCheck", "Clock"];

  return (
    <section
      id="booking-details"
      className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-slate-50 border-y border-slate-200/60 overflow-hidden"
    >
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="text-center max-w-3xl mx-auto mb-[calc(20px+(56-20)*((100vw-320px)/(1920-320)))] ">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 font-bold text-[12px] rounded-full uppercase tracking-wide shadow-sm w-fit bg-[#e11d4810]"
            style={{ color: primaryColor }}
          >
            {bookingJourney.badge || "Scheduling Engine"}
          </span>
          <h2 className="text-[calc(22px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2">
            {bookingJourney.title || "The In-Chat Booking Journey"}
          </h2>
          {bookingJourney.description && (
            <p className="text-[17px] font-medium text-slate-600 mt-3 leading-relaxed">
              {bookingJourney.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[calc(20px+(32-20)*((100vw-320px)/(1920-320)))] max-w-7xl mx-auto">
          {steps.map((step, idx) => {
            const fallbackIconName = fallbackIcons[idx % fallbackIcons.length];
            const IconComp =
              (LucideIcons as any)[fallbackIconName] || LucideIcons.Calendar;

            return (
              <div
                key={idx}
                className="group relative flex flex-col h-full bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden text-left"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/3] overflow-hidden ">
                  <Image
                    src={getResolvedImageUrl(step.image)}
                    alt={step.title}
                    width={500}
                    height={500}
                    unoptimized
                    className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Step Number Badge */}
                  <div
                    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center font-mono font-black text-[15px] shadow-md border border-white/50"
                    style={{ color: primaryColor }}
                  >
                    {idx < 9 ? `0${idx + 1}` : idx + 1}
                  </div>
                  {/* Bottom fade */}
                </div>

                {/* Content */}
                <div className="sm:p-6 p-4 pt-5 flex-1">
                  <h4
                    className="text-[17px] font-black text-slate-900 transition-colors duration-300 group-hover:text-rose-650"
                    style={{ color: primaryColor }}
                  >
                    {step.title}
                  </h4>
                  <p className="text-[15px] font-semibold text-slate-600 mt-2.5 leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>

                {/* Subtle corner accent glow */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-rose-500/5 to-transparent rounded-bl-full pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
