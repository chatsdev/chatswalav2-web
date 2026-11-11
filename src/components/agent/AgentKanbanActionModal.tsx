"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { Label } from "@/src/elements/ui/label";
import {
  useGetAgentFunnelsQuery,
  useGetAgentKanbanStatusQuery,
  useHandleAgentKanbanActionMutation,
} from "@/src/redux/api/agentApi";
import { AgentKanbanActionModalProps } from "@/src/types/agent";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import FunnelStageDropdown from "../shared/FunnelStageDropdown";
import { FunnelStageAction } from "@/src/types/shared";

const AgentKanbanActionModal: React.FC<AgentKanbanActionModalProps> = ({
  isOpen,
  onClose,
  agent,
}) => {
  const { data: funnelsData, isLoading: loadingFunnels } =
    useGetAgentFunnelsQuery(undefined, { skip: !isOpen });
  const {
    data: statusData,
    isLoading: loadingStatus,
    refetch: refetchStatus,
  } = useGetAgentKanbanStatusQuery(agent?._id || agent?.id || "", {
    skip: !isOpen || (!agent?._id && !agent?.id),
  });
  const [handleAction, { isLoading: isSubmitting }] =
    useHandleAgentKanbanActionMutation();

  const [actions, setActions] = useState<FunnelStageAction[]>([]);

  useEffect(() => {
    if (isOpen && statusData?.success && statusData.data) {
      const existingActions = statusData.data.map((item) => ({
        funnelId: item.funnelId,
        toStageId: item.stageId,
      }));
      setActions(existingActions);
    } else if (isOpen) {
      setActions([]);
    }
  }, [statusData, isOpen]);

  const handleSubmit = async () => {
    if (!agent) return;
    try {
      await handleAction({
        globalItemId: agent._id || agent.id,
        actions: actions,
      }).unwrap();
      toast.success("Pipeline stages updated successfully");
      refetchStatus();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update pipeline stages");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! dark:bg-(--card-color)!">
        <DialogHeader>
          <DialogTitle>Manage Pipeline: {agent?.name}</DialogTitle>
          <DialogDescription>
            Assign this agent to specific stages across your funnels.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Funnels & Stages
          </Label>
          <FunnelStageDropdown
            funnels={funnelsData?.data || []}
            selectedActions={actions}
            onChange={setActions}
            isLoading={loadingFunnels || loadingStatus}
            placeholder="Choose funnel stages..."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            className="text-white"
            onClick={handleSubmit}
            disabled={isSubmitting || loadingFunnels || loadingStatus}
          >
            {isSubmitting && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentKanbanActionModal;
