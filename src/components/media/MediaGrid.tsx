"use client";

import { MediaGridPropsData } from "@/src/types/media";
import { Check } from "lucide-react";
import Image from "next/image";
import React from "react";

const MediaGrid: React.FC<MediaGridPropsData> = ({ attachments, selectedItems, onSelect, onItemClick, isSelectionEnabled }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 py-4">
      {attachments?.map?.((item) => {
        const isSelected = selectedItems.includes(item._id);
        const isImage = item.mimeType.startsWith("image/");
        const isVideo = item.mimeType.startsWith("video/");

        return (
          <div
            key={item._id}
            className={`group relative aspect-square border rounded-lg cursor-pointer transition-all overflow-visible ${isSelected ? "border-primary shadow-sm" : "border-gray-100 dark:border-(--card-border-color)"}`}
            onClick={(e) => {
              if (isSelectionEnabled) {
                onSelect(item._id);
                return;
              }
              if ((e.target as HTMLElement).closest(".select-checkbox")) {
                return;
              }
              onItemClick(item);
            }}
          >
            <div
              className={`absolute -top-2.5 -right-2.5 z-10 transition-opacity select-checkbox ${isSelected || isSelectionEnabled ? "opacity-100" : "opacity-0"}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(item._id);
              }}
            >
              <div className={`w-4 h-4 rounded border shadow-sm flex items-center justify-center ${isSelected ? "bg-primary text-white" : "bg-white dark:bg-(--card-color) dark:border-(--card-border-color) border-gray-300"}`}>{isSelected && <Check size={14} strokeWidth={3} />}</div>
            </div>

            <div className="w-full h-full bg-gray-50 dark:bg-(--table-hover) flex items-center justify-center rounded-lg relative overflow-hidden">
              {isImage ? (
                <Image src={item.fileUrl} alt={item.fileName} className="w-full h-full object-cover lg:p-2 rounded-lg" width={100} height={100} unoptimized />
              ) : isVideo ? (
                <div className="w-full h-full relative group/video">
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/40">
                      <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center p-2 text-center">
                  <span className="text-4xl mb-2">📄</span>
                </div>
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/70 p-1 text-white text-xs truncate opacity-0 group-hover:opacity-100 transition-opacity">{item.fileName}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
