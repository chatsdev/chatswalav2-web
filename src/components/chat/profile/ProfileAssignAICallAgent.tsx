"use client";

import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import { ProfileAssignAICallAgentProps } from "@/src/types/components/chat";
import { Bot, Loader2, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const ProfileAssignAICallAgent = ({
  agents,
  selectedAgentId,
  assignedAgent,
  onAssign,
  onUnassign,
  isLoading,
  isUnassigning,
}: ProfileAssignAICallAgentProps) => {
  const { t } = useTranslation();
  const { isCustom } = useChatTheme();
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  const currentAgent =
    assignedAgent || agents.find((a) => a._id === selectedAgentId);

  return (
    <div
      className="dark:border-none border-b border-gray-100 dark:bg-(--table-hover)! dark:border-(--card-border-color) p-5 space-y-4 mb-0"
      style={
        isCustom
          ? {
              backgroundColor:
                "color-mix(in srgb, var(--chat-theme-color), transparent 95%)",
            }
          : {}
      }
    >
      <div className="flex items-center justify-between gap-2 text-slate-900 dark:text-white font-semibold">
        <div className="flex items-center gap-2">
          <div
            className="p-1.5 rounded-lg"
            style={
              isCustom
                ? {
                    backgroundColor:
                      "color-mix(in srgb, var(--chat-theme-color), transparent 90%)",
                    color:
                      userSettingData?.theme_color == "null"
                        ? "var(--primary)"
                        : "var(--chat-theme-color)",
                  }
                : {}
            }
          >
            <Bot size={18} />
          </div>
          <span>{t("assign_ai_call_assistant")}</span>
        </div>
        <Button
          onClick={() =>
            window.open("/ai_call_assistant/agents/create", "_blank")
          }
          className="text-[10px]! font-bold! text-primary! bg-primary/5! px-2! py-1! rounded! hover:bg-primary/10! h-5.75! transition-colors shrink-0"
        >
          + Add Call
        </Button>
      </div>

      <div className="space-y-1.5 relative">
        <Label className="text-[10px] font-medium text-slate-400 absolute -top-2 left-3 bg-white dark:bg-(--page-body-bg) px-1 z-10">
          AI Call Assistants
        </Label>
        <Select
          key={selectedAgentId ?? "empty"}
          value={selectedAgentId}
          onValueChange={onAssign}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full h-11 py-7 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-none border-gray-200 dark:hover:bg-(--page-body-bg) dark:border-(--card-border-color) rounded-lg focus:ring-0">
            <SelectValue placeholder="Select AI Assistant" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
            {agents.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500 italic">
                No AI Agents found
              </div>
            ) : (
              agents.map((agent) => (
                <SelectItem
                  key={agent._id}
                  value={agent._id}
                  className="cursor-pointer dark:hover:bg-(--table-hover)"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">{agent.name}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedAgentId && currentAgent && (
        <div className="pt-2">
          <div
            className={cn(
              "group flex items-center justify-between p-3 rounded-lg border transition-all duration-200",
              "bg-slate-50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)",
              "hover:shadow-md hover:border-primary/20",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-(--dark-body) rounded-lg shadow-sm border border-slate-100 dark:border-(--card-border-color)">
                <Bot size={16} className="text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  Assigned Agent
                </span>
                <span className="text-sm font-bold text-slate-700 dark:text-gray-200">
                  {currentAgent.name}
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onUnassign}
              disabled={isUnassigning}
              className="h-8 w-8 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
            >
              {isUnassigning ? (
                <Loader2 className="animate-spin h-3 w-3" />
              ) : (
                <X size={16} />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAssignAICallAgent;
