/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/src/elements/ui/select";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { GitBranch, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Label } from "@/src/elements/ui/label";

export function ConditionNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});

  const conditions = data.conditions || [];

  const updateNodeData = (newConditions: any[]) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, conditions: newConditions } }
          : node,
      ),
    );
  };

  const addCondition = () => {
    const newId = `branch_${Date.now()}`;
    updateNodeData([
      ...conditions,
      {
        id: newId,
        field: "message.body",
        operator: "contains",
        value: [],
        sourceHandle: newId,
      },
    ]);
  };

  const removeCondition = (index: number) => {
    const newConditions = [...conditions];
    newConditions.splice(index, 1);
    updateNodeData(newConditions);
  };

  const updateCondition = (index: number, field: string, value: any) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    updateNodeData(newConditions);
  };

  const addValue = (index: number, condId: string) => {
    const val = inputs[condId]?.trim();
    if (!val) return;

    const currentValues = Array.isArray(conditions[index].value)
      ? conditions[index].value
      : (conditions[index].value ? [conditions[index].value] : []);

    if (!currentValues.includes(val)) {
      updateCondition(index, "value", [...currentValues, val]);
    }

    setInputs({ ...inputs, [condId]: "" });
  };

  const removeValue = (condIndex: number, valIndex: number) => {
    const currentValues = Array.isArray(conditions[condIndex].value)
      ? [...conditions[condIndex].value]
      : [];

    currentValues.splice(valIndex, 1);
    updateCondition(condIndex, "value", currentValues);
  };

  return (
    <BaseNode
      id={id}
      title="Logic Control"
      icon={<GitBranch size={18} />}
      iconBgColor="bg-indigo-600"
      iconColor="text-white"
      borderColor="border-indigo-200"
      handleColor="bg-indigo-500!"
      showOutHandle={false} // We will render custom handles
    >
      <div className="space-y-4">
        <NodeField
          label="Branching Rules"
          description="Define rules to split the flow. The first matching rule will be followed."
        >
          <div className="space-y-4">
            {conditions.map((cond: any, index: number) => {
              const condId = cond.id || cond.sourceHandle || `index_${index}`;
              return (
                <div key={condId} className="group relative space-y-3 rounded-lg border border-indigo-50 bg-indigo-50/30 p-3 transition-all hover:bg-white dark:border-(--card-border-color) dark:bg-(--card-color) dark:hover:bg-(--table-hover)">
                  <Button variant="ghost" size="icon" onClick={() => removeCondition(index)}
                    className="absolute -right-2 -top-2 hidden h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 hover:text-red-600 shadow-sm transition-all hover:bg-red-200 group-hover:flex dark:bg-red-900/30 dark:text-red-400"
                  >
                    <Trash2 size={12} />
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1 flex flex-col">
                      <Label className="text-[12px] font-medium text-gray-700 dark:text-gray-400">Field</Label>
                      <Select
                        value={cond.field || "message.body"}
                        onValueChange={(val) => updateCondition(index, "field", val)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-white dark:bg-black/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-(--card-color)">
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="message.body">Message Body</SelectItem>
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="sender.phone">Sender Phone</SelectItem>
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="sender.name">Sender Name</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1 flex flex-col">
                      <Label className="text-[12px] font-medium text-gray-700 dark:text-gray-400">Operator</Label>
                      <Select
                        value={cond.operator || "contains"}
                        onValueChange={(val) => updateCondition(index, "operator", val)}
                      >
                        <SelectTrigger className="h-8 text-xs bg-white dark:bg-black/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="dark:bg-(--card-color)">
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="contains">Contains</SelectItem>
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="contains_any">Contains Any</SelectItem>
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="equals">Equals</SelectItem>
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="equals_any">Equals Any</SelectItem>
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="starts_with">Starts With</SelectItem>
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="ends_with">Ends With</SelectItem>
                          <SelectItem className="dark:hover:bg-(--table-hover)" value="exists">Exists</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {cond.operator !== "exists" && (
                    <div className="space-y-1 flex flex-col">
                      <Label className="text-[12px] font-medium text-indigo-400">Values</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Add value..."
                          value={inputs[condId] || ""}
                          onChange={(e) => setInputs({ ...inputs, [condId]: e.target.value })}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addValue(index, condId);
                            }
                          }}
                          className="h-9 text-xs bg-white dark:bg-black/20"
                        />
                        <Button
                          size="icon"
                          onClick={() => addValue(index, condId)}
                          className="h-9 w-9 bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                        >
                          <Plus size={14} />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(Array.isArray(cond.value) ? cond.value : (cond.value ? [cond.value] : [])).map((val: string, valIndex: number) => (
                          <Badge
                            key={valIndex}
                            variant="secondary"
                            className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border-indigo-100 rounded-md px-2 py-0.5 group/badge animate-in fade-in zoom-in duration-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800"
                          >
                            <span className="max-w-[120px] truncate">{val}</span>
                            <X
                              size={12}
                              className="cursor-pointer hover:text-red-500 transition-colors"
                              onClick={() => removeValue(index, valIndex)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Output Handle for this condition */}
                  <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 flex items-center gap-1.5">
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={cond.sourceHandle || condId}
                      className="w-3! h-3! border-2! border-white! dark:border-dark-gray! shadow-sm bg-indigo-500! static transform-none"
                    />
                  </div>
                </div>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={addCondition}
              className="w-full h-8 text-xs border-dashed border-indigo-200 text-indigo-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 dark:border-indigo-900/30 dark:hover:bg-indigo-900/10"
            >
              <Plus size={14} className="mr-1" /> Add Rule
            </Button>
          </div>
        </NodeField>

        {/* Default No Match Handle */}
        <div className="relative pt-2 border-t border-gray-100 dark:border-(--card-border-color)">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fallback (No Match)</span>
          </div>
          <Handle
            type="source"
            position={Position.Right}
            id="no_match"
            className="w-3! h-3! border-2! border-white! dark:border-dark-gray! shadow-sm bg-gray-400! absolute top-1/2! -right-3! transform -translate-y-1/2!"
          />
        </div>
      </div>
    </BaseNode>
  );
}
