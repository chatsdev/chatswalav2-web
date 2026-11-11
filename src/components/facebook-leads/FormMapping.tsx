/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/elements/ui/card";
import { Label } from "@/src/elements/ui/label";
import { MultiSelect } from "@/src/elements/ui/multi-select";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { Switch } from "@/src/elements/ui/switch";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { useGetFacebookLeadFormByIdQuery, useUpdateFacebookLeadFormMappingMutation } from "@/src/redux/api/facebookApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { useAppSelector } from "@/src/redux/hooks";
import { Template } from "@/src/types/components";
import { ConnectedFacebookLeadForm, FieldMapping } from "@/src/types/facebookLead";
import { getTemplateVariables } from "@/src/utils/template";
import { ArrowLeft, ChevronRight, FileJson, Layout, Link, Save, Sparkles, Tag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { VariableRow } from "../campaigns/wizard/VariableMappingComponents";

const FormMapping = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const { data: formResult, isLoading: isFormLoading } = useGetFacebookLeadFormByIdQuery(id);
  const form: ConnectedFacebookLeadForm | undefined = formResult?.data;

  const { data: customFieldsResult } = useGetCustomFieldsQuery({ page: 1, limit: 100 });
  const customFields = customFieldsResult?.data?.fields || [];

  const { data: tagsResult } = useGetTagsQuery({ page: 1, limit: 1000 });
  const tags = tagsResult?.data?.tags || [];

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaId = selectedWorkspace?.waba_id;

  const { data: templatesResult } = useGetTemplatesQuery({ waba_id: wabaId as string }, { skip: !wabaId });

  const templates: Template[] = useMemo(() => {
    if (!templatesResult) return [];
    // Handle both { success, data: [] } and direct array response
    if (Array.isArray(templatesResult)) return templatesResult;
    if (Array.isArray((templatesResult as any)?.data)) return (templatesResult as any).data;
    return [];
  }, [templatesResult]);

  const approvedTemplates = useMemo(() => templates.filter((t) => t.status?.toLowerCase() === "approved"), [templates]);

  const [updateMapping, { isLoading: isUpdating }] = useUpdateFacebookLeadFormMappingMutation();

  const [fieldMapping, setFieldMapping] = useState<FieldMapping[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [sendFirstTemplate, setSendFirstTemplate] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [variableMappings, setVariableMappings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (form) {
      setFieldMapping(form.field_mapping || []);
      setSelectedTagIds(form.tag_ids?.map((t) => (typeof t === "string" ? t : t._id)) || []);
      setSendFirstTemplate(!!form.send_first_template);
      setSelectedTemplateId(form.template_id || "");

      // Initialize variable mappings with {{ }} for the UI
      if (form.template_variable_mappings) {
        const uiMappings: Record<string, string> = {};
        Object.entries(form.template_variable_mappings).forEach(([key, val]) => {
          uiMappings[key] = `{{${val}}}`;
        });
        setVariableMappings(uiMappings);
      } else {
        setVariableMappings({});
      }

      // Initialize field mapping if empty but sample payload exists
      if ((!form.field_mapping || form.field_mapping.length === 0) && form.sample_payload) {
        setFieldMapping(
          form.sample_payload.map((item) => ({
            fb_field_name: item.name,
            contact_field: "",
          }))
        );
      }
    }
  }, [form]);

  const contactFieldOptions = useMemo(() => {
    const options = [
      { label: "Contact Name", value: "name" },
      { label: "Phone Number", value: "phone_number" },
      { label: "Email Address", value: "email" },
    ];
    customFields.forEach((field: any) => {
      options.push({ label: `CF: ${field.label}`, value: `custom_field|${field._id}` });
    });
    return options;
  }, [customFields]);

  const facebookFieldOptions = useMemo(() => {
    return (
      form?.sample_payload?.map((item) => ({
        label: item.name,
        value: item.name,
      })) || []
    );
  }, [form]);

  const selectedTemplate = useMemo(() => {
    return approvedTemplates.find((t) => t._id === selectedTemplateId);
  }, [approvedTemplates, selectedTemplateId]);

  const templateVariables = useMemo(() => {
    return selectedTemplate ? getTemplateVariables(selectedTemplate) : [];
  }, [selectedTemplate]);

  const handleFieldMappingChange = (fbField: string, contactValue: string) => {
    setFieldMapping((prev) => {
      const existingIndex = prev.findIndex((m) => m.fb_field_name === fbField);
      const parts = contactValue.split("|");
      const mapping: FieldMapping = {
        fb_field_name: fbField,
        contact_field: parts[0],
        custom_field_id: parts[1],
      };

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = mapping;
        return next;
      }
      return [...prev, mapping];
    });
  };

  const handleSave = async () => {
    try {
      await updateMapping({
        id,
        body: {
          field_mapping: fieldMapping,
          tag_ids: selectedTagIds,
          send_first_template: sendFirstTemplate,
          template_id: selectedTemplateId || undefined,
          template_variable_mappings: Object.entries(variableMappings).reduce((acc, [key, val]) => {
            // Strip {{ }} if present for the payload
            acc[key] = val.replace(/\{\{|\}\}/g, "");
            return acc;
          }, {} as Record<string, string>),
        },
      }).unwrap();
      toast.success("Mapping updated successfully");
      router.push(`${ROUTES.FacebookLead}?tab=connected`);
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to update mapping");
    }
  };

  if (isFormLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body) min-h-full pb-20">
      <div className="flex items-center gap-3 mb-5">
        <Button variant="ghost" size="icon" onClick={() => router.push(`${ROUTES.FacebookLead}?tab=connected`)} className="rounded-lg bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) shadow-sm">
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Form Mapping</h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">Configure how leads from {form?.form_name} are mapped to your contacts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Field Mapping Section */}
          <Card className="border-none shadow-sm dark:bg-(--card-color) overflow-hidden">
            <CardHeader className="p-4.5! border-b border-slate-50 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color)">
              <div className="flex items-center gap-2">
                <Link className="text-primary" size={20} />
                <CardTitle className="text-lg font-bold">Field Mapping</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-6">
                {form?.sample_payload?.map((item) => {
                  const currentMapping = fieldMapping.find((m) => m.fb_field_name === item.name);
                  const selectedValue = currentMapping ? (currentMapping.contact_field === "custom_field" ? `custom_field|${currentMapping.custom_field_id}` : currentMapping.contact_field) : "";

                  return (
                    <div key={item.name} className="group sm:p-5 p-4 bg-slate-50/50 dark:bg-(--dark-body) rounded-lg border border-slate-100 dark:border-none transition-all hover:border-primary/20 hover:shadow-md hover:shadow-primary/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                            <FileJson size={14} /> Facebook Field
                          </Label>
                          <div className="px-4 py-3 bg-white dark:bg-(--card-color) rounded-lg border border-slate-200 dark:border-(--card-border-color) font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                            {item.name}
                            <span className="block text-xs font-medium text-slate-400 mt-0.5">Example: {item?.values?.[0] || ""}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-sm font-medium text-slate-500 flex items-center gap-1.5">
                            <ChevronRight size={14} /> Map to Contact Field
                          </Label>
                          <Select value={selectedValue} onValueChange={(val) => handleFieldMappingChange(item.name, val)}>
                            <SelectTrigger className="h-12 py-6 bg-white dark:bg-(--card-color) rounded-lg border-slate-200 dark:border-(--card-border-color) font-medium text-slate-400 shadow-sm">
                              <SelectValue placeholder="Select contact field..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color) shadow-2xl max-h-80">
                              {contactFieldOptions.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value} className="rounded-lg dark:hover:bg-(--table-hover) py-3 font-medium">
                                  <span className="truncate max-w-62.5">{opt.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Template Section */}
          <Card className="border-none shadow-sm dark:bg-(--card-color) overflow-hidden">
            <CardHeader className="p-4.5! border-b border-slate-50 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center gap-2">
                <Sparkles className="text-primary" size={20} />
                <CardTitle className="text-lg font-bold">First Message Automation</CardTitle>
              </div>
              <Switch checked={sendFirstTemplate} onCheckedChange={setSendFirstTemplate} />
            </CardHeader>
            <CardContent className="p-4">
              {sendFirstTemplate ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Select Welcome Template</Label>
                    <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                      <SelectTrigger className="h-12 py-5.5 bg-slate-50/50 dark:bg-(--dark-body) rounded-lg border-slate-200 dark:border-(--card-border-color) font-bold">
                        <SelectValue placeholder="Choose an approved template..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg border-slate-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-2xl max-h-80 w-(--radix-select-trigger-width) min-w-62.5">
                        {approvedTemplates.map((t) => (
                          <SelectItem key={t._id} value={t._id} className="py-3 font-bold dark:hover:bg-(--table-hover)">
                            <span className="truncate break-all whitespace-normal line-clamp-2 ">{t.template_name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedTemplate && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 px-1">
                        <Layout className="text-primary" size={18} />
                        <p className="text-sm font-black text-slate-800 dark:text-white">Template Variable Mapping</p>
                      </div>
                      <div className="space-y-4">
                        {templateVariables.map((vKey) => (
                          <VariableRow key={vKey} varKey={vKey} example={selectedTemplate.body_variables?.find((v: any) => v.key === vKey)?.example || "N/A"} value={variableMappings[vKey] || ""} onChange={(val) => setVariableMappings((prev) => ({ ...prev, [vKey]: val }))} mappingOptions={facebookFieldOptions} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center bg-slate-50/30 dark:bg-slate-900/30 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-400 italic">{'Enable "First Message Automation" to send a template automatically when a lead is received.'}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Tags Section */}
          <Card className="border-none shadow-sm dark:bg-(--card-color) overflow-hidden sticky top-8">
            <CardHeader className="p-4.5! border-b border-slate-50 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color)">
              <div className="flex items-center gap-2">
                <Tag className="text-primary" size={20} />
                <CardTitle className="text-lg font-bold">Lead Badges</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-gray-300">Auto-assign Tags</Label>
                <MultiSelect options={tags.map((t: any) => ({ label: t.label, value: t._id, color: t.color }))} selected={selectedTagIds} onChange={setSelectedTagIds} placeholder="Select tags..." className="bg-slate-50/50 dark:bg-(--dark-body) dark:hover:bg-(--table-hover) border-slate-200 dark:border-(--card-border-color)" />
              </div>

              <div className="sm:pt-6 pt-4 border-t border-slate-100 dark:border-(--card-border-color)">
                <Button onClick={handleSave} disabled={isUpdating} className="w-full h-12 rounded-lg font-medium text-white shadow-lg shadow-primary/20 gap-2 text-base">
                  {isUpdating ? <Sparkles className="animate-spin" size={18} /> : <Save size={18} />}
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FormMapping;
