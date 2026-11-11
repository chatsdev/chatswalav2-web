"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { useEffect, useState } from "react";
import { X, Check, Megaphone } from "lucide-react";
import Images from "@/src/shared/Image";
import { useRouter } from "next/navigation";
import { Button } from "@/src/elements/ui/button";


export default function AnnouncementModal() {
  const router = useRouter();
  const { setting } = useAppSelector((state) => state.setting);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if the popup is enabled in settings and not dismissed yet
    const isPopupEnabled = setting?.is_popup;
    const isDismissed = localStorage.getItem("announcement_popup_dismissed") === "true";

    if (isPopupEnabled && !isDismissed) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [setting]);

  if (!mounted || !visible || !setting) return null;

  const handleDismiss = () => {
    localStorage.setItem("announcement_popup_dismissed", "true");
    setVisible(false);
  };

  const handleAction = () => {
    handleDismiss();
    
    const buttonUrl = setting.popup_button_url;
    if (buttonUrl) {
      if (buttonUrl.startsWith("http://") || buttonUrl.startsWith("https://")) {
        window.open(buttonUrl, "_blank", "noopener,noreferrer");
      } else {
        router.push(buttonUrl);
      }
    }
  };

  // Safe configs
  const title = setting.popup_title || "Special Announcement";
  const description = setting.popup_description || "";
  const imageUrl = setting.popup_image_url;
  const bullets = setting.popup_bullets || [];
  const buttonText = setting.popup_button_text;

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-opacity duration-300">
      {/* Modal Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-2xl rounded-2xl w-full max-w-[420px] overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-300">
        
        {/* Close Button */}
        <Button variant="unstyled"
          onClick={handleDismiss}
          type="button"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/15 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center text-zinc-500 dark:text-zinc-300 hover:text-zinc-800 dark:hover:text-white transition-all z-20 cursor-pointer"
          aria-label="Close announcement"
        >
          <X size={16} className="stroke-[2.5] text-white" />
        </Button>

        {/* Cover Image or Accent Header */}
        {imageUrl ? (
          <div className="relative w-full h-[190px] bg-zinc-50 dark:bg-zinc-950 overflow-hidden shrink-0">
            <Images
              src={imageUrl}
              alt="Announcement Header"
              className="w-full h-full object-cover"
            />
            {/* Visual gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="w-full h-[120px] bg-gradient-to-br from-primary to-teal-600 dark:from-primary dark:to-teal-800 flex flex-col items-center justify-center text-white shrink-0 relative">
            {/* Soft decorative background circles */}
            <div className="absolute w-24 h-24 rounded-full bg-white/10 -top-8 -left-8 pointer-events-none" />
            <div className="absolute w-24 h-24 rounded-full bg-white/5 -bottom-8 -right-8 pointer-events-none" />
            
            <Megaphone size={36} className="animate-bounce relative z-10" />
          </div>
        )}

        {/* Modal Content */}
        <div className="p-6 flex-1 flex flex-col text-left">
          <h3 className="text-lg sm:text-xl font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight mb-2">
            {title}
          </h3>
          
          {description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
              {description}
            </p>
          )}

          {/* Dynamic Bullets List */}
          {bullets.length > 0 && (
            <ul className="space-y-2 mb-5">
              {bullets.map((bullet: string, idx: number) => (
                <li key={idx} className="flex gap-2.5 items-start text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary flex items-center justify-center mt-0.5 shrink-0">
                    <Check size={11} className="stroke-[3]" />
                  </span>
                  <span className="flex-1 break-words">{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Call-to-action Button */}
          {buttonText && (
            <Button variant="unstyled"
              onClick={handleAction}
              type="button"
              className="w-full bg-primary hover:bg-primary/95 text-white h-11 text-sm font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-200 cursor-pointer flex items-center justify-center"
            >
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
