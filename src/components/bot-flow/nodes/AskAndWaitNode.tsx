/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Textarea } from "@/src/elements/ui/textarea";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/src/elements/ui/select";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { MessageCircleQuestion, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Label } from "@/src/elements/ui/label";

export function AskAndWaitNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});

  const expectedAnswers = data.expected_answers || [];
  const validation = data.validation || { type: "none" };

  useEffect(() => {
    // Ensure fallback_route is set correctly if empty
    if (!data.fallback_route) {
       updateNodeData("fallback_route", "fallback");
    }
  }, []);

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.message || !data.message.trim()) errors.push("The question message is required.");
    if (!data.variable_name || !data.variable_name.trim()) errors.push("Variable name is required.");
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

  const addAnswer = () => {
    const newId = `ans_${Date.now()}`;
    updateNodeData("expected_answers", [
      ...expectedAnswers,
      {
        id: newId,
        value: "",
        route: newId,
      },
    ]);
  };

  const removeAnswer = (index: number) => {
    const newAnswers = [...expectedAnswers];
    newAnswers.splice(index, 1);
    updateNodeData("expected_answers", newAnswers);
  };

  const updateAnswer = (index: number, field: string, value: any) => {
    const newAnswers = [...expectedAnswers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    updateNodeData("expected_answers", newAnswers);
  };

  return (
    <BaseNode
      id={id}
      title="Ask and Wait"
      icon={<MessageCircleQuestion size={18} />}
      iconBgColor="bg-teal-500"
      iconColor="text-white"
      borderColor="border-teal-200"
      handleColor="bg-teal-500!"
      showOutHandle={false}
      errors={errors}
    >
      <div className="space-y-4">
        <NodeField label="Question Message" required error={(touched || data.forceValidation) && !data.message?.trim() ? "Message is required." : ""}>
          <Textarea
            placeholder="e.g. What is your email address?"
            value={data.message || ""}
            onFocus={() => setTouched(true)}
            onChange={(e) => updateNodeData("message", e.target.value)}
            className="min-h-[60px] resize-none text-sm bg-gray-50 border-gray-200 focus:bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:focus:bg-(--page-body-bg)"
          />
        </NodeField>

        <div className="grid grid-cols-2 gap-2">
          <NodeField label="Store Reply In" required error={(touched || data.forceValidation) && !data.variable_name?.trim() ? "Variable required." : ""}>
            <Input
              placeholder="user_email"
              value={data.variable_name || ""}
              onFocus={() => setTouched(true)}
              onChange={(e) => updateNodeData("variable_name", e.target.value)}
              className="text-xs h-8 bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
            />
          </NodeField>
          <NodeField label="Timeout (Mins)">
            <Input
              type="number"
              placeholder="10"
              value={data.timeout_minutes || ""}
              onChange={(e) => updateNodeData("timeout_minutes", e.target.value)}
              className="text-xs h-8 bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)"
            />
          </NodeField>
        </div>

        <div className="p-3 border border-gray-100 rounded-lg dark:border-(--card-border-color) bg-gray-50/50 dark:bg-black/10 space-y-3">
          <Label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Validation</Label>
          <Select
            value={validation.type}
            onValueChange={(val) => updateNodeData("validation", { ...validation, type: val })}
          >
            <SelectTrigger className="h-8 text-xs bg-white dark:bg-black/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="dark:bg-(--card-color)">
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="email">Email Address</SelectItem>
              <SelectItem value="number">Number</SelectItem>
              <SelectItem value="regex">Custom Regex</SelectItem>
            </SelectContent>
          </Select>

          {validation.type === "regex" && (
            <Input
              placeholder="e.g. ^[0-9]{5}$"
              value={validation.regex || ""}
              onChange={(e) => updateNodeData("validation", { ...validation, regex: e.target.value })}
              className="h-8 text-xs mt-2"
            />
          )}

          {validation.type !== "none" && (
            <div className="space-y-2 mt-2 pt-2 border-t border-gray-200 dark:border-(--card-border-color)">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label className="text-[10px] text-gray-500">Retry Limit</Label>
                  <Input
                    type="number"
                    value={data.retry_limit || 2}
                    onChange={(e) => updateNodeData("retry_limit", parseInt(e.target.value))}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
              <div>
                <Label className="text-[10px] text-gray-500">Retry Message</Label>
                <Input
                  placeholder="Invalid input, please try again."
                  value={data.retry_message || ""}
                  onChange={(e) => updateNodeData("retry_message", e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        <NodeField
          label="Branching Rules (Expected Answers)"
          description="Create specific flow branches if the user replies with specific words."
        >
          <div className="space-y-3">
            {expectedAnswers.map((ans: any, index: number) => {
              const ansId = ans.route || `ans_${index}`;
              return (
                <div key={ansId} className="group relative space-y-2 rounded-lg border border-teal-50 bg-teal-50/30 p-2 pl-3 pr-6 transition-all hover:bg-white dark:border-(--card-border-color) dark:bg-(--card-color) dark:hover:bg-(--table-hover)">
                  <Button variant="ghost" size="icon" onClick={() => removeAnswer(index)}
                    className="absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 group-hover:flex dark:bg-red-900/30 dark:text-red-400"
                  >
                    <Trash2 size={10} />
                  </Button>

                  <Input
                    placeholder="Expected Answer"
                    value={ans.value || ""}
                    onChange={(e) => updateAnswer(index, "value", e.target.value)}
                    className="h-7 text-xs bg-white dark:bg-black/20"
                  />

                  {/* Output Handle */}
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 flex items-center gap-1.5">
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={ans.route || ansId}
                      className="w-3! h-3! border-2! border-white! dark:border-dark-gray! shadow-sm bg-teal-500! static transform-none"
                    />
                  </div>
                </div>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={addAnswer}
              className="w-full h-7 text-[11px] border-dashed border-teal-200 text-teal-600 hover:bg-teal-50 dark:border-teal-900/30 dark:hover:bg-teal-900/20"
            >
              <Plus size={12} className="mr-1" /> Add Expected Answer
            </Button>
          </div>
        </NodeField>

        {/* Fallback Handle */}
        <div className="relative pt-2 border-t border-gray-100 dark:border-(--card-border-color)">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fallback (Default)</span>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id="fallback"
            className="w-3! h-3! border-2! border-white! dark:border-dark-gray! shadow-sm bg-gray-400! absolute top-1/2! -right-3! transform -translate-y-1/2!"
          />
        </div>
      </div>
    </BaseNode>
  );
}
