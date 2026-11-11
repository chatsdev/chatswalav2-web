"use client";

import { Label } from "@/src/elements/ui/label";
import { Switch } from "@/src/elements/ui/switch";
import { BodyStepProps } from "@/src/types/widget";
import { cn } from "@/src/utils";
import { ImageIcon, Pipette } from "lucide-react";
import { ColorRow } from "./ColorRow";
import { Button } from "@/src/elements/ui/button";
import { Textarea } from "@/src/elements/ui/textarea";
import { Input } from "@/src/elements/ui/input";

export const BodyStep = ({ data, onChange, bodyBgType, setBodyBgType, bodyBgImageName, setBodyBgImageName, onBodyBgImageChange, isLoading }: BodyStepProps) => (
  <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Welcome Message</Label>
      <Textarea value={data.welcome_text || ""} onChange={(e) => onChange("welcome_text", e.target.value)} placeholder="Enter your welcome message..." rows={4} className="w-full px-4 py-3 rounded-lg custom-scrollbar border border-slate-200 dark:border-none bg-slate-50 dark:bg-(--page-body-bg) text-slate-800 dark:text-slate-100 text-sm font-medium outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all resize-none placeholder:text-slate-400 placeholder:font-normal" />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ColorRow label="Message Bubble Color" value={data.welcome_text_background} onChange={(v) => onChange("welcome_text_background", v)} fallback="var(--widget-fallback-3)" />
      <ColorRow label="Message Text Color" value={data.welcome_text_color} onChange={(v) => onChange("welcome_text_color", v)} fallback="var(--widget-fallback-4)" />
    </div>

    <div className="space-y-2">
      <Label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Body Background</Label>

      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-(--page-body-bg) rounded-lg w-fit h-[36px]">
        <Button
          onClick={() => {
            setBodyBgType("color");
            setBodyBgImageName(null);
            onBodyBgImageChange?.(null, null);
          }}
          className={cn("flex items-center gap-1.5 h-[28px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", bodyBgType === "color" ? "bg-white! dark:bg-(--card-color)! hover:bg-white! dark:hover:bg-(--card-color)! text-primary shadow-sm" : "text-slate-400 bg-[unset]! hover:text-slate-600 dark:hover:text-gray-400")}
        >
          <Pipette size={12} /> Color
        </Button>
        <Button onClick={() => setBodyBgType("image")} className={cn("flex h-[28px] items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all", bodyBgType === "image" ? "bg-white! dark:bg-(--card-color)! hover:bg-white! dark:hover:bg-(--card-color)! text-primary shadow-sm" : "text-slate-400 bg-[unset]! hover:text-slate-600 dark:hover:text-gray-400")}>
          <ImageIcon size={12} /> Image
        </Button>
      </div>

      {bodyBgType === "color" ? (
        <ColorRow label="" value={data.body_background_color} onChange={(v) => onChange("body_background_color", v)} fallback="var(--chatbot-bg)" />
      ) : (
        <Label className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color) hover:border-primary/50 transition-colors cursor-pointer group">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-(--dark-body) shadow-inner border border-slate-200 dark:border-none flex items-center justify-center shrink-0">
            <ImageIcon size={18} className="text-slate-400 group-hover:text-primary transition-colors" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-primary transition-colors">{bodyBgImageName ?? "Click to upload background image"}</p>
            <p className="text-xs text-slate-400 mt-0.5">PNG, JPG — Appears as the chat body background</p>
          </div>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setBodyBgImageName(file.name);
                const url = URL.createObjectURL(file);
                onBodyBgImageChange?.(url, file);
              }
            }}
          />
        </Label>
      )}
    </div>

    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-(--page-body-bg) flex-wrap gap-2 sm:gap-0 rounded-lg border border-slate-200 dark:border-none">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Auto-Open on Load</p>
        <p className="text-xs text-slate-400 mt-0.5">Automatically show the chat popup when page loads</p>
      </div>
      <Switch checked={data.default_open_popup || false} onCheckedChange={(v) => onChange("default_open_popup", v)} disabled={isLoading} />
    </div>
  </div>
);
