/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/src/elements/ui/tabs";
import { cn } from "@/src/utils";
import { Sliders, Layers, Compass, FileText } from "lucide-react";
import FormOverviewTab from "./FormOverviewTab";
import FieldDetailCard from "./FieldDetailCard";

interface FormDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: any;
}

const FormDetailsModal: React.FC<FormDetailsModalProps> = ({ isOpen, onClose, form }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "fields">("overview");

  // Format form status and color
  const status = form?.meta_status || form?.status || "draft";
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-primary/10 text-primary dark:text-primary";
      case "draft":
        return "bg-slate-100 text-slate-400 dark:bg-(--page-body-bg) dark:text-gray-500";
      case "deprecated":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      default:
        return "bg-slate-100 text-slate-400 dark:bg-(--page-body-bg) dark:text-gray-500";
    }
  };

  // Group fields by step if it's a multi-step form
  const { steps, fieldsByStep } = useMemo(() => {
    const fieldsByStep: { [key: number]: any[] } = {};
    if (form?.fields && Array.isArray(form.fields)) {
      form.fields.forEach((field: any) => {
        const step = field.step || 1;
        if (!fieldsByStep[step]) {
          fieldsByStep[step] = [];
        }
        fieldsByStep[step].push(field);
      });
    }

    const steps = Object.keys(fieldsByStep)
      .map(Number)
      .sort((a, b) => a - b);
      
    steps.forEach((step) => {
      fieldsByStep[step].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return { steps, fieldsByStep };
  }, [form?.fields]);

  if (!form) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)]! max-h-[85vh] flex flex-col dark:bg-(--card-color) p-0! gap-0! overflow-auto no-scrollbar border border-slate-200 dark:border-(--card-border-color)">
        
        {/* Header */}
        <DialogHeader className="sm:p-6 p-4 pb-2 border-b border-slate-100 dark:border-(--card-border-color)">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white uppercase tracking-tight truncate">
                  {form.name}
                </DialogTitle>
                <div className="flex gap-1.5 flex-wrap">
                  <Badge variant="secondary" className={cn("border-none font-extrabold text-[10px] px-2.5 py-0.5 rounded-full tracking-wider shadow-xs uppercase", getStatusColor(status))}>
                    {status}
                  </Badge>
                  {form.is_active && (
                    <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-none font-extrabold text-[10px] px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                      Active
                    </Badge>
                  )}
                  {form.is_multi_step && (
                    <Badge className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none font-extrabold text-[10px] px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                      Multi-Step
                    </Badge>
                  )}
                </div>
              </div>
              <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 break-all whitespace-normal line-clamp-2">
                {form.description || "No description provided for this WhatsApp Form."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="px-6 pt-3 border-b border-slate-100 dark:border-(--card-border-color) bg-slate-50/30 dark:bg-transparent">
          <Tabs className="space-y-0">
            <TabsList className="bg-transparent dark:bg-transparent! flex-wrap border-b border-transparent p-0 gap-6 w-full justify-start h-auto">
              <TabsTrigger 
                active={activeTab === "overview"} 
                onClick={() => setActiveTab("overview")}
                className={cn(
                  "px-1 pb-3 pt-1 rounded-none border-b-2 font-bold text-sm transition-all focus:outline-none shadow-none",
                  activeTab === "overview" 
                    ? "border-primary text-primary bg-transparent dark:text-primary dark:border-primary" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-transparent dark:text-gray-400 dark:hover:text-slate-200 dark:hover:bg-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  <Sliders size={16} />
                  <span>Overview & Settings</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                active={activeTab === "fields"} 
                onClick={() => setActiveTab("fields")}
                className={cn(
                  "px-1 pb-3 pt-1 rounded-none border-b-2 font-bold text-sm transition-all focus:outline-none shadow-none",
                  activeTab === "fields" 
                    ? "border-primary text-primary bg-transparent dark:text-primary dark:border-primary" 
                    : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-transparent dark:text-gray-400 dark:hover:text-slate-200 dark:hover:bg-transparent"
                )}
              >
                <div className="flex items-center gap-2">
                  <Layers size={16} />
                  <span>Form Fields ({form.fields?.length || 0})</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto sm:px-6 px-4 py-6 no-scrollbar bg-slate-50/40 dark:bg-(--dark-body)">
          
          {/* TAB 1: OVERVIEW */}
          <TabsContent active={activeTab === "overview"} className="mt-0">
            <FormOverviewTab form={form} stepsCount={form.is_multi_step ? steps.length : 1} />
          </TabsContent>

          {/* TAB 2: FORM FIELDS */}
          <TabsContent active={activeTab === "fields"} className="mt-0">
            {(!form.fields || form.fields.length === 0) ? (
              <div className="text-center py-10 bg-white dark:bg-(--card-color) rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                <FileText className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <span className="text-sm font-semibold text-slate-500">No fields configured for this form.</span>
              </div>
            ) : form.is_multi_step ? (
              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step} className="space-y-3">
                    <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-2 px-1">
                      <Compass size={14} className="text-indigo-500" />
                      Step {step} ({fieldsByStep[step]?.length || 0} fields)
                    </h4>
                    <div className="grid grid-cols-1 gap-3.5">
                      {fieldsByStep[step].map((field: any, idx: number) => (
                        <FieldDetailCard key={field.id || idx} field={field} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {form.fields.map((field: any, idx: number) => (
                  <FieldDetailCard key={field.id || idx} field={field} />
                ))}
              </div>
            )}
          </TabsContent>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) flex justify-end">
          <Button onClick={onClose} className="bg-primary text-white hover:bg-primary/95 min-w-24">
            Close
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default FormDetailsModal;
