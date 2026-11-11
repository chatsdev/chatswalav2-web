/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { NODETEMPLATES } from "@/src/data/SidebarList";
import { AlertCircle } from "lucide-react";

import { BaseNode } from "./BaseNode";

export function GenericNode({ data, id }: any) {
  const template = NODETEMPLATES.find((t) => t.id === data.nodeType);
  const icon = template?.icon || <AlertCircle size={18} />;

  return (
    <BaseNode
      id={id}
      title={data.label || "Component"}
      icon={icon}
      iconBgColor="bg-gray-100"
      iconColor="text-gray-600"
      borderColor="border-gray-200"
      handleColor="bg-gray-400!"
    >
      <div className="py-2">
        <p className="text-xs text-gray-500 italic">
          {data.description || "This component has no configurable properties."}
        </p>
      </div>
    </BaseNode>
  );
}
