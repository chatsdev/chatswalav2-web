/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FORM_CATEGORIES } from "@/src/data/formBuilder";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useGetFormTemplateQuery } from "@/src/redux/api/formBuilderApi";
import { BasicSetupStepProps } from "@/src/types/formBuilder";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

const BasicSetupStep: React.FC<BasicSetupStepProps> = ({ mode }) => {
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext<any>();
  const fErrors = errors as any;
  const fTouched = touched as any;
  const { data: templatesData } = useGetFormTemplateQuery();
  const prevCategoryRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (
      prevCategoryRef.current !== values.category &&
      templatesData?.success &&
      templatesData.templates
    ) {
      const template = templatesData.templates[values.category];

      const shouldApply =
        mode === "create" || (mode === "edit" && values.fields.length === 0);

      if (template && shouldApply && mode === "create") {
        setFieldValue("fields", template);
        toast.info(
          `Applied default template for ${values.category.replace(/_/g, " ").toLowerCase()}`,
        );
      }
      prevCategoryRef.current = values.category;
    }
  }, [
    values.category,
    templatesData,
    setFieldValue,
    values.fields.length,
    mode,
  ]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-8">
          <div className="space-y-5">
            <div className="pb-2 border-b border-slate-100 dark:border-(--card-border-color)">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                General Information
              </h2>
              <p className="text-xs text-slate-500">
                Basic details about your form
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  Name Of Form <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Customer Feedback Form"
                  value={values.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  onBlur={handleBlur}
                  className={cn(
                    "h-11 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)",
                    touched.name && errors.name
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "",
                  )}
                />
                {touched.name && errors.name && (
                  <p className="text-[11px] font-medium text-red-500">
                    {errors.name as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  Description Of Form
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Briefly describe the purpose of this form..."
                  value={values.description}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  rows={4}
                  className="rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-5">
            <div className="pb-2 border-b border-slate-100 dark:border-(--card-border-color)">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Platform Integration
              </h2>
              <p className="text-xs text-slate-500">
                How the form interacts with our platform
              </p>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="category"
                    className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Select Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={values.category}
                    onValueChange={(val) => setFieldValue("category", val)}
                  >
                    <SelectTrigger className="h-11 py-5.5 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) shadow-xl">
                      {FORM_CATEGORIES.map((cat) => (
                        <SelectItem
                          key={cat.value}
                          value={cat.value}
                          className="rounded-lg dark:hover:bg-(--table-hover) my-1"
                        >
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="max_submissions_per_user"
                    className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Max Submission Limit
                  </Label>
                  <Input
                    id="max_submissions_per_user"
                    type="number"
                    min="0"
                    placeholder="0 for unlimited"
                    value={values.submit_settings.max_submissions_per_user}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFieldValue(
                        "submit_settings.max_submissions_per_user",
                        val === "" ? "" : parseInt(val) || 0,
                      );
                    }}
                    onBlur={handleBlur}
                    className={cn(
                      "h-11 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)",
                      fTouched.submit_settings?.max_submissions_per_user &&
                        fErrors.submit_settings?.max_submissions_per_user
                        ? "border-red-500 ring-2 ring-red-500/10"
                        : "",
                    )}
                  />
                  {fTouched.submit_settings?.max_submissions_per_user &&
                    fErrors.submit_settings?.max_submissions_per_user && (
                      <p className="text-[11px] font-medium text-red-500">
                        {
                          fErrors.submit_settings
                            .max_submissions_per_user as string
                        }
                      </p>
                    )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="limit_exceeded_message"
                  className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
                >
                  Limit Error Message
                </Label>
                <Textarea
                  id="limit_exceeded_message"
                  rows={2}
                  placeholder="Message to show when limit is reached..."
                  value={values.submit_settings.limit_exceeded_message}
                  onChange={(e) =>
                    setFieldValue(
                      "submit_settings.limit_exceeded_message",
                      e.target.value,
                    )
                  }
                  className="rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 mt-8">
        <div className="space-y-5">
          <div className="pb-2 border-b border-slate-100 dark:border-(--card-border-color) pt-4 lg:pt-0">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Submission Settings
            </h2>
            <p className="text-xs text-slate-500">
              What happens after the form is submitted
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="space-y-2 flex-1">
              <Label
                htmlFor="submit_button_text"
                className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Text of Submit Button
              </Label>
              <Input
                id="submit_button_text"
                value={values.submit_settings.button_text}
                onChange={(e) =>
                  setFieldValue("submit_settings.button_text", e.target.value)
                }
                placeholder="Submit"
                className="h-11 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)"
              />
            </div>

            <div className="space-y-2 flex-1">
              <Label
                htmlFor="success_message"
                className="text-[13px] font-semibold text-slate-700 dark:text-slate-300"
              >
                Success Message After Form Submited
              </Label>
              <Input
                id="success_message"
                value={values.submit_settings.success_message}
                onChange={(e) =>
                  setFieldValue(
                    "submit_settings.success_message",
                    e.target.value,
                  )
                }
                placeholder="Thank you for your submission!"
                className="h-11 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BasicSetupStep;
