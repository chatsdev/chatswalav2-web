"use client";

import ProductLayout from "@/src/components/product/ProductLayout";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { getResolvedImageUrl } from "@/src/utils/image";
import { ArrowUpRight, CheckCircle2, Megaphone } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  ctwaFaq,
  ctwaFeatures,
  ctwaStepLaunch,
  ctwaStructure,
} from "@/src/data/product";
import { Button } from "@/src/elements/ui/button";
import { CtwaPageProps } from "@/src/types/product";
import CtwaFAQs from "./components/CtwaFAQs";
import CtwaFeatures from "./components/CtwaFeatures";
import CtwaStructure from "./components/CtwaStructure";
import CtwaWizard from "./components/CtwaWizard";

export default function CtwaPage({ pageData }: CtwaPageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const dc = isPageValid ? page.dynamic_content : {};

  const colorConfig = page?.color_config || {};
  const primaryColor = colorConfig.primary_color || "#4f46e5";

  const hero = {
    badge: dc.hero?.badge || "Click to WhatsApp Ads",
    title: dc.hero?.title || "",
    description:
      dc.hero?.description ||
      "Create, manage, and optimize ad campaigns that open WhatsApp chats directly. Target the right audience, track performance in real-time, and convert leads faster.",
    button_text: dc.hero?.button_text || "Launch Your First Campaign",
    button_url: dc.hero?.button_url || ROUTES.SignUp,
    button_2_text: dc.hero?.button_2_text || "Explore Features",
    bullets: Array.isArray(dc.hero?.bullets)
      ? dc.hero.bullets
      : ["Facebook & Instagram", "3-Step Wizard", "Real-Time Analytics"],
    image: dc.hero?.image || dc.hero?.side_image || null,
  };

  const structure = {
    badge: dc.structure?.badge || "Structure",
    title: dc.structure?.title || "Campaign hierarchy, visualized",
    subtitle:
      dc.structure?.subtitle ||
      "Three levels that define your ad strategy — from broad targeting to precise creative delivery.",
    steps: Array.isArray(dc.structure?.steps)
      ? dc.structure.steps
      : ctwaStructure,
  };

  const features = {
    badge: dc.features?.badge || "Features",
    title: dc.features?.title || "Built for campaign success",
    items: Array.isArray(dc.features?.items) ? dc.features.items : ctwaFeatures,
  };

  const stepsLaunch = {
    badge: dc.steps_launch?.badge || "Wizard",
    title: dc.steps_launch?.title || "Three simple steps to launch",
    description:
      dc.steps_launch?.description ||
      "From concept to live campaign in minutes.",
    steps: Array.isArray(dc.steps_launch?.steps)
      ? dc.steps_launch.steps
      : ctwaStepLaunch,
  };

  const faqs = {
    badge: dc.faqs?.badge || "FAQs",
    title: dc.faqs?.title || "Click to WhatsApp Ads — common questions",
    items: Array.isArray(dc.faqs?.items) ? dc.faqs.items : ctwaFaq,
  };

  return (
    <ProductLayout>
      <div className="relative overflow-x-hidden bg-white text-slate-800 font-sans text-left">
        <div
          className="absolute top-[2%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[130px] pointer-events-none"
          style={{ backgroundColor: "#4f46e5", opacity: 0.05 }}
        />
        <div
          className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: "#7c3aed", opacity: 0.05 }}
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
            <div className="flex justify-center mb-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full uppercase tracking-wide shadow-sm  w-fit"
                style={{ backgroundColor: primaryColor + "10" }}
              >
                <Megaphone size={14} style={{ color: primaryColor }} />
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: primaryColor }}
                >
                  {hero.badge}
                </span>
              </div>
            </div>

            <div className="text-center max-w-6xl mx-auto mb-[calc(24px+(56-24)*((100vw-320px)/(1920-320)))]">
              <h1 className="text-[calc(18px+(62-18)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 leading-[1.05] tracking-tight">
                {hero.title ? (
                  hero.title
                ) : (
                  <>
                    Turn Facebook &amp; Instagram ads into
                    <br />
                    <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                      live WhatsApp conversations
                    </span>
                  </>
                )}
              </h1>
              <p className="text-[17px] text-slate-600 mt-[calc(6px+(24-6)*((100vw-320px)/(1920-320)))] max-w-3xl mx-auto leading-relaxed font-medium font-sans">
                {hero.description}
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))]">
                <Button
                  onClick={() =>
                    router.push(
                      isAuthenticated ? ROUTES.Dashboard : hero.button_url,
                    )
                  }
                  className="text-white px-8! py-4! h-12! rounded-lg font-bold text-[15px] border-none cursor-pointer flex items-center gap-2"
                  style={{
                    backgroundColor: primaryColor,
                    boxShadow: `0 8px 20px ${primaryColor}20`,
                  }}
                >
                  {hero.button_text} <ArrowUpRight size={16} />
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-[calc(18px+(40-18)*((100vw-320px)/(1920-320)))] text-[13px] font-bold text-slate-600">
                {hero.bullets.map((bullet: string, idx: number) => (
                  <span key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 size={15} style={{ color: primaryColor }} />{" "}
                    {bullet}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative mt-16 max-w-5xl mx-auto z-10">
              <div
                className="absolute -inset-4 bg-gradient-to-r from-indigo-200/20 via-violet-200/20 to-fuchsia-200/20 rounded-3xl blur-3xl"
                style={{ ["--tw-gradient-from" as any]: primaryColor + "10" }}
              />

              <div className="relative w-full aspect-[12/5] rounded-lg overflow-hidden">
                <Image
                  src={getResolvedImageUrl(hero.image)}
                  alt={hero.title || "CTWA Campaign Dashboard"}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        <CtwaStructure structure={structure} primaryColor={primaryColor} />

        <CtwaFeatures features={features} primaryColor={primaryColor} />

        <CtwaWizard stepsLaunch={stepsLaunch} primaryColor={primaryColor} />

        <CtwaFAQs faqs={faqs} primaryColor={primaryColor} />
      </div>
    </ProductLayout>
  );
}
