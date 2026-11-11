import { baseApi } from "./baseApi";
import { AppointmentConfig, AppointmentConfigResponse, AppointmentConfigsResponse, AppointmentQueryParams, AppointmentBookingsResponse, AppointmentBookingResponse } from "../../types/appointment";

export const appointmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listAppointmentConfigs: builder.query<AppointmentConfigsResponse, AppointmentQueryParams>({
      query: (params) => ({
        url: "/appointments/configs",
        params,
      }), 
      providesTags: ["AppointmentConfig"],
    }),
    getAppointmentConfig: builder.query<AppointmentConfigResponse, string>({
      query: (id) => `/appointments/configs/${id}`,
      providesTags: (result, error, id) => [{ type: "AppointmentConfig", id }],
    }),
    createAppointmentConfig: builder.mutation<AppointmentConfigResponse, Partial<AppointmentConfig>>({
      query: (body) => ({
        url: "/appointments/configs",
        method: "POST",
        body,
      }),
      invalidatesTags: ["AppointmentConfig"],
    }),
    updateAppointmentConfig: builder.mutation<AppointmentConfigResponse, { id: string } & Partial<AppointmentConfig>>({
      query: ({ id, ...body }) => ({
        url: `/appointments/configs/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "AppointmentConfig", id }, "AppointmentConfig"],
    }),
    deleteAppointmentConfig: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/appointments/configs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AppointmentConfig"],
    }),
    listBookings: builder.query<AppointmentBookingsResponse, { id: string } & AppointmentQueryParams>({
      query: ({ id, ...params }) => ({
        url: `/appointments/configs/${id}/bookings`,
        params,
      }),
      providesTags: ["AppointmentBooking"],
    }),
    getBookingDetails: builder.query<AppointmentBookingResponse, string>({
      query: (id) => `/appointments/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "AppointmentBooking", id }],
    }),
    updateBookingStatus: builder.mutation<AppointmentBookingResponse, { id: string; status: string; startTime?: string; endTime?: string }>({
      query: ({ id, status, startTime, endTime }) => ({
        url: `/appointments/bookings/${id}/status`,
        method: "PUT",
        body: { status, startTime, endTime },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "AppointmentBooking", id }, "AppointmentBooking"],
    }),
    sendPaymentLink: builder.mutation<{ success: boolean; message: string }, { id: string; gateway_config_id: string }>({
      query: ({ id, gateway_config_id }) => ({
        url: `/appointments/bookings/${id}/send-payment-link`,
        method: "POST",
        body: { gateway_config_id },
      }),
    }),
    bulkDeleteBookings: builder.mutation<{ success: boolean; message: string }, string[]>({
      query: (ids) => ({
        url: `/appointments/bookings/bulk-delete`,
        method: "DELETE",
        body: { ids },
      }),
      invalidatesTags: ["AppointmentBooking"],
    }),
  }),
});

export const {
  useListAppointmentConfigsQuery,
  useGetAppointmentConfigQuery,
  useCreateAppointmentConfigMutation,
  useUpdateAppointmentConfigMutation,
  useDeleteAppointmentConfigMutation,
  useListBookingsQuery,
  useGetBookingDetailsQuery,
  useUpdateBookingStatusMutation,
  useSendPaymentLinkMutation,
  useBulkDeleteBookingsMutation,
} = appointmentApi;
