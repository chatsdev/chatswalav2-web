import { QuickReply } from "../redux/api/quickReplyApi";
import { CampaignCard, CarouselProduct } from "./campaign";
import { Chatbot } from "./chatbot";
import { DelayUnit, ReplyMaterialSourceType, SendDay, Sequence, SequenceStep } from "./sequence";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ReplyMaterialType = "text" | "image" | "document" | "video" | "sticker" | "sequence" | "template" | "catalog" | "chatbot" | "flow";

export interface ReplyMaterial {
  _id: string;
  name: string;
  type: ReplyMaterialType;
  content?: string;
  file_url?: string | null;
  file_path?: string | null;
  waba_id?: string;
  user_id?: string;
  message?: string;
  flow_id?: string;
  button_text?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ReplyMaterialGroup {
  items: ReplyMaterial[];
  pagination: Pagination;
}

export interface ReplyMaterialsResponse {
  success: boolean;
  data: {
    texts: ReplyMaterialGroup;
    images: ReplyMaterialGroup;
    documents: ReplyMaterialGroup;
    videos: ReplyMaterialGroup;
    stickers: ReplyMaterialGroup;
    flows: ReplyMaterialGroup;
    sequences: any;
  };
}

export interface ReplyMaterialResponse {
  success: boolean;
  message?: string;
  data: ReplyMaterial;
}

export interface BulkDeleteResponse {
  success: boolean;
  message?: string;
  data?: { deletedCount: number };
}

export interface ReplyMaterialSidebarItem {
  type: ReplyMaterialType;
  groupKey?: keyof ReplyMaterialsResponse["data"];
  label: string;
  description: string;
  hasFile: boolean;
  accept?: string;
  permission?: string;
  featureKey?: string;
}

export interface ReplyMaterialFormValues {
  name: string;
  content: string;
  file: File | null;
}

export interface ReplyMaterialQueryParams {
  waba_id: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface MaterialPickerProps {
  sourceType: ReplyMaterialSourceType;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  items: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  onPreview?: (item: any) => void;
}

export interface SchedulingConfigProps {
  sendAnytime: boolean;
  onSendAnytimeChange: (value: boolean) => void;
  fromTime: string;
  onFromTimeChange: (value: string) => void;
  toTime: string;
  onToTimeChange: (value: string) => void;
  sendDays: SendDay[];
  onSendDaysChange: (days: SendDay[]) => void;
}

export interface SourceTypeSelectorProps {
  value: ReplyMaterialSourceType;
  onChange: (value: ReplyMaterialSourceType) => void;
  platform?: string;
}

export interface TemplateConfigProps {
  template: any;
  wabaId: string;
  variablesMapping: Record<string, string>;
  onVariableChange: (key: string, val: string) => void;
  mediaUrl: string;
  onMediaUrlChange: (val: string) => void;
  hasMediaHeader: boolean;
  couponCode: string;
  onCouponCodeChange: (val: string) => void;
  offerExpirationMinutes?: number | "";
  onOfferExpirationMinutesChange: (val?: number | "") => void;
  thumbnailProductRetailerId: string;
  onThumbnailProductRetailerIdChange: (val: string) => void;
  carouselCardsData: CampaignCard[];
  onCarouselCardsDataChange: (cards: CampaignCard[]) => void;
  carouselProducts: CarouselProduct[];
  onCarouselProductsChange: (products: CarouselProduct[]) => void;
  mappingOptions: { label: string; value: string }[];
  locationData?: { latitude: string; longitude: string; name?: string; address?: string };
  onLocationDataChange?: (data: { latitude: string; longitude: string; name?: string; address?: string }) => void;
}

export interface TimingConfigProps {
  delayValue: number | "";
  onDelayValueChange: (value: number | "") => void;
  delayUnit: DelayUnit;
  onDelayUnitChange: (value: DelayUnit) => void;
}

export interface CataloguesSectionProps {
  wabaId: string;
  onToggleSidebar?: () => void;
}

export interface ChatbotCardProps {
  chatbot: Chatbot;
  onEdit: (chatbot: Chatbot) => void;
  onDelete: (id: string) => void;
  onTrain: (chatbot: Chatbot) => void;
}

export interface ChatbotFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  editItem?: Chatbot | null;
  wabaId: string;
}

export interface ChatbotGridProps {
  items: Chatbot[];
  isLoading: boolean;
  onEdit: (chatbot: Chatbot) => void;
  onDelete: (id: string) => void;
  onTrain: (chatbot: Chatbot) => void;
  onAdd: () => void;
}

export interface ChatbotSectionProps {
  wabaId: string;
  onToggleSidebar?: () => void;
}

export interface ChatbotTrainSectionProps {
  chatbot: Chatbot;
  onBack: () => void;
}

export interface ReplyMaterialCardProps {
  item: ReplyMaterial;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onEdit: (item: ReplyMaterial) => void;
  onDelete: (id: string) => void;
}

export interface ReplyMaterialEmptyStateProps {
  type: ReplyMaterialType;
  onAdd: () => void;
}

export interface ReplyMaterialFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
  config: ReplyMaterialSidebarItem;
  editItem?: ReplyMaterial | null;
  wabaId: string;
}

export interface ReplyMaterialGridProps {
  items: ReplyMaterial[];
  type: ReplyMaterialType;
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  selectedIds: string[];
  onPageChange: (page: number) => void;
  onToggleSelect: (id: string) => void;
  onEdit: (item: ReplyMaterial) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export interface ReplyMaterialsContentProps {
  activeConfig: ReplyMaterialSidebarItem;
  onToggleSidebar?: () => void;
}

export interface ReplyMaterialsSidebarProps {
  activeType: ReplyMaterialType;
  onTypeChange: (type: ReplyMaterialType) => void;
  onClose?: () => void;
}

export interface SequenceCardProps {
  sequence: Sequence;
  onEdit: (sequence: Sequence) => void;
  onDelete: (id: string) => void;
  onViewSteps: (id: string) => void;
}

export interface SequenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; platform?: string }) => Promise<void>;
  isLoading: boolean;
  editItem?: Sequence | null;
}

export interface SequencesGridProps {
  items: Sequence[];
  isLoading: boolean;
  onEdit: (sequence: Sequence) => void;
  onDelete: (id: string) => void;
  onViewSteps: (id: string) => void;
  onAdd: () => void;
}

export interface SequencesSectionProps {
  wabaId: string;
  onToggleSidebar?: () => void;
}

export interface SequenceStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  sequenceId: string;
  wabaId: string;
  editStep?: SequenceStep | null;
  onSuccess: () => void;
  nextSort: number;
  platform?: string;
}

export interface SequenceStepRowProps {
  step: SequenceStep;
  index: number;
  onEdit: (step: SequenceStep) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

export interface SequenceStepsViewProps {
  sequenceId: string;
  onBack: () => void;
}

export interface TemplatesSectionProps {
  wabaId: string;
  onToggleSidebar?: () => void;
}

export interface QuickReplyCardProps {
  item: QuickReply;
  onEdit: (item: QuickReply) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  isLoading: boolean;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
}

export type FilterTab = "all" | "favorites" | "mine";

export interface QuickReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: { content: string }) => void;
  editData: QuickReply | null;
  isLoading: boolean;
}

export interface QuickReplySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}
