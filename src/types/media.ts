// Media types

import { Attachment } from "./components";


export interface FileItem {
  file: File;
  previewUrl: string;
}

export interface MediaGridProps {
  mediaType?: string;
  onSelect?: (url: string) => void;
}

export interface MediaUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUploaded?: (url: string) => void;
}

export interface MediaDetailModalProps {
  media: {
    _id: string;
    url: string;
    media_type: string;
    file_name?: string;
    file_size?: number;
    created_at?: string;
  };
  onClose: () => void;
}

export interface MediaDetailModalData {
  isOpen: boolean;
  onClose: () => void;
  attachment: Attachment | null;
}

export interface MediaGridPropsData {
  attachments: Attachment[];
  selectedItems: string[];
  onSelect: (id: string, shiftKey?: boolean) => void;
  onItemClick: (attachment: Attachment) => void;
  isSelectionEnabled?: boolean;
}

export interface MediaUploadModalPropsData {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}
