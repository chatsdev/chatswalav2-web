"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import CommonHeader from "@/src/shared/CommonHeader";
import { ArrowRight, BotMessageSquare, ExternalLink, Link } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const ToolCard = ({
  title,
  description,
  icon: Icon,
  onIntegrate,
  onManage,
  accentColor = "emerald",
}: {
  title: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  onIntegrate: () => void;
  onManage: () => void;
  accentColor?: "emerald" | "indigo" | "purple" | "blue";
}) => {
  const colors = {
    emerald: "from-emerald-500/10 to-teal-500/5 text-primary border-[var(--primary-opacity-20)] dark:border-primary/20",
    indigo: "from-indigo-500/10 to-blue-500/5 text-indigo-600 border-indigo-100 dark:border-indigo-500/20",
    purple: "from-purple-500/10 to-violet-500/5 text-purple-600 border-purple-100 dark:border-purple-500/20",
    blue: "from-blue-500/10 to-sky-500/5 text-blue-600 border-blue-100 dark:border-blue-500/20",
  }[accentColor];

  const buttonColors = {
    emerald: "bg-primary hover:bg-primary shadow-primary/20",
    indigo: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20",
    purple: "bg-purple-600 hover:bg-purple-700 shadow-purple-500/20",
    blue: "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20",
  }[accentColor];

  return (
    <div className={`group relative h-full bg-white dark:bg-(--card-color) rounded-lg border sm:p-6 p-4 shadow transition-all hover:shadow-md dark:hover:shadow-none ${colors.split(" ")[2]}`}>
      <div className="relative z-10 flex flex-col h-full gap-6">
        <div className={`w-14 h-14 rounded-xl bg-linear-to-br flex items-center justify-center bg-primary/10`}>
          <Icon size={28} className={"text-primary"} />
        </div>

        <div className="space-y-2 flex-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button onClick={onManage} className="flex-1 flex items-center gap-2 px-6 py-5.5 bg-slate-50 dark:bg-(--page-body-bg) text-primary dark:text-primary hover:bg-slate-100 dark:hover:bg-(--table-hover) rounded-md text-sm font-bold transition-all border border-slate-200 dark:border-none">
            Manage
            <ExternalLink size={16} className="opacity-50" />
          </Button>
          <Button onClick={onIntegrate} className={`flex-1 flex items-center gap-2 px-6 py-5.5 text-white rounded-md text-sm font-bold transition-all shadow-lg active:scale-95 bg-primary `}>
            <Icon size={16} />
            Integrate
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ToolsPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const tools = [
    {
      title: t("whatsapp_website_widget"),
      description:
        "Boost sales and customer support on WhatsApp with personalized CTAs on your website. Simple to set up and customize.",
      icon: BotMessageSquare,
      accentColor: "emerald" as const,
      onIntegrate: () => router.push(ROUTES.ToolsWidget),
      onManage: () => router.push(ROUTES.ToolsWidgets),
    },
    {
      title: t("whatsapp_link_generator"),
      description:
        "Generate shareable links and QR codes for your WhatsApp business number to start conversations instantly.",
      icon: Link,
      accentColor: "emerald" as const,
      onIntegrate: () => router.push(ROUTES.ToolsLinkGenerator),
      onManage: () => router.push(ROUTES.ToolsLinks),
    },
  ];

  return (
    <div className="sm:p-8 pt-0! p-4 space-y-10 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader title={t("tools_page_title")} description={t("tools_page_description")} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <ToolCard key={idx} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default ToolsPage;
