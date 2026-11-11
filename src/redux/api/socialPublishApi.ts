import { baseApi } from "./baseApi";

export const socialPublishApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["SocialPost"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      publishContent: builder.mutation<any, any>({
        query: (data) => ({
          url: "/social-publish/publish",
          method: "POST",
          body: data,
        }),
        invalidatesTags: ["SocialPost"],
      }),
      cancelScheduledPost: builder.mutation<any, string>({
        query: (historyId) => ({
          url: `/social-publish/cancel/${historyId}`,
          method: "POST",
        }),
        invalidatesTags: ["SocialPost"],
      }),
      getPostHistory: builder.query<any, any>({
        query: (params) => ({
          url: "/social-publish/history",
          method: "GET",
          params,
        }),
        providesTags: ["SocialPost"],
      }),
      getPostById: builder.query<any, string>({
        query: (historyId) => `/social-publish/history/${historyId}`,
        providesTags: (result, error, id) => [{ type: "SocialPost", id }],
      }),
      deletePost: builder.mutation<any, string>({
        query: (historyId) => ({
          url: `/social-publish/history/${historyId}`,
          method: "DELETE",
        }),
        invalidatesTags: ["SocialPost"],
      }),
      validateMedia: builder.mutation<any, { mediaUrl: string; platform: string; contentType?: string; contentTypes?: string[] }>({
        query: (data) => ({
          url: "/social-publish/validate-media",
          method: "POST",
          body: data,
        }),
      }),
      getSupportedPlatforms: builder.query<any, void>({
        query: () => "/social-publish/platforms",
      }),
      generateCaption: builder.mutation<any, any>({
        query: (data) => ({
          url: "/social-publish/generate-caption",
          method: "POST",
          body: data,
        }),
      }),
    }),
  });

export const {
  usePublishContentMutation,
  useCancelScheduledPostMutation,
  useGetPostHistoryQuery,
  useGetPostByIdQuery,
  useDeletePostMutation,
  useValidateMediaMutation,
  useGetSupportedPlatformsQuery,
  useGenerateCaptionMutation,
} = socialPublishApi;
