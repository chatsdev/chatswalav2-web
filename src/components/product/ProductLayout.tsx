/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import Header from "../landing/Header";
import Footer from "../landing/Footer";
import TapTop from "../landing/TapTop";
import { useTheme } from "next-themes";
import { useGetLandingPageQuery } from "../../redux/api/landingPageApi";
import Loading from "@/src/app/loading";

import { useAppSelector } from "../../redux/hooks";

const ProductLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: landingData, isLoading } = useGetLandingPageQuery();
  const { landing_page_enabled, isSettingsLoaded } = useAppSelector((state) => state.setting);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const previousTheme = theme;
    setTheme("light");
    return () => {
      if (previousTheme) {
        setTheme(previousTheme);
      }
    };
  }, [setTheme, theme]);

  if (isLoading || !isSettingsLoaded) return <Loading />;

  if (landing_page_enabled === false) return null;

  return (
    <div className="bg-[var(--soft-white)] text-slate-900 relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-teal-500/3 rounded-full blur-[100px]" />
      </div>

      <Header isColor={true} />
      <main className="pt-20">{children}</main>
      <Footer data={(landingData?.data?.footer_section as any) || {}} />
      <TapTop />
    </div>
  );
};

export default ProductLayout;
