"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { Facebook, Instagram, MessageCircle, MessageSquare, Send, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/src/elements/ui/button";


const FloatingWidget = () => {
  const pathname = usePathname();
  const { 
    widget_enabled,
    widget_whatsapp_url,
    widget_telegram_url,
    widget_instagram_url,
    widget_facebook_url,
    app_name
  } = useAppSelector((state) => state.setting);

  const [isOpen, setIsOpen] = useState(false);

  const isPublicRoute = 
    pathname === "/" || 
    pathname === "/landing" || 
    pathname.startsWith("/product") || 
    pathname.startsWith("/channel") || 
    pathname.startsWith("/page");

  if (!widget_enabled || !isPublicRoute) return null;

  const channels = [
    { id: "whatsapp", name: "WhatsApp", url: widget_whatsapp_url, color: "bg-whatsapp hover:bg-whatsapp-hover text-white", icon: MessageSquare },
    { id: "telegram", name: "Telegram", url: widget_telegram_url, color: "bg-telegram hover:bg-telegram-hover text-white", icon: Send },
    { id: "instagram", name: "Instagram", url: widget_instagram_url, color: "bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] hover:opacity-90 text-white!", icon: Instagram },
    { id: "facebook", name: "Messenger", url: widget_facebook_url, color: "bg-facebook hover:bg-facebook-hover text-white", icon: Facebook },
  ].filter(c => c.url && c.url.trim() !== "");

  if (channels.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 font-sans select-none">
      <div className="relative group">
        <Button variant="unstyled"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg border ${
            isOpen 
              ? "bg-white text-zinc-800 border-zinc-200 hover:bg-zinc-50" 
              : "bg-primary text-white border-primary hover:scale-105 active:scale-95 shadow-primary/20"
          }`}
          aria-label="Toggle contact channels"
        >
          {isOpen ? (
            <X size={22} className="animate-in fade-in zoom-in duration-300" />
          ) : (
            <MessageCircle size={26} className="animate-in fade-in zoom-in duration-300" />
          )}
        </Button>
        
        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-max bg-zinc-900/90 backdrop-blur-sm text-[9px] text-zinc-400 py-0.5 px-2 rounded-md shadow-md border border-zinc-800 animate-in fade-in slide-in-from-top-1 duration-300 whitespace-nowrap font-medium">
            Widget by <span className="font-semibold text-primary">{app_name || "."}</span>
          </div>
        )}
      </div>

      <div 
        className={`flex items-center gap-2.5 transition-all duration-500 origin-left ${
          isOpen 
            ? "opacity-100 scale-100 translate-x-0" 
            : "opacity-0 scale-90 -translate-x-4 pointer-events-none"
        }`}
      >
        {channels.map((ch, i) => {
          const Icon = ch.icon;
          return (
            <a
              key={ch.id}
              href={ch.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ transitionDelay: `${i * 30}ms` }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95 shadow-md ${ch.color}`}
              title={ch.name}
            >
              <Icon size={18} />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingWidget;
