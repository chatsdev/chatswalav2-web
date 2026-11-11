"use client";

import CtwaPage from "@/src/components/product/ctwa/CtwaPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function CtwaContainer() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("ctwa");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return (
    <CtwaPage pageData={pageData} />
  );
}
