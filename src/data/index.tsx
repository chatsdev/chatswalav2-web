import { BarChart3, CircleDollarSign, Clock, CreditCard, FileText, Globe, MessageSquare, TrendingUp, Type, Wallet } from "lucide-react";

export const SUGGESTIONS = ["welcome", "pricing", "talk_to_rep", "support_query", "business_hours", "product_catalog", "payment_info", "technical_help", "demo_request"];

export const CAMPAIGNDATA = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

export const CHATFILTER = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "active", label: "Active" },
  { id: "assigned", label: "Assigned" },
  { id: "unassigned", label: "Unassigned" },
];

export const AUDIORECORDER = [1, 2, 3, 4, 5, 2, 4, 3, 1, 5, 2, 4, 3];

export const SUBSCRIPTIONINFO = ["unlimited_contacts", "priority_support", "ai_automation"];

export const FOOTEROPTIONS = ["Home", "Features", "Support", "Pricing", "Testimonials", "Faqs"];

export const FEATURESINFOLIST = ["Global Infrastructure", "Seamless Integration", "Enterprise Security"];

export const PRODUCTINFOLIST = ["Enterprise Trust", "Global Reach", "99.9% Uptime", "ISO Certified"];

export const CHATBOTTRAINLIST = [
  { id: "text", label: "General Text", icon: Type },
  { id: "q&a", label: "Q&A Pairs", icon: MessageSquare },
  { id: "website_url", label: "Website URL", icon: Globe },
  { id: "document", label: "Documents", icon: FileText },
];

export const PAYMENTMETHODLIST = [
  { id: "stripe", name: "Stripe", icon: CreditCard, description: "Card, Apple/Google Pay" },
  { id: "razorpay", name: "Razorpay", icon: Wallet, description: "UPI, Cards (India)" },
  { id: "paypal", name: "PayPal", icon: CircleDollarSign, description: "PayPal, Credit Card" },
  { id: "midtrans", name: "Midtrans", icon: CreditCard, description: "GoPay, Cards (Indo)" },
  { id: "pending", name: "Cash", icon: Clock, description: "Transfer/Invoice" },
];

export const PROTIPSSHORTLINK = ["Verify your number format to avoid redirection errors.", "Use clear call-to-actions (CTA) like 'Chat with Us' or 'Get Support'.", "Include your short link in social media bios for 40% more leads."];

export const PROTIPSSHORTCON = ["Use local number formats correctly", "Keep welcome messages short & clear", "Post link on Instagram & Facebook Bio"];

export const STEPCONNECTIVITYLIST = [
  { title: "Agent Side", desc: "Record assistant voice", path: "recording_config.enable_agent_recording" },
  { title: "User Side", desc: "Record caller voice", path: "recording_config.enable_user_recording" },
  { title: "Auto Logging", desc: "AI Transcription", path: "recording_config.enable_transcription" },
];

export const WIDGETINFOLIST = [
  { label: "CTA (Call to Action)", desc: "Use catchy text like 'Chat with Us' or 'Expert Support'." },
  { label: "Branding Assets", desc: "Upload your logo to build trust with your visitors." },
  { label: "Positioning", desc: "Place it where it doesn't block critical website elements." },
  { label: "Pre-filled Message", desc: "Help users start the conversation with a single tap." },
];
