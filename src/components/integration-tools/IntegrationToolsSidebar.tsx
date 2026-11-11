"use client";

import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { IntegrationToolsSidebarData } from "@/src/types/integrationTools";
import {
  Code2,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Send,
  Settings,
  Terminal,
  Users,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const IntegrationToolsSidebar: React.FC<IntegrationToolsSidebarData> = ({
  activeTab,
  onTabChange,
}) => {
  const { t } = useTranslation();

  const menuItems = [
    {
      id: "conversational",
      title: t("conversational_api"),
      desc: t("conversational_api_desc"),
      icon: <MessageSquare size={20} />,
    },
    {
      id: "template",
      title: t("template_api"),
      desc: t("template_api_desc"),
      icon: <FileText size={20} />,
    },
    {
      id: "campaign",
      title: t("campaign_api"),
      desc: t("campaign_api_desc"),
      icon: <Send size={20} />,
    },
    {
      id: "contacts",
      title: t("contact_api"),
      desc: t("contact_api_desc"),
      icon: <Users size={20} />,
    },
    {
      id: "infrastructure",
      title: t("infrastructure"),
      desc: t("infrastructure_desc"),
      icon: <Settings size={20} />,
    },
    {
      id: "dashboard",
      title: t("api_keys"),
      desc: t("api_keys_desc"),
      icon: <LayoutDashboard size={20} />,
    },
  ];

  return (
    <div className="w-72 lg:w-80 border-r border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) flex flex-col h-full overflow-hidden shadow-sm">
      <div className="p-8 px-2 pb-2 flex items-center space-x-4">
        <div className="w-14 h-14 rounded-lg bg-primary/10 dark:bg-primary/10 flex items-center justify-center text-primary border border-primary/10 dark:border-primary/20 shadow-sm">
          <Terminal size={30} className="text-primary" />
        </div>
        <div>
          <h2 className="text-[18px] font-bold text-slate-900 dark:text-white">{t("developer_title")}</h2>
          <p className="text-[13px] text-slate-500 dark:text-gray-400 mt-1">{t("developer_subtitle")}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2 custom-scrollbar">
        <p className="text-[11px] font-bold text-slate-400 dark:text-gray-500 px-4 mb-3 tracking-wider uppercase">{t("api_types")}</p>

        {menuItems.map((item) => (
          <Button key={item.id} onClick={() => onTabChange(item.id)} className={cn("w-full text-left p-3 h-20 rounded-lg flex items-center gap-4 transition-all duration-200 group relative", activeTab === item.id ? "dark:hover:bg-primary/10! text-primary border hover:bg-primary/10! border-primary/10 bg-primary/10 dark:bg-primary/10 dark:border-primary/20" : "text-slate-600 dark:text-gray-400 hover:bg-slate-50 dark:hover:bg-(--table-hover) bg-[unset]!")}>
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-xs", activeTab === item.id ? "bg-white dark:bg-primary text-primary dark:text-white" : "bg-slate-100 dark:bg-(--dark-body) text-slate-400 dark:text-gray-500 group-hover:bg-white dark:group-hover:bg-(--card-color)")}>{item.icon}</div>
            <div className="flex-1 min-w-0">
              <p className={cn("font-semibold text-sm truncate", activeTab === item.id ? "text-primary dark:text-primary" : "text-slate-900 dark:text-white")}>{item.title}</p>
              <p className="text-xs text-slate-500 dark:text-gray-500 break-all whitespace-normal mt-0.5">{item.desc}</p>
            </div>
            {activeTab === item.id && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l-full shadow-sm" />}
          </Button>
        ))}
      </div>

      <div className="p-2 pb-0 mt-auto">
        <Button className="w-full h-12 bg-[unset]! text-primary border-t border-slate-200 dark:border-(--card-border-color) flex items-center justify-center gap-3 font-semibold text-sm">
          <Code2 size={18} />
          {t("documentation_v1")}
        </Button>
      </div>
    </div>
  );
};

export default IntegrationToolsSidebar;
