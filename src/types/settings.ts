/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthPageSetup } from "./auth";
export interface SettingResponse {
  is_demo_mode: boolean;
  whatsapp_webhook_url: string;
  webhook_verification_token: string;
  facebook_lead_webhook_url: string;
  facebook_lead_webhook_verify_token: string;
  _id: string;

  app_id: string;
  app_secret: string;
  configuration_id: string;

  ig_app_id?: string;
  ig_app_secret?: string;

  app_name: string;
  app_description: string;
  app_email: string;
  support_email: string;

  favicon_url: string;
  logo_light_url: string;
  logo_dark_url: string;
  sidebar_logo_url: string;
  mobile_logo_url: string;
  landing_logo_url: string;
  favicon_notification_logo_url: string;
  onboarding_logo_url: string;
  sidebar_light_logo_url: string;
  sidebar_dark_logo_url: string;

  maintenance_mode: boolean;
  maintenance_title: string;
  maintenance_message: string;
  maintenance_image_url: string;
  maintenance_allowed_ips: string[];
  client_ip: string;

  page_404_title: string;
  page_404_content: string;
  page_404_image_url: string;

  no_internet_title: string;
  no_internet_content: string;
  no_internet_image_url: string;

  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;

  mail_from_name: string;
  mail_from_email: string;

  default_theme_mode: "light" | "dark";
  display_customizer: boolean;

  audio_calls_enabled: boolean;
  video_calls_enabled: boolean;
  allow_voice_message: boolean;
  allow_archive_chat: boolean;
  allow_media_send: boolean;
  allow_user_block: boolean;
  allow_user_signup: boolean;

  call_timeout_seconds: number;
  session_expiration_days: number;

  document_file_limit: number;
  audio_file_limit: number;
  video_file_limit: number;
  image_file_limit: number;
  multiple_file_share_limit: number;

  maximum_message_length: number;
  allowed_file_upload_types: string[];

  max_groups_per_user: number;
  max_group_members: number;

  created_at: string;
  updated_at: string;
  __v: number;
  landing_page_enabled: boolean;
  connection_method: string[];
  free_trial_enabled: boolean;
  otp_delivery_method: "email" | "whatsapp";
  is_banner?: boolean;
  banner_text?: string;
  banner_possion?: "left" | "center" | "right";
  banner_bg_color?: string;
  banner_text_color?: string;
  is_popup?: boolean;
  popup_image_url?: string;
  popup_title?: string;
  popup_description?: string;
  popup_bullets?: string[];
  popup_button_text?: string;
  popup_button_url?: string;
  cookie_enabled?: boolean;
  signup_agree_enable?: boolean;
  signup_agree_prefix?: string;
  signup_agree_link_text?: string;
  signup_agree_page?: any;
  widget_enabled?: boolean;
  widget_whatsapp_url?: string;
  widget_telegram_url?: string;
  widget_instagram_url?: string;
  widget_facebook_url?: string;
  widget_sms_url?: string;
  omnichannel_platforms?: string[];
  theme_primary_color?: string;
  theme_light_background_color?: string;
}

export interface UserSetting {
  success: boolean;
  data: AISettings;
}

export interface SettingState {
  setting: SettingResponse | null;
  userSetting: UserSetting | null;
  authPageSetup: AuthPageSetup | null;
  pageTitle: string;
  pageDescription: string;
  isSettingsLoaded: boolean;
  app_loader: string;
  cookie_enabled: boolean;
}

export interface AIModel {
  _id: string;
  display_name: string;
  description: string;
  icon?: string;
  provider: string;
  model_id: string;
  status: string;
  is_default: boolean;
}

export interface AISettings {
  ai_model: string | null;
  api_key: string | null;
  is_subscribed?: boolean;
  is_show_phone_no?: boolean;
  notification_tone?: string;
  notifications_enabled?: boolean;
  is_snooze_enabled?: boolean;
  snooze_time_minutes?: number;
  snooze_count_limit?: number;
  is_free_trial?: boolean;
  free_trial_days_remaining?: number;
  features?: {
    rest_api: boolean;
    [key: string]: any;
  };
  theme_color?: string;
  user_bubble_color?: string;
  contact_bubble_color?: string;
  bg_color?: string;
  bg_image?: string | null;
  user_text_color?: string;
  contact_text_color?: string;
  payment_success_message?: string;
  payment_failed_message?: string;
  payment_reminder_enabled?: boolean;
  payment_reminder_delay?: number;
  payment_reminder_unit?: "minutes" | "hours" | "days";
  payment_reminder_message?: string;
  disable_admin_quick_reply?: boolean;
  whatsapp_optout_keyword?: string[];
  whatsapp_optin_keyword?: string[];
  whatsapp_unsubscribe_message?: string;
  whatsapp_resubscribe_message?: string;
  catalog_payment_link_enabled?: boolean;
  catalog_payment_link_automatic?: boolean;
  catalog_payment_link_gateway?: string | null;
}

export interface AISettingsResponse {
  success: boolean;
  data: AISettings;
}

export interface AIModelsResponse {
  success: boolean;
  data: {
    models: AIModel[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}
