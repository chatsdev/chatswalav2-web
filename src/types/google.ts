export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface GoogleAccount {
  _id: string;
  email: string;
  status: "active" | "inactive";
  created_at: string;
}

export interface GoogleCalendar {
  _id: string;
  google_account_id: string;
  calendar_id: string;
  name: string;
  is_linked: boolean;
  created_at: string;
}

export interface GoogleEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  status?: string;
}

export interface GoogleConnectResponse {
  success: boolean;
  url: string;
}

export interface GoogleAccountsResponse {
  success: boolean;
  accounts: GoogleAccount[];
  pagination: Pagination;
}

export interface GoogleCalendarsResponse {
  success: boolean;
  calendars: GoogleCalendar[];
  pagination: Pagination;
}

export interface GoogleCalendarResponse {
  success: boolean;
  calendar: GoogleCalendar;
}

export interface GoogleEventsResponse {
  success: boolean;
  events: GoogleEvent[];
  pagination?: Pagination;
}

export interface GoogleEventResponse {
  success: boolean;
  event: GoogleEvent;
}

export interface GoogleGenericResponse {
  success: boolean;
  message: string;
}

export interface GoogleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface GoogleSheet {
  _id: string;
  google_account_id: string;
  sheet_id: string;
  name: string;
  is_linked?: boolean;
  created_at: string;
}

export interface GoogleSheetsResponse {
  success: boolean;
  sheets: GoogleSheet[];
  pagination?: Pagination;
}

export interface GoogleSheetDataResponse {
  success: boolean;
  values: string[][];
}

export interface GoogleSyncSheetsRequest {
  google_account_id: string;
  sheets?: { id: string; name: string }[];
}

export interface GoogleSyncSheetsResponse {
  success: boolean;
  mode: "list" | "sync";
  message?: string;
  sheets: { id: string; name: string }[] | GoogleSheet[];
}

export interface GoogleBulkDeleteRequest {
  ids: string[];
  delete_from: "google" | "platform";
}

export interface GoogleBulkDeleteResponse {
  success: boolean;
  message: string;
  results?: {
    success: string[];
    failed: { id: string; message: string }[];
  };
}

export interface AddCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (summary: string) => void;
  isLoading: boolean;
}

export interface AddSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (title: string) => void;
  isLoading: boolean;
}

export interface DeleteSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (deleteFrom: "google" | "platform") => void;
  isLoading: boolean;
  count: number;
}

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { summary: string; description?: string; start: string; end: string }) => void;
  isLoading: boolean;
  event?: GoogleEvent | null;
}


export interface GoogleCalendarEventListProps {
  calendarId: string;
}

export interface GoogleCalendarListProps {
  accountId: string;
}

export interface GoogleSheetListProps {
  paramsPromise: Promise<{ id: string }>;
}

export interface ReadSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetId: string;
}

export interface SyncSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
}

export interface WriteSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheetId: string;
  onConfirm: (values: string[][]) => void;
  isLoading: boolean;
}

export interface GoogleForm {
  _id: string;
  google_account_id: string;
  form_id: string;
  name: string;
  is_linked?: boolean;
  created_at: string;
}

export interface GoogleFormsResponse {
  success: boolean;
  forms: GoogleForm[];
  pagination?: Pagination;
}

export interface GoogleSyncFormsRequest {
  google_account_id: string;
  forms?: { id: string; name: string }[];
}

export interface GoogleSyncFormsResponse {
  success: boolean;
  mode: "list" | "sync";
  message?: string;
  forms: { id: string; name: string }[] | GoogleForm[];
}

export interface GoogleFormCreateField {
  title: string;
  type: "text" | "paragraph" | "multiple_choice" | "checkbox" | "dropdown" | "date" | "time" | "linear_scale" | "rating";
  required?: boolean;
  options?: string[];
  low?: number;
  high?: number;
  lowLabel?: string;
  highLabel?: string;
  ratingScaleLevel?: number;
  iconType?: "STAR" | "HEART" | "THUMB_UP";
}

export interface GoogleFormCreateRequest {
  title: string;
  description?: string;
  require_email?: boolean;
  fields: GoogleFormCreateField[];
}