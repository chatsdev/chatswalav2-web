/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/src/elements/ui/dialog";
import { X } from "lucide-react";
import { FormLivePreview } from "../templates/form/FormLivePreview";
import { MaterialPreviewModalProps } from "@/src/types/shared";
import { Button } from "@/src/elements/ui/button";

export const MaterialPreviewModal: React.FC<MaterialPreviewModalProps> = ({ isOpen, onClose, type, material, platform = "whatsapp" }) => {
  if (!material) return null;

  let templateType: any = "none";
  let headerText = "";
  let messageBody = "";
  let footerText = "";
  let buttons: any[] = [];
  let mediaUrl: string | undefined = undefined;
  let marketingType: any = "none";

  if (type.startsWith("ReplyMaterial") || type === "media" || type === "text") {
    const subType = type.includes("_") ? type.split("_")[1] : material.type || type;
    templateType = subType === "text" || subType === "flow" ? "none" : subType;
    messageBody = material.content || material.message || material.text || "";
    mediaUrl = material.file_url || material.file_path || material.media_url || undefined;
    if (subType === "flow") {
      buttons = [{ text: material.button_text || "Open Flow", type: "flow" }];
    }
  } else if (type === "Template") {
    const category = material.category?.toUpperCase();
    templateType = category === "AUTHENTICATION" ? "none" : material.header?.format?.toLowerCase() || "none";
    headerText = material.header?.text || "";
    messageBody = material.message_body || "";
    footerText = material.footer_text || "";
    buttons = material.buttons || [];
    mediaUrl = material.header?.media_url || undefined;

    const isCallPermission =
      material.call_permission === "true" ||
      material.call_permission === true ||
      material.template_type === "call_permission";

    if (isCallPermission) {
      marketingType = "call_permission";
    } else if (material.is_limited_time_offer) {
      marketingType = "limited_time_offer";
    } else if (category === "AUTHENTICATION") {
      marketingType = "authentication";
    } else if (category === "MARKETING") {
      const hasCatalog = material.buttons?.some((b: any) => b.type === "catalog");
      if (hasCatalog) marketingType = "catalog";
    }
  } else if (type === "Chatbot") {
    templateType = "text";
    messageBody = `*Chatbot: ${material.name}*\n\n${material.business_description || "This is an automated chatbot."}`;
  } else if (type === "EcommerceCatalog" || type === "catalog") {
    templateType = "text";
    messageBody = `*Catalog: ${material.name}*\n\nBrowse our catalog on WhatsApp.`;
    marketingType = "catalog";
  } else if (type === "Sequence" || type === "sequence") {
    templateType = "text";
    messageBody = `*Sequence: ${material.name}*\n\nThis will trigger a sequence of automated messages.`;
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[min(95vw,400px)] bg-transparent border-none shadow-none p-0 flex flex-col items-center justify-center overflow-visible">
        <DialogTitle className="sr-only">Material Preview: {material.name || "Preview"}</DialogTitle>
        <div className="w-full relative">
          <Button type="button" onClick={onClose} className="absolute -top-4 -right-2 z-50 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) shadow-lg text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-(--card-color) transition-all cursor-pointer">
            <X size={16} />
          </Button>

          <FormLivePreview templateType={templateType} headerText={headerText} messageBody={messageBody} variables_example={material.variables_example || []} footerText={footerText} buttons={buttons} headerFile={null} mediaUrl={mediaUrl} marketingType={marketingType} offerText={material.offer_text} platform={platform} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
