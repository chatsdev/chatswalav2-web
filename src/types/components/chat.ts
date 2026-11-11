import { Language } from "@/src/data/Languages";
import { Attachment, Contact } from "../components";
import { Facebook, Instagram, MessageCircle, Send } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type MessageType = "text" | "image" | "sticker" | "video" | "audio" | "document" | "template" | "interactive" | "location" | "order" | "system_messages" | "reaction" | "payment_link" | "google_meet" | "carousel" | "comment" | "story_reply";

export interface InteractiveData {
  interactiveType: "button" | "list" | "flow" | "cta_url";
  buttons?: any;
  flow_cta?: string;
  list?: {
    header: string;
    body?: string;
    footer?: string;
    buttonTitle: string;
    sectionTitle: string;
    items: Array<{ id: string; title: string; description: string }>;
  };
}

export interface TemplateButton {
  type: "website" | "phone" | "quick_reply" | "copy_code" | "catalog" | "url" | "phone_call" | "spm";
  text: string;
  website_url?: string;
  phone_number?: string;
  url?: string;
  id?: string;
  media_url?: string;
}

export interface CarouselCard {
  components: Array<{
    type: string;
    format?: string;
    text?: string;
    buttons?: TemplateButton[];
  }>;
}

export interface TemplateData {
  _id: string;
  template_name: string;
  language: string;
  category: string;
  status: string;
  header: {
    format: "text" | "image" | "video" | "document" | "location" | "media";
    text?: string;
    media_type?: "image" | "video" | "document" | "location";
    media_url?: string;
  } | null;
  message_body: string;
  body_variables?: any[];
  footer_text?: string | null;
  buttons?: TemplateButton[];
  meta_template_id: string;
  marketing_type?: string;
  offer_text?: string;
  is_limited_time_offer?: boolean;
  carousel_cards?: CarouselCard[];
  call_permission?: boolean;
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string | null;
}

export interface Reaction {
  emoji: string;
  users: ChatParticipant[];
}

export interface ChatMessage {
  id: string;
  wa_message_id?: string;
  content: string | null;
  interactiveData: InteractiveData | null;
  messageType: MessageType;
  fileUrl: string | null;
  template: TemplateData | null;
  createdAt: string;
  can_chat: boolean;
  delivered_at: string | null;
  delivery_status: "pending" | "sent" | "delivered" | "read" | "failed";
  is_delivered: boolean;
  is_seen: boolean;
  seen_at: string | null;
  wa_status: string | null;
  read_status?: string;
  direction: "inbound" | "outbound";
  sender: ChatParticipant;
  recipient: ChatParticipant;
  reply_message?: ChatMessage | null;
  reply_message_id?: string | null;
  reaction_message_id?: string;
  reaction_emoji?: string;
  reactions?: Reaction[];
  user_id?: string;
  whatsapp_phone_number_id?: string;
  contact_id?: string;
  platform?: string;
  provider?: string;
}

export interface MessageGroup {
  senderId: string;
  sender: ChatParticipant;
  recipient: ChatParticipant;
  messages: ChatMessage[];
  createdAt: string;
  lastMessageTime: string;
}

export interface DateGroupedMessages {
  dateLabel: string;
  dateKey: string;
  messageGroups: MessageGroup[];
}

export interface GetMessagesResponse {
  success: boolean;
  messages: DateGroupedMessages[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface SendMessagePayload {
  whatsapp_phone_number_id: string;
  contact_id: string;
  message?: string;
  type: MessageType;
  mediaUrls?: string[];
  messageType?: MessageType;
  interactiveType?: "button" | "list";
  replyMessageId?: string;
  buttonParams?: Array<{ id: string; title: string }>;
  listParams?: {
    header: string;
    body?: string;
    footer?: string;
    buttonTitle: string;
    sectionTitle: string;
    items: Array<{ id: string; title: string; description: string }>;
  };
  location?: {
    latitude: number;
    longitude: number;
    address: string;
    name: string;
  };
  reactionEmoji?: string;
  reactionMessageId?: string;
  provider?: string;
  amount?: number;
  description?: string;
  gateway_id?: string;
  currency?: string;
  google_account_id?: string;
  meet_start_time?: string;
  meet_end_time?: string;
}

export interface ChatState {
  activeChatId: string | null;
  sidebarOpen: boolean;
  profileOpen: boolean;
}

export interface RecentChatResponseItem {
  contact: {
    id: string;
    number: string;
    name: string;
    phone_number?: string;
    avatar: string | null;
    labels: ContactLabel[];
    chat_status?: "open" | "resolved";
  };
  lastMessage: {
    id: string;
    wa_message_id?: string;
    content: string;
    messageType: string;
    createdAt: string;
    unreadCount: string;
  };
  is_pinned?: boolean;
  is_snoozed?: boolean;
}

export interface RecentChatData {
  data: RecentChatResponseItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface SuggestReplyMessage {
  role: "customer" | "agent";
  content: string;
}

export interface SuggestReplyRequest {
  conversation: SuggestReplyMessage[] | null;
  tone: string;
}

export interface SuggestReplyResponse {
  success: boolean;
  data: {
    suggestedReplies: string[];
    count: number;
    modelId?: string;
    modelUsed?: string;
    tone?: string;
  };
}

export type AiTransformFeature = "translate" | "summarize" | "improve" | "formalize" | "casualize";

export interface AiTextTransformRequest {
  message: string;
  feature: AiTransformFeature;
  language?: string;
}

export interface AiTextTransformResponse {
  success: boolean;
  data: {
    original: string;
    transformed: string;
    feature: AiTransformFeature;
    language?: string;
    languageName?: string;
    modelUsed?: string;
    modelId?: string;
  };
}

export type ContactLabel = {
  label: string;
  color?: string;
  _id?: string;
};

export interface InteractiveMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "button" | "list";
  onSend: (payload: Partial<SendMessagePayload>) => Promise<void>;
}

export interface ButtonFormHandle {
  submit: () => Promise<void>;
}

export interface ButtonFormProps {
  onSend: (payload: Partial<SendMessagePayload>) => Promise<void>;
  setIsSending: (val: boolean) => void;
}

export interface ListFormHandle {
  submit: () => Promise<void>;
}

export interface ListFormProps {
  onSend: (payload: Partial<SendMessagePayload>) => Promise<void>;
  setIsSending: (val: boolean) => void;
}

export interface AudioMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
}

export interface BaseMessageProps {
  message: ChatMessage;
  children: React.ReactNode;
  isWindowExpired?: boolean;
  isTransparent?: boolean;
}

export interface ChatMessageListProps {
  data: GetMessagesResponse | undefined;
  isLoading: boolean;
  onImageClick?: (url: string) => void;
  isWindowExpired?: boolean;
  isFetching?: boolean;
  onLoadMore?: () => void;
}

export interface CollapsibleSystemMessagesProps {
  messages: ChatMessage[];
}

export interface DocumentMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
}

export interface ImageMessageProps {
  message: ChatMessage;
  onImageClick?: (url: string) => void;
  isWindowExpired?: boolean;
}

export interface InteractiveMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
  onImageClick?: (url: string) => void;
}

export interface LanguageSelectorProps {
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
  triggerClassName?: string;
}

export interface ListViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InteractiveData["list"];
}

export interface LocationMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
}

export interface MessageActionsProps {
  message: ChatMessage;
  isOutgoing: boolean;
  onInfoClick?: () => void;
  className?: string;
  isBaileys?: boolean;
  isWindowExpired?: boolean;
}

export interface MessageGroupProps {
  group: MessageGroup;
  onImageClick?: (url: string) => void;
  isWindowExpired?: boolean;
}

export interface MessageInfoModalProps {
  message: ChatMessage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface MessageItemProps {
  message: ChatMessage;
  onImageClick?: (url: string) => void;
  isWindowExpired?: boolean;
}

export interface MessageReactionPickerProps {
  message: ChatMessage;
  className?: string;
  isOutgoing: boolean;
  isBaileys?: boolean;
  isWindowExpired?: boolean;
}

export interface MessageTranslationProps {
  messageText: string;
  onTranslated: (translatedText: string) => void;
  className?: string;
}

export interface OrderMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
}

export interface SystemMessageProps {
  message: ChatMessage;
}

export interface TemplateMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
  onImageClick?: (url: string) => void;
}

export interface TextMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
}

export interface VideoMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
}

export interface Agent {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface ProfileAssignAgentProps {
  agents: Agent[];
  selectedAgentId?: string;
  onAssign: (agentId: string) => void;
  onUnassign: () => void;
  isLoading?: boolean;
  isUnassigning?: boolean;
}

export interface ProfileChatLabelProps {
  labels: { id: string; name: string; color?: string }[];
  onRemoveLabel: (id: string) => void;
  onOpenModal: () => void;
}

export interface ProfileChatNoteProps {
  initialNote?: string;
  onSave: (note: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
  notes: Array<{ id: string; note: string; created_at: string }>;
}

export interface ProfileContactSummaryProps {
  profileData: any;
  onDelete: () => void;
  onOpenTagModal: () => void;
  onRemoveLabel: (id: string) => void;
}

export type MediaType = "images" | "videos" | "audios" | "documents" | "locations";

interface MediaItem {
  id: string;
  fileUrl: string;
  messageType: string;
  createdAt: string;
  [key: string]: any;
}

interface MediaWeekGroup {
  week: string;
  images?: MediaItem[];
  videos?: MediaItem[];
  audios?: MediaItem[];
  documents?: MediaItem[];
  locations?: MediaItem[];
}

export interface ProfileMediaAssetsProps {
  media: Record<string, MediaWeekGroup>;
}

export interface AudioRecorderProps {
  onSend: (blob: Blob) => void;
  onCancel: () => void;
  isSending?: boolean;
}

export interface ChatAreaProps {
  contactId?: string;
  phoneNumberId?: string;
  contactName?: string;
  contactNumber?: string;
  contactAvatar?: string;
  isModal?: boolean;
}

export interface ChatAttachmentMenuProps {
  onFileSelect: (file: File) => void;
  onMediaLibraryOpen: () => void;
  onLocationClick: () => void;
  onInteractiveClick: (type: "button" | "list") => void;
  onAudioClick?: () => void;
  onPaymentLinkClick: () => void;
  onEcommerceClick?: () => void;
  onGoogleMeetClick?: () => void;
  isBaileys?: boolean;
}

export interface ChatFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { startDate?: string; endDate?: string; tagLabel?: string; hasNotes?: boolean; agentId?: string }) => void;
  initialFilters: {
    startDate?: string;
    endDate?: string;
    tagLabel?: string;
    hasNotes?: boolean;
    agentId?: string;
  };
}

export interface ExpiredWindowBannerProps {
  contactId: string;
  isAgent: boolean;
  isNew?: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (location: Location) => void;
}

export interface MediaSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedMedia: Attachment[]) => void;
  allowedTypes?: "image" | "video" | "all";
}

export interface MessageDateFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: { startDate?: string; endDate?: string }) => void;
  initialFilters: { startDate?: string; endDate?: string };
}

export interface MessageSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  contactId: string;
  phoneNumberId: string;
  onMessageSelect: (messageId: string, timestamp: string) => void;
}

export interface MicErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorType: "no-device" | "permission-denied" | "unknown";
}

export interface QuickChatSheetProps {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  initialPhoneNumberId?: string;
}

export interface ResolvedChatBannerProps {
  contactId: string;
  phoneNumberId: string;
}

export interface WhatsAppTimerProps {
  lastInboundTime: string;
  onExpire?: () => void;
}

export interface QuickReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (message: string) => void;
  onDirectSend: (message: string) => void;
}

export interface StickerMessageProps {
  message: ChatMessage;
  isWindowExpired?: boolean;
}

export interface ProfileAssignAICallAgentProps {
  agents: { _id: string; name: string }[];
  selectedAgentId?: string;
  assignedAgent?: { _id: string; name: string } | null;
  onAssign: (agentId: string) => void;
  onUnassign: () => void;
  isLoading: boolean;
  isUnassigning: boolean;
} 

export interface ProfileAssignChatbotProps {
  chatbots: { _id: string; name: string }[];
  selectedChatbotId?: string;
  assignedChatbot?: { _id: string; name: string } | null;
  onAssign: (chatbotId: string) => void;
  onUnassign: () => void;
  isLoading: boolean;
  isUnassigning: boolean;
}

export interface ProfileClearChatProps {
  onClearChat: () => Promise<void>;
  isLoading: boolean;
}

export interface ChatListItemDropdownProps {
  contactId: string;
  contactName: string;
  contactNumber: string;
  phoneNumberId: string;
  isSnoozed?: boolean;
}



  export interface ChatSidebarItemProps {
    chat: RecentChatResponseItem;
    isSelected: boolean;
    isSelectionMode: boolean;
    selectedChatId?: string;
    isAgent: boolean;
    user: any;
    app_name: string;
    selectedPhoneNumberId: string;
    onSelect: (chat: RecentChatResponseItem) => void;
    onToggleSelection: (contactId: string) => void;
    onTogglePin: (e: React.MouseEvent, chat: RecentChatResponseItem) => void;
  }

  export interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

export interface LocalAttachment extends Attachment {
  localFile?: File;
}

export interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: Partial<SendMessagePayload>) => Promise<void>;
  isSending: boolean;
}

export type TabKey = "admin" | "custom" | "favorites";

export interface GoogleMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (payload: { google_account_id: string; meet_start_time: string; meet_end_time: string }) => Promise<void>;
  isSending: boolean;
}