/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useReactFlow } from "@xyflow/react";
import { Calendar, Zap } from "lucide-react";
import { useState } from "react";
import { BaseNode } from "./BaseNode";
import { NodeField } from "./NodeField";
import { useListAppointmentConfigsQuery } from "@/src/redux/api/appointmentApi";
import { useAppSelector } from "@/src/redux/hooks";

export function AppointmentFlowNode({ data, id }: any) {
  const { setNodes } = useReactFlow();
  const [touched, setTouched] = useState(false);

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const waba_id = selectedWorkspace?.waba_id;

  const currentPlatform = data.platform || "all";

  // If not WhatsApp, show an error state
  const isWhatsApp = currentPlatform === "whatsapp";

  const { data: configsData, isLoading } = useListAppointmentConfigsQuery(
    { waba_id: waba_id || "", limit: 100 },
    { skip: !waba_id || !isWhatsApp }
  );

  const availableConfigs = configsData?.data?.configs?.filter((c: any) => c.status !== "inactive") || [];

  const errors: string[] = [];
  if (touched || data.forceValidation) {
    if (!data.appointment_config_id) errors.push("Appointment Config ID is required.");
  }
  
  if (!isWhatsApp) {
    errors.push("Appointment Flow is only available for WhatsApp.");
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

  return (
    <BaseNode
      id={id}
      title="Booking Flow"
      icon={<Calendar size={18} />}
      iconBgColor="bg-amber-600"
      iconColor="text-white"
      borderColor={isWhatsApp ? "border-amber-200" : "border-red-200"}
      handleColor={isWhatsApp ? "bg-amber-500!" : "bg-red-500!"}
      errors={errors}
    >
      <div className="space-y-4">
        {!isWhatsApp ? (
          <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded border border-red-200 dark:border-red-900/30">
            <p className="text-xs text-red-600 dark:text-red-400">
              Appointment flows are strictly supported on WhatsApp channels only. Please change the flow channel or remove this node.
            </p>
          </div>
        ) : (
          <>
            <NodeField
              label="Appointment Config"
              required
              error={(touched || data.forceValidation) && !data.appointment_config_id ? "Config is required." : ""}
            >
              <Select
                value={data.appointment_config_id || ""}
                onValueChange={(value) => updateNodeData("appointment_config_id", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full text-sm bg-gray-50 border-gray-200 focus:bg-white dark:focus:bg-(--page-body-bg) dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
                  <SelectValue placeholder={isLoading ? "Loading configs..." : "Choose an appointment config"} />
                </SelectTrigger>
                <SelectContent className="dark:bg-(--card-color)">
                  {availableConfigs.map((config: any) => (
                    <SelectItem key={config._id} className="dark:hover:bg-(--table-hover)" value={config._id}>
                      {config.title || config.name || "Untitled Config"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </NodeField>
            
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              This node will transition the user into the selected automated booking conversational flow.
            </p>
          </>
        )}
      </div>
    </BaseNode>
  );
}
