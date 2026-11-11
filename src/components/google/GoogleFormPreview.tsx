"use client";

import React from "react";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Input } from "@/src/elements/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { GoogleFormCreateField } from "@/src/types/google";
import { Calendar, Clock, Heart, Star, ThumbsUp } from "lucide-react";
import { Textarea } from "@/src/elements/ui/textarea";


interface GoogleFormPreviewProps {
  title: string;
  description: string;
  requireEmail: boolean;
  fields: GoogleFormCreateField[];
}

export const GoogleFormPreview: React.FC<GoogleFormPreviewProps> = ({
  title,
  description,
  requireEmail,
  fields,
}) => {
  const renderPreviewInput = (field: GoogleFormCreateField, idx: number) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            disabled
            placeholder="Short answer text"
            className="border-slate-200 mt-2 bg-slate-50 max-w-md h-11"
          />
        );
      case "paragraph":
        return (
          <Textarea unstyled
            disabled
            placeholder="Long answer text"
            className="w-full border border-slate-200 rounded-lg p-3 mt-2 bg-slate-50 dark:bg-(--page-body-bg) min-h-[90px] text-sm resize-none outline-none text-slate-500"
          />
        );
      case "multiple_choice":
        return (
          <div className="space-y-2.5 mt-3">
            {(field.options || []).map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center space-x-2.5">
                <Input unstyled
                  type="radio"
                  disabled
                  name={`preview-radio-${idx}`}
                  className="h-4 w-4 border-slate-300 text-purple-600"
                />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {opt}
                </span>
              </div>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-2.5 mt-3">
            {(field.options || []).map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center space-x-2.5">
                <Checkbox disabled id={`preview-check-${idx}-${oIdx}`} />
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {opt}
                </span>
              </div>
            ))}
          </div>
        );
      case "dropdown":
        return (
          <div className="mt-3 max-w-xs">
            <Select disabled>
              <SelectTrigger className="h-11 border-slate-200 dark:border-(--card-border-color)">
                <SelectValue placeholder="Choose" />
              </SelectTrigger>
              <SelectContent>
                {(field.options || []).map((opt, oIdx) => (
                  <SelectItem key={oIdx} value={opt}>
                    {opt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case "date":
        return (
          <div className="mt-3 relative max-w-xs">
            <Input
              disabled
              placeholder="MM/DD/YYYY"
              className="h-11 pl-10 border-slate-200"
            />
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        );
      case "time":
        return (
          <div className="mt-3 relative max-w-xs">
            <Input
              disabled
              placeholder="HH:MM AM/PM"
              className="h-11 pl-10 border-slate-200"
            />
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
        );
      case "linear_scale":
        const low = field.low || 1;
        const high = field.high || 5;
        const scaleRange = Array.from(
          { length: high - low + 1 },
          (_, i) => low + i,
        );
        return (
          <div className="mt-4 flex flex-col space-y-2 w-full">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium w-full">
              <span>{field.lowLabel || "Low"}</span>
              <span>{field.highLabel || "High"}</span>
            </div>
            <div className="flex items-center flex-wrap gap-3 sm:gap-4 mt-2">
              {scaleRange.map((num) => (
                <div key={num} className="flex flex-col items-center space-y-1.5 shrink-0">
                  <span className="text-xs font-semibold text-slate-500">{num}</span>
                  <Input unstyled
                    type="radio"
                    disabled
                    name={`preview-scale-${idx}`}
                    className="h-5 w-5 border-slate-300 text-purple-600"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      case "rating":
        const stars = Array.from({ length: field.ratingScaleLevel || 5 });
        const renderIcon = () => {
          if (field.iconType === "HEART")
            return <Heart size={20} className="fill-current opacity-40" />;
          if (field.iconType === "THUMB_UP")
            return <ThumbsUp size={20} className="fill-current opacity-40" />;
          return <Star size={20} className="fill-current opacity-40" />;
        };
        return (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-amber-400">
            {stars.map((_, sIdx) => (
              <span key={sIdx}>{renderIcon()}</span>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="border border-slate-200 dark:border-(--card-border-color) rounded-lg overflow-hidden shadow-md bg-slate-50 dark:bg-(--page-body-bg)">
      {/* Top Purple Branding Band */}
      <div className="h-3 bg-purple-700 w-full" />

      <div className="sm:p-5 p-4 space-y-5 max-h-[75vh] overflow-y-auto no-scrollbar">
        {/* Form Title Preview Card */}
        <div className="bg-white dark:bg-(--card-color) rounded-lg sm:p-5 p-4 border border-slate-100 dark:border-(--card-border-color) shadow-xs space-y-2.5">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {title || "Untitled Form"}
          </h2>
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          )}
          {requireEmail && (
            <div className="pt-3.5 border-t border-slate-100 dark:border-(--card-border-color) text-sm text-red-500 font-semibold">
              * Email address required
            </div>
          )}
        </div>

        {/* Questions Preview cards */}
        {fields.map((field, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-(--card-color) rounded-lg sm:p-5 p-4 border border-slate-100 dark:border-(--card-border-color) shadow-xs space-y-2"
          >
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-start">
              {field.title || `Question ${idx + 1}`}
              {field.required && <span className="text-red-500 ml-1 font-bold">*</span>}
            </div>
            {renderPreviewInput(field, idx)}
          </div>
        ))}
      </div>
    </div>
  );
};
