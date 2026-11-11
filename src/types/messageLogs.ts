export interface MessageLogsDetailsModalProps {
  selectedMessage: any | null;
  onClose: () => void;
}

export interface MessageLogsFilterProps {
  platformFilter: string;
  setPlatformFilter: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  timeFilter: string;
  setTimeFilter: (val: string) => void;
  searchTerm: string;
  handleClearFilters: () => void;
}