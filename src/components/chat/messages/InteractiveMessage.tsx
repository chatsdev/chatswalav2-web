import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import { InteractiveMessageProps } from "@/src/types/components/chat";
import { Download, FileText, List, Loader2, Maximize2, ExternalLink } from "lucide-react";
import React, { useState } from "react";
import BaseMessage from "./BaseMessage";
import ListViewModal from "./ListViewModal";
import { getResolvedImageUrl } from "@/src/utils/image";
import Images from "@/src/shared/Image";
import { toast } from "sonner";

const InteractiveMessage: React.FC<InteractiveMessageProps> = ({ message, isWindowExpired, onImageClick }) => {
  const { interactiveData } = message;
  const isOutgoing = message.direction === "outbound";
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const resolvedUrl = getResolvedImageUrl(message.fileUrl);
  const fileName = message.fileUrl?.split("/").pop() || "Document";

  const getMediaType = (url: string) => {
    const cleanUrl = url.split("?")[0];
    const ext = cleanUrl.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return "image";
    if (["mp4", "webm"].includes(ext || "")) return "video";
    return "document";
  };

  const getCtaUrlButton = () => {
    if (!interactiveData || interactiveData.interactiveType !== "cta_url") return null;

    const btns = interactiveData.buttons;
    if (!btns) {
      // Fallback for old messages if url can be parsed from text
      const content = message.content || "";
      const isOrder = content.includes("Order Information");
      return {
        text: isOrder ? "View Order" : "View Product",
        url: "#"
      };
    }

    if (Array.isArray(btns)) {
      const firstBtn = btns[0];
      if (firstBtn) {
        return {
          text: firstBtn.text || firstBtn.display_text || firstBtn.title || (message.content?.includes("Order Information") ? "View Order" : "View Product"),
          url: firstBtn.url || firstBtn.link || "#"
        };
      }
    }

    if (typeof btns === "object") {
      return {
        text: btns.text || btns.display_text || btns.title || (message.content?.includes("Order Information") ? "View Order" : "View Product"),
        url: btns.url || btns.link || "#"
      };
    }

    return null;
  };

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
      window.open(resolvedUrl, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  const renderMedia = () => {
    if (!message.fileUrl) return null;
    const mediaType = getMediaType(message.fileUrl);

    if (mediaType === "image") {
      const isCtaUrl = interactiveData?.interactiveType === "cta_url";
      return (
        <div
          className={cn(
            "relative overflow-hidden cursor-pointer group w-full",
            isCtaUrl
              ? "h-64 bg-white dark:bg-slate-900/90 flex items-center justify-center border-b border-slate-100 dark:border-white/10"
              : "aspect-video"
          )}
          onClick={() => onImageClick?.(message.fileUrl!)}
        >
          <Images
            src={message.fileUrl}
            alt="Media"
            fill
            className={cn(
              "transition-transform duration-500 group-hover:scale-105",
              isCtaUrl ? "object-contain p-4" : "object-cover"
            )}
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 size={24} className="text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
          </div>
        </div>
      );
    }

    if (mediaType === "video") {
      return (
        <div className="relative overflow-hidden w-full aspect-video bg-black/10">
          <video src={resolvedUrl} className="w-full h-full object-cover" controls poster="" />
        </div>
      );
    }

    return (
      <div className="p-3 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
          <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 text-primary">
            <FileText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate leading-tight dark:text-slate-200">{fileName}</p>
            <p className="text-[10px] text-slate-500 opacity-80 uppercase font-bold mt-0.5">{fileName.split("?")[0].split(".").pop()}</p>
          </div>
          <Button onClick={handleDownload} disabled={isDownloading} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-gray-500 disabled:opacity-50">
            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          </Button>
        </div>
      </div>
    );
  };

  if (!interactiveData) {
    return (
      <BaseMessage message={message} isWindowExpired={isWindowExpired}>
        <div className={`flex flex-col -mx-3 sm:-mx-4 -my-1.5 mb-1.5 min-w-50 max-w-[300px] overflow-hidden ${isOutgoing ? "rounded-lg rounded-te-none" : "rounded-lg rounded-ts-none"}`}>
          {renderMedia()}
          <p className="whitespace-pre-wrap wrap-break-word leading-relaxed text-[14px] px-4 py-2">{message.content}</p>
        </div>
      </BaseMessage>
    );
  }

  return (
    <>
      <BaseMessage message={message} isWindowExpired={isWindowExpired}>
        <div className={`flex flex-col -mx-3 sm:-mx-4 -my-1.5 mb-1.5 min-w-50 max-w-[300px] overflow-hidden ${isOutgoing ? "rounded-lg rounded-te-none" : "rounded-lg rounded-ts-none"}`}>
          {renderMedia()}
          {interactiveData?.list?.header && (
            <div className={cn("ps-4 pe-3 pt-3 pb-1.5", isOutgoing ? "border-b border-white/10" : "border-b border-slate-100 dark:border-white/10")}>
              <p className={cn("text-[13px] font-bold tracking-tight", isOutgoing ? "text-primary/90 dark:text-white/80" : "text-slate-700 dark:text-slate-200")}>{interactiveData.list.header}</p>
            </div>
          )}

          {interactiveData?.interactiveType === "button" && message.content && <div className="px-3 pt-3 pb-0">{/* no extra header label needed for button type */}</div>}

          <div className="ps-4 pe-3 py-2">{message.content && <p className={cn("whitespace-pre-wrap wrap-break-word leading-relaxed text-[14px]", isOutgoing ? "text-slate-600 dark:text-gray-300" : "text-slate-600 dark:text-gray-400")}>{message.content}</p>}</div>

          {interactiveData?.list?.footer && (
            <div className="ps-4 pe-3 pb-2">
              <p className="text-[11px] text-slate-400 dark:text-gray-500">{interactiveData.list.footer}</p>
            </div>
          )}

          {interactiveData?.interactiveType === "button" && interactiveData.buttons && (
            <div className={cn("flex flex-col border-t m-1 mx-2 gap-1 pt-1", isOutgoing ? "border-white/10" : "border-slate-100 dark:border-white/10")}>
              {interactiveData.buttons.map((btn: any, index: number) => (
                <Button key={index} className={cn("w-full text-[13.5px] py-1.5 border rounded-lg font-semibold transition-colors text-center", isOutgoing ? "border-white/20 text-white hover:bg-white/10" : "border-primary/20 text-primary hover:bg-light-primary dark:border-primary/20 dark:hover:bg-primary/10")} disabled>
                  {btn.title}
                </Button>
              ))}
            </div>
          )}

          {interactiveData?.interactiveType === "list" && interactiveData.list && (
            <div className={cn("border-t m-1 mx-2 pt-1", isOutgoing ? "border-white/10" : "border-slate-100 dark:border-white/10")}>
              <div onClick={() => setIsListModalOpen(true)} className={cn("flex items-center justify-center gap-2 cursor-pointer px-4 py-1.5 border rounded-lg transition-colors", isOutgoing ? "border-primary/50 hover:bg-white/10 dark:hover:bg-(--table-hover) " : "border-primary/20 hover:bg-light-primary dark:hover:bg-primary/10")}>
                <List size={15} className={isOutgoing ? "text-primary" : "text-primary"} />
                <span className={cn("text-[13.5px] font-bold", isOutgoing ? "text-slate-600 dark:text-gray-500" : "text-white/80")}>{interactiveData.list.buttonTitle}</span>
              </div>
            </div>
          )}

          {interactiveData?.interactiveType === "flow" && interactiveData.flow_cta && (
            <div className={cn("border-t m-1 mx-2 pt-1", isOutgoing ? "border-white/10" : "border-slate-100 dark:border-white/10")}>
              <Button className={cn("w-full text-[13.5px] py-1.5 border rounded-lg font-semibold transition-colors text-center", isOutgoing ? "border-white/20 text-white hover:bg-white/10" : "border-primary/20 text-primary hover:bg-light-primary dark:border-primary/20 dark:hover:bg-primary/10")} disabled>
                {interactiveData.flow_cta}
              </Button>
            </div>
          )}

          {interactiveData?.interactiveType === "cta_url" && (
            <div className="border-t border-slate-100 dark:border-(--card-border-color) mt-1">
              {(() => {
                const ctaBtn = getCtaUrlButton();
                if (!ctaBtn) return null;
                return (
                  <a
                    href={ctaBtn.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[unset]! h-[unset]! flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold text-sky-500! dark:text-sky-400! hover:bg-primary/10! dark:hover:bg-slate-800/50! transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{ctaBtn.text}</span>
                  </a>
                );
              })()}
            </div>
          )}
        </div>
      </BaseMessage>

      {interactiveData?.list && <ListViewModal isOpen={isListModalOpen} onClose={() => setIsListModalOpen(false)} data={interactiveData.list} />}
    </>
  );
};

export default InteractiveMessage;
