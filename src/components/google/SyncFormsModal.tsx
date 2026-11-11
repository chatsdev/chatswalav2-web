"use client";

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
import { useSyncFormsMutation } from "@/src/redux/api/googleApi";
import { GoogleDriveFile } from "@/src/types/google";
import { ClipboardList, Loader2, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Label } from "@/src/elements/ui/label";


interface SyncFormsModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
}

const SyncFormsModal: React.FC<SyncFormsModalProps> = ({
  isOpen,
  onClose,
  accountId,
}) => {
  const { t } = useTranslation();
  const [syncForms, { isLoading: isSyncing }] = useSyncFormsMutation();
  const [availableForms, setAvailableForms] = useState<GoogleDriveFile[]>([]);
  const [selectedForms, setSelectedForms] = useState<Set<string>>(new Set());
  const [isLoadingList, setIsLoadingList] = useState(false);

  const fetchAvailableForms = async () => {
    setIsLoadingList(true);
    try {
      const response = await syncForms({
        google_account_id: accountId,
      }).unwrap();
      if (response.success && response.mode === "list") {
        setAvailableForms((response.forms as GoogleDriveFile[]) || []);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to fetch forms from Google");
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAvailableForms();
      setSelectedForms(new Set());
    }
  }, [isOpen, accountId]);

  const toggleForm = (id: string) => {
    const newSelected = new Set(selectedForms);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedForms(newSelected);
  };

  const toggleAll = () => {
    if (selectedForms.size === availableForms.length) {
      setSelectedForms(new Set());
    } else {
      setSelectedForms(new Set(availableForms.map((s) => s.id)));
    }
  };

  const handleSync = async () => {
    if (selectedForms.size === 0) return;

    const formsToSync = availableForms
      .filter((s) => selectedForms.has(s.id))
      .map((s) => ({ id: s.id, name: s.name }));

    try {
      await syncForms({
        google_account_id: accountId,
        forms: formsToSync,
      }).unwrap();
      toast.success("Forms synced successfully");
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to sync forms");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! !gap-0 max-w-[calc(100%-2rem)]! dark:bg-(--card-color) !overflow-auto no-scrollbar max-h-[90vh]">
        <DialogHeader className=" min-w-0 w-full overflow-hidden">
          <DialogTitle className="!break-words !whitespace-normal w-full block">
            Sync Google Forms
          </DialogTitle>
          <DialogDescription className="!break-words !whitespace-normal text-sm w-full block">
            Select forms from your Google account to sync to the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="min-w-0 w-full overflow-hidden py-5">
          {isLoadingList ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              <p>Loading forms...</p>
            </div>
          ) : availableForms.length > 0 ? (
            <div className="space-y-4 min-w-0">
              <div className="flex items-center justify-between px-3 pb-2 mb-2 border-b border-slate-100 dark:border-(--card-border-color) gap-4 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                  <Checkbox
                    id="select-all-forms"
                    className="shrink-0"
                    checked={
                      selectedForms.size === availableForms.length &&
                      availableForms.length > 0
                    }
                    onCheckedChange={toggleAll}
                  />
                  <Label
                    htmlFor="select-all-forms"
                    className="text-sm font-medium cursor-pointer truncate w-full block"
                  >
                    Select All ({selectedForms.size}/{availableForms.length})
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchAvailableForms}
                  className="h-8 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 gap-2 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </Button>
              </div>

              <div className="max-h-75 overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                  {availableForms.map((form) => (
                    <div
                      key={form.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer group min-w-0 overflow-auto ${selectedForms.has(form.id) ? "bg-purple-50 dark:bg-purple-900/20" : "hover:bg-slate-50 dark:hover:bg-(--table-hover)"}`}
                      onClick={() => toggleForm(form.id)}
                    >
                      <Checkbox
                        checked={selectedForms.has(form.id)}
                        onCheckedChange={() => toggleForm(form.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 shrink-0">
                        <ClipboardList size={16} />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p
                          className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate w-full"
                          title={form.name}
                        >
                          {form.name}
                        </p>
                        <p
                          className="text-xs text-slate-400 font-mono truncate w-full"
                          title={form.id}
                        >
                          {form.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
              <ClipboardList className="w-12 h-12 text-slate-200" />
              <p>No forms found in your Google account.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAvailableForms}
                className="gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="min-w-0 w-full overflow-hidden">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSyncing}
            className="h-11 shrink-0"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSync}
            disabled={isSyncing || selectedForms.size === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white h-11 min-w-25 shrink-0 truncate"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                <span className="truncate">Syncing...</span>
              </>
            ) : (
              <span className="truncate">
                Sync Forms
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncFormsModal;
