import { Tag } from "./components";

export interface TagCardProps {
  tag: Tag;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
} 

export interface TagGridProps {
  tags: Tag[];
  isLoading: boolean;
  isFetching: boolean;
  totalCount: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onEdit: (tag: Tag) => void;
  onDelete: (id: string) => void;
  emptyMessage?: string;
}