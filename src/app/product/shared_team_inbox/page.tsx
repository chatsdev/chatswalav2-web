"use client";

import React from "react";
import SharedInboxPage from "@/src/components/product/shared_team_inbox/SharedInboxPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function SharedTeamInboxContainer() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("shared_team_inbox");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout>
      <SharedInboxPage pageData={pageData} />
    </ProductLayout>
  );
}
