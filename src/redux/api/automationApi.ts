import { baseApi } from "./baseApi";

export const automationApi = baseApi.enhanceEndpoints({ addTagTypes: ["AutomationFlow"] }).injectEndpoints({
  endpoints: (builder) => ({
    getAutomationFlows: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
        if (params?.workspace_id) queryParams.append("workspace_id", params.workspace_id);
        if (params?.status) queryParams.append("status", params.status);
        if (params?.platform) queryParams.append("platform", params.platform);
        return {
          url: `/automation?${queryParams.toString()}`,
        };
      },
      providesTags: ["AutomationFlow"],
    }),
    getAutomationFlow: builder.query({
      query: (arg) => {
        const flowId = typeof arg === "string" ? arg : arg?.flowId;
        const workspace_id = typeof arg === "object" ? arg?.workspace_id : undefined;
        const queryParams = new URLSearchParams();
        if (workspace_id) queryParams.append("workspace_id", workspace_id);
        const qStr = queryParams.toString();
        return `/automation/${flowId}${qStr ? `?${qStr}` : ""}`;
      },
      providesTags: (result, error, arg) => {
        const flowId = typeof arg === "string" ? arg : arg?.flowId;
        return [{ type: "AutomationFlow", id: flowId }];
      },
    }),
    createAutomationFlow: builder.mutation({
      query: (body) => ({
        url: "/automation",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AutomationFlow"],
    }),
    updateAutomationFlow: builder.mutation({
      query: ({ flowId, ...body }) => ({
        url: `/automation/${flowId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { flowId }) => [
        { type: "AutomationFlow", id: flowId },
        "AutomationFlow",
      ],
    }),
    deleteAutomationFlow: builder.mutation({
      query: (arg) => {
        const ids = Array.isArray(arg) ? arg : typeof arg === "object" ? arg.ids : [arg];
        const workspace_id = typeof arg === "object" ? arg.workspace_id : undefined;
        const queryParams = new URLSearchParams();
        if (workspace_id) queryParams.append("workspace_id", workspace_id);
        const qStr = queryParams.toString();
        return {
          url: `/automation/${Array.isArray(ids) ? ids.join(",") : ids}${qStr ? `?${qStr}` : ""}`,
          method: "DELETE",
          body: { ids: Array.isArray(ids) ? ids : [ids] },
        };
      },
      invalidatesTags: ["AutomationFlow"],
    }),
    toggleAutomationFlow: builder.mutation({
      query: ({ flowId, is_active, workspace_id }) => {
        const queryParams = new URLSearchParams();
        if (workspace_id) queryParams.append("workspace_id", workspace_id);
        const qStr = queryParams.toString();
        return {
          url: `/automation/${flowId}/toggle${qStr ? `?${qStr}` : ""}`,
          method: "PATCH",
          body: { is_active },
        };
      },
      invalidatesTags: (result, error, { flowId }) => [
        { type: "AutomationFlow", id: flowId },
        "AutomationFlow",
      ],
    }),
    togglePauseAutomationFlow: builder.mutation({
      query: ({ flowId, is_paused, workspace_id }) => {
        const queryParams = new URLSearchParams();
        if (workspace_id) queryParams.append("workspace_id", workspace_id);
        const qStr = queryParams.toString();
        return {
          url: `/automation/${flowId}/toggle-pause${qStr ? `?${qStr}` : ""}`,
          method: "PATCH",
          body: { is_paused },
        };
      },
      invalidatesTags: (result, error, { flowId }) => [
        { type: "AutomationFlow", id: flowId },
        "AutomationFlow",
      ],
    }),
    testAutomationFlow: builder.mutation({
      query: ({ flowId, test_data, unsaved_flow, workspace_id }) => {
        const queryParams = new URLSearchParams();
        if (workspace_id) queryParams.append("workspace_id", workspace_id);
        const qStr = queryParams.toString();
        return {
          url: `/automation/${flowId}/test${qStr ? `?${qStr}` : ""}`,
          method: "POST",
          body: { test_data, unsaved_flow },
        };
      },
    }),
    suggestAutomationFlow: builder.mutation({
      query: (body) => ({
        url: "/automation/suggest",
        method: "POST",
        body,
      }),
    }),
    cloneAutomationFlow: builder.mutation({
      query: ({ flowId, workspace_id }) => {
        const queryParams = new URLSearchParams();
        if (workspace_id) queryParams.append("workspace_id", workspace_id);
        const qStr = queryParams.toString();
        return {
          url: `/automation/${flowId}/clone${qStr ? `?${qStr}` : ""}`,
          method: "POST",
        };
      },
      invalidatesTags: ["AutomationFlow"],
    }),
  }),
});

export const {
  useGetAutomationFlowsQuery,
  useGetAutomationFlowQuery,
  useLazyGetAutomationFlowQuery,
  useCreateAutomationFlowMutation,
  useUpdateAutomationFlowMutation,
  useDeleteAutomationFlowMutation,
  useToggleAutomationFlowMutation,
  useTogglePauseAutomationFlowMutation,
  useTestAutomationFlowMutation,
  useSuggestAutomationFlowMutation,
  useCloneAutomationFlowMutation,
} = automationApi;
