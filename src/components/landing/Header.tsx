"use client";

import Logo3 from "@/public/assets/logos/logo3.png";
import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { useAppSelector } from "@/src/redux/hooks";
import { MenuItem } from "@/src/types/landingPage";
import * as LucideIcons from "lucide-react";
import { ChevronDown, Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetLandingPageQuery } from "../../redux/api/landingPageApi";
import Images from "../../shared/Image";
import CurrencyDropdown from "../layouts/CurrencyDropdown";
import ProductDropdown from "./ProductDropdown";
import { defaultMenuItems } from "@/src/data/landing";

const getMenuIcon = (iconName?: string) => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  if (!IconComponent) return null;
  return <IconComponent className="w-4 h-4 shrink-0" />;
};

const Header = ({ isColor }: { isColor?: boolean }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileSubMenus, setOpenMobileSubMenus] = useState<Record<string, boolean>>({});
  const [activeSection, setActiveSection] = useState<string>("home");
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { app_name, logo_dark_url } = useAppSelector((state) => state.setting);

  // Fetch dynamic header settings from landing page document
  const { data: landingResponse } = useGetLandingPageQuery();
  const headerData = landingResponse?.data?.header_section;

  const menuItems = headerData?.menu_items && headerData.menu_items.length > 0
    ? headerData.menu_items
    : defaultMenuItems;

  const logoUrl = headerData?.logo_url || logo_dark_url || Logo3;

  const scrollToSection = (id: string) => {
    const isLandingPage = pathname === "/" || pathname === ROUTES.Landing;
    if (!isLandingPage) {
      router.push(`${ROUTES.Landing}#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (!el) return;
    setActiveSection(id);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isAnchorLink = (path?: string) => {
    if (!path) return false;
    return path.startsWith("#") || (!path.startsWith("/") && !path.startsWith("http://") && !path.startsWith("https://") && !path.startsWith("mailto:") && !path.startsWith("tel:"));
  };

  const handleLinkClick = (item: MenuItem, e: React.MouseEvent) => {
    if (item.path && isAnchorLink(item.path)) {
      e.preventDefault();
      const cleanId = item.path.replace("#", "");
      scrollToSection(cleanId);
    }
  };

  const toggleMobileSubMenu = (title: string) => {
    setOpenMobileSubMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const sections = ["home", "features", "support", "pricing", "contact"];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      router.push(ROUTES.Dashboard);
    } else {
      router.push(ROUTES.Login);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <div
        className={`
          px-4 sm:px-6 lg:px-10 xl:px-16
          flex items-center justify-between
          py-3 border-b border-white-opacity-15
          transition-all duration-300
          bg-landing-theme-dark/95 backdrop-blur-md shadow-md
        `}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Images src={logoUrl} alt={`${app_name || t("app_name")} logo`} width={100} height={40} unoptimized className="h-7.75 object-contain" />
        </Link>

        {/* ─── Desktop navigation ─── */}
        <nav className="hidden min-[1100px]:flex items-center gap-8 flex-1 justify-center">
          {menuItems.filter((item) => item.status !== false).map((item) => {
            if (item.link_type === "Sub") {
              return (
                <ProductDropdown
                  key={item.title}
                  item={item}
                  scrollToSection={scrollToSection}
                />
              );
            }

            const isAnchor = item.path && isAnchorLink(item.path);
            const cleanPath = item.path ? item.path.replace("#", "") : "";
            const isActive = activeSection === cleanPath;

            if (isAnchor) {
              return (
                <a
                  key={item.title}
                  onClick={(e) => handleLinkClick(item, e)}
                  className={`relative text-[17px] font-medium transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5
                    ${isActive ? "text-white!" : "text-slate-300! hover:text-primary"}`}
                >
                  {item.title}
                  {item.badge_text && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${item.badge_color === "green" ? "bg-primary!" : item.badge_color === "black" ? "bg-black!" : item.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}>
                      {item.badge_text}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute -bottom-5.75 left-1/2 -translate-x-1/2 flex flex-col items-center">
                      <span className="w-1 h-1 bg-primary rounded-full absolute -top-1.5" />
                      <span className="w-5 h-0.5 bg-primary rounded-full mt-1.5" />
                    </span>
                  )}
                </a>
              );
            }

            return (
              <Link
                key={item.title}
                href={item.path || "#"}
                target={item.target_blank ? "_blank" : undefined}
                className="text-[17px] font-medium text-slate-300! hover:text-primary transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                {item.title}
                {item.badge_text && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${item.badge_color === "green" ? "bg-primary!" : item.badge_color === "black" ? "bg-black!" : item.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}>
                    {item.badge_text}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <CurrencyDropdown onDark />

          {/* Sign In / Get Started — desktop only */}
          <div className="hidden min-[1100px]:block">
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 h-10 rounded-lg font-semibold text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap" onClick={handleAuthAction}>
              {isAuthenticated ? "Get Started" : "Sign In"}
            </Button>
          </div>

          {/* Hamburger — mobile/tablet only */}
          <Button aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="min-[1100px]:hidden! text-white! p-2! hover:bg-white-opacity-10! rounded-lg! bg-[unset]! transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </Button>
        </div>
      </div>

      {/* ─── Overlay ─── */}
      {isMenuOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 min-[1100px]:hidden" onClick={() => setIsMenuOpen(false)} />}

      {/* ─── Mobile drawer ─── */}
      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw]
          bg-landing-theme-dark z-50 shadow-2xl
          transition-transform duration-300 ease-in-out
          min-[1100px]:hidden
          ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-6 border-b border-white/10">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              <Images src={logoUrl} alt={`${app_name || t("app_name")} logo`} width={90} height={34} unoptimized className="h-7.75 object-contain" />
            </Link>
            <Button aria-label="Close menu" className="text-white! p-2! bg-[unset]! hover:bg-white-opacity-10! rounded-lg! transition-colors" onClick={() => setIsMenuOpen(false)}>
              <X size={22} />
            </Button>
          </div>

          {/* Drawer nav */}
          <nav className="flex flex-col gap-1 px-4 pt-4 pb-6">
            {menuItems.filter((item) => item.status !== false).map((item) => {
              if (item.link_type === "Sub") {
                const isSubOpen = !!openMobileSubMenus[item.title];
                const subChildren = item.children || [];
                return (
                  <div key={item.title}>
                    <Button
                      onClick={() => toggleMobileSubMenu(item.title)}
                      className={`w-full! flex items-center bg-[unset]! justify-between px-3! py-3! rounded-lg! text-[15px]! font-medium! transition-colors
                        ${isSubOpen ? "text-primary! h-11.5! bg-white/5!" : "text-white/80! h-11.5! hover:text-primary! hover:bg-white/5!"}`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {item.badge_text && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${item.badge_color === "green" ? "bg-primary!" : item.badge_color === "black" ? "bg-black!" : item.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}>
                            {item.badge_text}
                          </span>
                        )}
                      </span>
                      <ChevronDown size={17} className={`transition-transform duration-300 ${isSubOpen ? "rotate-180" : ""}`} />
                    </Button>

                    {isSubOpen && (
                      <div className="mt-1 ml-2 flex flex-col gap-0.5 border-l border-white/10 pl-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        {subChildren.filter((c) => c.status !== false).map((child) => {
                          const icon = getMenuIcon(child.icon);
                          const isAnchor = child.path && isAnchorLink(child.path);

                          const imageOrIcon = child.link_image ? (
                            <Images src={child.link_image} alt="" className="w-6 h-6 rounded object-cover bg-white/5 border border-white/10 shrink-0 animate-in fade-in duration-300" width={24} height={24} unoptimized />
                          ) : (
                            <span className="text-white/40 group-hover:text-primary transition-colors shrink-0">{icon || <Sparkles className="w-4 h-4" />}</span>
                          );

                          const content = (
                            <>
                              {imageOrIcon}
                              <span className="flex-1 leading-snug text-white">{child.title}</span>
                              {child.badge_text && (
                                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${child.badge_color === "green" ? "bg-primary!" : child.badge_color === "black" ? "bg-black!" : child.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}>
                                  {child.badge_text}
                                </span>
                              )}
                            </>
                          );

                          if (isAnchor) {
                            return (
                              <a
                                key={child.title}
                                onClick={(e) => {
                                  handleLinkClick(child, e);
                                  setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-white/65 hover:text-primary hover:bg-white/5 transition-colors group cursor-pointer"
                              >
                                {content}
                              </a>
                            );
                          }

                          return (
                            <Link
                              key={child.title}
                              href={child.path || "#"}
                              target={child.target_blank ? "_blank" : undefined}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-white/65 hover:text-primary hover:bg-white/5 transition-colors group"
                            >
                              {content}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              const isAnchor = item.path && isAnchorLink(item.path);
              const cleanPath = item.path ? item.path.replace("#", "") : "";
              const isActive = activeSection === cleanPath;

              if (isAnchor) {
                return (
                  <a
                    key={item.title}
                    onClick={(e) => {
                      handleLinkClick(item, e);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] font-medium transition-colors cursor-pointer
                      ${isActive ? "text-primary! bg-white/5" : "text-white/80! hover:text-primary hover:bg-white/5"}`}
                  >
                    {item.title}
                  </a>
                );
              }

              return (
                <Link
                  key={item.title}
                  href={item.path || "#"}
                  target={item.target_blank ? "_blank" : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg text-[15px] text-white/80! font-medium hover:text-primary hover:bg-white/5 transition-colors"
                >
                  {item.title}
                </Link>
              );
            })}

            {/* CTA inside drawer */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <Button
                className="bg-primary hover:bg-primary/90 text-white w-full h-11 rounded-lg font-semibold text-[15px] transition-all hover:scale-[1.01] active:scale-[0.99]"
                onClick={() => {
                  handleAuthAction();
                  setIsMenuOpen(false);
                }}
              >
                {isAuthenticated ? "Get Started" : "Sign In"}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
