/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Badge } from "@/src/elements/ui/badge";

interface FieldDetailCardProps {
  field: any;
}

const FieldDetailCard: React.FC<FieldDetailCardProps> = ({ field }) => {
  return (
    <div className="bg-white dark:bg-(--card-color) p-4.5 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-xs transition-all hover:shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap sm:flex-nowrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-slate-800 dark:text-white">
              {field.label}
            </span>
            {field.required && (
              <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-none text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                Required
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400 font-mono">
            <span>Key:</span>
            <span className="text-slate-600 dark:text-slate-300 font-semibold">{field.name}</span>
          </div>
        </div>

        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) shrink-0">
          {field.type}
        </Badge>
      </div>

      {/* Helper text */}
      {field.helper_text && (
        <p className="text-xs text-slate-400 italic mb-3">
          {field.helper_text}
        </p>
      )}

      {/* Field content options or default value */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-50 dark:border-(--card-border-color) text-xs">
        
        {/* Default Value */}
        <div className="space-y-1">
          <span className="text-slate-400 font-medium mb-2 flex">Default Value</span>
          <p className="text-slate-700 dark:text-slate-300 font-mono bg-slate-50/50 dark:bg-(--page-body-bg) p-1.5 rounded border border-slate-100/50 dark:border-(--card-border-color)">
            {field.default_value !== undefined && field.default_value !== null 
              ? String(field.default_value) 
              : <span className="text-slate-300 dark:text-slate-600">None</span>
            }
          </p>
        </div>

        {/* Options */}
        {field.options && Array.isArray(field.options) && field.options.length > 0 && (
          <div className="space-y-1">
            <span className="text-slate-400 font-medium">Options ({field.options.length})</span>
            <div className="max-h-24 overflow-y-auto custom-scrollbar border border-slate-100 dark:border-(--card-border-color) p-1.5 rounded bg-slate-50/50 dark:bg-(--page-body-bg) space-y-1">
              {field.options.map((opt: any, idx: number) => (
                <div key={opt.id || idx} className="flex justify-between items-center py-0.5 px-1 bg-white dark:bg-(--card-color) border border-slate-100 dark:border-slate-800/50 rounded-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{opt.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Val: {opt.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FieldDetailCard;
