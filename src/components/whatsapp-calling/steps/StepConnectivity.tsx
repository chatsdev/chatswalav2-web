/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { STEPCONNECTIVITYLIST } from "@/src/data";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { useFormikContext } from "formik";
import { History, PhoneOff, Plus } from "lucide-react";

import { useTranslation } from "react-i18next";

const StepConnectivity = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, getFieldProps } = useFormikContext<any>();

  const stepConnectivityList = [
    { title: t("agent_side", "Agent Side"), desc: t("record_assistant_voice", "Record assistant voice"), path: "recording_config.enable_agent_recording" },
    { title: t("user_side", "User Side"), desc: t("record_caller_voice", "Record caller voice"), path: "recording_config.enable_user_recording" },
    { title: t("auto_logging", "Auto Logging"), desc: t("ai_transcription", "AI Transcription"), path: "recording_config.enable_transcription" },
  ];

  const addKeyword = (path: string, keyword: string) => {
    if (!keyword.trim()) return;
    const current = getFieldProps(path).value || [];
    if (!current.includes(keyword.trim())) {
      setFieldValue(path, [...current, keyword.trim()]);
    }
  };

  const removeKeyword = (path: string, index: number) => {
    const current = [...(getFieldProps(path).value || [])];
    current.splice(index, 1);
    setFieldValue(path, current);
  };

  return (
    <div className="mx-auto space-y-10 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <History size={22} />
            <span>{t("recording_configuration", "Recording Configuration")}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("manage_call_data_desc", "Manage how call data and audio are preserved.")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stepConnectivityList.map((item, i) => (
            <div key={i} className="flex flex-col sm:p-5 p-4 bg-slate-50/50 dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color) space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-sm font-bold">{item.title}</span>
                  <p className="text-sm text-slate-500 font-medium tracking-tighter">{item.desc}</p>
                </div>
                <Switch checked={getFieldProps(item.path).value} onCheckedChange={(val) => setFieldValue(item.path, val)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-red-500 font-semibold text-lg">
              <PhoneOff size={22} />
              <span>{t("hangup_behavior", "Hangup Behavior")}</span>
            </div>
            <p className="text-sm text-muted-foreground">{t("automate_conclude_conversation_desc", "Automate when the agent should conclude the conversation.")}</p>
          </div>
          <Switch checked={values.hangup_config.enabled} onCheckedChange={(val) => setFieldValue("hangup_config.enabled", val)} />
        </div>

        {values.hangup_config.enabled ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-6 p-4 bg-red-50/30 dark:bg-red-950/10 border border-red-100 dark:border-red-900/50 rounded-lg animate-in zoom-in-95 duration-300">
            <div className="space-y-3">
              <Label className="text-sm font-semibold">{t("exit_keywords", "Exit Keywords")}</Label>
              <div className={cn("min-h-12 p-2.5 rounded-lg border transition-all flex flex-wrap gap-2 items-center cursor-text bg-white dark:bg-(--card-color)", "focus-within:border-red-500/50 focus-within:ring-2 focus-within:ring-red-500/5 border-red-100 dark:border-red-900/30 font-semibold")} onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}>
                {values.hangup_config.trigger_keywords.map((kw: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-red-50 break-all dark:bg-red-900/20 border-red-100 dark:border-red-800/50 text-red-600 px-3 py-1.5 rounded-lg gap-1.5 text-xs">
                    {kw}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeKeyword("hangup_config.trigger_keywords", i);
                      }}
                      className="hover:bg-red-200 dark:hover:bg-red-800 rounded-md p-0.5 bg-[unset]! text-red-500 p-0! h-[unset]!"
                    >
                      <Plus size={12} className="rotate-45" />
                    </Button>
                  </Badge>
                ))}
                <Input
                  placeholder={values.hangup_config.trigger_keywords.length === 0 ? t("press_enter_to_add_eg_goodbye", "Press Enter to add (e.g. goodbye)") : t("add_another", "Add another...")}
                  className="flex-1 min-w-37.5 bg-transparent outline-none text-sm placeholder:text-slate-400 border-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      const val = e.currentTarget.value.trim();
                      if (val && !values.hangup_config.trigger_keywords.includes(val)) {
                        addKeyword("hangup_config.trigger_keywords", val);
                        e.currentTarget.value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold">{t("last_greeting", "Last Greeting")}</Label>
              <Input placeholder={t("thanks_for_reaching_out_goodbye", "Thanks for reaching out. Goodbye!")} {...getFieldProps("hangup_config.farewell_message")} className="rounded-lg h-11" />
              <p className="text-[12px] text-slate-500">{t("final_words_spoken_desc", "The final words spoken before disconnection.")}</p>
            </div>
          </div>
        ) : (
          <div className="p-10 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-center">
            <p className="text-sm text-slate-400 font-medium italic">{t("hangup_automation_disabled_desc", "Hangup automation is disabled. The agent will stay on the line until the user disconnects.")}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepConnectivity;
