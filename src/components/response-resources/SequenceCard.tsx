"use client";

import { badgeStyles, displayNames } from "@/src/data/responseResource";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { SequenceCardProps } from "@/src/types/replyMaterial";
import { Calendar, Edit2, ListOrdered, Trash2 } from "lucide-react";
import Can from "../shared/Can";

const SequenceCard: React.FC<SequenceCardProps> = ({
  sequence,
  onEdit,
  onDelete,
  onViewSteps,
}) => {
  return (
    <div className="group relative bg-white dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-primary/10 transition-colors" />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap gap-1.5">
              <div
                className={cn(
                  "px-2.5 py-1 rounded-full text-[12px] font-bold flex items-center gap-1.5",
                  sequence.is_active
                    ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
                )}
              >
                <span
                  className={cn(
                    "inline-block w-1.5 h-1.5 rounded-full",
                    sequence.is_active ? "bg-green-500" : "bg-slate-400",
                  )}
                />
                {sequence.is_active ? "Active" : "Paused"}
              </div>

              {/* Platform Badge */}
              {(() => {
                const platform = sequence.platform || "whatsapp";

                const style = badgeStyles[platform] || badgeStyles.whatsapp;
                const name = displayNames[platform] || displayNames.whatsapp;
                return (
                  <div
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                      style,
                    )}
                  >
                    {name}
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center gap-1">
              <Can permission="update.sequences">
                <Button
                  onClick={() => onEdit(sequence)}
                  className="p-2 bg-[unset]! rounded-lg text-slate-400 hover:bg-primary/5 hover:text-primary transition-colors"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </Button>
              </Can>
              <Can permission="delete.sequences">
                <Button
                  onClick={() => onDelete(sequence._id)}
                  className="p-2 bg-[unset]! rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </Button>
              </Can>
            </div>
          </div>

          <h3 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2 truncate">
            {sequence.name}
          </h3>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <ListOrdered size={14} className="text-primary" />
              <span>{sequence.steps_count || 0} Steps</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              <span>{new Date(sequence.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <Button
          onClick={() => onViewSteps(sequence._id)}
          className="mt-6 w-full h-10 rounded-lg bg-slate-50 dark:bg-(--dark-body) text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-(--card-border-color) hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <ListOrdered size={16} />
          View Steps
        </Button>
      </div>
    </div>
  );
};

export default SequenceCard;
