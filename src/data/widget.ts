import { MessageCircle, Palette, Settings, Type } from "lucide-react";
import { WidgetData } from "../types/widget";

export const DEFAULTS: Partial<WidgetData> = {
  welcome_text: "Welcome to our support! \n\nThank you for reaching out to us on WhatsApp.",
  default_open_popup: false,
  default_user_message: "Hi, I need help !!",
  widget_position: "bottom-right",
  widget_color: "var(--primary)",
  header_text: "Chat with us",
  header_text_color: "#fff",
  header_background_color: "var(--primary)",
  body_background_color: "#f3ebe2ff",
  welcome_text_color: "#94a3b8",
  welcome_text_background: "#fff",
  start_chat_button_text: "Start Chat on WhatsApp",
  start_chat_button_background: "var(--primary)",
  start_chat_button_text_color: "#fff",
};

export const STEPS = [
  { id: "appearance", label: "Appearance", icon: Palette, description: "Widget button & position" },
  { id: "header", label: "Header", icon: Type, description: "Chat window header style" },
  { id: "body", label: "Body", icon: MessageCircle, description: "Welcome message & colors" },
  { id: "action", label: "Action", icon: Settings, description: "Chat button customization" },
];