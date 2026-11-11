/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ChatbotPreview from "@/src/components/widgets/ChatbotPreview";
import WidgetWizardForm from "@/src/components/widgets/WidgetWizardForm";
import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/elements/ui/dialog";
import { useGetWidgetByIdQuery, useGetWidgetByPhoneNoIdQuery } from "@/src/redux/api/widgetApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { WidgetData, WidgetResponse } from "@/src/types/widget";
import { Eye, Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo, useState } from "react";
import EmbedCodeButton from "./EmbedCodeButton";
import WidgetInfoBox from "./WidgetInfoBox";
import { DEFAULTS } from "@/src/data/widget";



function normalizeServerData(data: Partial<WidgetData> & { widget_image_url?: string }): Partial<WidgetData> {
  const result = { ...data };
  if (data.widget_image_url && !data.widget_image) {
    result.widget_image = data.widget_image_url;
  }
  return result;
}

const WidgetPage: React.FC<{ isStandalone?: boolean; existingId?: string }> = ({ isStandalone = false, existingId }) => {
  const { t } = useTranslation();
  const params = useParams();
  const phoneNoId = (params.id as string) || "";

  const {
    data: widgetByIdResponse,
    isLoading: isByIdLoading,
    refetch: refetchById,
  } = useGetWidgetByIdQuery(existingId!, {
    skip: !existingId,
  });
  const {
    data: widgetByPhoneResponse,
    isLoading: isByPhoneLoading,
    refetch: refetchByPhone,
  } = useGetWidgetByPhoneNoIdQuery(phoneNoId, {
    skip: !!existingId || !phoneNoId,
  });

  const isLoading = isByIdLoading || isByPhoneLoading;
  const widgetResponse: WidgetResponse | undefined = existingId ? widgetByIdResponse : widgetByPhoneResponse;

  const [localOverrides, setLocalOverrides] = useState<Partial<WidgetData>>({});
  const [bodyBgImagePreview, setBodyBgImagePreview] = useState<string | null>(null);

  const serverData: WidgetData | undefined = widgetResponse?.data;

  const widgetData = useMemo<Partial<WidgetData>>(
    () => ({
      ...DEFAULTS,
      ...(serverData ? normalizeServerData(serverData) : {}),
      ...localOverrides,
      ...(existingId ? {} : !isStandalone ? { whatsapp_phone_number: phoneNoId } : {}),
    }),
    [existingId, serverData, localOverrides, isStandalone, phoneNoId]
  );

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const resolvedBodyBgImagePreview = useMemo(() => {
    if (bodyBgImagePreview) return bodyBgImagePreview;
    if (serverData?.body_background_image) return serverData.body_background_image;
    return null;
  }, [bodyBgImagePreview, serverData?.body_background_image]);

  const handleUpdateField = useCallback((field: keyof WidgetData, value: any) => {
    setLocalOverrides((prev) => ({ ...prev, [field]: value }));
  }, []);

  const existingEmbedCode = serverData?.embed_code || serverData?.script_tag;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-slate-400">Loading widget configuration...</p>
      </div>
    );
  }

  return (
    <div className="sm:p-8 p-4 space-y-6 pt-0!">
      <CommonHeader
        backBtn
        title={t("chatbot_widget_config")}
        description={t("chatbot_widget_config_desc")}
        rightContent={
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="xl:hidden h-10 gap-2 border-primary/30 text-primary hover:bg-primary/5 font-semibold">
                  <Eye size={16} />
                  Live Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md p-0 overflow-hidden border-none bg-transparent shadow-none">
                <DialogHeader className="hidden">
                  <DialogTitle>Chatbot Preview</DialogTitle>
                </DialogHeader>
                <div className="p-4 flex items-center justify-center">
                  <ChatbotPreview data={widgetData} bodyBgImagePreview={resolvedBodyBgImagePreview} />
                </div>
              </DialogContent>
            </Dialog>
            {existingEmbedCode && <EmbedCodeButton code={existingEmbedCode} />}
          </div>
        }
      />

      <div className="flex flex-col xl:flex-row gap-6 flex-1">
        <div className="flex-1 min-w-0">
          <WidgetWizardForm
            data={widgetData}
            onChange={handleUpdateField}
            onSuccess={() => (existingId ? refetchById?.() : refetchByPhone?.())}
            existingId={serverData?._id || existingId}
            isStandalone={isStandalone}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onBodyBgImageChange={(url, _file) => setBodyBgImagePreview(url)}
          />
        </div>

        <div className="w-full xl:w-85 xl:flex-none">
          <div className="hidden xl:flex xl:flex-col xl:items-center xl:sticky xl:top-0 h-[calc(100vh-200px)] justify-end">
            <ChatbotPreview data={widgetData} bodyBgImagePreview={resolvedBodyBgImagePreview} />
          </div>
        </div>
      </div>

      <WidgetInfoBox />
    </div>
  );
};

export default WidgetPage;
