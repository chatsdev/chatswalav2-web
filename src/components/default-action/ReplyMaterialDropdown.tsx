/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/src/lib/utils";
import { useGetLinkedCatalogsQuery } from "@/src/redux/api/catalogueApi";
import { useGetChatbotsQuery } from "@/src/redux/api/chatbotApi";
import { useGetReplyMaterialsQuery } from "@/src/redux/api/replyMaterialApi";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { useListAppointmentConfigsQuery } from "@/src/redux/api/appointmentApi";
import { useAppSelector } from "@/src/redux/hooks";
import { GroupedOptions, MaterialOption, ReplyMaterialDropdownProps } from "@/src/types/defaultAction";
import { Check, ChevronDown, ChevronRight, Eye, Loader2, Plus, Search } from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { MaterialPreviewModal } from "../shared/MaterialPreviewModal";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";

const ReplyMaterialDropdown: React.FC<ReplyMaterialDropdownProps> = ({ value, onChange, placeholder = "Select material...", wabaId, disabled = false }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [previewItem, setPreviewItem] = useState<{ type: string; material: any } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const skip = !open;

  const { data: materialsData, isLoading: loadingMaterials } = useGetReplyMaterialsQuery({ waba_id: wabaId || "" }, { skip });
  const { data: templatesData, isLoading: loadingTemplates } = useGetTemplatesQuery({ waba_id: wabaId || "", status: "approved" }, { skip });
  const { data: chatbotsData, isLoading: loadingChatbots } = useGetChatbotsQuery({ waba_id: wabaId || "" }, { skip });
  const { data: catalogsData, isLoading: loadingCatalogs } = useGetLinkedCatalogsQuery({ waba_id: wabaId || "" }, { skip });
  const { data: appointmentData, isLoading: loadingAppointments } = useListAppointmentConfigsQuery({}, { skip });

  const isLoading = loadingMaterials || loadingTemplates || loadingChatbots || loadingCatalogs || loadingAppointments;

  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const { isFeatureEnabled } = useFeatureAccess();

  const allGroups = useMemo<GroupedOptions[]>(() => {
    const s = search.toLowerCase();
    const rm = materialsData?.data;
    const texts = rm?.texts?.items || [];
    const images = rm?.images?.items || [];
    const videos = rm?.videos?.items || [];
    const documents = rm?.documents?.items || [];
    const stickers = rm?.stickers?.items || [];
    const templates = templatesData?.data || [];
    const chatbots = chatbotsData?.data || [];
    const catalogs = catalogsData?.data?.catalogs || [];
    const flows = rm?.flows?.items || [];
    const appointments = appointmentData?.data?.configs || [];

    const filterName = (items: any[]) =>
      items.filter((i) => {
        const name = i.name || i.template_name || "";
        return name.toLowerCase().includes(s);
      });

    const groups: GroupedOptions[] = [
      { label: "Text", ref_type: "ReplyMaterial_text", items: filterName(texts).map((i) => ({ _id: i._id, name: i.name, type: "text", ref_type: "ReplyMaterial" })) },
      { label: "Image", ref_type: "ReplyMaterial_image", items: filterName(images).map((i) => ({ _id: i._id, name: i.name, type: "image", ref_type: "ReplyMaterial" })) },
      { label: "Video", ref_type: "ReplyMaterial_video", items: filterName(videos).map((i) => ({ _id: i._id, name: i.name, type: "video", ref_type: "ReplyMaterial" })) },
      { label: "Document", ref_type: "ReplyMaterial_document", items: filterName(documents).map((i) => ({ _id: i._id, name: i.name, type: "document", ref_type: "ReplyMaterial" })) },
      { label: "Sticker", ref_type: "ReplyMaterial_sticker", items: filterName(stickers).map((i) => ({ _id: i._id, name: i.name, type: "sticker", ref_type: "ReplyMaterial" })) },
      { label: "Template", ref_type: "Template", items: filterName(templates).map((i) => ({ _id: i._id, name: i.template_name || i.name, type: "template", ref_type: "Template" })), featureKey: "template_bots" },
      { label: "Chatbot", ref_type: "Chatbot", items: filterName(chatbots).map((i) => ({ _id: i._id, name: i.name, type: "chatbot", ref_type: "Chatbot" })) },
      { label: "Catalogue", ref_type: "EcommerceCatalog", items: filterName(catalogs).map((i) => ({ _id: i._id, name: i.name, type: "catalogue", ref_type: "EcommerceCatalog" })) },
      { label: "Form Flow", ref_type: "ReplyMaterial_flow", items: filterName(flows).map((i) => ({ _id: i._id, name: i.name, type: "flow", ref_type: "ReplyMaterial" })), featureKey: "forms" },
      { label: "Appointment", ref_type: "appointment", items: filterName(appointments.map(a => ({ ...a, name: a.name || "" }))).map((i) => ({ _id: i._id, name: i.name, type: "appointment", ref_type: "appointment" })), featureKey: "appointment_bookings" },
    ];

    return groups.filter((g) => {
      if (isBaileys && g.label === "Catalogue") {
        return false;
      }
      if (g.featureKey && !isFeatureEnabled(g.featureKey)) {
        return false;
      }
      return g.items.length > 0 || !s;
    });
  }, [materialsData, templatesData, chatbotsData, catalogsData, search, isBaileys, appointmentData, isFeatureEnabled]);

  useEffect(() => {
    if (search.trim()) {
      const nonEmptyGroups = allGroups.filter((g) => g.items.length > 0).map((g) => g.ref_type);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setExpandedGroups(nonEmptyGroups);
    }
  }, [search, allGroups]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => searchRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const toggleDropdown = () => {
    if (open) {
      setSearch("");
      setExpandedGroups([]);
    }
    setOpen(!open);
  };

  const toggleGroup = (refType: string) => {
    setExpandedGroups((prev) => (prev.includes(refType) ? prev.filter((g) => g !== refType) : [...prev, refType]));
  };

  const handleSelect = (item: MaterialOption) => {
    onChange({ id: item._id, type: item.ref_type });
    setOpen(false);
  };

  const handlePreview = (e: React.MouseEvent, item: MaterialOption) => {
    e.stopPropagation();
    const rm = materialsData?.data;
    const texts = rm?.texts?.items || [];
    const images = rm?.images?.items || [];
    const videos = rm?.videos?.items || [];
    const documents = rm?.documents?.items || [];
    const stickers = rm?.stickers?.items || [];
    const templates = templatesData?.data || [];
    const chatbots = chatbotsData?.data || [];
    const catalogs = catalogsData?.data?.catalogs || [];
    const flows = rm?.flows?.items || [];

    const allItems = [...texts, ...images, ...videos, ...documents, ...stickers, ...flows, ...templates, ...chatbots, ...catalogs];
    const fullItem = allItems.find((i) => i._id === item._id);

    if (fullItem) {
      setPreviewItem({ type: item.ref_type, material: fullItem });
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const selectedName = useMemo(() => {
    if (!value?.id) return null;
    for (const group of allGroups) {
      const found = group.items.find((i) => i._id === value.id);
      if (found) return found.name;
    }
    // Fallback to resource name if available (useful for initial load when dropdown is closed)
    return (value as any)?.resource?.name || (value as any)?.resource?.template_name || value.id;
  }, [value, allGroups]);

  const displayText = selectedName || placeholder;
  const hasValue = !!value?.id;

  return (
    <div ref={dropdownRef} className="relative">
      <Button type="button" disabled={disabled} onClick={toggleDropdown} className={cn("w-full h-10.5 flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg border text-sm transition-all", "bg-(--input-color) dark:bg-(--page-body-bg) hover:bg-(--page-body-bg)! border-slate-200 dark:border-(--card-border-color)", "hover:border-primary/50 focus:outline-none", open && "border-primary ring-2 ring-primary/10", disabled && "opacity-50 cursor-not-allowed", hasValue && "border-primary/30")}>
        <span className={cn("truncate font-medium", hasValue ? "text-slate-800 dark:text-white" : "text-slate-400")}>{displayText}</span>
        <div className="flex items-center gap-1 shrink-0">
          {hasValue && (
            <span role="button" tabIndex={0} onClick={handleClear} className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-red-100 hover:text-red-500 transition-colors cursor-pointer text-slate-400">
              x
            </span>
          )}
          <ChevronDown size={16} className={cn("text-slate-400 transition-transform duration-200", open && "rotate-180")} />
        </div>
      </Button>

      {open && (
        <div className="absolute z-50 top-full mt-1.5 w-full min-w-64 bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-slate-100 dark:border-(--card-border-color)">
            <Search size={14} className="text-slate-400 shrink-0" />
            <Input ref={searchRef} type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={placeholder} className="flex-1 bg-transparent outline-none text-sm text-slate-700 dark:text-white placeholder:text-slate-400" />
          </div>

          <Button type="button" onClick={() => window.open(ROUTES.ReplyMaterials, "_blank")} className="w-full bg-[unset]! justify-start h-10.25 flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-primary hover:bg-primary/5 transition-colors border-b border-slate-100 dark:border-(--card-border-color)">
            <Plus size={14} />
            Add new +
          </Button>

          <div className="max-h-72 overflow-y-auto custom-scrollbar py-1">
            {isLoading ? (
              <div className="py-8 flex flex-col items-center gap-2 text-slate-400">
                <Loader2 size={20} className="animate-spin text-primary" />
                <span className="text-xs">Loading materials…</span>
              </div>
            ) : allGroups.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-400">Nothing found</div>
            ) : (
              allGroups.map((group) => {
                const isExpanded = expandedGroups.includes(group.ref_type);
                const isSelected = value?.id && group.items.some((i) => i._id === value.id);

                return (
                  <div key={group.ref_type}>
                    <Button type="button" onClick={() => toggleGroup(group.ref_type)} className={cn("w-full bg-[unset]! flex items-center justify-between px-3 py-2 text-sm font-semibold transition-colors", "hover:bg-slate-50 dark:hover:bg-slate-800/50", isSelected ? "text-primary" : "text-slate-600 dark:text-slate-300")}>
                      <span>{group.label}</span>
                      {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                    </Button>

                    {isExpanded && (
                      <div className="pb-1">
                        {group.items.length === 0 ? (
                          <p className="px-6 py-1.5 text-xs text-slate-400 italic">No items</p>
                        ) : (
                          group.items.map((item) => {
                            const active = value?.id === item._id;
                            return (
                              <Button key={item._id} type="button" onClick={() => handleSelect(item)} className={cn("w-full bg-[unset]! flex items-center justify-between gap-2 px-5 py-2 text-sm text-left transition-colors", active ? "bg-primary/5 text-primary font-semibold" : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40")}>
                                <div className="flex items-center gap-2 overflow-hidden">
                                  {active && <Check size={13} className="text-primary shrink-0" />}
                                  <span className={cn("truncate", !active && "ml-5")}>{item.name}</span>
                                </div>
                                {item.ref_type !== "appointment" && (
                                  <div onClick={(e) => handlePreview(e, item)} className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors cursor-pointer shrink-0">
                                    <Eye size={18} />
                                  </div>
                                )}
                              </Button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {previewItem && <MaterialPreviewModal isOpen={!!previewItem} onClose={() => setPreviewItem(null)} type={previewItem.type} material={previewItem.material} />}
    </div>
  );
};

export default ReplyMaterialDropdown;
