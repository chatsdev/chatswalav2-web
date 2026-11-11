"use client";

import { BookingCapabilitiesProps } from "@/src/types/product";
import { Clock, Globe, Link, Settings, Workflow } from "lucide-react";

export default function BookingCapabilities({
  architecture,
  primaryColor,
}: BookingCapabilitiesProps) {
  const steps = Array.isArray(architecture.steps) ? architecture.steps : [];

  const getArchIcon = (index: number) => {
    const icons = [
      <Workflow key="0" className="w-5 h-5" />,
      <Link key="1" className="w-5 h-5" />,
      <Clock key="2" className="w-5 h-5" />,
      <Globe key="3" className="w-5 h-5" />,
    ];
    return (
      icons[index % icons.length] || (
        <Settings key="default" className="w-5 h-5" />
      )
    );
  };

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-slate-50 border-b border-slate-200/50">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 text-left">
        <div className="text-center max-w-4xl mx-auto mb-[calc(20px+(48-20)*((100vw-320px)/(1920-320)))]">
          <span
            className="text-xs  px-4 py-1.5 rounded-full uppercase tracking-wide font-bold text-primary font-mono bg-[#e11d4810]"
            style={{ color: primaryColor }}
          >
            {architecture.description || "Engine Features"}
          </span>
          <h2 className="text-[calc(20px+12*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-tight mt-2.5">
            {architecture.title || "Robust Appointment Scheduling Architecture"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))] max-w-7xl mx-auto">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white sm:p-6 p-4 rounded-lg border border-slate-200/60 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 shrink-0 border"
                  style={{
                    backgroundColor: primaryColor + "10",
                    borderColor: primaryColor + "20",
                    color: primaryColor,
                  }}
                >
                  {getArchIcon(idx)}
                </div>
                <h4 className="text-md font-black text-slate-805">
                  {step.title}
                </h4>
                <p className="text-[15px] font-medium text-slate-500 mt-3 leading-relaxed font-sans">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
