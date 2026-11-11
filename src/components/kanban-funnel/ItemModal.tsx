"use client";

import { priorities } from "@/src/data/kanubanFunnel";
import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { ItemModalProps } from "@/src/types/kanban-funnel";
import { useFormik } from "formik";
import { RefreshCw } from "lucide-react";
import React, { useEffect } from "react";

import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const ItemModal: React.FC<ItemModalProps> = ({
  isOpen,
  onClose,
  onSave,
  item,
  isLoading,
}) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      priority: item?.priority || "medium",
      isArchived: item?.isArchived || false,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      priority: Yup.string().required("Required"),
      isArchived: Yup.boolean(),
    }),
    onSubmit: (values) => {
      onSave(values);
    },
  });

  // Explicitly reset form when item changes or modal opens
  useEffect(() => {
    if (isOpen && item) {
      formik.resetForm({
        values: {
          priority: item.priority || "medium",
          isArchived: !!item.isArchived,
        },
      });
    }
  }, [item, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! rounded-lg dark:bg-(--card-color) p-0! overflow-hidden border-none gap-0 shadow-2xl">
        <DialogHeader className="sm:p-6 p-4 pb-0!">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white flex flex-col gap-2">
            {t("edit_item")}
            {item && (
              <span className="text-xs font-normal text-slate-500 truncate max-w-50">
                {item.title}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="sm:p-6 p-4 pt-2 space-y-8"
        >
          <div className="space-y-4">
            <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("priority")}
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {priorities.map((p) => {
                const isSelected = formik.values.priority === p.value;
                return (
                  <Button
                    key={p.value}
                    type="button"
                    onClick={() => formik.setFieldValue("priority", p.value)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-lg border transition-all gap-2 group",
                      isSelected
                        ? p.value === "low"
                          ? "border-primary bg-light-primary/50 dark:bg-primary-darker/20"
                          : p.value === "medium"
                            ? "border-amber-500 bg-amber-50/50 dark:bg-amber-900/20"
                            : "border-red-500 bg-red-50/50 dark:bg-red-900/20"
                        : "border-slate-100 dark:border-(--card-border-color) hover:border-slate-200 dark:hover:border-(--table-hover) bg-white dark:bg-(--page-body-bg)",
                    )}
                  >
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full",
                        p.value === "low"
                          ? "bg-primary"
                          : p.value === "medium"
                            ? "bg-amber-500"
                            : "bg-red-500",
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isSelected
                          ? p.value === "low"
                            ? "text-primary dark:text-primary"
                            : p.value === "medium"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                          : "text-slate-500",
                      )}
                    >
                      {t(p.value)}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color)">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold text-slate-900 dark:text-white">
                {t("archive_item")}
              </Label>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {t("archived_items_will_be_hidden_from_the_board")}
              </p>
            </div>
            <Switch
              checked={formik.values.isArchived}
              onCheckedChange={(checked) =>
                formik.setFieldValue("isArchived", checked)
              }
            />
          </div>

          <DialogFooter className="pt-4 border-t border-slate-50 dark:border-(--card-border-color)">
            <div className="flex gap-3 w-full">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 rounded-lg h-11 text-slate-500 hover:bg-slate-100 dark:bg-(--page-body-bg) dark:text-gray-400 dark:hover:bg-(--table-hover)"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-lg h-11 bg-primary text-white hover:bg-primary/90"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  t("save_changes")
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ItemModal;
