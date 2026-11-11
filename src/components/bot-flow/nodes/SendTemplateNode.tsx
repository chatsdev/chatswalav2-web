/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Input } from "@/src/elements/ui/input";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useReactFlow } from "@xyflow/react";
import { LayoutTemplate } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function SendTemplateNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const waba_id = selectedWorkspace?.waba_id;

  const { data: templatesData, isLoading } = useGetTemplatesQuery(
    { 
      waba_id: waba_id || "", 
      status: "approved",
      ...(data.platform && data.platform !== "all" ? { platform: data.platform } : {})
    },
    { skip: !waba_id },
  );

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.template_id) errors.push("Selection of a template is required.");
  }

  const updateNodeData = (field: string, value: string) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node,
      ),
    );
  };

  const templates = templatesData?.data || [];
  const filteredTemplates = templates.filter((t: any) => {
    const nodePlatform = data.platform;
    if (!nodePlatform || nodePlatform === "all") return true;
    if (nodePlatform === "whatsapp") {
      return !t.platform || t.platform === "whatsapp";
    }
    return t.platform === nodePlatform;
  });

  const selectedTemplate = templatesData?.data?.find(
    (t: any) => t._id === data.template_id,
  );

  return (
    <BaseNode
      id={id}
      title="Send Template"
      icon={<LayoutTemplate size={18} />}
      iconBgColor="bg-sky-400"
      iconColor="text-white"
      borderColor="border-sky-200"
      handleColor="bg-sky-500!"
      errors={errors}
    >
      <NodeField label="Step Name" description="Identify this step in your flow report.">
        <Input
          placeholder="e.g. Send Appointment Reminder"
          value={data.name || ""}
          onChange={(e) => updateNodeData("name", e.target.value)}
          className="text-sm bg-gray-50 border-gray-200 focus:bg-bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
        />
      </NodeField>
      <NodeField
        label="Template"
        required
        error={
          (touched || data.forceValidation) && !data.template_id
            ? "Template is required."
            : ""
        }
      >
        <Select
          value={data.template_id || ""}
          onValueChange={(value) => {
            const template = templatesData?.data?.find(
              (t: any) => t._id === value,
            );
            if (template) {
              updateNodeData("template_id", value);
              // Also store name for easier reference if needed
              setNodes((nds) =>
                nds.map((node) =>
                  node.id === id
                    ? {
                      ...node,
                      data: {
                        ...node.data,
                        template_id: value,
                        template_name: template.template_name,
                        language_code: template.language,
                      },
                    }
                    : node,
                ),
              );
            }
          }}
          disabled={isLoading || !waba_id}
        >
          <SelectTrigger className=" text-sm bg-gray-50 border-gray-200 focus:bg-bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
            <SelectValue
              placeholder={
                isLoading ? "Loading templates..." : "Choose a template"
              }
            />
          </SelectTrigger>
          <SelectContent className="dark:bg-(--card-color) max-w-[450px]">
            {filteredTemplates.map((template: any) => (
              <SelectItem
                key={template._id}
                value={template._id}
                className="dark:hover:bg-(--table-hover) break-all whitespace-normal line-clamp-2"
              >
                {template.template_name} ({template.language})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </NodeField>

      {selectedTemplate && (
        <div className="space-y-3 pt-2 border-t dark:border-(--card-border-color)">
          <div className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Template Variables
          </div>

          {(() => {
            const bodyVars = selectedTemplate.body_variables || selectedTemplate.variables || [];
            let varsToRender: any[] = bodyVars;

            // Fallback: If no variables provided in structured format, try parsing message_body for {{n}}
            if (!varsToRender.length && selectedTemplate.message_body) {
              const regex = /{{(\d+)}}/g;
              const matches = Array.from(selectedTemplate.message_body.matchAll(regex));
              if (matches.length > 0) {
                // Get unique indices
                const indices = Array.from(new Set(matches.map(m => m[1]))).sort((a, b) => Number(a) - Number(b));
                varsToRender = indices.map(idx => ({ key: idx }));
              }
            }

            if (!varsToRender.length) {
              return <div className="text-[10px] text-gray-400 italic">No variables found in this template.</div>;
            }

            return varsToRender.map((v: any, index: number) => {
              const varKey = v.key || (index + 1).toString();
              return (
                <NodeField
                  key={index}
                  label={`Variable {{${varKey}}}`}
                  description={v.example ? `Example: ${v.example}` : ""}
                >
                  <Input
                    placeholder="e.g. {{variable_name}} or fixed text"
                    value={data.body_variables?.[varKey] || ""}
                    onChange={(e: any) => {
                      const currentVars = { ...(data.body_variables || {}) };
                      currentVars[varKey] = e.target.value;
                      updateNodeData("body_variables", currentVars);
                    }}
                    className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
                  />
                </NodeField>
              );
            });
          })()}

          <div className="mt-2 text-[10px] text-gray-500 dark:text-gray-400 italic">
            Type: {selectedTemplate.template_type} | Category:{" "}
            {selectedTemplate.category}
          </div>
        </div>
      )}
    </BaseNode>
  );
}
