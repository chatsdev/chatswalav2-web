import { baseApi } from "./baseApi";

export const socialAutomationApi = baseApi.enhanceEndpoints({ addTagTypes: ["SocialAutomation", "SocialMedia"] }).injectEndpoints({
  endpoints: (builder) => ({
    getSocialAutomations: builder.query({
      query: (params) => ({
        url: "/social-automation",
        params,
      }),
      providesTags: ["SocialAutomation"],
    }),
    getSocialAutomationById: builder.query({
      query: (id) => ({
        url: `/social-automation/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "SocialAutomation", id }],
    }),
    createSocialAutomation: builder.mutation({
      query: (body) => ({
        url: "/social-automation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SocialAutomation"],
    }),
    updateSocialAutomation: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/social-automation/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { id }) => ["SocialAutomation", { type: "SocialAutomation", id }],
    }),
    deleteSocialAutomation: builder.mutation({
      query: (id) => ({
        url: `/social-automation/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SocialAutomation"],
    }),
    fetchSocialMedia: builder.mutation({
      query: (body) => ({
        url: "/social-automation/media",
        method: "POST",
        body,
      }),
      invalidatesTags: ["SocialMedia"],
    }),
    retriggerComments: builder.mutation({
      query: (body) => ({
        url: "/social-automation/retrigger",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetSocialAutomationsQuery,
  useGetSocialAutomationByIdQuery,
  useCreateSocialAutomationMutation,
  useUpdateSocialAutomationMutation,
  useDeleteSocialAutomationMutation,
  useFetchSocialMediaMutation,
  useRetriggerCommentsMutation,
} = socialAutomationApi;
