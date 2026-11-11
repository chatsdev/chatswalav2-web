/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export const kanbanFunnelApi = baseApi.enhanceEndpoints({ addTagTypes: ["KanbanFunnel"] }).injectEndpoints({
  endpoints: (builder) => ({
    getFunnels: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append("page", params.page.toString());
        if (params.limit) queryParams.append("limit", params.limit.toString());
        if (params.search) queryParams.append("search", params.search);
        if (params.funnelType && params.funnelType !== "all") queryParams.append("funnelType", params.funnelType);
        if (params.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params.sort_order) queryParams.append("sort_order", params.sort_order);

        return `/kanban-funnels?${queryParams.toString()}`;
      },
      providesTags: ["KanbanFunnel"],
    }),
    getFunnelById: builder.query({
      query: (id) => `/kanban-funnels/${id}`,
      providesTags: (result, error, id) => [{ type: "KanbanFunnel", id }],
    }),
    createFunnel: builder.mutation({
      query: (data) => ({
        url: "/kanban-funnels",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["KanbanFunnel"],
    }),
    updateFunnel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/kanban-funnels/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["KanbanFunnel", { type: "KanbanFunnel", id }],
    }),
    deleteFunnel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/kanban-funnels/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["KanbanFunnel"],
    }),

    getAvailableData: builder.query<any, string>({
      query: (id) => `/kanban-funnels/${id}/available-data`,
      providesTags: (result, error, id) => [{ type: "KanbanFunnel", id }],
    }),

    getFunnelItems: builder.query<any, { id: string; search?: string; priority?: string }>({
      query: ({ id, ...params }) => ({
        url: `/kanban-funnels/${id}/items`,
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: "KanbanFunnel", id: `${id}_items` }],
    }),

    syncStages: builder.mutation<any, { id: string; stages: any[] }>({
      query: ({ id, stages }) => ({
        url: `/kanban-funnels/${id}/stages`,
        method: "PUT",
        body: { stages },
      }),
      invalidatesTags: (result, error, { id }) => ["KanbanFunnel", { type: "KanbanFunnel", id }, { type: "KanbanFunnel", id: `${id}_items` }],
    }),

    moveFunnelItem: builder.mutation<any, { id: string; itemId?: string; globalItemId?: string; toStageId: string; position: number }>({
      query: ({ id, ...body }) => ({
        url: `/kanban-funnels/${id}/items/move`,
        method: "POST",
        body,
      }),
      async onQueryStarted({ id, itemId, globalItemId, toStageId, position }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          kanbanFunnelApi.util.updateQueryData("getFunnelItems" as any, { id } as any, (draft: any) => {
            if (!draft?.data?.stages) return;

            let movedItem: any = null;

            if (itemId) {
              for (const stage of draft.data.stages) {
                const itemIndex = stage.items.findIndex((item: any) => item._id === itemId);
                if (itemIndex !== -1) {
                  [movedItem] = stage.items.splice(itemIndex, 1);
                  break;
                }
              }
            } else if (globalItemId) {
            }

            if (movedItem) {
              const targetStage = draft.data.stages.find((s: any) => s._id === toStageId);
              if (targetStage) {
                if (!targetStage.items) targetStage.items = [];
                targetStage.items.splice(position, 0, movedItem);
              }
            }
          })
        );

        let sidebarPatchResult: any = null;
        if (globalItemId) {
          sidebarPatchResult = dispatch(
            kanbanFunnelApi.util.updateQueryData("getAvailableData" as any, id as any, (draft: any) => {
              if (draft?.data?.available) {
                const itemIndex = draft.data.available.findIndex((item: any) => item._id === globalItemId);
                if (itemIndex !== -1) {
                  const [item] = draft.data.available.splice(itemIndex, 1);
                  dispatch(
                    kanbanFunnelApi.util.updateQueryData("getFunnelItems" as any, { id } as any, (itemsDraft: any) => {
                      if (!itemsDraft?.data?.stages) return;
                      const targetStage = itemsDraft.data.stages.find((s: any) => s._id === toStageId);
                      if (targetStage) {
                        if (!targetStage.items) targetStage.items = [];
                        targetStage.items.splice(position, 0, item);
                      }
                    })
                  );
                }
              }
              if (draft?.data?.archived) {
                const itemIndex = draft.data.archived.findIndex((item: any) => item._id === globalItemId);
                if (itemIndex !== -1) {
                  const [item] = draft.data.archived.splice(itemIndex, 1);
                  dispatch(
                    kanbanFunnelApi.util.updateQueryData("getFunnelItems" as any, { id } as any, (itemsDraft: any) => {
                      if (!itemsDraft?.data?.stages) return;
                      const targetStage = itemsDraft.data.stages.find((s: any) => s._id === toStageId);
                      if (targetStage) {
                        if (!targetStage.items) targetStage.items = [];
                        targetStage.items.splice(position, 0, item);
                      }
                    })
                  );
                }
              }
            })
          );
        }

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          if (sidebarPatchResult) sidebarPatchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "KanbanFunnel", id: `${id}_items` },
        { type: "KanbanFunnel", id },
      ],
    }),

    updateFunnelItem: builder.mutation<any, { id: string; itemId: string; priority?: string; isArchived?: boolean }>({
      query: ({ id, itemId, ...body }) => ({
        url: `/kanban-funnels/${id}/items/${itemId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "KanbanFunnel", id: `${id}_items` },
        { type: "KanbanFunnel", id },
      ],
    }),
    deleteFunnelItem: builder.mutation<void, { id: string; itemId: string }>({
      query: ({ id, itemId }) => ({
        url: `/kanban-funnels/${id}/items/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "KanbanFunnel", id: `${id}_items` },
        { type: "KanbanFunnel", id },
      ],
    }),
  }),
});

export const { useGetFunnelsQuery, useGetFunnelByIdQuery, useCreateFunnelMutation, useUpdateFunnelMutation, useDeleteFunnelMutation, useGetAvailableDataQuery, useGetFunnelItemsQuery, useSyncStagesMutation, useMoveFunnelItemMutation, useUpdateFunnelItemMutation, useDeleteFunnelItemMutation } = kanbanFunnelApi;
