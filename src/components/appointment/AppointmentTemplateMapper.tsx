"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { cn } from "@/src/lib/utils";
import { AppointmentTemplateMapperProps } from "@/src/types/appointment";
import { TemplateVariable } from "@/src/types/components";
import {
  formatExpirationTime,
  getTemplateVariables,
  hasMediaTemplateHeader,
  isMarketingTemplate,
} from "@/src/utils/template";
import { Sparkles } from "lucide-react";
import React, { useMemo } from "react";
import { VariableRow } from "../campaigns/wizard/VariableMappingComponents";

const AppointmentTemplateMapper: React.FC<AppointmentTemplateMapperProps> = ({
  template,
  variablesMapping,
  onVariableChange,
  mappingOptions,
  mediaUrl,
  onMediaUrlChange,
  couponCode,
  onCouponCodeChange,
  expirationMinutes,
  onExpirationChange,
  errors = {},
  fieldKey,
}) => {
  const variableKeys = useMemo(() => {
    return getTemplateVariables(template);
  }, [template]);

  const hasMediaHeader = useMemo(() => {
    return hasMediaTemplateHeader(template);
  }, [template]);

  const isMarketing = useMemo(() => {
    return isMarketingTemplate(template);
  }, [template]);

  // Extract examples from template if available
  const examplesMap = useMemo(() => {
    const examples: Record<string, string> = {};
    const bodyVars = template?.body_variables || [];
    bodyVars.forEach((v: TemplateVariable) => {
      examples[v.key] = v.example || "N/A";
    });
    return examples;
  }, [template]);

  if (variableKeys.length === 0 && !hasMediaHeader && !isMarketing) {
    return (
      <div className="mt-4 p-4 bg-slate-50 dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color) text-center">
        <p className="text-xs text-slate-500 italic">
          This template does not require any variable mapping.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4 sm:p-5 p-2 bg-slate-50 dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color) animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="text-primary" size={16} />
        <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
          Template Variables Mapping
        </p>
      </div>

      <div className="space-y-3">
        {variableKeys.map((key: string) => (
          <div key={key} className="space-y-1">
            <VariableRow
              varKey={key}
              example={examplesMap[key] || "N/A"}
              value={variablesMapping[key] || ""}
              onChange={(val) => onVariableChange(key, val)}
              mappingOptions={mappingOptions}
            />
            {fieldKey && errors[`variable_mapping_${fieldKey}_${key}`] && (
              <p className="text-[10px] text-red-500 font-medium ml-1 mt-0.5">
                {errors[`variable_mapping_${fieldKey}_${key}`]}
              </p>
            )}
          </div>
        ))}
      </div>

      {hasMediaHeader && onMediaUrlChange && (
        <div className="space-y-1.5 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
          <Label className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5 mb-1">
            Media Header URL
          </Label>
          <Input
            value={mediaUrl || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onMediaUrlChange(e.target.value)}
            placeholder="https://example.com/image.png"
            className="h-10 rounded-lg"
          />
        </div>
      )}

      {isMarketing && (
        <div className="space-y-4 sm:p-5 p-2 bg-white dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 flex items-center justify-center">
              <Sparkles
                className="text-primary dark:text-primary"
                size={18}
              />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Coupon Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5">
                Coupon Code
              </Label>
              <Input
                value={couponCode || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onCouponCodeChange && onCouponCodeChange(e.target.value)
                }
                placeholder="e.g. SAVE20"
                className={cn(
                  "h-11 rounded-lg bg-slate-50/50 dark:bg-(--card-color)",
                  fieldKey &&
                    errors[`coupon_${fieldKey}`] &&
                    "border-red-400 ring-2 ring-red-500/10",
                )}
              />
              {fieldKey && errors[`coupon_${fieldKey}`] && (
                <p className="text-[10px] text-red-500 font-medium ml-1">
                  {errors[`coupon_${fieldKey}`]}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-slate-500 flex items-center gap-1.5">
                Expiration (mins)
              </Label>
              <Input
                type="number"
                value={expirationMinutes || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onExpirationChange && onExpirationChange(e.target.value)
                }
                placeholder="e.g. 60"
                className="h-11 rounded-lg bg-slate-50/50 dark:bg-(--card-color)"
              />
              {expirationMinutes && (
                <p className="text-[10px] text-primary font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                  {formatExpirationTime(expirationMinutes)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-[10px] text-slate-400 italic px-1">
        Tip: Map variables to dynamic contact fields or enter custom text.
      </p>
    </div>
  );
};

export default AppointmentTemplateMapper;
