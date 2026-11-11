/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDraggableScroll } from "@/src/hooks/useDraggableScroll";
import { TemplateButton, TemplateMessageProps } from "@/src/types/components/chat";
import { BookImage, BookOpen, Copy, Download, ExternalLink, FileText, Gift, Loader2, MapPin, Maximize2, Phone, ShieldCheck, ShoppingBag, Smartphone } from "lucide-react";
import Images from "@/src/shared/Image";
import React, { useState } from "react";
import BaseMessage from "./BaseMessage";
import { Button } from "@/src/elements/ui/button";
import { getResolvedImageUrl } from "@/src/utils/image";
import { toast } from "sonner";

const TemplateMessage: React.FC<TemplateMessageProps> = ({ message, isWindowExpired, onImageClick }) => {
  const scrollProps = useDraggableScroll();
  const [isDownloading, setIsDownloading] = useState(false);
  const { template } = message;
  if (!template) return null;

  const mType = template.marketing_type?.toLowerCase() || "";

  const isLimitedTimeOffer = template.is_limited_time_offer || mType === "limited_time_offer";
  const isCatalog = mType === "catalog" || template.buttons?.some((b) => b.type === "catalog");
  const isAuthentication = mType === "authentication" || template.category === "AUTHENTICATION";
  const isCallPermission = mType === "call_permission" || template.call_permission;
  const isCarouselProduct = mType === "carousel_product" || (template as any).template_type === "carousel_product";
  const isCarouselMedia = mType === "carousel_media" || (template as any).template_type === "carousel_media" || (template as any).template_type === "carousel";
  const isSpecial = isLimitedTimeOffer || isCatalog || isAuthentication || isCallPermission || isCarouselProduct || isCarouselMedia;

  const handleButtonClick = (button: TemplateButton) => {
    if ((button.type === "website" || button.type === "url") && (button.website_url || button.url)) {
      window.open(button.website_url || button.url, "_blank", "noopener,noreferrer");
    } else if ((button.type === "phone" || button.type === "phone_call") && button.phone_number) {
      window.location.assign(`tel:${button.phone_number}`);
    }
  };

  const isOutgoing = message.direction === "outbound";

  const handleDownload = async (url: string, fileName: string) => {
    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download document");
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloading(false);
    }
  };

  const getRenderedBody = () => {
    let body = template.message_body || "";
    const variables = (message as any).metadata?.variables;
    if (variables) {
      if (Array.isArray(variables)) {
        variables.forEach((val: any, idx: number) => {
          const placeholder = `{{${idx + 1}}}`;
          body = body.replaceAll(placeholder, String(val ?? ""));
        });
      } else if (typeof variables === "object") {
        Object.entries(variables).forEach(([key, val]) => {
          const placeholder = `{{${key}}}`;
          body = body.replaceAll(placeholder, String(val ?? ""));
        });
      }
    }
    return body;
  };

  const getRenderedHeader = () => {
    if (!template.header || template.header.format !== "text" || !template.header.text) return null;
    let headerText = template.header.text;
    const variables = (message as any).metadata?.variables;
    if (variables) {
      if (Array.isArray(variables)) {
        variables.forEach((val: any, idx: number) => {
          const placeholder = `{{${idx + 1}}}`;
          headerText = headerText.replaceAll(placeholder, String(val ?? ""));
        });
      } else if (typeof variables === "object") {
        Object.entries(variables).forEach(([key, val]) => {
          const placeholder = `{{${key}}}`;
          headerText = headerText.replaceAll(placeholder, String(val ?? ""));
        });
      }
    }
    return headerText;
  };

  const renderHeaderMedia = () => {
    if (!template.header || template.header.format === "text" || template.header.format === "location") return null;

    const mediaUrl = message.fileUrl || template.header.media_url;
    if (!mediaUrl) return null;

    const resolvedUrl = getResolvedImageUrl(mediaUrl);
    let format: string | undefined = undefined;
    if (mediaUrl) {
      const ext = mediaUrl.split(".").pop()?.toLowerCase().split("?")[0] || "";
      if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext)) {
        format = "image";
      } else if (["mp4", "mov", "avi", "mkv", "webm", "ogg"].includes(ext)) {
        format = "video";
      } else if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "zip"].includes(ext)) {
        format = "document";
      }
    }
    if (!format) {
      const rawFormat = template.header.format === "media" ? template.header.media_type : template.header.format;
      format = rawFormat?.toLowerCase();
    } else {
      format = format.toLowerCase();
    }
    const fileName = mediaUrl.split("/").pop() || "Document";

    if (format === "image") {
      return (
        <div className="overflow-hidden mb-1 aspect-video relative cursor-pointer group" onClick={() => onImageClick?.(resolvedUrl)}>
          <Images src={resolvedUrl} alt="Template Header" fill className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Maximize2 size={24} className="text-white scale-75 group-hover:scale-100 transition-transform duration-300" />
          </div>
        </div>
      );
    }

    if (format === "video") {
      return (
        <div className="overflow-hidden mb-1 aspect-video relative bg-black/10">
          <video src={resolvedUrl} className="w-full h-full object-cover" controls poster="" />
        </div>
      );
    }

    if (format === "document") {
      return (
        <div className="px-4 py-3 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-white dark:bg-black/20 border border-slate-200 dark:border-white/5">
            <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 text-primary">
              <FileText size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-tight dark:text-slate-200">{fileName}</p>
              <p className="text-[10px] text-slate-500 opacity-80 uppercase font-bold mt-0.5">{fileName.split(".").pop()}</p>
            </div>
            <Button onClick={() => handleDownload(resolvedUrl, fileName)} disabled={isDownloading} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-gray-500 disabled:opacity-50 shadow-none bg-transparent">
              {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <BaseMessage message={message} isWindowExpired={isWindowExpired}>
      <div className={`flex flex-col -mx-3 sm:-mx-4 -my-1.5 mb-1.5 min-w-50 max-w-[300px] overflow-hidden ${isOutgoing ? "rounded-lg rounded-te-none" : "rounded-lg rounded-ts-none"}`}>
        {isLimitedTimeOffer && (
          <div className="dark:bg-(--card-color) p-3 border-b border-slate-100 dark:border-(--card-border-color) rounded-t-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 flex items-center justify-center text-primary dark:text-primary shrink-0">
                <Gift size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{template.offer_text || "Limited time offer"}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Offer ends very soon</p>
              </div>
            </div>
          </div>
        )}

        {isCatalog && (
          <div className="border-b border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2.5 p-3">
              <div className="w-12 h-12 rounded-lg bg-light-primary dark:bg-primary-darker/20 border border-[var(--primary-opacity-20)] dark:border-primary-darker flex items-center justify-center shrink-0 overflow-hidden">
                <ShoppingBag size={20} className="text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">View our catalog</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug truncate">Browse pictures and details of our offerings.</p>
              </div>
            </div>
          </div>
        )}

        {isAuthentication && (
          <div className="p-3 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700 bg-light-primary/30 dark:bg-primary-darker/10">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 flex items-center justify-center shrink-0">
              <ShieldCheck size={15} className="text-primary dark:text-primary" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight">OTP Verification</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Tap to copy your one-time code</p>
            </div>
          </div>
        )}

        {isCallPermission && (
          <div className="p-3 flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-700">
            <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
              <Phone size={15} className="text-sky-500 dark:text-sky-400" />
            </div>
            <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">Can we call you?</p>
          </div>
        )}

        {!isSpecial && template.header && (
          <>
            {template.header.format === "text" && template.header.text && (
              <div className="ps-4 pe-3 py-3 border-b border-slate-200 dark:border-(--card-border-color)">
                <h4 className="font-bold text-[14px] leading-tight dark:text-white">{getRenderedHeader()}</h4>
              </div>
            )}
            {renderHeaderMedia()}
            {template.header.format === "location" && (
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 overflow-hidden relative">
                <MapPin size={40} className="text-slate-200 dark:text-slate-700" />
              </div>
            )}
          </>
        )}

        <div className="ps-4 pe-3 py-2">
          <p className="whitespace-normal break-all leading-normal text-[13.5px] dark:text-white">{getRenderedBody()}</p>
        </div>

        {template.footer_text && (
          <div className="ps-4 pe-3 pb-2 pt-0">
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed break-all whitespace-normal">{template.footer_text}</p>
          </div>
        )}

        {(isCarouselProduct || isCarouselMedia) && template.carousel_cards && (
          <div {...scrollProps} className="mt-2 flex gap-2 overflow-x-auto ps-4 pe-3 pb-3 custom-scrollbar no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing select-none">
            {template.carousel_cards.map((card, idx) => {
              const header = card.components?.find((c: any) => c.type === "header") as any;
              const body = card.components?.find((c: any) => c.type === "body") as any;
              const buttons = (card.components?.find((c: any) => c.type === "buttons") as any)?.buttons || [];
              const mediaUrl = header?.media_url || header?.handle || null;

              return (
                <div key={idx} className="shrink-0 w-[260px] bg-white dark:bg-(--card-color) rounded-lg shadow-md border border-slate-100 dark:border-(--card-border-color) overflow-hidden flex flex-col">
                  <div className="h-32 bg-slate-100 dark:bg-(--card-color) flex items-center justify-center text-slate-300 relative overflow-hidden shrink-0">{mediaUrl ? <Images src={mediaUrl} alt={`Card ${idx + 1}`} fill className="object-cover" unoptimized /> : isCarouselProduct ? <ShoppingBag size={32} /> : <BookImage size={32} />}</div>

                  <div className="p-3 flex-1 flex flex-col min-h-0 dark:bg-(--dark-body)">
                    {isCarouselProduct && <p className="text-[12px] font-black text-slate-900 dark:text-white truncate mb-1 uppercase tracking-tight">Product {idx + 1}</p>}
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-auto">{body?.text || (isCarouselProduct ? "View details of this product in our official shop." : "No description available.")}</p>

                    <div className="mt-3 space-y-1 pt-2 border-t border-slate-50 dark:border-(--card-border-color)">
                      {buttons.length > 0 ? (
                        buttons.map((btn: any, bIdx: number) => (
                          <Button key={bIdx} onClick={() => handleButtonClick(btn)} className="w-full py-1.5 bg-[unset] text-[11px] break-all whitespace-normal font-bold text-sky-500 dark:text-sky-400 text-center hover:bg-sky-50 dark:hover:bg-sky-900/10 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                            {(btn.type === "url" || btn.type === "website") && <ExternalLink size={10} />}
                            {btn.text}
                          </Button>
                        ))
                      ) : (
                        <Button className="w-full py-1.5 text-[11px] font-bold text-white dark:text-white text-center opacity-50 cursor-default">View</Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!isCarouselProduct && !isCarouselMedia && template.buttons && template.buttons.length > 0 && (
          <div className="border-t border-slate-100 dark:border-(--card-border-color) dark:divide-y dark:divide-(--card-border-color) mt-1 divide-y divide-slate-100">
            {template.buttons.map((button: TemplateButton, index: number) => (
              <Button key={index} onClick={() => handleButtonClick(button)} className="w-full bg-[unset]! break-all whitespace-normal h-[unset]! flex items-center justify-center gap-2 py-2.5 text-[13px] font-bold text-sky-500 dark:text-sky-400 hover:bg-primary/10 dark:hover:bg-slate-800/50 transition-colors">
                {(button.type === "website" || button.type === "url") && <ExternalLink className="w-3.5 h-3.5" />}
                {(button.type === "phone" || button.type === "phone_call") && <Smartphone className="w-3.5 h-3.5" />}
                {button.type === "copy_code" && <Copy className="w-3.5 h-3.5" />}
                {button.type === "catalog" && <BookOpen className="w-3.5 h-3.5" />}
                <span>{button.type === "copy_code" ? "Copy Code" : button.text}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </BaseMessage>
  );
};

export default TemplateMessage;
