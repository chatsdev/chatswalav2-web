/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useSyncSheetsMutation } from "@/src/redux/api/googleApi";
import { GoogleDriveFile, SyncSheetsModalProps } from "@/src/types/google";
import { FileSpreadsheet, Loader2, RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Label } from "@/src/elements/ui/label";


const SyncSheetsModal: React.FC<SyncSheetsModalProps> = ({
  isOpen,
  onClose,
  accountId,
}) => {
  const { t } = useTranslation();
  const [syncSheets, { isLoading: isSyncing }] = useSyncSheetsMutation();
  const [availableSheets, setAvailableSheets] = useState<GoogleDriveFile[]>([]);
  const [selectedSheets, setSelectedSheets] = useState<Set<string>>(new Set());
  const [isLoadingList, setIsLoadingList] = useState(false);

  const fetchAvailableSheets = async () => {
    setIsLoadingList(true);
    try {
      const response = await syncSheets({
        google_account_id: accountId,
      }).unwrap();
      if (response.success && response.mode === "list") {
        setAvailableSheets((response.sheets as GoogleDriveFile[]) || []);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("google_account_sync_failed"));
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchAvailableSheets();
      setSelectedSheets(new Set());
    }
  }, [isOpen, accountId]);

  const toggleSheet = (id: string) => {
    const newSelected = new Set(selectedSheets);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedSheets(newSelected);
  };

  const toggleAll = () => {
    if (selectedSheets.size === availableSheets.length) {
      setSelectedSheets(new Set());
    } else {
      setSelectedSheets(new Set(availableSheets.map((s) => s.id)));
    }
  };

  const handleSync = async () => {
    if (selectedSheets.size === 0) return;

    const sheetsToSync = availableSheets
      .filter((s) => selectedSheets.has(s.id))
      .map((s) => ({ id: s.id, name: s.name }));

    try {
      await syncSheets({
        google_account_id: accountId,
        sheets: sheetsToSync,
      }).unwrap();
      toast.success(t("google_account_sync_success"));
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || t("google_account_sync_failed"));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md! !gap-0 max-w-[calc(100%-2rem)]! dark:bg-(--card-color) !overflow-hidden">
        <DialogHeader className=" min-w-0 w-full overflow-hidden">
          <DialogTitle className="!break-words !whitespace-normal w-full block">
            {t("google_account_sync_sheets_title")}
          </DialogTitle>
          <DialogDescription className="!break-words !whitespace-normal text-sm w-full block">
            {t("google_account_sync_sheets_desc")}
          </DialogDescription>
        </DialogHeader>

        <div className="min-w-0 w-full overflow-hidden">
          {isLoadingList ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p>{t("loading")}</p>
            </div>
          ) : availableSheets.length > 0 ? (
            <div className="space-y-4 min-w-0">
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-(--card-border-color) gap-4 min-w-0">
                <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                  <Checkbox
                    id="select-all"
                    className="shrink-0"
                    checked={
                      selectedSheets.size === availableSheets.length &&
                      availableSheets.length > 0
                    }
                    onCheckedChange={toggleAll}
                  />
                  <Label
                    htmlFor="select-all"
                    className="text-sm font-medium cursor-pointer truncate w-full block"
                  >
                    {t("select_all")} ({selectedSheets.size}/
                    {availableSheets.length})
                  </Label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchAvailableSheets}
                  className="h-8 text-primary hover:text-primary-dark hover:bg-light-primary dark:hover:bg-primary-darker/20 gap-2 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {t("refresh")}
                </Button>
              </div>

              <div className="max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1">
                  {availableSheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer group min-w-0 overflow-hidden ${selectedSheets.has(sheet.id) ? "bg-light-primary dark:bg-primary-darker/20" : "hover:bg-slate-50 dark:hover:bg-(--table-hover)"}`}
                      onClick={() => toggleSheet(sheet.id)}
                    >
                      <Checkbox
                        checked={selectedSheets.has(sheet.id)}
                        onCheckedChange={() => toggleSheet(sheet.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div className="w-8 h-8 rounded bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 flex items-center justify-center text-primary shrink-0">
                        <FileSpreadsheet size={16} />
                      </div>
                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p
                          className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate w-full"
                          title={sheet.name}
                        >
                          {sheet.name}
                        </p>
                        <p
                          className="text-xs text-slate-400 font-mono truncate w-full"
                          title={sheet.id}
                        >
                          {sheet.id}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
              <FileSpreadsheet className="w-12 h-12 text-slate-200" />
              <p>{t("google_account_no_sheets_found")}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAvailableSheets}
                className="gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                {t("refresh")}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="  min-w-0 w-full overflow-hidden">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSyncing}
            className="h-11 shrink-0"
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSync}
            disabled={isSyncing || selectedSheets.size === 0}
            className="bg-primary hover:bg-primary text-white h-11 min-w-25 shrink-0 truncate"
          >
            {isSyncing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin shrink-0" />
                <span className="truncate">{t("syncing")}</span>
              </>
            ) : (
              <span className="truncate">
                {t("google_account_sync_sheets")}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SyncSheetsModal;
