"use client";

import { Label } from "@/src/elements/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { cn } from "@/src/lib/utils";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import { CampaignFormValues, ConnectedChannel, Template } from "@/src/types/components";
import { WABAConnection } from "@/src/types/whatsapp";
import { FormikProps } from "formik";
import { CheckCircle2, Globe, Layout, Loader2, Smartphone } from "lucide-react";
import { useMemo, useEffect } from "react";
import WabaRequired from "@/src/shared/WabaRequired";
import { useAppSelector } from "@/src/redux/hooks";
import { useGetConnectedChannelsQuery } from "@/src/redux/api/channelsApi";
import { useTranslation } from "react-i18next";

const StepWhatsAppConfig = ({ formik }: { formik: FormikProps<CampaignFormValues> }) => {
  const { t } = useTranslation();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { data: connectionsResult, isLoading: loadingConnections } = useGetConnectionsQuery({});

  const { data: channelsData, isLoading: isLoadingChannels } = useGetConnectedChannelsQuery(
    { workspace_id: selectedWorkspace?._id || "" },
    { skip: !selectedWorkspace?._id || formik.values.platform === "whatsapp" }
  );

  const isTelegramConnected = !!channelsData?.data?.find((c: ConnectedChannel) => c.platform === "telegram");
  const isFacebookConnected = !!channelsData?.data?.find((c: ConnectedChannel) => c.platform === "facebook");
  const isInstagramConnected = !!channelsData?.data?.find((c: ConnectedChannel) => c.platform === "instagram");

  const connections: WABAConnection[] = useMemo(() => {
    if (!connectionsResult) return [];
    const data = Array.isArray(connectionsResult) ? connectionsResult : connectionsResult?.data;
    return (data || []) as WABAConnection[];
  }, [connectionsResult]);

  useEffect(() => {
    if (
      formik.values.platform === "whatsapp" &&
      !formik.values.waba_id &&
      connections.length > 0
    ) {
      const defaultWabaId = selectedWorkspace?.waba_id;
      const hasDefault = connections.some((c) => c.id === defaultWabaId);
      if (defaultWabaId && hasDefault) {
        formik.setFieldValue("waba_id", defaultWabaId);
      } else {
        formik.setFieldValue("waba_id", connections[0].id);
      }
    }
  }, [formik.values.platform, formik.values.waba_id, connections, selectedWorkspace, formik]);

  const { data: templatesResult, isLoading: loadingTemplates } = useGetTemplatesQuery(
    formik.values.platform === "whatsapp"
      ? { waba_id: formik.values.waba_id, platform: "whatsapp" }
      : { platform: formik.values.platform },
    {
      skip: formik.values.platform === "whatsapp" ? !formik.values.waba_id : false
    }
  );

  const templates = useMemo(() => templatesResult?.data || [], [templatesResult]);
  const finalTemplatesData = useMemo(() => {
    return templates.filter((item) => {
      if (formik.values.platform === "whatsapp") {
        return item.status === "approved";
      }
      return item.status === "approved" || !item.status;
    });
  }, [templates, formik.values.platform]);

  const platformLabel =
    formik.values.platform === "telegram" ? "Telegram" :
      formik.values.platform === "facebook" ? "Facebook" :
        formik.values.platform === "instagram" ? "Instagram" : "WhatsApp";

  if (formik.values.platform === "whatsapp" && connections.length === 0 && !loadingConnections) {
    return (
      <div className="p-4">
        <WabaRequired
          platform="whatsapp"
          title={t("waba_connection_required_title")}
          description={t("waba_connection_required_desc")}
          className="h-[calc(50vh-5rem)]!"
        />
      </div>
    );
  }

  if (isLoadingChannels && formik.values.platform !== "whatsapp") {
    return (
      <div className="p-10 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (formik.values.platform === "telegram" && !isTelegramConnected) {
    return (
      <div className="p-4">
        <WabaRequired platform="telegram" className="h-[calc(50vh-5rem)]!" />
      </div>
    );
  }

  if (formik.values.platform === "facebook" && !isFacebookConnected) {
    return (
      <div className="p-4">
        <WabaRequired platform="facebook" className="h-[calc(50vh-5rem)]!" />
      </div>
    );
  }

  if (formik.values.platform === "instagram" && !isInstagramConnected) {
    return (
      <div className="p-4">
        <WabaRequired platform="instagram" className="h-[calc(50vh-5rem)]!" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 sm:p-3.5 bg-primary/10 rounded-lg">
            <Smartphone className="text-primary w-6 h-6" />
          </div>

          <div>
            <h2 className="sm:text-xl text-lg font-bold text-primary">
              {t("campaign_wizard_platform_settings_title", { platform: platformLabel })}
            </h2>

            <p className="text-slate-500 font-medium text-sm">
              {formik.values.platform === "whatsapp"
                ? t("campaign_wizard_platform_settings_desc_whatsapp")
                : t("campaign_wizard_platform_settings_desc_other")}
            </p>
          </div>
        </div>

        {formik.values.platform === "whatsapp" && (
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-3">
              {formik.values.waba_id && connections.length > 0 ? (
                <div className="p-3 bg-primary/5 dark:bg-(--page-body-bg) rounded-lg border border-primary/20 flex flex-col items-start">
                  <p className="font-bold text-slate-700 dark:text-slate-200">
                    {connections.find((c) => c.id === formik.values.waba_id)
                      ?.name || t("campaign_wizard_selected_waba")}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {t("campaign_wizard_waba_id_label")}{" "}
                    <span className="font-bold text-primary">
                      {
                        connections.find((c) => c.id === formik.values.waba_id)
                          ?.whatsapp_business_account_id
                      }
                    </span>
                  </p>
                </div>
              ) : (
                <Select
                  value={formik.values.waba_id}
                  onValueChange={(val) => {
                    formik.setFieldValue("waba_id", val);
                    formik.setFieldValue("template_id", "");
                  }}
                >
                  <SelectTrigger className="p-5 bg-(--input-color) dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-(--card-border-color) dark:hover:bg-(--page-body-bg) h-15! font-bold text-slate-700">
                    <SelectValue
                      placeholder={
                        loadingConnections
                          ? t("campaign_wizard_loading_accounts")
                          : t("campaign_wizard_choose_account")
                      }
                      className=""
                    />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-2xl border-slate-100 dark:bg-(--card-color) dark:border-(--card-border-color)">
                    {connections.map((conn) => (
                      <SelectItem
                        key={conn.id}
                        value={conn.id}
                        className="rounded-lg dark:hover:bg-(--table-hover) py-3 px-4"
                      >
                        <div className="flex flex-col items-start text-slate-600 dark:text-gray-400">
                          <p className="font-medium">{conn.name}</p>
                          <p>
                            {t("campaign_wizard_waba_id_label")}{" "}
                            <span className="font-medium">
                              {conn.whatsapp_business_account_id}
                            </span>
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        )}
      </div>

      {(formik.values.platform !== "whatsapp" || formik.values.waba_id) ? (
        <div className="space-y-6 animate-in slide-in-from-top-4 max-h-161.75 overflow-auto custom-scrollbar">
          <div className="flex items-center justify-between flex-wrap">
            <Label className="text-sm font-medium text-slate-500 ml-1">
              {t("campaign_wizard_select_template")}
            </Label>
            <span className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-(--page-body-bg) rounded-lg text-slate-400">
              {t("campaign_wizard_approved_templates", { count: finalTemplatesData.length })}
            </span>
          </div>

          {loadingTemplates ? (
            <div className="h-40 flex items-center justify-center bg-slate-50/50 rounded-lg border dark:border-(--card-border-color) dark:bg-(--dark-sidebar) border-dashed border-slate-200">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : finalTemplatesData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {finalTemplatesData.map((tpl: Template) => {
                const isSelected = formik.values.template_id === tpl._id;
                return (
                  <div
                    key={tpl._id}
                    onClick={() => {
                      if (formik.values.template_id !== tpl._id) {
                        formik.setFieldValue("template_id", tpl._id);
                        formik.setFieldValue("variables_mapping", {});
                        formik.setFieldValue("coupon_code", "");
                        formik.setFieldValue("offer_expiration_minutes", "");
                        formik.setFieldValue("thumbnail_product_retailer_id", "");
                        formik.setFieldValue("carousel_cards_data", []);
                        formik.setFieldValue("carousel_products", []);
                        formik.setFieldValue("media_url", "");
                        formik.setFieldValue("location_data", { latitude: "", longitude: "", name: "", address: "" });
                      }
                    }}
                    className={cn(
                      "group relative p-4 rounded-lg border transition-all duration-300 cursor-pointer overflow-hidden",
                      isSelected
                        ? "bg-(--light-primary) dark:bg-(--table-hover) border-primary"
                        : "bg-white dark:bg-(--dark-body) border-slate-100 dark:border-none  dark:hover:bg-(--table-hover) hover:border-primary/40 hover:bg-slate-50/50 shadow-sm",
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 text-primary animate-in zoom-in duration-300">
                        <CheckCircle2
                          size={24}
                          fill="currentColor"
                          className="text-primary-foreground stroke-primary"
                        />
                      </div>
                    )}

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[9px] font-black capitalize px-2 py-0.5 rounded-full",
                            tpl.category === "MARKETING"
                              ? "bg-orange-50 dark:bg-(--page-body-bg) dark:text-primary text-orange-500"
                              : "bg-blue-50 dark:bg-(--page-body-bg) dark:text-primary text-blue-500",
                          )}
                        >
                          {tpl.category.toLocaleLowerCase()}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                          <Globe size={10} /> {tpl.language}
                        </div>
                      </div>

                      <h4 className="font-medium text-sm text-slate-700 dark:text-slate-200 truncate pr-8 rtl:pr-0 rtl:pl-8">
                        {tpl.template_name}
                      </h4>

                      <p className="text-[12px] text-slate-400 line-clamp-2 leading-relaxed font-medium">
                        {tpl.message_body.replace(/{{.*?}}/g, "___")}
                      </p>

                      <div className="flex items-center justify-between gap-3 pt-1 border-t dark:border-(--card-border-color)">
                        <div className="flex items-center gap-1.5">
                          <Layout size={12} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500">
                            {tpl.header?.format || t("campaign_wizard_no_header")} {t("campaign_wizard_header_suffix")}
                          </span>
                        </div>
                        <div className="">
                          <span
                            className={cn(
                              "capitalize text-[9px] font-black px-2 py-0.5 rounded-full",
                              tpl.status === "rejected"
                                ? "bg-red-50 dark:bg-(--card-color) dark:text-primary text-red-500"
                                : tpl.status === "pending"
                                  ? "bg-yellow-50 dark:bg-(--card-color) dark:text-primary text-yellow-500"
                                  : "bg-blue-50 dark:bg-(--card-color) dark:text-primary text-blue-500",
                            )}
                          >
                            {tpl.status || "approved"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center dark:bg-(--dark-sidebar) dark:border-(--card-border-color) bg-slate-50/50 rounded-lg border-2 border-dashed border-slate-200 space-y-2">
              <Layout className="text-slate-300" size={32} />
              <p className="text-slate-400 font-bold text-sm">
                {t("campaign_wizard_no_templates_found")}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="h-40 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-(--card-color) dark:hover:bg-(--table-hover) dark:border-(--card-border-color) rounded-lg border-2 border-dashed border-slate-200 space-y-2">
          <Layout className="text-slate-300" size={32} />
          <p className="text-slate-400 font-bold text-sm text-center">
            {t("campaign_wizard_select_waba_prompt")}
          </p>
        </div>
      )}
    </div>
  );
};

export default StepWhatsAppConfig;
