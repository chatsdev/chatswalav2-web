"use client";

import ProductLayout from "@/src/components/product/ProductLayout";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { getResolvedImageUrl } from "@/src/utils/image";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  automationFaqItems,
  catalogNodesFallback,
  useCasesFallback,
} from "@/src/data/product";
import { Button } from "@/src/elements/ui/button";
import { AutomationPageProps } from "@/src/types/product";
import AutomationCatalog from "./components/AutomationCatalog";
import AutomationFAQs from "./components/AutomationFAQs";
import AutomationUseCases from "./components/AutomationUseCases";

export default function AutomationPage({ pageData }: AutomationPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const dc = isPageValid ? page.dynamic_content : {};

  const colorConfig = page?.color_config || {};
  const primaryColor = colorConfig.primary_color || "#967205";

  const hero = {
    badge: dc.hero?.badge || "No-Code Chatbot Builder",
    title: dc.hero?.title || "",
    subtitle:
      dc.hero?.subtitle ||
      "Create smart WhatsApp chatbots using a simple drag-and-drop builder. Answer customer FAQs, capture contact parameters, branch logic conditionally, and trigger instant webhook lookups automatically.",
    button_text: dc.hero?.button_text || "Start Building For Free",
    button_url: dc.hero?.button_url || ROUTES.SignUp,
    button_2_text: dc.hero?.button_2_text || "Explore Flow Nodes",
    bullets: Array.isArray(dc.hero?.bullets)
      ? dc.hero.bullets
      : [
          "No credit card needed",
          "Built-in template integration",
          "API webhooks enabled",
        ],
    image: dc.hero?.image || null,
  };

  const flowNodes = {
    badge: dc.flow_nodes?.badge || "Visual Blocks Directory",
    title: dc.flow_nodes?.title || "All Conversational Flow Nodes",
    description:
      dc.flow_nodes?.description ||
      "Connect simple, functional visual components to outline paths for any client inquiry. Filter nodes by core category to discover options.",
    nodes: Array.isArray(dc.flow_nodes?.nodes)
      ? dc.flow_nodes.nodes
      : catalogNodesFallback,
  };

  const useCases = {
    badge: dc.use_cases?.badge || "Use Cases",
    title: dc.use_cases?.title || "Proven Chatbot Flow Recipes",
    description:
      dc.use_cases?.description ||
      "Explore how standard node categories compile into production-ready visual automation sequences.",
    tabs: Array.isArray(dc.use_cases?.tabs)
      ? dc.use_cases.tabs
      : useCasesFallback,
  };

  const faqs = {
    badge: dc.faqs?.badge || "FAQs",
    title: dc.faqs?.title || "Got Questions about Chatbots & Flows?",
    items: Array.isArray(dc.faqs?.items) ? dc.faqs.items : automationFaqItems,
  };

  return (
    <ProductLayout>
      <div className="relative overflow-x-hidden bg-[#FCFCFD] text-slate-800 font-sans text-left">
        <div
          className="absolute top-[3%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[130px] pointer-events-none"
          style={{ backgroundColor: primaryColor, opacity: 0.08 }}
        />
        <div
          className="absolute top-[35%] right-[-10%] w-[55vw] h-[55vw] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: primaryColor, opacity: 0.06 }}
        />

        <div
          className="absolute inset-0 opacity-40 pointer-events-none -z-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <section className="relative pt-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))] pb-[calc(16px+(60-16)*((100vw-320px)/(1920-320)))] overflow-visible">
          <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-[calc(18px+(48-18)*((100vw-320px)/(1920-320)))] items-center">
              <div className="flex flex-col text-center lg:text-left items-center lg:items-start z-10">
                <div
                  className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 rounded-full"
                  style={{ backgroundColor: primaryColor + "10" }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full animate-pulse uppercase tracking-wide"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span
                    className="text-sm font-bold font-mono"
                    style={{ color: primaryColor }}
                  >
                    {hero.badge}
                  </span>
                </div>

                <h1 className="text-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 leading-[1.08] mb-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] tracking-tight max-w-2xl">
                  {hero.title ? (
                    hero.title
                  ) : (
                    <>
                      Automate Conversations Visually Without{" "}
                      <span
                        className="bg-gradient-to-r bg-clip-text text-transparent"
                        style={{
                          backgroundImage: `linear-gradient(to right, ${primaryColor}, #10b981)`,
                          WebkitBackgroundClip: "text",
                        }}
                      >
                        Any Code
                      </span>
                    </>
                  )}
                </h1>

                <p className="text-[calc(14px+(17-14)*((100vw-320px)/(1920-320)))] text-slate-600 mb-[calc(14px+(32-14)*((100vw-320px)/(1920-320)))] max-w-xl leading-relaxed font-semibold">
                  {hero.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button
                    onClick={() =>
                      router.push(
                        isAuthenticated ? ROUTES.Dashboard : hero.button_url,
                      )
                    }
                    className="text-white px-8! py-5! h-12! rounded-lg font-bold text-[16px] transition-all hover:scale-[1.02] active:scale-98 border-none cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: primaryColor,
                      boxShadow: `0 10px 24px ${primaryColor}20`,
                    }}
                  >
                    {hero.button_text} <ArrowUpRight size={16} />
                  </Button>
                </div>

                <div className="mt-[calc(16px+(32-16)*((100vw-320px)/(1920-320)))] flex flex-wrap justify-center lg:justify-start gap-y-3 gap-x-6 text-[12.5px] font-bold text-slate-600">
                  {hero.bullets.map((b: string, i: number) => (
                    <span key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 size={16} style={{ color: primaryColor }} />{" "}
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div
                  className="absolute inset-0 bg-gradient-to-tr blur-[30px] rounded-3xl -z-10"
                  style={{
                    backgroundImage: `linear-gradient(to top right, ${primaryColor}15, #10b98115)`,
                  }}
                />

                <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden">
                  <Image
                    src={getResolvedImageUrl(hero.image)}
                    alt={hero.title || "Automation Builder Preview"}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <AutomationCatalog flowNodes={flowNodes} primaryColor={primaryColor} />

        <AutomationUseCases useCases={useCases} primaryColor={primaryColor} />

        <AutomationFAQs faqs={faqs} primaryColor={primaryColor} />
      </div>
    </ProductLayout>
  );
}
