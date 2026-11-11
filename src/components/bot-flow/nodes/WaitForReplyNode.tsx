/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { useReactFlow } from "@xyflow/react";
import { MessageSquare } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function WaitForReplyNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.variable_name || !data.variable_name.trim()) {
      errors.push("Variable name is required to store the reply.");
    }
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

  return (
    <BaseNode
      id={id}
      title="Wait for Reply"
      icon={<MessageSquare size={18} />}
      iconBgColor="bg-amber-500"
      iconColor="text-white"
      borderColor="border-amber-200"
      handleColor="bg-amber-500!"
      errors={errors}
    >
      <NodeField 
        label="Store Reply In" 
        required 
        description="Save the user's response to this variable for use in subsequent nodes."
        error={(touched || data.forceValidation) && !data.variable_name?.trim() ? "Variable name is required." : ""}
      >
        <Input
          placeholder="e.g. user_provided_id"
          value={data.variable_name || ""}
          onFocus={() => setTouched(true)}
          onChange={(e) => updateNodeData("variable_name", e.target.value)}
          className="text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
        />
      </NodeField>
    </BaseNode>
  );
}
