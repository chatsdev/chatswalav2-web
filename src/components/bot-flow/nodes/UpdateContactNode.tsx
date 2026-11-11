/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { STATIC_FIELDS } from "@/src/data/botFlow";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { useReactFlow } from "@xyflow/react";
import { Plus, Trash2, User, UserRoundPen, Zap } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";

export function UpdateContactNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const { data: customFieldsData } = useGetCustomFieldsQuery({ limit: 100 });

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.updates || data.updates.length === 0) {
      errors.push("At least one field update is required.");
    } else {
      data.updates.forEach((update: any) => {
        if (!update.field_key) errors.push("Field key is required.");
        if (!update.value) errors.push("Value is required.");
      });
    }
  }

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

  const handleUpdateChange = (
    index: number,
    field: "field_key" | "value",
    value: string,
  ) => {
    const list = [...(data.updates || [])];
    if (list[index]) {
      list[index] = { ...list[index], [field]: value };
      updateNodeData("updates", list);
    }
  };

  const addUpdate = () => {
    const list = [...(data.updates || [])];
    list.push({ field_key: "", value: "" });
    updateNodeData("updates", list);
  };

  const removeUpdate = (index: number) => {
    const list = (data.updates || []).filter(
      (_: any, i: number) => i !== index,
    );
    updateNodeData("updates", list);
  };

  return (
    <BaseNode
      id={id}
      title="Update Contact"
      icon={<UserRoundPen size={18} />}
      iconBgColor="bg-lime-600"
      iconColor="text-white"
      borderColor="border-lime-200"
      handleColor="bg-lime-500!"
      errors={errors}
    >
      <div className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Field Mappings
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={addUpdate}
              className="h-6 px-2 text-[10px] font-bold text-primary bg-primary/10 hover:text-primary hover:bg-primary/10"
            >
              <Plus size={12} className="mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-4">
            {(data.updates || []).map((update: any, index: number) => (
              <div
                key={index}
                className="space-y-2 p-2 bg-gray-50 dark:bg-(--card-color) rounded-md border border-gray-100 dark:border-(--card-border-color)"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <Select
                      value={update.field_key}
                      onValueChange={(value) =>
                        handleUpdateChange(index, "field_key", value)
                      }
                    >
                      <SelectTrigger className="h-10 text-xs bg-white dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color)">
                        <SelectValue placeholder="Select contact field..." />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-(--card-color)">
                        {STATIC_FIELDS.map((field) => (
                          <SelectItem
                            key={field.value}
                            value={field.value}
                            className="text-xs dark:hover:bg-(--table-hover) py-2"
                          >
                            <div className="flex items-center gap-2">
                              <User size={14} className="text-gray-400" />
                              <span>{field.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                        {(customFieldsData?.data?.fields || []).map(
                          (field: any) => (
                            <SelectItem
                              key={field._id}
                              value={field.name}
                              className="text-xs py-2"
                            >
                              <div className="flex items-center gap-2">
                                <User size={14} className="text-gray-400" />
                                <span>CF: {field.name}</span>
                              </div>
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeUpdate(index)}
                    className="h-8 w-8 text-gray-400 hover:text-red-500 shrink-0"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
                <Input
                  placeholder="Value (e.g. {{contact_name}})"
                  value={update.value}
                  onChange={(e) =>
                    handleUpdateChange(index, "value", e.target.value)
                  }
                  className="h-8 text-xs bg-white dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color)"
                />
              </div>
            ))}
            {(!data.updates || data.updates.length === 0) && (
              <p className="text-[10px] text-gray-400 italic text-center py-2">
                No field updates added
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 mt-4 pt-4 border-t dark:border-(--card-border-color)">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Available Variables
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[
              "{{message}}",
              "{{senderNumber}}",
              "{{recipientNumber}}",
              "{{contact.name}}",
              "{{contact_name}}",
              "{{contact.email}}",
              "{{api_response.KEY}}",
              "{{webhook_response.KEY}}",
            ].map((variable) => (
              <Button variant="unstyled"
                key={variable}
                onClick={() => {
                  navigator.clipboard.writeText(variable);
                  setCopiedVar(variable);
                  setTimeout(() => setCopiedVar(null), 2000);
                }}
                className={`text-[9px] px-1.5 py-0.5 rounded transition-all border ${copiedVar === variable ? "bg-primary border-primary text-white" : "bg-gray-100 dark:bg-(--page-body-bg) text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-(--table-hover) dark:hover:text-blue-400 border-gray-200 dark:border-(--card-border-color)"}`}
                title="Click to copy"
              >
                {copiedVar === variable ? "Copied!" : variable}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-md border border-blue-100 dark:border-blue-900/20 mt-4">
          <Zap size={12} className="text-blue-500 shrink-0" />
          <p className="text-[10px] leading-tight text-blue-600 dark:text-blue-400">
            Tip: Use{" "}
            <code className="bg-blue-100 dark:bg-blue-800/30 px-1 rounded text-blue-700 dark:text-blue-300 font-bold">
              {"{{variable}}"}
            </code>{" "}
            syntax to map dynamic values.
          </p>
        </div>
      </div>
    </BaseNode>
  );
}
