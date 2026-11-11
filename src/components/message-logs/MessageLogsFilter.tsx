import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { MessageLogsFilterProps } from "@/src/types/messageLogs";
import { Filter, X } from "lucide-react";
import React from "react";
import { Button } from "@/src/elements/ui/button";


export const MessageLogsFilter: React.FC<MessageLogsFilterProps> = ({
  platformFilter,
  setPlatformFilter,
  statusFilter,
  setStatusFilter,
  timeFilter,
  setTimeFilter,
  searchTerm,
  handleClearFilters,
}) => {
  const showReset =
    searchTerm ||
    platformFilter !== "all_platforms" ||
    statusFilter !== "all_status" ||
    timeFilter !== "all_time";

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-lg p-5 border border-slate-200/60 dark:border-(--card-border-color) shadow-sm flex flex-col md:flex-row items-center gap-4.5">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 shrink-0">
        <Filter size={16} className="text-primary" />
        <span>Filters:</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full">
        {/* Platform Filter Select */}
        <div className="flex flex-col gap-1.5">
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200/60 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-primary/25">
              <SelectValue placeholder="Filter by Platform" />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color) dark:border-(--card-border-color)">
              <SelectItem
                className="dark:hover:bg-(--table-hover)"
                value="all_platforms"
              >
                All Platforms
              </SelectItem>
              <SelectItem
                className="dark:hover:bg-(--table-hover)"
                value="whatsapp"
              >
                WhatsApp
              </SelectItem>
              <SelectItem
                className="dark:hover:bg-(--table-hover)"
                value="telegram"
              >
                Telegram
              </SelectItem>
              <SelectItem
                className="dark:hover:bg-(--table-hover)"
                value="facebook"
              >
                Facebook
              </SelectItem>
              <SelectItem
                className="dark:hover:bg-(--table-hover)"
                value="instagram"
              >
                Instagram
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter Select */}
        <div className="flex flex-col gap-1.5">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200/60 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-primary/25">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_status">All Statuses</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time Filter Select */}
        <div className="flex flex-col gap-1.5">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200/60 dark:bg-(--page-body-bg) dark:border-none focus-visible:ring-primary/25">
              <SelectValue placeholder="Filter by Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all_time">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="last_24_hours">Last 24 Hours</SelectItem>
              <SelectItem value="last_week">Last Week</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Clear Filters Button */}
      {showReset && (
        <Button variant="unstyled"
          onClick={handleClearFilters}
          className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 px-3.5 py-2.5 rounded-lg border border-red-100 dark:border-red-500/10 cursor-pointer transition-all shrink-0 active:scale-95"
        >
          <X size={13} />
          <span>Reset</span>
        </Button>
      )}
    </div>
  );
};
