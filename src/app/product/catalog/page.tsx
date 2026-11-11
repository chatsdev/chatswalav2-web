"use client";

import React from "react";
import CatalogPage from "@/src/components/product/catalog/CatalogPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function CatalogContainer() {
  const { data: pageDataCatalog, isLoading: isLoadingCatalog } = useGetPublicPageBySlugQuery("catalog");
  const { data: pageDataProductCatalog, isLoading: isLoadingProductCatalog } = useGetPublicPageBySlugQuery("product-catalog");

  const pageData = (pageDataCatalog?.success && pageDataCatalog?.data) ? pageDataCatalog : pageDataProductCatalog;
  const isLoading = isLoadingCatalog && isLoadingProductCatalog;

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return (
    <CatalogPage pageData={pageData} />
  );
}
