import { baseApi } from "./baseApi";

export const socialMediaConnectionApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["SocialMediaConnections"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getSocialOAuthConfig: builder.query<any, string>({
        query: (platform) => ({
          url: `/social-connections/config/${platform}`,
          method: "GET",
        }),
      }),
      connectSocialAccount: builder.mutation<any, { platform: string; workspace_id: string; code: string; [key: string]: any }>({
        query: (body) => ({
          url: "/social-connections/connect",
          method: "POST",
          body,
        }),
        invalidatesTags: ["SocialMediaConnections"],
      }),
      getConnectedSocialAccounts: builder.query<any, { workspace_id: string; platform?: string }>({
        query: (params) => ({
          url: "/social-connections",
          method: "GET",
          params,
        }),
        providesTags: ["SocialMediaConnections"],
      }),
      disconnectSocialAccount: builder.mutation<any, string>({
        query: (id) => ({
          url: `/social-connections/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["SocialMediaConnections"],
      }),
    }),
  });

export const {
  useGetSocialOAuthConfigQuery,
  useLazyGetSocialOAuthConfigQuery,
  useConnectSocialAccountMutation,
  useGetConnectedSocialAccountsQuery,
  useDisconnectSocialAccountMutation,
} = socialMediaConnectionApi;
