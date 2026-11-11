"use client";

import { ROUTES } from "@/src/constants";
import { telegramFeatures } from "@/src/data/ChannelConnectionInfo";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { TelegramPageProps } from "@/src/types/channel";
import { getResolvedImageUrl } from "@/src/utils/image";
import { Check, Send, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TelegramFeatures from "./components/TelegramFeatures";
import TelegramSalesCTA from "./components/TelegramSalesCTA";
import TelegramSteps from "./components/TelegramSteps";

const TelegramPage = ({ pageData }: TelegramPageProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const content = isPageValid ? page.dynamic_content : {};

  const colorConfig = page?.color_config || {};
  const primaryColor = colorConfig.primary_color || "#0088cc";
  const tgGradient =
    "linear-gradient(135deg, oklch(0.72 0.13 235) 0%, oklch(0.60 0.16 240) 50%, oklch(0.50 0.18 245) 100%)";

  const hero = {
    badge:
      content.hero_section?.badge !== undefined
        ? content.hero_section.badge
        : "Official Telegram Connection",
    title:
      content.hero_section?.title || "Automate Your Telegram Customer Chats",
    subtitle:
      content.hero_section?.subtitle ||
      "Connect your business chat, create quick message templates with buttons, set up automatic replies for customer questions, and track all incoming messages easily.",
    button_text: content.hero_section?.button_text || "Link Your Chat Bot",
    button_url: content.hero_section?.button_url || ROUTES.SignUp,
    button_2_text: content.hero_section?.button_2_text || "See What It Can Do",
    button2_url: content.hero_section?.button2_url || "",
    bullets: Array.isArray(content.hero_section?.bullets)
      ? content.hero_section.bullets
      : [
          "Message History Logs",
          "Easy Reply Buttons",
          "Auto-Replies for Words",
        ],
    side_image:
      content.hero_section?.side_image ||
      content.hero_section?.side_gif ||
      null,
  };

  const featuresSection = {
    badge:
      content.features?.badge !== undefined
        ? content.features.badge
        : "Built-In Features",
    title: content.features?.title || "Powerful Features Made Simple",
    subtitle:
      content.features?.subtitle ||
      "Here is everything you can set up to manage your customer conversations in real-time.",
    features: Array.isArray(content.features?.features)
      ? content.features.features
      : telegramFeatures,
  };

  const stepsSection = content.steps || {};

  const sales = content.sales_section || {};

  return (
    <div className="relative overflow-x-clip bg-[#fafbfe] text-slate-800">
      <div
        className="absolute top-0 left-0 right-0 h-[900px] pointer-events-none -z-10"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in oklab, oklch(0.65 0.18 240) 12%, white) 0%, color-mix(in oklab, oklch(0.75 0.12 210) 6%, white) 60%, rgba(255,255,255,0) 100%)",
        }}
      />

      <div
        className="absolute top-[20%] left-[-10%] w-[45vw] h-[45vw] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: primaryColor, opacity: 0.05 }}
      />
      <div
        className="absolute top-[60%] right-[-8%] w-[40vw] h-[40vw] rounded-full blur-[120px] pointer-events-none"
        style={{ backgroundColor: primaryColor, opacity: 0.05 }}
      />

      <section className="relative pt-[calc(30px+40*((100vw-320px)/1600))] pb-[calc(40px+50*((100vw-320px)/1600))] overflow-visible">
        <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[calc(16px+(48-16)*((100vw-320px)/(1920-320)))] items-center">
            <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
              {hero.badge && (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full uppercase text-white tracking-wide"
                  style={{ background: tgGradient }}
                >
                  <Send size={14} style={{ color: "white" }} />
                  <span className="text-xs font-bold text-white">
                    {hero.badge}
                  </span>
                </div>
              )}

              <h1 className="text-[calc(26px+24*((100vw-320px)/1600))] font-bold text-slate-900 leading-[1.1] mb-[calc(9px+(24-9)*((100vw-320px)/(1920-320)))] tracking-tight max-w-2xl">
                {hero.title ? (
                  hero.title.includes("Telegram") ? (
                    <>
                      {hero.title.split("Telegram")[0]}
                      <span
                        className="text-transparent"
                        style={{
                          background: tgGradient,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Telegram
                      </span>
                      {hero.title.split("Telegram")[1]}
                    </>
                  ) : (
                    hero.title
                  )
                ) : (
                  "Automate Your Telegram Customer Chats"
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
                  className="text-white px-8! py-6! h-12! rounded-lg! font-bold! text-[16px]! shadow-lg! border-none! cursor-pointer! flex! items-center! justify-center! gap-2!"
                  style={{
                    background: tgGradient,
                    boxShadow:
                      "0 8px 30px color-mix(in oklab, oklch(0.60 0.16 240) 35%, transparent)",
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
                  <Image
                    src={getResolvedImageUrl(hero.side_image)}
                    alt="Telegram features"
                    width={480}
                    height={300}
                    unoptimized
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TelegramFeatures
        featuresSection={featuresSection}
        getResolvedImageUrl={getResolvedImageUrl}
        tgGradient={tgGradient}
        primaryColor={primaryColor}
      />

      <TelegramSteps
        stepsSection={stepsSection}
        primaryColor={primaryColor}
        tgGradient={tgGradient}
      />

      <TelegramSalesCTA
        sales={sales}
        isAuthenticated={isAuthenticated}
        router={router}
        primaryColor={primaryColor}
        tgGradient={tgGradient}
      />
    </div>
  );
};

export default TelegramPage;
