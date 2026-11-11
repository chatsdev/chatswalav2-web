/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { statusOptions } from "@/src/data/order";
import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { useUpdateOrderStatusMutation } from "@/src/redux/api/orderApi";
import { UpdateStatusModalProps } from "@/src/types/order";
import {
  CheckCircle2,
  Loader2,
  Package
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Label } from "@/src/elements/ui/label";


const UpdateStatusModal = ({
  isOpen,
  onClose,
  orderId,
  currentStatus,
}: UpdateStatusModalProps) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState(currentStatus);
  const [updateStatus, { isLoading }] = useUpdateOrderStatusMutation();

  useEffect(() => {
    if (currentStatus) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus(currentStatus);
    }
  }, [currentStatus]);

  const handleSubmit = async () => {
    if (!orderId) return;

    try {
      const res = await updateStatus({ order_id: orderId, status }).unwrap();
      if (res.success) {
        toast.success(
          t("order_status_updated_success") ||
            "Order status updated successfully",
        );
        onClose();
      }
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          t("order_status_update_failed") ||
          "Failed to update order status",
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! gap-0! dark:bg-(--card-color)! overflow-hidden border-none bg-white shadow-2xl">
        <DialogHeader>
          <DialogTitle className="sm:text-2xl text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Package className="text-primary" size={24} />
            {t("update_order_status_title") || "Update Order Status"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            {t("update_order_status_desc") ||
              "Select the new status for this order. This may trigger a notification to the customer."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 block">
            {t("select_status_label") || "Select Status"}
          </Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full h-12 py-5.5 bg-slate-50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) rounded-lg focus:ring-primary">
              <SelectValue
                placeholder={t("select_status_placeholder") || "Select status"}
              />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-xl">
              {statusOptions.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="py-3 cursor-pointer focus:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <opt.icon className={opt.color} size={18} />
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {t(opt.label)}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="gap-3 sm:gap-2">
          <Button
            onClick={onClose}
            className="px-6 dark:bg-(--page-body-bg) hover:text-white dark:hover:bg-(--table-hover)! py-2.5 h-12 rounded-lg font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            {t("cancel") || "Cancel"}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || status === currentStatus}
            className="flex items-center h-12 justify-center gap-2 px-8 py-2.5 rounded-lg bg-primary text-white font-bold  disabled:opacity-50 disabled:hover:scale-100 transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            {t("update_status_submit") || "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
