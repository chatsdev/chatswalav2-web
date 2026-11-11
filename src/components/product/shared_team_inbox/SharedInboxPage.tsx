"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { Button } from "@/src/elements/ui/button";
import { getResolvedImageUrl } from "@/src/utils/image";
import Image from "next/image";

import InboxPlayground from "./components/InboxPlayground";
import InboxFeatures from "./components/InboxFeatures";
import InboxTeam from "./components/InboxTeam";
import InboxCounter from "./components/InboxCounter";
import InboxFAQs from "./components/InboxFAQs";
import { SharedInboxPageProps } from "@/src/types/product";
import { inboxCard, inboxCounter, inboxTeam } from "@/src/data/product";



const SharedInboxPage = ({ pageData }: SharedInboxPageProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const dc = isPageValid ? page.dynamic_content : {};

  const colorConfig = page?.color_config || {};
  const primaryColor = colorConfig.primary_color || "#967205";

  const hero = {
    badge: dc.hero?.badge || "Omnichannel Team Hub",
    title: dc.hero?.title || "",
    subtitle: dc.hero?.subtitle || "Stop sharing phones or scanning QR codes. Bring all WhatsApp, Instagram, and Facebook conversations into a single desktop viewport. Help your agents close leads 10x faster with integrated AI.",
    button_text: dc.hero?.button_text || "Start Free Trial",
    button_url: dc.hero?.button_url || ROUTES.SignUp,
    button_2_text: dc.hero?.button_2_text || "Try Live Playground",
    bullets: Array.isArray(dc.hero?.bullets) ? dc.hero.bullets : ["Multi-Agent Routing", "AI Response Suggestion", "Mask Numbers (Privacy)"],
    image: dc.hero?.image || dc.hero?.side_image || null,
  };

  const sandbox = dc.sandbox || {};

  const features = {
    badge: dc.features?.badge || "Engineered for Results",
    title: dc.features?.title || "Everything You Need to Automate Customer Success",
    cards: Array.isArray(dc.features?.cards) ? dc.features.cards : inboxCard
  };

  const team = {
    badge: dc.team?.badge || "Team Collaboration",
    title: dc.team?.title || "Build Better Collaborations Behind the Scenes",
    description: dc.team?.description || "Enable your agents to coordinate on customer issues in real-time. Share labels, leave private internal instructions, and track agent activity logs without switching windows.",
    cards: Array.isArray(dc.team?.cards) ? dc.team.cards : inboxTeam,
    side_image: dc.team?.side_image || null,
  };

  const counter = {
    badge: dc.counter?.badge || "Performance Impact",
    title: dc.counter?.title || "Grow Your Business on Solid Numbers",
    subtitle: dc.counter?.subtitle || "See how adding a multi-agent Shared Inbox affects key business performance indicators. By automating drafts and routing chats instantly, teams respond faster and keep customers happier.",
    counters: Array.isArray(dc.counter?.counters) ? dc.counter.counters : inboxCounter
  };

  const faqs = {
    badge: dc.faqs?.badge || "FAQs",
    title: dc.faqs?.title || "Got Questions about the Shared Inbox?",
    items: Array.isArray(dc.faqs?.items) ? dc.faqs.items : [
      { question: "Do agents need their own separate mobile devices?", answer: "No. The entire workspace runs on a single official WhatsApp Business API profile or social page. Support agents login through their own dashboard accounts and share access dynamically." },
      { question: "How does the contact masking / privacy control feature work?", answer: "Admins can enable contact masking in settings. Once activated, phone numbers are masked on the screen (e.g. +1 •••• ••-9922). Agents can send and receive texts, but cannot view or export complete contact numbers." },
      { question: "Can we write notes to other team members during a chat?", answer: "Yes. Private Internal Notes can be written directly on the chat flow. They are highlighted with a distinct yellow theme and are completely invisible to customers." },
      { question: "How do AI suggestions and text transformation work?", answer: "Our integrated LLM evaluates the client question and context to draft a reply instantly. Agents can hit the \"Suggest Reply\" button to insert it or use the rewrite panel to adjust tone guidelines." }
    ]
  };

  return (
    <div className="relative overflow-x-hidden bg-[#FCFCFD] text-slate-800 font-sans text-left">

      <div className="absolute top-[2%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[130px] pointer-events-none" style={{ backgroundColor: "var(--primary)", opacity: 0.10 }} />
      <div className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none" style={{ backgroundColor: "var(--primary)", opacity: 0.10 }} />

      <div className="absolute inset-0 opacity-40 pointer-events-none -z-10" style={{ backgroundImage: "radial-gradient(ellipse at center, #e2e8f0 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

      <section className="relative pt-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))] pb-[calc(16px+(60-16)*((100vw-320px)/(1920-320)))] overflow-visible">
        <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1.10fr_0.90fr] gap-[calc(8px+(48-8)*((100vw-320px)/(1920-320)))] items-center">

            <div className="flex flex-col text-center lg:text-left items-center lg:items-start z-10">
              {hero.badge && (
                <div className="inline-flex items-center gap-2.5 px-4 py-2 mb-6 rounded-full uppercase tracking-wide" style={{ backgroundColor: primaryColor + '10' }}>
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse uppercase tracking-wide" style={{ backgroundColor: primaryColor }} />
                  <span className="text-sm font-bold font-mono" style={{ color: primaryColor }}>
                    {hero.badge}
                  </span>
                </div>
              )}

              <h1 className="text-[calc(18px+(50-18)*((100vw-320px)/(1920-320)))] font-black text-slate-900 leading-[1.08] mb-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] tracking-tight max-w-2xl text-center lg:text-left">
                {hero.title ? (
                  hero.title
                ) : (
                  <>One Unified <span style={{ background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}cc)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Shared Inbox</span> for Collaboration</>
                )}
              </h1>

              <p className="text-[calc(14px+(17-14)*((100vw-320px)/(1920-320)))] text-slate-600 mb-[calc(16px+(32-16)*((100vw-320px)/(1920-320)))] max-w-xl leading-relaxed font-semibold text-center lg:text-left">
                {hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  onClick={() => router.push(isAuthenticated ? ROUTES.Dashboard : hero.button_url)}
                  className="text-white px-8! py-5! h-12! rounded-lg font-bold text-[16px] border-none cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, ${primaryColor}dd)`,
                    boxShadow: `0 10px 30px ${primaryColor}30`
                  }}
                >
                  {hero.button_text} <Zap size={16} />
                </Button>
              </div>

              {hero.bullets.length > 0 && (
                <div className="mt-[calc(16px+(40-16)*((100vw-320px)/(1920-320)))] flex flex-wrap gap-x-6 gap-y-3 justify-center lg:justify-start text-[13px] font-bold text-slate-600">
                  {hero.bullets.map((bullet: string, idx: number) => (
                    <span key={idx} className="flex items-center gap-2">
                      <CheckCircle2 size={16} style={{ color: primaryColor }} /> {bullet}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full max-w-[600px] mx-auto z-10 p-4">
              <div className="w-full h-auto flex items-center justify-center">
                <div className="w-full  transition-all duration-500 hover:-translate-y-1">
                  <Image
                    src={getResolvedImageUrl(hero.image)}
                    alt="Shared Team Inbox"
                    width={540}
                    height={350}
                    unoptimized
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <InboxPlayground sandbox={sandbox} primaryColor={primaryColor} />

      <InboxFeatures features={features} primaryColor={primaryColor} />

      <InboxTeam team={team} primaryColor={primaryColor} />

      <InboxCounter counter={counter} primaryColor={primaryColor} />

      <InboxFAQs faqs={faqs} primaryColor={primaryColor} />

    </div>
  );
};

export default SharedInboxPage;
