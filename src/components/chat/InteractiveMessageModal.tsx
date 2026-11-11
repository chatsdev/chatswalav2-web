"use client";

import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { cn } from "@/src/lib/utils";
import {
  ButtonFormHandle,
  InteractiveMessageModalProps,
  ListFormHandle,
} from "@/src/types/components/chat";
import { AlertCircle, List, MessageSquare, Send, X } from "lucide-react";
import React, { useRef, useState } from "react";
import ButtonForm from "./interactive/ButtonForm";
import ListForm from "./interactive/ListForm";

const InteractiveMessageModal = ({
  isOpen,
  onClose,
  type,
  onSend,
}: InteractiveMessageModalProps) => {
  const [isSending, setIsSending] = useState(false);

  const buttonFormRef = useRef<ButtonFormHandle>(null);
  const listFormRef = useRef<ListFormHandle>(null);
  

  const handleSendTrigger = async () => {
    try {
      if (type === "button") {
        await buttonFormRef.current?.submit();
      } else {
        await listFormRef.current?.submit();
      }
      onClose();
    } catch (error) {
      console.error("Submission failed, keeping modal open");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="w-[95vw] 
  max-w-[calc(100%-2rem)]
  sm:max-w-xl!
  p-0! 
  gap-0 
  overflow-hidden 
  border-none 
  shadow-2xl 
  bg-white 
  dark:bg-(--card-color)
  max-h-[calc(100dvh-2rem)]
  flex
  flex-col"
      >
        <div
          className={cn(
            "h-1.5 w-full",
            type === "button" ? "bg-primary" : "bg-primary",
          )}
        />

        <DialogHeader className="sm:px-6 px-4 pt-6 pb-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "p-2 rounded-lg",
                  type === "button"
                    ? "bg-light-primary dark:bg-primary/10 text-primary"
                    : "bg-blue-50 dark:bg-primary/10 text-primary",
                )}
              >
                {type === "button" ? (
                  <MessageSquare size={24} />
                ) : (
                  <List size={24} />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl text-left rtl:text-right font-bold tracking-tight text-slate-900 dark:text-white">
                  {type === "button" ? "Button Message" : "List Message"}
                </DialogTitle>
                <p className="sm:text-sm text-xs text-left rtl:text-right text-slate-500 dark:text-gray-500">
                  Create an interactive {type} message for WhatsApp
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-lg hover:bg-slate-100 dark:hover:bg-(--table-hover) transition-colors"
            >
              <X size={20} />
            </Button>
          </div>
        </DialogHeader>

        <div className="sm:px-6 px-4 py-4 flex-1 overflow-y-auto custom-scrollbar">
          {type === "button" ? (
            <ButtonForm
              ref={buttonFormRef}
              onSend={onSend}
              setIsSending={setIsSending}
            />
          ) :(
            <ListForm
              ref={listFormRef}
              onSend={onSend}
              setIsSending={setIsSending}
            />
          )}
        </div>

        <div className="sm:p-6 p-4 bg-slate-50 dark:bg-(--card-color) flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-t border-slate-100 dark:border-(--card-border-color) shrink-0">
          <div className="flex items-center gap-2 text-slate-500">
            <AlertCircle size={16} />
            <span className="text-[11px] font-medium leading-none text-slate-500 dark:text-gray-500">
              {type === "button"
                ? "Max 3 buttons. Text limit 20 chars per button."
                : "Max 10 sections with 10 rows each. Titles limit 24 chars."}
            </span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={isSending}
              className="text-slate-600 bg-slate-200/50 dark:text-gray-500 flex-1 sm:flex-none sm:min-w-24 hover:bg-slate-200 dark:hover:bg-(--table-hover) dark:bg-(--page-body-bg)"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendTrigger}
              disabled={isSending}
              className={cn(
                "rounded-lg flex-1 sm:flex-none sm:min-w-32 gap-2 font-bold shadow-lg transition-all active:scale-95",
                type === "button"
                  ? "bg-primary text-white shadow-primary/20"
                  : "bg-primary hover:bg-primary text-white shadow-primary/20",
              )}
            >
              {isSending ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Send {type === "button" ? "Buttons" : "List"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InteractiveMessageModal;
