/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useReactFlow } from "@xyflow/react";
import { Users } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { useGetSegmentsQuery } from "@/src/redux/api/segmentApi";

export function AddSegmentNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { data: segmentsData, isLoading } = useGetSegmentsQuery({ limit: 100 });

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.segment_id) {
      errors.push("Segment selection is required.");
    }
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  return (
    <BaseNode id={id} title="Add to Segment" icon={<Users size={18} />} iconBgColor="bg-blue-600" iconColor="text-white" borderColor="border-blue-200" handleColor="bg-blue-500!" errors={errors}>
      <div className="space-y-4">
        <NodeField label="Select Segment" required error={(touched || data.forceValidation) && !data.segment_id ? "Selection is required." : ""}>
          <Select value={data.segment_id || ""} onValueChange={(value) => updateNodeData("segment_id", value)} disabled={isLoading}>
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder={isLoading ? "Loading segments..." : "Choose a segment"} />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              {segmentsData?.data?.segments?.map((segment: any) => (
                <SelectItem key={segment._id} className="dark:hover:bg-(--table-hover)" value={segment._id}>
                  {segment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </NodeField>

        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-900/20 mt-4">
          <p className="text-[10px] leading-tight text-blue-600 dark:text-blue-400">Contacts reaching this step will be automatically added to the selected segment.</p>
        </div>
      </div>
    </BaseNode>
  );
}
