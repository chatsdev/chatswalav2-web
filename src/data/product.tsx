import {
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Gift,
  ImageIcon,
  Link2,
  Phone,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Ticket,
  Users,
} from "lucide-react";

export const featuresCapabilities = [
  {
    title: "AI Knowledge Training",
    description:
      "Train your voice agent with system instructions and custom prompts to answer client inquiries contextually.",
    example:
      "Example: Restaurant agent answering menu availability and reservations.",
  },
  {
    title: "Voice & Speech Engines",
    description:
      "Integrate ElevenLabs and OpenAI voices to convert client speech to text and read back natural vocal replies.",
    example:
      "Example: Converting incoming calls to text and speaking responses back.",
  },
  {
    title: "API Function Triggers",
    description:
      "Trigger REST APIs when keywords are spoken, collecting required parameter inputs automatically.",
    example:
      "Example: Triggering order status check when customer says 'status'.",
  },
  {
    title: "Welcome & Hangup Config",
    description:
      "Configure greetings when calls answer, and set keyword triggers to play farewells and disconnect calls.",
    example: "Example: Auto disconnect when client says 'goodbye' or 'exit'.",
  },
  {
    title: "Recordings & Transcripts",
    description:
      "Store conversation transcripts and audio recording buffers dynamically for both user and agent.",
    example:
      "Example: Exporting support conversation records for staff review.",
  },
];

export const faqItems = [
  {
    question: "Which AI Models are supported?",
    answer:
      "The call agent uses Gemini models configured via your API key inside the backend settings.",
  },
  {
    question: "How do speech-triggered functions work?",
    answer:
      "You can map triggers to active keyword sets. When client speech matches a keyword, the bot calls the defined API endpoint, passes parameters, and speaks the response context.",
  },
  {
    question: "Are call recordings stored?",
    answer:
      "Yes. All conversations are recorded, and full speech-to-text transcripts are saved inside the call history logs dashboard.",
  },
];

export const bgColors = [
  "bg-rose-50 border-rose-100/60 text-rose-600",
  "bg-purple-50 border-purple-100/60 text-purple-600",
  "bg-blue-50 border-blue-100/60 text-blue-600",
  "bg-light-primary border-[var(--primary-opacity-20)]/60 text-primary",
];

export const bookingSteps = [
  {
    title: "Browse & Select",
    description:
      "Clients browse availability dates and pick specialist slots natively inside WhatsApp — no website redirects needed.",
    image: null,
  },
  {
    title: "Deposit & Lock",
    description:
      "Reduce no-shows by collecting secure booking deposit fees directly inside the chat with one-tap payment.",
    image: null,
  },
  {
    title: "Calendar Sync",
    description:
      "Reserved slots write immediately to Google/Outlook calendar to block conflicts in real time.",
    image: null,
  },
];

export const usecaseExamples = [
  {
    title: "Medical Clinics",
    description:
      "Patients select doctors, choose open times, and answer simple pre-consultation health questions (e.g. allergies) straight from WhatsApp chat bubbles.",
  },
  {
    title: "Spas & Salons",
    description:
      "Beauty salons and spas let customers choose specific therapist operators, book massage slots, and secure bookings via reservation links.",
  },
  {
    title: "Sales Demos",
    description:
      "B2B consultancies sync corporate Google calendars. When prospects interact with the WhatsApp Flow, they book Zoom video meet calls.",
  },
  {
    title: "Coaching & Consulting",
    description:
      "Lawyers, coaches, and advisory consultants collect diagnostic details, reserve slots, and handle initial deposit fees securely in-chat.",
  },
];

export const architectureSteps = [
  {
    title: "Native WhatsApp Flows",
    description:
      "Build multi-step scheduling forms that display calendar lists natively inside WhatsApp without loading web browser links.",
  },
  {
    title: "Calendar Integrations",
    description:
      "Establish bi-directional updates with Google Calendar, Outlook, and major CRM sheets to block booked slot items instantly.",
  },
  {
    title: "No-Show Reminders",
    description:
      "Dispatch automated follow-up warnings (24 hours or 2 hours prior) via WhatsApp, helping businesses cut down missed bookings.",
  },
  {
    title: "Timezone Sync Adaptation",
    description:
      "Automatically shifts slot timings based on the client's local phone coordinates, preventing scheduling errors across countries.",
  },
];

export const bookingFaqItems = [
  {
    question: "How does the calendar sync prevent overlap?",
    answer:
      "Operates with real-time API integrations. Whenever a customer opens the WhatsApp Flow scheduler form, It queries your Google/Outlook calendar to block out slots that contain existing events.",
  },
  {
    question: "Can customers reschedule or cancel their slots?",
    answer:
      "Absolutely. The confirmation cards dispatched to WhatsApp contain reschedule and cancel CTA buttons. Clicking them releases the blocked calendar slot and allows picking a new timing.",
  },
  {
    question: "Does it support multiple timezones?",
    answer:
      "Yes. Timezones are managed dynamically. When a client triggers the scheduling form, the system automatically detects their phone's local timezone settings and displays calendar slot schedules adjusted accordingly.",
  },
];

export const catalogNodesFallback = [
  {
    name: "Automation Entry",
    category: "START",
    description:
      "Launches the bot sequence whenever keyword matches, campaigns trigger, or dynamic variables match.",
    icon: "Play",
  },
  {
    name: "Send Message",
    category: "MESSAGING",
    description:
      "Sends a rich text format layout bubble with personalized custom attributes directly to customers.",
    icon: "MessageSquare",
  },
  {
    name: "Quick Reply",
    category: "MESSAGING",
    description:
      "Configures clickable buttons (up to 3) allowing clients to choose options instantly without typing.",
    icon: "CheckCircle2",
  },
  {
    name: "Form Flow",
    category: "MESSAGING",
    description:
      "Triggers sequential nested message collections to capture customer details like a visual form.",
    icon: "FileText",
  },
  {
    name: "Send Template",
    category: "MESSAGING",
    description:
      "Sends pre-approved Meta message templates with headers, footers, and custom variable parameters.",
    icon: "Grid",
  },
  {
    name: "Call to Action",
    category: "MESSAGING",
    description:
      "Sends interactive layout buttons linked to phone dialing or external web URLs (e.g. pay links).",
    icon: "Sparkles",
  },
  {
    name: "Selection List",
    category: "INTERACTIONS",
    description:
      "Presents a structured menu list containing sections and row items (up to 10) for organized options selection.",
    icon: "Layers",
  },
  {
    name: "Attach Media",
    category: "INTERACTIONS",
    description:
      "Appends rich media files like PDFs, images, invoices, or audio tracks to the chat feed.",
    icon: "Share2",
  },
  {
    name: "Send Location",
    category: "INTERACTIONS",
    description:
      "Sends map coordinates (latitude/longitude) of offices or pickup points directly to the user.",
    icon: "MapPin",
  },
  {
    name: "Assign Chatbot",
    category: "INTERACTIONS",
    description:
      "Switches active chat handler responsibilities to a separate flow or sub-routine chatbot sequence.",
    icon: "Briefcase",
  },
  {
    name: "Wait Timer",
    category: "UTILITIES",
    description:
      "Delays flow progression by custom times (seconds, minutes, hours) to humanize bot pacing.",
    icon: "Timer",
  },
  {
    name: "Wait for Reply",
    category: "UTILITIES",
    description:
      "Halts the flow process until the customer replies. Captures their entry for evaluation.",
    icon: "Timer",
  },
  {
    name: "Logic Control",
    category: "LOGIC",
    description:
      "Evaluates standard rules (business hours checks, country code filters, prior selections) to route users.",
    icon: "GitBranch",
  },
  {
    name: "External API",
    category: "INTEGRATIONS",
    description:
      "Performs HTTP request routines (GET, POST, PUT) to fetch or update records in dynamic databases.",
    icon: "Database",
  },
  {
    name: "Webhook",
    category: "INTEGRATIONS",
    description:
      "Dispatches trigger events containing user attributes to other platforms (Shopify, CRM) instantly.",
    icon: "Share2",
  },
  {
    name: "Save Response",
    category: "INTEGRATIONS",
    description:
      "Persists the values of user responses directly into custom fields in your database layout.",
    icon: "Database",
  },
  {
    name: "Google Sheets",
    category: "INTEGRATIONS",
    description:
      "Appends rows or searches values in your integrated Google Spreadsheets spreadsheet in real-time.",
    icon: "FileText",
  },
  {
    name: "Calendar Event",
    category: "INTEGRATIONS",
    description:
      "Connects with scheduling software to create meetings or save appointment events on the calendar.",
    icon: "Calendar",
  },
  {
    name: "Assign Tag",
    category: "CRM",
    description:
      "Appends a categorizing label (e.g. VIP, Refund Needed) to the contact profile timeline.",
    icon: "Tag",
  },
  {
    name: "Add to Segment",
    category: "CRM",
    description:
      "Adds the contact to a segment folder for bulk broadcasting and campaign target filtering.",
    icon: "UserPlus",
  },
  {
    name: "Update Contact",
    category: "CRM",
    description:
      "Modifies variables on contact models like name, preferred language, or alternate coordinates.",
    icon: "UserCheck",
  },
];

export const useCasesFallback = [
  {
    title: "Lead Qualification & Booking",
    sub_title: "01. LEAD GGENERATION",
    side_image: "",
    steps: [
      {
        title: "Automation Entry (Start)",
        description:
          'Triggers flow when user clicks Facebook Ad button payload or sends "Book".',
      },
      {
        title: "Form Flow (Messaging)",
        description:
          "Asks qualification details: company size, name, and email sequentially.",
      },
      {
        title: "External API / Webhook (Integration)",
        description:
          "Calls API webhook to check calendar availability slots dynamically.",
      },
      {
        title: "Calendar Event (Integration)",
        description:
          "Books meeting automatically, posts calendar event, and replies confirmation text.",
      },
    ],
  },
  {
    title: "Order Status Track Lookup",
    sub_title: "02. CUSTOMER UTILITIES",
    side_image: "",
    steps: [
      {
        title: "Automation Entry (Start)",
        description:
          'Matches incoming keywords containing "Track", "Order", or "Delivery status".',
      },
      {
        title: "Wait for Reply (Utilities)",
        description:
          'Asks client: "Please enter order ID". Pauses flow execution until they reply.',
      },
      {
        title: "Google Sheets (Integration)",
        description:
          "Searches Spreadsheet order rows automatically to find the match ID status.",
      },
      {
        title: "Send Message (Messaging)",
        description:
          'Pulls status variable value and triggers WhatsApp message: "Your order is Shipped".',
      },
    ],
  },
  {
    title: "Support Triage & Escalation",
    sub_title: "03. SUPPORT SERVICE",
    side_image: "",
    steps: [
      {
        title: "Automation Entry (Start)",
        description:
          "Launches when a contact sends general help queries or matches nothing else.",
      },
      {
        title: "Logic Control (Logic)",
        description:
          "Checks rules: Is the current server time between 9:00 AM and 6:00 PM?",
      },
      {
        title: "Selection List (Interactions)",
        description:
          "Displays interactive menu categories (Sales, Technical, Billing, FAQs).",
      },
      {
        title: "Assign Chatbot (Interactions)",
        description:
          "If customer clicks Technical, switches thread to human Support Shared Inbox.",
      },
    ],
  },
];

export const automationFaqItems = [
  {
    question: "Do I need coding skills to build a WhatsApp chatbot?",
    answer:
      "Absolutely not. Our Visual Editor is designed specifically for business users. You drag node blocks, link them using cursor lines, and configure triggers or responses in plain text.",
  },
  {
    question: "How do API integrations or webhooks work?",
    answer:
      "The Webhook block triggers dynamic API calls mid-conversation. For example, when a user enters an order ID, the chatbot can make a GET request to your Shopify backend, pull the status, and reply to the user automatically.",
  },
  {
    question: "What happens when a customer needs human assistance?",
    answer:
      "Our chatbot handover block routes the customer context to the Shared Team Inbox immediately. The automation stops running on that active thread, letting agents converse natively.",
  },
];

export const FEATURE_ICONS = [
  <ShieldCheck key="0" size={20} className="text-blue-600" />,
  <Users key="1" size={20} className="text-primary" />,
  <Calendar key="2" size={20} className="text-purple-600" />,
  <Link2 key="3" size={20} className="text-amber-600" />,
  <BarChart3 key="4" size={20} className="text-rose-600" />,
  <Clock key="5" size={20} className="text-teal-600" />,
];

export const FEATURE_ICON_STYLES = [
  "bg-blue-50 border-blue-100",
  "bg-light-primary border-[var(--primary-opacity-20)]",
  "bg-purple-50 border-purple-100",
  "bg-amber-50 border-amber-100",
  "bg-rose-50 border-rose-100",
  "bg-teal-50 border-teal-100",
];

export const ICON_MAP: Record<string, React.ReactNode> = {
  Tag: <Tag size={18} />,
  Gift: <Gift size={18} />,
  Ticket: <Ticket size={18} />,
  BookOpen: <BookOpen size={18} />,
  Phone: <Phone size={18} />,
  ShoppingBag: <ShoppingBag size={18} />,
  Image: <ImageIcon size={18} />,
  ShieldCheck: <ShieldCheck size={18} />,
  Users: <Users size={18} />,
  Calendar: <Calendar size={18} />,
  Link2: <Link2 size={18} />,
};

export const campaignSettingsFeatures = [
  {
    title: "Meta Approved Templates",
    description:
      "Build media-rich text or document templates. Submits variables instantly to Meta API for validation.",
  },
  {
    title: "Smart Segment Targeting",
    description:
      "Filter bulk recipients accurately by CRM contact tags, custom language properties, or subscription directories.",
  },
  {
    title: "Scheduled Delivery",
    description:
      "Launch broadcasts immediately or plan future timing schedules to trigger alerts during optimal opening hours.",
  },
  {
    title: "Dynamic Link Tracking",
    description:
      "Inserts link tracking identifiers in CTA button templates to automatically trace CTR and client conversions.",
  },
];

export const templateType = [
  {
    title: "Standard",
    description:
      "Regular marketing message with text body and optional CTA button.",
    icon: "Tag",
    image: "",
  },
  {
    title: "Limited Time Offer",
    description:
      "With expiration countdown timer to drive urgency-based conversions.",
    icon: "Gift",
    image: "",
  },
  {
    title: "Coupon Code",
    description:
      "Include a copy-able promo code block for discounts and reward redemption.",
    icon: "Ticket",
    image: "",
  },
  {
    title: "Catalog",
    description:
      "Link your product catalog so recipients can browse directly on WhatsApp.",
    icon: "BookOpen",
    image: "",
  },
  {
    title: "Call Permission",
    description:
      "Request phone call opt-in with accept and decline quick-reply buttons.",
    icon: "Phone",
    image: "",
  },
  {
    title: "Carousel Product",
    description:
      "Horizontal scrollable product cards with prices and View Product CTAs.",
    icon: "ShoppingBag",
    image: "",
  },
  {
    title: "Carousel Media",
    description:
      "Horizontal image/video cards with action buttons for rich media campaigns.",
    icon: "Image",
    image: "",
  },
];

export const broadcastFaqItems = [
  {
    question: "What is the difference between Utility and Marketing templates?",
    answer:
      "Marketing templates contain promotional offers, discounts, or brand invites. Utility templates deliver transactional alerts like billing reminders, shipping details, or account codes.",
  },
  {
    question: "Are WhatsApp Broadcasts safe from account bans?",
    answer:
      "Yes. Our application runs broadcasts using the official WhatsApp Business Cloud API. By adhering to Meta's opt-in criteria and pre-approving templates, your account runs zero risk of phone number blocking.",
  },
  {
    question: "Can I personalize parameters for each individual recipient?",
    answer:
      "Absolutely. Using standard dynamic tags you can inject custom variables (names, coupon codes, outstanding balances) for each member of your recipient broadcast list.",
  },
];

export const featureIcons = [
  "RefreshCw",
  "ShoppingCart",
  "CreditCard",
  "Package",
];

export const cataloguesCapabilitiesFeatures = [
  {
    title: "Meta Catalog Sync",
    description:
      "Instantly sync existing products from Meta Business Manager or upload spreadsheet directories directly.",
  },
  {
    title: "Dynamic Carts",
    description:
      "Allow clients to pick multiple items, increment quantities, and submit complete orders without leaving the chat viewport.",
  },
  {
    title: "Auto-Invoicing",
    description:
      "Connect Stripe, Razorpay, or PayPal to automatically dispatch secure checkout links once items are compiled in the cart.",
  },
  {
    title: "Inventory Alerts",
    description:
      "Trigger automated out-of-stock messages or auto-hide catalog products whose database counts drop to zero.",
  },
];

export const cataloguesFaqItems = [
  {
    question: "Is a Meta Business Manager catalog required?",
    answer:
      "Yes, to use official WhatsApp product collections, you sync your products to Meta Catalog Manager. The app simplifies this by giving you a direct API linkage to upload items from your local spreadsheet inventory in seconds.",
  },
  {
    question: "How do customers pay once they submit their orders?",
    answer:
      "Once the order checkout is compiled in chat, the bot triggers an automated Stripe, Razorpay, or PayPal payment transaction link. Once the customer completes the payment, the bot instantly dispatches a confirmation message and updates the order status.",
  },
  {
    question: "Can I trigger chatbot automations when a customer buys?",
    answer:
      "Absolutely. When a customer adds items or checkout, it fires webhook signals that can trigger specific automation builders (like assigning tags, enrolling the contact in automated email flows, or routing them to human inbox specialists).",
  },
];

export const stepGradients = [
  {
    from: "from-indigo-500",
    to: "to-indigo-600",
    shadow: "shadow-indigo-500/25",
  },
  {
    from: "from-violet-500",
    to: "to-violet-600",
    shadow: "shadow-violet-500/25",
  },
  {
    from: "from-fuchsia-500",
    to: "to-fuchsia-600",
    shadow: "shadow-fuchsia-500/25",
  },
  { from: "from-sky-500", to: "to-sky-600", shadow: "shadow-sky-500/25" },
];

export const ctwaStructure = [
  {
    title: "Campaigns",
    description:
      "Define objective, budget & schedule. Choose from engagement, traffic, awareness, or leads goals.",
  },
  {
    title: "Ad Sets",
    description:
      "Target by location, age, gender & platform. Set bids, scheduling, and delivery optimization.",
  },
  {
    title: "Ads",
    description:
      "Create the creative — image, video, or carousel — with WhatsApp CTA button and welcome experience.",
  },
];

export const ctwaFeatures = [
  {
    title: "Asset Synchronization",
    description: "Connect Facebook Pages and Instagram accounts in one click.",
    icon: "Layers",
    image: "",
  },
  {
    title: "3-Step Campaign Wizard",
    description:
      "Guided wizard: campaign details, targeting, creative with WhatsApp CTA.",
    icon: "Compass",
    image: "",
  },
  {
    title: "Location & Demographic Targeting",
    description: "Target by country, age, gender, and platform with precision.",
    icon: "Users",
    image: "",
  },
  {
    title: "Multiple Creative Formats",
    description:
      "Image, video, or carousel ads each with a WhatsApp CTA button.",
    icon: "Palette",
    image: "",
  },
  {
    title: "WhatsApp Welcome Experience",
    description:
      "Configure greeting messages and ice breaker suggestions for every ad click.",
    icon: "MessageCircle",
    image: "",
  },
  {
    title: "Real-Time Performance Analytics",
    description:
      "Monitor impressions, clicks, CTR, conversions, and platform breakdown.",
    icon: "LineChart",
    image: "",
  },
];

export const ctwaStepLaunch = [
  {
    title: "Campaign Setup",
    description:
      "Choose objective, name, daily budget, ad category, and optimization goal.",
  },
  {
    title: "Targeting Configuration",
    description:
      "Set gender, age range, platforms, ad set budget, schedule, and billing event.",
  },
  {
    title: "Creative & Welcome",
    description:
      "Upload creative, add WhatsApp CTA button, configure Welcome Experience.",
  },
];

export const ctwaFaq = [
  {
    question: "What is Click to WhatsApp Ads and how does it work?",
    answer:
      "Click to WhatsApp Ads are Facebook and Instagram advertisements with a CTA button that opens a WhatsApp chat conversation directly — no forms, no landing pages, no friction.",
  },
  {
    question: "Do I need a Facebook Business Manager to create ads?",
    answer:
      "Yes. Our system connects to your Facebook Business Manager to sync ad accounts, Facebook Pages, and Instagram professional accounts. You manage everything from our dashboard.",
  },
  {
    question: "What ad formats and creative types are supported?",
    answer:
      "We support image, video, and carousel ad formats, each with a WhatsApp CTA button and optional Welcome Experience with greeting text and ice breaker suggestions.",
  },
];

export const inboxCard = [
  {
    icon: "Inbox",
    title: "Unified Inbox Dashboard",
    description:
      "Consolidate customer message streams from WhatsApp API, Instagram DMs, and Facebook Messenger into one view.",
  },
  {
    icon: "Users",
    title: "Smart Agent Routing",
    description:
      "Assign conversations manually or setup automated routing parameters to balance workflow queues instantly.",
  },
  {
    icon: "Brain",
    title: "AI Suggested Replies",
    description:
      "Generate context-appropriate answers dynamically in the text area based on user ticket histories.",
  },
  {
    icon: "Sparkles",
    title: "Transform Message Tones",
    description:
      "Improve message copy drafts. Rephrase drafts instantly to sound highly professional, friendly, or compact.",
  },
  {
    icon: "MessageSquare",
    title: "Private Internal Notes",
    description:
      "Discuss issues directly on the client timeline. Leave private mentions completely hidden from customers.",
  },
  {
    icon: "ShieldAlert",
    title: "Customer Number Masking",
    description:
      "Secure business data. Mask client telephone numbers from agents to protect databases and reduce leakage.",
  },
];

export const inboxTeam = [
  {
    icon: "Layers",
    title: "Prevent Collision & Duplicate Replies",
    description:
      "See who is viewing or replying to a chat in real-time to avoid sending overlapping answers.",
  },
  {
    icon: "Tag",
    title: "Assign Shared Tags & Filters",
    description:
      'Classify contacts using global tags like "Refund" or "VIP Inquirer" so any agent can search and filters queues.',
  },
];

export const inboxCounter = [
  {
    counts: "75%",
    title: "Quicker Response Times",
    description:
      "AI drafting tools and canned templates help agents resolve customer queries in seconds.",
  },
  {
    counts: "10x",
    title: "Productivity Boost",
    description:
      "Multiple support agents work simultaneously under a single profile number.",
  },
  {
    counts: "0",
    title: "Missed Messages",
    description:
      "Shared visibility prevents messages from slipping through shifts unhandled.",
  },
];

export const stepsFallback = [
    {
      title: "Design with drag & drop",
      description: "Use the visual builder to add text inputs, email, phone, dropdowns, checkboxes, and date pickers. Configure field labels, placeholders, and toggle required validation on any field.",
      image: ""
    },
    {
      title: "Publish to Meta Flows",
      description: "Once designed, publish your form to Meta's native interactive form system. Define submission settings — custom success messages and button text — to guide users after they submit.",
      image: ""
    },
    {
      title: "Share & automate delivery",
      description: "Package your form into a Response Resource with a custom CTA button. Deploy it manually in chats or automate delivery via Keyword Triggers — when users type matching words, the form is sent automatically.",
      image: ""
    }
  ];

  export const capabilitiesFallback = [
    { icon: "Layout", title: "Drag & Drop Builder", description: "Design forms visually — add, reorder, and configure fields in seconds. No coding required." },
    { icon: "Grid3X3", title: "Rich Field Types", description: "Text, Text Area, Number, Email, Phone, Dropdown, Single Choice, Checkbox, and Date Picker fields." },
    { icon: "Fingerprint", title: "Meta Flows Powered", description: "Forms run on Meta's native interactive data collection system directly inside WhatsApp." },
    { icon: "Keyboard", title: "Keyword Auto-Trigger", description: "Link forms to trigger keywords. When users type matching words, the form is sent automatically." },
    { icon: "Settings", title: "Submission Settings", description: "Configure success messages, button text, and post-submission behavior for each form." },
    { icon: "Share2", title: "Response Resources", description: "Package forms into shareable message flows with custom CTA button text for manual or automated delivery." }
  ];

  export  const componentsFallback = [
    { icon: "AlignLeft", label: "Text & Text Area", desc: "Single & multi-line inputs" },
    { icon: "Mail", label: "Email", desc: "Validated email field" },
    { icon: "Phone", label: "Phone", desc: "Validated number input" },
    { icon: "List", label: "Dropdown", desc: "Multi-option select" },
    { icon: "CheckSquare", label: "Checkbox", desc: "Multiple selection" },
    { icon: "MessageSquare", label: "Single Choice", desc: "Radio button group" },
    { icon: "Calendar", label: "Date Picker", desc: "Native date selector" },
    { icon: "FileText", label: "Number", desc: "Numeric input field" }
  ];

  export const faqsFallback = [
    { question: "How do WhatsApp Forms differ from regular web forms?", answer: "Unlike traditional web forms that redirect users to external pages, WhatsApp Forms render directly inside the chat conversation. This eliminates friction, reduces drop-offs, and achieves significantly higher completion rates — users never leave the familiar WhatsApp interface." },
    { question: "Can I trigger forms automatically based on user messages?", answer: "Absolutely. Using Keyword Triggers, you can configure specific keywords (e.g. \"Apply\", \"Register\", \"Book\") to automatically deliver your form. When a user sends a matching keyword, the system responds instantly with the interactive form — no manual intervention needed." },
    { question: "What field types are available in the form builder?", answer: "The visual builder supports Text Input, Text Area, Number, Email, Phone, Dropdown, Single Choice (radio), Checkbox, and Date Picker. Each field can be configured with a display label, placeholder text, and required validation toggle." }
  ];

  export const DEFAULT_FAVICON = "/assets/logos/sidebarLogo.png";