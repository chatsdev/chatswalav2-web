"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import {
  Bot,
  Calendar,
  Check,
  Code,
  FileText,
  Phone,
  Send,
  Sliders,
  Smartphone,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import {
  featureWhatsappSections,
  platformFeatures,
  stepsWhatsappSection,
} from "@/src/data/ChannelConnectionInfo";
import { WhatsAppPageProps } from "@/src/types/channel";
import { getResolvedImageUrl } from "@/src/utils/image";
import ComparisonTable from "./components/ComparisonTable";
import FeatureShowcase from "./components/FeatureShowcase";
import SalesCTA from "./components/SalesCTA";
import StepTimeline from "./components/StepTimeline";
import Image from "next/image";


export default function WhatsAppPage({ pageData }: WhatsAppPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const [storedColorConfig] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("page_color_config_whatsapp");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const content = isPageValid ? page.dynamic_content : {};

  useEffect(() => {
    if (page?.color_config && typeof window !== "undefined") {
      localStorage.setItem(
        "page_color_config_whatsapp",
        JSON.stringify(page.color_config),
      );
    }
  }, [page?.color_config]);

  useEffect(() => {
    setImageError(false);
  }, [activeFeatureIndex]);

  const colorConfig = page?.color_config || storedColorConfig || {};
  const primaryColor = colorConfig.primary_color || "#059669";

  const hero = {
    badge:
      content.hero_section?.badge !== undefined
        ? content.hero_section.badge
        : "Official WhatsApp Connection",
    title:
      content.hero_section?.title || "Scale Your Sales and Support on WhatsApp",
    subtitle:
      content.hero_section?.subtitle ||
      "Manage customer chats together with a shared inbox, build automated reply bots, send bulk messages to customers, and link with the tools you already use.",
    button_text: content.hero_section?.button_text || "Try For Free",
    button_url: content.hero_section?.button_url || ROUTES.SignUp,
    button_2_text: content.hero_section?.button_2_text || "View Plans",
    button2_url: content.hero_section?.button2_url || ROUTES.BillingPlans,
    bullets: Array.isArray(content.hero_section?.bullets)
      ? content.hero_section.bullets
      : ["Instant QR setup", "Official Connection", "No setup fees"],
    side_gif: content.hero_section?.side_gif || null,
  };

  const counters = Array.isArray(content.counters)
    ? content.counters
    : [
        { count: "+45%", title: "Broadcast Click Rate" },
        { count: "3x", title: "Sales Conversion" },
        { count: "99%", title: "Message Read Rate" },
        { count: "24/7", title: "Auto-Response" },
      ];

  const comparison = {
    badge:
      content.comparison?.badge !== undefined
        ? content.comparison.badge
        : "Comparison Grid",
    title:
      content.comparison?.title || "Standard WhatsApp vs WhatsApp Business API",
    subtitle:
      content.comparison?.subtitle ||
      "Discover why scaling on WhatsApp requires switching from the generic app to an official API-powered workflow built for teams.",
    platform_feature_array: Array.isArray(
      content.comparison?.platform_feature_array,
    )
      ? content.comparison.platform_feature_array
      : platformFeatures,
  };

  const featuresSection = {
    badge:
      content.features?.badge !== undefined
        ? content.features.badge
        : "Interactive Showcase",
    title:
      content.features?.title ||
      "Powerful Tools to Turn WhatsApp into a Sales Machine",
    sub_title:
      content.features?.sub_title ||
      "Explore the exact capabilities engineered within our platform to help you automate customer operations completely.",
    features: Array.isArray(content.features?.features)
      ? content.features.features
      : featureWhatsappSections,
  };

  const stepsSection = {
    badge:
      content.steps?.badge !== undefined ? content.steps.badge : "How It Works",
    title: content.steps?.title || "Start in 4 Easy Steps",
    subtitle:
      content.steps?.subtitle ||
      "Setting up your official WhatsApp assistant takes less than 10 minutes.",
    steps: Array.isArray(content.steps?.steps)
      ? content.steps.steps
      : stepsWhatsappSection,
  };

  const sales = {
    title:
      content.sales_section?.title ||
      "Turn Your WhatsApp Into A Sales Engine Today",
    subtitle:
      content.sales_section?.subtitle ||
      "Start sending announcements, managing team chats, and answering customer questions automatically right now.",
    button1_title: content.sales_section?.button1_title || "Try For Free",
    button1_url: content.sales_section?.button1_url || ROUTES.SignUp,
    button2_title: content.sales_section?.button2_title || "Talk to Sales",
    button2_url:
      content.sales_section?.button2_url ||
      content.sales_section?.button2_description ||
      ROUTES.BillingPlans,
    bullets: Array.isArray(content.sales_section?.bullets)
      ? content.sales_section.bullets
      : ["5-Minute Setup", "Official Connection", "Cancel Anytime"],
  };

  const getWhatsAppIcon = (index: number) => {
    const icons = [
      <Users key="0" className="w-5 h-5" />,
      <Sliders key="1" className="w-5 h-5" />,
      <Send key="2" className="w-5 h-5" />,
      <Phone key="3" className="w-5 h-5" />,
      <Calendar key="4" className="w-5 h-5" />,
      <FileText key="5" className="w-5 h-5" />,
      <Bot key="6" className="w-5 h-5" />,
      <Code key="7" className="w-5 h-5" />,
      <Smartphone key="8" className="w-5 h-5" />,
    ];
    return icons[index] || <Sparkles key="default" className="w-5 h-5" />;
  };

  return (
    <div 
      className="relative overflow-hidden bg-white text-slate-800"
      style={{
        "--primary": primaryColor,
        "--primary-rgb": "5, 150, 105",
        "--light-primary": "#05966926",
        "--primary-opacity-20": "rgba(5, 150, 105, 0.2)",
      } as React.CSSProperties}
    >
      <div
        className="absolute top-[3%] left-[-15%] w-[45vw] h-[45vw] rounded-full blur-[130px] pointer-events-none"
        style={{ backgroundColor: primaryColor, opacity: 0.08 }}
      />
      <div
        className="absolute top-[28%] right-[-10%] w-[38vw] h-[38vw] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: primaryColor, opacity: 0.06 }}
      />
      <div
        className="absolute bottom-[20%] left-[8%] w-[40vw] h-[40vw] rounded-full blur-[140px] pointer-events-none"
        style={{ backgroundColor: primaryColor, opacity: 0.05 }}
      />

      <section className="relative pt-[calc(30px+40*((100vw-320px)/1600))] pb-[calc(40px+50*((100vw-320px)/1600))] overflow-visible">
        <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[calc(9px+(48-9)*((100vw-320px)/(1920-320)))] items-center">
            <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
              {hero.badge && (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full uppercase tracking-wide font-bold shadow-sm"
                  style={{
                    backgroundColor: primaryColor + "20",
                    color: primaryColor,
                  }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: primaryColor }}
                  >
                    {hero.badge}
                  </span>
                </div>
              )}

              <h1 className="text-[calc(26px+24*((100vw-320px)/1600))] font-bold text-slate-900 leading-[1.1] mb-[calc(9px+(24-9)*((100vw-320px)/(1920-320)))] tracking-tight max-w-2xl">
                {hero.title ? (
                  hero.title.includes("WhatsApp") ? (
                    <>
                      {hero.title.split("WhatsApp")[0]}
                      <span style={{ color: primaryColor }}>WhatsApp</span>
                      {hero.title.split("WhatsApp")[1]}
                    </>
                  ) : (
                    hero.title
                  )
                ) : (
                  "Scale Your Sales and Support on WhatsApp"
                )}
              </h1>

              <p className="text-[17px] text-slate-600 mb-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))] max-w-xl leading-relaxed font-medium">
                {hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  onClick={() =>
                    router.push(
                      isAuthenticated ? ROUTES.Dashboard : hero.button_url,
                    )
                  }
                  className="text-white px-8! py-6! h-11 rounded-lg font-bold text-[16px] transition-all hover:scale-102 active:scale-98 border-none cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 10px 30px ${primaryColor}40`,
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.backgroundColor = primaryColor + "dd";
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.currentTarget.style.backgroundColor = primaryColor;
                  }}
                >
                  <Zap
                    size={18}
                    strokeWidth={2.5}
                    className="text-white fill-white"
                  />
                  {hero.button_text}
                </Button>
              </div>

              {hero.bullets.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-xs font-bold text-slate-600">
                  {hero.bullets.map((bullet: string, idx: number) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <Check
                        size={14}
                        style={{ color: primaryColor }}
                        className="font-black"
                      />{" "}
                      {bullet}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full max-w-[878px] mx-auto z-10 p-4 h-full flex">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full max-h-[400px] lg:max-h-[560px] rounded-lg transition-all duration-500 hover:-translate-y-1">
                  <Image unoptimized
                    src={getResolvedImageUrl(hero.side_gif)}
                    alt="WhatsApp Features"
                    width={800}
                    height={600}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {counters.length > 0 && (
        <section className="py-8 bg-slate-50 border-y border-slate-200/60">
          <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-5xl mx-auto">
              {counters.map((c: any, idx: number) => (
                <div
                  key={idx}
                  className={idx > 0 ? "border-l border-slate-200/80" : ""}
                >
                  <p
                    className="text-[28px] md:text-[34px] font-black tracking-tight hover:scale-105 transition-transform duration-300"
                    style={{ color: primaryColor }}
                  >
                    {c.count}
                  </p>
                  <p className="text-[13px] font-bold text-slate-600 mt-1">
                    {c.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <ComparisonTable comparison={comparison} primaryColor={primaryColor} />

      <FeatureShowcase
        featuresSection={featuresSection}
        activeFeatureIndex={activeFeatureIndex}
        setActiveFeatureIndex={setActiveFeatureIndex}
        imageError={imageError}
        setImageError={setImageError}
        getWhatsAppIcon={getWhatsAppIcon}
      />

      <StepTimeline stepsSection={stepsSection} primaryColor={primaryColor} />

      <SalesCTA
        sales={sales}
        isAuthenticated={isAuthenticated}
        primaryColor={primaryColor}
        router={router}
      />
    </div>
  );
}
