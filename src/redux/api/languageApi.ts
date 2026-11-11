import { baseApi } from "./baseApi";

export interface Language {
  _id: string;
  name: string;
  locale: string;
  flag?: string;
  is_rtl: boolean;
  is_active: boolean;
}

export interface GetLanguagesResponse {
  success: boolean;
  data: {
    languages: Language[];
    total: number;
  };
}

export interface GetLanguagesParams {
  status?: boolean;
}

export const languageApi = baseApi.enhanceEndpoints({ addTagTypes: ["Language"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAllLanguages: builder.query<GetLanguagesResponse, GetLanguagesParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.status !== undefined) {
          queryParams.append("is_active", params.status.toString());
        }
        return `/languages?${queryParams.toString()}`;
      },
      providesTags: [{ type: "Language", id: "LIST" }],
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getTranslations: builder.query<{ success: boolean; data: Record<string, any> }, string>({
      query: (locale) => `/languages/translations/${locale}`,
      providesTags: (_, __, locale) => [{ type: "Language", id: `TRANSLATIONS_${locale}` }],
    }),
  }),
});

export const { useGetAllLanguagesQuery, useLazyGetAllLanguagesQuery, useLazyGetTranslationsQuery } = languageApi;
