import { getResolvedImageUrl } from "@/src/utils/image";
import { DocumentMessageProps } from "@/src/types/components/chat";
import { Download, FileText, Loader2 } from "lucide-react";
import React, { useState } from "react";
import BaseMessage from "./BaseMessage";
import { toast } from "sonner";
import { Button } from "@/src/elements/ui/button";

const DocumentMessage: React.FC<DocumentMessageProps> = ({ message, isWindowExpired }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const resolvedUrl = getResolvedImageUrl(message.fileUrl);
  const fileName = message.fileUrl?.split("/").pop() || "Document";

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resolvedUrl || resolvedUrl === "#") return;

    try {
      setIsDownloading(true);
      const response = await fetch(resolvedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document");
      // Fallback: try opening in new tab
      window.open(resolvedUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <BaseMessage message={message} isWindowExpired={isWindowExpired}>
      <div className="flex flex-col gap-2 min-w-57.5">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 text-primary">
            <FileText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-tight">{fileName}</p>
            <p className="text-[10px] text-slate-500 opacity-80 uppercase font-bold mt-0.5">{fileName.split(".").pop()}</p>
          </div>
          <Button
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-8 w-8 flex items-center justify-center rounded-full bg-[unset]! hover:bg-primary/5! dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-gray-500 disabled:opacity-50"
          >
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </Button>
        </div>
        {message.content && <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[13.5px]">{message.content}</p>}
      </div>
    </BaseMessage>
  );
};

export default DocumentMessage;
