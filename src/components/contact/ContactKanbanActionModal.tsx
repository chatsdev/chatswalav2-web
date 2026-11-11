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
  useGetContactFunnelsQuery,
  useGetContactKanbanStatusQuery,
  useHandleContactKanbanActionMutation,
} from "@/src/redux/api/contactApi";
import { ContactKanbanActionModalProps } from "@/src/types/components";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import FunnelStageDropdown  from "../shared/FunnelStageDropdown";
import { FunnelStageAction } from "@/src/types/shared";

const ContactKanbanActionModal: React.FC<ContactKanbanActionModalProps> = ({
  isOpen,
  onClose,
  contact,
}) => {
  const { data: funnelsData, isLoading: loadingFunnels } =
    useGetContactFunnelsQuery(undefined, { skip: !isOpen });
  const {
    data: statusData,
    isLoading: loadingStatus,
    refetch: refetchStatus,
  } = useGetContactKanbanStatusQuery(contact?._id, {
    skip: !isOpen || !contact?._id,
  });
  const [handleAction, { isLoading: isSubmitting }] =
    useHandleContactKanbanActionMutation();

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
    if (!contact) return;
    try {
      await handleAction({
        globalItemId: contact._id,
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
          <DialogTitle>Manage Pipeline: {contact?.name}</DialogTitle>
          <DialogDescription>
            Assign this contact to specific stages across your funnels.
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
          <Button
            className="h-11 px-4.5! py-5!"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="text-white h-11 px-4.5! py-5!"
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

export default ContactKanbanActionModal;
