"use client";

import { ROUTES } from "@/src/constants";
import { useAppSelector } from "@/src/redux/hooks";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import Images from "../../shared/Image";
import { FeaturesProps } from "../../types/landingPage";
import { Button } from "@/src/elements/ui/button";
import { getUrlWithBasePath } from "@/src/utils";
import { ArrowRight, CheckCircle2 } from "lucide-react";

/** Hook: returns a ref that adds a visible class when element enters the viewport */
function useScrollReveal<T extends HTMLElement>(opts?: IntersectionObserverInit) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, ...opts }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

const Features: React.FC<FeaturesProps> = ({ data }) => {
  const route = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const features = data.features || [];
  const headerRef = useScrollReveal<HTMLDivElement>();

  return (
    <section id="features" className="py-12 lg:py-20 bg-white">
      {/* Inline animation styles */}
      <style>{`
        .reveal-item {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.65s cubic-bezier(.4,0,.2,1), transform 0.65s cubic-bezier(.4,0,.2,1);
        }
        .reveal-item.reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-left {
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1);
        }
        .reveal-left.reveal-visible {
          opacity: 1;
          transform: translateX(0);
        }
        .reveal-right {
          opacity: 0;
          transform: translateX(48px);
          transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1);
        }
        .reveal-right.reveal-visible {
          opacity: 1;
          transform: translateX(0);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headerRef} className="reveal-item text-center max-w-3xl mx-auto mb-[calc(20px+(80-20)*((100vw-320px)/(1920-320)))]">
          <span className="inline-block text-[12px] font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full mb-4">
            {data.badge || "FEATURES"}
          </span>

          <h2 className="text-[calc(20px+(36-20)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 mb-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] leading-tight">
            {data.title}
          </h2>

          <p className="text-[calc(14px+(17-14)*((100vw-320px)/(1920-320)))] text-slate-600 leading-relaxed">
            {data.description}
          </p>
        </div>

        {/* Feature Items — Alternating Layout with scroll reveal */}
        <div className="space-y-24 lg:space-y-32">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <FeatureRow
                key={index}
                feature={feature}
                index={index}
                isEven={isEven}
                isAuthenticated={isAuthenticated}
                user={user}
                route={route}
              />
            );
          })}
        </div>

        {/* CTA Section */}
        {data.cta_button?.text && (
          <CtaRow
            ctaButton={data.cta_button}
            isAuthenticated={isAuthenticated}
            user={user}
            route={route}
          />
        )}
      </div>
    </section>
  );
};

function FeatureRow({ feature, index, isEven, isAuthenticated, user, route }: any) {
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = [contentRef.current, imageRef.current].filter(Boolean) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger: image slightly after content
            setTimeout(() => entry.target.classList.add("reveal-visible"), 80);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-[calc(10px+(48-10)*((100vw-320px)/(1920-320)))] items-center mb-[calc(25px+(40-25)*((100vw-320px)/(1920-320)))]`}
    >
      {/* Content */}
      <div
        ref={contentRef}
        className={`${isEven ? "reveal-left" : "reveal-right"} ${!isEven ? "lg:order-2" : ""}`}
        style={{ transitionDelay: "0ms" }}
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary text-white mb-[calc(7px+(24-7)*((100vw-320px)/(1920-320)))] shadow-lg shadow-primary/25">
          <CheckCircle2 className="w-7 h-7" />
        </div>

        <h3 className="text-[calc(18px+(30-18)*((100vw-320px)/(1920-320)))] font-bold text-slate-900 mb-[calc(7px+(16-7)*((100vw-320px)/(1920-320)))] leading-tight">
          {feature.title}
        </h3>

        <p className="text-[calc(14px+(17-14)*((100vw-320px)/(1920-320)))] text-slate-600 leading-relaxed mb-[calc(12px+(24-12)*((100vw-320px)/(1920-320)))]">
          {feature.description}
        </p>
      </div>

      {/* Image */}
      <div
        ref={imageRef}
        className={`relative w-full max-w-[550px] mx-auto z-10 ${isEven ? "reveal-right" : "reveal-left"} ${!isEven ? "lg:order-1" : ""}`}
        style={{ transitionDelay: "120ms" }}
      >
        <div className="w-full h-auto flex items-center justify-center">
          <div className="w-full transition-all duration-500 hover:-translate-y-1">
            <div className="relative rounded-lg overflow-hidden p-0">
              <Images
                src={feature?.image || getUrlWithBasePath("/assets/images/default3.png")}
                alt={feature.title}
                width={800}
                height={600}
                className="w-full h-auto object-contain rounded-lg transition-transform duration-700"
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CtaRow({ ctaButton, isAuthenticated, user, route }: any) {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ctaRef} className="reveal-item mt-[calc(20px+(50-20)*((100vw-320px)/(1920-320)))] text-center">
      <Button
        className="group bg-primary hover:bg-primary/90 text-white px-8! py-4! h-12! rounded-lg font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25 inline-flex items-center gap-2"
        onClick={() => {
          route.push(ctaButton.link || "");
        }}
      >
        {ctaButton.text}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}

export default Features;
