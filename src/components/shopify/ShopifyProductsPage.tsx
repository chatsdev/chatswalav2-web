"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Sparkles, Image as ImageIcon, SendHorizontal, Copy } from "lucide-react";

import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { useGetShopifyProductsQuery, usePushProductsToWhatsappMutation, useSyncShopifyProductsMutation } from "@/src/redux/api/shopifyApi";
import { useAppSelector } from "@/src/redux/hooks";
import type { ShopifyProduct } from "@/src/types/shopify";
import type { Column } from "@/src/types/shared";
import { Button } from "@/src/elements/ui/button";
import { toast } from "sonner";
import Image from "next/image";


export const ShopifyProductsPage: React.FC = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [pushProduct, setPushProduct] = useState<ShopifyProduct | null>(null);

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);

  const { data: responseData, isLoading, isFetching } = useGetShopifyProductsQuery({
    page,
    limit,
    search: searchQuery,
  });

  const [pushProductsToWhatsapp, { isLoading: isPushing }] = usePushProductsToWhatsappMutation();
  const [syncShopifyProducts, { isLoading: isSyncing }] = useSyncShopifyProductsMutation();

  const products = responseData?.data?.products || [];
  const pagination = responseData?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setPage(1); // Reset page to 1 when search query changes
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page
  };

  const handleOpenPushModal = (product: ShopifyProduct) => {
    if (!selectedWorkspace?.waba_id) {
      toast.error("No active WhatsApp Business Account connected to this workspace.");
      return;
    }
    setPushProduct(product);
  };

  const handlePushProduct = async () => {
    if (!pushProduct || !selectedWorkspace?.waba_id) return;

    try {
      const response = await pushProductsToWhatsapp({
        waba_id: selectedWorkspace.waba_id,
        product_ids: [pushProduct._id],
      }).unwrap();

      if (response.success) {
        toast.success(response.message || "Product pushed to WhatsApp successfully");
        setPushProduct(null);
      } else {
        toast.error(response.message || "Failed to push product");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to push product to WhatsApp");
    }
  };

  const handleSync = async () => {
    try {
      const response = await syncShopifyProducts().unwrap();
      if (response.success) {
        toast.success(response.message || "Shopify product synchronization started.");
      } else {
        toast.error(response.message || "Failed to start synchronization.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to trigger product sync.");
    }
  };

  const copyToClipboard = useCallback(
    (text: string | undefined) => {
      if (!text) return;
      navigator.clipboard.writeText(text);
      toast.success(t("copied_success", { title: "Product link" }));
    },
    [t]
  );

  const columns = useMemo<Column<ShopifyProduct>[]>(
    () => [
      {
        header: "Image",
        className: "w-16 [@media(max-width:1245px)]:min-w-[150px]",
        cell: (product) => {
          const imageUrl = product.image_urls?.[0];
          return (
            <div className="w-12 h-12 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 overflow-hidden flex items-center justify-center shrink-0">
              {imageUrl ? (
                <Image unoptimized width={1000} height={1000}
                  src={imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover/row:scale-105 transition-transform duration-300"
                />
              ) : (
                <ImageIcon size={18} className="text-slate-400" />
              )}
            </div>
          );
        },
      },
      {
        header: "Product Info",
        className: "max-w-sm [@media(max-width:1245px)]:min-w-[370px]",
        cell: (product) => (
          <div className="space-y-0.5">
            <p className="font-bold text-sm text-slate-800 dark:text-white line-clamp-1 group-hover/row:text-primary transition-colors break-all whitespace-normal line-clamp-1">
              {product.name}
            </p>
            {product.description && (
              <p className="text-xs text-slate-400 dark:text-slate-500 break-all whitespace-normal line-clamp-2 leading-relaxed">
                {product.description.replace(/<[^>]*>/g, "")}
              </p>
            )}
          </div>
        ),
      },
      {
        header: "SKU / Retailer ID",
        className: "[@media(max-width:1245px)]:min-w-[250px]",
        cell: (product) => (
          <code className="text-xs px-2 py-1 bg-slate-100 dark:bg-(--dark-body) rounded font-mono text-slate-600 dark:text-slate-400">
            {product.retailer_id}
          </code>
        ),
      },
      {
        header: "Price",
        className: "[@media(max-width:1245px)]:min-w-[170px]",
        cell: (product) => (
          <span className="font-bold text-sm text-slate-800 dark:text-white">
            {product.currency} {parseFloat(product.price).toFixed(2)}
          </span>
        ),
      },
      {
        header: "Variants",
        className: "[@media(max-width:1245px)]:min-w-[170px]",
        cell: (product) => {
          const variantsCount = product.variants?.length || 0;
          return variantsCount > 0 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
              <Sparkles size={11} />
              {variantsCount} {variantsCount === 1 ? "variant" : "variants"}
            </span>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          );
        },
      },
      {
        header: "Action",
        className: "[@media(max-width:1245px)]:min-w-[170px] text-right",
        cell: (product) => (
          <div className="flex items-center justify-end gap-2 pr-2">
            {product.url && (
              <>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors px-2 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md"
                  title="View on Store"
                >
                  <ExternalLink size={13} />
                </a>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(product.url)}
                  className="w-10 h-10 border-none text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20! rounded-lg dark:hover:bg-blue/20 transition-all"
                  title="Copy Product Link"
                >
                  <Copy size={16} className="text-blue-500" />
                </Button>
              </>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleOpenPushModal(product)}
              className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-light-primary rounded-lg dark:hover:bg-primary/20 transition-all"
              title="Push to WhatsApp"
            >
              <SendHorizontal size={16} className="-rotate-45" />
            </Button>
          </div>
        ),
      },
    ],
    [copyToClipboard]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <CommonHeader
        title="Shopify Products"
        description="Browse all inventory and items imported from your connected Shopify store."
        onSearch={handleSearch}
        searchTerm={searchQuery}
        searchPlaceholder="Search products by name, SKU, or retailer ID..."
        isLoading={isLoading || isFetching || isSyncing}
        onSync={handleSync}
      />

      {/* Main Content Area */}
      <DataTable<ShopifyProduct>
        data={products}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        totalCount={pagination.totalItems}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={handleLimitChange}
        emptyMessage={
          searchQuery
            ? `No matches found for "${searchQuery}". Try revising your keywords.`
            : "Products will appear here once Shopify is connected and your catalog finishes syncing."
        }
      />

      {/* Push Confirmation Dialog */}
      <ConfirmModal
        isOpen={!!pushProduct}
        onClose={() => setPushProduct(null)}
        onConfirm={handlePushProduct}
        isLoading={isPushing}
        title="Push Product to WhatsApp"
        subtitle={`Are you sure you want to push "${pushProduct?.name}" to your connected WhatsApp Catalog?`}
        variant="primary"
        confirmText="Push"
        cancelText="Cancel"
      />
    </div>
  );
};

export default ShopifyProductsPage;
