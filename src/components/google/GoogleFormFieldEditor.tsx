"use client";

import React from "react";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { GoogleFormCreateField } from "@/src/types/google";
import { Trash2, PlusCircle, X } from "lucide-react";

interface GoogleFormFieldEditorProps {
  field: GoogleFormCreateField;
  index: number;
  onRemoveField: (index: number) => void;
  onUpdateField: (index: number, updates: Partial<GoogleFormCreateField>) => void;
  onAddOption: (fieldIndex: number) => void;
  onRemoveOption: (fieldIndex: number, optionIndex: number) => void;
  onUpdateOption: (fieldIndex: number, optionIndex: number, value: string) => void;
}

export const GoogleFormFieldEditor: React.FC<GoogleFormFieldEditorProps> = ({
  field,
  index,
  onRemoveField,
  onUpdateField,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
}) => {
  return (
    <div className="bg-white dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color) rounded-lg sm:p-5 p-4 shadow-sm space-y-4 relative group">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 w-full">
          <Input
            value={field.title}
            onChange={(e) => onUpdateField(index, { title: e.target.value })}
            placeholder={`Question ${index + 1}`}
            className="h-11 font-semibold border-slate-200 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select
            value={field.type}
            onValueChange={(val: any) => onUpdateField(index, { type: val })}
          >
            <SelectTrigger className="h-11 border-slate-200 bg-slate-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              <SelectItem className="dark:hover:bg-(--table-hover)" value="text">Short Answer</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="paragraph">Paragraph</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="multiple_choice">Multiple Choice</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="checkbox">Checkbox</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="dropdown">Dropdown</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="date">Date</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="time">Time</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="linear_scale">Linear Scale</SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="rating">Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Question Type Options block */}
      {["multiple_choice", "checkbox", "dropdown"].includes(field.type) && (
        <div className="space-y-2.5 pl-3 border-l-2 border-slate-100 dark:border-(--card-border-color)">
          <Label className="text-sm font-bold text-slate-500 dark:text-slate-400">
            Options
          </Label>
          {(field.options || []).map((opt, oIdx) => (
            <div key={oIdx} className="flex items-center gap-2 max-w-md">
              <span className="text-slate-400 text-xs font-bold w-4">
                {oIdx + 1}.
              </span>
              <Input
                value={opt}
                onChange={(e) => onUpdateOption(index, oIdx, e.target.value)}
                placeholder={`Option ${oIdx + 1}`}
                className="h-9 border-slate-100 dark:border-slate-800 text-sm"
              />
              {(field.options || []).length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveOption(index, oIdx)}
                  className="h-9 w-9 p-0 text-red-500 border-none shrink-0"
                >
                  <X size={15} />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddOption(index)}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20 border-none gap-1.5 h-9 font-semibold"
          >
            <PlusCircle size={15} />
            Add Option
          </Button>
        </div>
      )}

      {/* Scale configuration */}
      {field.type === "linear_scale" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pl-3 border-l-2 border-slate-100 dark:border-(--card-border-color)">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500">Low Value</Label>
            <Select
              value={String(field.low || 1)}
              onValueChange={(val) => onUpdateField(index, { low: Number(val) })}
            >
              <SelectTrigger className="h-10 border-slate-200 dark:border-(--card-border-color)">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1">1</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500">High Value</Label>
            <Select
              value={String(field.high || 5)}
              onValueChange={(val) => onUpdateField(index, { high: Number(val) })}
            >
              <SelectTrigger className="h-10 border-slate-200  dark:border-(--card-border-color)">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 9 }).map((_, i) => (
                  <SelectItem key={i} value={String(i + 2)}>
                    {i + 2}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500">Low Label</Label>
            <Input
              value={field.lowLabel || ""}
              onChange={(e) => onUpdateField(index, { lowLabel: e.target.value })}
              placeholder="e.g. Not likely"
              className="h-10 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500">High Label</Label>
            <Input
              value={field.highLabel || ""}
              onChange={(e) => onUpdateField(index, { highLabel: e.target.value })}
              placeholder="e.g. Very likely"
              className="h-10 text-sm"
            />
          </div>
        </div>
      )}

      {/* Rating Configuration */}
      {field.type === "rating" && (
        <div className="grid grid-cols-2 gap-4 pl-3 border-l-2 border-slate-100 dark:border-(--card-border-color)">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500">Levels</Label>
            <Select
              value={String(field.ratingScaleLevel || 5)}
              onValueChange={(val) =>
                onUpdateField(index, { ratingScaleLevel: Number(val) })
              }
            >
              <SelectTrigger className="h-10 border-slate-200 dark:border-(--card-border-color)">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SelectItem key={i} value={String(i + 3)}>
                    {i + 3}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-slate-500">Icon Style</Label>
            <Select
              value={field.iconType || "STAR"}
              onValueChange={(val: any) => onUpdateField(index, { iconType: val })}
            >
              <SelectTrigger className="h-10 border-slate-200 dark:border-(--card-border-color)">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="STAR">Star</SelectItem>
                <SelectItem value="HEART">Heart</SelectItem>
                <SelectItem value="THUMB_UP">Thumbs Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Bottom Actions of field card */}
      <div className="flex items-center justify-between border-t border-slate-100 dark:border-(--card-border-color) pt-3 text-slate-500">
        <div className="flex items-center space-x-3.5">
          <Checkbox
            id={`req-${index}`}
            checked={field.required}
            onCheckedChange={(checked) =>
              onUpdateField(index, { required: !!checked })
            }
            className="h-4.5 w-4.5 text-purple-600 rounded border-slate-300"
          />
          <Label
            htmlFor={`req-${index}`}
            className="text-sm font-bold text-slate-500 cursor-pointer select-none"
          >
            Required
          </Label>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRemoveField(index)}
          className="h-9 w-9 p-0 border-none text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 shrink-0"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};
