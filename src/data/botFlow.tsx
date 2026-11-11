import L from "leaflet";
import {
  ArrowRightCircle,
  Facebook,
  FileText,
  Film,
  Globe,
  Image as ImageIcon,
  Inbox,
  Instagram,
  MessageSquare,
  Music,
  Search,
  Send,
  ShoppingCart,
  Target,
} from "lucide-react";
import { AssignMode, ChannelOption } from "../types/botFlow";

export const tabs: { value: AssignMode; label: string }[] = [
  { value: "all", label: "All Agents" },
  { value: "team", label: "From Team" },
];

export const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const mediaMessageField = [
  { value: "image", label: "Image", icon: <ImageIcon className="h-4 w-4" /> },
  { value: "video", label: "Video", icon: <Film className="h-4 w-4" /> },
  {
    value: "document",
    label: "Document",
    icon: <FileText className="h-4 w-4" />,
  },
  { value: "audio", label: "Audio", icon: <Music className="h-4 w-4" /> },
];

export const entryTriggerOptions = [
  {
    value: "on exact match",
    label: "Exact Match",
    icon: <Target className="h-4 w-4" />,
  },
  {
    value: "contains keyword",
    label: "Partial Match",
    icon: <Search className="h-4 w-4" />,
  },
  {
    value: "starts with",
    label: "Starts With",
    icon: <ArrowRightCircle className="h-4 w-4" />,
  },
  {
    value: "any message",
    label: "All Messages",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    value: "order received",
    label: "Order Events",
    icon: <ShoppingCart className="h-4 w-4" />,
  },
];

export const STATIC_FIELDS = [
  { label: "Contact Name", value: "name" },
  { label: "Phone Number", value: "phone_number" },
  { label: "Email Address", value: "email" },
  { label: "Status", value: "status" },
];

export const options: ChannelOption[] = [
  {
    id: "all",
    name: "All Channels",
    description:
      "Deploy your flow to all connected messaging platforms simultaneously.",
    icon: <Globe size={24} className="text-white" />,
    gradient: "from-indigo-500 to-purple-600",
    borderHover: "hover:border-indigo-500/50 focus:border-indigo-500/50",
    textHover: "group-hover:text-indigo-500",
    glowColor: "rgba(99, 102, 241, 0.15)",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description:
      "Send automated messages, catalog templates, and run interactive chats.",
    icon: <MessageSquare size={24} className="text-white" />,
    gradient: "from-emerald-500 to-teal-600",
    borderHover: "hover:border-primary/50 focus:border-primary/50",
    textHover: "group-hover:text-primary",
    glowColor: "rgba(16, 185, 129, 0.15)",
  },
  {
    id: "telegram",
    name: "Telegram Bot",
    description:
      "Manage replies for Telegram bots and send utility notifications.",
    icon: <Send size={24} className="text-white" />,
    gradient: "from-[#229ED9] to-sky-600",
    borderHover: "hover:border-[#229ED9]/50 focus:border-[#229ED9]/50",
    textHover: "group-hover:text-[#229ED9]",
    glowColor: "rgba(34, 158, 217, 0.15)",
  },
  {
    id: "facebook",
    name: "Facebook",
    description:
      "Engage with page visitors and automate Facebook Messenger chats.",
    icon: <Facebook size={24} className="text-white" />,
    gradient: "from-blue-500 to-indigo-700",
    borderHover: "hover:border-blue-500/50 focus:border-blue-500/50",
    textHover: "group-hover:text-blue-500",
    glowColor: "rgba(59, 130, 246, 0.15)",
  },
  {
    id: "instagram",
    name: "Instagram",
    description:
      "Optimize direct message replies and automate stories reactions.",
    icon: <Instagram size={24} className="text-white" />,
    gradient: "from-pink-500 to-rose-600",
    borderHover: "hover:border-pink-500/50 focus:border-pink-500/50",
    textHover: "group-hover:text-pink-500",
    glowColor: "rgba(236, 72, 153, 0.15)",
  },
];


export const prefixMap: Record<string, string> = {
        delay: "delay-",
        wait_for_reply: "wait_for_reply-",
        api: "api-",
        api_request: "api-",
        response_saver: "response_saver-",
        condition: "condition-",
        advanced_condition: "advanced_condition-",
        send_template: "send_template-",
        cta_button: "cta_button-",
        assign_chatbot: "assign_chatbot-",
        save_to_google_sheet: "google_sheet-",
        send_google_form: "send_google_form-",
        send_catalog: "send_catalog-",
        send_shopify: "send_shopify-",
        create_calendar_event: "calendar_event-",
        create_google_meet: "google_meet-",
      };

      export const operatorMap: Record<string, string> = {
      "contains keyword": "contains_any",
      "on exact match": "equals",
      "starts with": "starts_with",
    };

    export const flowListColumns = [
    { id: "Name", label: "Name", isVisible: true },
    { id: "Platform", label: "Platform", isVisible: true },
    { id: "Nodes", label: "Nodes", isVisible: true },
    { id: "Publish Status", label: "Publish Status", isVisible: true },
    { id: "Created At", label: "Created At", isVisible: true },
    { id: "Actions", label: "Actions", isVisible: true },
  ]

  export const badgeStyles: Record<string, string> = {
          all: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/30",
          whatsapp: "bg-light-primary text-primary-dark border-[var(--primary-opacity-30)] dark:bg-primary-darker/20 dark:text-primary dark:border-primary-darker/30",
          telegram: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30",
          facebook: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
          instagram: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/30",
        };

       export const displayNames: Record<string, string> = {
          all: "All Channels",
          whatsapp: "WhatsApp",
          telegram: "Telegram",
          facebook: "Facebook",
          instagram: "Instagram",
        };

        export const filters = [
          { key: "all", label: "Show All" },
          { key: "active", label: "Publish" },
          { key: "draft", label: "Draft" },
          { key: "paused", label: "Pause" },
        ]

        export const validMessageTypes = [
              "send_message",
              "send_template",
              "form_flow",
              "cta_button",
              "location",
              "list_message",
              "button_message",
              "send_catalog",
              "send_shopify",
              "send_google_form",
            ];