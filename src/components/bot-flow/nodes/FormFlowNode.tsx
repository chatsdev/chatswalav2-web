/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useReactFlow } from "@xyflow/react";
import { Form, Zap } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { useGetFormsQuery } from "@/src/redux/api/formBuilderApi";
import { Textarea } from "@/src/elements/ui/textarea";

import { useAppSelector } from "@/src/redux/hooks";

export function FormFlowNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const waba_id = selectedWorkspace?.waba_id;

  const { data: formsData, isLoading } = useGetFormsQuery({ waba_id: waba_id || "", limit: 100 }, { skip: !waba_id });

  const publishedForms = formsData?.data?.filter((f: any) => f.meta_status === "PUBLISHED" || f.flow?.meta_status === "PUBLISHED") || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.form_id) {
      errors.push("Form selection is required.");
    }
    if (!data.message_body || !data.message_body.trim()) {
      errors.push("Message body is required.");
    }
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  return (
    <BaseNode id={id} title="Form Flow" icon={<Form size={18} />} iconBgColor="bg-purple-600" iconColor="text-white" borderColor="border-[var(--primary-opacity-30)]" handleColor="bg-primary!" errors={errors}>
      <div className="space-y-4">
        <NodeField label="Select Form" required error={(touched || data.forceValidation) && !data.form_id ? "Selection is required." : ""}>
          <Select value={data.form_id || ""} onValueChange={(value) => updateNodeData("form_id", value)} disabled={isLoading}>
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder={isLoading ? "Loading forms..." : "Choose a form"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {publishedForms.map((form: any) => (
                <SelectItem key={form._id} className="dark:hover:bg-(--table-hover)" value={form._id}>
                  {form.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <NodeField label="Message Body" required error={(touched || data.forceValidation) && !data.message_body?.trim() ? "Message is required." : ""}>
          <Textarea placeholder="Hello {{contact_name}}, please complete our registration form to continue." value={data.message_body || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("message_body", e.target.value)} className="text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg) min-h-20" />
        </NodeField>

        <NodeField label="Button Text">
          <Input placeholder="Start Registration" value={data.button_text || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("button_text", e.target.value)} className="text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg)" />
        </NodeField>

        <div className="flex items-center gap-2 p-2 bg-light-primary dark:bg-primary-darker/10 rounded-md border border-[var(--primary-opacity-20)] dark:border-primary-darker/20 mt-4">
          <Zap size={12} className="text-primary shrink-0" />
          <p className="text-[10px] leading-tight text-primary dark:text-primary">
            Tip: Use <code className="bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 px-1 rounded text-primary-dark dark:text-emerald-300 font-bold">{"{{variable}}"}</code> syntax to map dynamic values from your flow.
          </p>
        </div>
      </div>
    </BaseNode>
  );
}
