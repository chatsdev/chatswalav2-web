export interface Segment {
  _id: string;
  name: string;
  description?: string;
  member_count?: number;
  created_at: string;
} 

export interface SegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description?: string; contactIds?: string[] }) => void;
  segment?: any;
  isLoading?: boolean;
}