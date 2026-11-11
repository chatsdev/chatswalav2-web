"use client";

import { MenuItem, ProductDropdownProps } from "@/src/types/landingPage";
import * as LucideIcons from "lucide-react";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import Images from "../../shared/Image";
import { Button } from "@/src/elements/ui/button";


const getMenuIcon = (iconName?: string) => {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName];
  if (!IconComponent) return null;
  return <IconComponent className="w-5 h-5 shrink-0" />;
};

const ProductDropdown = ({ item, scrollToSection }: ProductDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const children = (item.children || []).filter((child) => child.status !== false);

  const isAnchorLink = (path?: string) => {
    if (!path) return false;
    return path.startsWith("#") || (!path.startsWith("/") && !path.startsWith("http://") && !path.startsWith("https://") && !path.startsWith("mailto:") && !path.startsWith("tel:"));
  };

  const handleLinkClick = (child: MenuItem, e: React.MouseEvent) => {
    if (child.path && isAnchorLink(child.path)) {
      e.preventDefault();
      const cleanId = child.path.replace("#", "");
      scrollToSection(cleanId);
      setIsOpen(false);
    }
  };

  const renderMegaMenuContent = () => {
    const style = item.mega_menu_type || "Simple";

    switch (style) {
      case "Link With Image":
        return (
          <div className="w-[680px] bg-landing-theme-dark border border-white-opacity-15 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:p-6 p-4 max-h-[480px] overflow-auto no-scrollbar">
            <div className="mb-2">
              <span className="text-sm font-bold text-primary! block mb-3">
                {item.title}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {children.map((child) => {
                const icon = getMenuIcon(child.icon);
                return (
                  <Link
                    key={child.title}
                    href={child.path || "#"}
                    target={child.target_blank ? "_blank" : undefined}
                    onClick={(e) => handleLinkClick(child, e)}
                    className="group/item flex items-start gap-3.5 p-3 rounded-lg hover:bg-white-opacity-5"
                  >
                    <div className="shrink-0">
                      {child.link_image ? (
                        <Images
                          src={child.link_image}
                          alt=""
                          className="w-9 h-9 rounded-lg object-cover bg-white-opacity-5 border border-white-opacity-10"
                          width={36}
                          height={36}
                          unoptimized
                        />
                      ) : (
                        <div className="p-2 rounded-lg bg-white-opacity-5 text-slate-400! group-hover/item:bg-primary group-hover/item:text-white! transition-all duration-300">
                          {icon || <Sparkles className="w-5 h-5" />}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[15.5px] font-semibold text-white! group-hover/item:text-primary! transition-colors truncate">
                          {child.title}
                        </span>
                        {child.badge_text && (
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${child.badge_color === "green" ? "bg-primary!" : child.badge_color === "black" ? "bg-black!" : child.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}
                          >
                            {child.badge_text}
                          </span>
                        )}
                      </div>
                      <p className="text-[12.5px] text-slate-400! leading-normal font-medium line-clamp-2">
                        {child.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        );

      case "Side Banner":
        return (
          <div className="w-[840px] bg-landing-theme-dark border border-white-opacity-15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] grid grid-cols-12 gap-6 p-6">
            <div className="col-span-8 space-y-4">
              <span className="text-[12px] font-bold tracking-wider text-primary! uppercase block">
                {item.title}
              </span>
              <div className="grid grid-cols-2 gap-4">
                {children.map((child) => {
                  const icon = getMenuIcon(child.icon);
                  return (
                    <Link
                      key={child.title}
                      href={child.path || "#"}
                      target={child.target_blank ? "_blank" : undefined}
                      onClick={(e) => handleLinkClick(child, e)}
                      className="group/item flex items-start gap-3 p-2.5 rounded-xl hover:bg-white-opacity-5 transition-all duration-300"
                    >
                      <div className="shrink-0">
                        {child.link_image ? (
                          <Images
                            src={child.link_image}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover bg-white-opacity-5 border border-white-opacity-10"
                            width={32}
                            height={32}
                            unoptimized
                          />
                        ) : (
                          <div className="p-2 rounded-lg bg-white-opacity-5 text-slate-400! group-hover/item:bg-primary group-hover/item:text-white! transition-all duration-350">
                            {icon || <Sparkles className="w-4 h-4" />}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[14.5px] font-bold text-white! group-hover/item:text-primary! transition-colors">
                            {child.title}
                          </span>
                          {child.badge_text && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${child.badge_color === "green" ? "bg-primary!" : child.badge_color === "black" ? "bg-black!" : child.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}
                            >
                              {child.badge_text}
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-slate-400! leading-snug line-clamp-1 mt-0.5">
                          {child.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* Promo Banner sidebar */}
            <div className="col-span-4 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <span className="inline-block text-[10px] font-bold tracking-wider bg-primary/20 text-primary px-2.5 py-1 rounded-full uppercase mb-3">
                  Promo Offer
                </span>
                <h4 className="text-[16px] font-bold text-white! leading-snug">
                  Build Custom Bots in Minutes
                </h4>
                <p className="text-[12px] text-slate-300! mt-2 leading-relaxed">
                  Engage customers with custom WhatsApp templates & workflows.
                </p>
              </div>
              <Link
                href="/signup"
                className="group/btn flex items-center gap-2 text-primary! font-semibold text-[13px] hover:text-white! transition-colors mt-4"
              >
                Start Free Trial
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        );

      case "Bottom Banner":
        return (
          <div className="w-[680px] bg-landing-theme-dark border border-white-opacity-15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="p-6">
              <span className="text-[12px] font-bold tracking-wider text-primary! uppercase block mb-4">
                {item.title}
              </span>
              <div className="grid grid-cols-2 gap-4">
                {children.map((child) => {
                  const icon = getMenuIcon(child.icon);
                  return (
                    <Link
                      key={child.title}
                      href={child.path || "#"}
                      target={child.target_blank ? "_blank" : undefined}
                      onClick={(e) => handleLinkClick(child, e)}
                      className="group/item flex items-center gap-3 p-2.5 rounded-lg hover:bg-white-opacity-5 transition-all duration-300"
                    >
                      <div className="shrink-0">
                        {child.link_image ? (
                          <Images
                            src={child.link_image}
                            alt=""
                            className="w-8 h-8 rounded-lg object-cover bg-white-opacity-5 border border-white-opacity-10"
                            width={32}
                            height={32}
                            unoptimized
                          />
                        ) : icon ? (
                          <span className="text-slate-400 group-hover/item:text-primary">
                            {icon}
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[14.5px] font-semibold text-white! group-hover/item:text-primary! transition-colors flex-1">
                        {child.title}
                      </span>
                      {child.badge_text && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${child.badge_color === "green" ? "bg-primary!" : child.badge_color === "black" ? "bg-black!" : child.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}
                        >
                          {child.badge_text}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
            {/* Bottom Promo Strip */}
            <div className="bg-white-opacity-5 px-6 py-3.5 border-t border-white-opacity-10 flex items-center justify-between">
              <span className="text-[12px] text-slate-300! font-medium">
                🚀 Need assistance setup? Contact our 24/7 team
              </span>
              <Link
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="text-primary! hover:text-white! font-bold text-[12px] flex items-center gap-1"
              >
                Support Panel &rarr;
              </Link>
            </div>
          </div>
        );

      case "Product Box":
        return (
          <div className="w-[720px] bg-landing-theme-dark border border-white-opacity-15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6">
            <span className="text-[12px] font-bold tracking-wider text-primary! uppercase block mb-4">
              {item.title}
            </span>
            <div className="grid grid-cols-3 gap-4">
              {children.map((child) => {
                const icon = getMenuIcon(child.icon);
                return (
                  <Link
                    key={child.title}
                    href={child.path || "#"}
                    target={child.target_blank ? "_blank" : undefined}
                    onClick={(e) => handleLinkClick(child, e)}
                    className="group/item flex flex-col p-4 rounded-xl bg-white-opacity-5 hover:bg-white-opacity-10 border border-white-opacity-5 hover:border-primary/30 transition-all duration-300 text-left"
                  >
                    <div className="shrink-0 mb-3">
                      {child.link_image ? (
                        <Images
                          src={child.link_image}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-white-opacity-5 border border-white-opacity-10"
                          width={40}
                          height={40}
                          unoptimized
                        />
                      ) : (
                        <div className="p-2.5 rounded-lg bg-white-opacity-5 text-primary! w-fit group-hover/item:bg-primary group-hover/item:text-white! transition-colors">
                          {icon || <Sparkles className="w-5 h-5" />}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[14.5px] font-bold text-white! group-hover/item:text-primary! transition-colors">
                        {child.title}
                      </span>
                      {child.badge_text && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${child.badge_color === "green" ? "bg-primary!" : child.badge_color === "black" ? "bg-black!" : child.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}
                        >
                          {child.badge_text}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-slate-400! mt-1 line-clamp-2 leading-normal">
                      {child.description}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        );

      case "Blog Box":
        return (
          <div className="w-[600px] bg-landing-theme-dark border border-white-opacity-15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6">
            <span className="text-[12px] font-bold tracking-wider text-primary! uppercase block mb-4">
              {item.title}
            </span>
            <div className="space-y-4">
              {children.map((child) => (
                <Link
                  key={child.title}
                  href={child.path || "#"}
                  target={child.target_blank ? "_blank" : undefined}
                  onClick={(e) => handleLinkClick(child, e)}
                  className="group/item flex items-start gap-4 p-3 rounded-xl hover:bg-white-opacity-5 transition-all duration-300"
                >
                  {child.link_image ? (
                    <Images
                      src={child.link_image}
                      alt=""
                      className="w-20 h-14 rounded-lg object-cover bg-white-opacity-5 shrink-0 border border-white-opacity-10"
                      width={80}
                      height={56}
                      unoptimized
                    />
                  ) : (
                    <div className="w-20 h-14 rounded-lg bg-white-opacity-5 shrink-0 flex items-center justify-center text-slate-500 border border-white-opacity-10">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[14.5px] font-bold text-white! group-hover/item:text-primary! transition-colors truncate">
                        {child.title}
                      </span>
                      {child.badge_text && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${child.badge_color === "green" ? "bg-primary!" : child.badge_color === "black" ? "bg-black!" : child.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}
                        >
                          {child.badge_text}
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-400! line-clamp-2 leading-relaxed mt-1">
                      {child.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );

      case "Simple":
      default:
        return (
          <div className="w-[480px] bg-landing-theme-dark border border-white-opacity-15 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5">
            <span className="text-[12px] font-bold tracking-wider text-primary! uppercase block mb-3">
              {item.title}
            </span>
            <div className="grid grid-cols-2 gap-3">
              {children.map((child) => {
                const icon = getMenuIcon(child.icon);
                return (
                  <Link
                    key={child.title}
                    href={child.path || "#"}
                    target={child.target_blank ? "_blank" : undefined}
                    onClick={(e) => handleLinkClick(child, e)}
                    className="group/item flex items-center gap-2 p-2 rounded-lg hover:bg-white-opacity-5 transition-all duration-300 text-slate-200! hover:text-primary!"
                  >
                    <div className="shrink-0">
                      {child.link_image ? (
                        <Images
                          src={child.link_image}
                          alt=""
                          className="w-6 h-6 rounded object-cover bg-white-opacity-5 border border-white-opacity-10"
                          width={24}
                          height={24}
                          unoptimized
                        />
                      ) : icon ? (
                        <span className="text-slate-400 group-hover/item:text-primary shrink-0">
                          {icon}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[14.5px] font-semibold text-slate-200! group-hover/item:text-primary! transition-colors flex-1">
                      {child.title}
                    </span>
                    {child.badge_text && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${child.badge_color === "green" ? "bg-primary!" : child.badge_color === "black" ? "bg-black!" : child.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}
                      >
                        {child.badge_text}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Button variant="unstyled"
        className={`flex items-center bg-[unset]! p-0! gap-1.5 text-[17px] font-medium transition-colors cursor-pointer py-2
        ${isOpen ? "text-white!" : "text-slate-300! hover:text-white!"}`}
      >
        <span>{item.title}</span>
        {item.badge_text && (
          <span
            className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${item.badge_color === "green" ? "bg-primary!" : item.badge_color === "black" ? "bg-black!" : item.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}
          >
            {item.badge_text}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </Button>

      {item.mega_menu ? (
        <div
          className={`absolute left-1/2 -translate-x-1/2 top-full pt-3 transition-all duration-300 
          ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
        >
          {renderMegaMenuContent()}
        </div>
      ) : (
        /* Regular classic dropdown */
        <div
          className={`absolute left-0 top-full pt-3 transition-all duration-300 
          ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}
        >
          <div className="w-[220px] bg-landing-theme-dark border border-white-opacity-15 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-2 flex flex-col">
            {children.map((child) => {
              const icon = getMenuIcon(child.icon);
              return (
                <Link
                  key={child.title}
                  href={child.path || "#"}
                  target={child.target_blank ? "_blank" : undefined}
                  onClick={(e) => handleLinkClick(child, e)}
                  className="group/item flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white-opacity-5 text-[14.5px] text-slate-300! hover:text-primary! transition-all duration-200"
                >
                  <div className="shrink-0">
                    {child.link_image ? (
                      <Images
                        src={child.link_image}
                        alt=""
                        className="w-5 h-5 rounded object-cover bg-white-opacity-5 border border-white-opacity-10"
                        width={20}
                        height={20}
                        unoptimized
                      />
                    ) : icon ? (
                      <span className="text-slate-400 group-hover/item:text-primary shrink-0">
                        {icon}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-slate-300! group-hover/item:text-primary! flex-1 truncate">
                    {child.title}
                  </span>
                  {child.badge_text && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded text-white! ${child.badge_color === "green" ? "bg-primary!" : child.badge_color === "black" ? "bg-black!" : child.badge_color === "yellow" ? "bg-amber-500!" : "bg-red-500!"}`}
                    >
                      {child.badge_text}
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;
