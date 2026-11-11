/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CONFIG_FIELDS } from "@/src/data/defaultAction";
import { Button } from "@/src/elements/ui/button";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { cn } from "@/src/lib/utils";
import {
  useGetWabaConfigurationQuery,
  useUpdateWabaConfigurationMutation,
} from "@/src/redux/api/wabaConfigurationApi";
import {
  WabaConfigSectionProps
} from "@/src/types/defaultAction";
import {
  DelayedReplyRef,
  ReplyRef,
  WabaConfigPayload,
} from "@/src/types/wabaConfiguration";
import { Info, Loader2 } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ConfigRow from "./waba-config/ConfigRow";
import ToggleSwitch from "./waba-config/ToggleSwitch";

const isConfigFieldEnabled = (val: any) => {
  return !!(val && typeof val === "object" && val.id);
};

const getInitialExpandedMap = (config: WabaConfigPayload) => {
  const map: Record<string, boolean> = {};
  CONFIG_FIELDS.forEach((field) => {
    map[field.key] = isConfigFieldEnabled(
      config[field.key as keyof WabaConfigPayload],
    );
  });
  return map;
};

const WabaConfigSection: React.FC<WabaConfigSectionProps> = ({ wabaId }) => {
  const [localConfig, setLocalConfig] = useState<WabaConfigPayload>({});
  const [initialConfig, setInitialConfig] = useState<WabaConfigPayload>({});
  const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>({});
  const initializedWabaId = useRef<string | null>(null);

  const hasChanges =
    JSON.stringify(localConfig) !== JSON.stringify(initialConfig);

  const { data, isLoading, isError } = useGetWabaConfigurationQuery(wabaId, {
    skip: !wabaId,
  });
  const [updateConfig, { isLoading: isSaving }] =
    useUpdateWabaConfigurationMutation();

  useEffect(() => {
    if (data?.data && initializedWabaId.current !== wabaId) {
      const d = data.data;
      const config = {
        out_of_working_hours: d.out_of_working_hours ?? null,
        welcome_message: d.welcome_message ?? null,
        delayed_reply: d.delayed_reply ?? null,
        fallback_message: d.fallback_message ?? null,
        reengagement_message: d.reengagement_message ?? null,
        round_robin_assignment: d.round_robin_assignment ?? false,
      };

      setLocalConfig(config);
      setInitialConfig(config);

      setExpandedMap(getInitialExpandedMap(config));
      initializedWabaId.current = wabaId;
    }
  }, [data, wabaId]);

  const saveConfig = useCallback(
    async (newConfig: WabaConfigPayload) => {
      try {
        const response = await updateConfig({
          wabaId,
          data: newConfig,
        }).unwrap();
        toast.success(response.message || "Configuration saved");
      } catch (err: any) {
        toast.error(err?.data?.message || "Failed to save configuration");
      }
    },
    [wabaId, updateConfig],
  );

  const handleToggleExpand = (key: string) => {
    setExpandedMap((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleReplyChange = (
    key: keyof WabaConfigPayload,
    ref: ReplyRef | null,
  ) => {
    setLocalConfig((prev) => ({ ...prev, [key]: ref }));
  };

  const handleDelayChange = (minutes: number) => {
    const current = localConfig.delayed_reply as DelayedReplyRef | null;
    const newRef: DelayedReplyRef | null = current
      ? { ...current, delay_minutes: minutes }
      : { id: "", type: "", delay_minutes: minutes };
    setLocalConfig((prev) => ({ ...prev, delayed_reply: newRef }));
  };

  const handleRoundRobin = (v: boolean) => {
    setLocalConfig((prev) => ({ ...prev, round_robin_assignment: v }));
  };

  const handleSave = () => {
    saveConfig(localConfig);
    setInitialConfig(localConfig);
  };

  const handleDiscard = () => {
    setLocalConfig(initialConfig);
    setExpandedMap(getInitialExpandedMap(initialConfig));
    toast.info("Changes discarded");
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-5 h-5 rounded-md" />
              </div>
              <Skeleton className="w-full h-24 rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-14 text-slate-400">
        <Info size={28} />
        <p className="text-sm">Could not load configuration. Please refresh.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            {CONFIG_FIELDS.filter((_, i) => i % 2 === 0).map((field) => (
              <ConfigRow
                key={field.key}
                field={field}
                value={localConfig[field.key] as any}
                enabled={isConfigFieldEnabled(localConfig[field.key])}
                isExpanded={!!expandedMap[field.key]}
                isSaving={isSaving}
                wabaId={wabaId}
                onReplyChange={(ref) => handleReplyChange(field.key, ref)}
                onDelayChange={
                  field.hasDelayMinutes ? handleDelayChange : undefined
                }
                onToggleExpand={() => handleToggleExpand(field.key)}
              />
            ))}
          </div>
          <div className="flex flex-col gap-4">
            {CONFIG_FIELDS.filter((_, i) => i % 2 !== 0).map((field) => (
              <ConfigRow
                key={field.key}
                field={field}
                value={localConfig[field.key] as any}
                enabled={isConfigFieldEnabled(localConfig[field.key])}
                isExpanded={!!expandedMap[field.key]}
                isSaving={isSaving}
                wabaId={wabaId}
                onReplyChange={(ref) => handleReplyChange(field.key, ref)}
                onDelayChange={
                  field.hasDelayMinutes ? handleDelayChange : undefined
                }
                onToggleExpand={() => handleToggleExpand(field.key)}
              />
            ))}
            <div className="rounded-lg border border-slate-100 dark:border-(--card-border-color)/50 bg-white dark:bg-(--card-color) shadow-sm">
              <div className="flex items-center justify-between p-4 sm:p-5">
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-4">
                  <div className="mt-0.5 p-2 rounded-lg bg-slate-100 dark:bg-(--dark-body) text-slate-400">
                    <Loader2
                      size={15}
                      className={cn(
                        localConfig.round_robin_assignment &&
                          "text-primary animate-pulse",
                      )}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "text-sm font-bold",
                        localConfig.round_robin_assignment
                          ? "text-slate-800 dark:text-white"
                          : "text-slate-500 dark:text-slate-400",
                      )}
                    >
                      Sequential assignment
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">
                      Automatically assign incoming chats to agents in rotation
                    </p>
                  </div>
                </div>
                <ToggleSwitch
                  checked={!!localConfig.round_robin_assignment}
                  onChange={handleRoundRobin}
                  disabled={isSaving}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Changes Floating Bar */}
      {hasChanges && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white dark:bg-(--card-color) p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="flex flex-col pr-4 border-r border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              Unsaved Changes
            </span>
            <span className="text-xs text-slate-400">
              You have unsaved configuration updates
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscard}
              disabled={isSaving}
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium px-4 h-10 rounded-lg"
            >
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90 text-white font-bold px-6 h-10 rounded-lg shadow-lg shadow-primary/20 flex items-center gap-2 transition-all active:scale-95"
            >
              {isSaving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default WabaConfigSection;
