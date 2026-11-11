"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { Switch } from "@/src/elements/ui/switch";
import { useGetAllModelsQuery } from "@/src/redux/api/settingsApi";
import { ChatbotFormModalProps } from "@/src/types/replyMaterial";
import { AIModel } from "@/src/types/settings";
import { Bot, Loader2, X } from "lucide-react";
import React, { useEffect, useState } from "react";

const ChatbotFormModal = ({ isOpen, onClose, onSubmit, isLoading, editItem, wabaId }: ChatbotFormModalProps) => {
  const [name, setName] = useState("");
  const [aiModel, setAiModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "friendly" | "humorous" | "empathetic" | "direct">("professional");
  const [messageLimit, setMessageLimit] = useState<number>(0);
  const [enableGoogleMeet, setEnableGoogleMeet] = useState<boolean>(false);
  const [enableHumanHandoff, setEnableHumanHandoff] = useState<boolean>(false);
  const [handoffKeywords, setHandoffKeywords] = useState<string[]>([]);
  const [handoffMessage, setHandoffMessage] = useState<string>("I'm connecting you with a human agent now. Someone will be with you shortly.");
  const [keywordInput, setKeywordInput] = useState("");

  const { data: modelsData, isLoading: loadingModels } = useGetAllModelsQuery();
  const models = modelsData?.data?.models || [];

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editItem?.name ?? "");
      const editAiModel = editItem?.ai_model;
      setAiModel(editAiModel && typeof editAiModel === "object" ? editAiModel._id : editAiModel ?? "");
      setApiKey(editItem?.api_key ?? "");
      setBusinessName(editItem?.business_name ?? "");
      setBusinessDescription(editItem?.business_description ?? "");
      setTone(editItem?.tone ?? "professional");
      setMessageLimit(editItem?.message_limit ?? 0);
      setEnableGoogleMeet(editItem?.enable_google_meet ?? false);
      setEnableHumanHandoff(editItem?.enable_human_handoff ?? false);
      setHandoffKeywords(editItem?.handoff_keywords ?? []);
      setHandoffMessage(editItem?.handoff_message ?? "I'm connecting you with a human agent now. Someone will be with you shortly.");
      setKeywordInput("");
    }
  }, [isOpen, editItem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !aiModel || !apiKey) return;

    const payload = {
      waba_id: wabaId,
      name: name.trim(),
      ai_model: aiModel,
      api_key: apiKey.trim(),
      business_name: businessName.trim(),
      business_description: businessDescription.trim(),
      tone,
      message_limit: messageLimit,
      enable_google_meet: enableGoogleMeet,
      enable_human_handoff: enableHumanHandoff,
      handoff_keywords: enableHumanHandoff ? handoffKeywords : [],
      handoff_message: enableHumanHandoff ? handoffMessage.trim() : "",
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={!isLoading ? onClose : undefined}>
      <DialogContent className="sm:max-w-lg p-0! overflow-hidden gap-0 border-none bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="px-4 pt-6 sm:px-6 sm:pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Bot size={20} />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">{editItem ? "Edit Chatbot" : "Create Chatbot"}</DialogTitle>
              <DialogDescription className="text-xs text-slate-400 font-medium">{editItem ? "Update your chatbot configuration" : "Configure your new AI chatbot assistant"}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="sm:p-6 p-4 pt-3 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Chatbot Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sales Assistant" required disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">AI Model</Label>
              <Select value={aiModel} onValueChange={setAiModel} disabled={isLoading || loadingModels}>
                <SelectTrigger className="h-11 py-5 rounded-lg border-slate-200 dark:border-(--card-border-color)  dark:border-none bg-slate-50 dark:bg-(--dark-body)">
                  <SelectValue placeholder={loadingModels ? "Loading models..." : "Select Model"} />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-(--card-color) border-slate-100 dark:border-(--card-border-color)">
                  {models.map((model: AIModel) => (
                    <SelectItem key={model._id} value={model._id} className="rounded-lg">
                      {model.display_name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">API Key</Label>
              <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Sk-..." type="password" required disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Business Name</Label>
              <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your Business Name" disabled={isLoading} className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)" />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label className="text-sm font-medium text-slate-400">Business Description</Label>
              <Textarea value={businessDescription} onChange={(e) => setBusinessDescription(e.target.value)} placeholder="Describe what your business does..." disabled={isLoading} className="custom-scrollbar min-h-18 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) resize-none" />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">Tone</Label>
              <Select value={tone} onValueChange={(val: any) => setTone(val)} disabled={isLoading}>
                <SelectTrigger className="h-11 py-5 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)">
                  <SelectValue placeholder="Select Tone" />
                </SelectTrigger>
                <SelectContent className="rounded-lg dark:bg-(--card-color) border-slate-100 dark:border-(--card-border-color)">
                  <SelectItem value="professional" className="rounded-lg">Professional</SelectItem>
                  <SelectItem value="casual" className="rounded-lg">Casual</SelectItem>
                  <SelectItem value="friendly" className="rounded-lg">Friendly</SelectItem>
                  <SelectItem value="humorous" className="rounded-lg">Humorous</SelectItem>
                  <SelectItem value="empathetic" className="rounded-lg">Empathetic</SelectItem>
                  <SelectItem value="direct" className="rounded-lg">Direct</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-slate-400">Message Limit (0 = Unlimited)</Label>
              <Input
                type="number"
                min={0}
                value={messageLimit}
                onChange={(e) => setMessageLimit(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={isLoading}
                className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
              />
            </div>

            <div className="flex col-span-2 gap-2">
              <div className="flex-1 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-slate-800 dark:text-white">Enable Google Meet</span>
                  <span className="text-xs text-slate-400">Generate and attach Google Meet links in the conversation</span>
                </div>
                <Switch checked={enableGoogleMeet} onCheckedChange={setEnableGoogleMeet} disabled={isLoading} />
              </div>

              <div className="flex-1 flex items-center justify-between p-3.5 bg-slate-50 dark:bg-(--dark-body) rounded-xl border border-slate-100 dark:border-none">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-slate-800 dark:text-white">Enable Human Handoff</span>
                  <span className="text-xs text-slate-400">Transfer chat to human agents based on keywords</span>
                </div>
                <Switch checked={enableHumanHandoff} onCheckedChange={setEnableHumanHandoff} disabled={isLoading} />
              </div>
            </div>

            {enableHumanHandoff && (
              <div className="col-span-2 p-4 bg-slate-50/50 dark:bg-(--dark-body)/30 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-400">Handoff Trigger Keywords</Label>
                  <div className="min-h-11 p-2 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body) flex flex-wrap gap-2 items-center">
                    {handoffKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center px-2.5 py-1 rounded bg-primary text-white text-xs font-semibold"
                      >
                        {kw}
                        <Button variant="unstyled"
                          type="button"
                          onClick={() => setHandoffKeywords((prev) => prev.filter((k) => k !== kw))}
                          disabled={isLoading}
                          className="ml-1.5 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        >
                          <X size={12} />
                        </Button>
                      </span>
                    ))}
                    <Input
                      type="text"
                      placeholder={handoffKeywords.length === 0 ? "Type keyword & press Enter..." : "Add keyword..."}
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === ",") {
                          e.preventDefault();
                          const val = keywordInput.trim();
                          if (val && !handoffKeywords.includes(val)) {
                            setHandoffKeywords((p) => [...p, val]);
                            setKeywordInput("");
                          }
                        }
                      }}
                      disabled={isLoading}
                      className="flex-1 min-w-[120px] h-7 border-none bg-transparent shadow-none focus-visible:ring-0 px-1 text-sm dark:text-white"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 block">Press Enter or comma to add a keyword.</span>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium text-slate-400">Handoff Message</Label>
                  <Input
                    value={handoffMessage}
                    onChange={(e) => setHandoffMessage(e.target.value)}
                    placeholder="e.g. Connecting you to a live agent..."
                    disabled={isLoading}
                    className="h-11 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="flex-1 h-11 rounded-lg border-slate-200 hover:bg-primary hover:text-white dark:border-(--card-border-color) text-slate-600 dark:text-slate-300">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim() || !aiModel || !apiKey} className="flex-1 h-11 rounded-lg bg-primary text-white font-semibold shadow-lg shadow-primary/20 active:scale-95 transition-all">
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving…
                </>
              ) : editItem ? (
                "Save Changes"
              ) : (
                "Create Chatbot"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotFormModal;
