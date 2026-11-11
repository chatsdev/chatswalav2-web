"use client";

import { DEFAULT_THEMES } from "@/src/data/components";
import { Button } from "@/src/elements/ui/button";
import { ThemePresetsProps } from "@/src/types/components";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const ThemePresets: React.FC<ThemePresetsProps> = ({
  t,
  presetType,
  setPresetType,
  formValues,
  bgType,
  handleThemeSelect,
  onResetDefault,
}) => {
  return (
    <section className="bg-white dark:bg-(--card-color) sm:p-5 p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) shadow-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-medium text-slate-800 dark:text-white ">
          {t("default_presets") || "Default Presets"}
        </h2>
        <div className="flex items-center gap-3">
          <Button
            onClick={onResetDefault}
            className="text-[10px]! font-bold! text-slate-400! hover:text-rose-500! transition-colors bg-slate-100! dark:bg-white/5! py-1.5! px-3! rounded-lg! border! h-7.25! border-transparent! hover:border-rose-100! dark:hover:border-rose-900/30!"
          >
            Reset to Default
          </Button>
          <div className="flex bg-slate-100 h-7.75! dark:bg-white/5 p-1 rounded-lg">
            <Button
              onClick={() => setPresetType("light")}
              className={`px-3! h-5.75! py-1! text-[10px]! font-bold! rounded-md! transition-all ${presetType === "light" ? "bg-primary! text-white! shadow-sm!" : "text-slate-500!"}`}
            >
              Light
            </Button>
            {/* <Button 
            onClick={() => setPresetType("dark")}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${presetType === "dark" ? "bg-primary text-white shadow-sm" : "text-slate-500"}`}
          >
            Dark
          </Button> */}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {DEFAULT_THEMES.filter((t) => t.type === presetType).map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleThemeSelect(theme)}
            className={`relative cursor-pointer rounded-lg overflow-hidden aspect-square border-2 transition-all ${formValues.theme_color === theme.theme_color && formValues.bg_color === theme.bg_color && bgType === "color" ? "shadow-lg" : "border-slate-100 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20"}`}
            style={
              formValues.theme_color === theme.theme_color &&
              formValues.bg_color === theme.bg_color &&
              bgType === "color"
                ? {
                    borderColor: theme.theme_color,
                    boxShadow: `0 10px 15px -3px color-mix(in srgb, ${theme.theme_color}, transparent 80%)`,
                  }
                : {}
            }
            title={theme.name}
          >
            <div
              className="w-full h-full flex flex-col"
              style={{ backgroundColor: theme.bg_color }}
            >
              <div className="flex-1 flex flex-col p-2 gap-1.5">
                <div
                  className="w-4/5 h-2.5 rounded-full self-start opacity-90 shadow-sm"
                  style={{ backgroundColor: theme.contact_bubble }}
                ></div>
                <div
                  className="w-4/5 h-2.5 rounded-full self-end opacity-90 shadow-sm"
                  style={{ backgroundColor: theme.user_bubble }}
                ></div>
              </div>
              <div
                className="h-3 w-full"
                style={{ backgroundColor: theme.theme_color }}
              ></div>
              <p className="px-2 py-1 text-[12px] text-slate-600 bg-white border border-slate-200">
                {theme.name}
              </p>
            </div>
            {formValues.theme_color === theme.theme_color &&
              formValues.bg_color === theme.bg_color &&
              bgType === "color" && (
                <div
                  className="absolute inset-0 backdrop-blur-[0.5px] flex items-center justify-center"
                  style={{
                    backgroundColor: `color-mix(in srgb, ${theme.theme_color}, transparent 90%)`,
                  }}
                >
                  <div
                    className="bg-white rounded-full p-2 shadow-xl border-2"
                    style={{
                      borderColor: `color-mix(in srgb, ${theme.theme_color}, transparent 50%)`,
                      backgroundColor: theme.theme_color,
                    }}
                  >
                    <Check size={20} className="text-white" />
                  </div>
                </div>
              )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ThemePresets;
