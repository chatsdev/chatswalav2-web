/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/src/elements/ui/dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { DatePicker } from "@/src/elements/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { format, parse } from "date-fns";
import { Calendar, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { PREDEFINED_CRONS } from "@/src/data/campaign";
import { useGetCampaignByIdQuery, useSetupRecurringCampaignMutation } from "@/src/redux/api/campaignApi";
import { toast } from "sonner";

interface SetupRecurringModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string | null;
}

const SetupRecurringModal: React.FC<SetupRecurringModalProps> = ({
  isOpen,
  onClose,
  campaignId,
}) => {
  const { data: campaignResult, isLoading: isFetchingCampaign } = useGetCampaignByIdQuery(
    campaignId || "",
    { skip: !campaignId }
  );

  const campaign = campaignResult?.data;

  const [setupRecurring, { isLoading: isSubmitting }] = useSetupRecurringCampaignMutation();

  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [recurringPattern, setRecurringPattern] = useState<string>("daily");
  const [cronExpression, setCronExpression] = useState<string>("");
  const [isCustomCron, setIsCustomCron] = useState<boolean>(false);

  useEffect(() => {
    if (campaign) {
      if (campaign.scheduled_at) {
        setScheduledAt(format(new Date(campaign.scheduled_at), "yyyy-MM-dd'T'HH:mm"));
      } else {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);
        setScheduledAt(format(tomorrow, "yyyy-MM-dd'T'HH:mm"));
      }

      if (campaign.recurring_end_date) {
        setEndDate(format(new Date(campaign.recurring_end_date), "yyyy-MM-dd"));
      } else {
        setEndDate("");
      }

      setRecurringPattern(campaign.recurring_pattern || "daily");
      
      const cronExpr = campaign.cron_expression || "";
      setCronExpression(cronExpr);

      if (cronExpr) {
        const isPredefined = PREDEFINED_CRONS.some(c => c.value === cronExpr);
        setIsCustomCron(!isPredefined);
      } else {
        setIsCustomCron(false);
      }
    }
  }, [campaign, isOpen]);

  const handleSubmit = async () => {
    if (!campaignId) return;

    if (!scheduledAt) {
      toast.error("Start Date & Time (First Run) is required.");
      return;
    }

    if (recurringPattern === "custom_cron" && !cronExpression) {
      toast.error("Cron expression is required for custom pattern.");
      return;
    }

    try {
      const response = await setupRecurring({
        id: campaignId,
        scheduled_at: scheduledAt,
        recurring_pattern: recurringPattern,
        cron_expression: recurringPattern === "custom_cron" ? cronExpression : undefined,
        recurring_end_date: endDate || undefined,
      }).unwrap();

      toast.success(response.message || "Campaign converted to recurring setup successfully!");
      onClose();
    } catch (error: unknown) {
      const err = error as { data?: { error?: string; message?: string } };
      toast.error(
        err?.data?.error ||
        err?.data?.message ||
        "Failed to set up recurring campaign"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! max-h-[90vh] flex flex-col p-0! overflow-auto no-scrollbar dark:bg-(--dark-body) gap-0 border-0 rounded-lg shadow-2xl">
        <DialogHeader className="sm:p-6 p-4 bg-white dark:bg-(--card-color) border-b border-slate-100 dark:border-(--card-border-color) shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-lg">
              <Clock className="text-primary w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-slate-800 text-left rtl:text-right dark:text-white text-lg font-bold tracking-tight">
                Recurring Campaign Configuration
              </DialogTitle>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left rtl:text-right">
                {campaign?.name || "Loading..."}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto sm:p-6 p-4 space-y-6 no-scrollbar bg-slate-50/50 dark:bg-(--card-color)">
          {isFetchingCampaign ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="w-10 h-10 text-primary animate-spin opacity-50" />
              <p className="text-sm font-bold text-slate-400 animate-pulse">
                Fetching campaign details...
              </p>
            </div>
          ) : campaign ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_at" className="text-xs font-medium">
                    Start Date & Time (First Run)
                  </Label>
                  <div className="relative">
                    <DatePicker
                      date={
                        scheduledAt
                          ? parse(scheduledAt, "yyyy-MM-dd'T'HH:mm", new Date())
                          : undefined
                      }
                      onChange={(date) =>
                        setScheduledAt(date ? format(date, "yyyy-MM-dd'T'HH:mm") : "")
                      }
                      showTime={true}
                      disabled={{ before: new Date() }}
                      className="h-11 pl-10 font-bold text-sm border-slate-200/60 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) w-full"
                    />
                    <Calendar
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
                      size={16}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurring_end_date" className="text-xs font-medium">
                    End Date (Optional)
                  </Label>
                  <div className="relative">
                    <DatePicker
                      date={
                        endDate
                          ? parse(endDate, "yyyy-MM-dd", new Date())
                          : undefined
                      }
                      onChange={(date) =>
                        setEndDate(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={{ before: new Date() }}
                      className="h-11 pl-10 font-bold text-sm border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) w-full"
                    />
                    <Calendar
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
                      size={16}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="recurring_pattern" className="text-xs font-medium ">
                    Repeat Pattern
                  </Label>
                  <Select
                    value={recurringPattern}
                    onValueChange={(val) => {
                      setRecurringPattern(val);
                      if (val !== "custom_cron") {
                        setCronExpression("");
                      }
                    }}
                  >
                    <SelectTrigger className="h-12 py-5.5 font-semibold text-sm border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg)">
                      <SelectValue placeholder="Select repeat pattern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="custom_cron">Custom (Cron Expression)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {recurringPattern === "custom_cron" && (
                  <div className="space-y-2">
                    <Label htmlFor="predefined_cron" className="text-xs font-medium">
                      Select Schedule
                    </Label>
                    <Select
                      value={isCustomCron ? "custom" : cronExpression}
                      onValueChange={(val) => {
                        if (val === "custom") {
                          setIsCustomCron(true);
                          if (!cronExpression || PREDEFINED_CRONS.some(c => c.value === cronExpression)) {
                            setCronExpression("* * * * *");
                          }
                        } else {
                          setIsCustomCron(false);
                          setCronExpression(val);
                        }
                      }}
                    >
                      <SelectTrigger className="h-12 py-5.5 font-semibold text-sm border-primary/30 bg-white dark:bg-zinc-950">
                        <SelectValue placeholder="Select a cron interval" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREDEFINED_CRONS.map((cron) => (
                          <SelectItem key={cron.value} value={cron.value}>
                            {cron.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {recurringPattern === "custom_cron" && isCustomCron && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Label htmlFor="cron_expression" className="text-xs font-black uppercase tracking-widest text-primary ml-1">
                    Enter Custom Cron Expression
                  </Label>
                  <Input
                    id="cron_expression"
                    name="cron_expression"
                    placeholder="e.g. 0 9 * * 1 (Every Monday at 9:00 AM)"
                    value={cronExpression}
                    onChange={(e) => setCronExpression(e.target.value)}
                    className="h-12 font-bold text-sm border-primary/30 bg-white dark:bg-zinc-950"
                  />
                  <p className="text-[11px] text-slate-400 font-medium ml-1">
                    Format: minute hour day-of-month month day-of-week. Use standard cron syntax.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
              <AlertCircle size={32} className="text-red-400" />
              <p className="font-bold text-slate-600 dark:text-slate-300">Campaign not found</p>
            </div>
          )}
        </div>

        <DialogFooter className="sm:p-6 p-4 bg-white dark:bg-(--card-color) border-t border-slate-100 dark:border-(--card-border-color) gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isFetchingCampaign || !campaign}
            className="bg-primary text-white h-11"
          >
            {isSubmitting ? "Configuring..." : "Save Configuration"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetupRecurringModal;
