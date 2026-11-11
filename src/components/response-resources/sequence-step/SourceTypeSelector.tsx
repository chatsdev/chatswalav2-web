"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import { SourceTypeSelectorProps } from "@/src/types/replyMaterial";
import { ExternalLink, Plus } from "lucide-react";
import React from "react";

import { SOURCE_TYPES } from "@/src/data/responseResource";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";

const SourceTypeSelector: React.FC<SourceTypeSelectorProps> = ({
  value,
  onChange,
  platform = "whatsapp",
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const { isFeatureEnabled } = useFeatureAccess();

  const filteredSourceTypes = SOURCE_TYPES.filter((src) => {
    if (
      isBaileys &&
      (src.value === "Template" || src.value === "EcommerceCatalog")
    ) {
      return false;
    }
    if (src.value === "EcommerceCatalog" && platform !== "whatsapp") {
      return false;
    }
    if (src.featureKey && !isFeatureEnabled(src.featureKey)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 flex flex-col mb-3!">
      <div className="flex items-center justify-between flex-wrap">
        <Label className="text-sm font-black  text-slate-400 dark:text-gray-400">
          1. Select Source
        </Label>
        <Button
          type="button"
          onClick={() => window.open(ROUTES.ReplyMaterials, "_blank")}
          className="flex items-center gap-1.5 text-[10px] font-bold text-primary bg-[unset]! hover:text-primary/80 transition-colors uppercase tracking-widest"
        >
          <Plus size={12} strokeWidth={3} />
          Add Response Resources
          <ExternalLink size={10} className="ml-0.5 opacity-50" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 p-1 bg-slate-50 dark:bg-(--dark-body) rounded-xl">
        {filteredSourceTypes.map((src) => (
          <Button
            key={src.value}
            type="button"
            onClick={() => onChange(src.value)}
            className={cn(
              "h-10 flex-1 rounded-lg text-xs font-bold transition-all",
              value === src.value
                ? "bg-primary! text-white! dark:bg-(--card-color) shadow-sm ring-1 ring-primary/10"
                : "text-slate-500 bg-[unset]! hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
            )}
          >
            {src.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SourceTypeSelector;
