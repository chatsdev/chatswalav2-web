/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormLivePreviewProps } from "@/src/types/components/template";
import { ArrowLeft, Image as ImageIcon, Phone, Video, Info, Search, MoreVertical } from "lucide-react";
import { useEffect, useMemo } from "react";
import { TemplatePreviewBubble } from "./TemplatePreviewBubble";
import { getResolvedImageUrl } from "@/src/utils/image";
import { formatTemplateBodyHtml } from "@/src/utils/templateFormatter";

export const FormLivePreview = ({ templateType, headerText, messageBody, variables_example, footerText, buttons, headerFile, mediaUrl, marketingType = "none", offerText, productCards = [], mediaCards = [], mediaButtonTemplates = [], authData, platform = "whatsapp" }: FormLivePreviewProps) => {
  const fileUrl = useMemo(() => {
    if (headerFile) return URL.createObjectURL(headerFile);
    if (!mediaUrl) return null;
    return getResolvedImageUrl(mediaUrl);
  }, [headerFile, mediaUrl]);

  useEffect(() => {
    if (!fileUrl) return;
    return () => {
      URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const bodyText = formatTemplateBodyHtml(messageBody, variables_example);

  // Dynamic branding configuration based on the platform
  const brandConfig = useMemo(() => {
    switch (platform) {
      case "telegram":
        return {
          headerBg: "bg-[#5682a3] dark:bg-[#1f2c3a]",
          avatarBg: "bg-[#436c8d]",
          title: "Your Bot",
          subtitle: "bot",
          textColor: "text-white",
          subColor: "text-sky-100/70",
          arrowColor: "text-white",
        };
      case "facebook":
        return {
          headerBg: "bg-[#1877F2] dark:bg-[#242526] border-b border-slate-200/10",
          avatarBg: "bg-[#0d5ec4]",
          title: "Your Page",
          subtitle: "Facebook Page",
          textColor: "text-white",
          subColor: "text-blue-100/70",
          arrowColor: "text-white",
        };
      case "instagram":
        return {
          headerBg: "bg-white dark:bg-[#121212] border-b border-slate-100 dark:border-[#262626]",
          avatarBg: "bg-linear-to-tr from-[#fec564] via-[#fd5c63] to-[#d9317a]",
          title: "Your Brand",
          subtitle: "Instagram Business",
          textColor: "text-slate-900 dark:text-neutral-50",
          subColor: "text-slate-400 dark:text-neutral-500",
          arrowColor: "text-slate-800 dark:text-neutral-300",
        };
      case "whatsapp":
      default:
        return {
          headerBg: "bg-whatsapp-dark-teal dark:bg-[#1f2c34]",
          avatarBg: "bg-primary-darker dark:bg-primary-darker",
          title: "Your Brand",
          subtitle: "Business Account",
          textColor: "text-white",
          subColor: "text-white/70",
          arrowColor: "text-white",
        };
    }
  }, [platform]);

  return (
    <div className="w-full flex flex-col items-center max-w-sm mx-auto justify-center">
      <div className="w-full max-w-[320px] bg-neutral-900 rounded-[2.5rem] p-1 border border-neutral-800 shadow-2xl relative ring-1 ring-neutral-700/50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-neutral-900 rounded-b-2xl z-19"></div>
        <div className="w-full h-full bg-(--form-card-color) rounded-[2.2rem] overflow-hidden flex flex-col min-h-150 max-h-150">
          <div className={`${brandConfig.headerBg} p-4 pt-8 flex items-center gap-3 shrink-0 justify-between`}>
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <ArrowLeft size={18} className={`${brandConfig.arrowColor} cursor-pointer shrink-0`} />
              <div className={`w-8 h-8 rounded-full ${brandConfig.avatarBg} flex items-center justify-center overflow-hidden shrink-0`}>
                <ImageIcon size={16} className={`${platform === "instagram" ? "text-white" : "text-[var(--primary-opacity-30)]"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={`text-[13px] font-bold truncate tracking-wide ${brandConfig.textColor}`}>{brandConfig.title}</h4>
                <p className={`text-[9.5px] font-medium leading-none mt-0.5 ${brandConfig.subColor}`}>{brandConfig.subtitle}</p>
              </div>
            </div>

            {/* Right side header icons for authenticity */}
            <div className="flex items-center gap-3.5 pl-2 shrink-0 select-none">
              {platform === "instagram" && (
                <>
                  <Phone size={17} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                  <Video size={19} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                  <Info size={19} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                </>
              )}
              {platform === "facebook" && (
                <>
                  <Phone size={16} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                  <Video size={17} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                  <Info size={17} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                </>
              )}
              {platform === "telegram" && (
                <>
                  <Search size={16} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                  <MoreVertical size={16} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                </>
              )}
              {platform === "whatsapp" && (
                <>
                  <Video size={16} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                  <Phone size={15} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                  <MoreVertical size={16} className={`${brandConfig.arrowColor} cursor-pointer hover:opacity-80 transition-opacity`} />
                </>
              )}
            </div>
          </div>

          <TemplatePreviewBubble templateType={templateType} headerText={headerText} bodyText={bodyText} footerText={footerText} buttons={buttons} fileUrl={fileUrl} marketingType={marketingType} offerText={offerText} productCards={productCards} mediaCards={mediaCards} mediaButtonTemplates={mediaButtonTemplates} authData={authData} platform={platform} />
        </div>
      </div>
    </div>
  );
};
