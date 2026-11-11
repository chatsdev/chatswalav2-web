/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useReactFlow } from "@xyflow/react";
import { Plus, Trash2, Webhook, Zap } from "lucide-react";
import { Button } from "@/src/elements/ui/button";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function WebhookNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.url || !data.url.trim()) {
      errors.push("Webhook URL is required.");
    }
  }

  const updateNodeData = (field: string, value: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, data: { ...node.data, [field]: value } } : node)));
  };

  const getNormalizedList = (field: "headers" | "body") => {
    const value = data[field];
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "object") {
      return Object.entries(value).map(([key, val]) => ({ key, value: String(val) }));
    }
    return [];
  };

  const headersList = getNormalizedList("headers");
  const bodyList = getNormalizedList("body");

  const handleKVChange = (field: "headers" | "body", index: number, keyOrValue: "key" | "value", value: string) => {
    const list = [...getNormalizedList(field)];
    if (list[index]) {
      list[index] = { ...list[index], [keyOrValue]: value };
      updateNodeData(field, list);
    }
  };

  const addKV = (field: "headers" | "body") => {
    const list = [...getNormalizedList(field)];
    list.push({ key: "", value: "" });
    updateNodeData(field, list);
  };

  const removeKV = (field: "headers" | "body", index: number) => {
    const list = getNormalizedList(field).filter((_: any, i: number) => i !== index);
    updateNodeData(field, list);
  };

  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  return (
    <BaseNode id={id} title="Webhook" icon={<Webhook size={18} />} iconBgColor="bg-indigo-600" iconColor="text-white" borderColor="border-indigo-200" handleColor="bg-indigo-500!" errors={errors}>
      <div className="space-y-4">
        <NodeField label="Webhook URL" required error={(touched || data.forceValidation) && !data.url?.trim() ? "URL is required." : ""}>
          <Input placeholder="https://api.example.com/webhook" value={data.url || ""} onFocus={() => setTouched(true)} onChange={(e) => updateNodeData("url", e.target.value)} className="text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg)" />
        </NodeField>

        <NodeField label="HTTP Method">
          <Select value={data.method || "GET"} onValueChange={(value) => updateNodeData("method", value)}>
            <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              <SelectItem className="dark:hover:bg-(--table-hover)" value="GET">
                GET
              </SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="POST">
                POST
              </SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="PUT">
                PUT
              </SelectItem>
              <SelectItem className="dark:hover:bg-(--table-hover)" value="DELETE">
                DELETE
              </SelectItem>
            </SelectContent>
          </Select>
        </NodeField>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Headers</span>
            <Button variant="ghost" size="sm" onClick={() => addKV("headers")} className="h-6 px-2 text-[10px] font-bold text-primary hover:text-primary bg-primary/10 hover:bg-primary/10">
              <Plus size={12} className="mr-1" /> Add
            </Button>
          </div>
          <div className="space-y-2">
            {headersList.map((header: any, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <Input placeholder="Key" value={header.key} onChange={(e) => handleKVChange("headers", index, "key", e.target.value)} className="h-8 text-xs bg-gray-50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color)" />
                <Input placeholder="Value" value={header.value} onChange={(e) => handleKVChange("headers", index, "value", e.target.value)} className="h-8 text-xs bg-gray-50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color)" />
                <Button variant="ghost" size="icon" onClick={() => removeKV("headers", index)} className="h-8 w-8 text-gray-400 hover:text-red-500 shrink-0">
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            {headersList.length === 0 && <p className="text-[10px] text-gray-400 italic">No headers added</p>}
          </div>
        </div>

        {(data.method === "POST" || data.method === "PUT") && (
          <div className="space-y-3 pt-2 border-t dark:border-(--card-border-color)">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Body</span>
              <Button variant="ghost" size="sm" onClick={() => addKV("body")} className="h-6 px-2 text-[10px] font-bold text-primary hover:text-primary bg-primary/10 hover:bg-primary/10">
                <Plus size={12} className="mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {bodyList.map((b: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <Input placeholder="Key" value={b.key} onChange={(e) => handleKVChange("body", index, "key", e.target.value)} className="h-8 text-xs bg-gray-50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color)" />
                  <Input placeholder="Value" value={b.value} onChange={(e) => handleKVChange("body", index, "value", e.target.value)} className="h-8 text-xs bg-gray-50 dark:bg-(--page-body-bg) border-gray-200 dark:border-(--card-border-color)" />
                  <Button variant="ghost" size="icon" onClick={() => removeKV("body", index)} className="h-8 w-8 text-gray-400 hover:text-red-500 shrink-0">
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
              {bodyList.length === 0 && <p className="text-[10px] text-gray-400 italic">No body parameters added</p>}
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t dark:border-(--card-border-color)">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Available Variables</div>
              <div className="flex flex-wrap gap-1.5">
                {["{{message}}", "{{messageType}}", "{{senderNumber}}", "{{recipientNumber}}", "{{timestamp}}", "{{contact.name}}", "{{contact_name}}", "{{contactId}}", "{{contact.email}}", "{{contact.custom_fields.KEY}}", "{{api_status}}", "{{api_response.KEY}}", "{{webhook_status}}", "{{webhook_response.message}}"].map((variable) => (
                  <Button variant="unstyled"
                    key={variable}
                    onClick={() => {
                      navigator.clipboard.writeText(variable);
                      setCopiedVar(variable);
                      setTimeout(() => setCopiedVar(null), 2000);
                    }}
                    className={`text-[9px] px-1.5 py-0.5 rounded transition-all border ${copiedVar === variable ? "bg-primary border-primary text-white" : "bg-gray-100 dark:bg-(--page-body-bg) text-gray-600 dark:text-gray-400 hover:bg-indigo-100 hover:text-indigo-600 dark:hover:bg-(--table-hover) dark:hover:text-indigo-400 border-gray-200 dark:border-(--card-border-color)"}`}
                    title="Click to copy"
                  >
                    {copiedVar === variable ? "Copied!" : variable}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-md border border-indigo-100 dark:border-indigo-900/20 mt-4">
              <Zap size={12} className="text-indigo-500 shrink-0" />
              <p className="text-[10px] leading-tight text-indigo-600 dark:text-indigo-400">
                Tip: Use <code className="bg-indigo-100 dark:bg-indigo-800/30 px-1 rounded text-indigo-700 dark:text-indigo-300 font-bold">{"{{variable}}"}</code> syntax to map dynamic values from your flow.
              </p>
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
}
