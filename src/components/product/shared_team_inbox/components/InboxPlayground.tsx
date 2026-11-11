"use client";

import { InboxPlaygroundProps } from "@/src/types/product";
import { getResolvedImageUrl } from "@/src/utils/image";
import { Check } from "lucide-react";
import Image from "next/image";

export default function InboxPlayground({
  sandbox,
  primaryColor,
}: InboxPlaygroundProps) {
  // Use either sandbox.image or sandbox.side_image
  const imageUrl = sandbox.image || sandbox.side_image || "";

  return (
    <section
      id="playground-sec"
      className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-[#f8fafc] border-y border-slate-200/60 relative"
    >
      {/* Subtle backdrop dot matrix */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(var(--primary) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[calc(16px+(48-16)*((100vw-320px)/(1920-320)))] items-center max-w-7xl mx-auto">
          {/* Left Column: Text & Features List */}
          <div className="text-left flex flex-col items-start">
            <span
              className="text-sm font-bold font-mono block px-3 py-1 rounded-full border shadow-sm uppercase tracking-wide mb-6"
              style={{
                color: primaryColor,
                backgroundColor: primaryColor + "10",
                borderColor: primaryColor + "30",
              }}
            >
              {sandbox.badge || "Interactive Sandbox"}
            </span>
            <h2 className="text-[calc(22px+10*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              {sandbox.title || "Take the Team Inbox for a Test Drive"}
            </h2>
            <p className="text-[15px] font-semibold text-slate-500 leading-relaxed mb-[calc(12px+(32-12)*((100vw-320px)/(1920-320)))]">
              {sandbox.subtitle ||
                "Bring all WhatsApp, Instagram, and Facebook conversations into a single desktop viewport. Help your agents close leads 10x faster with integrated AI."}
            </p>

            {/* Structured benefits block */}
            <div className="space-y-3.5">
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: primaryColor + "15",
                    color: primaryColor,
                  }}
                >
                  <Check size={12} className="stroke-[3]" />
                </div>
                <span className="text-[13.5px] font-bold text-slate-650">
                  Real-time team chat collaboration
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: primaryColor + "15",
                    color: primaryColor,
                  }}
                >
                  <Check size={12} className="stroke-[3]" />
                </div>
                <span className="text-[13.5px] font-bold text-slate-650">
                  Automatic multi-agent assignment
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: primaryColor + "15",
                    color: primaryColor,
                  }}
                >
                  <Check size={12} className="stroke-[3]" />
                </div>
                <span className="text-[13.5px] font-bold text-slate-650">
                  Secure customer number privacy controls
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Dynamic Image Card */}
          <div className="relative w-full max-w-[500px] mx-auto z-10 p-1">
            {/* Colorful backdrop glow */}

            <div className="w-full hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={getResolvedImageUrl(imageUrl)}
                  alt={sandbox.title || "Team Inbox Preview"}
                  fill
                  unoptimized
                  className="object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
