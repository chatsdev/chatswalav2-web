import { Button } from "@/src/elements/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/src/elements/ui/dialog";
import { MessageLogsDetailsModalProps } from "@/src/types/messageLogs";
import {
  Calendar,
  MessageSquare,
  Smartphone,
  Sparkles,
  XCircle,
} from "lucide-react";
import React from "react";
import {
  getDirectionBadge,
  getPlatformBadge,
  getStatusBadge,
} from "./MessageLogsBadges";

export const MessageLogsDetailsModal: React.FC<
  MessageLogsDetailsModalProps
> = ({ selectedMessage, onClose }) => {
  return (
    <Dialog
      open={!!selectedMessage}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-xl! max-w-[calc(100%-2rem)]! max-h-[90vh]! no-scrollbar p-0! overflow-auto border-none bg-white dark:bg-(--card-color) rounded-lg shadow-2xl">
        <DialogHeader className="sm:px-6 px-4 pt-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles size={20} />
            </div>
            <div className="text-left rtl:text-right">
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Message Log Details
              </DialogTitle>
              <DialogDescription className="text-sm text-slate-400 font-medium">
                Detailed tracking information and delivery stats
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {selectedMessage && (
          <div className="sm:px-6 px-4 sm:py-6 py-4 space-y-5 max-h-[70vh] overflow-y-auto no-scrollbar">
            {/* Recipient Details Card */}
            <div className="p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color) space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">
                  Recipient Details
                </span>
                {getPlatformBadge(selectedMessage.platform)}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {selectedMessage.contact ? (
                    selectedMessage.contact.charAt(0).toUpperCase()
                  ) : (
                    <Smartphone size={16} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">
                    {selectedMessage.contact || "Unknown Contact"}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium">
                    {selectedMessage.phone_number}
                  </p>
                </div>
              </div>
            </div>

            {/* Status and Parameters Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-400 ">
                  Delivery Status
                </span>
                <div>
                  {getStatusBadge(
                    selectedMessage.status,
                    selectedMessage.error,
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-400 ">
                  Direction
                </span>
                <div>{getDirectionBadge(selectedMessage.direction)}</div>
              </div>

              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-400 ">
                  Message Type
                </span>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                  {selectedMessage.type || "text"}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400">
                  Provider
                </span>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300 ">
                  {selectedMessage.provider || "meta"}
                </div>
              </div>
            </div>

            {/* Message Content Container */}
            <div className="space-y-2">
              <span className="text-sm font-bold text-slate-400 flex items-center gap-1">
                <MessageSquare size={12} /> Message Body
              </span>
              <div className="p-4 bg-slate-50 dark:bg-(--page-body-bg) h-auto rounded-lg border border-slate-100 dark:border-(--card-border-color) font-mono text-sm text-slate-600 dark:text-slate-300 leading-relaxed break-words whitespace-pre-wrap">
                {selectedMessage.content || "Empty content"}
              </div>
            </div>

            {/* Error Log (If failed) */}
            {selectedMessage.error && (
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-lg space-y-2">
                <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                  <XCircle size={12} /> Error Report
                </span>
                <p className="text-xs font-mono font-semibold text-red-600 dark:text-red-400 break-words">
                  {selectedMessage.error}
                </p>
              </div>
            )}

            {/* Delivery Timestamp Details */}
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-400 border-t border-slate-100 dark:border-(--card-border-color) pt-4.5">
              <Calendar size={13} />
              <span>
                Dispatched on:{" "}
                {new Date(selectedMessage.sent_at).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="sm:px-6 px-4 py-4 bg-slate-50 dark:bg-(--card-color) flex justify-end gap-2 border-t border-slate-100 dark:border-(--card-border-color)">
          <Button
            onClick={onClose}
            className="px-4.5! py-5 text-sm font-bold text-slate-500 hover:text-white dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) rounded-lg cursor-pointer transition-all active:scale-95"
          >
            Close Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
