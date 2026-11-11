"use client";

import ProductLayout from "@/src/components/product/ProductLayout";
import FormsPage from "@/src/components/product/whatsapp_forms/FormsPage";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function WhatsappFormsContainer() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("whatsapp_forms");

  if (isLoading) {
    return (
      <ProductLayout>
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </ProductLayout>
    );
  }

  return <FormsPage pageData={pageData} />;
}
