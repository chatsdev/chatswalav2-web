import { ReactNode } from "react";
import { QuickReply } from "../redux/api/quickReplyApi";

export interface FeatureItem {
  title: string;
  description: string;
  example?: string;
}

export interface AICallingCapabilitiesProps {
  capabilities: {
    badge?: string;
    title?: string;
    subtitle?: string;
    features: FeatureItem[];
  };
  primaryColor: string;
} 

// export interface FAQItem {
//   question: string;
//   answer: string;
// }

export interface FAQItem {
  question: string;
  q?: string;
  answer: string;
  a?: string;
}

export interface AICallingFAQsProps {
  faqs: {
    badge?: string;
    title?: string;
    items: FAQItem[];
  };
  primaryColor: string;
}

export interface AICallingPageProps {
  pageData: any;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface BookingCapabilitiesProps {
  architecture: {
    title?: string;
    description?: string;
    steps: FeatureItem[];
  };
  primaryColor: string;
}

export interface BookingFAQsProps {
  faqs: {
    badge?: string;
    title?: string;
    items: FAQItem[];
  };
  primaryColor: string;
}

export interface StepItem {
  title: string;
  description: string;
  image?: string;
}

export interface BookingJourneyProps {
  bookingJourney: {
    badge?: string;
    title?: string;
    description?: string;
    steps: StepItem[];
  };
  primaryColor: string;
}

export interface ExampleItem {
  title: string;
  description: string;
}

export interface BookingUsecasesProps {
  usecases: {
    badge?: string;
    title?: string;
    examples: ExampleItem[];
  };
  primaryColor: string;
}

export interface BookingPageProps {
  pageData: any;
}

export interface NodeItem {
  name: string;
  category: string;
  type?: string;
  description: string;
  icon?: string | React.ReactNode;
}

export interface AutomationCatalogProps {
  flowNodes: {
    badge?: string;
    title?: string;
    description?: string;
    nodes: NodeItem[];
  };
  primaryColor: string;
}



export interface AutomationFAQsProps {
  faqs: {
    badge?: string;
    title?: string;
    items: FAQItem[];
  };
  primaryColor: string;
}

export type FlowNode = {
  id: string;
  type: "trigger" | "message" | "input" | "condition" | "agent" | "webhook" | "delay";
  title: string;
  subtitle: string;
  config: Record<string, any>;
};

export interface AutomationSimulatorProps {
  primaryColor: string;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface UseCaseTab {
  title: string;
  sub_title: string;
  side_image?: string;
  steps: StepItem[];
}

export interface AutomationUseCasesProps {
  useCases: {
    badge?: string;
    title?: string;
    description?: string;
    tabs: UseCaseTab[];
  };
  primaryColor: string;
}

export interface AutomationPageProps {
  pageData: any;
}



export interface BroadcastFAQsProps {
  faqs: {
    badge?: string;
    title: string;
    items: FAQItem[];
  };
}

export interface Feature {
  title: string;
  description: string;
}

export interface BroadcastFeaturesProps {
  campaignSettings: {
    badge?: string;
    title: string;
    subtitle?: string;
    features: Feature[];
  };
}

export interface TypeItem {
  title: string;
  description: string;
  icon: string;
  image?: string;
}

export interface BroadcastTemplatesProps {
  templateTypes: {
    badge?: string;
    title: string;
    description?: string;
    types: TypeItem[];
  };
  getResolvedImageUrl: (src: any, fallbackSrc?: string) => string;
}

export interface BroadcastBulkMessagesPageProps {
  pageData?: any;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface CatalogCapabilitiesProps {
  capabilities: {
    badge?: string;
    title?: string;
    features: FeatureItem[];
  };
  primaryColor: string;
}



export interface CatalogFAQsProps {
  faqs: {
    badge?: string;
    title?: string;
    items: FAQItem[];
  };
  primaryColor: string;
}

export interface CatalogItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
  stock: number;
}

export interface CatalogPlaygroundProps {
  sandbox: {
    badge?: string;
    title?: string;
    description?: string;
    card_title?: string;
    card_description?: string;
    products?: any[];
  };
  primaryColor: string;
}

export  interface TabItem {
  heading: string;
  title: string;
  description: string;
  bullets?: string[];
  image?: string;
}

export interface CatalogUseCasesProps {
  useCases: {
    badge?: string;
    title?: string;
    description?: string;
    tabs: TabItem[];
  };
  primaryColor: string;
}

export interface CatalogPageProps {
  pageData: any;
}



export interface CtwaFAQsProps {
  faqs: {
    badge?: string;
    title?: string;
    items: FAQItem[];
  };
  primaryColor: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface CtwaFeaturesProps {
  features: {
    badge?: string;
    title?: string;
    items: FeatureItem[];
  };
  primaryColor: string;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface CtwaStructureProps {
  structure: {
    badge?: string;
    title?: string;
    subtitle?: string;
    steps: StepItem[];
  };
  primaryColor: string;
}

export interface StepItem {
  title: string;
  description: string;
}

export interface CtwaWizardProps {
  stepsLaunch: {
    badge?: string;
    title?: string;
    description?: string;
    steps: StepItem[];
  };
  primaryColor: string;
}

export interface CtwaPageProps {
  pageData: any;
}

export interface CounterItem {
  counts: string;
  title: string;
  description: string;
}

export interface InboxCounterProps {
  counter: {
    badge?: string;
    title?: string;
    subtitle?: string;
    counters?: CounterItem[];
  };
  primaryColor: string;
}


export interface InboxFAQsProps {
  faqs: {
    badge?: string;
    title?: string;
    items?: FAQItem[];
  };
  primaryColor: string;
}

export interface FeatureCard {
  icon: string;
  title: string;
  description: string;
}

export interface InboxFeaturesProps {
  features: {
    badge?: string;
    title?: string;
    cards?: FeatureCard[];
  };
  primaryColor: string;
}

export interface InboxPlaygroundProps {
  sandbox: {
    badge?: string;
    title?: string;
    subtitle?: string;
    image?: string;
    side_image?: string;
  };
  primaryColor: string;
}

export interface TeamCard {
  icon: string;
  title: string;
  description: string;
}

export interface InboxTeamProps {
  team: {
    badge?: string;
    title?: string;
    description?: string;
    cards?: TeamCard[];
    side_image?: string;
    image?: string;
  };
  primaryColor: string;
}

export interface SharedInboxPageProps {
  pageData?: any;
}

export interface CapabilityItem {
  icon?: string;
  title: string;
  description: string;
  desc?: string;
}

export interface FormsCapabilitiesProps {
  capabilities: {
    badge?: string;
    title?: string;
    items: CapabilityItem[];
  };
  primaryColor: string;
} 



export interface FormsFAQsProps {
  faqs: {
    badge?: string;
    title?: string;
    items: FAQItem[];
  };
  primaryColor: string;
}

export interface PaletteItem {
  icon?: string;
  label: string;
  desc?: string;
  description?: string;
}

export interface FormsPaletteProps {
  componentsSection: {
    badge?: string;
    title?: string;
    description?: string;
    components: PaletteItem[];
  };
  primaryColor: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
  image?: string;
  customTags?: string[];
}

export interface FormsWorkflowProps {
  workflow: {
    badge?: string;
    title?: string;
    description?: string;
    steps: WorkflowStep[];
  };
  primaryColor: string;
}

export interface FormsPageProps {
  pageData: any;
}

export interface FeatureBlock {
  title: string;
  description: string;
  image: any;
  imageAlt: string;
}

export interface UseCase {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface ProductPageTemplateProps {
  hero: {
    badge?: string;
    title: string;
    description: string;
    primaryCTA?: { text: string; link: string };
    secondaryCTA: { text: string; link: string };
    image: any;
  };
  features: FeatureBlock[];
  useCases: UseCase[];
  finalCTA: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export interface ChatThemeProviderProps {
  children: React.ReactNode;
}

export interface DynamicSettingsProviderProps {
  children: ReactNode;
}

export type FilterTab = "all" | "favorites" | "mine";

