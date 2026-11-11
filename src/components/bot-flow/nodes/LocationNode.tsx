/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { useReactFlow } from "@xyflow/react";
import { Map as MapIcon, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function LocationNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.lat || !data.lng) errors.push("Please enter coordinates to continue.");
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  return (
    <BaseNode
      id={id}
      title="Send Location"
      icon={<Navigation size={18} />}
      iconBgColor="bg-violet-600"
      iconColor="text-white"
      borderColor="border-violet-200"
      handleColor="bg-violet-500!"
      errors={errors}
      showOutHandle={false}
    >

      <div className="grid grid-cols-2 gap-2 mt-1">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color) transition-all duration-200 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10">
          <MapPin size={12} className="text-violet-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Lat</span>
            <Input
              type="number"
              value={data.lat || ""}
              onChange={(e) => updateNodeData("lat", parseFloat(e.target.value))}
              placeholder="0.00"
              className="bg-gray-300 dark:bg-(--card-color) border-none! text-[11px] font-bold w-full focus:outline-none focus:ring-0 shadow-none!"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color) transition-all duration-200 focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-500/10">
          <MapIcon size={12} className="text-violet-500 shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">Lng</span>
            <Input
              type="number"
              value={data.lng || ""}
              onChange={(e) => updateNodeData("lng", parseFloat(e.target.value))}
              placeholder="0.00"
              className="bg-gray-300 dark:bg-(--card-color) border-none! text-[11px] font-bold w-full focus:outline-none focus:ring-0 shadow-none!"
            />
          </div>
        </div>
      </div>

      <NodeField label="Identity & Descriptive Address">
        <div className="space-y-2">
          <Input
            value={data.name || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("name", e.target.value)}
            placeholder="Label (e.g. My Business)"
            className="h-9 text-[11px] font-bold bg-white border-gray-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color) rounded-lg focus-visible:ring-violet-500/20 focus-visible:border-violet-500"
          />
          <Textarea
            value={data.address || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("address", e.target.value)}
            placeholder="Detailed address content..."
            className="min-h-17.5 resize-none text-[11px] leading-relaxed bg-white border-gray-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color) rounded-lg focus-visible:ring-violet-500/20 focus-visible:border-violet-500"
          />
        </div>
      </NodeField>
    </BaseNode>
  );
}
