/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Badge } from "@/src/elements/ui/badge";
import { cn, formatDate, formatDateTime } from "@/src/utils";
import { 
  Settings, 
  Palette, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X, 
  Database, 
  ClipboardList, 
  Calendar, 
  Clock 
} from "lucide-react";

interface FormOverviewTabProps {
  form: any;
  stepsCount: number;
}

const FormOverviewTab: React.FC<FormOverviewTabProps> = ({ form, stepsCount }) => {
  return (
    <div className="mt-0 space-y-6">
      
      {/* Grid of basic settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card: Configuration */}
        <div className="bg-white dark:bg-(--card-color) sm:p-5 p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-xs space-y-4">
          <h4 className="text-sm font-extrabold text-slate-400 flex items-center gap-2">
            <Settings size={14} className="text-slate-400" />
            Configuration
          </h4>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {form.category?.replace(/_/g, " ") || "General"}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Form URL / Slug</span>
              <span className="font-mono text-xs bg-slate-100 dark:bg-(--dark-body) text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                {form.slug}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Total Steps</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {stepsCount}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Total Fields</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {form.fields?.length || 0}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-1">
              <span className="text-slate-500 dark:text-slate-400">Recaptcha Enabled</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                {form.enable_recaptcha ? (
                  <>
                    <Check size={14} className="text-primary" /> Yes
                  </>
                ) : (
                  <>
                    <X size={14} className="text-slate-400" /> No
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Card: Appearance & Submission Settings */}
        <div className="bg-white dark:bg-(--card-color) sm:p-5 p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-xs space-y-4">
          <h4 className="text-sm font-extrabold text-slate-400 flex items-center gap-2">
            <Palette size={14} className="text-slate-400" />
            Appearance & Submissions
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Theme Color</span>
              <div className="flex items-center gap-2">
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-slate-200/60 dark:border-slate-800" 
                  style={{ backgroundColor: form.appearance?.theme_color || "#10b981" }}
                />
                <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                  {form.appearance?.theme_color || "#10b981"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Submit Button Text</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {form.submit_settings?.button_text || "Submit"}
              </span>
            </div>

            <div className="flex flex-col text-sm py-1 gap-1">
              <span className="text-slate-500 dark:text-slate-400">Success Message</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-(--page-body-bg) p-2 rounded border border-slate-100 dark:border-(--card-border-color) italic">
                "{form.submit_settings?.success_message || "Thank you! Your submission has been received."}"
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Meta Flow Sync Status Details Card */}
      {form.flow && (
        <div className="bg-white dark:bg-(--card-color) sm:p-5 p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-xs space-y-4">
          <h4 className="text-sm font-extrabold text-slate-400 flex items-center gap-2">
            <Globe size={14} className="text-slate-400" />
            Meta Flow Details
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Flow ID</span>
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300 truncate max-w-50" title={form.flow.flow_id}>
                {form.flow.flow_id || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Meta Status</span>
              <Badge variant={form.flow.meta_status === "PUBLISHED" ? "default" : "secondary"} className="text-[10px] dark:bg-(--page-body-bg)">
                {form.flow.meta_status || "DRAFT"}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Sync Status</span>
              <Badge variant="outline" className="text-[10px] bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)">
                {form.flow.sync_status || "NOT_SYNCED"}
              </Badge>
            </div>

            <div className="flex justify-between items-center text-sm py-1 border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Template Name</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {form.flow.template_name || "-"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-1 md:border-none border-b border-slate-100 dark:border-(--card-border-color)">
              <span className="text-slate-500 dark:text-slate-400">Flow Switch State</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                {form.flow.is_flow_enabled ? (
                  <>
                    <CheckCircle2 size={14} className="text-primary" /> Enabled
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} className="text-slate-400" /> Disabled
                  </>
                )}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm py-1">
              <span className="text-slate-500 dark:text-slate-400">Last Synced At</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {form.flow.last_synced_at ? formatDateTime(form.flow.last_synced_at) : "Never"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Timestamps and Submissions Stats */}
      <div className="bg-white dark:bg-(--card-color) p-5 rounded-xl border border-slate-200/60 dark:border-(--card-border-color) shadow-xs space-y-4">
        <h4 className="text-sm font-extrabold text-slate-400 flex items-center gap-2">
          <Database size={14} className="text-slate-400" />
          Metadata & Stats
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1 p-3 rounded bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color)">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList size={12} className="text-primary" />
              Submissions Count
            </span>
            <span className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">
              {form.stats?.submissions || 0}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color)">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={12} className="text-slate-400" />
              Created On
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 py-0.5">
              {form.created_at ? formatDate(form.created_at) : "-"}
            </span>
          </div>

          <div className="flex flex-col gap-1 p-3 rounded bg-slate-50 dark:bg-(--page-body-bg) border border-slate-100 dark:border-(--card-border-color)">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock size={12} className="text-slate-400" />
              Last Updated
            </span>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 py-0.5">
              {form.updated_at ? formatDateTime(form.updated_at) : "-"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FormOverviewTab;
