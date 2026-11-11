import { AIModelsResponse, AISettings, AISettingsResponse } from "@/src/types/settings";
import { baseApi } from "./baseApi";

export const settingsApi = baseApi.enhanceEndpoints({ addTagTypes: ["Settings"] }).injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query({
      query: (params) => ({
        url: "/setting",
        params,
      }),
    }),
    getUserSettings: builder.query<AISettingsResponse, void>({
      query: () => ({
        url: "/setup",
        method: "GET",
      }),
      providesTags: ["Settings"],
    }),
    getAllModels: builder.query<AIModelsResponse, void>({
      query: () => ({
        url: "/setup/models",
        method: "GET",
      }),
    }),
    updateUserSettings: builder.mutation<void, Partial<AISettings> | FormData>({
      query: (body) => ({
        url: "/setup",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),
    logCookieConsent: builder.mutation<
      void,
      {
        consent_id: string;
        consent_type: "accept" | "decline" | "preferences";
        preferences: any;
        user_agent: string;
      }
    >({
      query: (body) => ({
        url: "/setting/cookie-consent",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useGetUserSettingsQuery,
  useGetAllModelsQuery,
  useUpdateUserSettingsMutation,
  useLogCookieConsentMutation,
} = settingsApi;
