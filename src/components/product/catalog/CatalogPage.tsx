"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ProductLayout from "@/src/components/product/ProductLayout";
import { ROUTES } from "@/src/constants";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/src/redux/hooks";
import { ArrowUpRight, CheckCircle2, Store } from "lucide-react";
import Image from "next/image";
import { getResolvedImageUrl } from "@/src/utils/image";

import CatalogPlayground from "./components/CatalogPlayground";
import CatalogUseCases from "./components/CatalogUseCases";
import CatalogCapabilities from "./components/CatalogCapabilities";
import CatalogFAQs from "./components/CatalogFAQs";
import { Button } from "@/src/elements/ui/button";
import { CatalogPageProps } from "@/src/types/product";
import {
  cataloguesCapabilitiesFeatures,
  cataloguesFaqItems,
} from "@/src/data/product";

export default function CatalogPage({ pageData }: CatalogPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const page = pageData?.data;
  const isPageValid = page && page.status && page.dynamic_content;
  const dc = isPageValid ? page.dynamic_content : {};

  const colorConfig = page?.color_config || {};
  const primaryColor = colorConfig.primary_color || "#d97706";

  const hero = {
    badge: dc.hero?.badge || "WhatsApp Commerce",
    title:
      dc.hero?.title || "Turn WhatsApp into a Direct Storefront for Checkout",
    subtitle:
      dc.hero?.subtitle ||
      "Showcase digital menus, synced stock categories, and details directly to clients inside DMs. Allow shoppers to browse, compile carts, and request automated secure billing links in 1-click.",
    button_text: dc.hero?.button_text || "Start Selling Now",
    button_url: dc.hero?.button_url || ROUTES.SignUp,
    button_2_text: dc.hero?.button_2_text || "Try Catalog Simulator",
    bullets: Array.isArray(dc.hero?.bullets)
      ? dc.hero.bullets
      : [
          "Auto-sync inventories",
          "Native Checkout Flow",
          "Stripe & Razorpay ready",
        ],
    image: dc.hero?.image || dc.hero?.side_image || null,
  };

  const sandbox = dc.live_demo ||
    dc.sandbox || {
      badge: "LIVE DEMO",
      title: "Interact with the Catalog & Checkout Sandbox",
      description:
        "Connect your Meta catalogs or build dynamic menu items. Allow shoppers to compile carts, browse listings, and checkout directly.",
      image: dc.live_demo?.image || dc.live_demo?.side_image || null,
    };

  const useCases = {
    badge: dc.use_cases?.badge || "USE CASES",
    title: dc.use_cases?.title || "Real-Time Catalog Integration Examples",
    description:
      dc.use_cases?.description ||
      "See how top industries utilize synced digital catalogs on WhatsApp to convert conversations into sales instantly.",
    tabs: Array.isArray(dc.use_cases?.tabs)
      ? dc.use_cases.tabs
      : [
          {
            heading: "01. E-Commerce Checkout",
            title: "Instantly Sync Inventory & Checkout with Shopify",
            description:
              "Retailers link their shop databases to automatically reflect pricing adjustments, inventory levels, and details on WhatsApp catalog profiles.",
            bullets: [
              "Customers browse collections inside their chat bubble.",
              "Items added to cart compile into a native order summary format.",
              "Checkout web link triggers on order placement for payment gateway integration.",
            ],
          },
          {
            heading: "02. Restaurant Digital Ordering",
            title: "Interactive Menu Ordering for Food Delivery",
            description:
              "Restaurants and bakeries list categorized menus (Appetizers, Mains, Drinks) with descriptions. Customers select sizes, spice levels, or customizations before adding dishes.",
            bullets: [
              "Scan table QR codes to immediately pull up the WhatsApp menu.",
              "Bot asks: 'Add spice customization?' list selection prompt.",
              "Dispatches kitchen ticket directly to thermal printers on checkout.",
            ],
          },
          {
            heading: "03. Professional Service Bookings",
            title: "Digital Service Catalogues for Consultants",
            description:
              "Agencies, therapists, or business coaches showcase packages (1 Hour Consultation, Monthly Design Retainer, SEO Audit) directly on the dashboard.",
            bullets: [
              "Allows prospects to pick service packages without external scheduling links.",
              "Integrates with CRM custom fields to trigger specific support routines.",
              "Auto-routes tickets to dedicated account specialists upon checkout.",
            ],
          },
        ],
  };

  const capabilities = {
    badge: dc.capabilities?.badge || "Catalog Capabilities",
    title:
      dc.capabilities?.title || "Everything You Need to Power Mobile Commerce",
    features: Array.isArray(dc.capabilities?.features)
      ? dc.capabilities.features
      : cataloguesCapabilitiesFeatures,
  };

  const faqs = {
    badge: dc.faqs?.badge || "FAQs",
    title: dc.faqs?.title || "Questions about Catalog Integrations?",
    items: Array.isArray(dc.faqs?.items) ? dc.faqs.items : cataloguesFaqItems,
  };

  return (
    <ProductLayout>
      <div className="relative overflow-x-hidden bg-[#FCFCFD] text-slate-800 font-sans text-left">
        <div
          className="absolute top-[2%] left-[-15%] w-[60vw] h-[60vw] rounded-full blur-[130px] pointer-events-none"
          style={{ backgroundColor: "#d97706", opacity: 0.08 }}
        />
        <div
          className="absolute top-[35%] right-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: "#0f766e", opacity: 0.06 }}
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
                  className="inline-flex items-center gap-2 uppercase tracking-wide px-3 py-1 mb-6 rounded-full  shadow-sm w-fit"
                  style={{ backgroundColor: primaryColor + "10" }}
                >
                  <Store size={14} style={{ color: primaryColor }} />
                  <span
                    className="text-xs font-bold font-mono"
                    style={{ color: primaryColor }}
                  >
                    {hero.badge}
                  </span>
                </div>

                <h1 className="text-[calc(22px+(50-22)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 leading-[1.08] mb-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] tracking-tight">
                  {hero.title}
                </h1>

                <p className="text-[calc(14px+(16-14)*((100vw-320px)/(1920-320)))] text-slate-500 mb-[calc(12px+(32-12)*((100vw-320px)/(1920-320)))] max-w-xl leading-relaxed font-medium text-slate-600">
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
                      boxShadow: `0 10px 30px ${primaryColor}30`,
                    }}
                  >
                    {hero.button_text} <ArrowUpRight size={16} />
                  </Button>
                </div>

                {hero.bullets.length > 0 && (
                  <div className="mt-[calc(12px+(32-12)*((100vw-320px)/(1920-320)))] flex flex-wrap gap-y-3 gap-x-6 text-[12.5px] font-bold text-slate-600">
                    {hero.bullets.map((bullet: string, idx: number) => (
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
                  <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-slate-50">
                    <Image
                      src={getResolvedImageUrl(hero.image)}
                      alt={hero.title || "Catalog storefront preview"}
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

        <CatalogPlayground sandbox={sandbox} primaryColor={primaryColor} />

        <CatalogUseCases useCases={useCases} primaryColor={primaryColor} />

        <CatalogCapabilities
          capabilities={capabilities}
          primaryColor={primaryColor}
        />

        <CatalogFAQs faqs={faqs} primaryColor={primaryColor} />
      </div>
    </ProductLayout>
  );
}
