import { statuses } from "@/src/data/formBuilder";
import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import { UpdateSubmissionStatusModalProps } from "@/src/types/formBuilder";
import React, { useState } from "react";

const UpdateSubmissionStatusModal: React.FC<
  UpdateSubmissionStatusModalProps
> = ({ isOpen, onClose, currentStatus, onConfirm, isLoading }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color)">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Update Status
          </DialogTitle>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-2">
            Select the current pipeline stage for this submission.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-6">
          {statuses.map((status) => (
            <Button
              key={status.id}
              onClick={() => setSelectedStatus(status.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left group",
                selectedStatus === status.id
                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                  : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-transparent",
              )}
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full shrink-0 shadow-sm",
                  status.color,
                  selectedStatus === status.id ? "ring-4 ring-primary/20" : "",
                )}
              />
              <span
                className={cn(
                  "text-sm font-bold transition-colors",
                  selectedStatus === status.id
                    ? "text-primary flex-1"
                    : "text-slate-600 dark:text-gray-400 group-hover:text-slate-900 dark:group-hover:text-white",
                )}
              >
                {status.label}
              </span>
              {selectedStatus === status.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </Button>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-bold text-sm bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(selectedStatus)}
            disabled={isLoading || selectedStatus === currentStatus}
            className="px-8 py-2.5 rounded-lg font-bold text-sm bg-primary text-white hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="loading loading-spinner loading-xs"></div>
            ) : null}
            Update Status
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSubmissionStatusModal;
