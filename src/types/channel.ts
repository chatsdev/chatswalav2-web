import { ChannelInfo } from "../data/ChannelConnectionInfo";

export interface Feature {
  badge?: string;
  title: string;
  description: string;
  image?: string;
  fallback?: string;
}

export interface FacebookFeaturesProps { 
  featuresSection: {
    badge?: string;
    title: string;
    subtitle?: string;
    features: Feature[];
  };
  getResolvedImageUrl: (src: any, fallbackSrc?: string) => string;
  fbGradient: string;
}
export interface FacebookSalesCTAProps {
  sales: {
    title: string;
    subtitle?: string;
    button1_title: string;
    button1_url: string;
    button2_title?: string;
    button2_url?: string;
    bullets: string[];
  };
  isAuthenticated: boolean;
  fbGradient: string;
  router: { push: (url: string) => void };
}

export interface Step {
  title: string;
  description: string;
}

export interface FacebookStepsProps {
  stepsSection: {
    badge?: string;
    title: string;
    subtitle?: string;
    steps: Step[];
  };
  fbGradient: string;
}

export interface Tool {
  icon: string;
  title: string;
  description: string;
}

export interface FacebookToolsProps {
  toolsSection: {
    badge?: string;
    title: string;
    sub_title?: string;
    tools: Tool[];
  };
  fbGradient: string;
  fbGradientLight: string;
}

export interface FacebookPageProps {
  pageData?: any;
}

export interface Feature {
  badge?: string;
  title: string;
  description: string;
  image?: string;
  fallback?: string;
}

export interface InstagramFeaturesProps {
  featuresSection: {
    badge?: string;
    title: string;
    subtitle?: string;
    features: Feature[];
  };
  getResolvedImageUrl: (src: any, fallbackSrc?: string) => string;
  igGradient: string;
}

export interface InstagramPlaygroundProps {
  commentSection: {
    badge?: string;
    title?: string;
    subtitle?: string;
    card_title?: string;
    keywords?: string[];
    bullets?: string[];
  };
}

export interface InstagramSalesCTAProps {
  sales: {
    title: string;
    subtitle?: string;
    button1_title?: string;
    button1_url?: string;
    button2_title?: string;
    button2_url?: string;
    button2_description?: string;
    bullets?: string[];
  };
  isAuthenticated: boolean;
  router: { push: (url: string) => void };
}

export interface Step {
  title: string;
  description: string;
}

export interface InstagramStepsProps {
  stepsSection: {
    badge?: string;
    title?: string;
    subtitle?: string;
    steps?: Step[];
  };
}

export interface InstagramPageProps {
  pageData?: any;
}

export interface Feature {
  badge?: string;
  title: string;
  description: string;
  image?: string;
  fallback?: string;
}

export interface TelegramFeaturesProps {
  featuresSection: {
    badge?: string;
    title: string;
    subtitle?: string;
    features: Feature[];
  };
  getResolvedImageUrl: (src: any, fallbackSrc?: string) => string;
  tgGradient: string;
  primaryColor: string;
}

export interface TelegramSalesCTAProps {
  sales: {
    title: string;
    subtitle?: string;
    button1_title?: string;
    button1_url?: string;
    button2_title?: string;
    button2_url?: string;
    button2_description?: string;
    bullets?: string[];
  };
  isAuthenticated: boolean;
  router: { push: (url: string) => void };
  primaryColor: string;
  tgGradient: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface TelegramStepsProps {
  stepsSection: {
    badge?: string;
    title?: string;
    subtitle?: string;
    steps?: Step[];
  };
  primaryColor: string;
  tgGradient: string;
}

export interface TelegramPageProps {
  pageData?: any;
}

export interface ComparisonRow {
  platform_feature: string;
  whatsapp_feature: string;
  official_api: string;
}

export interface ComparisonTableProps {
  comparison: {
    badge?: string;
    title: string;
    subtitle?: string;
    platform_feature_array: ComparisonRow[];
  };
  primaryColor: string;
}

export interface Feature {
  title: string;
  description: string;
  bullets?: string[];
  image?: string;
}

export interface FeatureShowcaseProps {
  featuresSection: {
    badge?: string;
    title: string;
    sub_title?: string;
    features: Feature[];
  };
  activeFeatureIndex: number;
  setActiveFeatureIndex: (idx: number) => void;
  imageError: boolean;
  setImageError: (err: boolean) => void;
  getWhatsAppIcon: (idx: number) => React.ReactNode;
}

export interface SalesCTAProps {
  sales: {
    title: string;
    subtitle?: string;
    button1_title: string;
    button1_url: string;
    button2_title?: string;
    button2_url?: string;
    bullets: string[];
  };
  isAuthenticated: boolean;
  primaryColor: string;
  router: { push: (url: string) => void };
}

export interface Step {
  title: string;
  description: string;
}

export interface StepTimelineProps {
  stepsSection: {
    badge?: string;
    title: string;
    subtitle?: string;
    steps: Step[];
  };
  primaryColor: string;
}

export interface WhatsAppPageProps {
  pageData?: any;
}

export interface ChannelConnectionGuideProps {
  info: ChannelInfo;
} 

export interface TelegramConnectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onSuccess: () => void;
}

export interface TwitterConnectModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  onSuccess: () => void;
}