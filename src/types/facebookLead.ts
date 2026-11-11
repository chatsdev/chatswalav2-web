/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FacebookLeadForm {
  id: string;
  name: string;
  status: string;
  created_time: string;
}

export interface FieldMapping {
  fb_field_name: string;
  contact_field: string;
  custom_field_id?: string;
}

export interface ConnectedFacebookLeadForm {
  _id: string;
  form_id: string;
  form_name: string;
  page_id: string;
  webhook_subscribed: boolean;
  tag_ids?: any[];
  facebook_page_id?: { _id: string; page_name: string; page_id: string };
  is_active: boolean;
  created_at: string;
  sample_payload?: { name: string; values: string[] }[];
  field_mapping?: FieldMapping[];
  send_first_template?: boolean;
  template_id?: string;
  template_variable_mappings?: Record<string, string>;
}

export interface FacebookPage {
  _id: string;
  page_id: string;
  page_name: string;
  category: string;
  is_active: boolean;
}

export interface ConnectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (data: { form_name: string; tag_ids: string[] }) => void;
  form: FacebookLeadForm | null;
  isLoading: boolean;
}

export interface FacebookWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
}