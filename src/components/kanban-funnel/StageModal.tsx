"use client";

import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { StageModalProps } from "@/src/types/kanban-funnel";
import { useFormik } from "formik";
import { X, Loader2, Palette } from "lucide-react";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { cn } from "@/src/lib/utils";

const StageModal: React.FC<StageModalProps> = ({ isOpen, onClose, onSave, stage, isLoading }) => {
  const { t } = useTranslation();
  const colorInputRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object({
    name: Yup.string().required("Stage name is required"),
    color: Yup.string().required("Color is required"),
  });

  const formik = useFormik({
    initialValues: {
      name: stage?.name || "",
      color: stage?.color || "#ebf8ff",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await onSave({ ...values, _id: stage?._id });
        formik.resetForm();
      } catch (error) {
        console.error("Stage save error:", error);
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
      <AlertDialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)] sm:p-6 p-4 shadow-2xl border-none dark:bg-(--card-color)">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle className="text-xl font-bold">{stage?._id ? t("edit_stage") : t("add_new_stage")}</AlertDialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onClose();
              formik.resetForm();
            }}
            className="h-8 w-8 rounded-full"
          >
            <X size={18} />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                {t("stage_name")} <span className="text-red-500">*</span>
              </Label>
              <Input id="name" name="name" placeholder={t("enter_stage_name")} value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className={cn("h-11 bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-none focus:ring-2 focus:ring-primary/20", formik.touched.name && formik.errors.name ? "border-red-500" : "")} />
              {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500">{formik.errors.name}</p>}
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">{t("stage_color")}</Label>
              <div className="flex gap-2 mt-2">
                <div className="border w-12 h-12 flex justify-center items-center rounded-lg relative cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => colorInputRef.current?.click()}>
                  <Palette size={20} className="text-slate-400" />
                  <Input type="color" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" ref={colorInputRef} value={formik.values.color} onChange={(e) => formik.setFieldValue("color", e.target.value)} />
                </div>
                <div className="border w-12 h-12 flex justify-center items-center rounded-lg shadow-sm" style={{ backgroundColor: formik.values.color }}></div>
              </div>
            </div>
          </div>

          <AlertDialogFooter className="pt-4 border-t dark:border-(--card-border-color)">
            <div className="flex gap-3 w-full sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {stage?._id ? t("update_stage") : t("create_stage")}
              </Button>
            </div>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default StageModal;
