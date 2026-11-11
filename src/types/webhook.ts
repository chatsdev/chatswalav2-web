/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { WABAConnection } from "./whatsapp";
import { Template, TemplateVariable } from "./components";

export interface WebhookStats {
  total_triggers: number;
  successful_sends: number;
  failed_sends: number;
  last_triggered_at: string | { $date: string };
}

export interface WebhookConfig {
  is_active: boolean;
  require_auth: boolean;
  secret_key?: string;
  verified_numbers_only?: boolean;
}

export interface MerchantNotification {
  is_enabled: boolean;
  template_id?: string | { $oid: string };
  field_mapping?: {
    variables?: Record<string, string>;
  };
  recipients?: string[];
}

export interface Webhook {
  id?: string;
  _id?: string | { $oid: string };
  webhook_name: string;
  webhook_url?: string;
  webhook_token?: string;
  method?: "GET" | "POST";
  platform?: string;
  template?: any;
  template_id?: string | { $oid: string };
  is_template_mapped?: boolean;
  field_mapping?: {
    phone_number_field?: string;
    variables?: Record<string, string>;
  };
  is_active: boolean;
  stats?: WebhookStats;
  first_payload?: any;
  first_payload_flattened?: Record<string, any>;
  created_at: string | { $date: string };
  updated_at?: string | { $date: string };
  config: WebhookConfig;
  merchant_notifications?: MerchantNotification;
}

export interface WebhookById {
  webhook: Webhook;
}

export interface WebhookListResponse {
  data?:{
    webhooks: Webhook[];
    total: number;
    pagination:any;
  }
}

export interface WebhookResponse {
  webhook: Webhook;
  success: boolean;
  message?: string;
}

export interface StepHeaderProps {
  step: number;
  router: AppRouterInstance;
  setStep: (step: number) => void;
  type?: "customer" | "owner";
}

export interface StepFooterProps {
  step: number;
  handleBack: () => void;
  handleNext: () => void;
  handleSave: () => Promise<void>;
  isMapping: boolean;
  canNext: boolean;
  canSave: boolean;
}

export interface TemplateSelectionStepProps {
  webhookData: WebhookById | undefined;
  connectionsData: { data: WABAConnection[] } | undefined;
  selectedWabaId: string;
  setSelectedWabaId: (id: string) => void;
  templatesData: { data: Template[] } | undefined;
  isTemplatesLoading: boolean;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  setVariableMappings: (mappings: Record<string, string>) => void;
}

export interface MappingStepProps {
  payloadFields: string[];
  phoneNumberField: string;
  setPhoneNumberField: (field: string) => void;
  variables: TemplateVariable[] | string[];
  variableMappings: Record<string, string>;
  setVariableMappings: (updater: (prev: Record<string, string>) => Record<string, string>) => void;
  template: Template | undefined;
  previewVariables: { key: string; example: string }[];
  type?: "customer" | "owner";
  isMerchantEnabled?: boolean;
  setIsMerchantEnabled?: (enabled: boolean) => void;
  merchantRecipients?: string[];
  setMerchantRecipients?: (recipients: string[]) => void;
}
export interface MapTemplateWizardProps {
  webhookId: string;
  initialData: WebhookById;
  connectionsData: { data: WABAConnection[] } | undefined;
}

export interface PayloadFieldSelectorProps {
  fields: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface WebhookPayloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  webhook?: Webhook;
}

export interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Webhook>) => void;
  webhook?: Webhook;
  isLoading?: boolean;
}

export interface WebhookCardProps {
  webhook: Webhook;
  onEdit: (webhook: Webhook) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  onViewPayload: (webhook: Webhook) => void;
  localStatus?: boolean;
}

export interface WebhookTableProps {
  data: Webhook[];
  isLoading: boolean;
  onEdit: (webhook: Webhook) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string, currentStatus: boolean) => void;
  onViewPayload: (webhook: Webhook) => void;
  onSortChange: (key: string, order: "asc" | "desc") => void;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  totalCount: number;
  localStatuses: Record<string, boolean>;
}
export interface WebhookLog {
  id?: string;
  _id?: string;
  webhook_id: string;
  user_id: string;
  log_type: "trigger" | "message";
  recipient_type?: "customer" | "owner";
  method?: "GET" | "POST";
  payload?: any;
  payload_flattened?: Record<string, any>;
  status: "success" | "failed";
  error_message?: string;
  phone_number?: string;
  template_name?: string;
  details?: any;
  created_at: string;
}

export interface WebhookLogsResponse {
  success: boolean;
  data: {
    logs: WebhookLog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}
