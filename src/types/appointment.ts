import { Template } from "./components";
import { GoogleAccount, GoogleCalendar, GoogleSheet, GoogleAccountsResponse, GoogleCalendarsResponse, GoogleSheetsResponse } from "./google";
import { PaymentGateway, PaymentGatewaysResponse } from "./paymentGateway";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type AppointmentDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface AppointmentInterval {
  from: string;
  to: string;
}

export interface AppointmentSlot {
  day: AppointmentDay;
  is_enabled: boolean;
  intervals: AppointmentInterval[];
}

export interface AppointmentQuestion {
  id: string;
  label: string;
  type: "text" | "number" | "email" | "phone" | "dropdown" | "date" | "time";
  required: boolean;
  options?: string[];
}

export interface AppointmentConfig {
  _id: string;
  user_id: string;
  name: string;
  description: string;
  location: string;
  timezone: string;
  duration_minutes: number;
  max_daily_appointments: number;
  break_between_appointments_minutes: number;
  max_advance_booking_days: number;
  reminder_hours: number;
  allow_overlap: boolean;
  send_confirmation_message: boolean;
  status: "active" | "inactive";
  waba_id: string;

  success_template_id: string;
  confirm_template_id: string;
  cancel_template_id: string;
  reminder_template_id: string;
  reschedule_template_id: string;

  variable_mappings: {
    [key: string]: {
      [key: string]: string;
    };
  };

  appointment_fees: number;
  pre_paid_fees: number;
  tax_percentage: number;
  total_appointment_fees: number;
  currency: string;
  payment_gateway_id: string;
  accept_partial_payment: boolean;
  partial_payment_amount: number;
  send_payment_link_automatically: boolean;
  payment_link_template_id: string;
  payment_link_variable_mappings: {
    [key: string]: string;
  };

  create_google_meet: boolean;
  google_account_id: string;
  calendar_id: string;
  sheet_id: string;
  sheet_name: string;

  slots: AppointmentSlot[];
  intro_message: string;
  series_of_questions: AppointmentQuestion[];

  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AppointmentConfigsResponse {
  success: boolean;
  data: {
    configs: AppointmentConfig[];
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      limit: number;
    };
  };
}

export interface AppointmentConfigResponse {
  success: boolean;
  message: string;
  config: AppointmentConfig;
}

export interface AppointmentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  waba_id?: string;
}
export interface AppointmentBooking {
  _id: string;
  config_id: string | AppointmentConfig;
  contact_id: any;
  user_id: string;
  start_time: string;
  end_time: string;
  answers: { [key: string]: string };
  google_event_id?: string;
  google_meet_link?: string;
  sheet_row?: number;
  status: "pending" | "confirmed" | "canceled" | "rescheduled" | "booked";
  cancel_reason?: string;
  reminder_sent: boolean;
  payment_status: "unpaid" | "paid" | "partially_paid";
  payment_link?: string;
  payment_transaction_id?: string;
  amount_due: number;
  amount_paid: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AppointmentBookingsResponse {
  success: boolean;
  bookings: AppointmentBooking[];
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}

export interface AppointmentBookingResponse {
  success: boolean;
  booking: AppointmentBooking;
}

export interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
}


export interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: AppointmentBooking | null;
}

export interface SendPaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: AppointmentBooking | null;
}

export interface AvailabilityStepProps {
  formData: Partial<AppointmentConfig>;
  errors?: Record<string, string>;
  toggleDay: (dayIndex: number) => void;
  addInterval: (dayIndex: number) => void;
  removeInterval: (dayIndex: number, intervalIndex: number) => void;
  updateInterval: (dayIndex: number, intervalIndex: number, field: "from" | "to", value: string) => void;
}

export interface FinancialsStepProps {
  formData: Partial<AppointmentConfig>;
  errors: Record<string, string>;
  gatewaysData: PaymentGatewaysResponse | undefined;
  isLoadingGateways: boolean;
  templatesData: { success: boolean; data: Template[] } | undefined;
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleMappingChange: (
    templateType: string,
    variable: string,
    value: string,
  ) => void;
  handleCouponChange: (templateType: string, value: string) => void;
  handleExpirationChange: (templateType: string, value: string) => void;
  mappingOptions: { label: string; value: string }[];
}

export interface GeneralInfoStepProps {
  formData: Partial<AppointmentConfig>;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export interface IntegrationsStepProps {
  formData: Partial<AppointmentConfig>;
  googleAccountsData: GoogleAccountsResponse | undefined;
  calendarsData: GoogleCalendarsResponse | undefined;
  sheetsData: GoogleSheetsResponse | undefined;
  isLoadingAccounts: boolean;
  isLoadingCalendars: boolean;
  isLoadingSheets: boolean;
  errors: Record<string, string>;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
}

export interface QuestionnaireStepProps {
  formData: Partial<AppointmentConfig>;
  errors: Record<string, string>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  updateQuestion: (index: number, field: keyof AppointmentQuestion, value: any) => void;
  addQuestionOption: (qIndex: number) => void;
  updateQuestionOption: (qIndex: number, oIndex: number, value: string) => void;
  removeQuestionOption: (qIndex: number, oIndex: number) => void;
}

export interface TemplatesStepProps {
  formData: Partial<AppointmentConfig>;
  errors: Record<string, string>;
  templatesData: { success: boolean; data: Template[] } | undefined;
  handleSelectChange: (name: string, value: string) => void;
  handleSwitchChange: (name: string, checked: boolean) => void;
  handleMappingChange: (templateType: string, variable: string, value: string) => void;
  handleCouponChange: (templateType: string, value: string) => void;
  handleExpirationChange: (templateType: string, value: string) => void;
  mappingOptions: { label: string; value: string }[];
}

export interface AppointmentTemplateMapperProps {
  template: Template;
  variablesMapping: Record<string, string>;
  onVariableChange: (variable: string, value: string) => void;
  mappingOptions: { label: string; value: string }[];
  mediaUrl?: string;
  onMediaUrlChange?: (url: string) => void;
  couponCode?: string;
  onCouponCodeChange?: (code: string) => void;
  expirationMinutes?: string | number;
  onExpirationChange?: (mins: string) => void;
  errors?: Record<string, string>;
  fieldKey?: string;
}