"use client";

import { Checkbox } from "@/src/elements/ui/checkbox";
import { Button } from "@/src/elements/ui/button";
import { Edit2, Trash2, Tag as TagIcon } from "lucide-react";
import { Tag } from "@/src/types/components";
import { cn } from "@/src/lib/utils";
import Can from "@/src/components/shared/Can";
import { TagCardProps } from "@/src/types/tags";



const TagCard = ({ tag, isSelected, onSelect, onEdit, onDelete }: TagCardProps) => {
  return (
    <div
      className={cn(
        "group relative flex flex-col h-full bg-white dark:bg-(--card-color) rounded-xl border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-1",
        isSelected
          ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm"
          : "border-slate-200/60 dark:border-(--card-border-color)"
      )}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-4 left-4 rtl:left-0 rtl:right-4 z-10">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(tag._id, checked === true)}
          className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      </div>

      {/* Tag Content */}
      <div className="flex flex-col flex-1 items-center justify-center pt-2 pb-4 space-y-4">
        <div
          className="w-16 h-16 rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110"
          style={{ backgroundColor: `${tag.color}15`, color: tag.color || "var(--primary)" }}
        >
          <TagIcon size={32} strokeWidth={1.5} />
        </div>

        <div className="text-center space-y-1">
          <h3
            className="text-md font-bold  transition-colors break-all line-clamp-2"
            style={{ color: tag.color || "inherit" }}
          >
            {tag.label}
          </h3>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2 pt-4 mt-2 border-t border-slate-100 dark:border-(--card-border-color) transition-opacity duration-300">
        <Can permission="update.tags">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 shadow-xs dark:bg-(--page-body-bg) border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all"
            onClick={() => onEdit(tag)}
            title="Edit Tag"
          >
            <Edit2 size={16} />
          </Button>
        </Can>
        <Can permission="delete.tags">
          <Button
            variant="ghost"
            size="sm"
            className="w-10 h-10 border-none dark:bg-(--page-body-bg) text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs"
            onClick={() => onDelete(tag._id)}
            title="Delete Tag"
          >
            <Trash2 size={16} />
          </Button>
        </Can>
      </div>

      <div
        className="absolute top-4 right-4 rtl:right-auto rtl:left-4 w-2 h-2 rounded-full"
        style={{ backgroundColor: tag.color || "var(--primary)" }}
      />
    </div>
  );
};

export default TagCard;
