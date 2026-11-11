/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { ListChecks, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Switch } from "@/src/elements/ui/switch";

export function SendPollNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  useEffect(() => {
    if (data.options && Array.isArray(data.options)) {
      const needsUpdate = data.options.some((opt: any, i: number) => opt.value !== `opt_${i + 1}`);
      if (needsUpdate) {
        const updatedOptions = data.options.map((opt: any, i: number) => ({
          ...opt,
          value: `opt_${i + 1}`,
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        updateNodeData("options", updatedOptions);
      }
    }
  }, [data.options?.length]);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.question || !data.question.trim()) errors.push("Poll question is required");
    if (!data.options || data.options.length < 2) errors.push("At least two options are required");
    data.options?.forEach((opt: any, i: number) => {
      if (!opt.text) errors.push(`Option ${i + 1} text is required`);
    });
  }

  const addOption = () => {
    if (!touched) setTouched(true);
    const options = data.options || [];
    if (options.length < 3) {
      const newOptionIndex = options.length + 1;
      updateNodeData("options", [...options, { text: "", value: `opt_${newOptionIndex}` }]);
    }
  };

  const removeOption = (index: number) => {
    const options = data.options || [];
    const filteredOptions = options.filter((_: any, i: number) => i !== index);
    const updatedOptions = filteredOptions.map((opt: any, i: number) => ({
      ...opt,
      value: `opt_${i + 1}`,
    }));
    updateNodeData("options", updatedOptions);
  };

  const updateOption = (index: number, field: string, value: string) => {
    if (!touched) setTouched(true);
    if (field === "value") return;

    const options = data.options || [];
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    updateNodeData("options", newOptions);
  };

  return (
    <BaseNode id={id} title="Send Poll" icon={<ListChecks size={18} />} iconBgColor="bg-cyan-600" iconColor="text-white" borderColor="border-cyan-200" handleColor="bg-cyan-500!" errors={errors} showOutHandle={false}>
      <NodeField label="Poll Question" required error={(touched || data.forceValidation) && !data.question?.trim() ? "Poll question is required" : ""}>
        <Textarea placeholder="Enter your question here..." value={data.question || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("question", e.target.value)} className="min-h-20 resize-none text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg)" />
      </NodeField>

      <div className="space-y-3">
        <div className="flex flex-col space-y-1 px-1 mb-2">
          <div className="flex items-center justify-between">
            <Label className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Poll Options</Label>
            <span className="text-[10px] font-medium text-gray-400">{data.options?.length || 0} / 3</span>
          </div>
          <p className="text-[10px] text-gray-400">Max 3 options. Each becomes its own output port.</p>
        </div>

        {(data.options || []).map((opt: any, index: number) => (
          <div key={index} className="relative group rounded-lg border border-gray-100 bg-gray-50/50 p-3 pt-6 dark:bg-(--card-color) dark:border-(--card-border-color)">
            <Handle type="source" id={`src-opt-${index}`} position={Position.Right} style={{ top: "50%" }} className="w-3! h-3! bg-cyan-500! border-2! border-white! dark:border-(--card-border-color)! shadow-sm z-50" />

            <Button variant="ghost" size="icon" onClick={() => removeOption(index)} className="absolute -right-1.5 -top-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
              <X size={12} />
            </Button>
            <div className="absolute left-3 top-2 text-[10px] font-bold text-gray-400 uppercase tracking-tight">Option {index + 1}</div>

            <div className="space-y-2">
              <div>
                <Input value={opt.text} onFocus={() => setTouched(true)} onChange={(e) => updateOption(index, "text", e.target.value)} placeholder="Option text" className="h-8 text-xs bg-white dark:bg-(--page-body-bg)" maxLength={24} />
              </div>
            </div>
          </div>
        ))}

        {(!data.options || data.options.length < 3) && (
          <Button onClick={addOption} variant="outline" className="w-full h-9 border-dashed border-gray-200 text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 dark:border-dark-accent dark:text-cyan-500 dark:hover:bg-cyan-900/10 text-[11px] font-semibold">
            <Plus className="mr-1.5 h-3 w-3" /> Add Option
          </Button>
        )}
      </div>

      <div className="mt-4 border-t border-gray-100 dark:border-(--card-border-color) pt-4 px-1">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Multiple choice</Label>
            <p className="text-[10px] text-gray-400">Allow multiple answers</p>
          </div>
          <Switch 
            checked={!!data.allowMultiple} 
            onCheckedChange={(checked) => updateNodeData("allowMultiple", checked)}
            className="data-[state=checked]:bg-cyan-500"
          />
        </div>
      </div>
    </BaseNode>
  );
}
