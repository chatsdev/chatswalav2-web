import { cn } from "@/src/lib/utils";
import { CardItemProps } from "@/src/types/campaign";

export const CardItem = ({
  title,
  description,
  icon,
  isActive,
  onClick,
}: CardItemProps) => (
  <div
    onClick={onClick}
    className={cn(
      "sm:p-6 p-4 rounded-lg flex-col sm:flex-row border transition-all duration-300 cursor-pointer flex items-start sm:items-center gap-5",
      isActive
        ? "bg-primary/10 border-primary/5 dark:bg-primary/5 dark:border-primary ring-1 ring-primary/20"
        : "bg-white dark:bg-(--dark-sidebar) border-slate-100 dark:border-(--card-border-color) dark:hover:border-primary/50 hover:border-slate-200",
    )}
  >
    <div
      className={cn(
        "w-12 h-12 rounded-lg flex items-center justify-center transition-all shrink-0",
        isActive
          ? "bg-(--light-primary) text-primary dark:bg-primary dark:text-white"
          : "bg-slate-400/10 dark:bg-(--dark-sidebar) text-slate-500",
      )}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <h3
        className={cn(
          "font-bold text-base truncate",
          isActive
            ? "text-slate-900 dark:text-white"
            : "text-slate-600 dark:text-gray-400",
        )}
      >
        {title}
      </h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);
