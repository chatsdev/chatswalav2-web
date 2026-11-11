"use client";

import WhatsAppPage from "@/src/components/channel/whatsapp/WhatsAppPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function WhatsAppChannelPage() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("whatsapp");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return (
    <ProductLayout>
      <WhatsAppPage pageData={pageData} />
    </ProductLayout>
  );
}
