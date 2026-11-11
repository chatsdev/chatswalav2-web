/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Switch } from "@/src/elements/ui/switch";
import { useGetChatbotsQuery } from "@/src/redux/api/chatbotApi";
import { useAppSelector } from "@/src/redux/hooks";
import { useReactFlow } from "@xyflow/react";
import { BotMessageSquare } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function AssignChatbotNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const waba_id = selectedWorkspace?.waba_id;

  const { data: chatbotsData, isLoading } = useGetChatbotsQuery(
    { waba_id: waba_id || "" },
    { skip: !waba_id }
  );

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.chatbot_id) errors.push("Selection of a chatbot is required.");
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
      title="Assign Chatbot"
      icon={<BotMessageSquare size={18} />}
      iconBgColor="bg-indigo-800"
      iconColor="text-white"
      borderColor="border-indigo-200"
      handleColor="bg-indigo-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField label="Step Name" description="Identify this step in your flow report.">
          <Input
            placeholder="e.g. Assign AI Support"
            value={data.name || ""}
            onChange={(e) => updateNodeData("name", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>
        <NodeField
          label="Select Chatbot"
          required
          error={(touched || data.forceValidation) && !data.chatbot_id ? "Chatbot is required." : ""}
        >
          <Select
            value={data.chatbot_id || ""}
            onValueChange={(value) => updateNodeData("chatbot_id", value)}
            disabled={isLoading || !waba_id}
          >
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder={isLoading ? "Loading chatbots..." : "Choose a chatbot"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {chatbotsData?.data?.map((chatbot: any) => (
                <SelectItem key={chatbot._id} value={chatbot._id} className="dark:hover:bg-(--table-hover)">
                  {chatbot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <NodeField label="Session Duration (Hours)" description="Auto-release after this time (0 = No limit)">
          <Input
            type="number"
            min="0"
            placeholder="e.g. 24"
            value={data.duration_hours || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("duration_hours", e.target.value)}
            className="text-sm bg-gray-50 border-gray-200 focus:bg-gray-50 dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
          />
        </NodeField>

      </div>
    </BaseNode>
  );
}
