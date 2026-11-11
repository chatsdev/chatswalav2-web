"use client";

import BroadcastBulkMessagesPage from "@/src/components/product/broadcast_bulk_messages/BroadcastBulkMessagesPage";
import ProductLayout from "@/src/components/product/ProductLayout";
import { useGetPublicPageBySlugQuery } from "@/src/redux/api/pageApi";

export default function BroadcastBulkMessagesContainer() {
  const { data: pageData, isLoading } = useGetPublicPageBySlugQuery("broadcast_bulk_messages");

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
      <BroadcastBulkMessagesPage pageData={pageData} />
    </ProductLayout>
  );
}
