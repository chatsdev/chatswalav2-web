/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppSelector } from "@/src/redux/hooks";
import { useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import WabaRequired from "@/src/shared/WabaRequired";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ChannelSelectionPage from "./ChannelSelectionPage";
import AdminTemplateLibrary from "./AdminTemplateLibrary";
import MessageTemplates from "./MessageTemplates";
import TemplatesSidebar from "./TemplatesSidebar";
import { usePermissions } from "@/src/hooks/usePermissions";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { TemplateView } from "@/src/types/components/template";

const UnifiedTemplatesPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasPermission, isAuthenticated } = usePermissions();
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const wabaId = selectedWorkspace?.waba_id;
  const canViewExplore = hasPermission("view.admin-template");

  const { data: channelsData, isLoading: isLoadingChannels } = useGetConnectedChannelsQuery(
    { workspace_id: selectedWorkspace?._id },
    { skip: !selectedWorkspace?._id }
  );

  const isTelegramConnected = !!channelsData?.data?.find((c: any) => c.platform === "telegram");
  const isFacebookConnected = !!channelsData?.data?.find((c: any) => c.platform === "facebook");
  const isInstagramConnected = !!channelsData?.data?.find((c: any) => c.platform === "instagram");

  const { getEnabledChannels, isFeatureEnabled, isLoading: subLoading } = useFeatureAccess();
  const enabledChannels = getEnabledChannels();

  // Retrieve selected platform
  const platform = searchParams.get("platform");

  // Initialize view from URL if present
  const [activeView, setActiveView] = useState<TemplateView>("custom");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (subLoading || !isAuthenticated) return;

    if (!platform) {
      // If no omnichannel platforms are enabled, fall back to WhatsApp templates automatically
      const hasOmnichannel = 
        (enabledChannels.facebook && isFeatureEnabled("fb_template")) || 
        (enabledChannels.instagram && isFeatureEnabled("ig_template")) || 
        (enabledChannels.telegram && isFeatureEnabled("tg_template"));
      if (!hasOmnichannel) {
        router.replace("/message_templates?platform=whatsapp");
      }
    } else {
      // If manually URL editing an unauthorized platform, push back to safety
      if (platform === "facebook" && (!enabledChannels.facebook || !isFeatureEnabled("fb_template"))) {
        router.replace("/message_templates");
      } else if (platform === "instagram" && (!enabledChannels.instagram || !isFeatureEnabled("ig_template"))) {
        router.replace("/message_templates");
      } else if (platform === "telegram" && (!enabledChannels.telegram || !isFeatureEnabled("tg_template"))) {
        router.replace("/message_templates");
      }
    }
  }, [platform, enabledChannels, subLoading, isAuthenticated, router, isFeatureEnabled]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const tab = searchParams.get("tab");
    if (tab === "explore" && canViewExplore) {
      setActiveView("explore");
    } else {
      setActiveView("custom");
    }
  }, [searchParams, canViewExplore, isAuthenticated]);

  // Explore tab state (passed to AdminTemplateLibrary)
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // All tab state (passed to MessageTemplates)
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleViewChange = (view: TemplateView) => {
    setActiveView(view);
    setSidebarOpen(false);

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", view);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const isPlatformAllowed = !platform ||
    platform === "whatsapp" ||
    (platform === "facebook" && enabledChannels.facebook && isFeatureEnabled("fb_template")) ||
    (platform === "instagram" && enabledChannels.instagram && isFeatureEnabled("ig_template")) ||
    (platform === "telegram" && enabledChannels.telegram && isFeatureEnabled("tg_template"));

  if (subLoading || (platform && !isPlatformAllowed)) {
    return (
      <div className="flex h-screen items-center justify-center text-sm font-semibold text-slate-500 dark:text-gray-400 bg-slate-50/50 dark:bg-(--dark-body)"> 
      </div>
    );
  }

  // If no platform selected, show beautiful brand-themed Channel Selection Grid
  if (!platform) {
    return <ChannelSelectionPage />;
  }

  // Check if platform is selected but not configured
  if (platform === "whatsapp" && !wabaId) {
    return <WabaRequired platform="whatsapp" title="WABA Connection Required" description="To manage WhatsApp message templates, you first need to connect a WhatsApp Business Account (WABA) to this workspace." />;
  }
  
  if (isLoadingChannels) {
    return (
      <div className="flex h-screen items-center justify-center text-sm font-semibold text-slate-500 dark:text-gray-400 bg-slate-50/50 dark:bg-(--dark-body)"> 
      </div>
    );
  }

  if (platform === "telegram" && !isTelegramConnected) {
    return <WabaRequired platform="telegram" />;
  }
  if (platform === "facebook" && !isFacebookConnected) {
    return <WabaRequired platform="facebook" />;
  }
  if (platform === "instagram" && !isInstagramConnected) {
    return <WabaRequired platform="instagram" />;
  }

  // Determine if we should show the Explore tab options in the sidebar
  const showExploreTab = canViewExplore;

  return (
    <div className="flex h-full bg-slate-50/50 dark:bg-(--dark-body) overflow-hidden relative">
      {sidebarOpen && <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-60 [@media(min-width:1600px)]:hidden" onClick={() => setSidebarOpen(false)} />}

      <div
        className={`
          absolute top-0 ltr:left-0 rtl:right-0 h-full z-70 transition-transform duration-300 ease-in-out
          [@media(min-width:1600px)]:static [@media(min-width:1600px)]:translate-x-0 [@media(min-width:1600px)]:z-auto [@media(min-width:1600px)]:h-full [@media(min-width:1600px)]:shrink-0
          ${sidebarOpen ? "translate-x-0" : "ltr:-translate-x-full rtl:translate-x-full"}
        `}
      >
        <TemplatesSidebar
          activeView={showExploreTab ? activeView : "custom"}
          selectedSector={selectedSector}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          onViewChange={handleViewChange}
          onSectorChange={setSelectedSector}
          onCategoryChange={setSelectedCategory}
          onStatusChange={setSelectedStatus}
          onClose={() => setSidebarOpen(false)}
          platform={platform}
        />
      </div>

      <div className="flex-1 h-screen overflow-hidden relative flex flex-col">
        <div className="flex-1 overflow-hidden">
          {activeView === "explore" ? (
            <AdminTemplateLibrary platform={platform} selectedSector={selectedSector} selectedCategory={selectedCategory} wabaId={wabaId} onToggleSidebar={() => setSidebarOpen(true)} />
          ) : (
            <MessageTemplates wabaId={wabaId || "none"} platform={platform} statusFilter={selectedStatus} onToggleSidebar={() => setSidebarOpen(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedTemplatesPage;
