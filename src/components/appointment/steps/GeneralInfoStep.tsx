import { Button } from "@/src/elements/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/elements/ui/command";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/elements/ui/popover";
import { Switch } from "@/src/elements/ui/switch";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { GeneralInfoStepProps } from "@/src/types/appointment";
import { Check, Clock, Info } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const SUPPORTED_TIMEZONES = Intl.supportedValuesOf("timeZone");

const GeneralInfoStep: React.FC<GeneralInfoStepProps> = ({
  formData,
  errors,
  handleInputChange,
  handleSelectChange,
  handleSwitchChange,
}) => {
  const { t } = useTranslation();
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Info className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("step_general_info")}
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          {t("general_info_desc", {
            defaultValue:
              "Basic details about your appointment booking service.",
          })}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-semibold">
            {t("appointment_name")}
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder={t("appointment_name")}
            required
            className={cn(
              "h-11",
              errors.name && "border-red-400 ring-2 ring-red-500/10",
            )}
          />
          {errors.name && (
            <p className="text-[10px] text-red-500 font-medium ml-1">
              {errors.name}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-semibold">
            {t("appointment_location")}
          </Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder={t("online_office_placeholder")}
            className="h-11"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold">
          {t("appointment_description")}
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder={t("appointment_description")}
          rows={3}
          className={cn(
            "resize-none h-11",
            errors.description && "border-red-400 ring-2 ring-red-500/10",
          )}
        />
        {errors.description && (
          <p className="text-[10px] text-red-500 font-medium ml-1">
            {errors.description}
          </p>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="timezone" className="text-sm font-semibold">
            {t("appointment_timezone")}
          </Label>
          <Popover open={isTimezoneOpen} onOpenChange={setIsTimezoneOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={isTimezoneOpen}
                className={cn(
                  "w-full h-11 justify-between bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none",
                  errors.timezone && "border-red-400 ring-2 ring-red-500/10",
                )}
              >
                {formData.timezone || t("select_timezone")}
              </Button>
            </PopoverTrigger>
            {errors.timezone && (
              <p className="text-[10px] text-red-500 font-medium ml-1 mt-1">
                {errors.timezone}
              </p>
            )}
            <PopoverContent
              className="w-(--radix-popover-trigger-width) p-0"
              align="start"
            >
              <Command className="w-full">
                <CommandInput
                  placeholder={t("search_timezone")}
                  className="h-10"
                />
                <CommandList className="max-h-75">
                  <CommandEmpty>{t("no_timezone_found")}</CommandEmpty>
                  <CommandGroup>
                    {SUPPORTED_TIMEZONES.map((tz) => (
                      <CommandItem
                        key={tz}
                        value={tz}
                        onSelect={() => {
                          handleSelectChange("timezone", tz);
                          setIsTimezoneOpen(false);
                        }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span>{tz}</span>
                        </div>
                        {formData.timezone === tz && (
                          <Check size={14} className="text-primary" />
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="duration_minutes" className="text-sm font-semibold">
            {t("appointment_duration_mins")}
          </Label>
          <Input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            value={formData.duration_minutes}
            onChange={handleInputChange}
            className={cn(
              "h-11",
              errors.duration_minutes &&
                "border-red-400 ring-2 ring-red-500/10",
            )}
          />
          {errors.duration_minutes && (
            <p className="text-[10px] text-red-500 font-medium ml-1">
              {errors.duration_minutes}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="max_daily_appointments"
            className="text-sm font-semibold"
          >
            {t("appointment_max_daily")}
          </Label>
          <Input
            id="max_daily_appointments"
            name="max_daily_appointments"
            type="number"
            value={formData.max_daily_appointments}
            onChange={handleInputChange}
            className={cn(
              "h-11",
              errors.max_daily_appointments &&
                "border-red-400 ring-2 ring-red-500/10",
            )}
          />
          {errors.max_daily_appointments && (
            <p className="text-[10px] text-red-500 font-medium ml-1">
              {errors.max_daily_appointments}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label
            htmlFor="break_between_appointments_minutes"
            className="text-sm font-semibold"
          >
            {t("appointment_break")}
          </Label>
          <Input
            id="break_between_appointments_minutes"
            name="break_between_appointments_minutes"
            type="number"
            value={formData.break_between_appointments_minutes}
            onChange={handleInputChange}
            className={cn(
              "h-11",
              errors.break_between_appointments_minutes &&
                "border-red-400 ring-2 ring-red-500/10",
            )}
          />
          {errors.break_between_appointments_minutes && (
            <p className="text-[10px] text-red-500 font-medium ml-1">
              {errors.break_between_appointments_minutes}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="max_advance_booking_days"
            className="text-sm font-semibold"
          >
            {t("appointment_max_advance")}
          </Label>
          <Input
            id="max_advance_booking_days"
            name="max_advance_booking_days"
            type="number"
            value={formData.max_advance_booking_days}
            onChange={handleInputChange}
            className={cn(
              "h-11",
              errors.max_advance_booking_days &&
                "border-red-400 ring-2 ring-red-500/10",
            )}
          />
          {errors.max_advance_booking_days && (
            <p className="text-[10px] text-red-500 font-medium ml-1">
              {errors.max_advance_booking_days}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:p-5 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) transition-all hover:border-primary/30">
        <div className="space-y-1">
          <Label className="text-base font-bold">
            {t("appointment_allow_overlap")}
          </Label>
          <p className="text-sm text-slate-500">
            {t("appointment_allow_overlap_desc", {
              defaultValue: "Allow multiple bookings in the same time slot",
            })}
          </p>
        </div>
        <Switch
          checked={formData.allow_overlap}
          onCheckedChange={(checked) =>
            handleSwitchChange("allow_overlap", checked)
          }
        />
      </div>

      <div className="flex items-center justify-between sm:p-5 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) transition-all hover:border-primary/30">
        <div className="space-y-1">
          <Label className="text-base font-bold">
            {t("appointment_status", { defaultValue: "Status" })}
          </Label>
          <p className="text-sm text-slate-500">
            {t("appointment_status_desc", {
              defaultValue: "Activate or deactivate this appointment booking",
            })}
          </p>
        </div>
        <Switch
          checked={formData.status === "active"}
          onCheckedChange={(checked) =>
            handleSelectChange("status", checked ? "active" : "inactive")
          }
        />
      </div>
    </div>
  );
};

export default GeneralInfoStep;
