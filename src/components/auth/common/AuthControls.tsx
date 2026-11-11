"use client";

import { Button } from "@/src/elements/ui/button";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setRTL } from "@/src/redux/reducers/layoutSlice";
import { Moon, PilcrowLeft, PilcrowRight, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

export const AuthControls = () => {
  const dispatch = useAppDispatch();
  const { isRTL } = useAppSelector((state) => state.layout);
  const { theme, setTheme } = useTheme();
  const themeBtnRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const darkMode = theme === "dark";

  const handleThemeToggle = () => {
    if (!themeBtnRef.current) return;

    const rect = themeBtnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    if (!document.startViewTransition) {
      setTheme(darkMode ? "light" : "dark");
      return;
    }

    const transition = document.startViewTransition(() => {
      setTheme(darkMode ? "light" : "dark");
    });

    transition.ready.then(() => {
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center bg-white/60 dark:bg-(--table-hover)! rounded-lg border border-slate-200/50 dark:border-(--card-border-color) shadow-xs transition-all duration-300">
      {/* Dark / Light Mode Toggle */}
      <Button
        ref={themeBtnRef}
        variant="ghost"
        size="icon"
        onClick={handleThemeToggle}
        className="w-9 h-9 rounded-lg cursor-pointer transition-all hover:scale-105 active:scale-95 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-white dark:hover:text-primary dark:hover:bg-(--table-hover)"
        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
      </Button>
    </div>
  );
};
