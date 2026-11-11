"use client";

import React from "react";
import AICallingPage from "@/src/components/product/ai_calling/AICallingPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function AICallingContainer() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("ai_calling");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return (
    <AICallingPage pageData={pageData} />
  );
}
