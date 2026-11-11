import { BrainCircuit, Facebook, Filter, Heart, Instagram, MessageCircle, Quote, Send, Zap } from "lucide-react";
import { ThemePreset } from "../types/chatTheme";

export const fieldTypesData = [
  { label: "Text String", value: "text" },
  { label: "Numeric Value", value: "number" },
  { label: "Date Selection", value: "date" },
  { label: "True / False", value: "boolean" },
  { label: "Dropdown Options", value: "select" },
  { label: "Long Text (Textarea)", value: "textarea" },
  { label: "Email Address", value: "email" },
  { label: "Phone Number", value: "phone" },
]; 

export const DEFAULT_THEMES: ThemePreset[] = [
  { id: 1, type: "light", name: "Classic WA", bg_color: "#E5DDD5", user_bubble: "#DCF8C6", contact_bubble: "var(--background)", theme_color: "#128C7E" },
  { id: 2, type: "light", name: "Soft Rose", bg_color: "#FFF5F7", user_bubble: "#FFE4E8", contact_bubble: "var(--background)", theme_color: "#E91E63" },
  { id: 3, type: "light", name: "Sky Blue", bg_color: "#F0F9FF", user_bubble: "#E0F2FE", contact_bubble: "var(--background)", theme_color: "#0EA5E9" },
  { id: 4, type: "light", name: "Mint Green", bg_color: "var(--feature-card-border)", user_bubble: "#DCFCE7", contact_bubble: "var(--background)", theme_color: "#22C55E" },
  { id: 5, type: "light", name: "Creamy Yellow", bg_color: "#FFFBEB", user_bubble: "#FEF3C7", contact_bubble: "var(--background)", theme_color: "#F59E0B" },
  { id: 6, type: "light", name: "Lavender Mist", bg_color: "#F5F3FF", user_bubble: "#EDE9FE", contact_bubble: "var(--background)", theme_color: "#8B5CF6" },
  { id: 7, type: "light", name: "Peach Sorbet", bg_color: "#FFF7ED", user_bubble: "#FFEDD5", contact_bubble: "var(--background)", theme_color: "#F97316" },
  { id: 8, type: "light", name: "Cool Grey", bg_color: "#F8FAFC", user_bubble: "var(--light-background)", contact_bubble: "var(--background)", theme_color: "#64748B" },
  { id: 9, type: "light", name: "Sage Garden", bg_color: "#F7FEE7", user_bubble: "#ECFCCB", contact_bubble: "var(--background)", theme_color: "#84CC16" },
  { id: 10, type: "light", name: "Vanilla Blush", bg_color: "#FEF2F2", user_bubble: "#FEE2E2", contact_bubble: "var(--background)", theme_color: "#EF4444" },
  { id: 11, type: "dark", name: "Dark WA", bg_color: "#0B141A", user_bubble: "#005C4B", contact_bubble: "#202C33", theme_color: "#00A884" },
  { id: 12, type: "dark", name: "Midnight Pitch", bg_color: "#020617", user_bubble: "#1E293B", contact_bubble: "#0F172A", theme_color: "#38BDF8" },
  { id: 13, type: "dark", name: "Deep Forest", bg_color: "#052E16", user_bubble: "#14532D", contact_bubble: "#064E3B", theme_color: "#10B981" },
  { id: 14, type: "dark", name: "Dark Garnet", bg_color: "#2D0A0A", user_bubble: "#450A0A", contact_bubble: "#1A0505", theme_color: "#F43F5E" },
  { id: 15, type: "dark", name: "Night Violet", bg_color: "#1E1B4B", user_bubble: "#312E81", contact_bubble: "#171717", theme_color: "#818CF8" },
  { id: 16, type: "dark", name: "Slate Carbon", bg_color: "#0F172A", user_bubble: "#334155", contact_bubble: "#1E293B", theme_color: "#94A3B8" },
  { id: 17, type: "dark", name: "Obsidian", bg_color: "#000000", user_bubble: "#18181B", contact_bubble: "#27272A", theme_color: "#FAFAFA" },
  { id: 18, type: "dark", name: "Coffee Husk", bg_color: "#1C1917", user_bubble: "#44403C", contact_bubble: "#292524", theme_color: "#D6D3D1" },
  { id: 19, type: "dark", name: "Deep Teal", bg_color: "#042F2E", user_bubble: "#134E4A", contact_bubble: "#0F172A", theme_color: "#2DD4BF" },
  { id: 20, type: "dark", name: "Royal Dark", bg_color: "#2E1065", user_bubble: "#4C1D95", contact_bubble: "#171717", theme_color: "#A855F7" },
];

export const CHANNELS = [
  { value: "all", label: "All Channels", icon: Filter, iconColor: "text-slate-400" },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle, iconColor: "text-[#25D366]" },
  { value: "telegram", label: "Telegram", icon: Send, iconColor: "text-[#229ED9]" },
  { value: "facebook", label: "Facebook", icon: Facebook, iconColor: "text-[#1877F2]" },
  { value: "instagram", label: "Instagram", icon: Instagram, iconColor: "text-[#E1306C]" },
];

export const REPLY_TONES = [
  { label: "Professional", value: "professional", icon: BrainCircuit, color: "blue", desc: "Formal and clear" },
  { label: "Friendly", value: "friendly", icon: MessageCircle, color: "emerald", desc: "Warm and inviting" },
  { label: "Casual", value: "casual", icon: Zap, color: "amber", desc: "Relaxed and direct" },
  { label: "Empathetic", value: "empathetic", icon: Heart, color: "rose", desc: "Understanding and kind" },
  { label: "Concise", value: "concise", icon: Quote, color: "slate", desc: "Short and sweet" },
];