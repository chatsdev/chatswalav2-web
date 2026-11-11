"use client";

import Connect from "./Connect";
import Faq from "./Faq";
import Features from "./Features";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import HowItWorks from "./HowItWorks";
import PricingPlan from "./PricingPlan";
import TapTop from "./TapTop";
import Testimonial from "./Testimonial";
import { useGetLandingPageQuery } from "../../redux/api/landingPageApi";
import { useEffect } from "react";
import { useTheme } from "next-themes";
import Loading from "@/src/app/loading";
import { useAppSelector } from "../../redux/hooks";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/src/constants";

const Landing = () => {
  const { data: landingData, isLoading, error } = useGetLandingPageQuery();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { landing_page_enabled, isSettingsLoaded } = useAppSelector((state) => state.setting);

  useEffect(() => {
    if (isSettingsLoaded && landing_page_enabled === false) {
      router.replace(ROUTES.Login);
    }
  }, [landing_page_enabled, isSettingsLoaded, router]);

  useEffect(() => {
    const previousTheme = theme;
    setTheme("light");
    return () => {
      if (previousTheme) {
        setTheme(previousTheme);
      }
    };
  }, [setTheme, theme]);

  useEffect(() => {
    if (!isLoading && isSettingsLoaded && landingData?.data) {
      const handleScrollToHash = () => {
        const hash = window.location.hash;
        if (hash) {
          const id = hash.replace("#", "");
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      };

      // Run after a short delay to ensure DOM layout has completed
      const timer = setTimeout(handleScrollToHash, 300);

      window.addEventListener("hashchange", handleScrollToHash);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("hashchange", handleScrollToHash);
      };
    }
  }, [isLoading, isSettingsLoaded, landingData]);

  if (isLoading || !isSettingsLoaded) {
    return <Loading />;
  }

  if (landing_page_enabled === false) {
    return null;
  }

  if (error || !landingData?.data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-landing-card-dark text-white">
        <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h2>
        <p className="text-gray-400">Failed to load the landing page. Please try again later.</p>
      </div>
    );
  }

  const data = landingData.data;

  return (
    <div>
      <Header />
      <Home data={data.hero_section} />
      <Features data={data.features_section} />
      <HowItWorks data={data.platform_section} />
      <PricingPlan data={data.pricing_section} />
      <Testimonial data={data.testimonials_section} />
      <Faq data={data.faq_section} />
      <Connect data={data.contact_section} />
      <Footer data={data.footer_section} />
      <TapTop />
    </div>
  );
};

export default Landing;
