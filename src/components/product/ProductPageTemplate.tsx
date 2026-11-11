/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FEATURESINFOLIST, PRODUCTINFOLIST } from "@/src/data";
import { Button } from "@/src/elements/ui/button";
import {
  FeatureBlock,
  ProductPageTemplateProps,
  UseCase,
} from "@/src/types/product";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Images from "../../shared/Image";

const HeroSection: React.FC<ProductPageTemplateProps["hero"]> = ({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  image,
}) => {
  const router = useRouter();
  return (
    <section className="relative py-[calc(25px+47*((100vw-320px)/1600))] overflow-hidden bg-white min-h-[85vh] flex flex-col justify-center">
      <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[calc(9px+(48-9)*((100vw-320px)/(1920-320)))] items-center">
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col text-center lg:text-left items-center lg:items-start z-10"
          >
            <div className="inline-block px-4 py-1.5 mb-[calc(20px+12*((100vw-320px)/1600))] rounded-full bg-slate-50 border border-slate-100">
              <span className="text-xs font-bold text-slate-500">
                Official WhatsApp API Partner
              </span>
            </div>
            <h1 className="text-[calc(18px+23*((100vw-320px)/1600))] font-black text-slate-900 leading-[1.05] mb-[calc(14px+18*((100vw-320px)/1600))] tracking-tight max-w-2xl">
              {title}
            </h1>
            <p className="text-[calc(14px+4*((100vw-320px)/1600))] text-slate-600 mb-[calc(16px+26*((100vw-320px)/1600))] max-w-xl leading-relaxed font-medium">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-[calc(16px+24*((100vw-320px)/1600))]">
              {primaryCTA && (
                <Button
                  onClick={() => router.push(primaryCTA.link)}
                  className="bg-primary text-white px-8! py-6! h-11 rounded-lg font-bold text-[16px] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                >
                  {primaryCTA.text}
                </Button>
              )}
              <Button
                onClick={() => router.push(secondaryCTA.link)}
                variant="outline"
                className="border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-8! py-6! h-11 rounded-lg font-bold text-[16px] transition-all flex items-center justify-center gap-2"
              >
                {secondaryCTA.text}
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative w-full max-w-[750px] mx-auto z-10 p-4"
          >
            <div className="w-full h-auto flex items-center justify-center">
              <div className="w-full transition-all duration-500 hover:-translate-y-1">
                <Images
                  src={image}
                  alt="Product Interface"
                  width={800}
                  height={600}
                  unoptimized
                  className="w-full h-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC<{ features: FeatureBlock[] }> = ({
  features,
}) => (
  <section className="py-[calc(25px+47*((100vw-320px)/1600))] bg-white">
    <div className="container mx-auto px-[calc(8px+(24-8)*((100vw-320px)/(1920-320)))] md:px-12 xl:px-16 flex flex-col gap-[calc(36px+28*((100vw-320px)/1600))]">
      {features.map((feature, idx) => {
        const isEven = idx % 2 === 0;
        return (
          <div
            key={idx}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-[calc(9px+(48-9)*((100vw-320px)/(1920-320)))] items-center`}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col text-center lg:text-left items-center lg:items-start z-10 ${isEven ? "lg:order-1" : "lg:order-2"}`}
            >
              <div className="h-1 w-12 bg-primary mb-[calc(26px+22*((100vw-320px)/1600))] rounded-full" />
              <h2 className="text-[calc(21px+19*((100vw-320px)/1600))] font-black text-slate-900 mb-[calc(18px+14*((100vw-320px)/1600))] leading-[1.1] tracking-tight">
                {feature.title}
              </h2>
              <p className="text-[calc(14px+6*((100vw-320px)/1600))] text-slate-600 mb-[calc(22px+26*((100vw-320px)/1600))] max-w-xl leading-relaxed font-normal">
                {feature.description}
              </p>
              <div className="space-y-5">
                {FEATURESINFOLIST.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 text-slate-900 mb-[calc(14px+6*((100vw-320px)/1600))] font-bold text-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="text-primary w-4 h-4 shrink-0" />
                    </div>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className={`relative w-full max-w-[750px] mx-auto z-10 p-4 ${isEven ? "lg:order-2" : "lg:order-1"}`}
            >
              <div className="w-full h-auto flex items-center justify-center">
                <div className="w-full transition-all duration-500 hover:-translate-y-1">
                  <Images
                    src={feature.image}
                    alt={feature.imageAlt}
                    width={800}
                    height={600}
                    unoptimized
                    className="w-full h-auto object-contain rounded-lg transition-transform duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  </section>
);

const UseCasesGrid: React.FC<{ useCases: UseCase[] }> = ({ useCases }) => (
  <section className="py-[calc(25px+47*((100vw-320px)/1600))] bg-slate-50">
    <div className="container mx-auto px-[calc(14px+10*((100vw-320px)/1600))]">
      <div className="text-center max-w-4xl mx-auto mb-[calc(26px+70*((100vw-320px)/1600))]">
        <h2 className="text-[calc(21px+20*((100vw-320px)/1600))] font-black text-slate-900 mb-[calc(12px+8*((100vw-320px)/1600))] tracking-tighter">
          Built for modern business
        </h2>
        <p className="text-[calc(14px+6*((100vw-320px)/1600))] text-slate-500 font-medium">
          Empower your team with a platform that scales with your ambition.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-[calc(24px+16*((100vw-320px)/1600))]">
        {useCases.map((useCase, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="bg-white p-[calc(14px+10*((100vw-320px)/1600))] rounded-lg border border-slate-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 group h-full"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-5 transition-colors group-hover:bg-primary group-hover:text-white">
              {useCase.icon}
            </div>
            <h3 className="text-[calc(20px+4*((100vw-320px)/1600))] font-bold text-slate-900 mb-[calc(14px+10*((100vw-320px)/1600))]">
              {useCase.title}
            </h3>
            <p className="text-md text-slate-500 leading-relaxed font-medium">
              {useCase.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ProductPageTemplate: React.FC<ProductPageTemplateProps> = ({
  hero,
  features,
  useCases,
}) => {
  return (
    <div className="flex flex-col bg-soft-white">
      <HeroSection {...hero} />

      <section className="py-[calc(16px+32*((100vw-320px)/1600))] bg-white border-y border-slate-50">
        <div className="container mx-auto px-[calc(14px+10*((100vw-320px)/1600))]">
          <div className="flex flex-wrap justify-between items-center gap-[calc(20px+12*((100vw-320px)/1600))] opacity-50 max-w-5xl mx-auto grayscale">
            {PRODUCTINFOLIST.map((text, i) => (
              <span key={i} className="text-slate-500 font-medium text-sm ">
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <FeaturesSection features={features} />
      <UseCasesGrid useCases={useCases} />
    </div>
  );
};

export default ProductPageTemplate;
