/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { funnelTypes } from "@/src/data/kanubanFunnel";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import { PipelineModalProps } from "@/src/types/kanban-funnel";
import { useFormik } from "formik";
import { Loader2, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";

const PipelineModal: React.FC<PipelineModalProps> = ({
  isOpen,
  onClose,
  onSave,
  funnel,
  isLoading,
}) => {
  const { t } = useTranslation();

  const { isFeatureEnabled } = useFeatureAccess();
  funnelTypes.filter((type) => !type.feature || isFeatureEnabled(type.feature));

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    description: Yup.string(),
    funnelType: Yup.string().required("Funnel Type is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: funnel?.name || "",
      description: funnel?.description || "",
      funnelType: funnel?.funnelType || funnelTypes[0]?.id || "contact",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        await onSave(values as any);
        resetForm();
      } catch (error) {
        // keep form data on error
        console.error("Form submission error:", error);
      }
    },
  });

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          formik.resetForm();
        }
      }}
    >
      <AlertDialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! p-4 sm:p-6 overflow-auto max-h-[90vh] no-scrollbar shadow-2xl border-none dark:bg-(--card-color)">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="text-xl font-bold">
            {funnel ? t("edit_pipeline") : t("add_new_pipeline")}
          </AlertDialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onClose();
              formik.resetForm();
            }}
            className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-(--table-hover)"
          >
            <X size={18} />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t("pipeline_name")} <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                placeholder={t("enter_pipeline_name")}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "h-11 bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-none focus:ring-2 focus:ring-primary/20 transition-all",
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 ring-red-500/10"
                    : "",
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-xs text-red-500 px-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                {t("description")}
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t("enter_description")}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="min-h-25 bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("pipeline_type")} <span className="text-red-500">*</span>
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {funnelTypes.map((type) => (
                  <Button
                    key={type.id}
                    type="button"
                    disabled={!!funnel} // Immutable funnelType on edit
                    onClick={() => formik.setFieldValue("funnelType", type.id)}
                    className={cn(
                      "flex h-21.25 flex-col items-center justify-center p-3 rounded-lg border-2 transition-all gap-2 group",
                      formik.values.funnelType === type.id
                        ? "border-primary bg-primary/5! text-primary"
                        : "border-slate-100 dark:border-(--card-border-color) bg-white! dark:bg-(--page-body-bg)! hover:border-slate-200 dark:hover:border-(--table-hover) text-slate-500 dark:text-slate-400",
                      !!funnel && formik.values.funnelType !== type.id
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer",
                    )}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        formik.values.funnelType === type.id
                          ? "bg-primary text-white"
                          : "bg-slate-50 dark:bg-(--dark-body) group-hover:bg-slate-100 dark:group-hover:bg-(--table-hover)",
                      )}
                    >
                      {type.icon}
                    </div>
                    <span className="text-[11px] font-semibold text-center leading-tight">
                      {t(type.tKey)}
                    </span>
                  </Button>
                ))}
              </div>
              {formik.touched.funnelType && formik.errors.funnelType && (
                <p className="text-xs text-red-500 px-1">
                  {formik.errors.funnelType}
                </p>
              )}
            </div>
          </div>

          <AlertDialogFooter className="pt-4 border-t dark:border-(--card-border-color)">
            <div className="flex gap-3 w-full sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-11 sm:flex-none border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover)"
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-11 sm:flex-none bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{t("saving")}</span>
                  </div>
                ) : funnel ? (
                  t("update_pipeline")
                ) : (
                  t("create_pipeline")
                )}
              </Button>
            </div>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PipelineModal;
