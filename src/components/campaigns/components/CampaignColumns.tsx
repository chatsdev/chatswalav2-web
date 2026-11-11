/* eslint-disable @typescript-eslint/no-explicit-any */
import Can from "@/src/components/shared/Can";
import { statusConfig } from "@/src/data/campaign";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Progress } from "@/src/elements/ui/progress";
import { Campaign } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { formatDateTime } from "@/src/utils";
import {
  Clock,
  FileDown,
  Info,
  Pause,
  Play,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";

interface CampaignColumnsProps {
  onInfo: (id: string) => void;
  onDownloadReport: (id: string) => void;
  onPauseToggle: (id: string, isPaused: boolean) => void;
  onPublish: (id: string) => void;
  onSetupRecurring: (id: string) => void;
  onResend: (id: string, isScheduled: boolean) => void;
  onDelete: (id: string) => void;
}

export const getCampaignColumns = ({
  onInfo,
  onDownloadReport,
  onPauseToggle,
  onPublish,
  onSetupRecurring,
  onResend,
  onDelete,
}: CampaignColumnsProps): Column<Campaign>[] => [
  {
    header: "Name",
    className: "[@media(max-width:1800px)]:min-w-[350px]",
    accessorKey: "name",
    sortable: true,
    sortKey: "name",
    cell: (row) => (
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-200 break-all whitespace-normal line-clamp-1">
          {row.name}
        </span>
        <span className="text-xs text-gray-400 truncate max-w-50 break-all whitespace-normal line-clamp-1">
          {row.description || "No description"}
        </span>
      </div>
    ),
  },
  {
    header: "Presets",
    className: "[@media(max-width:1800px)]:min-w-[155px]",
    sortable: true,
    sortKey: "template_name",
    accessorKey: "template_name",
    cell: (row) => (
      <Badge
        variant="outline"
        className="bg-gray-50 text-slate-600 border-blue-100 dark:bg-(--dark-sidebar) dark:text-amber-50 dark:border-(--card-border-color)"
      >
        {row.template_name}
      </Badge>
    ),
  },
  {
    header: "Progress",
    className: "[@media(max-width:1800px)]:min-w-[200px]",
    cell: (row) => {
      const stats = row.stats;
      const progress = stats?.total_recipients
        ? Math.round(
            ((stats.total_recipients - (stats.pending_count || 0)) /
              stats.total_recipients) *
              100,
          )
        : 0;
      return (
        <div className="flex flex-col gap-1 w-24">
          <Progress value={progress} className="h-1.5" />
          <span className="text-[10px] font-bold text-slate-500 whitespace-nowrap">
            {progress}% (
            {stats?.total_recipients - (stats?.pending_count || 0)}/
            {stats?.total_recipients})
          </span>
        </div>
      );
    },
  },
  {
    header: "Status",
    className: "[@media(max-width:1800px)]:min-w-[120px]",
    accessorKey: "status",
    cell: (row) => {
      if (row.is_paused) {
        return (
          <Badge className="flex items-center gap-1 border bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30">
            <Pause size={12} />
            Paused
          </Badge>
        );
      }
      const config = statusConfig[row.status] || statusConfig.draft;
      const Icon = config.icon;
      return (
        <Badge
          className={`flex items-center gap-1 border ${config.className}`}
        >
          <Icon
            size={12}
            className={
              row.status === "sending" || row.status === "recurring"
                ? "animate-spin"
                : ""
            }
          />
          {config.label}
        </Badge>
      );
    },
  },
  {
    header: "Publish State",
    className: "[@media(max-width:1800px)]:min-w-[120px]",
    accessorKey: "is_published",
    cell: (row) => {
      const isPublished = row.is_published ?? false;
      const isRecurring = row.is_recurring ?? false;
      return (
        <Badge
          className={`flex items-center gap-1 border justify-center ${
            isRecurring
              ? "bg-blue-50 text-blue-600 border-blue-100 dark:border-blue-950/20 dark:bg-blue-950/20"
              : isPublished
              ? "bg-light-primary text-primary border-[var(--primary-opacity-20)] dark:border-primary-darker/20 dark:bg-primary-darker/20"
              : "bg-gray-100 text-gray-600 border-gray-200 dark:border-(--card-border-color) dark:bg-(--dark-sidebar)"
          }`}
        >
          {isRecurring ? "Recurring" : isPublished ? "Published" : "Draft"}
        </Badge>
      );
    },
  },
  {
    header: "Send",
    className: "[@media(max-width:1800px)]:min-w-[150px]",
    cell: (row) => (
      <div className="flex items-center gap-1 text-xs">
        <span className="text-blue-600 font-bold" title="Send">
          {row.stats?.sent_count || 0}
        </span>
      </div>
    ),
  },
  {
    header: "Delivered",
    className: "[@media(max-width:1800px)]:min-w-[150px]",
    cell: (row) => (
      <div className="flex items-center gap-1 text-xs">
        <span className="text-primary font-bold" title="Delivered">
          {row.stats?.delivered_count || 0}
        </span>
      </div>
    ),
  },
  {
    header: "Read",
    className: "[@media(max-width:1800px)]:min-w-[150px]",
    cell: (row) => (
      <div className="flex items-center gap-1 text-xs">
        <span className="text-purple-600 font-bold" title="Read">
          {row.stats?.read_count || 0}
        </span>
      </div>
    ),
  },
  {
    header: "Failed",
    className: "[@media(max-width:1800px)]:min-w-[150px]",
    cell: (row) => (
      <div className="flex items-center gap-1 text-xs">
        <span className="text-red-500 font-bold" title="Failed">
          {row.stats?.failed_count || 0}
        </span>
      </div>
    ),
  },
  {
    header: "Sent At",
    className: "[@media(max-width:1800px)]:min-w-[200px]",
    sortable: true,
    sortKey: "sent_at",
    cell: (row) => (
      <span className="text-gray-500 dark:text-gray-400 text-xs">
        {row?.sent_at ? formatDateTime(row.sent_at) : "-"}
      </span>
    ),
  },
  {
    header: "Actions",
    className: "[@media(max-width:1800px)]:min-w-[190px]",
    cell: (row) => (
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs"
          onClick={() => onInfo(row._id || (row as any).id)}
          title="Info"
        >
          <Info size={14} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs"
          onClick={() => onDownloadReport(row._id || (row as any).id)}
          disabled={
            row.status !== "completed" &&
            row.status !== "failed" &&
            row.status !== "completed_with_errors"
          }
          title="Download Report"
        >
          <FileDown size={14} />
        </Button>
        <Can permission="update.campaigns">
          {row.status === "sending" && (
            <Button
              variant="outline"
              size="sm"
              className={`w-10 h-10 border-none rounded-lg transition-all shadow-xs ${
                row.is_paused
                  ? "text-primary hover:text-primary hover:bg-light-primary dark:hover:bg-primary-darker/20"
                  : "text-amber-600 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20"
              }`}
              onClick={() =>
                onPauseToggle(row._id || (row as any).id, row.is_paused ?? false)
              }
              title={row.is_paused ? "Resume" : "Pause"}
            >
              {row.is_paused ? <Play size={14} /> : <Pause size={14} />}
            </Button>
          )}
        </Can>
        <Can permission="update.campaigns">
          {row.status === "draft" && !row.is_published && (
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-light-primary rounded-lg dark:text-primary dark:hover:bg-primary-darker/20 transition-all shadow-xs"
              onClick={() => onPublish(row._id || (row as any).id)}
              title="Publish Campaign"
            >
              <Send size={14} />
            </Button>
          )}
        </Can>
        <Can permission="update.campaigns">
          {row.status !== "sending" && (
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg dark:text-indigo-400 dark:hover:bg-indigo-950/20 transition-all shadow-xs"
              onClick={() => onSetupRecurring(row._id || (row as any).id)}
              title="Setup Recurring Campaign"
            >
              <Clock size={14} />
            </Button>
          )}
        </Can>
        <Can permission="create.campaigns">
          {(row.status === "completed" ||
            row.status === "completed_with_errors" ||
            row.status === "failed") && (
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg dark:text-blue-400 dark:hover:bg-blue-950/20 transition-all shadow-xs"
              onClick={() => onResend(row._id || (row as any).id, row.is_scheduled ?? false)}
              title="Resend Campaign"
            >
              <RotateCcw size={14} />
            </Button>
          )}
        </Can>
        {(row.status === "draft" || row.status === "scheduled" || row.status === "recurring") && (
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 border-none text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-500/10 transition-all shadow-xs"
            onClick={() => onDelete(row._id || (row as any).id)}
            title="Delete"
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    ),
  },
];
