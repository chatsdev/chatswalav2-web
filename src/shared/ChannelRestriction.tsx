"use client";

import { useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import { useGetShopifyConfigQuery } from "@/src/redux/api/shopifyApi";
import { useAppSelector } from "@/src/redux/hooks";
import React from "react";
import WabaRequired from "./WabaRequired";

interface ChannelRestrictionProps {
  platform: "instagram" | "facebook" | "telegram" | "twitter" | "shopify";
  children: React.ReactNode;
}

export default function ChannelRestriction({ platform, children }: ChannelRestrictionProps) {
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);

  // General omni channels (FB, IG, TG, TW)
  const skipOmni = !selectedWorkspace?._id || platform === "shopify";
  const { data: channelsData, isLoading: isLoadingOmni } = useGetConnectedChannelsQuery(
    { workspace_id: selectedWorkspace?._id },
    { skip: skipOmni }
  );

  // Shopify
  const skipShopify = !selectedWorkspace?._id || platform !== "shopify";
  const { data: shopifyData, isLoading: isLoadingShopify } = useGetShopifyConfigQuery(undefined, { skip: skipShopify });

  const isLoading = platform === "shopify" ? isLoadingShopify : isLoadingOmni;

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-82px)] items-center justify-center space-x-2 text-sm font-semibold text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-(--dark-body)">
      </div>
    );
  }

  let isConnected = false;

  if (platform === "shopify") {
    isConnected = !!(shopifyData?.data?.shop_domain || shopifyData?.config?.shop_domain);
  } else {
    // channelsData.data is an array of connections
    isConnected = !!channelsData?.data?.some((c: any) => c.platform === platform);
  }

  if (!isConnected) {
    return (
      <div className="h-[calc(100vh-82px)] bg-slate-50 dark:bg-(--dark-body)">
        <WabaRequired platform={platform} />
      </div>
    );
  }

  return <>{children}</>;
}
