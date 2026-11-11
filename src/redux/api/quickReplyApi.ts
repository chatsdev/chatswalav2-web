import { baseApi } from "./baseApi";

export interface QuickReply {
  _id: string;
  content: string;
  user_id: string | null;
  is_admin_reply: boolean;
  is_favorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuickRepliesResponse {
  success: boolean;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  data: QuickReply[];
}

export interface QuickReplyResponse {
  success: boolean;
  data: QuickReply;
}

export const quickReplyApi = baseApi
  .enhanceEndpoints({ addTagTypes: ["QuickReply"] })
  .injectEndpoints({
    endpoints: (builder) => ({
      getQuickReplies: builder.query<QuickRepliesResponse, { search?: string; page?: number; limit?: number; sort?: string; order?: string }>({
        query: (params) => {
          const qs = new URLSearchParams();
          if (params.search) qs.set("search", params.search);
          if (params.page) qs.set("page", String(params.page));
          if (params.limit) qs.set("limit", String(params.limit));
          if (params.sort) qs.set("sort", params.sort);
          if (params.order) qs.set("order", params.order);
          return `/quick-replies?${qs.toString()}`;
        },
        providesTags: ["QuickReply"],
      }),

      getAdminQuickReplies: builder.query<QuickRepliesResponse, { search?: string; page?: number; limit?: number }>({
        query: (params) => {
          const qs = new URLSearchParams();
          if (params.search) qs.set("search", params.search);
          if (params.page) qs.set("page", String(params.page));
          if (params.limit) qs.set("limit", String(params.limit));
          return `/quick-replies/admin?${qs.toString()}`;
        },
        providesTags: ["QuickReply"],
      }),

      createQuickReply: builder.mutation<QuickReplyResponse, { content: string; is_admin_reply?: boolean }>({
        query: (body) => ({
          url: "/quick-replies",
          method: "POST",
          body,
        }),
        invalidatesTags: ["QuickReply"],
      }),

      updateQuickReply: builder.mutation<QuickReplyResponse, { id: string; content: string }>({
        query: ({ id, ...body }) => ({
          url: `/quick-replies/${id}`,
          method: "PUT",
          body,
        }),
        invalidatesTags: ["QuickReply"],
      }),

      deleteQuickReply: builder.mutation<{ success: boolean; message: string }, string[]>({
        query: (ids) => ({
          url: "/quick-replies/delete",
          method: "DELETE",
          body: { ids },
        }),
        invalidatesTags: ["QuickReply"],
      }),

      toggleFavoriteQuickReply: builder.mutation<QuickReplyResponse, string>({
        query: (id) => ({
          url: `/quick-replies/${id}/favorite`,
          method: "POST",
        }),
        invalidatesTags: ["QuickReply"],
      }),
    }),
  });

export const {
  useGetQuickRepliesQuery,
  useGetAdminQuickRepliesQuery,
  useCreateQuickReplyMutation,
  useUpdateQuickReplyMutation,
  useDeleteQuickReplyMutation,
  useToggleFavoriteQuickReplyMutation,
} = quickReplyApi;
