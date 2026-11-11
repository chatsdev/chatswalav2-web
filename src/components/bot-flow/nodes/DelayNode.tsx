/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { useReactFlow } from "@xyflow/react";
import { Clock } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function DelayNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

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

  const delayMs = data.delay_ms !== undefined && data.delay_ms !== null ? data.delay_ms : 1000;
  const displaySec = typeof delayMs === "number" ? (delayMs / 1000).toFixed(1) : "0.0";

  return (
    <BaseNode
      id={id}
      title="Wait Timer"
      icon={<Clock size={18} />}
      iconBgColor="bg-primary-darker"
      iconColor="text-white"
      borderColor="border-[var(--primary-opacity-30)]"
      handleColor="bg-primary!"
    >
      <NodeField label="Wait Duration (ms)">
        <div className="flex items-center gap-3">
          <Input
            type="number"
            value={delayMs}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("delay_ms", e.target.value === "" ? "" : parseInt(e.target.value))}
            className="h-10 text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
            min={0}
            step={1000}
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-tight leading-none mb-0.5">Duration</span>
            <span className="text-xs text-gray-500 font-medium leading-none">{displaySec}s</span>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-gray-400 italic">This will pause the execution of the next step</p>
      </NodeField>
    </BaseNode>
  );
}
