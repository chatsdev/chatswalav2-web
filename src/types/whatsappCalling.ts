/* eslint-disable @typescript-eslint/no-explicit-any */
export interface WhatsappCallAgent {
  _id: string;
  name: string;
  welcome_message: string;
  ai_config: {
    model_id: string;
    api_key: string;
    prompt: string;
    training_url?: string;
    include_concise_instruction: boolean;
  };
  voice_config: {
    stt_provider: string;
    tts_provider: string;
    api_key: string;
  };
  recording_config: {
    enable_agent_recording: boolean;
    enable_user_recording: boolean;
    enable_transcription: boolean;
  };
  hangup_config: {
    enabled: boolean;
    trigger_keywords: string[];
    farewell_message: string;
  };
  available_functions: CallAgentFunction[];
  is_active: boolean;
  contacts_ids?: string[];
  tags_ids?: string[];
  created_at: string;
  updated_at: string;
}

export interface CallAgentFunction {
  id: string;
  name: string;
  trigger_keywords: string[];
  api_config: {
    url: string;
    method: "GET" | "POST";
    headers: { key: string; value: string }[];
  };
  parameters: CallAgentParameter[];
}
export interface CallLog {
  _id: string;
  whatsapp_user_id: string;
  agent_id: string | any;
  call_sid: string;
  status: string;
  duration: number;
  recording_url?: string;
  transcription_url?: string;
  created_at: string;
  contact_id: { phone_number: string };
  call_type: string;
}

export interface CallAgentParameter {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface BulkAssignAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentId: string;
  agentName: string;
}

export interface CallAgentFormProps {
  agent?: WhatsappCallAgent;
  onSave: (values: any) => Promise<void>;
  isLoading: boolean;
}

export interface CallSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}