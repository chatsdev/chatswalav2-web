"use client";

import { ROUTES } from "@/src/constants";
import {
  featureSections,
  stepsSections,
  toolsSections,
} from "@/src/data/ChannelConnectionInfo";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { FacebookPageProps } from "@/src/types/channel";
import { getResolvedImageUrl } from "@/src/utils/image";
import { Check, Facebook } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import FacebookFeatures from "./components/FacebookFeatures";
import FacebookSalesCTA from "./components/FacebookSalesCTA";
import FacebookSteps from "./components/FacebookSteps";
import FacebookTools from "./components/FacebookTools";

const FacebookPage = ({ pageData }: FacebookPageProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const fbGradient =
    "linear-gradient(135deg, oklch(0.62 0.18 245) 0%, oklch(0.52 0.20 250) 50%, oklch(0.42 0.22 255) 100%)";
  const fbGradientLight =
    "color-mix(in oklab, oklch(0.58 0.20 250) 12%, white)";

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const content = isPageValid ? page.dynamic_content : {};

  const hero = {
    badge:
      content.hero_section?.badge !== undefined
        ? content.hero_section.badge
        : "Official Facebook Connection",
    title:
      content.hero_section?.title || "Automate Your Facebook Pages & Lead Ads",
    subtitle:
      content.hero_section?.subtitle ||
      "Connect your Facebook business pages, automatically save customer form details from your ads, chat in a single inbox, and send easy automated messages.",
    button_text:
      content.hero_section?.button_text || "Connect Your Facebook Account",
    button_url: content.hero_section?.button_url || ROUTES.SignUp,
    button_2_text: content.hero_section?.button_2_text || "See What It Can Do",
    button2_url: content.hero_section?.button2_url || "",
    bullets: Array.isArray(content.hero_section?.bullets)
      ? content.hero_section.bullets
      : ["Easy Form Syncing", "Simple Ad Reports", "Automatic Message Replies"],
    side_image: content.hero_section?.side_image || null,
  };

  const featuresSection = {
    badge:
      content.features?.badge !== undefined
        ? content.features.badge
        : "Core Features",
    title: content.features?.title || "Grow Your Facebook Page Automatically",
    subtitle:
      content.features?.subtitle ||
      "Here is everything you can set up to manage your customer conversations and ads in one place.",
    features: Array.isArray(content.features?.features)
      ? content.features.features
      : featureSections,
  };

  const toolsSection = {
    badge:
      content.tools?.badge !== undefined
        ? content.tools.badge
        : "Complete Tools",
    title: content.tools?.title || "Built-In Page & Message Tools",
    sub_title:
      content.tools?.sub_title ||
      "Every tool you need to track delivery, send replies, and manage customer chats.",
    tools: Array.isArray(content.tools?.tools)
      ? content.tools.tools
      : toolsSections,
  };

  const stepsSection = {
    badge:
      content.steps?.badge !== undefined ? content.steps.badge : "How It Works",
    title: content.steps?.title || "Start in under 2 minutes.",
    subtitle:
      content.steps?.subtitle ||
      "No complicated codes or technical steps. Just connect and go.",
    steps: Array.isArray(content.steps?.steps)
      ? content.steps.steps
      : stepsSections,
  };

  const sales = {
    title:
      content.sales_section?.title ||
      "Automate Your Facebook Ads & Leads Today",
    subtitle:
      content.sales_section?.subtitle ||
      "Link your pages, track active ad campaigns, save lead form answers, and reply to customers automatically.",
    button1_title: content.sales_section?.button1_title || "Try For Free",
    button1_url: content.sales_section?.button1_url || ROUTES.SignUp,
    button2_title: content.sales_section?.button2_title || "Talk to Sales",
    button2_url:
      content.sales_section?.button2_url ||
      content.sales_section?.button2_description ||
      ROUTES.BillingPlans,
    bullets: Array.isArray(content.sales_section?.bullets)
      ? content.sales_section.bullets
      : ["Easy Sign In", "Official Connection", "Cancel Anytime"],
  };

  return (
    <div className="relative overflow-x-clip bg-[#fafbfe] text-slate-800">
      <div
        className="absolute top-0 left-0 right-0 h-[900px] pointer-events-none -z-10"
        style={{
          background: `linear-gradient(180deg, ${fbGradientLight} 0%, color-mix(in oklab, oklch(0.65 0.15 220) 6%, white) 60%, rgba(255,255,255,0) 100%)`,
        }}
      />
      <div className="absolute top-[20%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-blue-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-[60%] right-[-8%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <section className="relative pt-[calc(30px+40*((100vw-320px)/1600))] pb-[calc(40px+50*((100vw-320px)/1600))] overflow-visible">
        <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[calc(9px+(48-9)*((100vw-320px)/(1920-320)))] items-center">
            <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
              {hero.badge && (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 uppercase tracking-wide text-white mb-6 rounded-full"
                  style={{ background: fbGradient }}
                >
                  <Facebook size={14} className="text-white" />
                  <span className="text-xs font-bold text-white">
                    {hero.badge}
                  </span>
                </div>
              )}

              <h1 className="text-[calc(26px+24*((100vw-320px)/1600))] font-bold text-slate-900 leading-[1.1] mb-[calc(9px+(24-9)*((100vw-320px)/(1920-320)))] tracking-tight max-w-2xl">
                {hero.title ? (
                  hero.title.includes("Facebook") ? (
                    <>
                      {hero.title.split("Facebook")[0]}
                      <span className="text-[#1877f2]">Facebook</span>
                      {hero.title.split("Facebook")[1]}
                    </>
                  ) : (
                    hero.title
                  )
                ) : (
                  "Automate Your Facebook Messages"
                )}
              </h1>

              <p className="text-[17px] text-slate-600 mb-[calc(12px+(32-12)*((100vw-320px)/(1920-320)))] max-w-xl leading-relaxed font-medium">
                {hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  onClick={() =>
                    router.push(
                      isAuthenticated ? ROUTES.Dashboard : hero.button_url,
                    )
                  }
                  className="text-white px-8! py-6! h-11! rounded-lg! font-bold text-[16px] transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] border-none cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: fbGradient,
                    boxShadow:
                      "0 8px 24px color-mix(in oklab, oklch(0.52 0.20 250) 30%, transparent)",
                  }}
                >
                  <Facebook size={18} className="text-white fill-white" />
                  {hero.button_text}
                </Button>
              </div>

              {hero.bullets.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-xs font-bold text-slate-600">
                  {hero.bullets.map((bullet: string, idx: number) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <Check size={14} className="text-[#1877f2] font-black" />{" "}
                      {bullet}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full max-w-[878px] mx-auto z-10 p-4 h-full flex">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full rounded-lg transition-all duration-500 hover:-translate-y-1">
                  <Image
                    src={getResolvedImageUrl(hero.side_image)}
                    alt="Facebook Integrations"
                    width={800}
                    height={600}
                    unoptimized
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FacebookFeatures
        featuresSection={featuresSection}
        getResolvedImageUrl={getResolvedImageUrl}
        fbGradient={fbGradient}
      />

      <FacebookTools
        toolsSection={toolsSection}
        fbGradient={fbGradient}
        fbGradientLight={fbGradientLight}
      />

      <FacebookSteps stepsSection={stepsSection} fbGradient={fbGradient} />

      <FacebookSalesCTA
        sales={sales}
        isAuthenticated={isAuthenticated}
        fbGradient={fbGradient}
        router={router}
      />
    </div>
  );
};

export default FacebookPage;
