"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { AuthenticationSectionProps, AuthFormData, OTPType } from "@/src/types/components/template";
import { KeyRound, ShieldCheck, Timer } from "lucide-react";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";
import { Button } from "@/src/elements/ui/button";
import { OTP_TYPES } from "@/src/data/templates";



export const AuthenticationSection = ({ authData, setAuthData, isLoading }: AuthenticationSectionProps) => {
  const update = (patch: Partial<AuthFormData>) => setAuthData({ ...authData, ...patch });

  const selectedType = authData.otp_buttons?.[0]?.otp_type ?? "COPY_CODE";

  const setOTPType = (type: OTPType) => {
    update({
      otp_buttons: [
        {
          otp_type: type,
          copy_button_text: authData.otp_buttons?.[0]?.copy_button_text ?? "Copy Code",
        },
      ],
    });
  };


  return (
    <div className="space-y-6">
      <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
        <ShieldCheck size={18} className="text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Authentication Template</p>
          <p className="text-[11px] text-amber-700 dark:text-amber-500 leading-relaxed">Content for authentication templates is fixed. You can configure the OTP button, security message, and expiry time below.</p>
        </div>
      </div>


      <div className="bg-white dark:bg-(--card-color) p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-4">
        {false && (
          <>
            <div>
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">OTP Button Type</Label>
              <p className="text-[11px] text-slate-400 mt-1">Choose how the user receives and uses the OTP code.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {OTP_TYPES.map((t) => {
                const isActive = selectedType === t.value;
                return (
                  <Button key={t.value} type="button" onClick={() => setOTPType(t.value)} className={`flex flex-col gap-1.5 p-4 rounded-lg border-2 text-left transition-all ${isActive ? "border-primary bg-light-primary/60 dark:bg-primary/10" : "border-slate-100 dark:border-(--card-border-color) bg-slate-50/30 dark:bg-(--table-hover) hover:border-primary/30"}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[13px] font-bold tracking-tight ${isActive ? "text-primary" : "text-slate-700 dark:text-gray-300"}`}>{t.label}</span>
                      {isActive && (
                        <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-gray-500 leading-tight">{t.description}</span>
                  </Button>
                );
              })}
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Button Text</Label>
          <Input placeholder="Copy Code" value="Copy Code" readOnly className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-slate-100 dark:bg-(--dark-sidebar) cursor-not-allowed font-medium" />
          <p className="text-[11px] text-slate-400">The text shown on the OTP action button. Fixed to &quot;Copy Code&quot; for authentication templates.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-5">
        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">OTP Configuration</Label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-600 dark:text-gray-400 flex items-center gap-2">
              <KeyRound size={14} /> OTP Code Length
            </Label>
            <Input type="number" min={4} max={8} placeholder="6" value={authData.otp_code_length} onChange={(e) => update({ otp_code_length: e.target.value === "" ? "" : parseInt(e.target.value) })} className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) transition-all" />
            <p className="text-[11px] text-slate-400">Number of digits in the OTP (4–8).</p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-600 dark:text-gray-400 flex items-center gap-2">
              <Timer size={14} /> Code Expiry (minutes)
            </Label>
            <Input type="number" min={1} max={90} placeholder="10" value={authData.code_expiration_minutes} onChange={(e) => update({ code_expiration_minutes: e.target.value === "" ? "" : parseInt(e.target.value) })} className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) transition-all" />
            <p className="text-[11px] text-slate-400">How long the code remains valid (1–90).</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) p-6 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-5">
        <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Additional Options</Label>

        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-(--table-hover) border border-slate-100 dark:border-(--card-border-color)">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-slate-700 dark:text-gray-300">Add Security Recommendation</p>
            <p className="text-[11px] text-slate-400">Appends &quot;For your security, do not share this code.&quot; to the message.</p>
          </div>
          <Switch checked={authData.add_security_recommendation} onCheckedChange={(val) => update({ add_security_recommendation: val })} disabled={isLoading} />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Footer Text <span className="font-normal text-slate-400">(optional)</span>
          </Label>
          <CharacterCountWrapper current={authData.footer_text?.length || 0} max={60}>
            <Input placeholder="e.g. Powered by Our Service" value={authData.footer_text} onChange={(e) => update({ footer_text: e.target.value.slice(0, 60) })} className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) transition-all font-medium" />
          </CharacterCountWrapper>
          <p className="text-[11px] text-slate-400">Shown in small text below the message body.</p>
        </div>
      </div>
    </div>
  );
};
