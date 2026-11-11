import { formatDate } from "@/src/utils";
import { Clock } from "lucide-react";

interface TimelineProps {
  events: Array<{ type: string; title: string; created_at: string }>;
}

export const Timeline = ({ events }: TimelineProps) => {
  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) sm:p-6 p-4 shadow-sm h-full">
      <div className="flex items-center gap-2 mb-5">
        <Clock size={16} className="text-primary" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-white">
          Campaign Journey
        </h3>
      </div>
      {events.length === 0 ? (
        <p className="text-xs text-slate-400 font-bold py-12 text-center">
          No campaign lifecycle events logged yet.
        </p>
      ) : (
        <div className="relative pl-5 rtl:pl-[unset] rtl:pr-5 rtl:ml-[unset] rtl:mr-5 border-l rtl:border-l-[unset]! rtl:border-r border-slate-250 dark:border-(--card-border-color) space-y-6 ml-5 custom-scrollbar">
          {events.map((event, idx) => {
            let dotColor = "bg-blue-500 ring-blue-100 dark:ring-blue-900/30";
            if (event.type === "delivered" || event.type === "sent") {
              dotColor =
                "bg-primary ring-[var(--primary-opacity-20)] dark:ring-primary-darker/30";
            } else if (event.type === "read") {
              dotColor = "bg-indigo-50 ring-indigo-100 dark:ring-indigo-900/30";
            } else if (event.type === "failed") {
              dotColor = "bg-red-500 ring-red-100 dark:ring-red-900/30";
            }
            return (
              <div key={idx} className="relative">
                <span
                  className={`absolute -left-[26px] rtl:left-[unset] rtl:-right-[26px] top-1 w-3 h-3 rounded-full ring-4 ${dotColor}`}
                />
                <div className="flex flex-col ml-3 rtl:ml-[unset] rtl:mr-3">
                  <span className="text-base font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                    {event.title}
                  </span>
                  <span className="text-sm text-slate-400 dark:text-slate-500 font-semibold mt-0.5">
                    {formatDate(event.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
