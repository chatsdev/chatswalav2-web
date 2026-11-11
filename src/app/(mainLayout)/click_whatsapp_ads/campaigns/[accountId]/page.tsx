/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CampaignList from "@/src/components/facebook/campaigns/CampaignList";
import { Button } from "@/src/elements/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useSyncFbAdCampaignsMutation } from "@/src/redux/api/facebookApi";
import { toast } from "sonner";
import { ROUTES } from "@/src/constants";
import Can from "@/src/components/shared/Can";

const CampaignPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const accountId = params?.accountId as string;

  const [syncCampaigns, { isLoading: isSyncing }] = useSyncFbAdCampaignsMutation();

  const handleSync = async () => {
    try {
      await syncCampaigns({ ad_account_id: accountId }).unwrap();
      toast.success(t("campaigns_synced_success", "Campaigns synchronized successfully"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_sync_campaigns", "Failed to synchronize campaigns"));
    }
  };

  return (
    <div className="p-4 sm:p-8 pt-0!">
      <CampaignList
        accountId={accountId}
        backBtn
        rightContent={
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing}
              className="font-bold h-12 px-6 rounded-lg border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all active:scale-95 flex items-center gap-2 shadow-sm"
            >
              <RefreshCcw size={18} className={isSyncing ? "animate-spin" : ""} />
              {t("sync_campaigns", "Sync Campaigns")}
            </Button>
            <Can permission="create.facebook_ads">
              <Button
                onClick={() => router.push(`${ROUTES.FacebookAccount}/wizard?accountId=${accountId}`)}
                className="bg-primary text-white font-bold h-12 px-6 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                <Plus size={18} />
                {t("create_campaign")}
              </Button>
            </Can>
          </div>
        }
      />
    </div>
  );
};

export default CampaignPage;
