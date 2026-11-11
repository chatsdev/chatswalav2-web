/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "@/src/types/formBuilder";
import { baseApi } from "./baseApi";

export const formBuilderApi = baseApi.enhanceEndpoints({ addTagTypes: ["Form", "MetaFlow"] }).injectEndpoints({
  endpoints: (builder) => ({
    getForms: builder.query<{ success: boolean; data: Form[]; pagination: any }, any>({
      query: (params) => ({
        url: "/whatsapp/form-builder",
        params,
      }),
      providesTags: (result) => (result ? [...result.data.map(({ _id }) => ({ type: "Form" as const, id: _id })), { type: "Form", id: "LIST" }] : [{ type: "Form", id: "LIST" }]),
    }),
    getFormById: builder.query<{ success: boolean; data: Form }, string>({
      query: (id) => `/whatsapp/form-builder/${id}`,
      providesTags: (result, error, id) => [{ type: "Form", id }],
    }),
    createForm: builder.mutation<{ success: boolean; data: Form }, Partial<Form>>({
      query: (body) => ({
        url: "/whatsapp/form-builder",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Form", id: "LIST" }],
    }),
    updateForm: builder.mutation<{ success: boolean; data: Form }, { id: string; body: Partial<Form> }>({
      query: ({ id, body }) => ({
        url: `/whatsapp/form-builder/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Form", id },
        { type: "Form", id: "LIST" },
      ],
    }),
    deleteForm: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/whatsapp/form-builder/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Form", id: "LIST" }],
    }),
    syncMetaFlow: builder.mutation<{ success: boolean; stats: any }, { waba_id: string; meta_flow_ids: string[] }>({
      query: (body) => ({
        url: "/whatsapp/form-builder/sync",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Form", id: "LIST" }],
    }),
    publishForm: builder.mutation<{ success: boolean; data: Form }, string>({
      query: (id) => ({
        url: `/whatsapp/form-builder/${id}/publish`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Form", id },
        { type: "Form", id: "LIST" },
      ],
    }),
    getAllMetaFlows: builder.query<{ success: boolean; data: any[] }, string>({
      query: (waba_id) => `/whatsapp/form-builder/meta-flows/${waba_id}`,
      providesTags: ["MetaFlow"],
    }),
    syncFlowsStatus: builder.mutation<{ success: boolean; message: string; stats: any }, { waba_id: string }>({
      query: (body) => ({
        url: "/whatsapp/form-builder/sync-status",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Form", id: "LIST" }],
    }),
    getFormTemplate: builder.query<{ success: boolean; templates: Record<string, any[]> }, void>({
      query: () => "/whatsapp/form-builder/template",
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetFormsQuery,
  useGetFormByIdQuery,  
  useCreateFormMutation,
  useUpdateFormMutation,
  useDeleteFormMutation,
  useSyncMetaFlowMutation,
  usePublishFormMutation,
  useGetAllMetaFlowsQuery,
  useSyncFlowsStatusMutation,
  useGetFormTemplateQuery,
} = formBuilderApi;
