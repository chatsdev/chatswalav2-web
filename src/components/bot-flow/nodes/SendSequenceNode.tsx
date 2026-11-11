/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useGetSequencesQuery } from "@/src/redux/api/sequenceApi";
import { useReactFlow } from "@xyflow/react";
import { ListOrdered } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { useAppSelector } from "@/src/redux/hooks";

export function SendSequenceNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const waba_id = selectedWorkspace?.waba_id;

  const { data: sequencesData, isLoading } = useGetSequencesQuery(
    { 
      waba_id: waba_id || "",
      ...(data.platform && data.platform !== "all" ? { platform: data.platform } : {})
    },
    { skip: !waba_id }
  );
  const sequences: any[] = sequencesData?.data || [];
  const filteredSequences = sequences.filter((s: any) => {
    const nodePlatform = data.platform;
    if (!nodePlatform || nodePlatform === "all") return true;
    if (nodePlatform === "whatsapp") {
      return !s.platform || s.platform === "whatsapp";
    }
    return s.platform === nodePlatform;
  });

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.sequence_id) errors.push("Sequence selection is required.");
  }
  
  if (data.platform === "all") {
    errors.push("Send Sequence is not available for omnichannel (All) flows.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)),
    );
  };

  const selectedSequence = sequences.find((s) => s._id === data.sequence_id);

  return (
    <BaseNode
      id={id}
      title="Send Sequence"
      icon={<ListOrdered size={18} />}
      iconBgColor="bg-rose-600"
      iconColor="text-white"
      borderColor={data.platform === "all" ? "border-red-200" : "border-rose-200"}
      handleColor={data.platform === "all" ? "bg-red-500!" : "bg-rose-500!"}
      errors={errors}
    >
      <div className="space-y-4">
        {data.platform === "all" ? (
          <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-900/30">
            <p className="text-xs text-red-600 dark:text-red-400">
              Sequence enrollment is not supported in omnichannel flows. Please change the flow channel or remove this node.
            </p>
          </div>
        ) : (
          <>
            <NodeField
              label="Select Sequence"
              required
              error={(touched || data.forceValidation) && !data.sequence_id ? "Sequence selection is required." : ""}
            >
              <Select
                value={data.sequence_id || ""}
                onValueChange={(value) => updateNodeData("sequence_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
                  <SelectValue placeholder={isLoading ? "Loading sequences..." : "Choose a sequence"} />
                </SelectTrigger>
                <SelectContent className="dark:bg-(--card-color)">
                  {filteredSequences.map((seq) => (
                    <SelectItem key={seq._id} value={seq._id} className="dark:hover:bg-(--table-hover)">
                      {seq.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </NodeField>

            {selectedSequence && (
              <div className="flex items-center gap-2 p-2 bg-rose-50 dark:bg-rose-900/10 rounded-md border border-rose-100 dark:border-rose-900/20">
                <p className="text-[10px] leading-tight text-rose-700 dark:text-rose-400 font-medium truncate">
                  Contacts will be enrolled in sequence: <strong>{selectedSequence.name}</strong>.
                </p>
              </div>
            )}

            {!selectedSequence && (
              <div className="flex items-center gap-2 p-2 bg-rose-50 dark:bg-rose-900/10 rounded-md border border-rose-100 dark:border-rose-900/20">
                <p className="text-[10px] leading-tight text-rose-600 dark:text-rose-400">
                  Contacts reaching this step will be enrolled in the selected sequence.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </BaseNode>
  );
}
