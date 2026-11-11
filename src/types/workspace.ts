
export interface Workspace {
  _id: string;
  name: string;
  description?: string;
  waba_id: string | null;
  waba_type: string | null;
  connection_status?: string;
  is_active?: boolean;
  created_at?: string;
  user_id?: string;
  whatsapp_connection_id?: string | null;
  telegram_connection_id?: string | null;
  instagram_connection_id?: string | null;
  facebook_connection_id?: string | null;
}

export interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

export interface UserMenuProps {
  user: {
    name?: string;
    email?: string;
  } | null;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onLogout: () => void;
  initials: string;
}

export interface WorkspaceCardProps {
  workspace: Workspace;
  isActive: boolean;
  onSelect: () => void;
  onConnectWaba: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isAgent?: boolean;
}

export interface WorkspaceEmptyStateProps {
  isAgent: boolean;
  onLogout: () => void;
  onCreateFirst: () => void;
}

export interface WorkspaceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace?: Workspace | null;
}

export interface WorkspaceHeaderProps {
  logoUrl?: string;
  appName?: string;
  title: string;
  description: string;
  badgeText: string;
}

export interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}
