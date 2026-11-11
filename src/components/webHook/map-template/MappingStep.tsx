/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Badge } from "@/src/elements/ui/badge";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { AlertCircle, CheckCircle2, Database, Loader2, Locate, PlayCircle, Settings2 } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { FormLivePreview } from "../../templates/form/FormLivePreview";
import PayloadFieldSelector from "../PayloadFieldSelector";
import { MappingStepProps } from "@/src/types/webhook";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { Plus, X, Globe } from "lucide-react";
import { COUNTRIES } from "@/src/data/Countries";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { toast } from "sonner";

const MappingStep = ({
  payloadFields,
  phoneNumberField,
  setPhoneNumberField,
  variables,
  variableMappings,
  setVariableMappings,
  template,
  previewVariables,
  errors = {},
  type = "customer",
  isMerchantEnabled = true,
  setIsMerchantEnabled,
  merchantRecipients = [],
  setMerchantRecipients,
}: MappingStepProps & {
  errors?: Record<string, string>;
  type?: "customer" | "owner";
  isMerchantEnabled?: boolean;
  setIsMerchantEnabled?: (enabled: boolean) => void;
  merchantRecipients?: string[];
  setMerchantRecipients?: (recipients: string[]) => void;
}) => {
  const [newRecipient, setNewRecipient] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState(COUNTRIES[0]); // Default to first country (India)

  const addRecipient = () => {
    const cleanNumber = newRecipient.replace(/\D/g, "");
    if (!cleanNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    if (cleanNumber.length < 6 || cleanNumber.length > 15) {
      toast.error("Phone number must be between 6 and 15 digits");
      return;
    }

    const fullNumber = selectedCountry.dial_code.replace("+", "") + cleanNumber;

    if (merchantRecipients.includes(fullNumber)) {
      toast.error("This phone number is already added");
      return;
    }

    setMerchantRecipients?.([...merchantRecipients, fullNumber]);
    setNewRecipient("");
  };

  const removeRecipient = (index: number) => {
    setMerchantRecipients?.(merchantRecipients.filter((_, i) => i !== index));
  };

  return (
  <div className="grid [@media(max-width:1400px)]:grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="[@media(min-width:1400px)]:col-span-7 col-span-1 space-y-8">
      <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4 rounded-lg shadow-xl space-y-6">
        <div className="flex items-center justify-between gap-3 border-b dark:border-white/5 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Database size={18} className="text-primary" />
            </div>
            <div>
              <h3 className="font-black text-slate-800 dark:text-white text-sm">
                {type === "owner" ? "Merchant Notifications" : "Recipient Identification"}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                {type === "owner" ? "Configure recipient phone numbers" : "Crucial: Where is the customer's phone number?"}
              </p>
            </div>
          </div>
          {type === "owner" && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Enabled</span>
              <Switch checked={isMerchantEnabled} onCheckedChange={setIsMerchantEnabled} className="data-[state=checked]:bg-primary shadow-sm active:scale-95 transition-all" />
            </div>
          )}
        </div>

        {type === "customer" ? (
          <div className="space-y-3">
            <Label className={cn("text-xs font-black flex items-center gap-2", errors.phone_number_field ? "text-red-500" : "text-slate-700 dark:text-slate-300")}>
              Phone Number Field <span className="text-rose-500 text-lg">*</span>
            </Label>
            <PayloadFieldSelector
              fields={payloadFields}
              value={phoneNumberField}
              onChange={setPhoneNumberField}
              placeholder="Search phone field (e.g. customer.phone)"
              className={cn("h-14 rounded-lg shadow-sm bg-slate-50/50 dark:bg-(--page-body-bg)", errors.phone_number_field ? "border-red-500 ring-2 ring-red-500/10" : "border-slate-100 dark:border-(--card-border-color)")}
            />
            {errors.phone_number_field && <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">{errors.phone_number_field}</p>}
            <div className="flex items-start gap-2 bg-amber-50 dark:bg-(--card-color) p-4 rounded-lg border border-amber-100/50 dark:border-(--card-border-color)">
              <AlertCircle size={14} className="text-amber-500 mt-0.5" />
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold leading-relaxed">Ensure this field in your webhook JSON contains a valid phone number (with country code) for message delivery.</p>
            </div>
          </div>
        ) : (
          <div className={cn("space-y-4 transition-opacity duration-300", !isMerchantEnabled && "opacity-50 pointer-events-none")}>
            <div className="space-y-3">
              <Label className={cn("text-xs font-black flex items-center gap-2", errors.merchant_recipients ? "text-red-500" : "text-slate-700 dark:text-slate-300")}>
                Recipient Phone Numbers <span className="text-rose-500 text-lg">*</span>
              </Label>
              <div className="flex gap-2">
                <div className="flex-1 flex gap-2">
                  <Select
                    value={selectedCountry.code}
                    onValueChange={(code) => {
                      const country = COUNTRIES.find((c) => c.code === code);
                      if (country) setSelectedCountry(country);
                    }}
                  >
                    <SelectTrigger className="w-30 h-12 py-6 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-100 dark:border-(--card-border-color) font-bold text-xs shadow-xs focus:ring-primary/20">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">
                            <Globe size={14} />
                          </span>
                          <span>{selectedCountry.dial_code}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-60 rounded-xl border-slate-100 dark:border-(--card-border-color) shadow-2xl dark:bg-(--card-color)">
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.code} value={country.code} className="hover:bg-light-primary dark:hover:bg-primary/10 cursor-pointer py-2.5 px-3 rounded-lg mx-1 transition-colors">
                          <div className="flex items-center justify-between gap-3 w-full">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{country.name}</span>
                            <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md">{country.dial_code}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={newRecipient}
                    onChange={(e) => setNewRecipient(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter number (e.g. 9876543210)"
                    className="h-12 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) font-bold text-sm border-slate-100 focus:ring-primary/20 shadow-xs"
                    onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                  />
                </div>
                <Button onClick={addRecipient} className="h-12 w-12 bg-primary hover:bg-primary shadow-lg shadow-primary/20 rounded-lg shrink-0 active:scale-95 transition-all">
                  <Plus size={20} />
                </Button>
              </div>
              {errors.merchant_recipients && <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">{errors.merchant_recipients}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              {merchantRecipients.map((phone, index) => (
                <Badge key={index} className="pl-3 pr-1 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none font-bold text-xs flex items-center gap-2 group transition-all hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600">
                  {phone}
                  <Button variant="unstyled" onClick={() => removeRecipient(index)} className="p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded-md transition-colors">
                    <X size={12} />
                  </Button>
                </Badge>
              ))}
              {merchantRecipients.length === 0 && <p className="text-[10px] text-slate-400 italic font-bold uppercase tracking-widest py-2">No recipients added yet.</p>}
            </div>

            <div className="flex items-start gap-2 bg-blue-50 dark:bg-(--card-color) p-4 rounded-lg border border-blue-100/50 dark:border-(--card-border-color)">
              <AlertCircle size={14} className="text-blue-500 mt-0.5" />
              <p className="text-[10px] text-blue-700 dark:text-blue-400 font-bold leading-relaxed">Notifications will be sent directly to these numbers when the webhook is triggered.</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6 max-h-139.5 overflow-auto custom-scrollbar">
        <div className="px-2 flex items-center justify-between flex-wrap gap-3 sm:gap-0">
          <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase tracking-widest flex items-center gap-2">
            <Settings2 size={16} className="text-primary" /> Template Placeholders
          </h3>
          <Badge className="bg-primary/10 text-primary border-none font-black text-[10px] px-3">{variables.length} Variables to map</Badge>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {variables.length > 0 ? (
            variables.map((v: any, index: number) => {
              const key = v.key || (index + 1).toString();
              const example = v.example || "N/A";
              const currentVal = variableMappings[key] || "";
              const error = errors[`variable_${key}`];

              return (
                <div
                  key={index}
                  className={cn(
                    "group bg-white dark:bg-(--card-color) p-6 rounded-lg border transition-all hover:shadow-2xl space-y-5",
                    error ? "" : "border-gray-50 dark:border-(--card-border-color) hover:border-primary/30 hover:shadow-primary/5"
                  )}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-primary/20 ">
                        <Locate />
                      </div>
                      <div>
                        <div className={cn("text-[10px] font-black uppercase tracking-widest", error ? "text-red-500" : "text-primary")}>Placeholder {"{{" + key + "}}"}</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5 italic opacity-60">{`Example: "${example}"`}</div>
                      </div>
                    </div>

                    <div className="flex bg-slate-100 h-8.5 dark:bg-black/40 p-1 rounded-lg">
                      <Button onClick={() => setVariableMappings((prev) => ({ ...prev, [key]: "" }))} className={cn("px-3 h-6.25 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", !currentVal.startsWith("{{") ? "bg-white! dark:bg-primary! text-primary dark:text-white shadow-sm" : "text-slate-400 bg-[unset]!")}>
                        Manual
                      </Button>
                      <Button onClick={() => setVariableMappings((prev) => ({ ...prev, [key]: "{{" }))} className={cn("px-3 h-6.25 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all", currentVal.startsWith("{{") ? "bg-white! dark:bg-primary! text-primary dark:text-white shadow-sm" : "text-slate-400 bg-[unset]!")}>
                        Payload
                      </Button>
                    </div>
                  </div>

                  {currentVal.startsWith("{{") ? (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                      <PayloadFieldSelector
                        fields={payloadFields}
                        value={currentVal.replace("{{", "").replace("}}", "")}
                        onChange={(val) => setVariableMappings((prev) => ({ ...prev, [key]: val ? `{{${val}}}` : "{{" }))}
                        placeholder="Choose field from JSON..."
                        className={cn("h-12 rounded-lg bg-light-primary/20 dark:border-none", error ? "border border-red-500" : "border-primary/10")}
                      />
                    </div>
                  ) : (
                    <div className="animate-in slide-in-from-bottom-2 duration-300">
                      <Input
                        placeholder="Enter custom text here..."
                        value={currentVal}
                        onChange={(e) => setVariableMappings((prev) => ({ ...prev, [key]: e.target.value }))}
                        className={cn("h-12 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) font-bold text-sm", error ? "border-red-500 focus:ring-red-500/20" : "border-slate-100 focus:ring-primary/20")}
                      />
                    </div>
                  )}
                  {error && <p className="text-[10px] text-red-500 font-bold ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
                </div>
              );
            })
          ) : (
            <div className="bg-light-primary/50 dark:bg-(--card-color) sm:p-8 p-4 rounded-lg border border-dashed border-[var(--primary-opacity-30)]/50 dark:border-(--card-border-color) text-center space-y-4">
              <div className="h-16 w-16 bg-[var(--primary-opacity-20)] dark:bg-(--page-body-bg) rounded-lg flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-black text-lg text-primary dark:text-primary">Zero Variables</h4>
                <p className="text-sm text-primary/70 dark:text-primary/60 font-medium">This template is static. No variable mapping required!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="[@media(min-width:1400px)]:min-w-100 shrink-0">
      <div className="sticky top-0 bg-white dark:bg-(--dark-sidebar) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) overflow-hidden shadow-2xl">
        <div className="p-5 border-b dark:border-(--card-border-color) bg-slate-50/50 dark:bg-transparent flex items-center gap-2">
          <PlayCircle className="text-primary" size={16} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-gray-500">Real-time Preview</span>
        </div>
        <div className="p-[calc(4px+20*((100vw-320px)/1600))] flex items-center justify-center bg-slate-100/30 dark:bg-transparent">
          {template ? (
            <FormLivePreview templateType={template.header?.format || "text"} headerText={template.header?.text || ""} messageBody={template.message_body || ""} variables_example={previewVariables} footerText={template.footer_text || ""} buttons={template.buttons || []} headerFile={null} />
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-primary h-10 w-10" />
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Loading Preview...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
};

export default MappingStep;
