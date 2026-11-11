/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useFormikContext } from "formik";
import { History, Mic } from "lucide-react";
import InfoModal from "../../common/InfoModal";

import { useTranslation } from "react-i18next";

const StepVoiceSTT = () => {
  const { t } = useTranslation();
  const { values, getFieldProps } = useFormikContext<any>();
  const STEPVOICESTTLIST = [
    { label: t("stt_provider", "Speech-to-Text Provider"), value: values.voice_config.stt_provider, badge: t("deep_analysis", "Deep Analysis") },
    { label: t("tts_provider", "Text-to-Speech Provider"), value: values.voice_config.tts_provider, badge: t("crystal_clear", "Crystal Clear") },
  ];

  return (
    <div className="mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-2 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-semibold text-lg">
            <Mic size={22} />
            <span>{t("voice_stt_title", "Voice & STT (ElevenLabs)")}</span>
          </div>
          <InfoModal dataKey="voice_stt" iconSize={22} className="text-gray-400 hover:text-primary transition-colors" />
        </div>
        <p className="text-sm text-muted-foreground">{t("define_assistant_sounds_desc", "Define how your assistant sounds and how it listens to callers.")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">{t("elevenlabs_api_key", "ElevenLabs API Key")}</Label>
            <Input type="password" placeholder="••••••••••••••••" {...getFieldProps("voice_config.api_key")} className="h-11 rounded-lg shadow-inner bg-slate-50/50" />
            <p className="text-[11px] text-slate-500">{t("secure_key_tts_desc", "Your secure key for text-to-speech generation.")}</p>
          </div>

          <div className="flex items-center gap-4 sm:p-5 p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-100 dark:border-amber-900/50">
            <History size={20} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-200">{t("transcription_enabled_desc", "Transcription is enabled by default for all calls to ensure accuracy and history retrieval.")}</p>
          </div>
        </div>

        <div className="space-y-6">
          {STEPVOICESTTLIST.map((item, i) => (
            <div key={i} className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">{item.label}</Label>
              <div className="p-4 bg-white h-11 dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg flex items-center justify-between">
                <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{item.value}</span>
                <Badge variant="outline" className="text-[9px] bg-slate-50 dark:bg-slate-800 border-none px-1.5">
                  {item.badge}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepVoiceSTT;
