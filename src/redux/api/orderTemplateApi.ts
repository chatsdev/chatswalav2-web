import { baseApi } from "./baseApi";
import type { StatusTemplate, StatusTemplatesResponse } from "@/src/types/order";

// Re-export for backward compatibility
export type { StatusTemplate, StatusTemplatesResponse };

export const orderTemplateApi = baseApi.enhanceEndpoints({ addTagTypes: ["StatusTemplate"] }).injectEndpoints({
  endpoints: (builder) => ({
    getStatusTemplates: builder.query<StatusTemplatesResponse, void>({
      query: () => "/orders/status-templates",
      providesTags: ["StatusTemplate"],
    }),
    upsertStatusTemplate: builder.mutation<
      { success: boolean; data: StatusTemplate },
      {
        status: string;
        message_template?: string;
        is_active: boolean;
        use_approved_template?: boolean;
        approved_template_id?: string | null;
        variable_mappings?: Record<string, string>;
      }
    >({
      query: ({ status, ...body }) => ({
        url: `/orders/status-templates/${status}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["StatusTemplate"],
    }),
  }),
});

export const { useGetStatusTemplatesQuery, useUpsertStatusTemplateMutation } = orderTemplateApi;
