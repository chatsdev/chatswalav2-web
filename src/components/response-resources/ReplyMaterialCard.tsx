"use client";

import { TYPE_ACCENT, TYPE_FALLBACK_ICON } from "@/src/data/responseResource";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import {
  ReplyMaterialCardProps
} from "@/src/types/replyMaterial";
import {
  CheckSquare,
  Edit2,
  ExternalLink,
  FileVideo,
  Square,
  Trash2
} from "lucide-react";
import NextImage from "next/image";
import { useTranslation } from "react-i18next";

const ReplyMaterialCard: React.FC<ReplyMaterialCardProps> = ({
  item,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const isImage = item.type === "image" || item.type === "sticker";
  const isVideo = item.type === "video";
  const isText = item.type === "text";

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-(--card-color) rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5",
        isSelected
          ? "border-primary shadow-md shadow-primary/10"
          : "border-slate-100 dark:border-(--card-border-color) shadow-sm",
      )}
    >
      <Button
        onClick={() => onToggleSelect(item._id)}
        className="absolute bg-[unset]! p-0! top-2.5 ltr:left-2.5 rtl:right-2.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        aria-label="Select item"
      >
        {isSelected ? (
          <CheckSquare size={20} className="text-primary drop-shadow-sm" />
        ) : (
          <Square
            size={20}
            className="text-slate-300 dark:text-slate-600 drop-shadow-sm"
          />
        )}
      </Button>

      <div
        className={cn(
          "relative h-36 flex items-center justify-center overflow-hidden",
          TYPE_ACCENT[item.type],
        )}
      >
        {isImage && item.file_url ? (
          <NextImage
            src={item.file_url}
            alt={item.name}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
            unoptimized
          />
        ) : isVideo && item.file_url ? (
          <div className="flex flex-col items-center gap-2">
            <FileVideo size={36} className="text-purple-400" />
            <a
              href={item.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-bold text-purple-500 hover:text-purple-600 uppercase tracking-wider"
              onClick={(e) => e.stopPropagation()}
            >
              {t("preview")} <ExternalLink size={10} />
            </a>
          </div>
        ) : isText ? (
          <div className="px-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed font-medium break-all">
              {item.content || t("no_content")}
            </p>
          </div>
        ) : item.type === "flow" ? (
          <div className="px-4 text-center flex flex-col items-center gap-2">
            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 break-all leading-relaxed font-medium">
              {item.content || t("no_message_body")}
            </p>
            <div className="px-3 py-1 bg-white dark:bg-(--dark-body) break-all line-clamp-2 rounded-2xl border border-slate-200 dark:border-(--card-border-color) text-[10px] font-bold text-primary uppercase tracking-tight shadow-sm">
              {item.button_text || t("open_flow")}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {TYPE_FALLBACK_ICON[item.type]}
            {item.file_url && (
              <a
                href={item.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex  items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-primary uppercase tracking-wider"
                onClick={(e) => e.stopPropagation()}
              >
                {t("open")} <ExternalLink size={10} />
              </a>
            )}
          </div>
        )}
      </div>

      <div className="p-3 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate flex-1">
          {item.name}
        </p>

        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onEdit(item)}
            className="h-8 w-8 rounded-lg hover:bg-primary/5 hover:text-primary"
            aria-label="Edit"
          >
            <Edit2 size={14} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(item._id)}
            className="h-8 w-8 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReplyMaterialCard;
