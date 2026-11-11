"use client";
import { CHANNELS } from "@/src/data/campaign";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { Textarea } from "@/src/elements/ui/textarea";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import { CampaignFormValues } from "@/src/types/components";
import { FormikProps } from "formik";
import {
  Check,
  Layout,
  MessageSquare,
  Sparkles
} from "lucide-react";
import { useEffect } from "react";
import { useAppSelector } from "@/src/redux/hooks";
import { useTranslation } from "react-i18next";

const StepBasicInfo = ({
  formik,
  hideChannelSelector = false,
}: {
  formik: FormikProps<CampaignFormValues>;
  hideChannelSelector?: boolean;
}) => {
  const { t } = useTranslation();
  const { isFeatureEnabled, getEnabledChannels } = useFeatureAccess();
  const enabled = getEnabledChannels();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);

  useEffect(() => {
    const currentPlatform = formik.values.platform;
    const isAllowed =
      currentPlatform === "whatsapp" ||
      (currentPlatform === "telegram" &&
        enabled.telegram &&
        isFeatureEnabled("tg_campaign")) ||
      (currentPlatform === "facebook" &&
        enabled.facebook &&
        isFeatureEnabled("fb_campaign")) ||
      (currentPlatform === "instagram" &&
        enabled.instagram &&
        isFeatureEnabled("ig_campaign"));

    if (!isAllowed) {
      formik.setFieldValue("platform", "whatsapp");
    }
  }, [formik.values.platform, enabled, isFeatureEnabled, formik]);

  const filteredChannels = CHANNELS.filter((channel) => {
    if (channel.id === "whatsapp") return true;
    if (channel.id === "telegram")
      return enabled.telegram && isFeatureEnabled("tg_campaign");
    if (channel.id === "facebook")
      return enabled.facebook && isFeatureEnabled("fb_campaign");
    if (channel.id === "instagram")
      return enabled.instagram && isFeatureEnabled("ig_campaign");
    return true;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-2.5 sm:p-3.5 bg-primary/10 rounded-lg">
          <Sparkles className="text-primary w-6 h-6" />
        </div>
        <div>
          <h2 className="sm:text-xl text-lg font-black text-primary tracking-tight">
            {t("campaign_wizard_basic_info_title")}
          </h2>
          <p className="text-slate-500 font-medium text-sm">
            {t("campaign_wizard_basic_info_desc")}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="group space-y-3">
          <Label
            htmlFor="name"
            className="text-sm font-medium text-slate-500 dark:text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-primary transition-colors"
          >
            <Layout size={14} /> {t("campaign_wizard_basic_name_label")}{" "}
            <span className="text-primary">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder={t("campaign_wizard_basic_name_placeholder")}
            value={formik.values.name}
            onChange={formik.handleChange}
            className="h-11 bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-(--input-color) dark:focus:bg-(--page-body-bg) transition-all rounded-lg border-slate-200 dark:border-(--card-border-color) p-3 font-medium text-lg placeholder:text-gray-400 shadow-sm focus:ring-4 focus:ring-primary/10"
          />
        </div>

        <div className="group space-y-3">
          <Label
            htmlFor="description"
            className="text-sm font-medium text-slate-500 dark:text-gray-400 ml-1 flex items-center gap-2 group-focus-within:text-primary transition-colors"
          >
            <MessageSquare size={14} /> {t("campaign_wizard_basic_desc_label")}
          </Label>
          <div className="relative">
            <Textarea
              id="description"
              name="description"
              placeholder={t("campaign_wizard_basic_desc_placeholder")}
              value={formik.values.description}
              onChange={formik.handleChange}
              className="w-full min-h-35 custom-scrollbar bg-(--input-color) dark:bg-(--page-body-bg) focus:bg-(--input-color) dark:focus:bg-(--page-body-bg) transition-all rounded-lg border border-slate-200 dark:border-(--card-border-color) p-5 font-medium resize-none focus:outline-none focus:ring-4 focus:ring-primary/10 shadow-sm placeholder:text-gray-400"
            />
          </div>
        </div>

        {!hideChannelSelector && (
          <div className="space-y-4">
            <Label className="text-sm font-medium text-slate-500 dark:text-gray-400 ml-1 flex items-center gap-2">
              <Sparkles size={14} /> {t("campaign_wizard_basic_channel_label")}
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredChannels.map((channel) => {
                const isSelected = formik.values.platform === channel.id;
                const Icon = channel.icon;
                return (
                  <div
                    key={channel.id}
                    onClick={() => {
                      formik.setFieldValue("platform", channel.id);
                      formik.setFieldValue("template_id", "");
                      formik.setFieldValue("variables_mapping", {});
                      formik.setFieldValue("coupon_code", "");
                      formik.setFieldValue("offer_expiration_minutes", "");
                      formik.setFieldValue("thumbnail_product_retailer_id", "");
                      formik.setFieldValue("carousel_cards_data", []);
                      formik.setFieldValue("carousel_products", []);
                      formik.setFieldValue("media_url", "");
                      if (channel.id !== "whatsapp") {
                        formik.setFieldValue("waba_id", "");
                      } else {
                        formik.setFieldValue("waba_id", selectedWorkspace?.waba_id || "");
                      }
                    }}
                    className={cn(
                      "relative p-5 rounded-xl border cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[140px] shadow-xs select-none hover:shadow-md",
                      isSelected
                        ? "bg-primary/5 dark:bg-primary/10 border-primary ring-2 ring-primary/20"
                        : "bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) hover:border-slate-300 dark:hover:border-slate-700",
                    )}
                  >
                    {isSelected && (
                      <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-0.5 animate-in zoom-in duration-300">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <div className="p-3 w-fit rounded-lg bg-slate-50 dark:bg-(--card-color) border border-slate-100 dark:border-(--card-border-color)">
                      <Icon
                        className="w-5 h-5"
                        style={{ color: channel.color }}
                      />
                    </div>
                    <div className="mt-4">
                      <h4 className="font-black text-sm text-slate-800 dark:text-slate-100">
                        {t(`channel_title_${channel.id}`)}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-gray-500 font-medium mt-1 leading-normal">
                        {t(`channel_desc_${channel.id}`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepBasicInfo;
