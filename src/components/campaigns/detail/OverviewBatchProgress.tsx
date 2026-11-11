import { useState, useEffect } from "react";
import { Campaign } from "@/src/types/components";
import { formatDateTime } from "@/src/utils";
import { Badge } from "@/src/elements/ui/badge";
import { Progress } from "@/src/elements/ui/progress";
import {
  Clock,
  Layers,
  Hourglass,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Loader2,
  Calendar,
} from "lucide-react";

interface OverviewBatchProgressProps {
  campaign: Campaign;
}

const useCountdown = (targetTime?: string | null) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(0);
      return;
    }

    const calcTime = () => {
      const diff = Math.max(0, Math.floor((new Date(targetTime).getTime() - Date.now()) / 1000));
      setTimeLeft(diff);
    };

    calcTime();
    const interval = setInterval(calcTime, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (timeLeft <= 0) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const OverviewBatchProgress = ({ campaign }: OverviewBatchProgressProps) => {
  const batchStats = campaign.batch_stats;
  const countdown = useCountdown(batchStats?.next_batch_starts_at);

  if (!batchStats || !campaign.batch_size || campaign.batch_size <= 0) {
    return null;
  }

  const currentBatchItem = batchStats.batch_history.find(
    (h) => h.batch_number === batchStats.current_batch
  );

  const getBatchCampaignStatus = () => {
    if (campaign.status === "completed") return "Completed";
    if (campaign.status === "completed_with_errors") return "Partially Delivered";
    if (campaign.status === "failed") return "Failed";
    if (campaign.status === "cancelled") return "Cancelled";
    if (campaign.status === "sending") {
      if (campaign.is_paused) return "Paused";
      if (countdown) return "Waiting for Next Batch";
      const runningBatch = batchStats.batch_history.some((h) => h.status === "running");
      if (runningBatch) return "Processing Batch";
      return "Running";
    }
    return campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1);
  };

  const statusText = getBatchCampaignStatus();

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
      case "completed":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30";
      case "Processing Batch":
      case "running":
      case "Running":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30";
      case "Waiting for Next Batch":
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
      case "Partially Delivered":
      case "completed_with_errors":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30";
      case "Failed":
      case "failed":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
      case "completed":
        return <CheckCircle2 size={12} className="text-green-500" />;
      case "Processing Batch":
      case "running":
      case "Running":
        return <Loader2 size={12} className="animate-spin text-blue-500" />;
      case "Waiting for Next Batch":
      case "pending":
        return <Clock size={12} className="text-amber-500" />;
      case "Partially Delivered":
      case "completed_with_errors":
        return <AlertTriangle size={12} className="text-amber-500" />;
      case "Failed":
      case "failed":
        return <AlertTriangle size={12} className="text-red-500" />;
      default:
        return <Hourglass size={12} className="text-gray-500" />;
    }
  };

  const currentBatchProgress = currentBatchItem
    ? Math.round(
      ((currentBatchItem.processed_count || 0) / currentBatchItem.messages_count) * 100
    )
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color) rounded-lg p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Layers size={18} />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                Batch Progress
              </h4>
              <p className="text-[11px] text-slate-500">
                Throttled sending: {campaign.batch_size} messages per batch, paused for{" "}
                {campaign.pause_between_batches} min
              </p>
            </div>
          </div>
          <Badge className={`flex items-center gap-1.5 border py-1 px-3 ${getStatusBadgeClass(statusText)}`}>
            {getStatusIcon(statusText)}
            <span className="font-bold text-xs">{statusText}</span>
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-(--dark-sidebar) border border-slate-100 dark:border-(--card-border-color) flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total / Current Batch</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-black text-slate-800 dark:text-white">
                {batchStats.current_batch}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                of {batchStats.total_batches} batches
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-(--dark-sidebar) border border-slate-100 dark:border-(--card-border-color) flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Completed / Pending</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-black text-green-600 dark:text-green-400">
                {batchStats.completed_batches}
              </span>
              <span className="text-xs font-semibold text-slate-400">completed</span>
              <span className="text-slate-300">/</span>
              <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                {batchStats.pending_batches}
              </span>
              <span className="text-xs font-semibold text-slate-400">pending</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-(--dark-sidebar) border border-slate-100 dark:border-(--card-border-color) flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Remaining In Queue</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-xl font-black text-primary">
                {campaign.stats.pending_count}
              </span>
              <span className="text-xs font-semibold text-slate-400">messages</span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 dark:bg-(--dark-sidebar) border border-slate-100 dark:border-(--card-border-color) flex flex-col justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-400">Next Batch Countdown</span>
            <div className="mt-2 flex items-center gap-2">
              {countdown ? (
                <>
                  <Clock size={16} className="text-amber-500 animate-pulse" />
                  <span className="text-xl font-black text-amber-600 dark:text-amber-400">
                    {countdown}
                  </span>
                </>
              ) : campaign.status === "sending" && !campaign.is_paused ? (
                <>
                  <Activity size={16} className="text-blue-500 animate-pulse" />
                  <span className="text-xs font-bold text-blue-500">Processing live</span>
                </>
              ) : (
                <span className="text-sm font-bold text-slate-400">-</span>
              )}
            </div>
          </div>
        </div>

        {currentBatchItem && (
          <div className="mt-6 p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--dark-sidebar)/50">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold text-slate-600 dark:text-slate-400">
                Current Batch Progress ({currentBatchItem.processed_count || 0} /{" "}
                {currentBatchItem.messages_count})
              </span>
              <span className="font-black text-primary">{currentBatchProgress}%</span>
            </div>
            <Progress value={currentBatchProgress} className="h-2 bg-slate-200 dark:bg-slate-800" />
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color) rounded-lg p-6 shadow-xs">
        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar size={16} className="text-slate-500" />
          Batch Execution History
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-(--card-border-color) text-[11px] uppercase font-bold text-slate-400">
                <th className="py-3 px-4">Batch</th>
                <th className="py-3 px-4">Messages</th>
                <th className="py-3 px-4">Started At</th>
                <th className="py-3 px-4">Completed At</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-(--card-border-color)">
              {batchStats.batch_history.map((batch) => (
                <tr
                  key={batch.batch_number}
                  className="hover:bg-slate-50/50 dark:hover:bg-(--dark-sidebar)/50 transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                    Batch {batch.batch_number}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                    {batch.processed_count || 0} / {batch.messages_count}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {batch.started_at ? formatDateTime(batch.started_at) : "Waiting"}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                    {batch.completed_at ? formatDateTime(batch.completed_at) : "-"}
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={`inline-flex items-center gap-1 border py-0.5 px-2 ${getStatusBadgeClass(batch.status)}`}>
                      {getStatusIcon(batch.status)}
                      <span className="font-bold text-[10px] capitalize">{batch.status}</span>
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
