/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { useReactFlow } from "@xyflow/react";
import { Tag } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function AddTagNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.tag_name || !data.tag_name.trim()) errors.push("Tag name is required.");
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
      title="Assign Tag"
      icon={<Tag size={18} />}
      iconBgColor="bg-orange-400"
      iconColor="text-white"
      borderColor="border-orange-200"
      handleColor="bg-orange-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField label="Step Name" description="Identify this step in your flow report.">
          <Input
            placeholder="e.g. Assign VIP Tag"
            value={data.name || ""}
            onChange={(e) => updateNodeData("name", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

        <NodeField
          label="Tag Name"
          required
          error={(touched || data.forceValidation) && !data.tag_name ? "Tag name is required." : ""}
        >
          <Input
            placeholder="e.g. High Value Customer"
            value={data.tag_name || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("tag_name", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>
      </div>
    </BaseNode>
  );
}
