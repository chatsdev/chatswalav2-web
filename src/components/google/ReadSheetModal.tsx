"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { useReadSheetQuery } from "@/src/redux/api/googleApi";
import { ReadSheetModalProps } from "@/src/types/google";
import { Loader2 } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

const ReadSheetModal: React.FC<ReadSheetModalProps> = ({
  isOpen,
  onClose,
  sheetId,
}) => {
  const { t } = useTranslation();
  const { data, isLoading } = useReadSheetQuery(
    { sheetId },
    { skip: !isOpen || !sheetId },
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="md:max-w-3xl! max-w-[calc(100%-2rem)]! dark:bg-(--card-color) max-h-[90vh]! flex flex-col p-0! overflow-hidden gap-0">
        <DialogHeader className="sm:p-6 p-4 border-b">
          <DialogTitle>{t("google_account_read_sheet_title")}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-auto p-0 custom-scrollbar">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : data?.values && data.values.length > 0 ? (
            <div className="relative overflow-x-auto table-custom-scrollbar">
              <table className="w-full text-sm text-left border-collapse">
                <tbody>
                  {data.values.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="border-b border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-colors"
                    >
                      <td className="px-4 py-2 bg-slate-100 dark:bg-(--card-color) font-bold text-center border-r border-slate-200 dark:border-(--card-border-color) w-10 sticky left-0 z-10">
                        {rowIndex + 1}
                      </td>
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-4 py-2 border-r border-slate-200 dark:border-(--card-border-color) min-w-30 whitespace-nowrap overflow-hidden text-ellipsis"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500 gap-3">
              <div className="text-lg font-medium">{t("no_results_found")}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReadSheetModal;
