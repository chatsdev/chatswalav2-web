"use client";

import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/src/elements/ui/select";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { GitBranch, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Label } from "@/src/elements/ui/label";

export function AdvancedConditionNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const matchType = data.match_type || "AND";
  const rules = data.rules || [];

  const updateNodeData = (newData: any) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, ...newData } }
          : node,
      ),
    );
  };

  const addRule = () => {
    updateNodeData({
      rules: [
        ...rules,
        {
          field: "",
          operator: "equals",
          value: "",
        },
      ]
    });
  };

  const removeRule = (index: number) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    updateNodeData({ rules: newRules });
  };

  const updateRule = (index: number, field: string, value: any) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], [field]: value };
    updateNodeData({ rules: newRules });
  };

  return (
    <BaseNode
      id={id}
      title="Condition"
      icon={<GitBranch size={16} />}
      iconBgColor="bg-[#9333ea] dark:bg-purple-900/20"
      iconColor="text-white dark:text-white"
      borderColor="border-[#E9D5FF] dark:border-purple-900/50"
      handleColor="bg-[#8B5CF6]!"
      showOutHandle={false}
    >
      <div className="space-y-4">
        <NodeField
          label="Logic Expression"
          description="All the rules below are combined into ONE expression. Add rules to make it more specific."
        >
          <div className="space-y-3">
            <div className="flex items-center flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-full mb-3">
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 flex-1 text-xs font-semibold ${matchType === "AND" ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] hover:text-white shadow-sm" : "text-slate-600 dark:text-slate-300 bg-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                onClick={() => updateNodeData({ match_type: "AND" })}
              >
                AND (All must match)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 flex-1 text-xs font-semibold ${matchType === "OR" ? "bg-[#8B5CF6] text-white hover:bg-[#7C3AED] hover:text-white shadow-sm" : "text-slate-600 dark:text-slate-300 bg-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
                onClick={() => updateNodeData({ match_type: "OR" })}
              >
                OR (Any can match)
              </Button>
            </div>

            {rules.map((rule: any, index: number) => (
              <div key={index} className="group relative space-y-2 rounded-lg border border-purple-100 bg-purple-50/30 p-3 transition-all hover:bg-white dark:border-(--card-border-color) dark:bg-(--card-color) dark:hover:bg-(--table-hover)">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Rule {index + 1}</Label>
                  <Button variant="ghost" size="icon" onClick={() => removeRule(index)}
                    className="h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 hover:text-red-600 shadow-sm transition-all hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                  >
                    <Trash2 size={10} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Input
                    placeholder="Variable name (e.g. plan)"
                    value={rule.field || ""}
                    onChange={(e) => updateRule(index, "field", e.target.value)}
                    className="h-8 text-xs bg-white dark:bg-black/20"
                  />

                  <Select
                    value={rule.operator || "equals"}
                    onValueChange={(val) => updateRule(index, "operator", val)}
                  >
                    <SelectTrigger className="h-8 text-xs bg-white dark:bg-black/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-(--card-color)">
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="equals">Equal to</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="not_equals">Not equal to</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="contains">Contains</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="not_contains">Does not contain</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="starts_with">Starts with</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="ends_with">Ends with</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="greater_than">Greater than</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="less_than">Less than</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="is_empty">Is empty</SelectItem>
                      <SelectItem className="dark:hover:bg-(--table-hover)" value="is_not_empty">Is not empty</SelectItem>
                    </SelectContent>
                  </Select>

                  {!['is_empty', 'is_not_empty'].includes(rule.operator) && (
                    <Input
                      placeholder="Compare against..."
                      value={rule.value || ""}
                      onChange={(e) => updateRule(index, "value", e.target.value)}
                      className="h-8 text-xs bg-white dark:bg-black/20"
                    />
                  )}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={addRule}
              className="w-full h-9 text-xs font-medium border-dashed border-[#D8B4FE] text-[#8B5CF6] hover:bg-[#F3E8FF] hover:border-[#8B5CF6] hover:text-[#7C3AED] dark:border-purple-900/50 dark:text-purple-400 dark:hover:bg-purple-900/30 bg-transparent transition-all rounded-lg"
            >
              <Plus size={16} className="mr-2" /> Add rule
            </Button>
          </div>
        </NodeField>

        <div className="pt-2 border-t border-slate-100 dark:border-(--card-border-color) space-y-2 mt-2">
          <div className="relative flex items-center justify-between p-2.5 rounded-lg bg-[#F0FDF4] border border-[#DCFCE7] dark:bg-primary-darker/20 dark:border-primary-darker/30">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center shadow-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <span className="text-[11px] font-bold text-[#166534] dark:text-primary uppercase tracking-widest">IF &middot; TRUE</span>
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id="true"
              className="w-3.5! h-3.5! border-2! border-white! dark:border-dark-gray! shadow-sm bg-[#22C55E]! absolute top-1/2! -right-4! transform -translate-y-1/2!"
            />
          </div>

          <div className="relative flex items-center justify-between p-2.5 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] dark:bg-red-950/20 dark:border-red-900/30">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-[#EF4444] flex items-center justify-center shadow-sm">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </div>
              <span className="text-[11px] font-bold text-[#991B1B] dark:text-red-400 uppercase tracking-widest">ELSE &middot; FALSE</span>
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id="false"
              className="w-3.5! h-3.5! border-2! border-white! dark:border-dark-gray! shadow-sm bg-[#EF4444]! absolute top-1/2! -right-4! transform -translate-y-1/2!"
            />
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
