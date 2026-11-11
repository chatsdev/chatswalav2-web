"use client";

import Logo3 from "@/public/assets/logos/logo3.png";
import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import Images from "@/src/shared/Image";
import { Facebook, Instagram, Linkedin, Twitter, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { FooterProps } from "../../types/landingPage";
import { useGetPublicPagesQuery } from "@/src/redux/api/pageApi";
import { useGetLandingPageQuery } from "@/src/redux/api/landingPageApi";
import { FOOTEROPTIONS } from "@/src/data";
import { Button } from "@/src/elements/ui/button";
import { useTranslation } from "react-i18next";

const Footer: React.FC<FooterProps> = ({ data }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: publicPagesData } = useGetPublicPagesQuery();
  const allPublicPages = publicPagesData?.data?.pages || [];

  const legalSlugs = ["terms-and-conditions", "privacy-policy", "refund-policy"];
  const publicPages = allPublicPages.filter((page) => !legalSlugs.includes(page.slug) && !page.system_reserved);
  const legalPages = allPublicPages.filter((page) => legalSlugs.includes(page.slug));

  const socialLinks = data.social_links && data.social_links[0] ? data.social_links[0] : null;
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { app_name, logo_dark_url } = useAppSelector((state) => state.setting);

  const { data: landingResponse } = useGetLandingPageQuery();
  const landingData = landingResponse?.data;

  const hasTestimonials = landingData
    ? (landingData.testimonials_section?.testimonials || [])
        .map((item) => item?._id)
        .filter((item) => !!item && typeof item === "object").length > 0
    : true;

  const hasFaqs = landingData
    ? (landingData.faq_section?.faqs || [])
        .map((f) => f?._id)
        .filter(Boolean).length > 0
    : true;

  const filteredFooterOptions = FOOTEROPTIONS.filter((option) => {
    const optLower = option.toLowerCase();
    if (optLower === "testimonials") {
      return hasTestimonials;
    }
    if (optLower === "faqs") {
      return hasFaqs;
    }
    return true;
  });

  const scrollToSection = (id: string) => {
    const mapping: Record<string, string> = {
      support: "contact",
      home: "home",
      features: "features",
      pricing: "pricing",
      testimonials: "testimonials",
      faqs: "faqs",
    };
    const sectionId = mapping[id.toLowerCase()] || id.toLowerCase();
    const el = document.getElementById(sectionId);

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      router.push(`${ROUTES.Landing}/#${sectionId}`);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinksArray = [
    { icon: <Twitter size={18} />, label: "Twitter", href: socialLinks?.twitter || "#" },
    { icon: <Facebook size={18} />, label: "Facebook", href: socialLinks?.facebook || "#" },
    { icon: <Instagram size={18} />, label: "Instagram", href: socialLinks?.instagram || "#" },
    { icon: <Linkedin size={18} />, label: "LinkedIn", href: socialLinks?.linkedin || "#" },
  ].filter((link) => link.href !== "#");

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-white/10">
          {/* Brand Column */}
          <div className={`${publicPages.length > 0 ? "lg:col-span-4" : "lg:col-span-6"} space-y-6`}>
            <div className="flex items-center gap-3">
              <Images src={logo_dark_url || Logo3} alt={`${app_name || t("app_name")} logo`} className="h-8 object-contain" width={100} height={40} />
            </div>
            
            <h3 className="text-xl lg:text-2xl font-black leading-tight">
              {data.cta_title}
            </h3>
            
            <p className="text-white/60 text-sm leading-relaxed">
              {data.cta_description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinksArray.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-all duration-300 hover:scale-110"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div className={`${publicPages.length > 0 ? "lg:col-span-5 grid-cols-2" : "lg:col-span-3 grid-cols-1"} grid gap-8`}>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Sections</h4>
              <div className="space-y-4">
                {filteredFooterOptions.map((col, i) => (
                  <a
                    key={i}
                    onClick={() => scrollToSection(col.toLowerCase())}
                    className="block text-sm text-white/70 hover:text-primary transition-colors cursor-pointer"
                  >
                    {col}
                  </a>
                ))}
              </div>
            </div>
            {publicPages.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Pages</h4>
                <div className="space-y-4">
                  {publicPages.map((page) => (
                    <Link
                      key={page._id}
                      href={`/page/${page.slug}`}
                      className="block text-sm text-white/70 hover:text-primary transition-colors"
                    >
                      {page.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-6">Get Started</h4>
            <div className="flex flex-col gap-3">
              {data.cta_buttons?.map((btn, idx) => (
                <Button
                  key={idx}
                  className={idx === 0 
                    ? "h-12 bg-primary hover:bg-primary/90 text-white font-bold text-sm rounded-xl transition-all" 
                    : "h-12 bg-transparent border-2 border-white/20 hover:bg-white/10 text-white font-bold text-sm rounded-xl transition-all"
                  }
                  onClick={() => {
                    router.push(btn.link || "");
                  }}
                >
                  {btn.text}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-white/50">
            &copy; {data.copy_rights_text || `${app_name || t("app_name")} 2026. All Rights Reserved.`}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {legalPages.map((page, index) => (
              <React.Fragment key={page._id}>
                <Link
                  href={`/page/${page.slug}`}
                  className="text-sm text-white/50 hover:text-primary transition-colors"
                >
                  {page.title}
                </Link>
                {index < legalPages.length - 1 && <span className="text-white/20">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Back to Top */}
      {/* <Button variant="unstyled"
        onClick={scrollToTop}
        className="absolute bottom-8 right-8 flex items-center justify-center w-12 h-12 rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg transition-all hover:scale-110 active:scale-95"
      >
        <ArrowUp size={20} />
      </Button> */}
    </footer>
  );
};

export default Footer;
