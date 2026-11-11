// Agent types

import { AgentTask, AgentTaskComment } from "./agentTask";
import { Agent } from "./components";

export type AgentInput = Omit<Agent, "created_at" | "updated_at" | "role" | "_id"> & {
  password?: string;
  team_id?: string;
};

export interface AgentKanbanStatus {
  funnelId: string;
  stageId: string;
}

export interface AgentFormProps {
  initialData?: Partial<Agent>;
  onSave: (data: AgentInput) => Promise<void>;
  isLoading?: boolean;
}

export interface AgentTaskCommentsProps {
  taskId: string;
}

export interface AgentTaskDetailProps {
  taskId: string;
  onClose?: () => void;
}

export interface AgentTaskListSidebarProps {
  onSelectTask: (taskId: string) => void;
  selectedTaskId?: string | null;
}

export interface AgentTaskCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface AgentTaskFormFieldsProps {
  values: any;
  onChange: (field: string, value: any) => void;
  agents?: any[];
  contacts?: any[];
}

export interface AgentFormdDataProps {
  agent?: Agent | null;
  onSave: (data: AgentInput) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export interface AgentTaskCommentsProps {
  taskId: string;
  comments: AgentTaskComment[];
}

export interface AgentTaskCreateFormProps {
  agentId: string;
  taskId?: string;
}

export interface AgentTaskFormFieldsData {
  agentId: string;
  taskId?: string;
  initialData?: AgentTask;
}

export interface AgentTaskDetailProps {
  taskId: string;
  onToggleSidebar?: () => void;
}

export interface AgentTaskListSidebarData {
  agentId: string;
  onSelectTask?: () => void;
  onClose?: () => void;
} 


export interface AgentKanbanActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent | null;
}