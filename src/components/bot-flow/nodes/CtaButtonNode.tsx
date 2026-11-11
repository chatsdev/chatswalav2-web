/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { useReactFlow } from "@xyflow/react";
import { Zap } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function CtaButtonNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.text || !data.text.trim()) errors.push("Message text is required.");
    if (!data.button_text || !data.button_text.trim()) errors.push("Button label is required.");
    if (!data.url || !data.url.trim()) errors.push("URL link is required.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, [field]: value } }
          : node,
      ),
    );
  };

  return (
    <BaseNode
      id={id}
      title="Call to Action"
      icon={<Zap size={18} />}
      iconBgColor="bg-sky-600"
      iconColor="text-white"
      borderColor="border-sky-200"
      handleColor="bg-sky-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField label="Step Name" description="Identify this step in your flow report.">
          <Input
            placeholder="e.g. Send Launch Portal"
            value={data.name || ""}
            onChange={(e) => updateNodeData("name", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>
        <NodeField
          label="Message Body"
          required
          error={
            (touched || data.forceValidation) && !data.text
              ? "Text is required."
              : ""
          }
        >
          <Textarea
            placeholder="Main message text..."
            value={data.text || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("text", e.target.value)}
            className="min-h-20 resize-none text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <NodeField
          label="Button Name"
          required
          error={
            (touched || data.forceValidation) && !data.button_text
              ? "Button name is required."
              : ""
          }
        >
          <Input
            placeholder="e.g. Visit Website"
            value={data.button_text || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("button_text", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
            maxLength={20}
          />
        </NodeField>

        <NodeField
          label="URL"
          required
          error={
            (touched || data.forceValidation) && !data.url
              ? "URL is required."
              : ""
          }
        >
          <Input
            placeholder="https://example.com"
            value={data.url || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("url", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <div className="pt-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Preview
          </span>
          <div className="mt-2 p-3 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 text-center dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
            <p className="text-[11px] text-gray-600 mb-2 truncate dark:text-gray-400">
              {data.text || "Compose your message..."}
            </p>
            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary h-8 text-[11px] font-bold text-white shadow-sm transition-all active:scale-95"
            >
              {data.button_text || "Visit our site"}
            </Button>
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
