"use client";

import { Tag } from "@/src/types/components";
import TagCard from "./TagCard";
import { Pagination } from "@/src/shared/Pagination";
import { Tag as TagIcon } from "lucide-react";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { TagGridProps } from "@/src/types/tags";



const TagGrid = ({
  tags,
  isLoading,
  isFetching,
  totalCount,
  page,
  limit,
  onPageChange,
  onLimitChange,
  selectedIds,
  onSelectionChange,
  onEdit,
  onDelete,
  emptyMessage = "No tags found.",
}: TagGridProps) => {
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) p-5 space-y-4 animate-pulse">
            <div className="flex flex-col items-center space-y-4">
              <Skeleton className="w-16 h-16 rounded-lg" />
              <Skeleton className="w-24 h-4" />
            </div>
            <div className="pt-4 border-t border-slate-100 dark:border-(--card-border-color) flex justify-center gap-2">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="w-10 h-10 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 bg-white dark:bg-(--card-color) rounded-xl border border-dashed border-slate-200 dark:border-(--card-border-color)">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-full">
          <TagIcon className="h-8 w-8 text-slate-400" />
        </div>
        <p className="text-base font-medium text-slate-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Grid Containter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6  ">
        {tags.map((tag) => (
          <TagCard
            key={tag._id}
            tag={tag}
            isSelected={selectedIds.includes(tag._id)}
            onSelect={handleSelectRow}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination Container */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow overflow-hidden mt-8">
        <Pagination
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          isLoading={isLoading || isFetching}
          total={totalCount}
          className="border-none bg-transparent"
        />
      </div>
    </div>
  );
};

export default TagGrid;
