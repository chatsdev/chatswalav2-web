"use client";

import { useAppSelector } from "@/src/redux/hooks";

export default function HeaderBanner() {
  const { setting } = useAppSelector((state) => state.setting);

  // If banner is disabled, do not render anything
  if (!setting?.is_banner) return null;

  const bannerText = setting.banner_text || "Welcome to our platform!";
  const bannerPosition = setting.banner_possion || "center";
  const bannerBgColor = setting.banner_bg_color || "#f59e0b";
  const bannerTextColor = setting.banner_text_color || "#000000";

  const getAlignmentClass = (pos: string) => {
    switch (pos) {
      case "left":
        return "justify-start text-left";
      case "right":
        return "justify-end text-right";
      case "center":
        
      default:
        return "justify-center text-center";
    }
  };

  return (
    <div
      style={{ backgroundColor: bannerBgColor, color: bannerTextColor }}
      className={`py-2 px-4 flex items-center gap-2 font-semibold text-sm z-[99] shadow-sm relative overflow-hidden transition-all duration-300 ${getAlignmentClass(
        bannerPosition
      )}`}
    >
      {/* Subtle animated overlay for a premium look */}
      <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />

      <div className="flex items-center gap-2 relative z-10">
        <span className="tracking-wide">{bannerText}</span>
      </div>
    </div>
  );
}
