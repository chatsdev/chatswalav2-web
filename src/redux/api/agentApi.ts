import { AgentKanbanStatus } from "@/src/types/agent";
import { baseApi } from "./baseApi";

export const agentApi = baseApi.enhanceEndpoints({ addTagTypes: ["Agent"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAgentData: builder.query({
      query: (params) => ({
        url: "/agent",
        method: "GET",
        params,
      }),
      providesTags: ["Agent"],
    }),
    getAgentById: builder.query({
      query: (id) => ({
        url: `/agent/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Agent", id }],
    }),
    createAgent: builder.mutation({
      query: (data) => ({
        url: "/agent",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Agent"],
    }),
    updateAgent: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/agent/${id}/update`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Agent", { type: "Agent", id }],
    }),
    updateAgentStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/agent/${id}/update/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => ["Agent", { type: "Agent", id }],
    }),
    updatePhonenoStatus: builder.mutation({
      query: ({ id, is_phoneno_hide }) => ({
        url: `/agent/${id}/phone-no`,
        method: "PUT",
        body: { is_phoneno_hide },
      }),
      invalidatesTags: (result, error, { id }) => ["Agent", { type: "Agent", id }],
    }),
    deleteAgent: builder.mutation({
      query: (ids) => ({
        url: "/agent",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Agent"],
    }),
    getAgentFunnels: builder.query({
      query: () => "/agent/funnels",
    }),
    getAgentKanbanStatus: builder.query<{ success: boolean; data: AgentKanbanStatus[] }, string>({
      query: (id) => `/agent/${id}/funnel-status`,
    }),
    handleAgentKanbanAction: builder.mutation({
      query: (data) => ({
        url: "/agent/funnel/action",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetAgentDataQuery, useGetAgentByIdQuery, useCreateAgentMutation, useUpdateAgentMutation, useUpdateAgentStatusMutation, useUpdatePhonenoStatusMutation, useDeleteAgentMutation, useGetAgentFunnelsQuery, useGetAgentKanbanStatusQuery, useHandleAgentKanbanActionMutation } = agentApi;
