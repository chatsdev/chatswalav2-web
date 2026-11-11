"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import { CampaignStatusModalProps } from "@/src/types/facebook";
import {
  AlertCircle,
  Archive,
  Check,
  PauseCircle,
  PlayCircle,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const CampaignStatusModal: React.FC<CampaignStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  currentStatus,
}) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string>(
    currentStatus?.toLowerCase() || "active",
  );

  const statuses = [
    {
      id: "active",
      label: t("active", "Active"),
      icon: <PlayCircle className="w-6 h-6" />,
      color: "text-primary",
      bg: "bg-light-primary dark:bg-primary/10",
      border: "border-[var(--primary-opacity-30)] dark:border-primary/20",
      activeBg: "bg-primary text-white",
      desc: t("status_active_desc", "Campaign is running and serving ads."),
    },
    {
      id: "paused",
      label: t("paused", "Paused"),
      icon: <PauseCircle className="w-6 h-6" />,
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10",
      border: "border-amber-200 dark:border-amber-500/20",
      activeBg: "bg-amber-500 text-white",
      desc: t("status_paused_desc", "Campaign is stopped but can be resumed."),
    },
    {
      id: "archived",
      label: t("archived", "Archived"),
      icon: <Archive className="w-6 h-6" />,
      color: "text-slate-500",
      bg: "bg-slate-50 dark:bg-slate-500/10",
      border: "border-slate-200 dark:border-slate-500/20",
      activeBg: "bg-slate-500 text-white",
      desc: t(
        "status_archived_desc",
        "Campaign is archived for long-term storage.",
      ),
    },
    {
      id: "deleted",
      label: t("deleted", "Deleted"),
      icon: <Trash2 className="w-6 h-6" />,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-500/10",
      border: "border-rose-200 dark:border-rose-500/20",
      activeBg: "bg-rose-500 text-white",
      desc: t("status_deleted_desc", "Campaign will be marked as deleted."),
    },
    {
      id: "error",
      label: t("error", "Error"),
      icon: <AlertCircle className="w-6 h-6" />,
      color: "text-red-600",
      bg: "bg-red-50 dark:bg-red-500/10",
      border: "border-red-200 dark:border-red-500/20",
      activeBg: "bg-red-600 text-white",
      desc: t("status_error_desc", "Mark campaign as having an error."),
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! gap-0! dark:bg-(--card-color) p-0! overflow-hidden border-none shadow rounded-lg flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-4 bg-slate-50/50 dark:bg-(--card-color) gap-1">
          <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white">
            {t("update_campaign_status", "Update Campaign Status")}
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            {t(
              "select_new_status",
              "Choose the target status for this campaign on Facebook.",
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="sm:p-6 p-4 pt-2! space-y-4 overflow-y-auto max-h-[60vh] table-custom-scrollbar">
          <div className="grid grid-cols-1 gap-3">
            {statuses.map((status) => (
              <div
                key={status.id}
                onClick={() => setSelectedStatus(status.id)}
                className={cn(
                  "relative group cursor-pointer p-4 rounded-lg border transition-all active:scale-[0.98]",
                  selectedStatus === status.id
                    ? cn(
                        status.border,
                        "bg-white dark:bg-(--card-color) shadow-lg",
                      )
                    : "border-(--input-border-color) dark:border-(--card-border-color) hover:border-slate-100 dark:hover:border-(--table-hover) bg-slate-50/50 dark:bg-(--page-body-bg) hover:bg-white dark:hover:bg-(--table-hover)",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl transition-colors",
                      selectedStatus === status.id
                        ? status.activeBg
                        : cn(status.bg, status.color),
                    )}
                  >
                    {status.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "font-bold tracking-tight",
                          selectedStatus === status.id
                            ? "text-slate-900 dark:text-white"
                            : "text-slate-600 dark:text-slate-400",
                        )}
                      >
                        {status.label}
                      </span>
                      {selectedStatus === status.id && (
                        <div
                          className={cn("p-1 rounded-full", status.activeBg)}
                        >
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-bold mt-0.5 line-clamp-1">
                      {status.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="sm:p-6 p-4 pt-0! flex sm:justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-lg h-11 font-semibold border-slate-200 dark:border-(--card-border-color) hover:bg-slate-100 dark:hover:bg-(--table-hover)"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={() => onConfirm(selectedStatus)}
            disabled={
              isLoading || selectedStatus === currentStatus?.toLowerCase()
            }
            className="rounded-lg px-8 h-11 font-semibold bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all active:scale-95"
          >
            {isLoading
              ? t("updating", "Updating...")
              : t("update_status", "Update Status")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignStatusModal;
