/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Textarea } from "@/src/elements/ui/textarea";
import { useReactFlow } from "@xyflow/react";
import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function TextMessageNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.message || !data.message.trim()) errors.push("The message body must contain text before saving.");
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
      title="Send Message"
      icon={<MessageSquareText size={18} />}
      iconBgColor="bg-indigo-400"
      iconColor="text-white"
      borderColor="border-indigo-200"
      handleColor="bg-indigo-500!"
      errors={errors}
    >
      <NodeField label="Response Body" required error={(touched || data.forceValidation) && !data.message?.trim() ? "Response text is required." : ""}>
        <Textarea
          placeholder="Compose your automated response..."
          value={data.message || ""}
          onFocus={() => setTouched(true)}
          onChange={(e) => updateNodeData("message", e.target.value)}
          className="min-h-25 resize-none text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg)"
        />
      </NodeField>
    </BaseNode>
  );
}
