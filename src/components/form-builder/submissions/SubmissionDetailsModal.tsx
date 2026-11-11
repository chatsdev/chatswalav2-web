import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { SubmissionDetailsModalProps } from "@/src/types/formBuilder";
import { format } from "date-fns";
import React from "react";

const SubmissionDetailsModal: React.FC<SubmissionDetailsModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading,
}) => {
  if (!data && !isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! gap-0! bg-white dark:bg-(--card-color) p-0! overflow-hidden border-slate-200 dark:border-(--card-border-color)">
        <DialogHeader className="p-6 bg-slate-50/50 dark:bg-(--card-color) gap-0! border-b border-slate-100 dark:border-(--card-border-color)">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Submission Details
            {data?.status && (
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                {data.status.replace(/_/g, " ")}
              </span>
            )}
          </DialogTitle>
          <div className="flex flex-col gap-1 mt-1">
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Submitted by <span className="font-semibold">{data?.phone}</span>{" "}
              on{" "}
              {data?.submitted_at
                ? format(new Date(data.submitted_at), "PPP p")
                : "N/A"}
            </p>
          </div>
        </DialogHeader>

        <div className="sm:p-6 p-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <div className="loading loading-spinner text-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data?.fields.map((field, idx) => (
                <div
                  key={idx}
                  className="space-y-1.5 p-4 rounded-lg bg-slate-50 dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color)"
                >
                  <Label className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider">
                    {field.label}
                  </Label>
                  <p className="text-sm font-medium text-slate-900 dark:text-white wrap-break-word">
                    {typeof field.value === "object"
                      ? JSON.stringify(field.value)
                      : String(field.value || "—")}
                  </p>
                </div>
              ))}

              {data?.fields.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-400">
                  No data fields found for this submission.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 dark:bg-(--card-color) border-t border-slate-100 dark:border-(--card-border-color) flex justify-end">
          <Button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-bold text-sm bg-gray-100! text-gray-500! border-none! px-4.5! py-5! dark:bg-(--page-body-bg)! dark:text-gray-500! hover:border-none! dark:border-none! border border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-(--table-hover)! transition-all"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailsModal;
