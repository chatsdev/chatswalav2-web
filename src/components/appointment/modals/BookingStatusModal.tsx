"use client";

import { statuses } from "@/src/data/appointment";
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
import { useUpdateBookingStatusMutation } from "@/src/redux/api/appointmentApi";
import {
  BookingStatusModalProps
} from "@/src/types/appointment";
import dayjs from "dayjs";
import { Calendar, Check, Loader2, RefreshCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  const { t } = useTranslation();
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  const [updateStatus, { isLoading }] = useUpdateBookingStatusMutation();

  useEffect(() => {
    if (booking) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedStatus(booking.status);
      setStartTime(dayjs(booking.start_time).format("YYYY-MM-DDTHH:mm"));
      setEndTime(dayjs(booking.end_time).format("YYYY-MM-DDTHH:mm"));
    }
  }, [booking, isOpen]);

  const handleUpdate = async () => {
    if (!booking || !selectedStatus) return;

    const payload: { id: string; status: string; startTime?: string; endTime?: string } = {
      id: booking._id,
      status: selectedStatus,
    };

    if (selectedStatus === "rescheduled") {
      if (!startTime || !endTime) {
        toast.error(t("please_select_times"));
        return;
      }
      payload.startTime = new Date(startTime).toISOString();
      payload.endTime = new Date(endTime).toISOString();
    }

    try {
      await updateStatus(payload).unwrap();
      toast.success(
        t("status_update_success", {
          defaultValue: "Status updated successfully.",
        }),
      );
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          t("failed_to_update_status", {
            defaultValue: "Failed to update status.",
          }),
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! max-h-[90dvh] overflow-y-auto no-scrollbar dark:bg-(--card-color)">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <RefreshCcw className="text-primary" size={20} />
            {t("update_status")}
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {statuses.map((s) => (
              <Button
                key={s.value}
                type="button"
                onClick={() => setSelectedStatus(s.value)}
                className={`flex h-13.5 items-center justify-between sm:p-4 p-2 rounded-lg border transition-all cursor-pointer ${s.color} ${selectedStatus === s.value ? "ring-2 ring-primary ring-offset-1 dark:ring-offset-slate-900 shadow-sm" : "opacity-70 hover:opacity-100"}`}
              >
                <span className="font-bold text-sm tracking-tight">
                  {t(s.label)}
                </span>
                {selectedStatus === s.value && (
                  <Check size={16} className="shrink-0" />
                )}
              </Button>
            ))}
          </div>

          {selectedStatus === "rescheduled" && (
            <div className="space-y-4 p-4 bg-blue-50/50 dark:bg-(--page-body-bg) rounded-lg border border-blue-100 dark:border-(--card-border-color) animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 mb-2">
                <Calendar size={16} />
                <span className="text-sm font-bold">
                  {t("reschedule_time")}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("start_time")}
                  </Label>
                  <Input
                    type="datetime-local"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-10 border-slate-200 dark:bg-(--card-color) dark:border-(--card-border-color) focus:bg-white dark:focus:bg-(--card-color)"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("end_time")}
                  </Label>
                  <Input
                    type="datetime-local"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-10 border-slate-200 dark:bg-(--card-color) dark:border-(--card-border-color) focus:bg-white dark:focus:bg-(--card-color)"
                  />
                </div>
              </div>
            </div>
          )}
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
            onClick={handleUpdate}
            disabled={
              isLoading ||
              (selectedStatus === booking?.status &&
                selectedStatus !== "rescheduled")
            }
            className="gap-2 h-11 text-white"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            {t("update")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingStatusModal;
