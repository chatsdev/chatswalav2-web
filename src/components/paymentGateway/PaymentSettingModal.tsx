/* eslint-disable @typescript-eslint/no-explicit-any */
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { Textarea } from "@/src/elements/ui/textarea";
import {
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} from "@/src/redux/api/settingsApi";
import {
  PaymentFormState,
  PaymentSettingModalProps,
} from "@/src/types/paymentGateway";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const PaymentSettingModal: React.FC<PaymentSettingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { data: userSettingsData, isLoading: isFetching } =
    useGetUserSettingsQuery();
  const [updateUserSettings, { isLoading: isUpdating }] =
    useUpdateUserSettingsMutation();

  const [form, setForm] = useState<PaymentFormState>({
    payment_success_message: "",
    payment_failed_message: "",
    payment_reminder_enabled: false,
    payment_reminder_unit: "minutes",
    payment_reminder_delay: 60,
    payment_reminder_message: "",
    catalog_payment_link_enabled: false,
    catalog_payment_link_automatic: false,
  });

  useEffect(() => {
    if (isOpen && userSettingsData?.data) {
      const settings = userSettingsData.data as any;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        payment_success_message: settings.payment_success_message || "",
        payment_failed_message: settings.payment_failed_message || "",
        payment_reminder_enabled: settings.payment_reminder_enabled || false,
        payment_reminder_unit:
          (settings.payment_reminder_unit as any) || "minutes",
        payment_reminder_delay: settings.payment_reminder_delay || 60,
        payment_reminder_message: settings.payment_reminder_message || "",
        catalog_payment_link_enabled:
          settings.catalog_payment_link_enabled || false,
        catalog_payment_link_automatic:
          settings.catalog_payment_link_automatic || false,
      });
    }
  }, [isOpen, userSettingsData]);

  const handleInputChange = (field: keyof PaymentFormState, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const payload: any = {};
      const original = (userSettingsData?.data || {}) as Record<string, any>;

      (Object.keys(form) as Array<keyof PaymentFormState>).forEach((key) => {
        if (form[key] !== original[key]) {
          payload[key] = form[key];
        }
      });

      if (Object.keys(payload).length === 0) {
        onClose();
        return;
      }

      await updateUserSettings(payload).unwrap();
      toast.success(t("payment_settings_updated_success"));
      onClose();
    } catch (error: any) {
      toast.error(
        error?.data?.message || t("failed_to_update_payment_settings"),
      );
    }
  };

  const getDelayValidation = () => {
    switch (form.payment_reminder_unit) {
      case "minutes":
        return { min: 1, max: 1440 };
      case "hours":
        return { min: 1, max: 24 };
      case "days":
        return { min: 1, max: 30 };
      default:
        return { min: 1, max: 1000 };
    }
  };

  const delayValidation = getDelayValidation();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) dark:border-(--card-border-color) max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>{t("payment_settings")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="flex gap-4 [@media(max-width:810px)]:flex-col">
            <div className="grid gap-2 w-full">
              <Label htmlFor="payment_success_message">
                {t("payment_success_message")}
              </Label>
              <Textarea
                id="payment_success_message"
                value={form.payment_success_message}
                onChange={(e) =>
                  handleInputChange("payment_success_message", e.target.value)
                }
                placeholder={t("enter_payment_success_message")}
                disabled={isUpdating || isFetching}
                className="min-h-20 resize-none custom-scrollbar"
              />
            </div>

            <div className="grid gap-2 w-full">
              <Label htmlFor="payment_failed_message">
                {t("payment_failed_message")}
              </Label>
              <Textarea
                id="payment_failed_message"
                value={form.payment_failed_message}
                onChange={(e) =>
                  handleInputChange("payment_failed_message", e.target.value)
                }
                placeholder={t("enter_payment_failed_message")}
                disabled={isUpdating || isFetching}
                className="min-h-20 resize-none custom-scrollbar"
              />
            </div>
          </div>

          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 bg-slate-50/50 dark:bg-slate-900/20 dark:border-(--card-border-color)">
            <div className="space-y-0.5">
              <Label htmlFor="payment_reminder_enabled">
                {t("payment_reminder_enabled")}
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("payment_reminder_desc")}
              </p>
            </div>
            <Switch
              id="payment_reminder_enabled"
              checked={form.payment_reminder_enabled}
              onCheckedChange={(checked) =>
                handleInputChange("payment_reminder_enabled", checked)
              }
              disabled={isUpdating || isFetching}
            />
          </div>

          {form.payment_reminder_enabled && (
            <div className="grid gap-6 sm:p-4 p-2 border rounded-lg border-primary/20 bg-primary/5 transition-all animate-in fade-in zoom-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="payment_reminder_unit">
                    {t("reminder_unit")}
                  </Label>
                  <Select
                    value={form.payment_reminder_unit}
                    onValueChange={(value) =>
                      handleInputChange("payment_reminder_unit", value)
                    }
                    disabled={isUpdating || isFetching}
                  >
                    <SelectTrigger id="payment_reminder_unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-(--card-color)">
                      <SelectItem value="minutes">{t("minutes")}</SelectItem>
                      <SelectItem value="hours">{t("hours")}</SelectItem>
                      <SelectItem value="days">{t("days")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-[13px] text-slate-500">
                    Select unit for reminder
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="payment_reminder_delay">
                    {t("reminder_delay")}
                  </Label>
                  <Input
                    id="payment_reminder_delay"
                    type="number"
                    min={delayValidation.min}
                    max={delayValidation.max}
                    value={form.payment_reminder_delay || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "payment_reminder_delay",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    disabled={isUpdating || isFetching}
                  />
                  <p className="text-[13px] text-slate-500">
                    {t("range")}: {delayValidation.min} - {delayValidation.max}{" "}
                    {t(form.payment_reminder_unit)}
                  </p>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="payment_reminder_message">
                  {t("payment_reminder_message")}
                </Label>
                <Textarea
                  id="payment_reminder_message"
                  value={form.payment_reminder_message}
                  onChange={(e) =>
                    handleInputChange(
                      "payment_reminder_message",
                      e.target.value,
                    )
                  }
                  placeholder={t("enter_payment_reminder_message")}
                  disabled={isUpdating || isFetching}
                  className="min-h-20 resize-none custom-scrollbar"
                />
                <p className="text-[13px] text-slate-500">
                  {t("template_vars_hint")}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 bg-slate-50/50 dark:bg-slate-900/20 dark:border-(--card-border-color)">
            <div className="space-y-0.5">
              <Label htmlFor="catalog_payment_link_enabled">
                {t("catalog_payment_link_enabled", "Enable Catalog Payment Link")}
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("catalog_payment_link_enabled_desc", "Allow sending payment links for catalog orders")}
              </p>
            </div>
            <Switch
              id="catalog_payment_link_enabled"
              checked={form.catalog_payment_link_enabled}
              onCheckedChange={(checked) =>
                handleInputChange("catalog_payment_link_enabled", checked)
              }
              disabled={isUpdating || isFetching}
            />
          </div>

          {form.catalog_payment_link_enabled && (
            <div className="flex items-center justify-between space-x-2 rounded-lg border p-4 bg-slate-50/50 dark:bg-slate-900/20 dark:border-(--card-border-color) transition-all animate-in fade-in zoom-in duration-200">
              <div className="space-y-0.5">
                <Label htmlFor="catalog_payment_link_automatic">
                  {t("catalog_payment_link_automatic", "Send Payment Link Automatically")}
                </Label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("catalog_payment_link_automatic_desc", "Automatically send payment link when order is updated to Confirmed")}
                </p>
              </div>
              <Switch
                id="catalog_payment_link_automatic"
                checked={form.catalog_payment_link_automatic}
                onCheckedChange={(checked) =>
                  handleInputChange("catalog_payment_link_automatic", checked)
                }
                disabled={isUpdating || isFetching}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isUpdating}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isUpdating ||
              isFetching ||
              (form.payment_reminder_enabled &&
                (form.payment_reminder_delay < delayValidation.min ||
                  form.payment_reminder_delay > delayValidation.max))
            }
            className="bg-primary text-white"
          >
            {isUpdating ? t("saving") : t("save_changes")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSettingModal;
