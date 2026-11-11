import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  Facebook,
  Hash,
  Instagram,
  Layers,
  Loader2,
  Megaphone,
  MessageCircle,
  Send,
  UserCheck,
  Users,
} from "lucide-react";

export const colors = {
  blue: "bg-blue-50/50 text-blue-600 border-blue-100 dark:bg-(--page-body-bg) dark:text-blue-400 dark:border-none",
  emerald:
    "bg-light-primary/50 text-primary border-[var(--primary-opacity-20)] dark:bg-(--page-body-bg) dark:text-primary dark:border-none",
  purple:
    "bg-purple-50/50 text-purple-600 border-purple-100 dark:bg-(--page-body-bg) dark:text-purple-400 dark:border-none",
  red: "bg-red-50/50 text-red-600 border-red-100 dark:bg-(--page-body-bg) dark:text-red-400 dark:border-none",
  orange:
    "bg-orange-50/50 text-orange-600 border-orange-100 dark:bg-(--page-body-bg) dark:text-orange-400 dark:border-none",
};

export const ALL_STEPS = [
  {
    id: "basic",
    title: "General Information",
    description: "Name and internal description",
  },
  {
    id: "config",
    title: "WhatsApp Settings",
    description: "Select WABA & Template",
  },
  {
    id: "variables",
    title: "Data Mapping",
    description: "Dynamic content mapping",
  },
  { id: "recipients", title: "Audience", description: "Target audience" },
  { id: "schedule", title: "Timeline", description: "Timing and Launch" },
  { id: "summary", title: "Campaign Summary", description: "Review and Launch" },
];

export const DIRECT_STEPS = [
  {
    id: "config",
    title: "WhatsApp Config",
    description: "WABA & Template Selection",
  },
  {
    id: "variables",
    title: "Data Mapping",
    description: "Dynamic content mapping",
  },
  { id: "schedule", title: "Timeline", description: "Review and Launch" },
  { id: "summary", title: "Campaign Summary", description: "Review and Launch" },
];

export const CHANNELS = [
  {
    id: "whatsapp",
    title: "WhatsApp Broadcast",
    description: "Official API templates for higher conversions.",
    icon: MessageCircle,
    color: "#25D366",
  },
  {
    id: "telegram",
    title: "Telegram Broadcast",
    description: "Send campaign messages directly to Telegram users.",
    icon: Send,
    color: "#229ED9",
  },
  {
    id: "facebook",
    title: "Facebook Message",
    description: "Reach your Facebook audience directly via Messenger.",
    icon: Facebook,
    color: "#1877F2",
  },
  {
    id: "instagram",
    title: "Instagram Direct",
    description: "Engage followers directly in their Instagram DMs.",
    icon: Instagram,
    color: "#E1306C",
  },
];

export const PREDEFINED_CRONS = [
  { label: "Every day at 9:00 AM", value: "0 9 * * *" },
  { label: "Every day at 6:00 PM", value: "0 18 * * *" },
  { label: "Every day at midnight", value: "0 0 * * *" },
  { label: "Every weekday (Mon-Fri) at 9:00 AM", value: "0 9 * * 1-5" },
  { label: "Every weekend (Sat-Sun) at 9:00 AM", value: "0 9 * * 0,6" },
  { label: "Every Monday at 9:00 AM", value: "0 9 * * 1" },
  { label: "Every Friday at 9:00 AM", value: "0 9 * * 5" },
  { label: "First day of every month at 9:00 AM", value: "0 9 1 * *" },
  { label: "1st and 15th of every month at 9:00 AM", value: "0 9 1,15 * *" },
  { label: "Middle of every month (15th) at 9:00 AM", value: "0 9 15 * *" },
  { label: "Every 2 hours", value: "0 */2 * * *" },
  { label: "Every 4 hours", value: "0 */4 * * *" },
  { label: "Every 12 hours", value: "0 */12 * * *" },
  { label: "First day of the year (Jan 1) at midnight", value: "0 0 1 1 *" },
  { label: "Custom (Enter cron expression)...", value: "custom" },
];

export const CONTACT_SYSTEM_FIELDS = [
  { label: "Contact Name", value: "name" },
  { label: "Phone Number", value: "phone_number" },
  { label: "Email Address", value: "email" },
];

export const timeFilterOptions = [
  { value: "7_days_ago", label: "7 Days" },
  { value: "14_days_ago", label: "14 Days" },
  { value: "30_days_ago", label: "30 Days" },
  { value: "all_time", label: "All Time" },
];

export const statusConfig: any = {
  draft: {
    icon: Clock,
    className:
      "bg-gray-100 text-gray-600 border-gray-200 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
    label: "Draft",
  },
  scheduled: {
    icon: Calendar,
    className:
      "bg-amber-50 text-amber-600 border-amber-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
    label: "Scheduled",
  },
  recurring: {
    icon: Calendar,
    className:
      "bg-amber-50 text-amber-600 border-amber-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
    label: "Recurring",
  },
  sending: {
    icon: Loader2,
    className:
      "bg-blue-50 text-blue-600 dark:text-primary border-blue-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover) animate-pulse",
    label: "Sending",
  },
  processing: {
    icon: Loader2,
    className:
      "bg-blue-50 text-blue-600 dark:text-primary border-blue-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
    label: "Processing",
  },
  completed: {
    icon: CheckCircle2,
    className:
      "bg-light-primary text-primary border-[var(--primary-opacity-20)] dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
    label: "Completed",
  },
  failed: {
    icon: AlertCircle,
    className:
      "bg-red-50 text-red-600 border-red-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
    label: "Failed",
  },
  completed_with_errors: {
    icon: AlertTriangle,
    className:
      "bg-amber-50 text-amber-600 border-amber-100 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
    label: "Partially Delivered",
  },
  cancelled: {
    icon: AlertCircle,
    className:
      "bg-slate-100 text-slate-600 border-slate-200 dark:border-(--card-border-color) dark:bg-(--dark-sidebar) dark:hover:bg-(--table-hover)",
    label: "Cancelled",
  },
};

export const headers = ["Campaign Name", "Template", "Status", "Sent", "Delivered", "Read", "Failed", "Sent At"];