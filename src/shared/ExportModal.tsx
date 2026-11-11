/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/src/elements/ui/alert-dialog";
import { Button } from "@/src/elements/ui/button";
import { ExportModalProps } from "@/src/types/shared";
import { FileDown, Printer, FileSpreadsheet, X } from "lucide-react";
import React from "react";

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onExport, title, description, selectedCount }) => {
  const options = [
    {
      id: "excel",
      title: "Excel",
      description: "Download data as .xlsx format",
      icon: FileSpreadsheet,
      color: "text-primary",
      bgColor: "bg-light-primary dark:bg-primary/10",
    },
    {
      id: "csv",
      title: "CSV",
      description: "Download data as .csv format",
      icon: FileDown,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      id: "print",
      title: "PDF",
      description: "Print data in a clean table format",
      icon: Printer,
      color: "text-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
    },
  ];

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="p-0! max-h-[90dvh] overflow-y-auto border-none bg-white dark:bg-(--dark-body)">
        <div className="sm:p-6 p-4 pb-0! space-y-6">
          <AlertDialogHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-amber-50 text-left rtl:text-right">{title}</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-left rtl:text-right text-gray-500 mt-1">
                {description} {selectedCount !== undefined && `(${selectedCount} items)`}
              </AlertDialogDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
              <X size={18} />
            </Button>
          </AlertDialogHeader>

          <div className="grid gap-3">
            {options.map((option) => (
              <Button key={option.id} onClick={() => onExport(option.id as any)} className="flex! items-center! gap-4! h-20.5! p-4! rounded-lg! border! border-slate-100! dark:border-(--card-border-color)! hover:border-primary/30! bg-slate-50! dark:bg-(--table-hover)! hover:bg-slate-50! dark:hover:bg-(--table-hover)! transition-all group text-left">
                <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center shrink-0`}>
                  <option.icon className={`w-6 h-6 ${option.color}`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-amber-50 group-hover:text-primary transition-colors text-[16px]">{option.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <AlertDialogFooter className="bg-slate-50 dark:bg-(--card-color) p-4 shrink-0 sm:flex-row flex-col gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto h-11 border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-gray-400">
            Cancel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExportModal;
