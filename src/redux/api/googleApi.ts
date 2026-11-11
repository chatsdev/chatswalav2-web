import { baseApi } from "./baseApi";
import { GoogleAccountsResponse, GoogleConnectResponse, GoogleGenericResponse, GoogleCalendarsResponse, GoogleCalendarResponse, GoogleQueryParams, GoogleEventsResponse, GoogleEventResponse, GoogleSheetsResponse, GoogleSheetDataResponse, GoogleSheet, GoogleSyncSheetsRequest, GoogleSyncSheetsResponse, GoogleBulkDeleteRequest, GoogleBulkDeleteResponse, GoogleForm, GoogleFormsResponse, GoogleSyncFormsRequest, GoogleSyncFormsResponse, GoogleFormCreateRequest } from "../../types/google";

export const googleApi = baseApi.enhanceEndpoints({ addTagTypes: ["GoogleAccounts", "GoogleCalendars", "GoogleEvents", "GoogleSheets", "GoogleSheetsData", "GoogleForms"] }).injectEndpoints({
  endpoints: (builder) => ({
    connectGoogle: builder.query<GoogleConnectResponse, void>({
      query: () => "/google/connect",
    }),
    listGoogleAccounts: builder.query<GoogleAccountsResponse, GoogleQueryParams | void>({
      query: (params) => ({
        url: "/google/accounts",
        params: params || {},
      }),
      providesTags: ["GoogleAccounts"],
    }),
    disconnectGoogleAccount: builder.mutation<GoogleGenericResponse, string>({
      query: (id) => ({
        url: `/google/accounts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GoogleAccounts"],
    }),
    fetchCalendars: builder.query<GoogleCalendarsResponse, { accountId: string } & GoogleQueryParams>({
      query: ({ accountId, ...params }) => ({
        url: `/google/accounts/${accountId}/calendars`,
        params,
      }),
      providesTags: ["GoogleCalendars"],
    }),
    createCalendar: builder.mutation<GoogleCalendarResponse, { accountId: string; summary: string }>({
      query: ({ accountId, summary }) => ({
        url: `/google/accounts/${accountId}/calendars`,
        method: "POST",
        body: { summary },
      }),
      invalidatesTags: ["GoogleCalendars"],
    }),
    linkCalendar: builder.mutation<GoogleCalendarResponse, { id: string; is_linked: boolean }>({
      query: ({ id, is_linked }) => ({
        url: `/google/calendars/${id}/link`,
        method: "PUT",
        body: { is_linked },
      }),
      invalidatesTags: ["GoogleCalendars"],
    }),
    deleteCalendar: builder.mutation<GoogleGenericResponse, string>({
      query: (id) => ({
        url: `/google/calendars/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GoogleCalendars"],
    }),
    // Event endpoints
    listEvents: builder.query<GoogleEventsResponse, { calendarId: string } & GoogleQueryParams>({
      query: ({ calendarId, ...params }) => ({
        url: `/google/calendars/${calendarId}/events`,
        params,
      }),
      providesTags: ["GoogleEvents"],
    }),
    createEvent: builder.mutation<GoogleEventResponse, { calendarId: string; summary: string; description?: string; start: string; end: string }>({
      query: ({ calendarId, ...body }) => ({
        url: `/google/calendars/${calendarId}/events`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["GoogleEvents"],
    }),
    updateEvent: builder.mutation<GoogleEventResponse, { calendarId: string; eventId: string; summary: string; description?: string; start: string; end: string }>({
      query: ({ calendarId, eventId, ...body }) => ({
        url: `/google/calendars/${calendarId}/events/${eventId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["GoogleEvents"],
    }),
    deleteEvent: builder.mutation<GoogleGenericResponse, { calendarId: string; eventId: string }>({
      query: ({ calendarId, eventId }) => ({
        url: `/google/calendars/${calendarId}/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GoogleEvents"],
    }),
    // Sheets endpoints
    listSheets: builder.query<GoogleSheetsResponse, { accountId: string } & GoogleQueryParams>({
      query: ({ accountId, ...params }) => ({
        url: `/google/accounts/${accountId}/sheets`,
        params,
      }),
      providesTags: ["GoogleSheets"],
    }),
    createSheet: builder.mutation<{ success: boolean; sheet: GoogleSheet }, { accountId: string; title: string }>({
      query: ({ accountId, title }) => ({
        url: `/google/accounts/${accountId}/sheets`,
        method: "POST",
        body: { title },
      }),
      invalidatesTags: ["GoogleSheets"],
    }),
    readSheet: builder.query<GoogleSheetDataResponse, { sheetId: string; range?: string }>({
      query: ({ sheetId, range }) => ({
        url: `/google/sheets/${sheetId}`,
        params: { range },
      }),
      providesTags: (result, error, arg) => [{ type: "GoogleSheetsData", id: arg.sheetId }],
    }),
    writeSheet: builder.mutation<GoogleGenericResponse, { sheetId: string; range?: string; values: string[][] }>({
      query: ({ sheetId, ...body }) => ({
        url: `/google/sheets/${sheetId}/values`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [{ type: "GoogleSheetsData", id: arg.sheetId }],
    }),
    syncSheets: builder.mutation<GoogleSyncSheetsResponse, GoogleSyncSheetsRequest>({
      query: (body) => ({
        url: "/google/sync",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GoogleSheets"],
    }),
    bulkDeleteSheets: builder.mutation<GoogleBulkDeleteResponse, GoogleBulkDeleteRequest>({
      query: (body) => ({
        url: "/google/sheets/bulk-delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GoogleSheets"],
    }),
    // Forms endpoints
    listForms: builder.query<GoogleFormsResponse, { accountId: string } & GoogleQueryParams>({
      query: ({ accountId, ...params }) => ({
        url: `/google/${accountId}/forms`,
        params,
      }),
      providesTags: ["GoogleForms"],
    }),
    createGoogleForm: builder.mutation<{ success: boolean; form: GoogleForm }, { accountId: string; body: GoogleFormCreateRequest }>({
      query: ({ accountId, body }) => ({
        url: `/google/accounts/${accountId}/forms`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["GoogleForms"],
    }),
    updateGoogleForm: builder.mutation<{ success: boolean; form: GoogleForm }, { formId: string; body: GoogleFormCreateRequest }>({
      query: ({ formId, body }) => ({
        url: `/google/forms/${formId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["GoogleForms"],
    }),
    readForm: builder.query<{ success: boolean; form: any; form_details?: any }, { formId: string }>({
      query: ({ formId }) => ({
        url: `/google/forms/${formId}`,
      }),
    }),
    readFormResponses: builder.query<{ success: boolean; data: { responses: any[]; pagination: any } }, { formId: string; page?: number; limit?: number; search?: string }>({
      query: ({ formId, ...params }) => ({
        url: `/google/${formId}/responses`,
        params,
      }),
    }),
    deleteForm: builder.mutation<GoogleGenericResponse, { id: string; deleteFrom: "google" | "platform" }>({
      query: ({ id, deleteFrom }) => ({
        url: `/google/forms/${id}`,
        method: "DELETE",
        params: { delete_from: deleteFrom },
      }),
      invalidatesTags: ["GoogleForms"],
    }),
    syncForms: builder.mutation<GoogleSyncFormsResponse, GoogleSyncFormsRequest>({
      query: (body) => ({
        url: "/google/forms/sync",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GoogleForms"],
    }),
    bulkDeleteForms: builder.mutation<GoogleGenericResponse, { ids: string[]; delete_from: "google" | "platform" }>({
      query: (body) => ({
        url: "/google/forms/bulk-delete",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GoogleForms"],
    }),
  }),
  overrideExisting: true,
});

export const { useLazyConnectGoogleQuery, useListGoogleAccountsQuery, useDisconnectGoogleAccountMutation, useFetchCalendarsQuery, useCreateCalendarMutation, useLinkCalendarMutation, useDeleteCalendarMutation, useListEventsQuery, useCreateEventMutation, useUpdateEventMutation, useDeleteEventMutation, useListSheetsQuery, useCreateSheetMutation, useReadSheetQuery, useWriteSheetMutation, useSyncSheetsMutation, useBulkDeleteSheetsMutation, useListFormsQuery, useCreateGoogleFormMutation, useUpdateGoogleFormMutation, useReadFormQuery, useLazyReadFormQuery, useReadFormResponsesQuery, useDeleteFormMutation, useSyncFormsMutation, useBulkDeleteFormsMutation } = googleApi;
