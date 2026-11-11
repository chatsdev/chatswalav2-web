"use client";

import FacebookPage from "@/src/components/channel/facebook/FacebookPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function FacebookChannelPage() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("facebook");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#1877f2] border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout>
      <FacebookPage pageData={pageData} />
    </ProductLayout>
  );
}
