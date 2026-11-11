/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Attachment } from "@/src/types/components";

export function HighlightHashtags({ text }: { text: string }) {
  if (!text) return <span className="text-slate-400 italic">Your caption will appear here...</span>;
  const hashtagRegex = /#(\w+)/g;
  const parts = text.split(hashtagRegex);
  if (parts.length === 1) return <span className="break-all whitespace-normal line-clamp-4">{text}</span>;
  return (
    <>
      {parts.map((part, index) => {
        if (index % 2 === 1) {
          return (
            <span key={index} className="text-primary font-semibold hover:underline cursor-pointer">
              #{part}
            </span>
          );
        }
        return part;
      })}
    </>
  );
}

export function MediaCarousel({ mediaList }: { mediaList: Attachment[] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  if (!mediaList || mediaList.length === 0) return null;

  const current = mediaList[activeIdx] || mediaList[0];
  if (!current) return null;
  const isVideo = current.mimeType?.startsWith("video/") || current.fileUrl?.endsWith(".mp4");

  return (
    <div className="relative aspect-video w-full bg-slate-900 dark:bg-(--dark-body) flex items-center justify-center overflow-hidden">
      {isVideo ? (
        <video
          src={current.fileUrl}
          className="w-full h-full object-contain"
          controls
          autoPlay
          muted
          loop
        />
      ) : (
        <img
          src={current.fileUrl}
          alt="Media Preview"
          className="w-full h-full object-contain"
        />
      )}

      {mediaList.length > 1 && (
        <>
          <button
            onClick={() => setActiveIdx((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setActiveIdx((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-all"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-y-1/2 flex gap-1.5">
            {mediaList.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  activeIdx === i ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// Tooltip helpers (Simple custom implementation since we don't have Radix Tooltip initialized with provider)
export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <div className="relative group inline-block">{children}</div>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children }: any) {
  return <div className="inline-flex items-center">{children}</div>;
}

export function TooltipContent({ children, className }: any) {
  return (
    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs bg-slate-900 border border-slate-800 text-white font-semibold shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-normal ${className}`}>
      {children}
    </div>
  );
}

export function XIcon({ size }: { size: number }) {
  return <span style={{ fontSize: `${size}px`, lineHeight: 1 }}>×</span>;
}
