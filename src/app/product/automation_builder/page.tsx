"use client";

import React from "react";
import AutomationPage from "@/src/components/product/automation_builder/AutomationPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function AutomationBuilderContainer() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("automation_builder");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return <AutomationPage pageData={pageData} />;
}
