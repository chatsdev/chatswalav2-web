/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format, isBefore, isToday, startOfMinute } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/src/elements/ui/button";
import { Calendar } from "@/src/elements/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { cn } from "@/src/lib/utils";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";

interface DatePickerProps {
  date?: Date;
  onChange?: (date?: Date) => void;
  placeholder?: string;
  className?: string;
  showTime?: boolean;
  disabled?: any;
}

export function DatePicker({ date, onChange, placeholder = "Pick a date", className, showTime = false, disabled }: DatePickerProps) {
  const isSelectedToday = date ? isToday(date) : false;
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const selectedHour = date ? date.getHours() : undefined;
  const selectedMinute = date ? date.getMinutes() : undefined;

  const handleTimeChange = (type: "hour" | "minute", value: string) => {
    if (!date) return;
    const newDate = new Date(date);
    if (type === "hour") {
      newDate.setHours(parseInt(value));
      // If hour becomes the current hour, check if minute needs adjustment
      if (isSelectedToday && parseInt(value) === currentHour && newDate.getMinutes() < currentMinute) {
        newDate.setMinutes(currentMinute);
      }
    } else {
      newDate.setMinutes(parseInt(value));
    }
    onChange?.(newDate);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal h-10 bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) rounded-lg", !date && "text-muted-foreground", className)}>
          <CalendarIcon className="mr-2 h-4 w-4 text-slate-400" />
          {date ? format(date, showTime ? "PPP HH:mm" : "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-2xl rounded-xl z-1100" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate && isToday(newDate)) {
              const now = new Date();
              const tempDate = new Date(newDate);
              if (date) {
                tempDate.setHours(date.getHours(), date.getMinutes(), 0, 0);
              }
              if (isBefore(tempDate, startOfMinute(now))) {
                newDate.setHours(now.getHours(), now.getMinutes(), 0, 0);
              }
            }
            onChange?.(newDate);
          }}
          initialFocus
          disabled={disabled}
          // react-day-picker v9 time pickers or other props can be added here if needed
        />
        {showTime && (
          <div className="p-3 border-t border-slate-100 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) rounded-b-xl flex items-center justify-center gap-2">
            <Select value={selectedHour?.toString()} onValueChange={(val) => handleTimeChange("hour", val)} disabled={!date}>
              <SelectTrigger className="w-17.5 h-9 font-bold bg-slate-50 dark:bg-(--page-body-bg)">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) min-w-17.5">
                {hours.map((h) => (
                  <SelectItem key={h} value={h.toString()} disabled={isSelectedToday && h < currentHour}>
                    {h.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="font-bold text-slate-400">:</span>

            <Select value={selectedMinute?.toString()} onValueChange={(val) => handleTimeChange("minute", val)} disabled={!date}>
              <SelectTrigger className="w-17.5 h-9 font-bold bg-slate-50 dark:bg-(--page-body-bg)">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) min-w-17.5">
                {minutes.map((m) => (
                  <SelectItem key={m} value={m.toString()} disabled={isSelectedToday && selectedHour === currentHour && m < currentMinute}>
                    {m.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
