"use client";

import AdList from "@/src/components/facebook/ads/AdList";
import Can from "@/src/components/shared/Can";
import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const AdPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const adsetId = params?.adsetId as string;

  return (
    <div className="p-4 sm:p-8 pt-0!">
      <AdList 
        adsetId={adsetId} 
        backBtn
        rightContent={
          <Can permission="create.facebook_ads">
            <Button
              onClick={() => router.push(`${ROUTES.FacebookAccount}/wizard?adsetId=${adsetId}`)}
              className="bg-primary text-white font-bold h-12 px-6 rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
              <Plus size={18} />
              {t("create_ad")}
            </Button>
          </Can>
        }
      />
    </div>
  );
};

export default AdPage;
