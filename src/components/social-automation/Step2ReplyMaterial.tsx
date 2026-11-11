import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import { Step2ReplyMaterialProps } from "@/src/types/socialAutomation";
import {
  Check,
  ExternalLink,
  Eye,
  Loader2,
  Mailbox,
  Plus,
  Search,
  Sparkles,
} from "lucide-react";
import React from "react";

export const Step2ReplyMaterial: React.FC<Step2ReplyMaterialProps> = ({
  filteredReplyTypes,
  activeTypeIndex,
  handleTypeChange,
  materialSearch,
  setMaterialSearch,
  loadingMaterials,
  filteredItems,
  selectedReplyId,
  handleMaterialSelect,
  handlePreview,
  activeTypeConfig,
  platform
}) => {
  return (
    <div className="sm:p-6 p-4 space-y-5">
      <div>
        <h2 className="text-base font-black text-slate-900 dark:text-white">
          Reply Material
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Choose what to send when comments trigger this automation.
        </p>
      </div>

      <div className="flex items-center gap-2.5 p-3.5 bg-primary/5 rounded-xl border border-primary/10">
        <Sparkles size={16} className="text-primary shrink-0" />
        <p className="text-xs text-primary font-semibold">
          Select the material to auto-send when trigger keywords match.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-bold text-slate-500">Reply Type</Label>
          <Button
            type="button"
            // onClick={() => {
            //   window.open("/toolset/links", "_blank");
            // }}
            onClick={() => {
              let route =
                activeTypeConfig.value === "flow"
                  ? ROUTES.WhatsappFormCreate
                  : activeTypeConfig.value === "template"
                    ? ROUTES.MessageTemplates
                    : activeTypeConfig.value === "appointment_flow"
                      ? "/whatsapp_appointment/add"
                      : ROUTES.ReplyMaterials;

              if (activeTypeConfig.value === "template") {
                route += `?platform=${platform}`;
              }

              window.open(route, "_blank");
            }}
            className="flex items-center bg-[unset]! gap-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest px-1"
          >
            <Plus size={12} strokeWidth={3} />
            Add {activeTypeConfig.label}
            <ExternalLink size={10} className="ml-0.5 opacity-50" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {filteredReplyTypes.map((rt) => {
            const idx = filteredReplyTypes.indexOf(rt);
            return (
              <Button
                key={`${rt.value}-${rt.label}`}
                type="button"
                onClick={() => handleTypeChange(idx)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border",
                  activeTypeIndex === idx
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "border-slate-200 bg-[unset]! dark:border-(--card-border-color) text-slate-500 hover:border-primary/30 hover:text-primary hover:bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "transition-colors",
                    activeTypeIndex === idx ? "text-white" : rt.color,
                  )}
                >
                  {rt.icon}
                </span>
                {rt.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={16}
        />
        <Input
          value={materialSearch}
          onChange={(e) => setMaterialSearch(e.target.value)}
          placeholder={`Search ${activeTypeConfig.label.toLowerCase()} materials...`}
          className="pl-10 h-11 rounded-xl border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
        />
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1 rtl:pr-0 rtl:pl-1 custom-scrollbar">
        {loadingMaterials ? (
          <div className="py-14 flex flex-col items-center gap-2 text-slate-400">
            <Loader2 size={24} className="animate-spin text-primary" />
            <span className="text-xs font-medium">Loading materials...</span>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-14 text-center space-y-2">
            <div className="text-slate-300 dark:text-slate-600 flex justify-center">
              <Mailbox className="w-10 h-10 text-primary" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              No {activeTypeConfig.label.toLowerCase()} materials found
            </p>
          </div>
        ) : (
          filteredItems.map((item: any) => (
            <div
              key={item._id}
              role="button"
              tabIndex={0}
              onClick={() => handleMaterialSelect(item._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleMaterialSelect(item._id);
                }
              }}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left group cursor-pointer",
                selectedReplyId === item._id
                  ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/10"
                  : "border-slate-100 dark:border-(--card-border-color) hover:border-primary/30 hover:bg-slate-50/50 dark:hover:bg-(--table-hover)",
              )}
            >
              <div className="flex-1 min-w-0 pr-3 rtl:pr-0 rtl:pl-3">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                    {item.name}
                  </p>
                  <Button
                    type="button"
                    onClick={(e) => handlePreview(e, item)}
                    className="p-1! bg-[unset]! h-[unset]! rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                  >
                    <Eye size={18} />
                  </Button>
                </div>
                {item.category && (
                  <span className="text-sm text-left rtl:text-right capitalize font-bold text-slate-400 break-all whitespace-normal line-clamp-1">
                    {item.category}
                  </span>
                )}
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all border",
                  selectedReplyId === item._id
                    ? "bg-primary border-primary"
                    : "border-slate-200 dark:border-(--card-border-color)",
                )}
              >
                {selectedReplyId === item._id && (
                  <Check size={11} strokeWidth={4} className="text-white" />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
