export const PLATFORM_CONTENT_TYPES: Record<string, string[]> = {
  facebook: ["post", "story", "reel", "feed", "video"],
  instagram: ["post", "story", "reel"],
  linkedin: ["post"],
  twitter: ["post"],
  youtube: ["videos", "shorts"],
  threads: ["post"]
};

export const TONES = [
  "Engaging & Professional",
  "Creative & Fun",
  "Informative & Educational",
  "Promotional & Bold",
  "Casual & Friendly",
  "Witty & Humorous"
];

export const LANGUAGES = ["English", "Spanish", "French", "German", "Portuguese", "Arabic", "Hindi"];

export const getPlatformStyle = (platform: string) => {
  switch (platform?.toLowerCase()) {
    case "instagram":
      return {
        bg: "bg-gradient-to-br from-[#E4405F]/5 to-[#E4405F]/10 dark:from-[#E4405F]/15 dark:to-transparent",
        border: "border-[#E4405F]/30 dark:border-[#E4405F]/40",
        text: "text-[#E4405F]",
        glow: "shadow-[0_0_30px_rgba(228,64,95,0.08)]",
        badgeBg: "bg-gradient-to-tr from-[#FFB13B] via-[#E4405F] to-[#833AB4] text-white",
      };
    case "facebook":
      return {
        bg: "bg-gradient-to-br from-[#1877F2]/5 to-[#1877F2]/10 dark:from-[#1877F2]/15 dark:to-transparent",
        border: "border-[#1877F2]/30 dark:border-[#1877F2]/40",
        text: "text-[#1877F2]",
        glow: "shadow-[0_0_30px_rgba(24,119,242,0.08)]",
        badgeBg: "bg-[#1877F2] text-white",
      };
    case "linkedin":
      return {
        bg: "bg-gradient-to-br from-[#0A66C2]/5 to-[#0A66C2]/10 dark:from-[#0A66C2]/15 dark:to-transparent",
        border: "border-[#0A66C2]/30 dark:border-[#0A66C2]/40",
        text: "text-[#0A66C2]",
        glow: "shadow-[0_0_30px_rgba(10,102,194,0.08)]",
        badgeBg: "bg-[#0A66C2] text-white",
      };
    case "twitter":
    case "x":
      return {
        bg: "bg-slate-500/5 dark:bg-white/5",
        border: "border-slate-300 dark:border-white/20",
        text: "text-slate-850 dark:text-white",
        glow: "shadow-[0_0_30px_rgba(0,0,0,0.05)]",
        badgeBg: "bg-black dark:bg-(--page-body-bg) text-white",
      };
    case "youtube":
      return {
        bg: "bg-gradient-to-br from-[#FF0000]/5 to-[#FF0000]/10 dark:from-[#FF0000]/15 dark:to-transparent",
        border: "border-[#FF0000]/30 dark:border-[#FF0000]/40",
        text: "text-[#FF0000]",
        glow: "shadow-[0_0_30px_rgba(255,0,0,0.08)]",
        badgeBg: "bg-[#FF0000] text-white",
      };
    case "threads":
      return {
        bg: "bg-slate-500/5 dark:bg-white/5",
        border: "border-slate-350 dark:border-white/20",
        text: "text-slate-900 dark:text-white",
        glow: "shadow-[0_0_30px_rgba(0,0,0,0.05)]",
        badgeBg: "bg-black dark:bg-(--card-color) text-white",
      };
    default:
      return {
        bg: "bg-slate-50 dark:bg-slate-900/50",
        border: "border-slate-200 dark:border-slate-800",
        text: "text-slate-600 dark:text-slate-400",
        glow: "",
        badgeBg: "bg-slate-500 text-white",
      };
  }
};
