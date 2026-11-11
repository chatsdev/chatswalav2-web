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
import { AddCalendarModalProps } from "@/src/types/google";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const AddCalendarModal: React.FC<AddCalendarModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState("");

  const handleConfirm = () => {
    if (summary.trim()) {
      onConfirm(summary);
      setSummary("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! dark:bg-(--card-color)">
        <DialogHeader>
          <DialogTitle>{t("google_account_add_calendar_title")}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="summary">{t("google_account_calendar_name")}</Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={t("google_account_calendar_name_placeholder")}
              disabled={isLoading}
              autoFocus
              className="h-11"
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
            className="text-white h-11"
            onClick={handleConfirm}
            disabled={isLoading || !summary.trim()}
          >
            {isLoading ? t("creating") : t("google_account_add_calendar_btn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCalendarModal;
