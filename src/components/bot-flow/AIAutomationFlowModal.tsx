"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useSuggestAutomationFlowMutation } from "@/src/redux/api/automationApi";
import { toast } from "sonner";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { LANGUAGES } from "@/src/data/Languages";
import { AIAutomationFlowModalProps } from "@/src/types/botFlow";



export default function AIAutomationFlowModal({
  isOpen,
  onClose,
  platform,
  onApplyAI,
}: AIAutomationFlowModalProps) {
  const [suggestFlow, { isLoading }] = useSuggestAutomationFlowMutation();

  const [formData, setFormData] = useState({
    businessName: "",
    industry: "",
    language: "English",
    occasion: "",
    purpose: "",
    action: "",
    tone: "Professional",
    additionalDetails: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!formData.businessName || !formData.industry || !formData.purpose || !formData.action) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      const payload = { ...formData, platform };
      const response = await suggestFlow(payload).unwrap();
      if (response.success && response.data && response.data.length > 0) {
        let flowPayload = JSON.parse(JSON.stringify(response.data[0]));

        if (flowPayload.raw_response) {
          try {
            flowPayload = JSON.parse(flowPayload.raw_response);
          } catch (e) {
            toast.error("AI response was malformed. Please try again with simpler instructions.");
            return;
          }
        }

        onApplyAI(flowPayload);
        toast.success("AI generated the flow successfully!");
        onClose();
      } else {
        toast.error("Failed to generate flow. No data returned.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to generate AI flow.");
      console.error(err);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! bg-white dark:bg-(--card-color) rounded-lg shadow-2xl p-0! gap-0! overflow-auto no-scrollbar max-h-[90vh] border-none">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--card-color)">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Sparkles size={18} />
            </div>
            <div>
              <AlertDialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Build with AI
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                Describe your requirements and let AI build the flow for you.
              </AlertDialogDescription>
            </div>
          </div>
          <Button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:bg-slate-100 bg-[unset] dark:hover:bg-(--table-hover) rounded-lg transition-colors"
          >
            <X size={20} />
          </Button>
        </div>

        <div className="sm:p-5 p-4 max-h-[65vh] overflow-y-auto space-y-4 no-scrollbar">
          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Business Name *</Label>
              <Input
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. TechHaven"
                className="text-sm border-gray-200 dark:border-slate-800"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Industry *</Label>
              <Input
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. E-commerce"
                className="text-sm border-gray-200 dark:border-slate-800"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Language *</Label>
              <Select value={formData.language} onValueChange={(val) => handleSelectChange("language", val)}>
                <SelectTrigger className="border-gray-200 dark:border-(--card-border-color) text-sm">
                  <SelectValue placeholder="Select Language" />
                </SelectTrigger>
                <SelectContent className="dark:bg-(--card-color)">
                  {LANGUAGES.map((lang) => (
                    <SelectItem className="dark:hover:bg-(--table-hover)" key={lang.code} value={lang.name}>
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tone *</Label>
              <Select value={formData.tone} onValueChange={(val) => handleSelectChange("tone", val)}>
                <SelectTrigger className="border-gray-200 dark:border-(--card-border-color) text-sm">
                  <SelectValue placeholder="Select Tone" />
                </SelectTrigger>
                <SelectContent className="dark:bg-(--card-color)">
                  <SelectItem className="dark:hover:bg-(--table-hover)" value="Professional">Professional</SelectItem>
                  <SelectItem className="dark:hover:bg-(--table-hover)" value="Friendly">Friendly</SelectItem>
                  <SelectItem className="dark:hover:bg-(--table-hover)" value="Urgent">Urgent</SelectItem>
                  <SelectItem className="dark:hover:bg-(--table-hover)" value="Humorous">Humorous</SelectItem>
                  <SelectItem className="dark:hover:bg-(--table-hover)" value="Empathetic">Empathetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Purpose *</Label>
            <Input
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              placeholder="e.g. To recover abandoned carts"
              className="text-sm border-gray-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Action / Workflow *</Label>
            <Textarea
              name="action"
              value={formData.action}
              onChange={handleChange}
              placeholder="e.g. Send a 10% discount message, wait 24h, then check if they bought. If not, enroll in sequence."
              className="text-sm border-gray-200 dark:border-slate-800 resize-none h-20"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Occasion (Optional)</Label>
            <Input
              name="occasion"
              value={formData.occasion}
              onChange={handleChange}
              placeholder="e.g. Black Friday Sale"
              className="text-sm border-gray-200 dark:border-slate-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Additional Details (Optional)</Label>
            <Textarea
              name="additionalDetails"
              value={formData.additionalDetails}
              onChange={handleChange}
              placeholder="Any specific tags, agents, or conditions you want the AI to include..."
              className="text-sm border-gray-200 dark:border-slate-800 resize-none h-16"
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--card-color) flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isLoading} className="text-sm dark:bg-(--page-body-bg) h-9">
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md text-sm h-9 px-6 gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={14} />
                Generate Flow
              </>
            )}
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
