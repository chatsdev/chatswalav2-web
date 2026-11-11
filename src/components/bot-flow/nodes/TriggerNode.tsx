/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { entryTriggerOptions } from "@/src/data/botFlow";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { cn } from "@/src/lib/utils";
import { useReactFlow } from "@xyflow/react";
import {
  Info,
  PlayCircle,
  Plus,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";

export function TriggerNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [keyword, setKeyword] = useState("");
  const keywordsArray = Array.isArray(data.keywords) ? data.keywords : [];
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

  useEffect(() => {
    if (!data.contactType) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      updateNodeData("contactType", "Contact");
    }
  }, [data.contactType]);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.triggerType) errors.push("Selection is required.");
    if (
      data.triggerType !== "any message" &&
      data.triggerType !== "order received" &&
      (!keywordsArray || keywordsArray.length === 0)
    ) {
      errors.push("Keyword list cannot be empty for this rule.");
    }
  }

  const addKeyword = () => {
    if (keyword.trim()) {
      const currentKeywords = Array.isArray(data.keywords) ? data.keywords : [];
      if (!currentKeywords.includes(keyword.trim())) {
        updateNodeData("keywords", [...currentKeywords, keyword.trim()]);
      }
      setKeyword("");
    }
  };

  const removeKeyword = (kw: string) => {
    const currentKeywords = Array.isArray(data.keywords) ? data.keywords : [];
    updateNodeData(
      "keywords",
      currentKeywords.filter((k: string) => k !== kw),
    );
  };

  return (
    <BaseNode
      id={id}
      title="Automation Entry"
      icon={<PlayCircle size={18} />}
      iconBgColor="bg-indigo-500"
      iconColor="text-white"
      borderColor="border-indigo-500"
      handleColor="bg-indigo-500!"
      errors={errors}
      showInHandle={false}
      headerRight={
        <Badge
          variant="secondary"
          className="bg-white/20 text-white border-none hover:bg-white/30 text-[10px] h-4 px-1.5 backdrop-blur-sm"
        >
          Activation Root
        </Badge>
      }
    >
      <NodeField
        label="Activation Method"
        required
        error={
          (touched || data.forceValidation) && !data.triggerType
            ? "Please select a rule"
            : ""
        }
      >
        <div className="grid grid-cols-2 gap-2 mt-1">
          {entryTriggerOptions.map((rule) => (
            <Button
              key={rule.value}
              type="button"
              variant="outline"
              onClick={() => updateNodeData("triggerType", rule.value)}
              className={cn(
                "flex flex-col items-center justify-center h-[82px]! p-2 rounded-lg transition-all duration-300 border relative group overflow-hidden",
                data.triggerType === rule.value
                  ? "border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/20 shadow-sm"
                  : "border-gray-100 bg-gray-50/50 hover:border-gray-200 dark:border-(--card-border-color) dark:bg-white/5 dark:hover:bg-(--table-hover) dark:hover:border-(--card-border-color)",
              )}
            >
              <div
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition-transform group-active:scale-90",
                  data.triggerType === rule.value
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-400 dark:bg-white/5",
                )}
              >
                {rule.icon}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold mt-1.5 transition-colors",
                  data.triggerType === rule.value
                    ? "text-indigo-500"
                    : "text-gray-500 dark:text-gray-400",
                )}
              >
                {rule.label}
              </span>
            </Button>
          ))}
        </div>
      </NodeField>

      {data.triggerType !== "any message" &&
        data.triggerType !== "order received" && (
          <>
            <NodeField
              label="Activation Phrases"
              required
              description="Initiates when any of these exact phrases are sent."
              error={
                (touched || data.forceValidation) &&
                data.triggerType !== "any message" &&
                data.triggerType !== "order received" &&
                (!keywordsArray || keywordsArray.length === 0)
                  ? "Required"
                  : ""
              }
            >
              <div className="flex gap-2">
                <Input
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onFocus={() => setTouched(true)}
                  onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                  placeholder="Add keyword..."
                  className={`h-9 text-sm bg-(--input-color) dark:focus:bg-(--page-body-bg) focus:bg-(--input-color) ${!data.keywords || data.keywords.length === 0 ? "border-gray-200 dark:border-(--card-border-color)" : ""}`}
                />
                <Button
                  onClick={addKeyword}
                  size="icon"
                  className="h-9 w-9 bg-indigo-500 hover:bg-indigo-500 dark:text-white rounded-lg"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {keywordsArray.length > 0 ? (
                  keywordsArray.map((kw: string) => (
                    <Badge
                      key={kw}
                      variant="secondary"
                      className="flex items-center gap-1.5 bg-indigo-50/50 dark:bg-(--dark-sidebar) dark:border-(--card-border-color) dark:hover:bg-(--table-hover) text-indigo-500 border-indigo-100 rounded-lg px-2 py-1 transition-all hover:pr-1 group/badge animate-in fade-in zoom-in duration-300"
                    >
                      {kw}
                      <div className="flex overflow-hidden w-0 group-hover/badge:w-4 transition-all opacity-0 group-hover/badge:opacity-100">
                        <X
                          size={12}
                          className="cursor-pointer hover:text-red-500"
                          onClick={() => removeKeyword(kw)}
                        />
                      </div>
                    </Badge>
                  ))
                ) : (
                  <div className="w-full py-4 border border-dashed dark:bg-(--dark-sidebar) dark:border-(--card-border-color) border-gray-100 rounded-lg flex flex-col items-center justify-center bg-gray-50/30">
                    <Info size={14} className="text-gray-300 mb-1" />
                    <span className="text-[10px] text-gray-300 font-medium">
                      No phrases set
                    </span>
                  </div>
                )}
              </div>
            </NodeField>
          </>
        )}
    </BaseNode>
  );
}
