import {
  Calendar,
  Facebook,
  FileText,
  GitBranch,
  Hash,
  Image as ImageIcon,
  Instagram,
  Layers,
  LayoutTemplate,
  ListOrdered,
  MessageCircle,
  Send,
  ShoppingBag,
  Sparkles,
  Sticker,
  Type,
  UserCheck,
  Users,
  Video,
} from "lucide-react";
import { MatchingMethod, ReplyTypeConfig } from "../types/keywordAction";

export const MATCHING_METHODS: {
  value: MatchingMethod;
  label: string;
  description: string;
}[] = [
  {
    value: "exact",
    label: "Exact Match",
    description: "Keyword must match exactly",
  },
  {
    value: "contains",
    label: "Contains",
    description: "Message must contain the keyword",
  },
  {
    value: "partial",
    label: "Partial Match",
    description: "Fuzzy match with a threshold %",
  },
  {
    value: "starts_with",
    label: "Starts With",
    description: "Message must start with keyword",
  },
  {
    value: "ends_with",
    label: "Ends With",
    description: "Message must end with keyword",
  },
];

export const REPLY_TYPES: ReplyTypeConfig[] = [
  {
    value: "text",
    label: "Text",
    icon: <Type size={18} />,
    color: "text-blue-500",
    source: "reply_material",
    materialType: "text",
  },
  {
    value: "media",
    label: "Image",
    icon: <ImageIcon size={18} />,
    color: "text-primary",
    source: "reply_material",
    materialType: "image",
  },
  {
    value: "media",
    label: "Video",
    icon: <Video size={18} />,
    color: "text-purple-500",
    source: "reply_material",
    materialType: "video",
  },
  {
    value: "media",
    label: "Document",
    icon: <FileText size={18} />,
    color: "text-amber-500",
    source: "reply_material",
    materialType: "document",
  },
  {
    value: "media",
    label: "Sticker",
    icon: <Sticker size={18} />,
    color: "text-pink-500",
    source: "reply_material",
    materialType: "sticker",
  },
  {
    value: "template",
    label: "Template",
    icon: <LayoutTemplate size={18} />,
    color: "text-indigo-500",
    source: "template",
    featureKey: "template_bots",
  },
  {
    value: "catalog",
    label: "Catalogue",
    icon: <ShoppingBag size={18} />,
    color: "text-orange-500",
    source: "catalog",
  },
  {
    value: "sequence",
    label: "Sequence",
    icon: <ListOrdered size={18} />,
    color: "text-teal-500",
    source: "sequence",
  },
  {
    value: "chatbot",
    label: "Chatbot",
    icon: <Sparkles size={18} />,
    color: "text-rose-500",
    source: "chatbot",
  },
  {
    value: "flow",
    label: "Form Flow",
    icon: <GitBranch size={18} />,
    color: "text-orange-500",
    source: "reply_material",
    materialType: "flow",
    featureKey: "forms",
  },
  {
    value: "appointment_flow",
    label: "Appointment",
    icon: <Calendar size={18} />,
    color: "text-red-500",
    source: "appointment",
    featureKey: "appointment_bookings",
  },
];

export const platforms = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    desc: "Auto-reply on WhatsApp",
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    activeBorder: "border-primary bg-primary/5",
    icon: <MessageCircle size={20} className="text-primary" />,
  },
  {
    id: "telegram",
    name: "Telegram",
    desc: "Auto-reply on Telegram",
    color: "text-sky-500",
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    activeBorder: "border-sky-500 bg-sky-500/5",
    icon: <Send size={18} className="text-sky-500" />,
  },
  {
    id: "facebook",
    name: "Facebook",
    desc: "Auto-reply on Messenger",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    activeBorder: "border-blue-500 bg-blue-500/5",
    icon: <Facebook size={20} className="text-blue-500" />,
  },
  {
    id: "instagram",
    name: "Instagram",
    desc: "Auto-reply on Instagram",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    activeBorder: "border-pink-500 bg-pink-500/5",
    icon: <Instagram size={20} className="text-pink-500" />,
  },
];

export const recipientOptions = [
  {
    id: "all_contacts",
    title: "All Contacts",
    desc: "Trigger for everyone in database",
    icon: <Users size={20} className="text-primary" />,
    bg: "bg-primary/10",
    border: "border-primary/20",
    activeBorder: "border-primary bg-primary/5",
  },
  {
    id: "specific_contacts",
    title: "Specific Contacts",
    desc: "Trigger only for handpicked recipients",
    icon: <UserCheck size={20} className="text-sky-500" />,
    bg: "bg-sky-500/10",
    border: "border-sky-500/20",
    activeBorder: "border-sky-500 bg-sky-500/5",
  },
  {
    id: "tags",
    title: "Segment by Tags",
    desc: "Trigger for contacts with specific tags",
    icon: <Hash size={20} className="text-blue-500" />,
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    activeBorder: "border-blue-500 bg-blue-500/5",
  },
  {
    id: "segments",
    title: "Target Segments",
    desc: "Trigger for pre-defined segments",
    icon: <Layers size={20} className="text-pink-500" />,
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    activeBorder: "border-pink-500 bg-pink-500/5",
  },
];

export const MATCHING_METHOD_LABELS: Record<string, string> = {
  exact: "Exact",
  contains: "Contains",
  partial: "Partial",
  starts_with: "Starts With",
  ends_with: "Ends With",
};

export const MATCHING_METHOD_COLORS: Record<string, string> = {
  exact:
    "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 dark:border-(--card-border-color)",
  contains:
    "bg-light-primary text-primary border-[var(--primary-opacity-20)] dark:bg-primary/10 dark:text-primary dark:border-(--card-border-color)",
  partial:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-(--card-border-color)",
  starts_with:
    "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-(--card-border-color)",
  ends_with:
    "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-(--card-border-color)",
};
