import { ConnectionPayload, ConnectWhatsAppPayload, RegisterResponse, ConnectWhatsAppResponse } from "@/src/types/auth";
import { ConnectionsResponse } from "@/src/types/whatsapp";
import { baseApi } from "./baseApi";

export const whatsappApi = baseApi.enhanceEndpoints({ addTagTypes: ["Whatsapp", "WhatsappStatus", "WhatsappConnections", "Workspace"] }).injectEndpoints({
  endpoints: (builder) => ({
    connection: builder.mutation<RegisterResponse, ConnectionPayload>({
      query: (data) => ({
        url: "/whatsapp/embedded-signup/connection",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WhatsappStatus", "WhatsappConnections", { type: "Workspace", id: "LIST" }],
    }),
    connectWhatsApp: builder.mutation<ConnectWhatsAppResponse, ConnectWhatsAppPayload>({
      query: (data) => ({
        url: "/whatsapp/connect",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["WhatsappStatus", "WhatsappConnections", { type: "Workspace", id: "LIST" }],
    }),
    getStatus: builder.query({
      query: (params) => ({
        url: "/whatsapp/status",
        params,
      }),
      providesTags: ["WhatsappStatus"],
    }),
    getConnections: builder.query<ConnectionsResponse, { page?: number; limit?: number; search?: string; sort_by?: string; sort_order?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.sort_by) queryParams.append("sort_by", params.sort_by.toString());
        if (params?.sort_order) queryParams.append("sort_order", params.sort_order.toString());
        if (params?.search) queryParams.append("search", params.search);
        return {
          url: `/whatsapp/connections?${queryParams.toString()}`,
        };
      },
      providesTags: ["WhatsappConnections"],
    }),
    connectWhatsAppDelete: builder.mutation<{ success: boolean; message: string }, { ids: string[] }>({
      query: (body) => ({
        url: "/whatsapp/connections",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WhatsappConnections"],
    }),
    getWabaPhoneNumbers: builder.query({
      query: (wabaId: string) => ({
        url: `/whatsapp/${wabaId}`,
      }),
    }),
    getMyPhoneNumbers: builder.query({
      query: () => ({
        url: "/whatsapp/phone-numbers",
      }),
    }),
    getBaileysQRCode: builder.query<{ success: boolean; data?: { qr_code?: string; status?: string } }, string>({
      query: (wabaId) => ({
        url: `/whatsapp/baileys/qrcode/${wabaId}`,
      }),
      providesTags: ["WhatsappStatus"],
    }),
    disconnectWhatsApp: builder.mutation<{ success: boolean; message: string }, { provider: string; waba_id: string }>({
      query: (body) => ({
        url: "/whatsapp/disconnect",
        method: "POST",
        body,
      }),
      invalidatesTags: ["WhatsappStatus", "WhatsappConnections", "Workspace"],
    }),
    setPrimaryPhoneNumber: builder.mutation<{ success: boolean; message: string }, string>({
      query: (phoneNumberId) => ({
        url: `/whatsapp/phone-numbers/${phoneNumberId}/set-primary`,
        method: "PUT",
      }),
      invalidatesTags: ["WhatsappStatus", "WhatsappConnections", "Workspace"],
    }),
    getMessageLogs: builder.query<{ success: boolean; data: { logs: any[]; pagination: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } } }, { page?: number; limit?: number; search?: string; status?: string; timeFilter?: string; platform?: string; workspaceId?: string } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.timeFilter) queryParams.append("timeFilter", params.timeFilter);
        if (params?.platform) queryParams.append("platform", params.platform);
        return {
          url: `/whatsapp/logs?${queryParams.toString()}`,
        };
      },
      providesTags: ["Whatsapp"],
    }),
  }),
});

export const { 
  useConnectionMutation, 
  useConnectWhatsAppMutation, 
  useGetStatusQuery, 
  useGetConnectionsQuery, 
  useConnectWhatsAppDeleteMutation, 
  useGetWabaPhoneNumbersQuery, 
  useGetMyPhoneNumbersQuery, 
  useGetBaileysQRCodeQuery,
  useLazyGetBaileysQRCodeQuery,
  useDisconnectWhatsAppMutation,
  useSetPrimaryPhoneNumberMutation,
  useGetMessageLogsQuery
} = whatsappApi;
