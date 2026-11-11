import { baseApi } from "./baseApi";
import type { ShopifyConfigPayload, ShopifyConfigResponse, ShopifyGenericResponse, ShopifyProductsResponse } from "@/src/types/shopify";

export const shopifyApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["ShopifyConfig", "ShopifyProducts"] })
  .injectEndpoints({
    endpoints: (builder) => ({

      getShopifyConfig: builder.query<ShopifyConfigResponse, void>({
        query: () => "/shopify/config",
        providesTags: ["ShopifyConfig"],
      }),

      saveShopifyConfig: builder.mutation<ShopifyConfigResponse, Partial<ShopifyConfigPayload>>({
        query: (body) => ({
          url: "/shopify/config",
          method: "POST",
          body,
        }),
        invalidatesTags: ["ShopifyConfig"],
      }),

      disconnectShopify: builder.mutation<ShopifyGenericResponse, void>({
        query: () => ({
          url: "/shopify/config",
          method: "DELETE",
        }),
        invalidatesTags: ["ShopifyConfig", "ShopifyProducts"],
      }),

      getShopifyProducts: builder.query<ShopifyProductsResponse, { page?: number; limit?: number; search?: string } | void>({
        query: (params) => {
          const { page = 1, limit = 10, search = "" } = params || {};
          return `/shopify/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
        },
        providesTags: ["ShopifyProducts"],
      }),

      pushProductsToWhatsapp: builder.mutation<ShopifyGenericResponse, { waba_id: string; product_ids: string[] }>({
        query: (body) => ({
          url: "/shopify/push-to-whatsapp",
          method: "POST",
          body,
        }),
      }),

      syncShopifyProducts: builder.mutation<ShopifyGenericResponse, void>({
        query: () => ({
          url: "/shopify/sync",
          method: "POST",
        }),
        invalidatesTags: ["ShopifyProducts"],
      }),

    }),
  });

export const {
  useGetShopifyConfigQuery,
  useSaveShopifyConfigMutation,
  useDisconnectShopifyMutation,
  useGetShopifyProductsQuery,
  usePushProductsToWhatsappMutation,
  useSyncShopifyProductsMutation,
} = shopifyApi;
