"use client";

import { cn } from "@/src/lib/utils";
import { ChevronDown, CircleDollarSign, Clock, FileCheck2, FileX2, Layout, LayoutGrid, Shapes, ShoppingBag, Stethoscope, Watch, X } from "lucide-react";
import React, { useState } from "react";
import Can from "../shared/Can";
import TemplateQuickGuideModal from "./TemplateQuickGuideModal";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/elements/ui/button";
import { SECTOR_DATA, SECTORS, STATUS_ITEMS } from "@/src/data/templates";
import { NavItemProps, TemplatesSidebarProps } from "@/src/types/components/template";






const NavItem = ({ icon, label, description, isActive, onClick }: NavItemProps) => (
  <Button onClick={onClick} className={cn("w-full!  h-16.5 text-start! p-3! rounded-lg! flex items-center gap-3.5! transition-all duration-200 group relative", isActive ? "bg-primary/5! dark:bg-primary/10! border border-primary/20! dark:border-primary/20!" : "text-slate-600! dark:text-gray-400! bg-[unset]! hover:bg-slate-50! dark:hover:bg-(--table-hover)!")}>
    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-xs shrink-0", isActive ? "bg-white dark:bg-primary/20 text-primary" : "bg-slate-100 dark:bg-(--dark-body) text-slate-400 dark:text-gray-500 group-hover:bg-white dark:group-hover:bg-(--card-color)")}>{icon}</div>
    <div className="flex-1 min-w-0">
      <p className={cn("font-semibold text-sm truncate", isActive ? "text-primary" : "text-slate-900 dark:text-white")}>{label}</p>
      <p className="text-[12px] text-slate-400 dark:text-gray-500 truncate mt-0.5">{description}</p>
    </div>
    {isActive && <div className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary ltr:rounded-l-full rtl:rounded-r-full" />}
  </Button>
);

const TemplatesSidebar: React.FC<TemplatesSidebarProps> = ({ activeView, selectedSector, selectedCategory, selectedStatus, onViewChange, onSectorChange, onCategoryChange, onStatusChange, onClose, platform }) => {
  const { t } = useTranslation();
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  const handleSectorClick = (sectorId: string) => {
    onSectorChange(sectorId);
    onCategoryChange("all");
    if (sectorId !== "all") {
      setExpandedSector(expandedSector === sectorId ? null : sectorId);
    } else {
      setExpandedSector(null);
      onClose?.();
    }
  };

  const isWhatsApp = !platform || platform === "whatsapp";

  return (
    <div className="w-68 lg:w-76 ltr:border-r rtl:border-l border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) flex flex-col h-full overflow-hidden shadow-sm shrink-0 relative">
      <div className="p-6 pb-2 flex flex-col items-center text-center space-y-3 relative">
        {onClose && (
          <Button onClick={onClose} className="absolute bg-[unset]! top-4 ltr:right-4 rtl:left-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors [@media(min-width:1600px)]:hidden">
            <X size={20} />
          </Button>
        )}
        <div className="w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
          <Layout size={28} />
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">{t("templates")}</h2>
          <p className="text-[12px] text-slate-500 dark:text-gray-400 mt-0.5">{t("templates_desc_unified")}</p>
        </div>
      </div>

      <div className="flex gap-1 px-4 pt-4 pb-2">
        <Can permission="view.admin-template">
          <Button
            onClick={() => {
              onViewChange("explore");
              onClose?.();
            }}
            className={cn("flex-1 py-2! px-3! rounded-lg! text-xs! font-bold! capitalize! transition-all", activeView === "explore" ? "bg-primary! border-none! text-white! " : "text-slate-500! dark:text-slate-400! bg-slate-100! dark:bg-(--table-hover)! hover:bg-slate-200! dark:border-none! border-none! dark:hover:bg-(--table-hover)!")}
          >
            {t("explore")}
          </Button>
        </Can>
        <Can permission="view.template">
          <Button
            onClick={() => {
              onViewChange("custom");
              onClose?.();
            }}
            className={cn("flex-1 py-2! px-3! rounded-lg! text-xs! font-bold! capitalize! transition-all", activeView === "custom" ? "bg-primary! border-none! text-white! " : "text-slate-500! dark:text-slate-400! bg-slate-100! dark:bg-(--table-hover)! hover:bg-slate-200! hover:border-none! border-none! dark:hover:bg-(--table-hover)!")}
          >
            {t("custom")}
          </Button>
        </Can>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1 custom-scrollbar">
        {activeView === "custom" ? (
          <>
            <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 px-3 mb-3 tracking-widest uppercase">Filter by Status</p>
            {STATUS_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                description={item.description}
                isActive={selectedStatus === item.id}
                onClick={() => {
                  onStatusChange(item.id);
                  onClose?.();
                }}
              />
            ))}
          </>
        ) : (
          <>
            <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 px-3 mb-3 tracking-widest uppercase">Explore by Sector</p>
            {SECTORS.map((sector) => {
              const isActive = selectedSector === sector.id;
              const isExpanded = expandedSector === sector.id;
              const categories = SECTOR_DATA[sector.id] || [];
              return (
                <div key={sector.id}>
                  <Button onClick={() => handleSectorClick(sector.id)} className={cn("w-full! h-16.5 text-start! p-3! rounded-lg! flex items-center gap-3.5! transition-all duration-200 group relative", isActive ? "bg-primary/5! dark:bg-primary/10! border! border-primary/20! dark:border-primary/20!" : "text-slate-600! dark:text-gray-400! bg-[unset]! hover:bg-slate-50! dark:hover:bg-(--table-hover)!")}>
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-xs shrink-0", isActive ? "bg-white dark:bg-primary/20 text-primary" : "bg-slate-100 dark:bg-(--dark-body) text-slate-400 dark:text-gray-500 group-hover:bg-white dark:group-hover:bg-(--card-color)")}>{sector.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("font-semibold text-sm truncate", isActive ? "text-primary" : "text-slate-900 dark:text-white")}>{sector.label}</p>
                      <p className="text-[12px] text-slate-400 dark:text-gray-500 truncate mt-0.5">{sector.description}</p>
                    </div>
                    {categories.length > 0 && <ChevronDown size={14} className={cn("text-slate-400 transition-transform shrink-0", isExpanded && "rotate-180")} />}
                    {isActive && <div className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary ltr:rounded-l-full rtl:rounded-r-full" />}
                  </Button>

                  {isExpanded && categories.length > 0 && (
                    <div className="ml-4 pl-3 border-l-2 rtl:border-l-0! rtl:border-r-2 border-primary/20 mt-1 mb-2 flex flex-col gap-0.5 animate-in slide-in-from-top-1">
                      <Button
                        onClick={() => {
                          onCategoryChange("all");
                          onClose?.();
                        }}
                        className={cn("text-left! justify-start rtl:text-right! py-2! h-8 px-3! rounded! text-xs! font-semibold transition-colors", selectedCategory === "all" ? "text-primary! bg-[unset]!" : "text-slate-500! dark:text-slate-400! bg-[unset]! hover:text-slate-700! dark:hover:text-slate-200!")}
                      >
                        All Categories
                      </Button>
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          onClick={() => {
                            onCategoryChange(cat);
                            onClose?.();
                          }}
                          className={cn("text-left! justify-start rtl:text-right! py-2! px-3! h-8 rounded! text-xs! font-semibold! capitalize transition-colors", selectedCategory === cat ? "text-primary! bg-[unset]!" : "text-slate-500! bg-[unset]! dark:text-slate-400! hover:text-slate-700! dark:hover:text-slate-200!")}
                        >
                          {cat.split("_").join(" ")}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      <TemplateQuickGuideModal />

      {/* {onClose && (
        <div className="p-3 border-t border-slate-100 dark:border-(--card-border-color) [@media(min-width:1600px)]:hidden">
          <Button onClick={onClose} className="w-full h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-(--dark-body) hover:bg-slate-100 dark:hover:bg-(--table-hover) transition-colors">
            <X size={15} />
            Close Menu
          </Button>
        </div>
      )} */}
    </div>
  );
};

export default TemplatesSidebar;
