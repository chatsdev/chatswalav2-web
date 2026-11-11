import { KanbanFunnel } from "./kanban-funnel";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;

  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;

  variant?: "default" | "danger" | "warning" | "success" | "info" | "primary";

  iconId?: string;
  showIcon?: boolean;
  showCancelButton?: boolean;
  loadingText?: string;
}

export interface Column<T> {
  id?: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  copyable?: boolean;
  copyField?: keyof T;
  sortable?: boolean;
  sortKey?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
  // Pagination entries
  totalCount?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isFetching?: boolean;
  // Selection
  enableSelection?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  getRowId?: (item: T) => string;
  // Sorting
  onSortChange?: (sortBy: string, sortOrder: "asc" | "desc") => void;
  actionPermission?: string[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ImageProps {
  src: any;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  unoptimized?: boolean;
  fill?: boolean;
}

export interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: React.FocusEventHandler;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
  name?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface FlagProps {
  countryCode: string;
  className?: string;
  size?: number;
}

export interface MaterialPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  material: any;
  platform?: string;
}

export interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (type: "csv" | "excel" | "print") => void;
  title: string;
  description: string;
  selectedCount?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  totalCount?: number;
}

export interface CanProps {
  permission?: string;
  anyPermission?: string[];
  module?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface CookiePreferences {
  essential: boolean;
  analytical: boolean;
  marketing: boolean;
}

export interface FunnelStageAction { 
  funnelId: string;
  toStageId: string;
}

export interface FunnelStageDropdownProps {
  funnels: KanbanFunnel[];
  selectedActions: FunnelStageAction[];
  onChange: (actions: FunnelStageAction[]) => void;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

export interface LocationData {
  latitude: string;
  longitude: string;
  name?: string;
  address?: string;
}

export interface LocationMapPickerProps {
  value: LocationData;
  onChange: (data: LocationData) => void;
}

export interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}
