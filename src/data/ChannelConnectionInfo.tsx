import {
  Award,
  Bot,
  CheckCircle,
  FileText,
  Key,
  Link,
  MessageSquareCode,
  Settings2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ReactNode } from "react";

export interface ConnectionStep {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface ChannelInfo {
  title: string;
  subtitle: string;
  brandColor: string; // Tailwind class color
  gradientClass: string; // Background gradient class
  icon: ReactNode;
  requirements: string[];
  steps: ConnectionStep[];
  features: {
    title: string;
    description: string;
    icon: ReactNode;
  }[];
  proTip: string;
}

export const CHANNEL_CONNECTION_DATA: Record<
  "telegram" | "facebook" | "instagram",
  ChannelInfo
> = {
  telegram: {
    title: "Telegram Bot Setup Guide",
    subtitle:
      "Complete these steps to link your Telegram channel and enable automated workflows.",
    brandColor: "#229ED9",
    gradientClass: "from-[#229ED9]/10 via-[#229ED9]/5 to-transparent",
    icon: <Bot className="w-6 h-6 text-[#229ED9]" />,
    requirements: [
      "An active Telegram Account",
      "Access to Telegram Web/App",
      "A unique name for your Telegram Bot",
    ],
    steps: [
      {
        title: "Locate BotFather",
        description:
          "Open Telegram and search for the official @BotFather account (look for the verified badge).",
        icon: <Bot className="w-5 h-5" />,
      },
      {
        title: "Create New Bot",
        description:
          "Send the /newbot command to @BotFather and follow instructions to name your bot and choose a username.",
        icon: <MessageSquareCode className="w-5 h-5" />,
      },
      {
        title: "Retrieve API Token",
        description:
          "BotFather will generate an HTTP API access token (e.g. 123456789:ABCdefGhIJKlmNoPQRsTuvw). Copy this token safely.",
        icon: <Key className="w-5 h-5" />,
      },
      {
        title: "Connect Bot Here",
        description:
          "Click 'Connect Bot', paste your API token in the modal, and submit to finalize the linkage.",
        icon: <Link className="w-5 h-5" />,
      },
    ],
    features: [
      {
        title: "Automate Support",
        description: "Let AI bots handle customer FAQs and routing 24/7.",
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        title: "Broadcast Campaigns",
        description:
          "Send promotions, alerts, and newsletters to all subscribers at once.",
        icon: <Award className="w-4 h-4" />,
      },
      {
        title: "Rich Interactive Media",
        description: "Engage users with buttons, menus, and images.",
        icon: <Settings2 className="w-4 h-4" />,
      },
    ],
    proTip:
      "Never share your Bot API Token in public forums. If your token gets compromised, message @BotFather and run the /revoke command to generate a new token immediately.",
  },
  facebook: {
    title: "Facebook Integration Guide",
    subtitle:
      "Authorize page access to sync customer inbox communications and capture marketing leads.",
    brandColor: "#1877F2",
    gradientClass: "from-[#1877F2]/10 via-[#1877F2]/5 to-transparent",
    icon: <ShieldCheck className="w-6 h-6 text-[#1877F2]" />,
    requirements: [
      "A personal Facebook Profile",
      "An active Facebook Business Page",
      "Admin permissions on the target Page",
      "Meta Business Portfolio access (recommended)",
    ],
    steps: [
      {
        title: "Initiate Authentication",
        description:
          "Click 'Connect' to open the secure Meta OAuth authorization popup.",
        icon: <Link className="w-5 h-5" />,
      },
      {
        title: "Select Facebook Pages",
        description:
          "Select one or more Facebook Business Pages you want to connect to this workspace.",
        icon: <FileText className="w-5 h-5" />,
      },
      {
        title: "Grant Permissions",
        description:
          "Ensure all permissions (Manage pages, send messages, access leads) are toggled to YES.",
        icon: <ShieldCheck className="w-5 h-5" />,
      },
      {
        title: "Synchronize Inbox",
        description:
          "Once linked, go to 'Click To WhatsApp Ads' or 'Lead Generation Forms' to begin managing campaigns.",
        icon: <CheckCircle className="w-5 h-5" />,
      },
    ],
    features: [
      {
        title: "Omnichannel Inbox",
        description:
          "Reply to Facebook comments and Messenger chats directly from the interface.",
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        title: "Lead Ads Sync",
        description:
          "Instantly capture leads from Facebook Instant Forms and trigger instant auto-replies.",
        icon: <Award className="w-4 h-4" />,
      },
      {
        title: "Click-to-WhatsApp Ads",
        description:
          "Launch campaigns that redirect Facebook users to WhatsApp chats smoothly.",
        icon: <Settings2 className="w-4 h-4" />,
      },
    ],
    proTip:
      "If your Facebook page doesn't appear in the connection list, check your Meta Business Suite settings and make sure your personal account has 'Full Control' or 'Admin access' to that Page.",
  },
  instagram: {
    title: "Instagram Connection Guide",
    subtitle:
      "Link your Professional Instagram account to engage with followers and automate message replies.",
    brandColor: "#E1306C",
    gradientClass: "from-[#E1306C]/10 via-[#E1306C]/5 to-transparent",
    icon: <Sparkles className="w-6 h-6 text-[#E1306C]" />,
    requirements: [
      "Instagram Business or Creator Account",
      "Linked Facebook Business Page",
      "Admin Access to that linked Facebook Page",
    ],
    steps: [
      {
        title: "Convert to Professional",
        description:
          "Ensure your Instagram is converted to a Business or Creator account in mobile settings.",
        icon: <Settings2 className="w-5 h-5" />,
      },
      {
        title: "Link Facebook Page",
        description:
          "Go to your Facebook Page Settings > Linked Accounts > Instagram, and connect your Instagram profile.",
        icon: <Link className="w-5 h-5" />,
      },
      {
        title: "Enable Message Access",
        description:
          "In Instagram settings, navigate to Privacy > Messages, and turn on 'Allow Access to Messages' under Connected Tools.",
        icon: <ShieldCheck className="w-5 h-5" />,
      },
      {
        title: "Authorize & Sync",
        description:
          "Click 'Connect' here, authorize through Meta popup, and allow permission for both the Page and Instagram account.",
        icon: <CheckCircle className="w-5 h-5" />,
      },
    ],
    features: [
      {
        title: "DM Automation",
        description:
          "Run interactive chatbots, send quick replies, and auto-respond to user DMs.",
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        title: "Comment Auto-Replies",
        description:
          "Instantly reply to comments on your posts or send them a private DM trigger.",
        icon: <Award className="w-4 h-4" />,
      },
      {
        title: "Profile Syncing",
        description:
          "Collect user profile data, Instagram handles, and tags inside your contact directory.",
        icon: <Settings2 className="w-4 h-4" />,
      },
    ],
    proTip:
      "Allowing Access to Messages is a critical security setting. If this toggle is off, Meta will block our servers from receiving incoming DMs, and automation will fail.",
  },
};

export const featureSections = [
  {
    badge: "Pages Connection",
    title: "Link Your Facebook Pages",
    description:
      "Connect and manage all your Facebook business pages in one clean dashboard. Choose which page sends automated messages to customers.",
    image: "",
  },
  {
    badge: "Lead Ads Integration",
    title: "Save Customer Form Details",
    description:
      "Instantly save details when customers fill out forms on your Facebook ads. Save their info directly to your contact list and reply to them automatically.",
    image: "",
  },
  {
    badge: "Analytics Engine",
    title: "View Simple Ad Reports",
    description:
      "Understand how your ads are doing. See simple counts of clicks, views, cost-per-lead, and how many people you have reached.",
    image: "",
  },
];

export const toolsSections = [
  {
    icon: "Inbox",
    title: "Unified Inbox",
    description: "Manage all customer chat messages in one single inbox",
  },
  {
    icon: "Workflow",
    title: "Simple Reply Flows",
    description:
      "Build automated answers for customers using a visual layout builder",
  },
  {
    icon: "FileText",
    title: "Message Templates",
    description:
      "Create easy pre-written answers with clickable customer buttons",
  },
  {
    icon: "Megaphone",
    title: "Bulk Messaging",
    description:
      "Send one message to multiple customer groups at the same time",
  },
  {
    icon: "Tag",
    title: "Word Auto-Replies",
    description:
      "Instantly reply when customers type words like 'price' or 'help'",
  },
  {
    icon: "ActivitySquare",
    title: "Delivery Reports",
    description:
      "Check whether messages have been successfully sent, delivered, or read",
  },
];

export const stepsSections = [
  {
    title: "Log In Securely",
    description:
      "Log in with your Facebook account via our secure official connection.",
  },
  {
    title: "Select Pages & Ads",
    description: "Pick the Facebook pages and active ads you want to connect.",
  },
  {
    title: "Link Your Forms",
    description:
      "Choose how to save info when customers fill out your ad forms.",
  },
  {
    title: "Automate & Reply",
    description:
      "Watch new customer leads get saved and answered automatically.",
  },
];

export const Telegram = {
  title: "Turn Instagram Comments into Customers",
  subtitle:
    "Connect your account in seconds, write automatic reply buttons, and send discount codes to direct messages instantly.",
  button1_title: "Try For Free",
  button1_url: "/signup",
  button2_title: "Talk to Sales",
  button2_url: "/pricing",
  bullets: ["Easy Sign In", "Official Connection", "Cancel Anytime"],
};

export const defaultSteps = [
  {
    title: "Link Your Account",
    description:
      "Connect your business page securely using your Instagram log in details.",
  },
  {
    title: "Choose Reply Words",
    description:
      "Select the key words (like 'price') that customers use when they want to get details.",
  },
  {
    title: "Create Your Answers",
    description:
      "Type in the answers or activate our AI helper to answer customer questions automatically.",
  },
  {
    title: "Launch & Grow",
    description:
      "Watch comment words automatically send direct messages and turn followers into customers!",
  },
];

export const instagramFeatures = [
  {
    badge: "Boost Sales",
    title: "Reply Instantly to Comments",
    description:
      "Automatically send discount codes, PDF links, or product catalogs directly to customers' DMs the second they comment on your posts or Reels.",
    image: "",
  },
  {
    badge: "Safe & Clean",
    title: "Keep Comments Clean",
    description:
      "Keep your posts friendly. Our system instantly filters, hides, or deletes spam, competitor links, and bad words from your comments section automatically.",
    image: "",
  },
  {
    badge: "No Code Needed",
    title: "Design Customer Chat Routes",
    description:
      "Draw out the exact steps you want customers to take. Set up questions, capture their email, and tag them based on what they are interested in.",
    image: "",
  },
  {
    badge: "AI Support",
    title: "24/7 Smart AI Chatbot",
    description:
      "Train an AI helper on your website links or business details. It will answer customer questions about pricing and product availability around the clock.",
    image: "",
  },
];

export const defaultTelegramSales = {
  title: "Automate Your Telegram Chat Today",
  subtitle:
    "Connect your account in seconds, write easy reply buttons, set up key word detection, and view all chats in real-time.",
  button1_title: "Try For Free",
  button1_url: "/signup",
  button2_title: "Talk to Sales",
  button2_url: "/pricing",
  bullets: ["Easy Sign In", "Official Connection", "Cancel Anytime"],
};

export const defaultTelegramSteps = [
  {
    title: "Link Your Chat",
    description:
      "Enter your Telegram account link details to connect your chat securely in one second.",
  },
  {
    title: "Choose Reply Words",
    description:
      "Pick key words that customers often ask (like 'price', 'delivery') so your chat knows what to answer.",
  },
  {
    title: "Create Answers",
    description:
      "Type out your answer messages and add helpful quick buttons for customers to click.",
  },
  {
    title: "Start Answering",
    description:
      "Your chat assistant is ready! It will automatically reply to customer questions 24 hours a day.",
  },
];

export const telegramFeatures = [
  {
    badge: "Quick Connection",
    title: "Easy Account Setup",
    description:
      "Connect your Telegram business account instantly with just a single copy-paste step.",
    image: "",
  },
  {
    badge: "Interactive Buttons",
    title: "Messages with Quick Buttons",
    description:
      "Write answers that include clickable buttons so your customers can reply or visit links in one tap.",
    image: "",
  },
  {
    badge: "Automatic Replies",
    title: "Word Detection Rules",
    description:
      "Tell your account to automatically send specific answers whenever a customer types words like 'price' or 'help'.",
    image: "",
  },
  {
    badge: "Message History",
    title: "Real-Time Message Logs",
    description:
      "Keep track of all sent, delivered, and read messages in a simple list view.",
    image: "",
  },
];

export const platformFeatures = [
  {
    platform_feature: "Multi-Agent Support",
    whatsapp_feature: "Max 4 devices (Single device focus)",
    official_api: "Unlimited agents, dynamic routing",
  },
  {
    platform_feature: "Broadcast Limits",
    whatsapp_feature: "Max 256 contacts per list (Risk of Ban)",
    official_api: "Unlimited broadcasts, safe delivery",
  },
  {
    platform_feature: "Auto-Reply Bots",
    whatsapp_feature: "Extremely basic auto-responder",
    official_api: "Visual flow builder + AI Support",
  },
  {
    platform_feature: "Green Tick Verification",
    whatsapp_feature: "Not available for standard accounts",
    official_api: "Official verified green tick badge",
  },
  {
    platform_feature: "CRM & API Integrations",
    whatsapp_feature: "No Webhook or API connections",
    official_api: "Robust REST APIs + Webhooks ready",
  },
];

export const featureWhatsappSections = [
  {
    title: "Shared Team Inbox",
    description:
      "Let your entire sales and customer service team chat with customers using a single WhatsApp number. Direct customer messages to the right team member automatically.",
    bullets: [
      "Send chats to the right person",
      "Write notes only your team can see",
    ],
    image: "",
  },
  {
    title: "Visual Reply Builder",
    description:
      "Create simple automatic replies for customer questions. Set up answers that trigger when customers type specific words or tap buttons.",
    bullets: ["Taps and words trigger replies", "Add interactive options menu"],
    image: "",
  },
  {
    title: "Bulk Messaging",
    description:
      "Send announcements or notifications to thousands of customers at once. Add their names or personal details to make messages friendly.",
    bullets: [
      "Add customer names automatically",
      "See who opened and clicked links",
    ],
    image: "",
  },
  {
    title: "Smart AI Calling",
    description:
      "Let smart voice assistants make and answer phone calls for your business. Help customers get information without waiting on hold.",
    bullets: ["Clear and friendly AI voices", "See summary logs of every call"],
    image: "",
  },
  {
    title: "Easy Scheduling",
    description:
      "Let customers book appointments and schedule meetings directly inside the WhatsApp chat window. No outside links needed.",
    bullets: [
      "Choose calendar dates in chat",
      "Send automated appointment reminders",
    ],
    image: "",
  },
  {
    title: "Send Simple Forms",
    description:
      "Create and send simple forms inside the chat so customers can fill out their details, sign up, or share info without leaving WhatsApp.",
    bullets: [
      "Fill out forms inside the chat",
      "Save customer answers instantly",
    ],
    image: "",
  },
  {
    title: "AI Chat Assistant",
    description:
      "Train an AI helper using your own business files or website links. It can answer customer questions about pricing and product availability 24/7.",
    bullets: [
      "AI answers customer questions",
      "Hand over to a real person if needed",
    ],
    image: "",
  },
  {
    title: "Link Your Existing Tools",
    description:
      "Connect WhatsApp with the tools you already use like Shopify or your customer database. Send messages automatically when orders are placed or shipped.",
    bullets: [
      "Connect with tools like Shopify",
      "Send messages automatically when things update",
    ],
    image: "",
  },
  {
    title: "Showcase Your Products",
    description:
      "Display your product inventory, catalog items, and pictures directly in the chat. Let customers select items and check out right inside WhatsApp.",
    bullets: [
      "Show product lists and pictures",
      "Quick and easy checkout in chat",
    ],
    image: "",
  },
];

export const stepsWhatsappSection = [
  {
    title: "Link Your Phone",
    description:
      "Connect your business phone number by scanning a simple QR code in 30 seconds.",
  },
  {
    title: "Upload Contact List",
    description:
      "Upload your customer phone list or link directly with your existing Shopify or CRM tool.",
  },
  {
    title: "Design Chat Flows",
    description:
      "Type out your answers or design automated reply menus using our visual builder.",
  },
  {
    title: "Start Answering",
    description:
      "Turn on your assistant, send bulk messages, and watch conversations happen automatically.",
  },
];

export const defaultInstagramSales = {
  title: "Turn Instagram Comments into Customers",
  subtitle:
    "Connect your account in seconds, write automatic reply buttons, and send discount codes to direct messages instantly.",
  button1_title: "Try For Free",
  button1_url: "/signup",
  button2_title: "Talk to Sales",
  button2_url: "/pricing",
  bullets: ["Easy Sign In", "Official Connection", "Cancel Anytime"],
};
