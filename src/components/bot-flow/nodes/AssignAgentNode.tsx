/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useGetAgentDataQuery } from "@/src/redux/api/agentApi";
import { useReactFlow } from "@xyflow/react";
import { UserCheck } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function AssignAgentNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { data: agentsData, isLoading } = useGetAgentDataQuery({ limit: 1000, status: "active" });
  const agents: any[] = agentsData?.data?.agents || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.agent_id) errors.push("Agent selection is required.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)),
    );
  };

  const selectedAgent = agents.find((a) => a._id === data.agent_id);

  return (
    <BaseNode
      id={id}
      title="Assign Agent"
      icon={<UserCheck size={18} />}
      iconBgColor="bg-violet-500"
      iconColor="text-white"
      borderColor="border-violet-200"
      handleColor="bg-violet-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField
          label="Select Agent"
          required
          error={(touched || data.forceValidation) && !data.agent_id ? "Agent selection is required." : ""}
        >
          <Select
            value={data.agent_id || ""}
            onValueChange={(value) => updateNodeData("agent_id", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder={isLoading ? "Loading agents..." : "Choose an agent"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {agents.map((agent) => (
                <SelectItem key={agent._id} value={agent._id} className="dark:hover:bg-(--table-hover)">
                  {agent.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        {selectedAgent && (
          <div className="flex items-center gap-2 p-2 bg-violet-50 dark:bg-violet-900/10 rounded-md border border-violet-100 dark:border-violet-900/20">
            <div className="h-6 w-6 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
              <span className="text-white text-[10px] font-bold">{selectedAgent.name?.charAt(0).toUpperCase()}</span>
            </div>
            <p className="text-[10px] leading-tight text-violet-700 dark:text-violet-400 font-medium truncate">
              Conversations will be assigned to <strong>{selectedAgent.name}</strong>.
            </p>
          </div>
        )}

        {!selectedAgent && (
          <div className="flex items-center gap-2 p-2 bg-violet-50 dark:bg-violet-900/10 rounded-md border border-violet-100 dark:border-violet-900/20">
            <p className="text-[10px] leading-tight text-violet-600 dark:text-violet-400">
              Contacts reaching this step will be assigned to the selected agent.
            </p>
          </div>
        )}
      </div>
    </BaseNode>
  );
}
