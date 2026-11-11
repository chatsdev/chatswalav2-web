/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import {
  useCreateFormMutation,
  useGetFormByIdQuery,
  useUpdateFormMutation,
} from "@/src/redux/api/formBuilderApi";
import { RootState } from "@/src/redux/store";
import { FormBuilderWizardProps } from "@/src/types/formBuilder";
import { FormikProvider, useFormik } from "formik";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import * as Yup from "yup";
import Can from "../shared/Can";
import BasicSetupStep from "./steps/BasicSetupStep";
import FormDesignerStep from "./steps/FormDesignerStep";

const FormSchema = Yup.object().shape({
  name: Yup.string().required("Form name is required"),
  category: Yup.string().required("Category is required"),
  waba_id: Yup.string().required("WhatsApp Account is required"),
  submit_settings: Yup.object().shape({
    max_submissions_per_user: Yup.number()
      .min(0, "Must be at least 0")
      .required("Submission limit is required"),
  }),
});

const FormBuilderWizard: React.FC<FormBuilderWizardProps> = ({ mode, id }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: formData, isLoading: isFetching } = useGetFormByIdQuery(
    id as string,
    { skip: mode === "create" || !id },
  );
  const selectedWorkspace = useSelector(
    (state: RootState) => state.workspace.selectedWorkspace,
  );
  const [createForm, { isLoading: isCreating }] = useCreateFormMutation();
  const [updateForm, { isLoading: isUpdating }] = useUpdateFormMutation();

  const isSaving = isCreating || isUpdating;

  const formik = useFormik({
    initialValues: {
      waba_id: "",
      name: "",
      description: "",
      category: "LEAD_GENERATION",
      is_active: true,
      is_multi_step: false,
      fields: [],
      appearance: {
        theme_color: "var(--primary)",
        show_branding: false,
      },
      submit_settings: {
        button_text: "Send",
        success_message: "Thank you!",
        max_submissions_per_user: 5,
        limit_exceeded_message:
          "You have already reached the maximum number of submissions for this form.",
      },
      contact_settings: {
        auto_create_contact: false,
      },
    },
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      try {
        if (mode === "create") {
          await createForm(values).unwrap();
          toast.success("Form created successfully");
        } else {
          await updateForm({ id: id as string, body: values }).unwrap();
          toast.success("Form updated successfully");
        }
        router.push(ROUTES.WhatsappForm);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to save form");
      }
    },
  });

  useEffect(() => {
    if (formData?.data) {
      const fetchedData = formData.data;
      formik.setValues({
        ...formik.initialValues,
        ...fetchedData,
        appearance: {
          ...formik.initialValues.appearance,
          ...(fetchedData.appearance || {}),
        },
        submit_settings: {
          ...formik.initialValues.submit_settings,
          ...(fetchedData.submit_settings || {}),
        },
        contact_settings: {
          ...formik.initialValues.contact_settings,
          ...(fetchedData.contact_settings || {}),
        },
      } as any);
    } else if (
      mode === "create" &&
      selectedWorkspace?.waba_id &&
      !formik.values.waba_id
    ) {
      formik.setFieldValue("waba_id", selectedWorkspace.waba_id);
    }
  }, [formData, selectedWorkspace, mode]);

  if (isFetching) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <FormikProvider value={formik}>
      <div className="mx-auto flex flex-col gap-8 animate-in fade-in duration-500 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {mode === "create" ? t("create_new_form") : t("edit_form")}
              </h1>
              <p className="text-sm text-slate-500">
                Build and customize your form with a guided interaction flow
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="h-11 px-6 rounded-lg border border-slate-200 dark:border-none text-slate-600 dark:text-slate-400 bg-white dark:bg-(--card-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
            >
              Cancel
            </Button>
            <Can
              permission={
                mode === "create"
                  ? "create.form_builder"
                  : "update.form_builder"
              }
            >
              <Button
                onClick={async () => {
                  const errors = await formik.validateForm();
                  if (Object.keys(errors).length > 0) {
                    formik.handleSubmit();
                    toast.error("Please fill all required fields");
                  } else {
                    formik.handleSubmit();
                  }
                }}
                disabled={isSaving}
                className="h-11 rounded-lg px-8 bg-primary text-white gap-2 transition-all active:scale-95 font-bold border-none"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                {mode === "create" ? t("create_form") : t("save_changes")}
              </Button>
            </Can>
          </div>
        </div>

        <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 shadow-sm">
          <BasicSetupStep mode={mode} />
        </div>

        <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg sm:p-6 p-4 shadow-sm">
          <div className="mb-6 pb-4 border-b border-slate-100 dark:border-(--card-border-color) flex-wrap gap-3 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium text-slate-900 dark:text-white ">
                Form Designer
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Design your form fields and multi-step flow
              </p>
            </div>
            <div className="bg-primary/10 text-primary dark:text-primary rounded-full px-4 py-1.5 text-[10px] font-extrabold tracking-widest uppercase shadow-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Designer
            </div>
          </div>
          <div className="min-h-150">
            <FormDesignerStep />
          </div>
        </div>
      </div>
    </FormikProvider>
  );
};

export default FormBuilderWizard;
