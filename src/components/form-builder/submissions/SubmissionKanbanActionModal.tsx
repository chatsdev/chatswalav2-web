/* eslint-disable @typescript-eslint/no-explicit-any */
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
  useGetSubmissionFunnelsQuery,
  useGetSubmissionKanbanStatusQuery,
  useHandleSubmissionKanbanActionMutation,
} from "@/src/redux/api/submissionApi";
import { SubmissionKanbanActionModalProps } from "@/src/types/formBuilder";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import FunnelStageDropdown from "../../shared/FunnelStageDropdown";
import { FunnelStageAction } from "@/src/types/shared";

const SubmissionKanbanActionModal: React.FC<
  SubmissionKanbanActionModalProps
> = ({ isOpen, onClose, submission }) => {
  const { data: funnelsData, isLoading: loadingFunnels } =
    useGetSubmissionFunnelsQuery(undefined, { skip: !isOpen });
  const {
    data: statusData,
    isLoading: loadingStatus,
    refetch: refetchStatus,
  } = useGetSubmissionKanbanStatusQuery(submission?._id || submission?.id, {
    skip: !isOpen || (!submission?._id && !submission?.id),
  });
  const [handleAction, { isLoading: isSubmitting }] =
    useHandleSubmissionKanbanActionMutation();

  const [actions, setActions] = useState<FunnelStageAction[]>([]);

  useEffect(() => {
    if (isOpen && statusData?.success && statusData.data) {
      const existingActions = statusData.data.map((item: any) => ({
        funnelId: item.funnelId,
        toStageId: item.stageId,
      }));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActions(existingActions);
    } else if (isOpen) {
      setActions([]);
    }
  }, [statusData, isOpen]);

  const handleSubmit = async () => {
    if (!submission) return;
    try {
      await handleAction({
        globalItemId: submission._id || submission.id,
        actions: actions,
      }).unwrap();
      toast.success("Pipeline stages updated successfully");
      refetchStatus();
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update pipeline stages");
    }
  };

  const getSubmissionName = () => {
    if (!submission) return "Lead";
    const nameField = (submission.fields || []).find((f: any) =>
      /name/i.test(f.label || ""),
    )?.value;
    return nameField || "New Lead";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! max-w-[calc(100%-2rem)]! dark:bg-(--card-color)!">
        <DialogHeader>
          <DialogTitle>Manage Pipeline: {getSubmissionName()}</DialogTitle>
          <DialogDescription>
            Assign this lead to specific stages across your funnels.
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

export default SubmissionKanbanActionModal;
