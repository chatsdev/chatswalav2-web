"use client";

import { WorkspaceCardProps } from "@/src/types/workspace";
import { format } from "date-fns";
import { Check, ChevronRight, Edit2, Trash2, Wifi, WifiOff } from "lucide-react";
import InfoModal from "../common/InfoModal";
import { Button } from "@/src/elements/ui/button";

export function WorkspaceCard({ workspace, isActive, onSelect, onConnectWaba, onEdit, onDelete, isAgent }: WorkspaceCardProps) {
  const isBaileys = workspace.waba_type === "baileys";
  const isWabaConnected = isBaileys ? !!workspace.waba_id && workspace.connection_status === "connected" : !!workspace.waba_id;
  const hasWabaId = !!workspace.waba_id;

  return (
    <div className={`relative flex flex-col rounded-lg border p-5 transition-all duration-250 group h-50! ${isActive ? "border-primary/60 bg-white dark:bg-(--table-hover) shadow-lg shadow-primary/10 ring-2 ring-primary/15" : "border-slate-200 dark:border-white/8 bg-white dark:bg-(--card-color) hover:border-primary/40 hover:shadow-md hover:shadow-primary/8 hover:-translate-y-0.5"}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 transition-all ${isActive ? "bg-primary text-white shadow-sm shadow-primary/30" : "bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-gray-300 group-hover:bg-primary/10 group-hover:text-primary"}`}>{workspace.name.charAt(0).toUpperCase()}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 justify-between">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm leading-snug truncate">{workspace.name}</h3>
            {isActive && (
              <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20 shrink-0">
                <Check size={8} strokeWidth={3} />
                Active
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 justify-between">
            {workspace.description ? (
              <p className="text-[11px] text-slate-400 dark:text-gray-500 line-clamp-1">{workspace.description}</p>
            ) : (
              <p className="text-[11px] text-slate-300 dark:text-gray-600 italic">No description</p>
            )}
            {!isAgent && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="rounded! bg-[unset]! w-[28px]! p-0! h-[28px]! hover:bg-primary/10! border-none! dark:bg-(--page-body-bg)! dark:border-(--card-border-color)! hover:border-none! text-primary! transition-colors"
                  title="Edit"
                >
                  <Edit2 size={12} />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="rounded! bg-[unset]! w-[28px]! p-0! h-[28px]! hover:bg-red-500/10! dark:bg-(--page-body-bg)! dark:hover:bg-red-900/20! dark:border-(--card-border-color)! hover:border-none! border-none! text-red-500! transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <div className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg w-fit ${isWabaConnected ? "bg-primary/8 text-primary" : "bg-orange-50 dark:bg-orange-900/15 text-orange-500"}`}>
          {isWabaConnected ? <Wifi size={10} /> : <WifiOff size={10} />}
          {isWabaConnected ? "WABA Connected" : hasWabaId ? "WABA Disconnected" : "No WABA"}
        </div>
        {(isWabaConnected || hasWabaId) && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] border border-slate-200 text-slate-500 dark:border-(--card-border-color) dark:text-slate-400 bg-slate-50 dark:bg-(--page-body-bg) rounded-2xl px-2">{workspace.waba_type === "baileys" ? "QR Code" : workspace.waba_type === "twilio" ? "Twilio" : "Business API"}</span>
            <InfoModal dataKey="workspace_connection" iconSize={14} className="text-slate-400 hover:text-primary transition-colors" />
          </div>
        )}
      </div>

      {workspace.created_at && <p className="text-[10px] text-slate-300 dark:text-gray-600 mt-1 mb-3">Created {format(new Date(workspace.created_at), "dd MMM yyyy")}</p>}

      <div className="flex gap-2 mt-auto">
        <Button onClick={onSelect} className="flex-1 flex items-center dark:border-none! hover:border-none! justify-center gap-1! py-2! rounded-lg! text-xs! font-bold! bg-primary! hover:bg-primary/90! active:bg-primary/80! text-white! transition-colors shadow-sm shadow-primary/20">
          Manage <ChevronRight size={12} />
        </Button>
        {!isWabaConnected && !isAgent && (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onConnectWaba();
            }}
            className="flex-1 py-2! bg-[unset]! rounded-lg! text-xs! font-bold! hover:text-primary! border! border-slate-200! dark:border-none! dark:bg-(--page-body-bg)! text-slate-600! dark:text-gray-300! hover:border-primary/50! hover:bg-primary/5! transition-all"
          >
            Connect WABA
          </Button>
        )}
      </div>
    </div>
  );
}
