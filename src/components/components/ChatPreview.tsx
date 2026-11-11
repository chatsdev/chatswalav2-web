"use client";

import { ChatPreviewProps } from "@/src/types/components";
import { Save } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import React from "react";

const ChatPreview: React.FC<ChatPreviewProps> = ({
  formValues,
  bgType,
  imagePreview,
}) => {
  return (
    <div className="sticky top-24">
      <div
        className="relative w-full aspect-4/5 sm:aspect-video lg:aspect-9/8 rounded-lg overflow-hidden flex flex-col dark:border-(--card-border-color) border"
        style={{
          backgroundColor:
            bgType === "color"
              ? formValues.bg_color || undefined
              : "var(--background)",
        }}
      >
        {bgType === "image" && imagePreview && (
          <div className="absolute inset-0 z-0">
            <Image
              src={imagePreview}
              alt="bg"
              width={100}
              height={100}
              className="w-full h-full object-cover opacity-80"
              unoptimized
            />
          </div>
        )}

        <div className="z-10 p-4 border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
              J
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                John Doe
              </p>
              <p className="text-[10px] text-primary font-bold">online</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
              <Save size={16} />
            </div>
          </div>
        </div>

        <div className="z-10 flex-1 p-6 space-y-4 overflow-y-auto custom-scrollbar">
          <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div
              className="max-w-[80%] p-3 rounded-2xl rounded-tl-none shadow-sm border border-black/5"
              style={{
                backgroundColor: formValues.contact_bubble_color || undefined,
              }}
            >
              <p
                className="text-xs leading-relaxed font-medium"
                style={{ color: formValues.contact_text_color || undefined }}
              >
                Hello there! How can I help you today? 👋
              </p>
              <p className="text-[9px] text-slate-400 text-right mt-1 font-bold">
                10:00 AM
              </p>
            </div>
          </motion.div>

          <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-end"
          >
            <div
              className="max-w-[80%] p-3 rounded-2xl rounded-tr-none shadow-sm border border-black/5"
              style={{
                backgroundColor: formValues.user_bubble_color || undefined,
              }}
            >
              <p
                className="text-xs leading-relaxed font-medium"
                style={{ color: formValues.user_text_color || undefined }}
              >
                {
                  "I'm just testing out this amazing new chat theme feature! It looks great."
                }
              </p>
              <p className="text-[9px] text-white/60 text-right mt-1 font-bold">
                10:01 AM
              </p>
            </div>
          </motion.div>

          <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex justify-start"
          >
            <div
              className="max-w-[80%] p-3 rounded-2xl rounded-tl-none shadow-sm border border-black/5"
              style={{
                backgroundColor: formValues.contact_bubble_color || undefined,
              }}
            >
              <p
                className="text-xs leading-relaxed font-medium"
                style={{ color: formValues.contact_text_color || undefined }}
              >
                Glad you like it! You can change colors and even set an image
                background.
              </p>
              <p className="text-[9px] text-slate-400 text-right mt-1 font-bold">
                10:02 AM
              </p>
            </div>
          </motion.div>

          <div className="flex justify-center my-8">
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold shadow-md uppercase tracking-widest animate-pulse ${formValues.theme_color == null ? "text-slate-600" : "text-white"}`}
              style={{ backgroundColor: formValues.theme_color || undefined }}
            >
              Theme Preview Active
            </span>
          </div>
        </div>

        <div className="z-10 p-4 bg-white/80 dark:bg-black/60 backdrop-blur-md flex items-center gap-3">
          <div className="flex-1 h-10 bg-slate-100 dark:bg-white/10 rounded-full flex items-center px-4">
            <p className="text-xs text-slate-400">Type a message...</p>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${formValues.theme_color == null ? "text-slate-600" : "text-white"}`}
            style={{ backgroundColor: formValues.theme_color || undefined }}
          >
            <Save size={18} />
          </div>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-500 text-center italic">
        * This is a simulation. Changes will be applied to your real chat window
        after saving.
      </p>
    </div>
  );
};

export default ChatPreview;
