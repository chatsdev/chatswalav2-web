/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { MultiSelect } from "@/src/elements/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { useGetSegmentsQuery } from "@/src/redux/api/segmentApi";
import { ContactModalProps, CustomField, Tag } from "@/src/types/components";
import { ContactSchema } from "@/src/utils/validationSchema";
import { useFormik } from "formik";
import { COUNTRIES } from "@/src/data/Countries";
import { Loader2, Phone, X } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import PlanFeature from "@/src/shared/PlanFeature";

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, onSave, contact, isLoading }) => {
  const { t } = useTranslation();
  const statusOptions = [
    { value: "active", label: t("active") },
    { value: "inactive", label: t("inactive") },
    { value: "lead", label: t("lead") },
    { value: "customer", label: t("customer") },
    { value: "prospect", label: t("prospect") },
  ];
  const { data: tagsResult } = useGetTagsQuery({});
  const { data: customFieldsResult } = useGetCustomFieldsQuery({ page: 1, limit: 100 });
  const { data: segmentsResult } = useGetSegmentsQuery({ page: 1, limit: 100 });

  const tags: Tag[] = tagsResult?.data?.tags || [];
  const customFields: CustomField[] = customFieldsResult?.data?.fields || [];
  const segments = segmentsResult?.data?.segments || [];

  // Helper to extract country code and phone
  const extractPhoneInfo = (fullNumber: string) => {
    if (!fullNumber) return { code: "+91", phone: "" };

    // Clean any non-digit characters from the input phone number
    const cleanNumber = fullNumber.replace(/\D/g, "");

    // Sort countries by their digit-only dial code length descending to match the longest one first
    const sortedCountries = [...COUNTRIES].sort((a, b) => {
      const cleanA = a.dial_code.replace(/\D/g, "");
      const cleanB = b.dial_code.replace(/\D/g, "");
      return cleanB.length - cleanA.length;
    });

    const match = sortedCountries.find(c => {
      const cleanDialCode = c.dial_code.replace(/\D/g, "");
      return cleanNumber.startsWith(cleanDialCode);
    });

    if (match) {
      const cleanDialCode = match.dial_code.replace(/\D/g, "");
      return {
        code: match.dial_code,
        phone: cleanNumber.slice(cleanDialCode.length)
      };
    }

    return { code: "+91", phone: cleanNumber };
  };

  const phoneInfo = extractPhoneInfo(contact?.phone_number || "");

  const formik = useFormik({
    initialValues: {
      phone_number: contact?.phone_number || "",
      country_code: phoneInfo.code,
      phone: phoneInfo.phone,
      name: contact?.name || "",
      // assigned_to: contact?.assigned_to || "",
      tags: contact?.tags ? contact.tags.map((t) => (typeof t === "object" ? (t as any)._id || (t as any).value : t)) : [],
      email: contact?.email || "",
      status: contact?.status || "",
      segments: contact?.segments ? contact.segments.map((s: any) => s._id || s) : [],
      custom_fields: contact?.custom_fields || {},
    },
    validationSchema: ContactSchema,
    enableReinitialize: true,
    validate: (values) => {
      const errors: any = {};
      const customFieldErrors: any = {};

      customFields.forEach((field) => {
        const value = values.custom_fields?.[field.name];
        const fieldType = field.type.toUpperCase();

        // Required check
        if (field.required && (value === undefined || value === "" || (fieldType === "BOOLEAN" && value === false))) {
          customFieldErrors[field.name] = `${field.label} is required`;
        }

        // Min/Max Length for Text/Textarea
        if (value && (fieldType === "TEXT" || fieldType === "TEXTAREA")) {
          if (field.min_length && value.length < field.min_length) {
            customFieldErrors[field.name] = `${field.label} must be at least ${field.min_length} characters`;
          }
          if (field.max_length && value.length > field.max_length) {
            customFieldErrors[field.name] = `${field.label} cannot exceed ${field.max_length} characters`;
          }
        }

        // Min/Max Value for Number
        if (value && fieldType === "NUMBER") {
          const numVal = Number(value);
          if (field.min_value !== undefined && numVal < field.min_value) {
            customFieldErrors[field.name] = `${field.label} must be at least ${field.min_value}`;
          }
          if (field.max_value !== undefined && numVal > field.max_value) {
            customFieldErrors[field.name] = `${field.label} cannot exceed ${field.max_value}`;
          }
        }
      });

      if (Object.keys(customFieldErrors).length > 0) {
        errors.custom_fields = customFieldErrors;
      }

      return errors;
    },
    onSubmit: async (values) => {
      const fullPhoneNumber = `${values.country_code}${values.phone}`;
      await onSave({ ...values, phone_number: fullPhoneNumber });
    },
  });

  const handleCustomFieldChange = (key: string, value: any) => {
    formik.setFieldValue(`custom_fields.${key}`, value, true);
  };

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
      <AlertDialogContent className="sm:max-w-2xl! max-w-[calc(100%-2rem)]! no-scrollbar max-h-[90vh] overflow-y-auto w-[95vw] max-w-[95vw] sm:w-full p-4 sm:p-6" size="lg">
        <AlertDialogHeader className="flex flex-row items-center justify-between pr-8 rtl:pr-0 rtl:pl-8">
          <AlertDialogTitle className="text-lg sm:text-xl font-bold">{contact ? t("edit_contact") : t("add_contact")}</AlertDialogTitle>
          <Button
            onClick={() => {
              onClose();
              formik.resetForm();
            }}
            className="p-1 hover:bg-gray-100 bg-gray-50 dark:bg-transparent rounded-lg transition-colors absolute right-4 top-4 rtl:right-auto rtl:left-4 dark:hover:bg-(--table-hover)"
          >
            <X size={20} className="dark:text-amber-50 text-gray-500" />
          </Button>
        </AlertDialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-4">
            {/* Main contact fields - responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm">
                  {t("mobile_number")} <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-4">
                  <div className="w-27.5 shrink-0">
                    <Select
                      value={COUNTRIES.find(c => c.dial_code === formik.values.country_code)?.code || "IN"}
                      onValueChange={(code) => {
                        const country = COUNTRIES.find(c => c.code === code);
                        if (country) {
                          formik.setFieldValue("country_code", country.dial_code);
                        }
                      }}
                    >
                      <SelectTrigger className="h-11 py-5.5 rounded-lg border border-(--input-border-color) dark:border-none bg-slate-50/30 dark:bg-(--page-body-bg) transition-all">
                        <SelectValue placeholder="Code" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-none max-h-72 shadow-2xl p-2">
                        {COUNTRIES.map((country) => (
                          <SelectItem
                            key={country.code}
                            value={country.code}
                            className="cursor-pointer dark:hover:bg-(--table-hover) rounded-lg mx-1 my-0.5 hover:bg-primary/10 data-[state=checked]:bg-primary/20 transition-colors"
                          >
                            <span className="flex items-center gap-2 py-1">
                              <span className="text-sm">
                                {country.dial_code}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative flex-1 group">
                    <Phone className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 transition-colors" />
                    <Input
                      id="phone"
                      name="phone"
                      placeholder={t("phone_number_placeholder")}
                      value={formik.values.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        formik.setFieldValue("phone", val);
                      }}
                      onBlur={formik.handleBlur}
                      className={cn(
                        "pl-14 h-11 rounded-lg border border-(--input-border-color) dark:border-(--card-border-color) bg-(--input-color) dark:bg-(--page-body-bg) focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all text-sm",
                        formik.touched.phone && formik.errors.phone
                          ? "border-red-400 focus:ring-red-400/5 ring-2 ring-red-500/20"
                          : ""
                      )}
                    />
                  </div>
                </div>
                {formik.touched.phone && formik.errors.phone && <p className="text-xs text-red-500">{formik.errors.phone}</p>}
                {formik.touched.phone_number && formik.errors.phone_number && !formik.errors.phone && <p className="text-xs text-red-500">{formik.errors.phone_number}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">
                  {t("name")} <span className="text-red-500">*</span>
                </Label>
                <Input id="name" name="name" placeholder={t("name_placeholder")} value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} className={`h-11 ${formik.touched.name && formik.errors.name ? "border-red-500 bg-(--input-color)" : "bg-(--input-color)"}`} />
                {formik.touched.name && formik.errors.name && <p className="text-xs text-red-500">{formik.errors.name}</p>}
              </div>

              <PlanFeature feature="tags">
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-sm">
                    {t("tags")}
                  </Label>
                  <MultiSelect
                    options={tags.map((tag) => ({
                      label: tag.label,
                      value: tag._id,
                      color: tag.color,
                    }))}
                    selected={formik.values.tags || []}
                    onChange={(selected) => formik.setFieldValue("tags", selected)}
                    placeholder={t("select_tags")}
                    className="dark:bg-(--page-body-bg) bg-(--input-color) dark:border-none dark:focus:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg)"
                  />
                </div>
              </PlanFeature>

              <PlanFeature feature="segments">
                <div className="space-y-2">
                  <Label htmlFor="segments" className="text-sm">
                    {t("segments")}
                  </Label>
                  <MultiSelect
                    options={segments.map((segment: any) => ({
                      label: segment.name,
                      value: segment._id,
                    }))}
                    selected={formik.values.segments || []}
                    onChange={(selected) => formik.setFieldValue("segments", selected)}
                    placeholder={t("select_segments")}
                    className="dark:bg-(--page-body-bg) bg-(--input-color) dark:border-none dark:focus:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg)"
                  />
                </div>
              </PlanFeature>

              <div className="space-y-2">
                <Label htmlFor="email" className={cn("text-sm transition-colors", formik.touched.email && formik.errors.email ? "" : "")}>
                  {t("email_address")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn("h-11 bg-(--input-color) transition-all focus:ring-1", formik.touched.email && formik.errors.email ? "border-red-500 focus:ring-red-500/20" : "focus:ring-primary/20")}
                />
                {formik.touched.email && formik.errors.email && <p className="text-[10px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">{formik.errors.email}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2 md:col-span-1">
                <Label htmlFor="status" className={cn("text-sm transition-colors", formik.touched.status && formik.errors.status ? "text-red-500" : "")}>
                  {t("status")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formik.values.status || undefined}
                  onValueChange={(val) => {
                    formik.setFieldValue("status", val);
                  }}
                >
                  <SelectTrigger className={cn("w-full h-11 py-5 bg-(--input-color) dark:border-none dark:bg-(--page-body-bg) dark:focus:bg-(--page-body-bg) dark:hover:bg-(--page-body-bg) transition-all focus:ring-1", formik.touched.status && formik.errors.status ? "border-red-500 ring-red-500/10 focus:ring-red-500/20" : "focus:ring-primary/20")}>
                    <SelectValue placeholder={t("select_status")} />
                  </SelectTrigger>
                  <SelectContent position="popper" className="dark:bg-(--page-body-bg)">
                    {statusOptions.map((status) => (
                      <SelectItem className="dark:hover:bg-(--card-color)" key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formik.touched.status && formik.errors.status && <p className="text-[10px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">{formik.errors.status}</p>}
              </div>
            </div>
          </div>
          <PlanFeature feature="custom_fields">
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {customFields.map((field) => {
                  const fieldType = field.type.toUpperCase();
                  const error = (formik.errors.custom_fields as any)?.[field.name];
                  const touched = (formik.touched.custom_fields as any)?.[field.name];
                  const showMessage = error && (touched || formik.submitCount > 0);

                  return (
                    <div key={field._id} className="space-y-2">
                      {fieldType !== "BOOLEAN" && (
                        <Label htmlFor={field.name} className={cn("text-sm transition-colors", showMessage ? "text-red-500" : "")}>
                          {field.label}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </Label>
                      )}
                      {fieldType === "SELECT" ? (
                        <div className="space-y-1">
                          <Select
                            value={formik.values.custom_fields?.[field.name] || undefined}
                            onValueChange={(val) => {
                              handleCustomFieldChange(field.name, val);
                            }}
                          >
                            <SelectTrigger className={cn("w-full h-12 py-5 bg-(--input-color) dark:bg-(--page-body-bg)", showMessage ? "border-red-500 ring-red-500/10" : "dark:border-none")}>
                              <SelectValue placeholder={`Select ${field.placeholder || field.label}`} />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              {field.options?.map((opt) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {showMessage && <p className="text-[10px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
                        </div>
                      ) : fieldType === "TEXTAREA" ? (
                        <div className="space-y-1">
                          <Textarea
                            id={field.name}
                            placeholder={`Enter ${field.placeholder || field.label}`}
                            value={formik.values.custom_fields?.[field.name] || ""}
                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                            onBlur={() => formik.setFieldTouched(`custom_fields.${field.name}`, true)}
                            className={cn("bg-(--input-color) min-h-20 transition-all focus:ring-1", showMessage ? "border-red-500 focus:ring-red-500/20" : "focus:ring-primary/20")}
                          />
                          {showMessage && <p className="text-[10px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
                        </div>
                      ) : fieldType === "BOOLEAN" ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-3 pt-2">
                            <Checkbox
                              id={field.name}
                              checked={Boolean(formik.values.custom_fields?.[field.name])}
                              onCheckedChange={(checked) => {
                                handleCustomFieldChange(field.name, checked === true);
                              }}
                              className={cn(showMessage && "border-red-500 data-[state=checked]:bg-red-500")}
                            />
                            <Label htmlFor={field.name} className={cn("cursor-pointer text-sm font-normal selection:bg-none transition-colors", showMessage ? "text-red-500" : "")}>
                              {field.label}
                              {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                          </div>
                          {showMessage && <p className="text-[10px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Input
                            className={cn("h-11 bg-(--input-color) transition-all focus:ring-1", showMessage ? "border-red-500 focus:ring-red-500/20" : "focus:ring-primary/20")}
                            id={field.name}
                            placeholder={`Enter ${field.placeholder || field.label}`}
                            value={formik.values.custom_fields?.[field.name] || ""}
                            onChange={(e) => {
                              let val = e.target.value;
                              if (fieldType === "NUMBER") {
                                val = val.replace(/\D/g, "");
                              }
                              handleCustomFieldChange(field.name, val);
                            }}
                            onBlur={() => formik.setFieldTouched(`custom_fields.${field.name}`, true)}
                            type={fieldType === "NUMBER" ? "text" : field.type.toLowerCase()}
                            inputMode={fieldType === "NUMBER" ? "numeric" : undefined}
                          />
                          {showMessage && <p className="text-[10px] text-red-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </PlanFeature>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-primary h-11 px-4.5! py-5! hover:bg-primary text-white w-full sm:w-auto px-8 order-1 sm:order-2">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t("saving")}</span>
                </div>
              ) : contact ? (
                t("update_contact")
              ) : (
                t("create_contact")
              )}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ContactModal;
