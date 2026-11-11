import { cn } from "@/src/lib/utils";
import { ExecutionLogsProps } from "@/src/types/botFlow";
import { Terminal } from "lucide-react";
import React from "react";

export const ExecutionLogs: React.FC<ExecutionLogsProps> = ({
  executionLogs,
}) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
        <Terminal size={14} className="text-primary" />
        Live Execution Traces
      </h4>
      <div className="border border-slate-100 dark:border-(--card-border-color) rounded-lg overflow-auto bg-slate-950 dark:bg-(--page-body-bg) text-slate-200 font-mono text-sm h-[300px] p-3 overflow-y-auto space-y-1.5 no-scrollbar">
        {executionLogs.length === 0 ? (
          <div className="text-slate-500 flex items-center justify-center h-full">
            Logs will display here as nodes execute.
          </div>
        ) : (
          executionLogs.map((log: any, idx: number) => (
            <div key={idx} className="flex flex-col pb-1">
              <div className="flex justify-between items-center">
                <span
                  className={cn(
                    "font-bold text-sm",
                    log.status === "success"
                      ? "text-primary"
                      : "text-rose-400",
                  )}
                >
                  {log.status.toUpperCase()}: {log.node_type}
                </span>
                <span className="text-xs text-slate-300">
                  {new Date(log.start_time).toLocaleTimeString()}
                </span>
              </div>
              <span className="text-xs text-slate-400">
                ID: {log.node_id}
              </span>
              {log.error && (
                <span className="text-[9px] text-rose-300 bg-rose-950/30 px-1 py-0.5 mt-0.5 rounded">
                  Err: {log.error}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
