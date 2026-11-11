/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import {
  DataConstraintsSectionProps
} from "@/src/types/components";
import {
  Hash,
  ListPlus,
  Plus,
  Scale,
  Settings2,
  Type as TypeIcon,
  X,
} from "lucide-react";
import React from "react";

const DataConstraintsSection: React.FC<DataConstraintsSectionProps> = ({
  formik,
  fieldTypes,
  newOption,
  setNewOption,
  handleAddOption,
  handleRemoveOption,
}) => {
  return (
    <div className="bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) shadow-sm space-y-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-1">
        <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded-md">
          <Settings2
            size={16}
            className="text-purple-600 dark:text-purple-400"
          />
        </div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          Data Constraints
        </h3>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          <TypeIcon size={14} className="text-gray-400" />
          Data Format
        </Label>
        <Select
          value={formik.values.type || undefined}
          onValueChange={(val) => formik.setFieldValue("type", val)}
        >
          <SelectTrigger
            className={`h-10 border-(--input-border-color) dark:bg-(--card-color) w-full dark:border-(--card-border-color) bg-gray-50 dark:hover:bg-(--table-hover) focus:ring-1 focus:ring-primary transition-all hover:border-gray-400 dark:hover:border-gray-500 ${formik.touched.type && formik.errors.type ? "border-red-500 ring-1 ring-red-500/20" : ""}`}
          >
            <SelectValue placeholder="Select how data will be stored" />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) shadow-xl rounded-xl"
            sideOffset={4}
          >
            {(Array.isArray(fieldTypes) ? fieldTypes : []).map(
              (ft: any, index: number) => {
                const val =
                  typeof ft === "string"
                    ? ft
                    : ft?.type || ft?.value || ft?.id || ft?.code;
                const label =
                  typeof ft === "string" ? ft : ft?.label || ft?.name || val;
                if (!val) return null;
                return (
                  <SelectItem
                    key={index}
                    value={String(val)}
                    className="dark:hover:bg-(--table-hover) cursor-pointer"
                  >
                    {label}
                  </SelectItem>
                );
              },
            )}
          </SelectContent>
        </Select>
        {formik.touched.type && formik.errors.type && (
          <p className="text-xs text-red-500 font-medium">
            {formik.errors.type as string}
          </p>
        )}
      </div>

      {formik.values.type.toUpperCase() === "SELECT" && (
        <div className="space-y-3 pt-2 border-t border-(--input-border-color) dark:border-(--card-border-color)">
          <Label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
            <ListPlus size={14} className="text-gray-400" />
            Allowed Choices
          </Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter a new option..."
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="h-10 focus:border-none focus-visible:ring-1 focus-visible:ring-primary bg-gray-50 dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color)"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddOption();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddOption}
              variant="outline"
              className="h-10 w-10 shrink-0 bg-primary/10 text-primary hover:bg-primary hover:text-white border-transparent transition-colors"
            >
              <Plus size={18} />
            </Button>
          </div>
          {formik.values.type.toUpperCase() === "SELECT" &&
            formik.errors.options && (
              <p className="text-xs text-red-500 font-medium">
                {formik.errors.options as string}
              </p>
            )}

          {formik.values.options.length > 0 && (
            <div className="p-3 bg-gray-50/50 dark:bg-black/20 border border-(--input-border-color) dark:border-(--card-border-color) rounded-xl space-y-2">
              <p className="text-xs text-gray-500 flex items-center gap-1">
                Showing {formik.values.options.length}{" "}
                {formik.values.options.length === 1 ? "choice" : "choices"}
              </p>
              <div className="flex flex-wrap gap-2">
                {formik.values.options.map((option: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-1.5 bg-white dark:bg-(--card-color) px-2.5 py-1 rounded-md text-xs font-semibold border border-(--input-border-color) dark:border-(--card-border-color) shadow-sm group"
                  >
                    <span className="text-gray-700 dark:text-gray-200 break-all whitespace-normal">
                      {option}
                    </span>
                    <Button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md p-0.5 transition-colors"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {(formik.values.type.toUpperCase() === "TEXT" ||
        formik.values.type.toUpperCase() === "TEXTAREA") && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-(--input-border-color) dark:border-(--card-border-color)">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Scale size={12} className="text-gray-400" />
              Min Length
            </Label>
            <Input
              type="number"
              name="min_length"
              placeholder="0"
              value={formik.values.min_length ?? ""}
              onChange={(e) =>
                formik.setFieldValue(
                  "min_length",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="h-10 text-sm focus:border-none focus-visible:ring-1 focus-visible:ring-primary bg-gray-50 dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color)"
              min="0"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Scale size={12} className="text-gray-400" />
              Max Length
            </Label>
            <Input
              type="number"
              name="max_length"
              placeholder="Unlimited"
              value={formik.values.max_length ?? ""}
              onChange={(e) =>
                formik.setFieldValue(
                  "max_length",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="h-10 text-sm focus:border-none focus-visible:ring-1 focus-visible:ring-primary bg-gray-50 dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color)"
              min="0"
            />
          </div>
        </div>
      )}

      {formik.values.type.toUpperCase() === "NUMBER" && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-(--input-border-color) dark:border-(--card-border-color)">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Hash size={12} className="text-gray-400" />
              Lowest Allowed
            </Label>
            <Input
              type="number"
              name="min_value"
              placeholder="e.g., 0"
              value={formik.values.min_value ?? ""}
              onChange={(e) =>
                formik.setFieldValue(
                  "min_value",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="h-10 text-sm focus:border-none focus-visible:ring-1 focus-visible:ring-primary bg-gray-50 dark:bg-(--card-color)! border-(--input-border-color) dark:border-(--card-border-color)"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
              <Hash size={12} className="text-gray-400" />
              Highest Allowed
            </Label>
            <Input
              type="number"
              name="max_value"
              placeholder="e.g., 100"
              value={formik.values.max_value ?? ""}
              onChange={(e) =>
                formik.setFieldValue(
                  "max_value",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              className="h-10 text-sm focus:border-none focus-visible:ring-1 focus-visible:ring-primary bg-gray-50 dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color)"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataConstraintsSection;
