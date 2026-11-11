"use client";

import InfoModal from "@/src/components/common/InfoModal";
import { useState } from "react";
import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { useGetWebhookQuery } from "@/src/redux/api/webhookApi";
import { WebhookPayloadModalProps } from "@/src/types/webhook";
import { RefreshCw, Zap } from "lucide-react";

const WebhookPayloadModal = ({ isOpen, onClose, webhook }: WebhookPayloadModalProps) => {
  const webhookId = (typeof webhook?._id === "string" ? webhook._id : webhook?._id?.$oid) || webhook?.id;

  const { data, isLoading, isFetching, refetch } = useGetWebhookQuery(webhookId as string, {
    skip: !isOpen || !webhookId || (typeof webhook?.first_payload === "object" && !!webhook?.first_payload && typeof webhook?.first_payload_flattened === "object" && !!webhook?.first_payload_flattened),
  });

  const [viewMode, setViewMode] = useState<"json" | "flattened">("json");

  const payload = typeof webhook?.first_payload === "object" ? webhook.first_payload : data?.webhook.first_payload;
  const flattenedPayload = typeof webhook?.first_payload_flattened === "object" ? webhook.first_payload_flattened : data?.webhook.first_payload_flattened;
  const jsonString = payload ? JSON.stringify(payload, null, 2) : "// No payload received yet";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl! max-w-[calc(100%-2rem)] max-h-[90vh] gap-0 flex flex-col p-0! overflow-hidden rounded-2xl border-none shadow-2xl bg-white dark:bg-(--card-color)">
        <DialogHeader className="sm:p-6 p-4 pb-6 border-b border-slate-100 dark:border-(--card-border-color)">
          <div className="flex items-center flex-wrap justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                <Zap size={22} fill="currentColor" />
              </div>
              <DialogTitle className="text-xl text-left rtl:text-right flex-wrap text-nowrap font-medium tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                Webhook Payload: <span className="text-primary">{webhook?.webhook_name}</span>
                <InfoModal dataKey="webhook_payload" iconSize={18} className="mt-0.5 opacity-60 hover:opacity-100" />
              </DialogTitle>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isLoading || isFetching} className="h-10 dark:bg-(--page-body-bg) px-4 gap-2 border-[var(--primary-opacity-20)] text-primary hover:bg-light-primary dark:border-primary/20 dark:hover:bg-primary/10 rounded-lg font-bold transition-all active:scale-95 shadow-sm">
              <RefreshCw className={`h-4 w-4 ${isLoading || isFetching ? "animate-spin" : ""}`} />
              Sync Payload
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden sm:p-6 p-4 flex flex-col space-y-4 bg-slate-50/30 dark:bg-(--card-color)">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-medium text-slate-400 leading-none">Live Payload Output</span>
              {isFetching && <span className="text-[10px] text-primary animate-pulse font-bold tracking-tighter uppercase">(Syncing...)</span>}
            </div>
            <div className="flex items-center bg-slate-100 dark:bg-(--page-body-bg) p-1 rounded-lg gap-1">
              <Button onClick={() => setViewMode("json")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === "json" ? "bg-primary text-white shadow-sm" : "text-slate-400 bg-[unset]! hover:text-slate-600 dark:hover:text-slate-200"}`}>
                JSON Format
              </Button>
              <Button onClick={() => setViewMode("flattened")} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${viewMode === "flattened" ? "flex items-center bg-primary text-white shadow-sm" : "text-slate-400 bg-[unset]! hover:text-slate-600 dark:hover:text-slate-200"}`}>
                Form Format
              </Button>
            </div>
          </div>

          <div className="flex-1 bg-slate-900 dark:bg-slate-950 rounded-lg sm:p-6 p-4 font-mono text-[13px] text-primary overflow-auto border border-slate-200/10 dark:border-(--card-border-color) relative group custom-scrollbar leading-relaxed">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md rounded-lg gap-3">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Fetching Data...</p>
              </div>
            ) : viewMode === "json" ? (
              <pre className="selection:bg-primary/30 selection:text-white">{jsonString}</pre>
            ) : (
              <div className="space-y-3">
                {flattenedPayload && Object.keys(flattenedPayload).length > 0 ? (
                  Object.entries(flattenedPayload).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                      <span className="text-slate-400 min-w-55 shrink-0 font-medium text-[12px]">{key}</span>
                      <span className="text-primary break-all text-[13px]">{typeof value === "string" ? `"${value}"` : String(value)}</span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center py-10">
                    <p className="text-slate-500 italic text-sm">{"// No flattened payload data available"}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:p-6 p-4 sm:px-8 px-4 bg-white dark:bg-(--card-color) border-t border-slate-100 dark:border-(--card-border-color) flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Preview Mode Only</p>
          <div className="flex items-center gap-3 w-full flex-wrap sm:w-auto">
            <Button variant="ghost" onClick={onClose} className="flex-1 sm:flex-none h-11 rounded-lg px-6 text-slate-500 font-bold hover:bg-slate-100 dark:bg-(--page-body-bg) dark:text-white dark:hover:bg-(--table-hover) transition-all">
              Close Preview
            </Button>
            <Button onClick={onClose} className="flex-1 sm:flex-none h-11 bg-primary hover:bg-primary text-white rounded-lg px-8 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all border-none">
              Done
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebhookPayloadModal;
