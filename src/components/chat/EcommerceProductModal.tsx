/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  ShoppingCart,
  Store,
  ShoppingBag,
  Search,
  ArrowLeft,
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  X,
} from "lucide-react";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/elements/ui/tabs";

import { useAppSelector } from "@/src/redux/hooks";
import { RootState } from "@/src/redux/store";
import {
  useGetLinkedCatalogsQuery,
  useGetProductsFromCatalogQuery,
} from "@/src/redux/api/catalogueApi";
import { useGetShopifyProductsQuery } from "@/src/redux/api/shopifyApi";
import {
  useSendProductMessageMutation,
  useSendOrderMessageMutation,
} from "@/src/redux/api/chatApi";
import useDebounce from "@/src/utils/hooks/useDebounce";
import Image from "next/image";


interface EcommerceProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcommerceProductModal: React.FC<EcommerceProductModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  const { selectedChat, selectedPhoneNumberId } = useAppSelector(
    (state: RootState) => state.chat,
  );
  const { selectedWorkspace } = useAppSelector(
    (state: RootState) => state.workspace,
  );

  const contactId = selectedChat?.contact?.id;
  const wabaId = selectedWorkspace?.waba_id;

  const [activeTab, setActiveTab] = useState<"shopify" | "catalog">("shopify");
  const [shopifyPage, setShopifyPage] = useState(1);
  const [shopifySearch, setShopifySearch] = useState("");
  const debouncedShopifySearch = useDebounce(shopifySearch, 500);

  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogSearch, setCatalogSearch] = useState("");
  const debouncedCatalogSearch = useDebounce(catalogSearch, 500);
  const [selectedCatalogId, setSelectedCatalogId] = useState<string>("");

  const [orderProduct, setOrderProduct] = useState<any | null>(null);
  const [orderTitle, setOrderTitle] = useState("Order Information");
  const [orderDescription, setOrderDescription] = useState(
    "Click the link below to complete your secure payment.",
  );
  const [checkoutUrl, setCheckoutUrl] = useState("");

  // Mutations
  const [sendProductMessage, { isLoading: isSendingProduct }] =
    useSendProductMessageMutation();
  const [sendOrderMessage, { isLoading: isSendingOrder }] =
    useSendOrderMessageMutation();

  // Reset pagination on search change
  useEffect(() => {
    setShopifyPage(1);
  }, [debouncedShopifySearch]);

  useEffect(() => {
    setCatalogPage(1);
  }, [debouncedCatalogSearch]);

  // Shopify Products Query
  const {
    data: shopifyData,
    isLoading: loadingShopify,
    isFetching: fetchingShopify,
  } = useGetShopifyProductsQuery(
    {
      page: shopifyPage,
      limit: 8,
      search: debouncedShopifySearch,
    },
    { skip: !isOpen || activeTab !== "shopify" },
  );

  // Catalogs Query
  const { data: catalogsResult, isLoading: loadingCatalogs } =
    useGetLinkedCatalogsQuery(
      { waba_id: wabaId || "" },
      { skip: !isOpen || !wabaId || activeTab !== "catalog" },
    );

  const catalogs = catalogsResult?.data?.catalogs || [];

  // Auto-select first catalog
  useEffect(() => {
    if (catalogs.length > 0 && !selectedCatalogId) {
      setSelectedCatalogId(catalogs[0]._id);
    }
  }, [catalogs, selectedCatalogId]);

  // Catalog Products Query
  const {
    data: catalogProductsData,
    isLoading: loadingCatalogProducts,
    isFetching: fetchingCatalogProducts,
  } = useGetProductsFromCatalogQuery(
    {
      catalog_id: selectedCatalogId,
      page: catalogPage,
      limit: 8,
      search: debouncedCatalogSearch,
    },
    { skip: !isOpen || !selectedCatalogId || activeTab !== "catalog" },
  );

  // Reset order values on product selection
  useEffect(() => {
    if (orderProduct) {
      setCheckoutUrl(orderProduct.url || "");
      setOrderTitle("Order Information");
      setOrderDescription(
        "Click the link below to complete your secure payment.",
      );
    }
  }, [orderProduct]);

  // Handlers
  const handleSendProduct = async (product: any) => {
    if (!selectedPhoneNumberId || !contactId) {
      toast.error(
        t("no_active_chat_error", {
          defaultValue: "No active chat or phone number selected",
        }),
      );
      return;
    }

    try {
      const res = await sendProductMessage({
        whatsapp_phone_number_id: selectedPhoneNumberId,
        contact_id: contactId,
        product_id: product._id,
      }).unwrap();

      if (res.success) {
        toast.success(
          t("product_sent_success", {
            defaultValue: "Product message sent successfully",
          }),
        );
        onClose();
      } else {
        toast.error(
          res.message ||
            t("product_sent_fail", {
              defaultValue: "Failed to send product message",
            }),
        );
      }
    } catch (err: any) {
      toast.error(
        err?.data?.error ||
          err?.data?.message ||
          t("product_sent_error", {
            defaultValue: "An error occurred while sending the product",
          }),
      );
    }
  };

  const handleSendOrder = async () => {
    if (!orderProduct || !selectedPhoneNumberId || !contactId) return;

    try {
      const res = await sendOrderMessage({
        whatsapp_phone_number_id: selectedPhoneNumberId,
        contact_id: contactId,
        product_id: orderProduct._id,
        checkout_url: checkoutUrl || undefined,
        order_title: orderTitle,
        order_description: orderDescription,
      }).unwrap();

      if (res.success) {
        toast.success(
          t("order_sent_success", {
            defaultValue: "Order message sent successfully",
          }),
        );
        setOrderProduct(null);
        onClose();
      } else {
        toast.error(
          res.message ||
            t("order_sent_fail", {
              defaultValue: "Failed to send order message",
            }),
        );
      }
    } catch (err: any) {
      toast.error(
        err?.data?.error ||
          err?.data?.message ||
          t("order_sent_error", {
            defaultValue: "An error occurred while sending the order",
          }),
      );
    }
  };

  const getProductImage = (product: any) => {
    if (product.image_urls && product.image_urls.length > 0) {
      return product.image_urls[0];
    }
    return product.image_url || null;
  };

  const renderProductGrid = (
    products: any[],
    isLoading: boolean,
    isFetching: boolean,
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void,
  ) => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="animate-spin text-primary" size={32} />
          <span className="text-sm text-slate-500 font-medium">
            {t("loading_products", { defaultValue: "Loading products..." })}
          </span>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-16 dark:text-gray-400 text-slate-500 text-sm flex flex-col items-center gap-2">
          <span className="p-3 bg-slate-50 dark:bg-(--dark-body) rounded-full">
            <ShoppingBag size={24} className="text-slate-400" />
          </span>
          <p className="font-semibold">
            {t("no_products_found", { defaultValue: "No products found" })}
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 gap-4 min-h-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 overflow-y-auto pr-1 no-scrollbar min-h-0">
          {products.map((product) => {
            const imageUrl = getProductImage(product);
            return (
              <div
                key={product._id}
                className="border border-slate-100 dark:border-(--card-border-color) rounded-lg p-3 flex flex-col justify-between hover:shadow-md transition-all dark:bg-(--page-body-bg) bg-white"
              >
                <div>
                  <div className="w-full h-32 relative bg-slate-50 dark:bg-(--dark-body) rounded-lg flex items-center justify-center overflow-hidden mb-3 border border-slate-100 dark:border-(--card-border-color)">
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <Image unoptimized width={1000} height={1000}
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <ImageOff size={24} className="text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-semibold text-md line-clamp-1 dark:text-white">
                    {product.name}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 mb-2">
                    {product.description ||
                      t("no_description", { defaultValue: "No description" })}
                  </p>
                </div>
                <div>
                  <div className="text-sm font-bold text-primary mb-3">
                    {product.currency || "$"} {product.price}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-9 px-3 py-2 rounded-lg"
                      onClick={() => handleSendProduct(product)}
                      disabled={isSendingProduct || isSendingOrder}
                    >
                      {t("send_product", { defaultValue: "Send Product" })}
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs h-9 px-3 py-2 text-white rounded-lg bg-primary"
                      onClick={() => setOrderProduct(product)}
                      disabled={isSendingProduct || isSendingOrder}
                    >
                      {t("send_order", { defaultValue: "Send Order" })}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 dark:border-(--card-border-color) pt-3 shrink-0">
            <span className="text-xs text-slate-500">
              {t("page_of", {
                defaultValue: "Page {{current}} of {{total}}",
                current: currentPage,
                total: totalPages,
              })}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                disabled={currentPage <= 1 || isFetching}
                onClick={() => onPageChange(currentPage - 1)}
              >
                <ChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
                disabled={currentPage >= totalPages || isFetching}
                onClick={() => onPageChange(currentPage + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) max-h-[90vh] flex flex-col p-0! overflow-hidden gap-0"
      >
        <DialogHeader className="sm:p-6 p-4 pb-2 shrink-0 relative">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="text-primary" size={20} />
            {orderProduct
              ? t("configure_order_message", {
                  defaultValue: "Configure Order Message",
                })
              : t("ecommerce_products", { defaultValue: "Ecommerce Products" })}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 rtl:right-[unset] rtl:left-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 h-8 w-8 rounded-full"
          >
            <X size={18} />
          </Button>
        </DialogHeader>

        {orderProduct ? (
          // Order Form View
          <div className="flex flex-col flex-1 overflow-y-auto sm:p-6 p-4 space-y-4 custom-scrollbar min-h-0">
            <div className="flex items-center gap-3 border border-slate-100 dark:border-(--card-border-color) rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30">
              <div className="h-16 w-16 bg-white dark:bg-slate-900 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-slate-100 dark:border-(--card-border-color)">
                {getProductImage(orderProduct) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Image unoptimized width={1000} height={1000}
                    src={getProductImage(orderProduct)}
                    alt={orderProduct.name}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <ImageOff size={16} className="text-slate-400" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-sm dark:text-white">
                  {orderProduct.name}
                </h4>
                <div className="text-sm font-bold text-primary mt-0.5">
                  {orderProduct.currency || "$"} {orderProduct.price}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t("order_title", { defaultValue: "Order Title" })}
                </Label>
                <Input
                  placeholder={t("enter_order_title", {
                    defaultValue: "Enter order title",
                  })}
                  value={orderTitle}
                  onChange={(e) => setOrderTitle(e.target.value)}
                  className="h-11 border-slate-200 dark:border-(--card-border-color) bg-transparent rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t("order_description", {
                    defaultValue: "Order Description",
                  })}
                </Label>
                <Textarea
                  placeholder={t("enter_order_description", {
                    defaultValue: "Enter order description",
                  })}
                  value={orderDescription}
                  onChange={(e) => setOrderDescription(e.target.value)}
                  className="min-h-20 border-slate-200 dark:border-slate-800 bg-transparent rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {t("checkout_url", { defaultValue: "Checkout/Product URL" })}
                </Label>
                <Input
                  type="url"
                  placeholder={t("enter_checkout_url", {
                    defaultValue: "https://shopify.com/checkout",
                  })}
                  value={checkoutUrl}
                  onChange={(e) => setCheckoutUrl(e.target.value)}
                  className="h-11 border-slate-200 dark:border-slate-800 bg-transparent rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t dark:border-(--card-border-color) border-slate-100 shrink-0">
              <Button
                variant="outline"
                className="h-11 rounded-lg"
                onClick={() => setOrderProduct(null)}
                disabled={isSendingOrder}
              >
                <ArrowLeft size={16} className="mr-2" />
                {t("back", { defaultValue: "Back" })}
              </Button>
              <Button
                className="h-11 text-white rounded-lg bg-primary"
                onClick={handleSendOrder}
                disabled={isSendingOrder || !orderTitle || !orderDescription}
              >
                {isSendingOrder ? (
                  <Loader2 size={16} className="animate-spin mr-2" />
                ) : (
                  <Send size={16} className="mr-2" />
                )}
                {t("send_order", { defaultValue: "Send Order" })}
              </Button>
            </div>
          </div>
        ) : (
          // Product List View
          <div className="flex flex-col flex-1 sm:p-6 pt-0! p-4 overflow-hidden min-h-0">
            <Tabs className="flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b dark:border-(--card-border-color) border-slate-100 shrink-0">
                <TabsList className="dark:bg-(--page-body-bg)! w-full sm:w-auto">
                  <TabsTrigger
                    active={activeTab === "shopify"}
                    onClick={() => setActiveTab("shopify")}
                    className="w-1/2 sm:w-auto text-xs"
                  >
                    <ShoppingBag size={14} className="mr-2" />
                    Shopify
                  </TabsTrigger>
                  <TabsTrigger
                    active={activeTab === "catalog"}
                    onClick={() => setActiveTab("catalog")}
                    className="w-1/2 sm:w-auto text-xs"
                  >
                    <Store size={14} className="mr-2" />
                    {t("catalogs", { defaultValue: "Catalogs" })}
                  </TabsTrigger>
                </TabsList>

                {/* Search Bar */}
                <div className="relative w-full sm:max-w-xs">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <Input
                    placeholder={
                      activeTab === "shopify"
                        ? t("search_shopify_products", {
                            defaultValue: "Search Shopify products...",
                          })
                        : t("search_catalog_products", {
                            defaultValue: "Search catalog products...",
                          })
                    }
                    className="pl-9 h-9 border-slate-200 dark:border-(--card-border-color) bg-transparent rounded-lg"
                    value={
                      activeTab === "shopify" ? shopifySearch : catalogSearch
                    }
                    onChange={(e) =>
                      activeTab === "shopify"
                        ? setShopifySearch(e.target.value)
                        : setCatalogSearch(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Shopify Tab */}
              <TabsContent
                active={activeTab === "shopify"}
                className="flex-1 overflow-hidden flex flex-col mt-4 min-h-0"
              >
                {renderProductGrid(
                  shopifyData?.data?.products || [],
                  loadingShopify,
                  fetchingShopify,
                  shopifyPage,
                  shopifyData?.data?.pagination?.totalPages || 1,
                  setShopifyPage,
                )}
              </TabsContent>

              {/* Catalogs Tab */}
              <TabsContent
                active={activeTab === "catalog"}
                className="flex-1 overflow-hidden flex flex-col mt-4 min-h-0"
              >
                {loadingCatalogs ? (
                  <div className="flex items-center justify-center py-20 gap-2">
                    <Loader2 className="animate-spin text-primary" size={24} />
                    <span className="text-sm text-slate-500 font-medium">
                      {t("loading_catalogs", {
                        defaultValue: "Loading catalogs...",
                      })}
                    </span>
                  </div>
                ) : catalogs.length === 0 ? (
                  <div className="text-sm text-amber-500 font-medium bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-4 text-center">
                    {t("no_catalogs_linked", {
                      defaultValue:
                        "No catalogs linked to this WABA. Please link a catalog first.",
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col flex-1 overflow-hidden gap-4 min-h-0">
                    {/* Catalog Dropdown Selector */}
                    <div className="space-y-1.5 shrink-0">
                      <Label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {t("select_catalog", {
                          defaultValue: "Select Catalog",
                        })}
                      </Label>
                      <Select
                        value={selectedCatalogId}
                        onValueChange={(val) => {
                          setSelectedCatalogId(val);
                          setCatalogPage(1);
                        }}
                      >
                        <SelectTrigger className="h-10 bg-slate-50 dark:bg-slate-900 rounded-lg border-slate-200 dark:border-(--card-border-color)">
                          <SelectValue
                            placeholder={t("choose_catalog", {
                              defaultValue: "Choose a catalog...",
                            })}
                          />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg dark:bg-slate-950 border-slate-200 dark:border-(--card-border-color)">
                          {catalogs.map((cat: any) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              <div className="flex items-center gap-2">
                                <Store size={14} className="text-slate-400" />
                                <span className="font-semibold">
                                  {cat.name}
                                </span>
                                {cat.product_count !== undefined && (
                                  <span className="text-xs text-slate-400">
                                    ({cat.product_count}{" "}
                                    {t("products", {
                                      defaultValue: "products",
                                    })}
                                    )
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                      {renderProductGrid(
                        catalogProductsData?.data?.products || [],
                        loadingCatalogProducts,
                        fetchingCatalogProducts,
                        catalogPage,
                        catalogProductsData?.data?.pagination?.totalPages || 1,
                        setCatalogPage,
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
