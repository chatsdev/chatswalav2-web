import { Pagination } from "@/src/shared/Pagination";
import { ReplyMaterialGridProps } from "@/src/types/replyMaterial";
import ReplyMaterialCard from "./ReplyMaterialCard";
import ReplyMaterialEmptyState from "./ReplyMaterialEmptyState";

const SkeletonCard = () => (
  <div className="bg-white dark:bg-(--card-color) rounded-2xl border border-slate-100 dark:border-(--card-border-color) overflow-hidden animate-pulse shadow-sm">
    <div className="h-36 bg-slate-100 dark:bg-slate-800/40" />
    <div className="p-3 flex items-center gap-2">
      <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded flex-1" />
      <div className="h-6 w-6 bg-slate-100 dark:bg-slate-800/40 rounded" />
      <div className="h-6 w-6 bg-slate-100 dark:bg-slate-800/40 rounded" />
    </div>
  </div>
);

const ReplyMaterialGrid: React.FC<ReplyMaterialGridProps> = ({ items, type, isLoading, page, totalPages, totalItems, limit, selectedIds, onPageChange, onToggleSelect, onEdit, onDelete, onAdd }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <ReplyMaterialEmptyState type={type} onAdd={onAdd} />;
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-6">
          {items.map((item) => (
            <ReplyMaterialCard key={item._id} item={item} isSelected={selectedIds.includes(item._id)} onToggleSelect={onToggleSelect} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex-shrink-0 pt-4 bg-(--page-body-bg) dark:bg-(--dark-body)">
          <Pagination totalCount={totalItems} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={() => { }} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
};

export default ReplyMaterialGrid;
