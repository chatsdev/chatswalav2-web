"use client";

import { Button } from "@/src/elements/ui/button";
import { ArrowLeft, Phone, ShieldAlert, Send, Facebook, Instagram } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/src/redux/hooks";
import React from "react";
import { useTranslation } from "react-i18next";
import { ROUTES } from "../constants";

interface WabaRequiredProps {
  title?: string;
  description?: string;
  className?: string;
  platform?: "whatsapp" | "telegram" | "facebook" | "instagram" | "shopify" | "any" | string | null;
}

import { ShoppingBag } from "lucide-react";

const WabaRequired: React.FC<WabaRequiredProps> = ({ title, description, className = "", platform = "whatsapp" }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const isAgent = user?.role === "agent";

  const getPlatformConfig = () => {
    switch (platform) {
      case "telegram":
        return {
          title: title || t("telegram_connection_required_title"),
          description: description || t("telegram_connection_required_desc"),
          route: ROUTES.TelegramConnect,
          btnText: t("connect_telegram"),
          icon: <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        };
      case "facebook":
        return {
          title: title || t("facebook_connection_required_title"),
          description: description || t("facebook_connection_required_desc"),
          route: ROUTES.FacebookConnect,
          btnText: t("connect_facebook"),
          icon: <Facebook size={18} className="group-hover:scale-110 transition-transform" />
        };
      case "instagram":
        return {
          title: title || t("instagram_connection_required_title"),
          description: description || t("instagram_connection_required_desc"),
          route: ROUTES.InstagramConnect,
          btnText: t("connect_instagram"),
          icon: <Instagram size={18} className="group-hover:scale-110 transition-transform" />
        };
      case "shopify":
        return {
          title: title || t("shopify_connection_required_title"),
          description: description || t("shopify_connection_required_desc"),
          route: ROUTES.ShopifyConnect,
          btnText: t("connect_shopify"),
          icon: <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
        };
      case "any":
        return {
          title: title || t("channel_connection_required_title"),
          description: description || t("channel_connection_required_desc"),
          route: ROUTES.WABAConnection,
          btnText: t("connect_channel"),
          icon: <Phone size={18} className="group-hover:rotate-12 transition-transform" />
        };
      case "whatsapp":
      default:
        return {
          title: title || t("waba_connection_required_title"),
          description: description || t("waba_connection_required_desc"),
          route: ROUTES.WABAConnection,
          btnText: t("connect_waba_now"),
          icon: <Phone size={18} className="group-hover:rotate-12 transition-transform" />
        };
    }
  };

  const config = getPlatformConfig();

  const displayTitle = isAgent ? t("access_restricted") : config.title;
  const displayDescription = isAgent ? t("agent_waba_required_desc") : config.description;

  return (
    <div className={`space-y-8 h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center ${className}`}>
      <div className="max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto border-2 border-amber-100 dark:border-amber-900/40 shadow-inner">
          <ShieldAlert size={40} className="text-amber-500" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">{displayTitle}</h2>
          <p className="text-slate-500 dark:text-gray-400 font-medium leading-relaxed">{displayDescription}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!isAgent && (
            <Button onClick={() => router.push(config.route)} className="bg-primary text-white h-12 px-8 rounded-xl font-bold flex items-center gap-2 group shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              {config.icon}
              {config.btnText}
            </Button>
          )}
          <Button variant="outline" onClick={() => router.back()} className="h-12 px-6 rounded-xl font-bold flex items-center gap-2 border-slate-200 dark:border-white/10 dark:hover:bg-white/5 transition-all">
            <ArrowLeft size={18} />
            {t("go_back")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WabaRequired;
