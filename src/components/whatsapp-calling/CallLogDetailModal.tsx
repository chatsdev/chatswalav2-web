/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ImageBaseUrl } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { useGetCallLogByIdQuery } from "@/src/redux/api/whatsappCallingApi";
import { cn } from "@/src/utils";
import { Bot, Copy, Download, FileText, Loader2, Mic, User } from "lucide-react";
import { toast } from "sonner";

interface CallLogDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  callLogId: string;
  type: "recording" | "transcript";
}

const CallLogDetailModal = ({ isOpen, onClose, callLogId, type }: CallLogDetailModalProps) => {
  const { data: log, isLoading } = useGetCallLogByIdQuery(callLogId, {
    skip: !isOpen || !callLogId,
  });

  const handleCopyTranscript = () => {
    if (!log?.transcription) return;
    navigator.clipboard.writeText(log.transcription);
    toast.success("Transcript copied to clipboard");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-slate-500 text-sm">Fetching call details...</p>
        </div>
      );
    }

    if (!log) {
      return <div className="py-12 text-center text-slate-500">No data found for this call.</div>;
    }

    if (type === "recording") {
      const recordings = log.recordings || { user: [], agent: [] };
      const hasRecordings = (recordings.user?.length || 0) + (recordings.agent?.length || 0) > 0;

      if (!hasRecordings) {
        return (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <Mic className="w-12 h-12 mx-auto text-slate-200" />
            <p>No audio recordings available for this call.</p>
          </div>
        );
      }

      return (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Main Recording if exists */}
          {log.recording_url && (
            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Full Call Recording</span>
                <Button variant="ghost" size="sm" className="h-8 text-primary hover:bg-primary/10" onClick={() => window.open(log.recording_url, "_blank")}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <audio controls className="w-full h-10">
                <source src={ImageBaseUrl + log.recording_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* User Recordings */}
          {recordings.user?.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <User size={16} className="text-slate-400" />
                User Recordings ({recordings.user.length})
              </h4>
              <div className="grid gap-3">
                {recordings.user.map((url: string, index: number) => (
                  <div key={`user-${index}`} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 w-12 shrink-0">Clip {index + 1}</span>
                    <audio controls className="flex-1 h-8">
                      <source src={ImageBaseUrl + url} type="audio/mpeg" />
                    </audio>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Recordings */}
          {recordings.agent?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Bot size={16} className="text-slate-400" />
                Agent Recordings ({recordings.agent.length})
              </h4>
              <div className="grid gap-3">
                {recordings.agent.map((url: string, index: number) => (
                  <div key={`agent-${index}`} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-xs font-medium text-slate-500 w-12 shrink-0">Clip {index + 1}</span>
                    <audio controls className="flex-1 h-8">
                      <source src={ImageBaseUrl + url} type="audio/mpeg" />
                    </audio>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (type === "transcript") {
      const messages = log.transcription_json || [];

      if (messages.length === 0 && !log.transcription) {
        return (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <FileText className="w-12 h-12 mx-auto text-slate-200" />
            <p>No transcript available for this call.</p>
          </div>
        );
      }

      return (
        <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Individual Messages */}
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg: any, index: number) => (
                <div key={index} className="flex flex-col space-y-1.5 animate-in slide-in-from-bottom-2 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className={`flex items-center justify-between ${msg.role === "agent" ? "self-start" : "self-end"}`}>
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1 rounded-md", msg.role === "agent" ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-600")}>{msg.role === "agent" ? <Bot size={12} /> : <User size={12} />}</div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{msg.role === "agent" ? log.agent_id?.name || "Agent" : "User"}</span>
                    </div>
                  </div>
                  <div className={cn("p-3 rounded-2xl text-sm leading-relaxed shadow-sm", msg.role === "agent" ? "bg-primary text-white rounded-tl-none self-start max-w-[90%]" : "bg-slate-100 text-slate-700 rounded-tr-none self-end max-w-[90%]")}>{msg.text}</div>
                  {msg.timestamp && <span className={`text-[10px] text-slate-400 ${msg.role === "agent" ? "self-start" : "self-end"}`}>{new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>}
                </div>
              ))}
            </div>
          ) : (
            /* Fallback Plain Text */
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{log.transcription}</div>
          )}
        </div>
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-150 p-0! overflow-hidden rounded-2xl border-none shadow-2xl gap-0">
        <DialogHeader className="sm:p-6 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-3 text-xl font-bold">
                <div className="p-2 bg-primary/20 rounded-lg">{type === "recording" ? <Mic size={24} className="text-primary" /> : <FileText size={24} className="text-primary" />}</div>
                <div className="flex flex-col text-xl font-bold">
                  {type === "recording" ? "Call Recordings" : "Call Transcript"}
                  <div className="mt-1 text-slate-400 text-xs flex items-center gap-2 font-medium">
                    <span>Call ID: {log?.call_type || "..."}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <span>{log?.created_at ? new Date(log.created_at).toLocaleString() : "..."}</span>
                  </div>
                </div>
              </DialogTitle>
            </div>
            {type === "transcript" && log?.transcription && (
              <Button variant="outline" size="sm" className="py-5 px-3 bg-white/5 border-slate-300 text-slate-500 hover:bg-white/10" onClick={handleCopyTranscript}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="p-6 pt-2 bg-white dark:bg-slate-900">{renderContent()}</div>

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-white dark:bg-slate-900 capitalize px-3 py-0.5 text-xs">
              {log?.status || "completed"}
            </Badge>
            <span className="text-[12px] text-slate-500 font-medium">Duration: {log?.duration || 0}s</span>
          </div>
          <Button variant="outline" className="rounded-lg h-10 px-6 font-bold" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallLogDetailModal;
