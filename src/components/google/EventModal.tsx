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
import { Textarea } from "@/src/elements/ui/textarea";
import { EventModalProps } from "@/src/types/google";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  event,
}) => {
  const { t } = useTranslation();
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (event) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSummary(event.summary || "");
      setDescription(event.description || "");
      const start = event.start?.dateTime || event.start?.date || "";
      const end = event.end?.dateTime || event.end?.date || "";
      setStartTime(start ? dayjs(start).format("YYYY-MM-DDTHH:mm") : "");
      setEndTime(end ? dayjs(end).format("YYYY-MM-DDTHH:mm") : "");
    } else {
      setSummary("");
      setDescription("");
      const now = dayjs().add(1, "hour").startOf("hour");
      setStartTime(now.format("YYYY-MM-DDTHH:mm"));
      setEndTime(now.add(1, "hour").format("YYYY-MM-DDTHH:mm"));
    }
  }, [event, isOpen]);

  const handleConfirm = () => {
    if (summary.trim() && startTime && endTime) {
      onConfirm({
        summary,
        description,
        start: dayjs(startTime).toISOString(),
        end: dayjs(endTime).toISOString(),
      });
    }
  };

  const isFormValid = summary.trim() && startTime && endTime;
  const isEdit = !!(event && event.id);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! dark:bg-(--card-color)">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? t("google_account_edit_event_title")
              : t("google_account_create_event_title")}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="summary">{t("google_account_event_summary")}</Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder={t("google_account_event_summary")}
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startTime">
                {t("google_account_event_start")}
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="endTime">{t("google_account_event_end")}</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">
              {t("google_account_event_description")}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("google_account_event_description")}
              disabled={isLoading}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            className="h-11 px-4.5 py-5"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            {t("cancel")}
          </Button>
          <Button
            className="text-white h-11 px-4.5 py-5"
            onClick={handleConfirm}
            disabled={isLoading || !isFormValid}
          >
            {isLoading
              ? isEdit
                ? t("saving")
                : t("creating")
              : isEdit
                ? t("save_changes")
                : t("google_account_calendar_add_event_btn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;
