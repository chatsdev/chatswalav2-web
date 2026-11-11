import { Submission, SubmissionDetailsResponse } from "./submission";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FormField {
  id?: string;
  type: string;
  label: string;
  name: string;
  required?: boolean;
  options?: { label: string; value: string; id?: string }[];
  step?: number;
  order?: number;
  helper_text?: string;
  default_value?: any;
  meta?: any;
}

export interface Form {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  category: string;
  is_active: boolean;
  is_multi_step: boolean;
  enable_recaptcha?: boolean;
  submit_settings?: {
    success_message?: string;
    button_text?: string;
  };
  appearance?: {
    theme_color?: string;
  };
  contact_settings?: any;
  fields: FormField[];
  flow?: {
    flow_id?: string;
    meta_status?: string;
    sync_status?: string;
    template_name?: string;
    last_synced_at?: string;
    is_flow_enabled?: boolean;
  };
  status?: string;
  created_at: string;
  updated_at: string;
}

export interface EditFormPageProps {
  params: Promise<{
    id: string;
  }>;
}
 
export interface FieldListSidebarProps {
  onAddField: (field: any) => void;
}

export interface FormCanvasProps {
  fields: any[];
  allFields: any[];
  onSelectField: (id: string) => void;
  selectedFieldId: string | null;
  onDeleteField: (id: string) => void;
  onUpdateField: (updates: any) => void;
  onReorderFields: (fields: any[]) => void;
  isMultiStep?: boolean;
  activeStep: number;
  onStepChange: (step: number) => void;
  onAddStep: () => void;
  totalSteps: number;
}

export interface LivePreviewProps {
  fields: any[];
  allFields: any[];
  activeStep: number;
  isMultiStep: boolean;
  submitSettings: {
    button_text: string;
    success_message: string;
  };
  appearance: {
    theme_color: string;
    show_branding: boolean;
  };
  totalSteps: number;
}

export interface BasicSetupStepProps {
  mode?: "create" | "edit";
}

export interface SubmissionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SubmissionDetailsResponse["data"] | null;
  isLoading: boolean;
}

export interface SubmissionKanbanActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
}

export interface UpdateSubmissionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStatus: string;
  onConfirm: (status: string) => void;
  isLoading: boolean;
}

export interface FormBuilderWizardProps {
  mode: "create" | "edit";
  id?: string;
}

export interface FormCardProps {
  form: any;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
  onViewInfo?: (form: any) => void;
  isPublishing?: boolean;
  isDeleting?: boolean;
}

export interface SyncMetaFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  wabaId: string;
}