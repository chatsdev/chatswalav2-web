import { baseApi } from "./baseApi";

export const campaignApi = baseApi.enhanceEndpoints({ addTagTypes: ["Campaign"] }).injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: (params) => ({
        url: "/campaigns",
        params,
      }),
      providesTags: ["Campaign"],
    }),
    getCampaignById: builder.query<any, string | { id: string; params?: any }>({
      query: (args) => {
        const id = typeof args === "string" ? args : args.id;
        const params = typeof args === "string" ? undefined : args.params;
        return {
          url: `/campaigns/${id}`,
          params,
        };
      },
      providesTags: (result, error, args) => {
        const id = typeof args === "string" ? args : args.id;
        return [{ type: "Campaign", id }];
      },
    }),
    createCampaign: builder.mutation({
      query: (data) => ({
        url: "/campaigns",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Campaign"],
    }),
    updateCampaign: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/campaigns/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Campaign", { type: "Campaign", id }],
    }),
    deleteCampaign: builder.mutation({
      query: (ids) => ({
        url: "/campaigns/bulk-delete",
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["Campaign"],
    }),
    deleteCampaignById: builder.mutation({
      query: (id) => ({
        url: `/campaigns/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Campaign"],
    }),
    togglePauseCampaign: builder.mutation({
      query: (id) => ({
        url: `/campaigns/${id}/toggle-pause`,
        method: "POST",
      }),
      invalidatesTags: ["Campaign"],
    }),
    resendCampaign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/campaigns/${id}/resend`,
        method: "POST",
        body: Object.keys(body).length ? body : { is_scheduled: false },
      }),
      invalidatesTags: ["Campaign"],
    }),
    publishCampaign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/campaigns/${id}/publish`,
        method: "POST",
        body
      }),
      invalidatesTags: (result, error, id) => ["Campaign", { type: "Campaign", id }],
    }),
    setupRecurringCampaign: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/campaigns/${id}/setup-recurring`,
        method: "POST",
        body
      }),
      invalidatesTags: (result, error, { id }) => ["Campaign", { type: "Campaign", id }],
    }),
    getCampaignInsights: builder.query({
      query: (id) => ({
        url: `/campaigns/${id}/insights`,
      }),
      providesTags: (result, error, id) => [{ type: "Campaign", id }],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useLazyGetCampaignByIdQuery,
  useCreateCampaignMutation,
  useUpdateCampaignMutation,
  useDeleteCampaignMutation,
  useDeleteCampaignByIdMutation,
  useTogglePauseCampaignMutation,
  useResendCampaignMutation,
  usePublishCampaignMutation,
  useSetupRecurringCampaignMutation,
  useGetCampaignInsightsQuery,
} = campaignApi;
