"use client";

import { Input } from "@/src/elements/ui/input";
import { ColorSettingsProps } from "@/src/types/components";
import React from "react";

const ColorSettings: React.FC<ColorSettingsProps> = ({
  t,
  formValues,
  handleColorChange,
}) => {
  const colorOptions = [
    {
      key: "theme_color",
      label: t("theme_color") || "Primary Theme Color",
      sub: "Buttons and accents",
    },
    {
      key: "user_bubble_color",
      label: t("user_bubble") || "User Message Bubble",
      sub: "Your messages",
    },
    {
      key: "contact_bubble_color",
      label: t("contact_bubble") || "Contact Message Bubble",
      sub: "Incoming messages",
    },
    {
      key: "user_text_color",
      label: t("user_text_color") || "User Message Text Color",
      sub: "Your message text",
    },
    {
      key: "contact_text_color",
      label: t("contact_text_color") || "Contact Message Text Color",
      sub: "Incoming message text",
    },
  ] as const;

  const getFallbackColor = (key: string) => {
    const defaults: Record<string, string> = {
      theme_color: "var(--whatsapp-teal)",
      user_bubble_color: "var(--whatsapp-light)",
      contact_bubble_color: "var(--background)",
      user_text_color: "var(--black)",
      contact_text_color: "var(--black)",
    };
    return defaults[key] || "var(--black)";
  };

  return (
    <section className="bg-white dark:bg-(--card-color) sm:p-5 p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white ">
        {t("custom_colors") || "Custom Colors"}
      </h2>

      <div className="space-y-4">
        {colorOptions.map((option) => (
          <div
            key={option.key}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
          >
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-slate-700 dark:text-white">
                {option.label}
              </p>
              <p className="text-[11px] text-slate-400">{option.sub}</p>
            </div>
            <Input
              type="color"
              value={formValues[option.key] || getFallbackColor(option.key)}
              onChange={(e) => handleColorChange(option.key, e.target.value)}
              className="w-10! h-10! p-0! rounded-lg cursor-pointer border-none bg-transparent"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ColorSettings;
