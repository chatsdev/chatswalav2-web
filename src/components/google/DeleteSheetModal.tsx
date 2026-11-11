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
import { Label } from "@/src/elements/ui/label";
import { RadioGroup, RadioGroupItem } from "@/src/elements/ui/radio-group";
import { DeleteSheetModalProps } from "@/src/types/google";
import { AlertTriangle, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const DeleteSheetModal: React.FC<DeleteSheetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  count,
}) => {
  const { t } = useTranslation();
  const [deleteFrom, setDeleteFrom] = useState<"google" | "platform">(
    "platform",
  );

  const handleConfirm = () => {
    onConfirm(deleteFrom);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! max-h-[90vh] overflow-auto custom-scrollbar gap-0! dark:bg-(--card-color)">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 mb-4">
            <Trash2 size={24} />
          </div>
          <DialogTitle className="text-center text-xl">
            {t("google_account_delete_sheets_title", { count })}
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            {count > 1
              ? t("google_account_delete_sheets_desc_bulk", { count })
              : t("google_account_delete_sheets_desc_single")}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <RadioGroup
            value={deleteFrom}
            onValueChange={(value) =>
              setDeleteFrom(value as "google" | "platform")
            }
            className="gap-4"
          >
            <div
              className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${deleteFrom === "platform" ? "border-primary bg-primary/5" : "border-slate-100 dark:border-(--card-border-color)"}`}
              onClick={() => setDeleteFrom("platform")}
            >
              <RadioGroupItem value="platform" id="platform" className="mt-1" />
              <div className="grid gap-1.5 cursor-pointer">
                <Label
                  htmlFor="platform"
                  className="font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {t("google_account_delete_platform_only")}
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("google_account_delete_platform_only_desc")}
                </p>
              </div>
            </div>

            <div
              className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${deleteFrom === "google" ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-slate-100 dark:border-(--card-border-color)"}`}
              onClick={() => setDeleteFrom("google")}
            >
              <RadioGroupItem value="google" id="google" className="mt-1" />
              <div className="grid gap-1.5 cursor-pointer">
                <Label
                  htmlFor="google"
                  className="font-bold text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  {t("google_account_delete_from_google")}
                </Label>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t("google_account_delete_from_google_desc")}
                </p>
              </div>
            </div>
          </RadioGroup>

          {deleteFrom === "google" && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex gap-3 text-amber-700 dark:text-amber-400 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>{t("google_account_delete_google_warning")}</p>
            </div>
          )}
        </div>

        <DialogFooter className=" gap-2">
          <Button
            className="h-11 px-8"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`${deleteFrom === "google" ? "bg-red-600 hover:bg-red-700" : "bg-primary"} h-11 px-8 text-white`}
          >
            {isLoading ? t("deleting") : t("delete")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSheetModal;
