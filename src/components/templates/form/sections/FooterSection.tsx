"use client";

import { Input } from "@/src/elements/ui/input";
import { FooterSectionProps } from "@/src/types/components/template";
import CharacterCountWrapper from "@/src/shared/CharacterCountWrapper";
import { useGetUserSettingsQuery } from "@/src/redux/api/settingsApi";
import { Badge } from "@/src/elements/ui/badge";
import { useRef } from "react";

export const FooterSection = ({ footerText, setFooterText }: FooterSectionProps) => {
  const { data: userSettingsResponse } = useGetUserSettingsQuery();
  const optoutKeywords = userSettingsResponse?.data?.whatsapp_optout_keyword || ["STOP"];
  const inputRef = useRef<HTMLInputElement>(null);

  const insertKeyword = (keyword: string) => {
    const input = inputRef.current;
    if (!input) return;

    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const text = footerText || "";
    const before = text.substring(0, start);
    const after = text.substring(end);
    const tag = keyword;
    const newText = (before + tag + after).slice(0, 60);

    setFooterText(newText);

    setTimeout(() => {
      input.focus();
      input.setSelectionRange(start + tag.length, start + tag.length);
    }, 0);
  };

  return (
    <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm space-y-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 tracking-tight">Template Footer (Optional)</h3>
        <p className="text-xs text-slate-500 font-medium dark:text-gray-400">Add a small footer text at the bottom of your message.</p>
      </div>
      <div className="space-y-4">
        <CharacterCountWrapper current={footerText?.length || 0} max={60}>
          <Input ref={inputRef} placeholder="Enter footer text..." value={footerText || ""} onChange={(e) => setFooterText(e.target.value.slice(0, 60))} className="h-12 border-slate-200 dark:border-(--card-border-color) rounded-lg bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-white dark:focus:bg-(--page-body-bg) focus:border-primary/50 transition-all font-medium" />
        </CharacterCountWrapper>

        <div className="space-y-2">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Insert Opt-out Keywords:</p>
          <div className="flex flex-wrap gap-2">
            {optoutKeywords.map((kw) => (
              <Badge key={kw} variant="outline" className="cursor-pointer hover:bg-primary hover:text-white transition-all bg-white dark:bg-(--page-body-bg) border-primary/20 text-primary px-3 py-1" onClick={() => insertKeyword(kw)}>
                +{kw}
              </Badge>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-tight italic">Recommended: Add an opt-out message in the footer to stay compliant.</p>
        </div>

        <p className="text-[12px] text-slate-400 dark:text-gray-400">Footer text is limited to 60 characters.</p>
      </div>
    </div>
  );
};
