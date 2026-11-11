/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Skeleton } from "@/src/elements/ui/skeleton";
import { usePermissions } from "@/src/hooks/usePermissions";
import { useGetMyPermissionsQuery } from "@/src/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setPermissions } from "@/src/redux/reducers/authSlice";
import { setSidebarToggle } from "@/src/redux/reducers/layoutSlice";
import { setPageTitle } from "@/src/redux/reducers/settingSlice";
import { MenuItem, SidebarProps } from "@/src/types/components";
import { ChevronDown, ChevronLeft, ChevronRight, Globe, Mail, Menu, X, Crown } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MENUITEMS } from "@/src/data/SidebarList";
import { ROUTES } from "@/src/constants";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/elements/ui/tooltip";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { getUrlWithBasePath } from "@/src/utils";

const SidebarSkeleton = ({ isVisuallyExpanded }: { isVisuallyExpanded: boolean }) => (
  <div className={`p-3 space-y-4 ${!isVisuallyExpanded ? "items-center flex flex-col" : ""}`}>
    {[...Array(2)].map((i, index) => (
      <div key={index} className={`flex items-center gap-3 w-full ${!isVisuallyExpanded ? "justify-center" : "px-3"}`}>
        <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
        {isVisuallyExpanded && <Skeleton className="h-5 flex-1 rounded-md" />}
      </div>
    ))}
  </div>
);

const AgentSidebarCard = ({ isVisuallyExpanded, user }: { isVisuallyExpanded: boolean; user: any }) => {
  const { app_email } = useAppSelector((state) => state.setting);
  if (!isVisuallyExpanded) return null;
  return (
    <div className="mx-4 mb-8 p-5 rounded-2xl bg-(--input-color) dark:bg-white/2 border border-slate-100 dark:border-white/5 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">{user?.name?.charAt(0).toUpperCase() || "A"}</div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name || "Agent"}</p>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-medium text-slate-400">{user?.email || "Support Specialist"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-slate-400">
              <Mail size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">Official Support</span>
            </div>
            <p className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{app_email}</p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2">
              <Globe size={12} className="text-primary" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
            </div>
            <span className="text-[9px] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ onMenuClick }: SidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const contactId = searchParams.get("contact_id");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { sidebarToggle } = useAppSelector((state) => state.layout);
  const { theme } = useTheme();
  const { logo_light_url, logo_dark_url, sidebar_light_logo_url, sidebar_dark_logo_url, app_name } = useAppSelector((state) => state.setting);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const role = user?.role;
  const isAgent = role === "agent";

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const { hasPermission } = usePermissions();
  const { data: permissionsRes } = useGetMyPermissionsQuery(undefined, {
    skip: !isAuthenticated || !user,
  });

  useEffect(() => {
    if (permissionsRes?.success) {
      dispatch(setPermissions(permissionsRes.data));
    }
  }, [permissionsRes, dispatch]);

  const { isFeatureEnabled, getEnabledChannels, isLoading: featureLoading, isPlatformAllowed, getPlatformFromSection } = useFeatureAccess();
  const enabledChannels = getEnabledChannels();
  const restrictedPaths = [ROUTES.Orders, ROUTES.Catalogues, ROUTES.Webhooks, ROUTES.AppointmentBooking, ROUTES.WhatsappForm, ROUTES.AICall, ROUTES.AICallAgents, ROUTES.AICallLogs, ROUTES.AICallAgentsCreate, ROUTES.AICallAgentsEdit];

  const filteredMenuItems = MENUITEMS.map((item) => {
    let isPlanDisabled = false;

    // A. Check if featureKey is disabled by plan
    if (item.featureKey && !isFeatureEnabled(item.featureKey)) {
      isPlanDisabled = true;
    }

    // B. Check if channel is disabled by plan
    if (item.section === "telegram_sidebar_title" && !enabledChannels.telegram) {
      isPlanDisabled = true;
    }
    if (item.section === "facebook_sidebar_title") {
      if (!enabledChannels.facebook) {
        isPlanDisabled = true;
      } else if (item.path === ROUTES.FacebookLead && !isFeatureEnabled("facebook_lead")) {
        isPlanDisabled = true;
      }
    }
    if (item.section === "instagram_sidebar_title" && !enabledChannels.instagram) {
      isPlanDisabled = true;
    }
    if (item.section === "twitter_sidebar_title" && !enabledChannels.twitter) {
      isPlanDisabled = true;
    }

    return { ...item, isPlanDisabled };
  }).filter((item) => {
    // 0. Omnichannel platform admin setting check
    const platform = getPlatformFromSection(item.section);
    if (platform && !isPlatformAllowed(platform)) {
      return false;
    }

    // 1. Role check
    if (item.roles && !item.roles.includes(user?.role || "")) {
      return false;
    }

    // 2. Hide Tasks from sidebar for non-agents
    if (item.label === "tasks" && user?.role !== "agent") {
      return false;
    }

    // 3. Baileys restriction
    if (isBaileys && restrictedPaths.some((p) => item.path.startsWith(p))) {
      return false;
    }

    // 4. Permissions check
    return !item.permission || hasPermission(item.permission);
  }).map((item) => {
    if (isAgent && item.label === "tasks") {
      return { ...item, path: ROUTES.Tasks, section: undefined, order: 3 };
    }
    return item;
  });

  const sections = ["overview_sidebar_title", "communication_sidebar_title", "instagram_sidebar_title", "facebook_sidebar_title", "telegram_sidebar_title", "twitter_sidebar_title", "social_media_sidebar_title", "shopify_sidebar_title", "contacts_audience_sidebar_title", "automation_sidebar_title", "operations_sidebar_title", "marketing_sidebar_title", "tools_sidebar_title", "team_management_sidebar_title", "setup_integration_sidebar_title", "billing_settings_sidebar_title"];
  const filteredSections = sections;
  const [clickedItemId, setClickedItemId] = useState<string | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 1025) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    const activeItem = filteredMenuItems.find((item) => isPathActive(item.path));
    if (activeItem) {
      dispatch(setPageTitle(t(activeItem.label)));
    }
  }, [pathname, filteredMenuItems, t, dispatch]);

  const isVisuallyExpanded = mounted ? !sidebarToggle || isMobileOpen : false;

  const sidebarLogo = useMemo<string | null>(() => {
    if (!mounted) return null;

    const isDark = theme === "dark";
    const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
    const resolveUrl = (url?: string) => {
      if (!url) return "";
      if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
        return url;
      }
      const normalizedUrl = url.replace(/\\/g, "/");
      const cleanUrl = normalizedUrl.startsWith("/") ? normalizedUrl : `/${normalizedUrl}`;
      const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
      return `${baseUrl}${cleanUrl}`;
    };

    if (isVisuallyExpanded) {
      const url = isDark ? logo_dark_url : logo_light_url;
      return getUrlWithBasePath(resolveUrl(url) ||(isDark ? "/assets/logos/logo3.png" : "/assets/logos/logo1.png"));
    }

    const url = isDark ? sidebar_dark_logo_url : sidebar_light_logo_url;
    return getUrlWithBasePath(resolveUrl(url) ||( isDark ? "/assets/logos/sidebarLogoDark.png" : "/assets/logos/sidebarLogo.png"))
  }, [mounted, theme, isVisuallyExpanded, logo_light_url, logo_dark_url, sidebar_light_logo_url, sidebar_dark_logo_url]);

  const [openSections, setOpenSections] = useState<string[]>(["overview_sidebar_title", "communication_sidebar_title"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]));
  };

  const handleItemClick = (item: MenuItem) => {
    if (!isVisuallyExpanded) {
      setClickedItemId(item.label);
      setTimeout(() => setClickedItemId(null), 1500);
    }
    router.push(item.path);
    if (onMenuClick) onMenuClick(t(item.label));
    setIsMobileOpen(false);
  };

  const isPathActive = (path: string) => {
    if (pathname.startsWith(ROUTES.MessageCampaignsAdd) && contactId) {
      if (path === ROUTES.WAChat) return true;
      if (path === ROUTES.MessageCampaigns) return false;
    }

    if (pathname.startsWith(ROUTES.Tasks) && path === ROUTES.Agents) {
      return true;
    }

    if (pathname.startsWith(ROUTES.AICall) && path === ROUTES.AICallAgents) {
      return true;
    }

    if (pathname === path) return true;
    if (pathname.length > 1 && path.length > 1 && pathname.startsWith(path + "/")) return true;
    if (path === ROUTES.MessageTemplates && pathname.startsWith(ROUTES.TemplatesLibrary)) return true;
    return false;
  };

  const renderMenuItem = (item: MenuItem & { isPlanDisabled?: boolean }) => {
    const isActive = isPathActive(item.path);
    const label = t(item.label);
    const isPlanDisabled = item.isPlanDisabled;

    const menuItemContent = (
      <div
        onClick={() => {
          if (isPlanDisabled) return;
          handleItemClick(item);
        }}
        className={`
          w-full flex items-center justify-between rounded-lg transition-all duration-300 mb-1 select-none relative
          ${isPlanDisabled ? "cursor-not-allowed" : "cursor-pointer"}
          ${isVisuallyExpanded ? "px-3 py-2.5" : "px-0 py-3 justify-center"}
          ${isActive && !isPlanDisabled ? "bg-(--light-primary) dark:bg-primary" : ""}
          ${!isActive ? "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-(--table-hover) hover:translate-x-1" : ""}
        `}
      >
        <div className="flex items-center gap-3 min-w-0 relative">
          <span className={`
            shrink-0
            ${!isActive ? "text-slate-600 dark:text-amber-50" : "text-primary dark:text-white"}
          `}>
            {item.icon}
          </span>
          {isVisuallyExpanded && (
            <span className={`
              font-medium text-sm truncate
              ${isActive ? "text-primary dark:text-white" : "text-slate-700 dark:text-white"}
            `}>
              {label}
            </span>
          )}
          
          {/* Collapsed small corner badge */}
          {!isVisuallyExpanded && isPlanDisabled && (
            <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white rounded-full p-0.5 border border-white dark:border-slate-900 shadow-sm animate-in zoom-in duration-300 flex items-center justify-center">
              <Crown size={8} strokeWidth={3} />
            </div>
          )}
        </div>
        
        {/* Expanded badge on the right */}
        {isVisuallyExpanded && isPlanDisabled && (
          <div className="flex items-center justify-center bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/30 p-1.5 rounded-lg shrink-0 shadow-xs">
            <Crown size={11} strokeWidth={2.5} />
          </div>
        )}
      </div>
    );

    if (isPlanDisabled) {
      return (
        <Tooltip key={item.label}>
          <TooltipTrigger asChild>
            {menuItemContent}
          </TooltipTrigger>
          <TooltipContent side={isVisuallyExpanded ? "top" : "right"} className="ml-2 z-200 bg-slate-900 text-white border-slate-900 dark:bg-slate-800 dark:border-slate-800">
            To use this feature, upgrade your plan
          </TooltipContent>
        </Tooltip>
      );
    }

    if (isVisuallyExpanded) {
      return <div key={item.label}>{menuItemContent}</div>;
    }

    return (
      <Tooltip key={item.label} open={clickedItemId === item.label ? true : undefined}>
        <TooltipTrigger asChild>{menuItemContent}</TooltipTrigger>
        <TooltipContent side="right" className="ml-2 z-200 bg-primary text-white border-primary">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white dark:bg-(--page-body-bg) border-r border-gray-200 dark:border-(--card-border-color)">
      <div className={`flex items-center justify-center h-17 transition-all border-b duration-300 ${isVisuallyExpanded ? "px-6" : "px-3"}`}>
        <div className={`flex items-center w-full overflow-hidden justify-between`}>
          <div className="flex items-center gap-3 overflow-hidden">{sidebarLogo === null ? <div className="h-10 w-28 bg-gray-200 dark:bg-white/10 animate-pulse rounded-md" /> : <Image src={sidebarLogo} alt={app_name || "logo"} width={140} height={40} unoptimized className={`max-h-10 object-contain transition-all duration-300 ${isVisuallyExpanded ? "w-auto" : "w-full max-w-10"}`} />}</div>

          <div className="absolute -right-3.25 rtl:right-auto rtl:-left-2.25 p-1.5 rounded-md bg-primary text-white hover:bg-primary top-13.75 shadow-sm transition-all duration-300 hidden min-[1025px]:block cursor-pointer z-50 hover:scale-105 active:scale-95" onClick={() => dispatch(setSidebarToggle())}>
            {!sidebarToggle ? <ChevronLeft size={18} className="rtl:rotate-180" /> : <ChevronRight size={18} className="rtl:rotate-180" />}
          </div>

          <div className="ml-2 rtl:mr-2 rtl:ml-0 text-gray-500 hover:text-red-500 transition-colors min-[1025px]:hidden cursor-pointer" onClick={() => setIsMobileOpen(false)}>
            <X size={20} />
          </div>
        </div>
      </div>

      <nav className={`flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar ${!isVisuallyExpanded ? "overflow-x-hidden" : ""}`}>
        {!mounted || !user || featureLoading ? (
          <SidebarSkeleton isVisuallyExpanded={isVisuallyExpanded} />
        ) : (
          <>
            {filteredMenuItems
              .filter((item) => !item.section && item.order < 4)
              .sort((a, b) => a.order - b.order)
              .map(renderMenuItem)}

            {filteredSections.map((section) => {
              const sectionItems = filteredMenuItems.filter((item) => item.section === section);
              if (sectionItems.length === 0) return null;
              const isOpen = openSections.includes(section);

              return (
                <div key={section} className="mb-2">
                  {isVisuallyExpanded ? (
                    <>
                      <div onClick={() => toggleSection(section)} className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 dark:text-gray-400 dark:hover:text-gray-300 transition-colors cursor-pointer">
                        <span className={`truncate tracking-wider font-extrabold uppercase ${
                          section === "instagram_sidebar_title"
                            ? "bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F56040] bg-clip-text text-transparent"
                            : section === "facebook_sidebar_title"
                            ? "bg-gradient-to-r from-[#1877F2] to-[#00c6ff] bg-clip-text text-transparent"
                            : section === "telegram_sidebar_title"
                            ? "bg-gradient-to-r from-[#229ED9] to-[#0088cc] bg-clip-text text-transparent"
                            : section === "shopify_sidebar_title"
                            ? "bg-gradient-to-r from-[#95BF47] to-[#5e8e3e] bg-clip-text text-transparent"
                            : section === "twitter_sidebar_title"
                            ? "bg-gradient-to-r from-black via-slate-800 to-gray-600 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent"
                            : section === "social_media_sidebar_title"
                            ? "bg-gradient-to-r from-[#1877F2] via-[#E1306C] to-[#F56040] bg-clip-text text-transparent"
                            : "text-slate-400 dark:text-gray-400"
                        }`}>
                          {t(section)}
                        </span>
                        <ChevronDown size={16} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      </div>
                      <div
                        className={`
                          space-y-1 transition-all duration-300
                          ${isOpen ? "max-h-[1000px] opacity-100 mt-1" : "max-h-0 opacity-0 overflow-hidden"}
                        `}
                      >
                        {sectionItems.sort((a, b) => a.order - b.order).map(renderMenuItem)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="my-2 border-t border-gray-100 dark:border-(--card-border-color)" />
                      <div className="space-y-1">{sectionItems.sort((a, b) => a.order - b.order).map(renderMenuItem)}</div>
                    </>
                  )}
                </div>
              );
            })}

            {filteredMenuItems
              .filter((item) => !item.section && item.order >= 15)
              .sort((a, b) => a.order - b.order)
              .map(renderMenuItem)}
          </>
        )}
      </nav>

      {isAgent && <AgentSidebarCard isVisuallyExpanded={isVisuallyExpanded} user={user} />}
    </div>
  );

  return (
    <>
      {!isMobileOpen && (
        <div onClick={() => setIsMobileOpen(!isMobileOpen)} className="absolute top-3 left-4 rtl:right-4 rtl:left-auto z-101 p-2 rounded-lg bg-white dark:bg-(--page-body-bg) shadow-lg border border-gray-200 dark:border-none min-[1025px]:hidden cursor-pointer">
          <Menu size={20} />
        </div>
      )}

      {isMobileOpen && <div className="min-[1025px]:hidden fixed inset-0 bg-black/50 z-100" onClick={() => setIsMobileOpen(false)} />}

      <aside
        className={`
          absolute top-0 left-0 rtl:right-0 rtl:left-auto h-full z-101 shrink-0
          transform transition-all duration-300 ease-in-out
          ${isVisuallyExpanded ? "w-66.5" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full min-[1025px]:translate-x-0 min-[1025px]:rtl:translate-x-0"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
