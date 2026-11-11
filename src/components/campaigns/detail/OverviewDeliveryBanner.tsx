import { Progress } from "@/src/elements/ui/progress";
import { CampaignStats } from "@/src/types/components";
import { TrendingUp } from "lucide-react";

export const OverviewDeliveryBanner = ({ stats, progress }: { stats: CampaignStats; progress: number }) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent border border-primary/20 p-5 rounded-lg relative overflow-hidden">
      <div className="absolute -top-10 -right-10 p-4 opacity-10 pointer-events-none rotate-12">
        <TrendingUp size={150} />
      </div>
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 tracking-tight">
            Delivery Mastery
          </h3>
          <p className="text-sm text-slate-600 dark:text-gray-300">
            <span className="font-bold text-primary text-base">
              {stats.total_recipients - stats.pending_count}
            </span>{" "}
            of{" "}
            <span className="font-bold text-base">
              {stats.total_recipients}
            </span>{" "}
            contacts processed
          </p>
        </div>
        <div className="w-full sm:w-1/2 flex items-center gap-4">
          <Progress
            value={progress}
            className="h-3 flex-1 bg-white/50 dark:bg-black/50 overflow-hidden rounded-full [&>div]:bg-primary"
          />
          <span className="text-xl font-black text-primary bg-white dark:bg-(--card-color) px-4 py-1.5 rounded-2xl shadow-sm border border-primary/10">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
};
