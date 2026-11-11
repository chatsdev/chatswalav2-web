import { BookOpen, Code2, Layout, MessageSquare } from "lucide-react";
import React from "react";

export interface GuideTopic {
  id: string;
  title: string;
  shortDesc: string;
  icon: React.ReactNode;
  content: {
    subtitle?: string;
    text?: string;
    points?: string[];
    example?: string;
  }[];
}

export const TEMPLATEGUIDEDATA: GuideTopic[] = [
  {
    id: "create_template",
    title: "Create WhatsApp Message Templates?",
    shortDesc: "Basic steps to build a high-converting message.",
    icon: <Layout size={24} />,
    content: [
      {
        subtitle: "1. Choose a Category",
        text: "Select a category like Marketing, Utility, or Authentication that best fits your message's purpose.",
      },
      {
        subtitle: "2. Define the Header",
        text: "Add a title or media (Image, Video, Document) to grab attention immediately.",
      },
      {
        subtitle: "3. Craft the Body",
        text: "Write your main message. Keep it clear, concise, and professional. Use parameters for personalization.",
      },
      {
        subtitle: "4. Add Footer & Buttons",
        text: "Include a footer for extra context and add Interactive Buttons (Quick Replies or CTAs) to drive action.",
      },
    ],
  },
  {
    id: "formatting_guide",
    title: "Message Styling Guide",
    shortDesc: "Learn how to use Bold, Italic, and other styles.",
    icon: <BookOpen size={24} />,
    content: [
      {
        subtitle: "Basic Formatting",
        text: "Use special characters to style your text directly in the template editor.",
      },
      {
        points: ["*Bold*: Surround text with asterisks (*text*)", "_Italic_: Surround text with underscores (_text_)", "~Strikethrough~: Surround text with tildes (~text~)", "```Monospace```: Surround text with triple backticks (```text```)"],
      },
      {
        text: "Pro Tip: Combining styles like *_bold-italic_* is also possible!",
      },
    ],
  },
  {
    id: "chatbot_parameters",
    title: "Apply Chatbot Parameters for Lead Management",
    shortDesc: "How to use dynamic variables for personalization.",
    icon: <Code2 size={24} />,
    content: [
      {
        subtitle: "What are Parameters?",
        text: "Parameters allow you to sendpersonalized messages to each customer by using placeholders like {{1}}, {{2}}.",
      },
      {
        subtitle: "How to use them",
        text: "When drafting your body text, insert double curly braces with a number. For example: 'Hi {{1}}, your order {{2}} is ready!'",
      },
      {
        example: "Hi {{1}}, Welcome to WhatsApp CRM! We have a special offer for you. Use code {{2}} at checkout.",
      },
    ],
  },
  {
    id: "quick_replies",
    title: "Enable Quick Reply in WhatsApp Templates",
    shortDesc: "Implementing interactive buttons for better engagement.",
    icon: <MessageSquare size={24} />,
    content: [
      {
        subtitle: "Why Use Quick Replies?",
        text: "Quick replies make it easy for customers to respond with a single tap, increasing your conversion rates significantly.",
      },
      {
        subtitle: "Button Types",
        text: "You can add up to 3 Quick Reply buttons or 2 Call-to-Action buttons (Link or Phone Number).",
      },
      {
        points: ["Engagement Boost: Users are more likely to tap a button than type a reply.", "Workflow Automation: Buttons can trigger specific AI responses or agent handovers."],
      },
    ],
  },
];
