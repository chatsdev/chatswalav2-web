/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { useReactFlow } from "@xyflow/react";
import { Database, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Label } from "@/src/elements/ui/label";

export function ResponseSaverNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const mappings = data.mappings || [];

  const updateNodeData = (newMappings: any[]) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, mappings: newMappings } }
          : node,
      ),
    );
  };

  const addMapping = () => {
    updateNodeData([...mappings, { source_path: "", custom_field_key: "" }]);
  };

  const removeMapping = (index: number) => {
    const newMappings = [...mappings];
    newMappings.splice(index, 1);
    updateNodeData(newMappings);
  };

  const updateMapping = (index: number, field: string, value: string) => {
    const newMappings = [...mappings];
    newMappings[index] = { ...newMappings[index], [field]: value };
    updateNodeData(newMappings);
  };

  return (
    <BaseNode
      id={id}
      title="Save Response"
      icon={<Database size={18} />}
      iconBgColor="bg-pink-600"
      iconColor="text-white"
      borderColor="border-pink-200"
      handleColor="bg-pink-500!"
    >
      <div className="space-y-4">
        <NodeField
          label="Data Mapping"
          description="Extract values from the API response and save them to custom fields."
        >
          <div className="space-y-3">
            {mappings.map((mapping: any, index: number) => (
              <div key={index} className="group relative space-y-2 rounded-lg border border-gray-100 bg-gray-50/50 p-3 transition-all hover:bg-white dark:border-(--card-border-color) dark:bg-(--card-color) dark:hover:bg-(--table-hover)">
                <Button
                  variant="secondary"
                  onClick={() => removeMapping(index)}
                  className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm transition-all hover:bg-red-200 group-hover:flex dark:bg-red-900/30 dark:text-red-400"
                >
                  <Trash2 size={12} />
                </Button>

                <div className="space-y-1 flex flex-col">
                  <Label className="text-[12px] font-medium text-gray-400">Source Path</Label>
                  <Input
                    placeholder="e.g. api_response.title"
                    value={mapping.source_path || ""}
                    onChange={(e) => updateMapping(index, "source_path", e.target.value)}
                    className="h-11 text-xs bg-white dark:bg-(--page-body-bg)"
                  />
                </div>

                <div className="space-y-1 flex flex-col">
                  <Label className="text-[12px] font-medium text-gray-400">Custom Field Key</Label>
                  <Input
                    placeholder="e.g. last_post_title"
                    value={mapping.custom_field_key || ""}
                    onChange={(e) => updateMapping(index, "custom_field_key", e.target.value)}
                    className="h-11 text-xs bg-white dark:bg-(--page-body-bg)"
                  />
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addMapping}
              className="w-full h-8 text-xs border-dashed border-gray-300 text-gray-500 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50 dark:border-dark-accent dark:hover:bg-pink-900/10"
            >
              <Plus size={14} className="mr-1" /> Add Mapping
            </Button>
          </div>
        </NodeField>
      </div>
    </BaseNode>
  );
}
