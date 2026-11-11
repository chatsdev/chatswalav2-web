"use client";

import ProductLayout from "@/src/components/product/ProductLayout";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { getResolvedImageUrl } from "@/src/utils/image";
import { ArrowUpRight, CheckCircle2, Mic } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { faqItems, featuresCapabilities } from "@/src/data/product";
import { AICallingPageProps } from "@/src/types/product";
import AICallingCapabilities from "./components/AICallingCapabilities";
import AICallingFAQs from "./components/AICallingFAQs";
import { Button } from "@/src/elements/ui/button";


export default function AICallingPage({ pageData }: AICallingPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const dc = isPageValid ? page.dynamic_content : {};

  const colorConfig = page?.color_config || {};
  const primaryColor = colorConfig.primary_color || "#7c3aed";

  const hero = {
    badge: dc.hero?.badge || "WhatsApp Call Agent",
    title: dc.hero?.title || "Automate Voice Calls with AI Call Agents",
    subtitle:
      dc.hero?.subtitle ||
      "Configure custom voice bots to answer customer calls, run automated AI support prompts, and connect with external API systems.",
    button_text: dc.hero?.button_text || "Get Started Free",
    button_url: dc.hero?.button_url || ROUTES.SignUp,
    bullet_points: Array.isArray(dc.hero?.bullet_points)
      ? dc.hero.bullet_points
      : [
          "Welcome greetings",
          "Prompt instruction training",
          "Speech function actions",
        ],
    image: dc.hero?.image || dc.hero?.side_image || null,
  };

  const capabilities = {
    badge: dc.capabilities?.badge || "PLATFORM FEATURES",
    title: dc.capabilities?.title || "Voice Agent Capabilities",
    subtitle:
      dc.capabilities?.subtitle ||
      "Core WhatsApp voice calling features supported in your configuration panel.",
    features: Array.isArray(dc.capabilities?.features)
      ? dc.capabilities.features
      : featuresCapabilities,
  };

  const faqs = {
    badge: dc.faqs?.badge || "FAQs",
    title: dc.faqs?.title || "Frequently Asked Questions",
    items: Array.isArray(dc.faqs?.items) ? dc.faqs.items : faqItems,
  };

  return (
    <ProductLayout>
      <div className="relative overflow-x-hidden bg-[#FCFCFD] text-slate-800 font-sans text-left">
        <div
          className="absolute top-[2%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[130px] pointer-events-none"
          style={{ backgroundColor: "#7c3aed", opacity: 0.08 }}
        />
        <div
          className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: "#d946ef", opacity: 0.06 }}
        />

        <div
          className="absolute inset-0 opacity-45 pointer-events-none -z-10"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <section className="relative pt-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))] pb-[calc(16px+(60-16)*((100vw-320px)/(1920-320)))] overflow-visible">
          <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-[calc(16px+(48-16)*((100vw-320px)/(1920-320)))] items-center max-w-8xl mx-auto">
              <div className="flex flex-col text-left items-start z-10">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1 uppercase tracking-wide mb-6 rounded-full  shadow-sm w-fit"
                  style={{ backgroundColor: primaryColor + "10" }}
                >
                  <Mic size={14} style={{ color: primaryColor }} />
                  <span
                    className="text-xs font-bold font-mono"
                    style={{ color: primaryColor }}
                  >
                    {hero.badge}
                  </span>
                </div>

                <h1 className="text-[calc(18px+(50-18)*((100vw-320px)/(1920-320)))] font-black text-slate-900 leading-[1.08] mb-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] tracking-tight">
                  {hero.title}
                </h1>

                <p className="text-[17px] text-slate-600 mb-[calc(12px+(32-12)*((100vw-320px)/(1920-320)))] max-w-xl leading-relaxed font-bold">
                  {hero.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Button variant="unstyled"
                    onClick={() =>
                      router.push(
                        isAuthenticated ? ROUTES.Dashboard : hero.button_url,
                      )
                    }
                    className="text-white px-8! py-5! h-12! rounded-lg font-bold text-[16px] border-none cursor-pointer flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: primaryColor,
                      boxShadow: `0 10px 30px ${primaryColor}30`,
                    }}
                  >
                    {hero.button_text} <ArrowUpRight size={16} />
                  </Button>
                </div>

                {hero.bullet_points.length > 0 && (
                  <div className="mt-8 flex flex-wrap gap-y-3 gap-x-6 text-[12.5px] font-bold text-slate-600">
                    {hero.bullet_points.map((bullet: string, idx: number) => (
                      <span key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2
                          size={16}
                          style={{ color: primaryColor }}
                        />{" "}
                        {bullet}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative w-full max-w-[500px] mx-auto z-10 p-1">
                <div className="w-full hover:-translate-y-1 transition-all duration-300">
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={getResolvedImageUrl(hero.image)}
                      alt={hero.title || "Voice agent preview"}
                      fill
                      unoptimized
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AICallingCapabilities
          capabilities={capabilities}
          primaryColor={primaryColor}
        />

        <AICallingFAQs faqs={faqs} primaryColor={primaryColor} />
      </div>
    </ProductLayout>
  );
}
