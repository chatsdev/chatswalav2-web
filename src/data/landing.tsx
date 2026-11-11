import { BillingTab, MenuItem } from "../types/landingPage";

export const defaultMenuItems: MenuItem[] = [
    {
      title: "Home",
      link_type: "Link",
      path: "/",
      status: true,
    },
    {
      title: "Channels",
      link_type: "Sub",
      status: true,
      children: [
        { title: "WhatsApp", link_type: "Link", path: "/channel/whatsapp", status: true, icon: "Phone" },
        { title: "Instagram", link_type: "Link", path: "/channel/instagram", status: true, icon: "Instagram" },
        { title: "Telegram", link_type: "Link", path: "/channel/telegram", status: true, icon: "Send" },
        { title: "Facebook", link_type: "Link", path: "/channel/facebook", status: true, icon: "Facebook" },
      ],
    },
    {
      title: "Features",
      link_type: "Sub",
      mega_menu: true,
      mega_menu_type: "Link With Image",
      status: true,
      children: [
        { title: "Bulk WhatsApp Broadcast", link_type: "Link", path: "/product/broadcast_bulk_messages", description: "Reach Everyone Instantly with Bulk WhatsApp Broadcast", status: true, icon: "Send" },
        { title: "Shared Inbox", link_type: "Link", path: "/product/shared_team_inbox", description: "Centralized Communication with Shared Inbox", status: true, icon: "Inbox" },
        { title: "WhatsApp Catalog", link_type: "Link", path: "/product/catalog", description: "Showcase Resources with WhatsApp Catalog", status: true, icon: "ShoppingBag" },
        { title: "AI Voice Calling", link_type: "Link", path: "/product/ai_calling", description: "AI voice agents handling inbound & outbound voice calls", status: true, icon: "Phone" },
        { title: "Appointment Booking", link_type: "Link", path: "/product/appointment_booking", description: "Let customers book appointments directly", status: true, icon: "Calendar" },
        { title: "Click To WhatsApp Ads", link_type: "Link", path: "/product/ctwa", description: "Drive instant conversations with ads", status: true, icon: "Sparkles" },
        { title: "Automation Builder", link_type: "Link", path: "/product/automation_builder", description: "AI-powered, human-like chatbots for every use case", status: true, icon: "GitBranch" },
        { title: "WhatsApp Forms", link_type: "Link", path: "/product/whatsapp_forms", description: "Create and share forms that collect responses", status: true, icon: "FileText" },
      ],
    },
    {
      title: "Pricing",
      link_type: "Link",
      path: "/#pricing",
      status: true,
    },
  ];

  export const DEFAULT_BILLING_TABS: { id: BillingTab; label: string; badge?: string }[] = [
  { id: "monthly", label: "Monthly" },
  { id: "yearly", label: "Yearly", badge: "SAVE" },
  { id: "lifetime", label: "One Time" },
];

export const PRICE_SUFFIX: Record<string, string> = {
  "free trial": "",
  "free Trial": "",
  monthly: "/mo",
  yearly: "/yr",
  lifetime: "",
};