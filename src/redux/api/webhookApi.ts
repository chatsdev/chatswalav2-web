/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";
import { Webhook, WebhookById, WebhookListResponse, WebhookResponse } from "../../types/webhook";

export const webhookApi = baseApi.enhanceEndpoints({ addTagTypes: ["Webhook"] }).injectEndpoints({
  endpoints: (builder) => ({
    listWebhooks: builder.query<WebhookListResponse, { search?: string; sort_by?: string; sort_order?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.search) qs.set("search", params.search);
        if (params?.sort_by) qs.set("sort_by", params.sort_by);
        if (params?.sort_order) qs.set("sort_order", params.sort_order);
        if (params?.page) qs.set("page", String(params.page));
        if (params?.limit) qs.set("limit", String(params.limit));
        const queryString = qs.toString();
        return `/webhooks/list${queryString ? `?${queryString}` : ""}`;
      },
      providesTags: ["Webhook"],
    }),
    getWebhook: builder.query<WebhookById, string>({
      query: (id) => `/webhooks/${id}`,
      providesTags: (result, error, id) => [{ type: "Webhook", id }],
    }),
    createWebhook: builder.mutation<Webhook, Partial<Webhook>>({
      query: (body) => ({
        url: "/webhooks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Webhook"],
    }),
    updateWebhook: builder.mutation<Webhook, { id: string; body: Partial<Webhook> }>({
      query: ({ id, body }) => ({
        url: `/webhooks/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["Webhook", { type: "Webhook", id }],
    }),
    deleteWebhook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/webhooks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Webhook"],
    }),
    toggleWebhook: builder.mutation<Webhook, string>({
      query: (id) => ({
        url: `/webhooks/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => ["Webhook", { type: "Webhook", id }],
    }),
    mapTemplate: builder.mutation<WebhookResponse, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/webhooks/${id}/map-template`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["Webhook", { type: "Webhook", id }],
    }),
    updateMerchantNotification: builder.mutation<WebhookResponse, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/webhooks/${id}/merchant-notifications`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["Webhook", { type: "Webhook", id }],
    }),
    getTriggerLogs: builder.query<any, { id: string; page?: number; limit?: number; search?: string }>({
      query: ({ id, ...params }) => ({
        url: `/webhooks/${id}/trigger-logs`,
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: "Webhook", id: `${id}-trigger-logs` }],
    }),
    getWebhookMessageLogs: builder.query<any, { id: string; page?: number; limit?: number; search?: string }>({
      query: ({ id, ...params }) => ({
        url: `/webhooks/${id}/message-logs`,
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: "Webhook", id: `${id}-message-logs` }],
    }),
  }),
});

export const { useListWebhooksQuery, useGetWebhookQuery, useCreateWebhookMutation, useUpdateWebhookMutation, useDeleteWebhookMutation, useToggleWebhookMutation, useMapTemplateMutation, useUpdateMerchantNotificationMutation, useGetTriggerLogsQuery, useGetWebhookMessageLogsQuery } = webhookApi;
