import { ConnectedChannel } from "@/src/types/components";
import { baseApi } from "./baseApi";

export const channelsApi = baseApi.enhanceEndpoints({ addTagTypes: ["ConnectedChannel"] }).injectEndpoints({
  endpoints: (builder) => ({
    getConnectedChannels: builder.query<{ success: boolean; data: ConnectedChannel[]; connections: ConnectedChannel[] }, { workspace_id: string; platform?: string }>({
      query: (params) => ({
        url: "channels",
        params,
      }),
      providesTags: ["ConnectedChannel"],
    }),
    connectChannel: builder.mutation<any, {
      platform: string;
      workspace_id: string;
      bot_token?: string;
      access_token?: string;
      access_token_secret?: string;
      bearer_token?: string;
      code?: string;
      code_verifier?: string;
      redirect_uri?: string;
      client_id?: string;
      client_secret?: string;
      facebook?: any;
      instagram?: any;
      twitter?: any;
    }>({
      query: (body) => ({
        url: "channels/connect",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ConnectedChannel"],
    }),
    disconnectChannel: builder.mutation<any, string>({
      query: (id) => ({
        url: `channels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ConnectedChannel"],
    }),
    // Fetches clientId, redirectUri, scope from admin Settings
    getTwitterConfig: builder.query<any, void>({
      query: () => ({
        url: "channels/twitter/config",
      }),
    }),
  }),
});

export const {
  useGetConnectedChannelsQuery,
  useConnectChannelMutation,
  useDisconnectChannelMutation,
  useLazyGetTwitterConfigQuery,
} = channelsApi;
