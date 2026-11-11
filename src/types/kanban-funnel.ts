export interface KanbanFunnel {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  funnelType: 'contact' | 'form_submission' | 'agent' | 'ecommerce_product';
  stages: KanbanStage[];
  createdAt: string;
  updatedAt: string;
}

export interface KanbanStage {
  _id?: string;
  name: string;
  color: string;
  order?: number;
}

export interface PipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<KanbanFunnel>) => Promise<void>;
  funnel?: KanbanFunnel | null;
  isLoading?: boolean;
}

export interface StageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { _id?: string; name: string; color: string }) => Promise<void>;
  stage?: Partial<KanbanStage> | null;
  isLoading?: boolean;
}

export interface ItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { priority: string; isArchived: boolean }) => void;
  item: {
    _id: string;
    title: string;
    priority?: string;
    isArchived?: boolean;
  } | null;
  isLoading?: boolean;
}

export interface PipelineManageProps {
  id: string;
}