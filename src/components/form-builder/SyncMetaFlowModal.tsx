/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import {
  useGetAllMetaFlowsQuery,
  useSyncMetaFlowMutation,
} from "@/src/redux/api/formBuilderApi";
import { SyncMetaFlowModalProps } from "@/src/types/formBuilder";
import { Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SyncMetaFlowModal: React.FC<SyncMetaFlowModalProps> = ({
  isOpen,
  onClose,
  wabaId,
}) => {
  const { t } = useTranslation();
  const [selectedFlowIds, setSelectedFlowIds] = useState<string[]>([]);
  const {
    data: metaFlowsResult,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllMetaFlowsQuery(wabaId, { skip: !isOpen });
  const [syncMetaFlow, { isLoading: isSyncing }] = useSyncMetaFlowMutation();

  const metaFlows = metaFlowsResult?.data || [];

  const handleToggleFlow = (id: string) => {
    setSelectedFlowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFlowIds(metaFlows.map((f: any) => f.id));
    } else {
      setSelectedFlowIds([]);
    }
  };

  const handleSync = async () => {
    if (selectedFlowIds.length === 0) {
      toast.error("Please select at least one flow to sync");
      return;
    }

    try {
      const result = await syncMetaFlow({
        waba_id: wabaId,
        meta_flow_ids: selectedFlowIds,
      }).unwrap();
      toast.success(
        `Sync successful: ${result.stats.newly_synced} new, ${result.stats.updated} updated`,
      );
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to sync flows");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150 max-h-[80vh] flex flex-col dark:bg-(--card-color) p-0! overflow-hidden">
        <DialogHeader className="sm:p-6 p-4 pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">
              {t("sync_meta_flows")}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 w-8"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
            </Button>
          </div>
          <DialogDescription>
            Select flows from your WhatsApp Business Account to import or update
            in the database.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto sm:px-6 px-4 py-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : metaFlows.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              No Meta Flows found for this WABA.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-lg border dark:bg-(--page-body-bg) dark:border-(--card-border-color) border-slate-100 italic text-sm text-slate-500">
                <Checkbox
                  checked={
                    selectedFlowIds.length === metaFlows.length &&
                    metaFlows.length > 0
                  }
                  onCheckedChange={(checked) =>
                    handleSelectAll(checked === true)
                  }
                />
                <span>Select All ({metaFlows.length})</span>
              </div>
              {metaFlows.map((flow: any) => (
                <div
                  key={flow.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:border-primary/30 ${selectedFlowIds.includes(flow.id) ? "bg-primary/5 border-primary/20 shadow-sm" : "bg-white dark:bg-(--page-body-bg) dark:border-(--card-border-color) border-slate-100"}`}
                  onClick={() => handleToggleFlow(flow.id)}
                >
                  <Checkbox
                    checked={selectedFlowIds.includes(flow.id)}
                    onCheckedChange={() => handleToggleFlow(flow.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 truncate dark:text-white">
                      {flow.name}
                    </div>
                    <div className="text-xs text-slate-400 font-mono tracking-tighter">
                      {flow.id}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <Badge
                      variant={
                        flow.status === "PUBLISHED" ? "default" : "secondary"
                      }
                      className="text-[10px] h-5"
                    >
                      {flow.status}
                    </Badge>
                    <div className="text-[10px] text-slate-400">
                      {(flow.categories || []).join(", ")}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="p-4 border-t bg-slate-50/50 dark:bg-(--card-color)">
          <Button variant="outline" onClick={onClose} disabled={isSyncing}>
            Cancel
          </Button>
          <Button
            onClick={handleSync}
            disabled={isSyncing || selectedFlowIds.length === 0}
            className="gap-2 min-w-30 text-white"
          >
            {isSyncing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <RefreshCw size={16} />
            )}
            Sync Selected
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncMetaFlowModal;
