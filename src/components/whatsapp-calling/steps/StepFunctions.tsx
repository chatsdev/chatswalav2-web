/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { FieldArray, useFormikContext } from "formik";
import { Bot, Code, Globe, Plus, Settings2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const StepFunctions = () => {
  const { t } = useTranslation();
  const { values, setFieldValue, getFieldProps } = useFormikContext<any>();

  const addKeyword = (path: string, keyword: string) => {
    if (!keyword.trim()) return;
    const current = getFieldProps(path).value || [];
    if (!current.includes(keyword.trim())) {
      setFieldValue(path, [...current, keyword.trim()]);
    }
  };

  return (
    <div className="mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Code size={22} />
            <span>{t("available_functions_tools", "Available Functions / Tools")}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("allow_agent_interact_apis_desc", "Allow your agent to interact with your business APIs in real-time.")}</p>
        </div>
      </div>

      <FieldArray name="available_functions">
        {({ push, remove }) => (
          <div className="space-y-8">
            {values.available_functions.length === 0 && (
              <div className="flex flex-col items-center justify-center p-12 border border-slate-200 dark:border-(--card-border-color) rounded-lg bg-slate-50/50 dark:bg-(--card-color) text-center space-y-4">
                <div className="p-4 bg-white dark:bg-(--dark-body) rounded-full shadow-sm border">
                  <Code size={32} className="text-slate-300" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">{t("no_functions_added", "No functions added yet")}</h3>
                  <p className="text-sm text-slate-500 max-w-xs">{t("functions_description_desc", "Functions let your AI fetch data like order status or book appointments.")}</p>
                </div>
              </div>
            )}

            {values.available_functions.map((func: any, index: number) => (
              <div key={index} className="group relative bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 transition-all duration-300">
                <Button variant="ghost" size="icon" className="absolute -top-3 -right-3 h-8 w-8 bg-white dark:bg-(--dark-body) border shadow-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50" onClick={() => remove(index)}>
                  <Trash2 size={16} />
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-slate-500 tracking-wider">{t("function_name", "Function Name")}</Label>
                          <Input
                            placeholder={t("function_name_placeholder", "e.g. track_order")}
                            {...getFieldProps(`available_functions.${index}.name`)}
                            onChange={(e) => {
                              const val = e.target.value;
                              setFieldValue(`available_functions.${index}.name`, val);
                              const slug =
                                val
                                  .toLowerCase()
                                  .trim()
                                  .replace(/\s+/g, "_")
                                  .replace(/[^\w-]+/g, "") + "_func";
                              setFieldValue(`available_functions.${index}.id`, slug);
                            }}
                            className="rounded-lg h-12"
                          />
                        </div>
                        <div className="flex items-center gap-2 px-3 py-3 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-200 dark:border-none">
                          <Code size={14} className="text-primary" />
                          <span className="text-sm font-mono text-slate-500">
                            {t("function_id_display", "ID: {{id}}", { id: values.available_functions[index]?.id || t("auto_generated", "auto-generated") })}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-3 flex flex-col">
                        <Label className="text-sm font-medium text-slate-500 tracking-wider mb-2">{t("trigger_keywords", "Trigger Keywords")}</Label>
                        <div className={cn("min-h-12 p-2.5 rounded-lg border transition-all flex flex-wrap gap-2 items-center cursor-text bg-slate-50/30 dark:bg-(--page-body-bg)", "focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/5 border-slate-200 dark:border-(--card-border-color)")} onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}>
                          {func.trigger_keywords?.map((kw: string, kwIdx: number) => (
                            <Badge key={kwIdx} variant="secondary" className="pl-2.5 pr-1.5 py-1.5 rounded-lg text-[11px] hover:bg-primary! break-all font-bold bg-primary text-white border-none gap-1.5 group">
                              {kw}
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newKws = [...func.trigger_keywords];
                                  newKws.splice(kwIdx, 1);
                                  setFieldValue(`available_functions.${index}.trigger_keywords`, newKws);
                                }}
                                className="w-4 h-4 rounded-md bg-white/20 hover:bg-white/40 flex items-center justify-center transition-colors"
                              >
                                <Plus size={12} className="rotate-45" />
                              </Button>
                            </Badge>
                          ))}
                          <Input
                            placeholder={func.trigger_keywords?.length === 0 ? t("type_keyword_press_enter", "Type keyword and press Enter...") : t("add_another", "Add another...")}
                            className="flex-1 min-w-30 bg-transparent outline-none text-sm placeholder:text-slate-400 border-none h-5!"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                  e.preventDefault();
                                  const val = e.currentTarget.value.trim();
                                  if (val && !func.trigger_keywords?.includes(val)) {
                                    addKeyword(`available_functions.${index}.trigger_keywords`, val);
                                    e.currentTarget.value = "";
                                  }
                              }
                            }}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Bot size={10} /> {t("press_enter_add_multiple_keywords", "Press Enter to add multiple keywords for this tool.")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Globe size={14} /> {t("api_connectivity", "API Connectivity")}
                      </div>
                      <div className="flex gap-3">
                        <Select value={func.api_config?.method} onValueChange={(val) => setFieldValue(`available_functions.${index}.api_config.method`, val)}>
                          <SelectTrigger className="w-28 h-12 py-6 rounded-lg bg-slate-50/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GET">GET</SelectItem>
                            <SelectItem value="POST">POST</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="https://api.site.com/orders/{{id}}" {...getFieldProps(`available_functions.${index}.api_config.url`)} className="flex-1 h-12 rounded-lg" />
                      </div>
                    </div>

                    <div className="space-y-4  sm:p-5 p-4 bg-slate-50/50 dark:bg-(--card-color) rounded-lg border border-slate-100 dark:border-(--card-border-color)">
                      <div className="flex items-center flex-wrap gap-3 justify-between">
                        <span className="text-sm font-medium text-slate-400 ">{t("authentication_headers", "Authentication / Headers")}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          type="button"
                          className="h-8 text-[10px] font-bold gap-1 text-white bg-primary hover:bg-primary/5 rounded-lg"
                          onClick={() => {
                            const h = func.api_config?.headers || [];
                            setFieldValue(`available_functions.${index}.api_config.headers`, [...h, { key: "", value: "" }]);
                          }}
                        >
                          <Plus size={12} /> {t("add_header", "Add Header")}
                        </Button>
                      </div>
                      <div className="space-y-2 max-h-62.5 overflow-auto custom-scrollbar">
                        {func.api_config?.headers?.map((header: any, hIdx: number) => (
                          <div key={hIdx} className="flex gap-2 animate-in fade-in slide-in-from-top-1">
                            <Input placeholder={t("header_key_placeholder", "Authorization")} className="h-11 text-xs rounded-lg" {...getFieldProps(`available_functions.${index}.api_config.headers.${hIdx}.key`)} />
                            <Input placeholder={t("header_value_placeholder", "Bearer Token")} className="h-11 text-xs rounded-lg" {...getFieldProps(`available_functions.${index}.api_config.headers.${hIdx}.value`)} />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 text-slate-400 hover:text-red-500 rounded-lg"
                              onClick={() => {
                                const headers = [...func.api_config.headers];
                                headers.splice(hIdx, 1);
                                setFieldValue(`available_functions.${index}.api_config.headers`, headers);
                              }}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                        <Settings2 size={14} /> {t("extraction_parameters", "Extraction Parameters")}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className="h-8 text-xs font-bold gap-1.5 border-primary/20 text-primary hover:bg-primary/5 rounded-xl border-dashed"
                        onClick={() => {
                          const p = func.parameters || [];
                          setFieldValue(`available_functions.${index}.parameters`, [...p, { id: "", name: "", type: "string", required: true, description: "" }]);
                        }}
                      >
                        <Plus size={14} /> {t("define_parameter", "Define Parameter")}
                      </Button>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto max-h-100 pr-2 custom-scrollbar">
                      {func.parameters?.map((p: any, pIdx: number) => (
                        <div key={pIdx} className="relative sm:p-5 p-4 bg-slate-50/50 dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color) rounded-lg space-y-4 animate-in zoom-in-95 duration-200">
                          <Button
                            onClick={() => {
                              const params = [...func.parameters];
                              params.splice(pIdx, 1);
                              setFieldValue(`available_functions.${index}.parameters`, params);
                            }}
                            className="absolute top-4 right-4 bg-[unset]! text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </Button>

                          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                            <div className="space-y-1.5">
                              <Label className="text-[10px] gap-1 flex items-center font-medium text-slate-400 ">{t("param_id_slug", "ID (Slug)")}</Label>
                              <Input placeholder={t("param_id_placeholder", "order_id")} className="h-11 text-xs rounded-lg" {...getFieldProps(`available_functions.${index}.parameters.${pIdx}.id`)} />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-[10px] font-medium text-slate-400">{t("prompt_label", "Prompt Label")}</Label>
                              <Input placeholder={t("param_label_placeholder", "Order Number")} className="h-11 text-xs rounded-lg" {...getFieldProps(`available_functions.${index}.parameters.${pIdx}.name`)} />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between flex-wrap">
                              <Label className="text-[10px] font-medium text-slate-400">{t("description_prompt", "Description / Prompt")}</Label>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold">{t("required_label", "Required")}</span>
                                <Switch checked={p.required} onCheckedChange={(val) => setFieldValue(`available_functions.${index}.parameters.${pIdx}.required`, val)} className="scale-75" />
                              </div>
                            </div>
                            <Input placeholder={t("param_description_placeholder", "Ask customer for their order ID...")} className="h-11 text-xs rounded-lg shadow-sm" {...getFieldProps(`available_functions.${index}.parameters.${pIdx}.description`)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" type="button" className="w-full sm:h-20 h-30 flex-wrap border border-slate-200 dark:border-(--card-border-color) rounded-lg hover:border-primary/70 hover:bg-primary/5 hover:text-primary transition-all duration-300 gap-3 group" onClick={() => push({ id: "", name: "", trigger_keywords: [], api_config: { method: "GET", url: "", headers: [] }, parameters: [] })}>
              <div className="p-3 bg-white dark:bg-(--dark-body) rounded-full border shadow-sm group-hover:border-primary/30 group-hover:shadow-primary/10 transition-all">
                <Plus size={24} />
              </div>
              <span className="text-lg font-bold">{t("deploy_new_function_tool", "Deploy New Function Tool")}</span>
            </Button>
          </div>
        )}
      </FieldArray>
    </div>
  );
};

export default StepFunctions;
