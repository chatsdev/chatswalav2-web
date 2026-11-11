"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { BackgroundSettingsProps } from "@/src/types/components";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import React from "react";

const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  t,
  bgType,
  setBgType,
  formValues,
  imagePreview,
  setImagePreview,
  handleColorChange,
  handleImageChange,
  setFormValues,
}) => {
  return (
    <section className="bg-white dark:bg-(--card-color) sm:p-5 p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-slate-800 dark:text-white ">
          {t("background") || "Background"}
        </h2>
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-lg h-8">
          <Button
            onClick={() => setBgType("color")}
            className={`px-3! h-6! border-none! py-1! text-xs! font-bold! rounded-md! transition-all ${bgType === "color" ? "bg-white! dark:bg-primary! text-primary! dark:text-white! shadow-sm!" : "text-slate-500! bg-[unset]!"}`}
          >
            Color
          </Button>
          <Button
            onClick={() => setBgType("image")}
            className={`px-3! h-6! border-none! py-1! text-xs! font-bold! rounded-md! transition-all ${bgType === "image" ? "bg-white! dark:bg-primary! text-primary! dark:text-white! shadow-sm!" : "text-slate-500! bg-[unset]!"}`}
          >
            Image
          </Button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {bgType === "color" ? (
          <motion.div
            key="color"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
          >
            <p className="text-sm font-bold text-slate-700 dark:text-white">
              {t("bg_color") || "Background Color"}
            </p>
            <Input
              type="color"
              value={formValues.bg_color || "var(--background)"}
              onChange={(e) => handleColorChange("bg_color", e.target.value)}
              className="w-10! h-10! p-0! rounded-lg cursor-pointer border-none bg-transparent"
            />
          </motion.div>
        ) : (
          <motion.div
            key="image"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="relative group aspect-video rounded-xl overflow-hidden border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-col items-center justify-center bg-slate-50 dark:bg-white/2">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <Label className="cursor-pointer bg-white text-black p-2 rounded-full hover:scale-110 transition-transform">
                      <Upload size={18} />
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </Label>
                    <Button
                      onClick={() => {
                        setImagePreview(null);
                        setFormValues((p) => ({ ...p, bg_image: null }));
                      }}
                      className="bg-white text-rose-500 p-2 rounded-full hover:scale-110 transition-transform"
                    >
                      <X size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <Label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                  <ImageIcon size={32} className="text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-400">
                    Click to upload image
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Label>
              )}
            </div>
            <p className="text-[10px] text-center text-slate-400">
              High quality images work best for backgrounds.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BackgroundSettings;
