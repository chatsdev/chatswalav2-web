import { BookOpen,  CircleDollarSign,  Clock,  FileCheck2,  FileText, FileX2, Gift, ImageIcon,  Layout, LayoutGrid, MapPin, MessageSquare, Phone, Send, Shapes, Shield, ShoppingBag, Stethoscope, Tag, Ticket, Video, Watch } from "lucide-react";
import { MarketingTypeOption, OTPType } from "../types/components/template";

export const LANGUAGES = [
  { label: "English (US)", value: "en_US" },
  { label: "English (UK)", value: "en_GB" },
  { label: "Hindi", value: "hi" },
  { label: "Gujarati", value: "gu" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Italian", value: "it" },
  { label: "Portuguese (Brazil)", value: "pt_BR" },
  { label: "Portuguese (Portugal)", value: "pt_PT" },
  { label: "Arabic", value: "ar" },
  { label: "Bengali", value: "bn" },
  { label: "Marathi", value: "mr" },
  { label: "Telugu", value: "te" },
  { label: "Tamil", value: "ta" },
  { label: "Urdu", value: "ur" },
  { label: "Japanese", value: "ja" },
  { label: "Chinese", value: "zh_CN" },
  { label: "Hebrew", value: "he" },
];

export const CATEGORIES = [
  { label: "Utility", value: "UTILITY", icon: <MessageSquare size={18} /> },
  { label: "Marketing", value: "MARKETING", icon: <Layout size={18} /> },
  { label: "Authentication", value: "AUTHENTICATION", icon: <Shield size={18} /> },
];

export const TEMPLATE_TYPES = [
  { label: "Image", value: "image", icon: <ImageIcon size={20} /> },
  { label: "Video", value: "video", icon: <Video size={20} /> },
  { label: "Document", value: "document", icon: <FileText size={20} /> },
  { label: "Location", value: "location", icon: <MapPin size={20} /> },
];

export const INTERACTIVE_ACTIONS = [
  { label: "None", value: "none" },
  { label: "Call to Action", value: "cta" },
  { label: "Quick Replies", value: "quick_reply" },
  { label: "All", value: "all" },
];
 
export const OTP_TYPES: { label: string; value: OTPType; description: string }[] = [
  { label: "Copy Code", value: "COPY_CODE", description: "User copies the OTP manually" },
  { label: "One-Tap", value: "ONE_TAP", description: "Android auto-fills the code" },
  { label: "Zero-Tap", value: "ZERO_TAP", description: "Automatic no-tap autofill" },
];

export const MARKETING_TYPES: MarketingTypeOption[] = [
  { label: "Standard", value: "none", icon: <Tag size={16} />, description: "Regular marketing message" },
  { label: "Limited Time Offer", value: "limited_time_offer", icon: <Gift size={16} />, description: "With expiration timer" },
  { label: "Coupon Code", value: "coupon_code", icon: <Ticket size={16} />, description: "Include a copy-able code" },
  { label: "Catalog", value: "catalog", icon: <BookOpen size={16} />, description: "Link your product catalog" },
  { label: "Call Permission", value: "call_permission", icon: <Phone size={16} />, description: "Request phone call opt-in" },
  { label: "Carousel Product", value: "carousel_product", icon: <ShoppingBag size={16} />, description: "Horizontal product cards" },
  { label: "Carousel Media", value: "carousel_media", icon: <ImageIcon size={16} />, description: "Horizontal image cards" },
];

const FacebookIcon = () => (
  <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-6 h-6 text-[#E1306C]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export const templateChannels = [
    {
      id: "whatsapp",
      title: "WhatsApp Templates",
      description: "Design and manage rich WhatsApp message templates for marketing campaigns, utility notifications, and customer engagement.",
      icon: <MessageSquare className="w-6 h-6 text-primary dark:text-primary" />,
      colorClass: "hover:border-primary/50 hover:shadow-primary/8 bg-gradient-to-br from-emerald-500/5 via-white to-white dark:from-slate-900 dark:via-(--card-color) dark:to-(--card-color)",
      iconBgColor: "rgba(16, 185, 129, 0.1)",
      iconBorderColor: "rgba(16, 185, 129, 0.2)",
      btnColor: "var(--primary)",
    },
    {
      id: "telegram",
      title: "Telegram Templates",
      description: "Create and organize automated Telegram bot messaging templates to broadcast support, alerts, and marketing workflows.",
      icon: <Send className="w-6 h-6 text-[#229ED9]" />,
      colorClass: "hover:border-[#229ED9]/50 hover:shadow-[#229ED9]/8 bg-gradient-to-br from-[#229ED9]/5 via-white to-white dark:from-slate-900 dark:via-(--card-color) dark:to-(--card-color)",
      iconBgColor: "rgba(34, 158, 217, 0.1)",
      iconBorderColor: "rgba(34, 158, 217, 0.2)",
      btnColor: "#229ED9",
    },
    {
      id: "facebook",
      title: "Facebook Templates",
      description: "Manage standard Facebook Messenger announcement templates to nurture leads and build business workflows.",
      icon: <FacebookIcon />,
      colorClass: "hover:border-[#1877F2]/50 hover:shadow-[#1877F2]/8 bg-gradient-to-br from-[#1877F2]/5 via-white to-white dark:from-slate-900 dark:via-(--card-color) dark:to-(--card-color)",
      iconBgColor: "rgba(24, 119, 242, 0.1)",
      iconBorderColor: "rgba(24, 119, 242, 0.2)",
      btnColor: "#1877F2",
    },
    {
      id: "instagram",
      title: "Instagram Templates",
      description: "Design professional Instagram Direct message templates to auto-respond to stories, leads, and customer chat updates.",
      icon: <InstagramIcon />,
      colorClass: "hover:border-[#E1306C]/50 hover:shadow-[#E1306C]/8 bg-gradient-to-br from-[#E1306C]/5 via-white to-white dark:from-slate-900 dark:via-(--card-color) dark:to-(--card-color)",
      iconBgColor: "rgba(225, 48, 108, 0.1)",
      iconBorderColor: "rgba(225, 48, 108, 0.2)",
      btnColor: "#E1306C",
    },
  ]

  export const SECTOR_DATA: Record<string, string[]> = {
  healthcare: ["appointment_booking", "appointment_reminder", "lab_reports", "prescription_ready", "health_tips"],
  ecommerce: ["order_summary", "order_management", "order_tracking", "new_arrivals", "cart_reminder", "delivery_update", "payment_confirmation", "return_refund"],
  fashion: ["new_collection", "sale_offer", "style_recommendation", "back_in_stock", "order_update"],
  financial_service: ["transaction_alert", "payment_due_reminder", "loan_update", "kyc_update", "policy_update"],
  general: ["customer_feedback", "welcome_message", "promotion", "announcement", "reminder"],
};

export const SECTORS = [
  { id: "all", label: "All Templates", description: "Library", icon: <LayoutGrid size={20} /> },
  { id: "ecommerce", label: "E-Commerce", description: "Industry", icon: <ShoppingBag size={20} /> },
  { id: "financial_service", label: "Finance", description: "Industry", icon: <CircleDollarSign size={20} /> },
  { id: "healthcare", label: "Healthcare", description: "Industry", icon: <Stethoscope size={20} /> },
  { id: "fashion", label: "Fashion", description: "Industry", icon: <Watch size={20} /> },
  { id: "general", label: "General", description: "Industry", icon: <Shapes size={20} /> },
];

export const STATUS_ITEMS = [
  { id: "all", label: "General", description: "All templates", icon: <LayoutGrid size={20} /> },
  { id: "pending", label: "Pending", description: "Awaiting review", icon: <Clock size={20} /> },
  { id: "approved", label: "Approved", description: "Ready to use", icon: <FileCheck2 size={20} /> },
  { id: "rejected", label: "Rejected", description: "Needs revision", icon: <FileX2 size={20} /> },
];