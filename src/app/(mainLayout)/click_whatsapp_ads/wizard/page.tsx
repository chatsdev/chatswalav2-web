"use client";

import AdCampaignWizard from "@/src/components/facebook/wizard/AdCampaignWizard";
import { useSearchParams } from "next/navigation";

const FacebookWizardPage = () => {
  const searchParams = useSearchParams();
  const adAccountId = searchParams.get("accountId") || "";
  const campaignId = searchParams.get("campaignId") || "";
  const adsetId = searchParams.get("adsetId") || "";

  return (
    <div className="p-4 sm:p-6 animate-in fade-in duration-500">
      <AdCampaignWizard 
        adAccountId={adAccountId} 
        campaignId={campaignId} 
        adsetId={adsetId} 
      />
    </div>
  );
};

export default FacebookWizardPage;
