/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const adminTemplateApi = baseApi.enhanceEndpoints({ addTagTypes: ["AdminTemplate"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAdminTemplates: builder.query<ApiResponse<any[]>, { search?: string; sector?: string; template_category?: string; platform?: string } | void>({
      query: (params) => ({
        url: "/admin-template",
        params: params || {},
      }),
      providesTags: ["AdminTemplate"],
    }),
    getAdminTemplateById: builder.query<ApiResponse<any>, string>({
      query: (id) => ({
        url: `/admin-template/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "AdminTemplate", id }],
    }),
  }),
});

export const { useGetAdminTemplatesQuery, useGetAdminTemplateByIdQuery, useLazyGetAdminTemplateByIdQuery } = adminTemplateApi;
