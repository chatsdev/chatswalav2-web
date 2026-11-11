"use client";

import AdSetList from "@/src/components/facebook/adsets/AdSetList";
import Can from "@/src/components/shared/Can";
import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const AdSetPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const campaignId = params?.campaignId as string;

  return (
    <div className="p-4 sm:p-8 pt-0!">
      <AdSetList
        campaignId={campaignId}
        backBtn
        rightContent={
          <Can permission="create.facebook_ads">
            <Button
              onClick={() => router.push(`${ROUTES.FacebookAccount}/wizard?campaignId=${campaignId}`)}
              className="bg-primary text-white font-bold h-12 px-6 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Plus size={18} />
              {t("create_ad_set")}
            </Button>
          </Can>
        }
      />
    </div>
  );
};

export default AdSetPage;
