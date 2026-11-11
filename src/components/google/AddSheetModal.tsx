"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { AddSheetModalProps } from "@/src/types/google";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AddSheetModal: React.FC<AddSheetModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");

  const handleConfirm = () => {
    if (title.trim()) {
      onConfirm(title);
      setTitle("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! dark:bg-(--card-color)">
        <DialogHeader>
          <DialogTitle>{t("google_account_create_sheet_title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">{t("google_account_sheet_name")}</Label>
            <Input
              className="h-11"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("google_account_sheet_name")}
              disabled={isLoading}
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="h-11"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !title.trim()}
            className="bg-primary h-11 text-white"
          >
            {isLoading ? t("creating") : t("google_account_add_sheet")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSheetModal;
