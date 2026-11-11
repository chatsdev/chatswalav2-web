/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useGetFunnelsQuery, useGetFunnelByIdQuery } from "@/src/redux/api/kanbanFunnelApi";
import { useReactFlow } from "@xyflow/react";
import { MoveRight } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function MoveToPipelineStageNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { data: funnelsResponse, isLoading: funnelsLoading } = useGetFunnelsQuery({ limit: 100, funnelType: "contact" });
  const funnels = funnelsResponse?.data || [];

  const { data: funnelDetailsResponse, isLoading: funnelDetailsLoading } = useGetFunnelByIdQuery(data.funnel_id, {
    skip: !data.funnel_id,
  });
  const stages = funnelDetailsResponse?.data?.stages || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.funnel_id) errors.push("Funnel selection is required.");
    if (!data.stage_id) errors.push("Stage selection is required.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          const newData = { ...node.data, [field]: value };
          if (field === "funnel_id") {
            newData.stage_id = ""; // Reset stage when funnel changes
          }
          return { ...node, data: newData };
        }
        return node;
      }),
    );
  };

  return (
    <BaseNode
      id={id}
      title="Move to Contact Pipeline Stage"
      icon={<MoveRight size={18} />}
      iconBgColor="bg-blue-500"
      iconColor="text-white"
      borderColor="border-blue-200"
      handleColor="bg-blue-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField
          label="Select Kanban Funnel"
          required
          error={(touched || data.forceValidation) && !data.funnel_id ? "Funnel selection is required." : ""}
        >
          <Select
            value={data.funnel_id || ""}
            onValueChange={(value) => updateNodeData("funnel_id", value)}
            disabled={funnelsLoading}
          >
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder={funnelsLoading ? "Loading funnels..." : "Choose a funnel"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {funnels.map((funnel: any) => (
                <SelectItem key={funnel._id} value={funnel._id} className="dark:hover:bg-(--table-hover)">
                  {funnel.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <NodeField
          label="Select Stage"
          required
          error={(touched || data.forceValidation) && !data.stage_id ? "Stage selection is required." : ""}
        >
          <Select
            value={data.stage_id || ""}
            onValueChange={(value) => updateNodeData("stage_id", value)}
            disabled={!data.funnel_id || funnelDetailsLoading}
          >
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder={funnelDetailsLoading ? "Loading stages..." : "Choose a stage"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {stages.map((stage: any) => (
                <SelectItem key={stage._id} value={stage._id} className="dark:hover:bg-(--table-hover)">
                  {stage.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>
      </div>
    </BaseNode>
  );
}
