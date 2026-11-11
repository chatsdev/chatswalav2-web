"use client";

import { InboxTeamProps } from "@/src/types/product";
import { getResolvedImageUrl } from "@/src/utils/image";
import * as LucideIcons from "lucide-react";
import Image from "next/image";

const getIconComponent = (iconName?: string) => {
  if (!iconName) return (LucideIcons as any).Sparkles;
  return (LucideIcons as any)[iconName] || (LucideIcons as any).Sparkles;
};

export default function InboxTeam({ team, primaryColor }: InboxTeamProps) {
  const teamCards = Array.isArray(team.cards) ? team.cards : [];
  const imageUrl = team.side_image || team.image || "";

  return (
    <section className="py-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] bg-[#f8fafc] border-b border-slate-200/50 relative overflow-hidden">
      {/* Subtle background blob */}
      <div
        className="absolute right-[-10%] bottom-[-5%] w-[35vw] h-[35vw] rounded-full blur-[90px] pointer-events-none"
        style={{ backgroundColor: "var(--primary)", opacity: 0.05 }}
      />

      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-[calc(20px+(64-20)*((100vw-320px)/(1920-320)))] items-center max-w-7xl mx-auto">
          {/* Left Column: Text & Structured Feature Rows */}
          <div className="flex flex-col text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full uppercase tracking-wide shadow-sm w-fit"
              style={{ backgroundColor: primaryColor + "10" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: primaryColor }}
              />
              <span
                className="text-xs font-bold font-mono"
                style={{ color: primaryColor }}
              >
                {team.badge || "Team Collaboration"}
              </span>
            </div>

            <h3 className="text-[calc(20px+8*((100vw-320px)/1600))] font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              {team.title || "Build Better Collaborations Behind the Scenes"}
            </h3>

            {team.description && (
              <p className="text-[15px] font-medium text-slate-600 leading-relaxed mb-[calc(16px+(32-16)*((100vw-320px)/(1920-320)))]">
                {team.description}
              </p>
            )}

            <div className="space-y-4">
              {teamCards.map((card: any, idx: number) => {
                const IconComp = getIconComponent(card.icon);
                const bgColors = [
                  "bg-light-primary text-primary",
                  "bg-teal-50 text-teal-600",
                  "bg-purple-50 text-purple-600",
                ];
                const colClass = bgColors[idx % bgColors.length];

                return (
                  <div
                    key={idx}
                    className="p-4 bg-white rounded-lg border border-slate-200/60 shadow-sm hover:border-emerald-300 transition-colors flex gap-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${colClass} flex items-center justify-center shrink-0`}
                    >
                      <IconComp size={18} />
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800 break-all whitespace-normal line-clamp-1">
                        {card.title}
                      </p>
                      <p className="text-[14px] font-medium text-slate-600 mt-1 leading-relaxed break-all whitespace-normal line-clamp-4">
                        {card.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Collaboration dynamic image */}
          <div className="relative p-1 w-full max-w-[500px] mx-auto">
            <div className="w-full hover:-translate-y-1 transition-all duration-300">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden min-w-[600px]">
                <Image
                  src={getResolvedImageUrl(imageUrl)}
                  alt={team.title || "Team Collaboration Preview"}
                  fill
                  unoptimized
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
