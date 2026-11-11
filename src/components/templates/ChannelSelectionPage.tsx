/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/src/elements/ui/card";
import { Button } from "@/src/elements/ui/button";
import { ArrowRight, MessageSquare, Send, Settings2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { TemplateSettingsModal } from "./list/TemplateSettingsModal";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { templateChannels } from "@/src/data/templates";



const ChannelSelectionPage: React.FC = () => {
  const router = useRouter();
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { getEnabledChannels, isFeatureEnabled, isLoading } = useFeatureAccess();
  const enabled = getEnabledChannels();

  const channels = templateChannels.filter((ch) => {
    if (ch.id === "whatsapp") return true;
    if (ch.id === "facebook") return enabled.facebook && isFeatureEnabled("fb_template");
    if (ch.id === "instagram") return enabled.instagram && isFeatureEnabled("ig_template");
    if (ch.id === "telegram") return enabled.telegram && isFeatureEnabled("tg_template");
    return true;
  });

  const handleConfigure = (platform: string) => {
    router.push(`/message_templates?platform=${platform}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm font-semibold text-slate-500 dark:text-gray-400">
        Loading channels...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-12 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-primary tracking-tight leading-none">
            Message Templates
          </h1>
          <p className="text-slate-500 text-sm font-medium max-w-2xl dark:text-gray-400">
            Manage and configure structured message templates across all of your omnichannel communications. Select a channel to proceed.
          </p>
        </div>
        <div className="shrink-0">
          <Button variant="outline" onClick={() => setIsSettingsModalOpen(true)} className="h-12 px-4.5! py-5 gap-2.5 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-gray-400 rounded-lg font-semibold transition-all shadow-xs hover:bg-slate-50 dark:hover:bg-(--table-hover)" title="Template Settings">
            <Settings2 className="w-5 h-5 text-slate-400 dark:text-amber-50" />
            <span className="inline text-sm">Template Setting</span>
          </Button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {channels.map((ch) => (
          <Card
            key={ch.id}
            className={`overflow-hidden border border-slate-200/60 dark:border-(--card-border-color) hover:shadow-xl transition-all duration-300 rounded-lg flex flex-col justify-between h-full dark:from-slate-900 dark:via-(--card-color) dark:to-(--card-color) ${ch.colorClass}`}
          >
            <CardContent className="sm:p-6 p-4 flex flex-col h-full justify-between gap-8">
              <div className="space-y-6">
                {/* Brand Icon wrapped in colored backdrop bubble */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs"
                  style={{ backgroundColor: ch.iconBgColor, borderColor: ch.iconBorderColor }}
                >
                  {ch.icon}
                </div>

                {/* Info details */}
                <div className="space-y-2.5">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {ch.title}
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed">
                    {ch.description}
                  </p>
                </div>
              </div>

              {/* Action area */}
              <div className="pt-2">
                <Button
                  onClick={() => handleConfigure(ch.id)}
                  className="w-full h-11 font-bold rounded-lg flex items-center justify-center gap-2 group transition-all hover:opacity-90 active:scale-98 text-white px-4.5 py-5 cursor-pointer"
                  style={{ backgroundColor: ch.btnColor }}
                >
                  Configure
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <TemplateSettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />
    </div>
  );
};

export default ChannelSelectionPage;
