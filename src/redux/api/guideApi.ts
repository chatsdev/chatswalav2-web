import { GuideResponse } from "@/src/types/guide";
import { baseApi } from "./baseApi";

export const guideApi = baseApi.enhanceEndpoints({ addTagTypes: ["Guides"] }).injectEndpoints({
  endpoints: (builder) => ({
    getPublicGuides: builder.query<GuideResponse, void>({
      query: () => "/guide/public",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      providesTags: ["Guides" as any],
    }),
  }),
});

export const { useGetPublicGuidesQuery } = guideApi;
