"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Layout, User } from "lucide-react";
import { useTranslation } from "react-i18next";

export const VariableRow = ({
  varKey,
  example,
  value,
  onChange,
  mappingOptions,
  isAuthentication
}: {
  varKey: string;
  example: string;
  value: string;
  onChange: (val: string) => void;
  mappingOptions: { label: string; value: string }[];
  isAuthentication?: boolean;
}) => {
  const { t } = useTranslation();
  const isFieldRef = value?.startsWith("{{");

  const getDisplayValue = () => {
    if (!value) return t("campaign_wizard_variables_no_value_fallback");
    if (isFieldRef) {
      const fieldKey = value.replace(/\{\{|\}\}/g, "");
      const option = mappingOptions.find((opt) => opt.value === fieldKey);
      return option ? option.label : value;
    }
    return value;
  };

  const displayValue = getDisplayValue();

  return (
    <div className="bg-slate-50/50 dark:bg-(--page-body-bg) sm:p-5 p-2 rounded-lg border border-slate-100 dark:border-none space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Label className="text-xs font-black text-primary flex items-center gap-2">
          <Layout size={16} /> {t("campaign_wizard_variables_placeholder_label", { placeholder: `{{${varKey}}}` })}
        </Label>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
            {t("campaign_wizard_variables_value_set_prefix")}{" "}
            <span className="text-primary  break-all whitespace-normal">{displayValue}</span>{" "}
            {t("campaign_wizard_variables_value_set_suffix", { placeholder: `{{${varKey}}}` })}
          </span>
          <span className="text-[10px] font-medium text-slate-400 italic">
            {t("campaign_wizard_variables_example", { example })}
          </span>
        </div>
      </div>
      {isAuthentication ? (
        <div className="space-y-1.5 flex flex-col">
          <span className="text-[14px] font-bold text-slate-400">{t("campaign_wizard_variables_static_value")}</span>
          <Input
            placeholder={t("campaign_wizard_variables_enter_fixed")}
            value={(!isFieldRef ? value : "") || ""}
            onChange={(e) => onChange(e.target.value)}
            className="h-11 bg-white dark:bg-(--dark-body) rounded-lg font-medium text-slate-400 w-full"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5 flex flex-col">
            <span className="text-[14px] font-bold text-slate-400">{t("campaign_wizard_variables_map_field")}</span>
            <Select value={isFieldRef ? value : ""} onValueChange={onChange}>
              <SelectTrigger className="h-11! bg-white dark:bg-(--dark-body) rounded-lg dark:border-none font-medium text-slate-400">
                <SelectValue placeholder={t("campaign_wizard_variables_contact_field_placeholder")} />
              </SelectTrigger>
              <SelectContent className="rounded-lg dark:bg-(--page-body-bg)  shadow-2xl border-slate-100 dark:border-(--card-border-color)">
                {mappingOptions.map((opt) => (
                  <SelectItem key={opt.value} value={`{{${opt.value}}}`} className="rounded-lg py-2.5 dark:hover:bg-(--table-hover)">
                    <div className="flex items-center gap-2">
                      <User size={13} className="text-slate-400" />
                      <span className="font-bold text-sm">{opt.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 flex flex-col">
            <span className="text-[14px] font-bold text-slate-400 ">{t("campaign_wizard_variables_or_static")}</span>
            <Input placeholder={t("campaign_wizard_variables_enter_fixed")} value={(!isFieldRef ? value : "") || ""} onChange={(e) => onChange(e.target.value)} className="h-11 bg-white dark:bg-(--dark-body) rounded-lg font-medium text-slate-400" />
          </div>
        </div>
      )}
    </div>
  );
};

/** Section heading */
export const SectionHeading = ({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="p-2.5 bg-primary/10 rounded-xl">{icon}</div>
    <div>
      <p className="text-sm font-black text-primary uppercase tracking-wide">{label}</p>
      {sub && <p className="text-[11px] text-slate-400 font-medium">{sub}</p>}
    </div>
  </div>
);

/** Card wrapper */
export const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => <div className={`bg-white dark:bg-(--dark-body) rounded-lg border border-slate-100 dark:border-none p-6 shadow-sm ${className}`}>{children}</div>;
