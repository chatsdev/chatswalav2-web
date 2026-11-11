import {
  Bot,
  FileArchive,
  FileText,
  GitBranch,
  Image,
  ImageIcon,
  Layout,
  ShoppingBag,
  Smile,
  Video,
  Zap,
} from "lucide-react";
import { DelayUnit, ReplyMaterialSourceType, SendDay } from "../types/sequence";
import {
  ReplyMaterialSidebarItem,
  ReplyMaterialType,
} from "../types/replyMaterial";

export const WEEK_DAYS: { label: string; value: SendDay }[] = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

export const SOURCE_TYPES: {
  label: string;
  value: ReplyMaterialSourceType;
  featureKey?: string;
}[] = [
  { label: "Reply Material", value: "ReplyMaterial" },
  { label: "Template", value: "Template", featureKey: "template_bots" },
  { label: "Catalog", value: "EcommerceCatalog" },
];

export const DELAY_UNITS: { label: string; value: DelayUnit }[] = [
  { label: "Minutes", value: "minutes" },
  { label: "Hours", value: "hours" },
  { label: "Days", value: "days" },
];

export const TYPE_FALLBACK_ICON: Record<ReplyMaterialType, React.ReactNode> = {
  text: <FileText size={28} className="text-primary/60" />,
  // eslint-disable-next-line jsx-a11y/alt-text
  image: <Image size={28} className="text-blue-400" />,
  document: <FileArchive size={28} className="text-amber-400" />,
  video: <Video size={28} className="text-purple-400" />,
  sticker: <Smile size={28} className="text-pink-400" />,
  sequence: <Zap size={28} className="text-yellow-400" />,
  template: <Layout size={28} className="text-indigo-400" />,
  catalog: <ShoppingBag size={28} className="text-primary" />,
  chatbot: <Bot size={28} className="text-cyan-400" />,
  flow: <GitBranch size={28} className="text-orange-400" />,
};

export const TYPE_ACCENT: Record<ReplyMaterialType, string> = {
  text: "bg-primary/5 dark:bg-primary/10",
  image: "bg-blue-50 dark:bg-blue-500/10",
  document: "bg-amber-50 dark:bg-amber-500/10",
  video: "bg-purple-50 dark:bg-purple-500/10",
  sticker: "bg-pink-50 dark:bg-pink-500/10",
  sequence: "bg-yellow-50 dark:bg-yellow-500/10",
  template: "bg-indigo-50 dark:bg-indigo-500/10",
  catalog: "bg-light-primary dark:bg-primary/10",
  chatbot: "bg-cyan-50 dark:bg-cyan-500/10",
  flow: "bg-orange-50 dark:bg-orange-500/10",
};

export const TYPE_ICON: Record<ReplyMaterialType, React.ReactNode> = {
  text: <FileText size={40} />,
  // eslint-disable-next-line jsx-a11y/alt-text
  image: <Image size={40} />,
  document: <FileArchive size={40} />,
  video: <Video size={40} />,
  sticker: <Smile size={40} />,
  sequence: <Zap size={40} />,
  template: <Layout size={40} />,
  catalog: <ShoppingBag size={20} />,
  chatbot: <Bot size={40} />,
  flow: <GitBranch size={40} />,
};

export const SMALL_TYPE_ICON: Record<ReplyMaterialType, React.ReactNode> = {
  text: <FileText size={18} />,
  image: <ImageIcon size={18} />,
  document: <FileArchive size={18} />,
  video: <Video size={18} />,
  sticker: <Smile size={18} />,
  sequence: <Zap size={18} />,
  template: <Layout size={18} />,
  catalog: <ShoppingBag size={18} />,
  chatbot: <Bot size={18} />,
  flow: <GitBranch size={18} />,
};

export const TYPE_LABEL_KEY: Record<ReplyMaterialType, string> = {
  text: "text_messages",
  image: "images",
  document: "documents",
  video: "videos",
  sticker: "stickers",
  sequence: "sequences",
  template: "templates",
  catalog: "catalogues",
  chatbot: "chatbot",
  flow: "form_flow",
};

export const REPLY_MATERIAL_SIDEBAR_ITEMS: ReplyMaterialSidebarItem[] = [
  {
    type: "text",
    groupKey: "texts",
    label: "text_messages",
    description: "text_messages_desc",
    hasFile: false,
    permission: "view.reply_materials",
  },
  {
    type: "image",
    groupKey: "images",
    label: "images",
    description: "images_desc",
    hasFile: true,
    accept: "image/*",
    permission: "view.reply_materials",
  },
  {
    type: "document",
    groupKey: "documents",
    label: "documents",
    description: "documents_desc",
    hasFile: true,
    accept: ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt",
    permission: "view.reply_materials",
  },
  {
    type: "video",
    groupKey: "videos",
    label: "videos",
    description: "videos_desc",
    hasFile: true,
    accept: "video/*",
    permission: "view.reply_materials",
  },
  {
    type: "sticker",
    groupKey: "stickers",
    label: "stickers",
    description: "stickers_desc",
    hasFile: true,
    accept: "image/webp,image/png,image/gif",
    permission: "view.reply_materials",
  },
  {
    type: "flow",
    groupKey: "flows",
    label: "form_flow",
    description: "form_flow_desc",
    hasFile: false,
    permission: "view.reply_materials",
    featureKey: "forms",
  },
  {
    type: "sequence",
    groupKey: "sequences",
    label: "sequences",
    description: "sequences_desc",
    hasFile: false,
    permission: "view.sequences",
  },
  // {
  //   type: "template",
  //   label: "templates",
  //   description: "templates_desc",
  //   hasFile: false,
  //   permission: "view.template",
  //   featureKey: "template_bots",
  // },
  // {
  //   type: "catalog",
  //   label: "catalogue",
  //   description: "catalogues_desc",
  //   hasFile: false,
  //   permission: "view.ecommerce_catalogs",
  // },
  {
    type: "chatbot",
    label: "chatbot",
    description: "chatbot_desc",
    hasFile: false,
    permission: "view.chatbots",
  },
];

export const TYPE_ICONS: Record<
  ReplyMaterialType | "sequence",
  React.ReactNode
> = {
  text: <FileText size={20} />,
  // eslint-disable-next-line jsx-a11y/alt-text
  image: <Image size={20} />,
  document: <FileArchive size={20} />,
  video: <Video size={20} />,
  sticker: <Smile size={20} />,
  sequence: <Zap size={20} />,
  template: <Layout size={20} />,
  catalog: <ShoppingBag size={20} />,
  chatbot: <Bot size={20} />,
  flow: <GitBranch size={20} />,
};

export const badgeStyles: Record<string, string> = {
  whatsapp:
    "bg-light-primary text-primary-dark border-[var(--primary-opacity-20)] dark:bg-primary-darker/20 dark:text-primary dark:border-primary-darker/30",
  telegram:
    "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30",
  facebook:
    "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30",
  instagram:
    "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/20 dark:text-pink-400 dark:border-pink-900/30",
};
export const displayNames: Record<string, string> = {
  whatsapp: "WhatsApp",
  telegram: "Telegram",
  facebook: "Facebook",
  instagram: "Instagram",
};
