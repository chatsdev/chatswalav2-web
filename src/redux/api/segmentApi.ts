import { baseApi } from "./baseApi";

export const segmentApi = baseApi.enhanceEndpoints({ addTagTypes: ["Segment"] }).injectEndpoints({
  endpoints: (builder) => ({
    getSegments: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
        if (params?.sort_order) queryParams.append("sort_order", params.sort_order);
        return `/segments?${queryParams.toString()}`;
      },
      providesTags: ["Segment"],
    }),
    getSegmentById: builder.query({
      query: (id) => `/segments/${id}`,
      providesTags: (result, error, id) => [{ type: "Segment", id }],
    }),
    createSegment: builder.mutation({
      query: (data) => ({
        url: "/segments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Segment"],
    }),
    updateSegment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/segments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["Segment", { type: "Segment", id }],
    }),
    deleteSegment: builder.mutation({
      query: (id) => ({
        url: `/segments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Segment"],
    }),
    addContactsToSegment: builder.mutation({
      query: ({ segmentId, contactIds }) => ({
        url: `/segments/${segmentId}/contacts`,
        method: "POST",
        body: { contactIds },
      }),
      invalidatesTags: (result, error, { segmentId }) => ["Segment", { type: "Segment", id: segmentId }],
    }),
    removeContactsFromSegment: builder.mutation({
      query: ({ segmentId, contactIds }) => ({
        url: `/segments/${segmentId}/contacts`,
        method: "DELETE",
        body: { contactIds },
      }),
      invalidatesTags: (result, error, { segmentId }) => ["Segment", { type: "Segment", id: segmentId }],
    }),
    getSegmentContacts: builder.query({
      query: ({ segmentId, ...params }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        
        return `/segments/${segmentId}/contacts?${queryParams.toString()}`;
      },
      providesTags: (result, error, { segmentId }) => [{ type: "Segment", id: segmentId }],
    }),
    bulkDeleteSegments: builder.mutation({
      query: (segmentIds: string[]) => ({
        url: "/segments/delete",
        method: "DELETE",
        body: { segmentIds },
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Segment"],
    }),
    bulkAddContactsToSegments: builder.mutation({
      query: ({ contactIds, segmentIds }) => ({
        url: "/contacts/add-to-segments",
        method: "POST",
        body: { contactIds, segmentIds },
      }),
      invalidatesTags: ["Segment"],
    }),
  }),
});

export const {
  useGetSegmentsQuery,
  useGetSegmentByIdQuery,
  useCreateSegmentMutation,
  useUpdateSegmentMutation,
  useDeleteSegmentMutation,
  useAddContactsToSegmentMutation,
  useRemoveContactsFromSegmentMutation,
  useGetSegmentContactsQuery,
  useBulkDeleteSegmentsMutation,
  useBulkAddContactsToSegmentsMutation,
} = segmentApi;
