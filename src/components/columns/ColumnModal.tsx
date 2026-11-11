"use client";

import { fieldTypesData } from "@/src/data/components";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import {
  ColumnModalProps,
  CustomField,
  CustomFieldType,
} from "@/src/types/components";
import { ColumnModalSchema } from "@/src/utils/validationSchema";
import { useFormik } from "formik";
import { DatabaseZap, Loader2, X } from "lucide-react";
import React, { useState } from "react";
import DataConstraintsSection from "./sections/DataConstraintsSection";
import DisplayRulesSection from "./sections/DisplayRulesSection";
import IdentitySection from "./sections/IdentitySection";

const ColumnModal: React.FC<ColumnModalProps> = ({
  isOpen,
  onClose,
  onSave,
  column,
  isLoading,
}) => {
  const fieldTypes: CustomFieldType[] = fieldTypesData || [];

  const [newOption, setNewOption] = useState("");

  const generateNameFromLabel = (labelText: string) => {
    return labelText
      .trim()
      .toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  const formik = useFormik({
    initialValues: {
      label: column?.label || "",
      name: column?.name || "",
      type: column?.type || "",
      is_active: column?.is_active ?? true,
      is_required: column?.required ?? false,
      placeholder: column?.placeholder || "",
      description: column?.description || "",
      min_length: column?.min_length,
      max_length: column?.max_length,
      min_value: column?.min_value,
      max_value: column?.max_value,
      options: column?.options || [],
    },
    validationSchema: ColumnModalSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload: Partial<CustomField> = {
        label: values.label.trim(),
        name: values.name.trim() || generateNameFromLabel(values.label),
        type: values.type,
        is_active: values.is_active,
        required: values.is_required,
        placeholder: values.placeholder.trim(),
        description: values.description.trim(),
      };

      const type = values.type.toUpperCase();
      if (type === "TEXT" || type === "TEXTAREA") {
        if (values.min_length !== undefined)
          payload.min_length = values.min_length;
        if (values.max_length !== undefined)
          payload.max_length = values.max_length;
      } else if (type === "NUMBER") {
        if (values.min_value !== undefined)
          payload.min_value = values.min_value;
        if (values.max_value !== undefined)
          payload.max_value = values.max_value;
      } else if (type === "SELECT") {
        payload.options = values.options;
      }

      await onSave(payload);
    },
  });

  const handleAddOption = () => {
    const trimmed = newOption.trim();
    if (trimmed && !formik.values.options.includes(trimmed)) {
      formik.setFieldValue("options", [...formik.values.options, trimmed]);
      setNewOption("");
    }
  };

  const handleRemoveOption = (index: number) => {
    formik.setFieldValue(
      "options",
      formik.values.options.filter((_, i) => i !== index),
    );
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    formik.setFieldValue("label", value);
    if (!column) {
      formik.setFieldValue("name", generateNameFromLabel(value));
    }
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          formik.resetForm();
          onClose();
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-lg! max-w-[calc(100%-2rem)]!  p-0! gap-0 overflow-hidden bg-white dark:bg-(--card-color) border-(--input-border-color) dark:border-(--card-border-color) shadow-2xl rounded-lg">
        <AlertDialogHeader className="px-5 py-4 border-b border-(--input-border-color) max-w-[unset]! dark:border-(--card-border-color) bg-gray-50/50 dark:bg-(--card-color) flex flex-row items-center justify-between">
          <div>
            <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-800 dark:text-gray-100">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DatabaseZap className="text-primary w-5 h-5" />
              </div>
              {column ? "Configure Field" : "Define New Field"}
            </AlertDialogTitle>
          </div>
          <Button
            type="button"
            onClick={() => {
              formik.resetForm();
              onClose();
            }}
            variant="ghost"
            className="w-8 h-8 p-0 rounded-full hover:bg-gray-200 dark:hover:bg-(--table-hover) -mt-2"
          >
            <X size={18} className="text-gray-500" />
          </Button>
        </AlertDialogHeader>

        <form
          onSubmit={formik.handleSubmit}
          className="sm:p-5 p-4 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6"
        >
          <IdentitySection
            formik={formik}
            handleLabelChange={handleLabelChange}
          />

          <DataConstraintsSection
            formik={formik}
            fieldTypes={fieldTypes}
            newOption={newOption}
            setNewOption={setNewOption}
            handleAddOption={handleAddOption}
            handleRemoveOption={handleRemoveOption}
          />

          <DisplayRulesSection formik={formik} isLoading={isLoading} />

          <AlertDialogFooter className="p-0 px-0! pt-4 bg-white/90 dark:bg-(--card-color)/90 backdrop-blur-md border-t border-(--input-border-color) dark:border-(--card-border-color) flex sm:justify-between items-center sm:flex-row-reverse">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-white px-6 h-10 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all w-full sm:w-auto text-sm"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{column ? "Updating..." : "Creating..."}</span>
                </div>
              ) : column ? (
                "Save Changes"
              ) : (
                "Create Attribute"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                formik.resetForm();
                onClose();
              }}
              className="hidden sm:flex text-gray-500 bg-gray-100 dark:bg-(--page-body-bg) dark:text-white hover:text-gray-800 dark:hover:text-gray-200 h-10 text-sm"
            >
              Cancel
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ColumnModal;
