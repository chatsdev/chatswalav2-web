import { TabsContent } from "@/src/elements/ui/tabs";
import { Campaign, CampaignStats, ManageWabaColumn } from "@/src/types/components";
import { OverviewDeliveryBanner } from "./OverviewDeliveryBanner";
import { OverviewPerformanceFunnel } from "./OverviewPerformanceFunnel";
import { OverviewConfiguration } from "./OverviewConfiguration";
import { OverviewBatchProgress } from "./OverviewBatchProgress";

export const OverviewTab = ({ campaign, stats, progress, active }: { campaign: Campaign; stats: CampaignStats; progress: number; active: boolean }) => {
  const wabaId = typeof campaign.waba_id === "object" && campaign.waba_id !== null ? (campaign.waba_id as ManageWabaColumn).whatsapp_business_account_id : campaign.waba_id;

  return (
    <TabsContent active={active} className="space-y-6 focus:outline-none mt-0">
      <OverviewDeliveryBanner stats={stats} progress={progress} />
      <OverviewBatchProgress campaign={campaign} />
      <OverviewPerformanceFunnel stats={stats} campaign={campaign} />
      <OverviewConfiguration campaign={campaign} wabaId={wabaId} />
    </TabsContent>
  );
};

