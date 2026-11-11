export interface BaseNodeProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  borderColor?: string;
  handleColor?: string;
  errors?: string[];
  children: React.ReactNode;
  showInHandle?: boolean;
  showOutHandle?: boolean;
  headerRight?: React.ReactNode;
  className?: string;
}

export interface NodeFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export type AssignMode = "all" | "team"; 

export interface AIAutomationFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: string;
  onApplyAI: (flowData: any) => void;
}

export interface ChannelOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  borderHover: string;
  textHover: string;
  glowColor: string;
}

export interface ChannelSelectModalProps {
  isOpen: boolean;
  onSelect: (platform: string) => void;
  onBack?: () => void;
}

export interface ExecutionLogsProps {
  executionLogs: any[];
}

export interface KeywordHintsProps {
  triggerKeywords: string[];
  onKeywordClick: (keyword: string) => void;
}
 
export interface ChatMessage {
  id: string;
  sender: "user" | "bot" | "system";
  text: string;
  timestamp: string;
  messageType?: string;
  mediaUrl?: string;
  buttons?: Array<{ id: string; title: string }>;
  listParams?: {
    header?: string;
    body?: string;
    footer?: string;
    buttonTitle?: string;
    items?: Array<{ id: string; title: string; description?: string }>;
  };
  locationParams?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
}

export interface PhoneSimulatorProps {
  messages: ChatMessage[];
  isTyping: boolean;
  inputText: string;
  setInputText: (text: string) => void;
  activeListSheet: ChatMessage | null;
  setActiveListSheet: (msg: ChatMessage | null) => void;
  executeSendMessage: (text: string, interactiveId?: string) => Promise<void>;
  isTesting: boolean;
  handleReset: (silent?: boolean) => Promise<void>;
  pDetails: {
    name: string;
    color: string;
    icon: React.ReactNode;
    avatarColor: string;
    userBubbleColor: string;
  };
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export interface TestFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  flowId: string;
  flowName: string;
  platform: string;
  getUnsavedFlowPayload: () => {
    triggers: any[];
    nodes: any[];
    connections: any[];
  };
}
