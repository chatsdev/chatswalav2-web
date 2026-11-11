import { PREDEFINED_CRONS } from "@/src/data/campaign";
import { Badge } from "@/src/elements/ui/badge";
import { Campaign } from "@/src/types/components";
import { cn, formatDate } from "@/src/utils";

export const OverviewConfiguration = ({
  campaign,
  wabaId,
}: {
  campaign: Campaign;
  wabaId: string | number | undefined;
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-slate-500 dark:text-slate-400">
        Configuration Details
      </h3>
      <div className="bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-(--card-border-color)">
          {/* Section 1: Campaign info */}
          <div className="p-4 sm:p-6 space-y-4">
            <h4 className="text-sm font-bold text-primary">Campaign Info</h4>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">Name</span>
                <span
                  className="font-semibold text-slate-900 dark:text-slate-100 text-right truncate max-w-[150px]"
                  title={campaign.name}
                >
                  {campaign.name}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Status
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "uppercase font-black text-[9px] px-2.5 py-0.5 rounded-md border",
                    campaign.status === "completed"
                      ? "bg-light-primary text-primary border-[var(--primary-opacity-30)] dark:bg-primary-darker/30 dark:border-primary-darker/50"
                      : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50",
                  )}
                >
                  {campaign.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Created Date
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(campaign.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Template configuration */}
          <div className="p-5 sm:p-6 space-y-4">
            <h4 className="text-sm font-bold text-primary">
              Template Settings
            </h4>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Template
                </span>
                <span
                  className="font-semibold text-slate-900 dark:text-slate-100 text-right max-w-[160px] truncate"
                  title={campaign.template_name}
                >
                  {campaign.template_name}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Language
                </span>
                <span className="text-xs font-bold bg-slate-100 dark:bg-(--dark-body) px-2 py-0.5 rounded text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {campaign.language_code || "en_US"}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  WABA ID
                </span>
                <span className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {wabaId || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Scheduling */}
          <div className="p-4 sm:p-6 space-y-4">
            <h4 className="text-sm font-bold text-primary">Scheduling Info</h4>
            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Schedule Type
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {campaign.is_recurring
                    ? `Recurring (${campaign.recurring_pattern === "custom_cron" ? "Custom Cron" : campaign.recurring_pattern})`
                    : campaign.scheduled_at
                      ? "Scheduled"
                      : "Immediate"}
                </span>
              </div>
              {campaign.is_recurring && campaign.cron_expression && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Schedule Details
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {PREDEFINED_CRONS.find((c) => c.value === campaign.cron_expression)?.label || campaign.cron_expression}
                  </span>
                </div>
              )}
              {campaign.scheduled_at && !campaign.is_recurring && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Scheduled For
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(campaign.scheduled_at)}
                  </span>
                </div>
              )}
              {campaign.is_recurring && campaign.next_run_at && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Next Run At
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(campaign.next_run_at)}
                  </span>
                </div>
              )}
              {campaign.is_recurring && campaign.recurring_end_date && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    End Date
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {formatDate(campaign.recurring_end_date)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-slate-400">
                  Last Updated
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {formatDate(campaign.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
