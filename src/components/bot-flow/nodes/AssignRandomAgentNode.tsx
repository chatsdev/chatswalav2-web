/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { tabs } from "@/src/data/botFlow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { useGetTeamsQuery } from "@/src/redux/api/teamApi";
import { AssignMode } from "@/src/types/botFlow";
import { useReactFlow } from "@xyflow/react";
import { Shuffle } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { Button } from "@/src/elements/ui/button";


export function AssignRandomAgentNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const mode: AssignMode = data.assign_mode || "all";

  const { data: teamsData, isLoading: teamsLoading } = useGetTeamsQuery(
    { limit: 100 },
    { skip: mode !== "team" },
  );
  const teams: any[] = teamsData?.data?.teams || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (mode === "team" && !data.team_id) {
      errors.push("Please select a team.");
    }
  }

  const updateNodeData = (updates: Record<string, any>) => {
    if (!touched) setTouched(true);
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, ...updates } } : node,
      ),
    );
  };

  const handleModeChange = (next: AssignMode) => {
    updateNodeData({
      assign_mode: next,
      // Reset team_id when switching back to "all" so payload stays clean
      team_id: next === "all" ? null : data.team_id || "",
    });
  };

  const selectedTeam = teams.find((t) => t._id === data.team_id);

  return (
    <BaseNode
      id={id}
      title="Assign Random Agent"
      icon={<Shuffle size={18} />}
      iconBgColor="bg-amber-500"
      iconColor="text-white"
      borderColor="border-amber-200"
      handleColor="bg-amber-500!"
      errors={errors}
    >
      <div className="space-y-4">
        {/* Mode Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-(--page-body-bg) rounded-lg">
          {tabs.map((tab) => (
            <Button variant="unstyled"
              key={tab.value}
              type="button"
              onClick={() => handleModeChange(tab.value)}
              className={`flex-1 text-xs font-semibold py-1.5 rounded-md transition-all cursor-pointer ${
                mode === tab.value
                  ? "bg-white dark:bg-(--card-color) text-amber-600 shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Team selector — only visible when mode is "team" */}
        {mode === "team" && (
          <NodeField
            label="Select Team"
            required
            error={
              (touched || data.forceValidation) && !data.team_id
                ? "Team selection is required."
                : ""
            }
          >
            <Select
              value={data.team_id || ""}
              onValueChange={(value) => updateNodeData({ team_id: value })}
              disabled={teamsLoading}
            >
              <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
                <SelectValue
                  placeholder={
                    teamsLoading ? "Loading teams..." : "Choose a team"
                  }
                />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--card-color)">
                {teams.map((team) => (
                  <SelectItem
                    key={team._id}
                    value={team._id}
                    className="dark:hover:bg-(--table-hover)"
                  >
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </NodeField>
        )}

        {/* Contextual hint */}
        <div className="flex items-center gap-2 p-2 bg-amber-50 dark:bg-amber-900/10 rounded-md border border-amber-100 dark:border-amber-900/20">
          <p className="text-[10px] leading-tight text-amber-700 dark:text-amber-400">
            {mode === "all"
              ? "A random agent will be picked from all available agents using round-robin rotation."
              : selectedTeam
                ? `A random agent from the "${selectedTeam.name}" team will be assigned using round-robin rotation.`
                : "A random agent will be picked from the selected team using round-robin rotation."}
          </p>
        </div>
      </div>
    </BaseNode>
  );
}
