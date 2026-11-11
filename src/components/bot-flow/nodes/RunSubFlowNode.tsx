/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useReactFlow } from "@xyflow/react";
import { Workflow, Zap } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { useGetAutomationFlowsQuery } from "@/src/redux/api/automationApi";
import { useParams } from "next/navigation";
import { useAppSelector } from "@/src/redux/hooks";

export function RunSubFlowNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);
  const params = useParams();
  const currentFlowId = params?.id as string;

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const workspace_id = selectedWorkspace?._id;

  const currentPlatform = data.platform || "all";

  const { data: flowsData, isLoading } = useGetAutomationFlowsQuery(
    { workspace_id, limit: 100, platform: currentPlatform },
    { skip: !workspace_id }
  );

  const availableFlows =
    flowsData?.data?.filter(
      (f: any) => f.is_active && !f.is_paused && f._id !== currentFlowId
    ) || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.sub_flow_id) {
      errors.push("Sub Flow selection is required.");
    }
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node
      )
    );
  };

  return (
    <BaseNode
      id={id}
      title="Run Sub Flow"
      icon={<Workflow size={18} />}
      iconBgColor="bg-cyan-600"
      iconColor="text-white"
      borderColor="border-cyan-200"
      handleColor="bg-cyan-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField
          label="Select Published Flow"
          required
          error={
            (touched || data.forceValidation) && !data.sub_flow_id
              ? "Selection is required."
              : ""
          }
        >
          <Select
            value={data.sub_flow_id || ""}
            onValueChange={(value) => updateNodeData("sub_flow_id", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue
                placeholder={isLoading ? "Loading flows..." : "Choose a flow"}
              />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {availableFlows.map((flow: any) => (
                <SelectItem
                  key={flow._id}
                  className="dark:hover:bg-(--table-hover)"
                  value={flow._id}
                >
                  {flow.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <div className="flex items-center gap-2 p-2 bg-cyan-50 dark:bg-cyan-900/10 rounded-md border border-cyan-100 dark:border-cyan-900/20 mt-4">
          <Zap size={12} className="text-cyan-500 shrink-0" />
          <p className="text-[10px] leading-tight text-cyan-600 dark:text-cyan-400">
            Tip: Only active flows matching the current channel ({currentPlatform}) are shown.
          </p>
        </div>
      </div>
    </BaseNode>
  );
}
