"use client";

import HomeImg from "@/public/assets/images/home.png";
import PlatformImg from "@/public/assets/images/platform.png";
import ProductLayout from "@/src/components/product/ProductLayout";
import ProductPageTemplate from "@/src/components/product/ProductPageTemplate";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { BrainCircuit, Headphones, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

const AISupportPage = () => {
  const { t } = useTranslation();
  const setting = useAppSelector((state) => state.setting);

  return (
    <ProductLayout>
      <ProductPageTemplate
        hero={{
          badge: `${setting.app_name || t("app_name")} for Support`,
          title: "Let AI resolve your customer support chats 24/7",
          description: "Train an AI agent on your business documents (PDFs, Website, FAQs) to instantly answer customer questions. It's like having your best agent working around the clock.",
          secondaryCTA: { text: "Book a Demo", link: ROUTES.DefaultAction },
          image: HomeImg,
        }}
        features={[
          {
            title: "Self-Learning AI Knowledge",
            description: "Simply upload your existing manuals, PDFs, or website URLs. Our AI absorbs your business specifics in seconds to provide hyper-accurate answers.",
            image: PlatformImg,
            imageAlt: "AI Contextual Learning UI",
          },
          {
            title: "Human-Like Multilingual Support",
            description: "Help customers in their preferred language naturally. Your AI agent handles 100+ languages fluently, ensuring no customer is left behind.",
            image: PlatformImg,
            imageAlt: "AI Translation UI",
          },
        ]}
        useCases={[
          {
            title: "24/7 Agent Availability",
            description: "Never keep a customer waiting. Resolve common issues instantly at any time of day or night.",
            icon: <Sparkles className="w-10 h-10" />,
          },
          {
            title: "Seamless Human Handover",
            description: "Transition complex queries from AI to human agents with full context and history maintained.",
            icon: <Headphones className="w-10 h-10" />,
          },
          {
            title: "Knowledge Base Sync",
            description: "Train your AI on your PDFs, website, and FAQs to ensure hyper-accurate, brand-aligned answers.",
            icon: <BrainCircuit className="w-10 h-10" />,
          },
        ]}
        finalCTA={{
          title: "Scale your support, not your costs",
          description: "Businesses using WhatsApp CRM AI reduce support ticket volume by over 65% in the first month.",
          buttonText: "Deploy Your AI Support",
          buttonLink: "/register",
        }}
      />
    </ProductLayout>
  );
};

export default AISupportPage;
