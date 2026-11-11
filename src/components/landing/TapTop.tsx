"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/src/elements/ui/button";

const TapTop = () => {
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Button
      onClick={scrollToTop}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`fixed bottom-8 right-8 z-30 w-[calc(40px+12*((100vw-320px)/1600))] h-[calc(40px+12*((100vw-320px)/1600))] rounded-xl flex items-center justify-center border-none cursor-pointer animate-bounce transition-all duration-500 ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-5 pointer-events-none"}`}
      style={{
        background: "var(--primary)",
        boxShadow: hover ? "0 8px 32px rgba(var(--primary), 0.5), 0 0 60px rgba(var(--primary), 0.25)" : "0 4px 24px rgba(var(--primary), 0.35), 0 0 40px rgba(var(--primary), 0.15)",
        transform: hover ? "translateY(-3px) scale(1.08)" : visible ? "translateY(0)" : "translateY(20px)",
      }}
      aria-label="Scroll to top"
    >
      <span
        className="absolute inset-px rounded-[15px] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%)",
        }}
      />
      <ArrowUp size={20} className="text-white relative z-10" strokeWidth={2.5} />
    </Button>
  );
};

export default TapTop;
