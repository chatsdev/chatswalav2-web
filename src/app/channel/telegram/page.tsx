"use client";

import React from "react";
import TelegramPage from "@/src/components/channel/telegram/TelegramPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function TelegramChannelPage() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("telegram");

  const page = pageData?.data;
  const colorConfig = page?.color_config || {};
  const primaryColor = colorConfig.primary_color || "#0088cc";

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: primaryColor, borderTopColor: 'transparent' }} />
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout>
      <TelegramPage pageData={pageData} />
    </ProductLayout>
  );
}
