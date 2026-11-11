import { templateFields } from "@/src/data/appointment";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { TemplatesStepProps, AppointmentConfig } from "@/src/types/appointment";
import { Template } from "@/src/types/components";
import { AlertCircle, MessageSquare } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import AppointmentTemplateMapper from "../AppointmentTemplateMapper";

const TemplatesStep: React.FC<TemplatesStepProps> = ({
  formData,
  errors,
  templatesData,
  handleSelectChange,
  handleSwitchChange,
  handleMappingChange,
  handleCouponChange,
  handleExpirationChange,
  mappingOptions,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("step_templates")}
          </h2>
        </div>
        <p className="text-sm text-slate-500">{t("templates_info_desc")}</p>
      </div>

      <div className="sm:p-5 p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20 flex items-center justify-between gap-4">
        <div className="flex gap-3">
          <AlertCircle className="text-blue-600 shrink-0" size={20} />
          <div className="space-y-0.5">
            <p className="text-sm font-bold text-blue-900 dark:text-blue-300">
              {t("auto_confirm_label")}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-400">
              {t("templates_mapping_info")}
            </p>
          </div>
        </div>
        <Switch
          checked={formData.send_confirmation_message}
          onCheckedChange={(checked) =>
            handleSwitchChange("send_confirmation_message", checked)
          }
        />
      </div>

      <div className="grid gap-6">
        {templateFields.map((field) => (
          <div
            key={field.key}
            className="sm:p-5 p-2 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) transition-all hover:shadow-md hover:border-primary/20"
          >
            <div className="grid gap-4 sm:grid-cols-2 items-center">
              <div className="space-y-1">
                <Label className="text-base font-bold">
                  {t(field.label, { defaultValue: field.label })}
                </Label>
                <p className="text-xs text-slate-500">
                  {t(field.description, { defaultValue: field.description })}
                </p>
              </div>
              <Select
                value={formData[field.key as keyof AppointmentConfig] as string}
                onValueChange={(val) => handleSelectChange(field.key, val)}
              >
                <SelectTrigger
                  className={cn(
                    "h-11!",
                    errors[field.key] &&
                      "border-red-400 ring-2 ring-red-500/10",
                  )}
                >
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="w-full max-w-[calc(100vw-40px)] sm:max-w-xl dark:bg-(--page-body-bg) overflow-x-hidden">
                  {templatesData?.data
                    ?.filter((tpl: Template) => tpl.status === "approved")
                    .map((tpl: Template) => (
                      <SelectItem
                        className="dark:hover:bg-(--table-hover) break-all whitespace-normal line-clamp-2"
                        key={tpl._id}
                        value={tpl._id}
                      >
                        <span className="break-all whitespace-normal line-clamp-2">
                          {tpl.template_name}
                        </span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {errors[field.key] && (
                <p className="text-[10px] text-red-500 font-medium ml-1 mt-1 col-span-full">
                  {errors[field.key]}
                </p>
              )}
              {(() => {
                const selectedId = formData[field.key as keyof AppointmentConfig] as string;
                const selectedTpl = templatesData?.data?.find(
                  (t: Template) => t._id === selectedId,
                );
                if (selectedTpl) {
                  return (
                    <div className="col-span-full mt-4 space-y-2">
                      <AppointmentTemplateMapper
                        template={selectedTpl}
                        variablesMapping={
                          formData.variable_mappings?.[field.key] || {}
                        }
                        onVariableChange={(variable, value) =>
                          handleMappingChange(field.key, variable, value)
                        }
                        mappingOptions={mappingOptions}
                        errors={errors}
                        fieldKey={field.key}
                        couponCode={
                          formData.variable_mappings?.[field.key]?.coupon_code
                        }
                        onCouponCodeChange={(val) =>
                          handleCouponChange(field.key, val)
                        }
                        expirationMinutes={
                          formData.variable_mappings?.[field.key]
                            ?.coupon_expiration
                        }
                        onExpirationChange={(val) =>
                          handleExpirationChange(field.key, val)
                        }
                      />
                    </div>
                  );
                }
                return null;
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesStep;
