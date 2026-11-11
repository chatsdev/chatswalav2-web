/* eslint-disable @typescript-eslint/no-explicit-any */
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { IdentitySectionProps } from "@/src/types/components";
import { HelpCircle, KeyRound, Tag } from "lucide-react";
import React from "react";

const IdentitySection: React.FC<IdentitySectionProps> = ({
  formik,
  handleLabelChange,
}) => {
  return (
    <div className="bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) shadow-sm space-y-4 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-md">
          <Tag size={16} className="text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">
          Identity
        </h3>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          Display Name
        </Label>
        <Input
          name="label"
          placeholder="e.g., Customer Journey Stage"
          value={formik.values.label}
          onChange={handleLabelChange}
          onBlur={formik.handleBlur}
          className={`h-10 focus:border-none bg-(--input-color) dark:bg-(--card-color) dark:border-(--card-border-color) focus-visible:ring-1 focus-visible:ring-primary border-(--input-border-color) transition-all ${formik.touched.label && formik.errors.label ? "border-red-500 ring-1 ring-red-500/20" : "hover:border-gray-400 dark:hover:border-gray-500"}`}
          autoFocus
        />
        {formik.touched.label && formik.errors.label && (
          <p className="text-xs text-red-500 font-medium">
            {formik.errors.label as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          <KeyRound size={14} className="text-gray-400" />
          Internal Identifier (Slug)
        </Label>
        <Input
          name="name"
          placeholder="auto_generated_identifier"
          value={formik.values.name}
          onChange={formik.handleChange}
          className="h-10 focus:border-none bg-(--input-color) text-gray-500 focus-visible:ring-0 dark:border-(--card-border-color) dark:bg-gray-800/50 border-(--input-border-color) dark:bg-(--card-color) cursor-not-allowed opacity-80"
          readOnly
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
          <HelpCircle size={14} className="text-gray-400" />
          Instructions
        </Label>
        <Input
          name="description"
          placeholder="e.g., Explain the purpose of this field to users"
          value={formik.values.description}
          onChange={formik.handleChange}
          className="h-10 focus:border-none focus-visible:ring-1 dark:bg-(--card-color) focus-visible:ring-primary border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color) transition-all hover:border-gray-400 dark:hover:border-gray-500"
        />
      </div>
    </div>
  );
};

export default IdentitySection;
