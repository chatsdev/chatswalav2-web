/* eslint-disable @typescript-eslint/no-explicit-any */

export type TrainingDataType = "text" | "q&a" | "website_url" | "document";

export interface ChatbotTrainingItem {
  question: string;
  answer: string;
  context?: string;
}

export interface Chatbot {
  _id: string;
  waba_id: string;
  name: string;
  ai_model: any; // Populated model object or ID
  api_key: string;
  business_name?: string;
  business_description?: string;
  training_data?: ChatbotTrainingItem[];
  raw_training_text?: string;
  system_prompt?: string;
  status: "active" | "inactive";
  tone?: "professional" | "casual" | "friendly" | "humorous" | "empathetic" | "direct";
  enable_human_handoff?: boolean;
  message_limit?: number;
  enable_google_meet?: boolean;
  handoff_keywords?: string[];
  handoff_message?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatbotCreatePayload {
  waba_id: string;
  name: string;
  ai_model: string;
  api_key: string;
  business_name?: string;
  business_description?: string;
  tone?: "professional" | "casual" | "friendly" | "humorous" | "empathetic" | "direct";
  enable_human_handoff?: boolean;
  message_limit?: number;
  enable_google_meet?: boolean;
  handoff_keywords?: string[];
  handoff_message?: string;
}

export interface ChatbotTrainPayload {
  business_name?: string;
  business_description?: string;
  training_data?: ChatbotTrainingItem[];
  raw_training_text?: string;
  knowledgeType?: TrainingDataType;
}

export interface ChatbotResponse {
  success: boolean;
  message?: string;
  data: Chatbot;
}

export interface ChatbotsResponse {
  success: boolean;
  data: Chatbot[];
}

