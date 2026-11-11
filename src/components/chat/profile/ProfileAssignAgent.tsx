"use client";

import { Button } from "@/src/elements/ui/button";
import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { ProfileAssignAgentProps } from "@/src/types/components/chat";
import { Home, Loader2 } from "lucide-react";
import { useChatTheme } from "@/src/hooks/useChatTheme";
import { useAppSelector } from "@/src/redux/hooks";
import { useTranslation } from "react-i18next";

const ProfileAssignAgent = ({ agents, selectedAgentId, onAssign, onUnassign, isLoading, isUnassigning }: ProfileAssignAgentProps) => {
  const { t } = useTranslation();
  const { isCustom } = useChatTheme();
  const { userSetting } = useAppSelector((state) => state.setting);
  const userSettingData = userSetting?.data;

  return (
    <div className="dark:border-none border-b dark:bg-(--table-hover)! border-gray-100 dark:border-(--card-border-color) p-5 space-y-4 mb-0" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 95%)" } : {}}>
      <div className="flex items-center justify-between gap-2 text-slate-900 dark:text-white font-semibold">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={isCustom ? { backgroundColor: "color-mix(in srgb, var(--chat-theme-color), transparent 90%)", color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : {}}>
            <Home size={18} />
          </div>
          <span>{t("transfer_chat_to_agent")}</span>
        </div>
        <Button
          onClick={() => window.open("/agents/create", "_blank")}
          className="text-[10px]! h-5.75! font-bold! text-primary! bg-primary/5! px-2! py-1! rounded! hover:bg-primary/10! transition-colors shrink-0"
        >
          {t("add_agent", { defaultValue: "+ Add Agent" })}
        </Button>
      </div>

      <div className="space-y-1.5 relative">
        <Label className="text-[10px] font-medium text-slate-400 absolute -top-2 left-3 bg-white dark:bg-(--page-body-bg) px-1 z-10">{t("agents", { defaultValue: "Agents" })}</Label>
        <Select key={selectedAgentId ?? "empty"} value={selectedAgentId} onValueChange={onAssign} disabled={isLoading}>
          <SelectTrigger className="w-full h-11 py-7 bg-(--input-color) dark:bg-(--page-body-bg) dark:border-none border-gray-200 dark:hover:bg-(--page-body-bg) dark:border-(--card-border-color) rounded-lg focus:ring-0">
            <SelectValue placeholder={t("select_agent", { defaultValue: "Select agent" })} />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-gray-200 dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
            {agents.map((agent) => (
              <SelectItem key={agent.id} value={agent.id} className="cursor-pointer dark:hover:bg-(--table-hover)">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{agent.name}</span>
                  {(agent.email || agent.phone) && (
                    <span className="text-[10px] text-slate-400">
                      {agent.email}
                      {agent.email && agent.phone ? " • " : ""}
                      {agent.phone}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedAgentId && agents.find((a) => a.id === selectedAgentId) && (
        <div className="flex items-center justify-between px-1">
          <p className="text-[11px] text-slate-500 dark:text-gray-400">
            <span className="font-semibold" style={isCustom ? { color: userSettingData?.theme_color == "null" ? "var(--primary)" : "var(--chat-theme-color)" } : {}}>
              {t("assigned", { defaultValue: "Assigned:" })}
            </span>{" "}
            {agents.find((a) => a.id === selectedAgentId)?.name}
            {agents.find((a) => a.id === selectedAgentId)?.phone && ` (${agents.find((a) => a.id === selectedAgentId)?.phone})`}
          </p>
          <Button variant="ghost" size="sm" onClick={onUnassign} disabled={isUnassigning} className="h-6 w-14 text-[10px] text-rose-500 hover:text-rose-600 dark:hover:bg-rose-950/20 hover:bg-rose-50 p-0">
            {isUnassigning ? <Loader2 className="animate-spin h-3 w-3" /> : t("remove", { defaultValue: "Remove" })}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileAssignAgent;
