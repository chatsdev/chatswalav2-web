import { Campaign, CampaignStats } from "@/src/types/components";
import { Send, CheckCircle2, Eye, AlertCircle, RotateCcw } from "lucide-react";
import { useResendCampaignMutation } from "@/src/redux/api/campaignApi";
import { toast } from "sonner";

export const OverviewPerformanceFunnel = ({
  stats,
  campaign,
}: {
  stats: CampaignStats;
  campaign?: Campaign;
}) => {
  const [resendCampaign, { isLoading }] = useResendCampaignMutation();

  const handleRetryFailed = async () => {
    if (!campaign?._id) return;
    try {
      await resendCampaign({ id: campaign._id, failed_only: true }).unwrap();
      toast.success("Retry started for failed contacts successfully");
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          error?.data?.message ||
          "Failed to retry campaign for failed contacts"
      );
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black text-slate-500 dark:text-slate-400">
        Performance Funnel
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Dynamic Cards with smooth gradients */}
        <div className="group relative bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-lg transition-all overflow-hidden">
          <div className="absolute top-0 left-0 rtl:left-[unset] rtl:right-0 w-1 h-full bg-blue-500" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Sent
              </p>
              <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-500 rounded-lg group-hover:scale-110 transition-transform">
                <Send size={16} />
              </div>
            </div>
            <h4 className="text-2xl font-black text-blue-600 dark:text-blue-400 leading-none">
              {stats.sent_count}
            </h4>
          </div>
        </div>

        <div className="group relative bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-lg transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Delivered
              </p>
              <div className="p-2 bg-light-primary dark:bg-primary-darker/30 text-primary rounded-lg group-hover:scale-110 transition-transform">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <h4 className="text-2xl font-black text-primary dark:text-primary leading-none">
              {stats.delivered_count}
            </h4>
          </div>
        </div>

        <div className="group relative bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-lg transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Read
              </p>
              <div className="p-2 bg-purple-50 dark:bg-purple-900/30 text-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                <Eye size={16} />
              </div>
            </div>
            <h4 className="text-2xl font-black text-purple-600 dark:text-purple-400 leading-none">
              {stats.read_count}
            </h4>
          </div>
        </div>

        <div className="group relative bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-lg transition-all overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                Failed
              </p>
              <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-500 rounded-lg group-hover:scale-110 transition-transform">
                <AlertCircle size={16} />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-2xl font-black text-red-600 dark:text-red-400 leading-none">
                {stats.failed_count}
              </h4>
              {campaign && stats.failed_count > 0 && (
                <button
                  type="button"
                  onClick={handleRetryFailed}
                  disabled={isLoading || campaign.status === "sending"}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white border border-red-200 dark:border-red-800/60 rounded-md transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
                  title="Retry sending only for failed contacts"
                >
                  <RotateCcw size={13} className={isLoading ? "animate-spin" : ""} />
                  {isLoading ? "Retrying..." : "Retry"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
