"use client";

import InstagramPage from "@/src/components/channel/instagram/InstagramPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function InstagramChannelPage() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("instagram");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#E1306C] border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout>
      <InstagramPage pageData={pageData} />
    </ProductLayout>
  );
}
