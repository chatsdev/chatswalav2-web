"use client";

import ProductLayout from "@/src/components/product/ProductLayout";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { getResolvedImageUrl } from "@/src/utils/image";
import { ArrowUpRight, CheckCircle2, FormInput } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  capabilitiesFallback,
  componentsFallback,
  faqsFallback,
  stepsFallback,
} from "@/src/data/product";
import { Button } from "@/src/elements/ui/button";
import { FormsPageProps } from "@/src/types/product";
import FormsCapabilities from "./components/FormsCapabilities";
import FormsFAQs from "./components/FormsFAQs";
import FormsPalette from "./components/FormsPalette";
import FormsWorkflow from "./components/FormsWorkflow";

export default function FormsPage({ pageData }: FormsPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const dc = isPageValid ? page.dynamic_content : {};

  const colorConfig = page?.color_config || {};
  const primaryColor = colorConfig.primary_color || "#967205";

  const hero = {
    badge: dc.hero?.badge || "WhatsApp Forms",
    title: dc.hero?.title || "",
    subtitle:
      dc.hero?.subtitle ||
      "Capture leads, feedback, and bookings with drag-and-drop forms that render natively in WhatsApp. No external links, no website redirects — just seamless inline data collection.",
    button_text: dc.hero?.button_text || "Start Building Free",
    button_url: dc.hero?.button_url || ROUTES.SignUp,
    button_2_text: dc.hero?.button_2_text || "See How It Works",
    button_2_url: dc.hero?.button2_url || "#forms-workflow",
    bullets: Array.isArray(dc.hero?.bullets)
      ? dc.hero.bullets
      : ["No-code builder", "Meta Flows powered", "Keyword auto-trigger"],
    image: dc.hero?.image || null,
  };

  const workflow = {
    badge: dc.workflow?.badge || "Workflow",
    title: dc.workflow?.title || "From design to delivery in three steps",
    description:
      dc.workflow?.description ||
      "A streamlined pipeline to create and deploy forms inside WhatsApp.",
    steps: Array.isArray(dc.workflow?.steps)
      ? dc.workflow.steps
      : stepsFallback,
  };

  const capabilities = {
    badge: dc.capabilities?.badge || "Capabilities",
    title:
      dc.capabilities?.title || "Everything you need to build powerful forms",
    items: Array.isArray(dc.capabilities?.items)
      ? dc.capabilities.items
      : capabilitiesFallback,
  };

  const componentsSection = {
    badge: dc.components_section?.badge || "Field Palette",
    title: dc.components_section?.title || "Available form components",
    description:
      dc.components_section?.description ||
      "Every field type you need to capture structured data.",
    components: Array.isArray(dc.components_section?.components)
      ? dc.components_section.components
      : componentsFallback,
  };

  const faqs = {
    badge: dc.faqs?.badge || "FAQs",
    title: dc.faqs?.title || "Questions about WhatsApp Forms?",
    items: Array.isArray(dc.faqs?.items) ? dc.faqs.items : faqsFallback,
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

        <section className="relative pt-[calc(25px+(65-25)*((100vw-320px)/(1920-320)))] pb-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))]">
          <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
            <div className="flex justify-center mb-[calc(12px+(32-12)*((100vw-320px)/(1920-320)))]">
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full uppercase tracking-wide text-xs font-bold font-mono"
                style={{
                  backgroundColor: primaryColor + "10",
                  borderColor: primaryColor + "20",
                  color: primaryColor,
                }}
              >
                <FormInput size={12} />
                {hero.badge}
              </span>
            </div>

            <div className="text-center max-w-5xl mx-auto">
              <h1 className="text-[calc(20px+(57-20)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 leading-[1.08] tracking-tight whitespace-pre-line">
                {hero.title ? (
                  hero.title
                ) : (
                  <>
                    Interactive forms that live{" "}
                    <span style={{ color: primaryColor }}>
                      inside WhatsApp chats
                    </span>
                  </>
                )}
              </h1>
              <p className="text-[calc(14px+(17-14)*((100vw-320px)/(1920-320)))] text-slate-600 mt-[calc(10px+(24-10)*((100vw-320px)/(1920-320)))] max-w-2xl mx-auto leading-relaxed font-medium font-sans">
                {hero.subtitle}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-[calc(14px+(40-14)*((100vw-320px)/(1920-320)))]">
                <Button
                  onClick={() => {
                    const url = isAuthenticated
                      ? ROUTES.Dashboard
                      : hero.button_url;
                    if (url.startsWith("#")) {
                      const el = document.getElementById(url.substring(1));
                      el?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      router.push(url);
                    }
                  }}
                  className="text-white px-8! py-4! h-12! rounded-lg font-bold text-[15px] transition-all border-none cursor-pointer flex items-center gap-2"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 10px 24px ${primaryColor}20`,
                  }}
                >
                  {hero.button_text} <ArrowUpRight size={16} />
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-[calc(14px+(40-14)*((100vw-320px)/(1920-320)))] text-[13px] font-bold text-slate-600">
                {hero.bullets.map((bullet: string, i: number) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} style={{ color: primaryColor }} />{" "}
                    {bullet}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mt-16 max-w-4xl mx-auto">
              <div
                className="absolute -inset-4 bg-gradient-to-r rounded-3xl blur-2xl pointer-events-none -z-10"
                style={{
                  backgroundImage: `linear-gradient(to right, ${primaryColor}05, #10b9810a, ${primaryColor}05)`,
                }}
              />

              <div className="relative w-full aspect-[12/5] rounded-lg overflow-hidden">
                <Image
                  src={getResolvedImageUrl(hero.image)}
                  alt={hero.title || "WhatsApp Forms Preview"}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <FormsWorkflow workflow={workflow} primaryColor={primaryColor} />

        <FormsCapabilities
          capabilities={capabilities}
          primaryColor={primaryColor}
        />

        <FormsPalette
          componentsSection={componentsSection}
          primaryColor={primaryColor}
        />

        <FormsFAQs faqs={faqs} primaryColor={primaryColor} />
      </div>
    </ProductLayout>
  );
}
