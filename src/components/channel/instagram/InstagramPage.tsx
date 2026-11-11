"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { getResolvedImageUrl } from "@/src/utils/image";
import { Check, Instagram, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { instagramFeatures } from "@/src/data/ChannelConnectionInfo";
import { InstagramPageProps } from "@/src/types/channel";
import InstagramFeatures from "./components/InstagramFeatures";
import InstagramPlayground from "./components/InstagramPlayground";
import InstagramSalesCTA from "./components/InstagramSalesCTA";
import InstagramSteps from "./components/InstagramSteps";

const InstagramPage = ({ pageData }: InstagramPageProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const igGradient =
    "linear-gradient(135deg, oklch(0.86 0.14 85) 0%, oklch(0.74 0.16 45) 25%, oklch(0.66 0.2 5) 55%, oklch(0.58 0.19 310) 85%, oklch(0.58 0.17 265) 100%)";

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const content = isPageValid ? page.dynamic_content : {};

  const hero = {
    badge:
      content.hero_section?.badge !== undefined
        ? content.hero_section.badge
        : "Official Instagram Connection",
    title:
      content.hero_section?.title ||
      "Turn Instagram Comments into Direct DM Sales",
    subtitle:
      content.hero_section?.subtitle ||
      "Send automated discount codes, product catalogs, or instant replies to customer messages the second they comment on your posts or reels.",
    button_text: content.hero_section?.button_text || "Connect Your Account",
    button_url: content.hero_section?.button_url || ROUTES.SignUp,
    button_2_text: content.hero_section?.button_2_text || "Test Demo First",
    button2_url: content.hero_section?.button2_url || "",
    bullets: Array.isArray(content.hero_section?.bullets)
      ? content.hero_section.bullets
      : [
          "Safe Official Connection",
          "Auto-like comments",
          "Sets up in 5 minutes",
        ],
    side_image:
      content.hero_section?.side_image ||
      content.hero_section?.side_gif ||
      null,
  };

  const commentSection = content.comment_section || {};

  const featuresSection = {
    badge:
      content.features?.badge !== undefined
        ? content.features.badge
        : "Features",
    title:
      content.features?.title || "Grow Your Brand on Instagram Automatically",
    subtitle:
      content.features?.subtitle ||
      "Here is everything you can set up to manage your customer conversations and ads in one place.",
    features: Array.isArray(content.features?.features)
      ? content.features.features
      : instagramFeatures,
  };

  const stepsSection = content.steps || {};

  const sales = content.sales_section || {};

  return (
    <div className="relative overflow-x-clip bg-white text-slate-800">
      <div className="absolute top-[2%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#833AB4]/6 blur-[120px] pointer-events-none" />
      <div className="absolute top-[32%] right-[-8%] w-[40vw] h-[40vw] rounded-full bg-[#E1306C]/6 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[25%] left-[5%] w-[42vw] h-[42vw] rounded-full bg-[#F56040]/5 blur-[130px] pointer-events-none" />

      <section className="relative pt-[calc(30px+40*((100vw-320px)/1600))] pb-[calc(40px+50*((100vw-320px)/1600))] overflow-visible">
        <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[calc(9px+(48-9)*((100vw-320px)/(1920-320)))] items-center">
            <div className="flex flex-col text-center lg:text-left items-center lg:items-start">
              {hero.badge && (
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 text-white mb-6 rounded-full uppercase tracking-wide"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.86 0.14 85) 0%, oklch(0.74 0.16 45) 25%, oklch(0.66 0.2 5) 55%, oklch(0.58 0.19 310) 85%, oklch(0.58 0.17 265) 100%)",
                  }}
                >
                  <Instagram size={14} />
                  <span className="text-xs font-bold">{hero.badge}</span>
                </div>
              )}

              <h1 className="text-[calc(26px+24*((100vw-320px)/1600))] font-bold text-slate-900 leading-[1.1] mb-[calc(9px+(24-9)*((100vw-320px)/(1920-320)))] tracking-tight max-w-2xl">
                {hero.title ? (
                  hero.title.includes("Instagram") ? (
                    <>
                      {hero.title.split("Instagram")[0]}
                      <span className="bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] bg-clip-text text-transparent">
                        Instagram
                      </span>
                      {hero.title.split("Instagram")[1]}
                    </>
                  ) : (
                    hero.title
                  )
                ) : (
                  "Turn Instagram Comments into Direct DM Sales"
                )}
              </h1>

              <p className="text-[17px] text-slate-600 mb-8 max-w-xl leading-relaxed font-medium">
                {hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  onClick={() =>
                    router.push(
                      isAuthenticated ? ROUTES.Dashboard : hero.button_url,
                    )
                  }
                  className="text-white px-8! py-6! h-11! rounded-lg font-bold text-[16px] transition-all hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] border-none cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.86 0.14 85) 0%, oklch(0.74 0.16 45) 25%, oklch(0.66 0.2 5) 55%, oklch(0.58 0.19 310) 85%, oklch(0.58 0.17 265) 100%)",
                    boxShadow:
                      "0 8px 24px color-mix(in oklab, oklch(0.66 0.2 5) 30%, transparent)",
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

              {/* Sub features list */}
              {hero.bullets.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start text-xs font-bold text-slate-550">
                  {hero.bullets.map((bullet: string, idx: number) => (
                    <span key={idx} className="flex items-center gap-1.5">
                      <Check size={14} style={{ color: "oklch(0.66 0.2 5)" }} />{" "}
                      {bullet}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="relative w-full max-w-[878px] mx-auto z-10 h-full flex">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full rounded-lg transition-all duration-500 hover:-translate-y-1">
                  <Image
                    src={getResolvedImageUrl(hero.side_image)}
                    alt="Instagram Features"
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

      <InstagramPlayground commentSection={commentSection} />

      <InstagramFeatures
        featuresSection={featuresSection}
        getResolvedImageUrl={getResolvedImageUrl}
        igGradient={igGradient}
      />

      <InstagramSteps stepsSection={stepsSection} />

      <InstagramSalesCTA
        sales={sales}
        isAuthenticated={isAuthenticated}
        router={router}
      />
    </div>
  );
};

export default InstagramPage;
