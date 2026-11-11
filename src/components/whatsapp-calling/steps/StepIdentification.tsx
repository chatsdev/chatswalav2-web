/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useFormikContext } from "formik";
import { User } from "lucide-react";

import { useTranslation } from "react-i18next";

const StepIdentification = () => {
  const { t } = useTranslation();
  const { values, touched, errors, getFieldProps, setFieldValue } = useFormikContext<any>();

  return (
    <div className="mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary font-semibold text-lg">
          <User size={22} />
          <span>{t("identification", "Identification")}</span>
        </div>
        <p className="text-sm text-muted-foreground">{t("agent_identification_desc", "Basic details about how your agent is identified within the system.")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("assistant_name", "Assistant Name")}</Label>
            <Input placeholder={t("assistant_name_placeholder", "e.g. Real Estate Concierge")} {...getFieldProps("name")} className={cn("h-12 text-base rounded-lg", touched.name && errors.name && "border-red-500")} />
            {touched.name && errors.name && <p className="text-xs text-red-500">{errors.name as string}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("internal_status", "Internal Status")}</Label>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color)">
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full animate-pulse", values.is_active ? "bg-primary" : "bg-slate-400")} />
                <span className="font-semibold">{values.is_active ? t("live_ready", "Live & Ready") : t("paused_maintenance", "Paused / Maintenance")}</span>
              </div>
              <Switch checked={values.is_active} onCheckedChange={(val) => setFieldValue("is_active", val)} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t("welcome_greeting", "Welcome Greeting")}</Label>
            <Textarea placeholder={t("calling_welcome_greeting_placeholder", "Hello, I'm your AI assistant. How can I help you today?")} {...getFieldProps("welcome_message")} className={cn("min-h-37 rounded-lg resize-none", touched.welcome_message && errors.welcome_message && "border-red-500")} />
            {touched.welcome_message && errors.welcome_message && <p className="text-xs text-red-500">{errors.welcome_message as string}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIdentification;
