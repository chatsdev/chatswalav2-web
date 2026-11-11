"use client";

import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { useGetTemplateQuery } from "@/src/redux/api/templateApi";
import { CampaignFormValues, Template, TemplateCarouselCard, CustomField } from "@/src/types/components";
import { FormikProps } from "formik";
import { Image as ImageIcon, Layout, ShoppingBag, Sparkles, Tag, Ticket, Timer, MapPin, Loader2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { CarouselMediaEditor } from "./CarouselMediaEditor";
import { CarouselProductEditor } from "./CarouselProductEditor";
import { CatalogProductPicker } from "./CatalogProductPicker";
import { formatExpirationTime, getTemplateVariables, hasMediaTemplateHeader, isMarketingTemplate } from "@/src/utils/template";
import { SectionCard, SectionHeading, VariableRow } from "./VariableMappingComponents";
import LocationMapPicker from "@/src/components/shared/LocationMapPicker";
import { CampaignCard, CarouselProduct } from "@/src/types/campaign";
import { CONTACT_SYSTEM_FIELDS } from "@/src/data/campaign";
import { MediaHeaderEditor } from "./components/MediaHeaderEditor";
import { LivePreviewSection } from "./components/LivePreviewSection";
import { useTranslation } from "react-i18next";

const StepVariablesMapping = ({ formik }: { formik: FormikProps<CampaignFormValues> }) => {
  const { t } = useTranslation();
  const { data: templateResult, isLoading: loadingTemplate } = useGetTemplateQuery(formik.values.template_id, {
    skip: !formik.values.template_id,
  });
  const { data: customFieldsResult } = useGetCustomFieldsQuery({});

  const template = templateResult?.data;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customFields: CustomField[] = customFieldsResult?.data?.fields || [];
  const marketingType: string = template?.template_type || "none";
  const templateCarouselCards: TemplateCarouselCard[] = template?.carousel_cards || [];

  const variables = useMemo(() => {
    return getTemplateVariables(template);
  }, [template]);

  // Auto-initialize carousel_cards_data from the template's carousel_cards
  useEffect(() => {
    if (!template || templateCarouselCards.length === 0) return;
    const isCarousel = marketingType === "carousel_media" || (marketingType === "carousel" && templateCarouselCards.length > 0);
    if (!isCarousel) return;

    // Only initialize if empty or length doesn't match template
    const current = formik.values.carousel_cards_data || [];
    if (current.length === templateCarouselCards.length) return;

    const initialized = templateCarouselCards.map((tCard) => {
      const headerComp = tCard.components?.find((c) => c.type === "header");
      const buttonsComp = tCard.components?.find((c) => c.type === "buttons");
      return {
        header: { type: headerComp?.format || "image", link: "" },
        body: "",
        buttons: (buttonsComp?.buttons || []).map((b) => ({
          type: b.type,
          text: b.text || "",
          ...(b.type === "url" ? { url_value: "" } : {}),
          ...(b.type === "quick_reply" ? { payload: "" } : {}),
        })),
      };
    });
    formik.setFieldValue("carousel_cards_data", initialized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, templateCarouselCards.length, marketingType]);

  // Auto-initialize carousel_products from the template's carousel_cards (for product carousels)
  useEffect(() => {
    if (!template || templateCarouselCards.length === 0) return;
    const isProduct = marketingType === "carousel_product" || (marketingType === "carousel" && templateCarouselCards[0]?.components?.find((c) => c.type === "header")?.format === "product");
    if (!isProduct) return;

    const current = (formik.values.carousel_products as CarouselProduct[]) || [];
    if (current.length === templateCarouselCards.length) return;

    const initialized = templateCarouselCards.map(() => ({
      product_retailer_id: "",
      catalog_id: "",
    }));
    formik.setFieldValue("carousel_products", initialized);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template, templateCarouselCards.length, marketingType]);

  const handleMappingChange = (key: string, value: string) => {
    formik.setFieldValue("variables_mapping", { ...formik.values.variables_mapping, [key]: value });
  };

  const previewVariables = useMemo(() => {
    return variables.map((v: string | { key: string; example?: string }) => {
      const key = typeof v === "string" ? v : v.key;
      const mapped = formik.values.variables_mapping?.[key];
      const displayVal = mapped ? (mapped.startsWith("{{") ? mapped.replace(/^\{\{/, "").replace(/\}\}$/, "") : mapped) : (typeof v === "object" ? v.example : undefined) || `{{${key}}}`;
      return { key, example: displayVal };
    });
  }, [variables, formik.values.variables_mapping]);

  const mappingOptions = useMemo(() => {
    const customOptions = customFields.map((f: CustomField) => ({ label: `CF: ${f.label}`, value: `cf_${f.name}` }));
    return [...CONTACT_SYSTEM_FIELDS, ...customOptions];
  }, [customFields]);

  // Early returns

  if (!formik.values.template_id) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
        <Layout className="text-slate-200 dark:text-slate-800" size={64} />
        <p className="text-slate-400 font-bold max-w-xs">{t("campaign_wizard_variables_go_back_template")}</p>
      </div>
    );
  }

  if (loadingTemplate) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
        <Loader2 className="animate-spin text-primary" size={36} />
        <p className="text-slate-400 font-bold">{t("campaign_wizard_variables_loading_template")}</p>
      </div>
    );
  }

  // Template type flags

  const isCouponTypeButton = isMarketingTemplate(template) && (template?.buttons?.some((button) => button.type === "copy_code") ?? false)
  const isCouponType = isMarketingTemplate(template) && (template?.template_type === "coupon");
  const isLimitedOffer = isMarketingTemplate(template) && (template?.template_type === "limited_time_offer");
  const isCatalog = template?.template_type === "catalog";
  const isCarouselProduct = template?.template_type === "carousel_product" || (template?.template_type === "carousel" && (template?.carousel_cards?.[0]?.components?.[0]?.format === "product" || template?.carousel_cards?.[0]?.components?.find((c) => c.type === "header")?.format === "product"));
  const isCarouselMedia = template?.template_type === "carousel_media" || (template?.template_type === "carousel" && !isCarouselProduct);
  const hasExtraFields = isCouponType || isLimitedOffer || isCatalog || isCarouselMedia || isCarouselProduct || template?.header?.format === "location";
  const hasVariables = variables.length > 0;
  const hasMediaHeader = hasMediaTemplateHeader(template);

  // Render

  return (
    <div className="h-full flex flex-col lg:flex-row gap-10 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Left: Form */}
      <div className="flex-1 space-y-8">
        {/* Section Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Sparkles className="text-primary w-6 h-6" />
          </div>
          <div>
            <h2 className="sm:text-xl text-lg font-bold text-primary">{hasExtraFields ? t("campaign_wizard_variable_config_title") : t("campaign_wizard_variable_mapping_title")}</h2>
            <p className="text-slate-400 text-sm font-medium">{hasExtraFields ? t("campaign_wizard_variable_config_desc") : t("campaign_wizard_variable_mapping_desc")}</p>
          </div>
        </div>

        {/* Body Variables */}
        {hasVariables && (
          <SectionCard>
            <SectionHeading icon={<Sparkles className="text-primary w-5 h-5" />} label={t("campaign_wizard_variables_body_title")} sub={t("campaign_wizard_variables_body_desc", { type: marketingType })} />
            <div className="space-y-4">
              {variables.map((v: string | { key: string; example?: string }, index: number) => {
                const key = typeof v === "string" ? v : v.key;
                const example = typeof v === "string" ? "N/A" : v.example || "N/A";
                if (!key) return null;
                return (
                  <VariableRow
                    key={index}
                    varKey={key}
                    example={example}
                    value={formik.values.variables_mapping?.[key] || ""}
                    onChange={(val) => handleMappingChange(key, val)}
                    mappingOptions={mappingOptions}
                    isAuthentication={template?.category === "AUTHENTICATION"}
                  />
                );
              })}
            </div>
          </SectionCard>
        )}

        {/* No variables and no extra fields */}
        {!hasVariables && !hasExtraFields && (
          <div className="bg-light-primary/50 dark:bg-(--dark-body) dark:border-none rounded-lg border border-primary/20 p-10 text-center space-y-4">
            <Sparkles className="mx-auto text-primary" size={40} />
            <p className="text-primary font-bold mb-1 text-sm">{t("campaign_wizard_variables_no_variables")}</p>
            <p className="text-xs text-slate-400 font-medium">{t("campaign_wizard_variables_proceed_recipients")}</p>
          </div>
        )}

        {/* COUPON_CODE */}
        {isCouponType && isCouponTypeButton && (
          <SectionCard>
            <SectionHeading icon={<Ticket className="text-primary w-5 h-5" />} label={t("campaign_wizard_coupon_title")} sub={t("campaign_wizard_coupon_desc")} />
            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                <Tag size={11} /> {t("campaign_wizard_coupon_value_label")}
              </Label>
              <Input name="coupon_code" placeholder={t("campaign_wizard_coupon_placeholder")} value={formik.values.coupon_code || ""} onChange={formik.handleChange} className="h-11 rounded-lg bg-slate-50 dark:bg-(--page-body-bg)" />
            </div>
          </SectionCard>
        )}

        {/* LIMITED_TIME_OFFER */}
        {isLimitedOffer && (
          <>
            <SectionCard>
              <SectionHeading icon={<Ticket className="text-primary w-5 h-5" />} label={t("campaign_wizard_coupon_title")} sub={t("campaign_wizard_limited_coupon_desc")} />
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <Tag size={11} /> {t("campaign_wizard_coupon_value_label")}
                </Label>
                <Input name="coupon_code" placeholder={t("campaign_wizard_limited_coupon_placeholder")} value={formik.values.coupon_code || ""} onChange={formik.handleChange} className="h-11 rounded-lg bg-slate-50 dark:bg-(--page-body-bg)" />
              </div>
            </SectionCard>

            <SectionCard>
              <SectionHeading icon={<Timer className="text-primary w-5 h-5" />} label={t("campaign_wizard_offer_expiration_title")} sub={t("campaign_wizard_offer_expiration_desc")} />
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
                  <Timer size={11} /> {t("campaign_wizard_offer_expiration_label")}
                </Label>
                <Input name="offer_expiration_minutes" type="number" placeholder={t("campaign_wizard_offer_expiration_placeholder")} value={formik.values.offer_expiration_minutes || ""} onChange={formik.handleChange} className="h-11 rounded-lg bg-slate-50 dark:bg-(--page-body-bg)" />
                {formik.values.offer_expiration_minutes && (
                  <p className="text-[10px] text-primary font-medium ml-1 animate-in fade-in slide-in-from-top-1">
                    {formatExpirationTime(formik.values.offer_expiration_minutes)}
                  </p>
                )}
              </div>
            </SectionCard>
          </>
        )}

        {/* CATALOG */}
        {isCatalog && (
          <SectionCard>
            <SectionHeading icon={<ShoppingBag className="text-primary w-5 h-5" />} label={t("campaign_wizard_catalog_product_title")} sub={t("campaign_wizard_catalog_product_desc")} />
            <CatalogProductPicker wabaId={formik.values.waba_id} value={formik.values.thumbnail_product_retailer_id || ""} onChange={(val) => formik.setFieldValue("thumbnail_product_retailer_id", val)} />
          </SectionCard>
        )}

        {/* MEDIA HEADER URL (non-carousel) */}
        {hasMediaHeader && !isCarouselMedia && (
          <SectionCard>
            <SectionHeading icon={<ImageIcon className="text-primary w-5 h-5" />} label={t("campaign_wizard_media_header_title")} sub={t("campaign_wizard_media_header_desc")} />
            <div className="space-y-1.5">
              <MediaHeaderEditor
                mediaUrl={formik.values.media_url}
                mediaFile={formik.values.media_file}
                mediaType={template?.header?.media_type}
                onChange={(val) => {
                  formik.setFieldValue("media_url", val.link);
                  formik.setFieldValue("media_file", val.localFile);
                }}
              />
            </div>
          </SectionCard>
        )}

        {/* LOCATION HEADER — interactive map */}
        {template?.header?.format === "location" && (
          <SectionCard>
            <SectionHeading icon={<MapPin className="text-primary w-5 h-5" />} label={t("campaign_wizard_location_info_title")} sub={t("campaign_wizard_location_info_desc")} />
            <LocationMapPicker
              value={{
                latitude: formik.values.location_data?.latitude || "",
                longitude: formik.values.location_data?.longitude || "",
                name: formik.values.location_data?.name || "",
                address: formik.values.location_data?.address || "",
              }}
              onChange={(data) => formik.setFieldValue("location_data", data)}
            />
          </SectionCard>
        )}

        {/* CAROUSEL_MEDIA */}
        {isCarouselMedia && (
          <SectionCard>
            <SectionHeading icon={<ImageIcon className="text-primary w-5 h-5" />} label={t("campaign_wizard_carousel_cards_title")} sub={t("campaign_wizard_carousel_cards_desc")} />
            <CarouselMediaEditor cards={(formik.values.carousel_cards_data as CampaignCard[]) || []} templateCards={templateCarouselCards} onChange={(cards) => formik.setFieldValue("carousel_cards_data", cards)} />
          </SectionCard>
        )}

        {/* CAROUSEL_PRODUCT */}
        {isCarouselProduct && (
          <SectionCard>
            <SectionHeading icon={<ShoppingBag className="text-primary w-5 h-5" />} label={t("campaign_wizard_product_carousel_title")} sub={t("campaign_wizard_product_carousel_desc")} />
            <CarouselProductEditor products={(formik.values.carousel_products as CarouselProduct[]) || []} templateCards={templateCarouselCards} wabaId={formik.values.waba_id} onChange={(p) => formik.setFieldValue("carousel_products", p)} />
          </SectionCard>
        )}
      </div>

      {/* Right: Preview */}
      <LivePreviewSection
        formik={formik}
        template={template}
        marketingType={marketingType}
        previewVariables={previewVariables}
        isCarouselProduct={isCarouselProduct}
        isCarouselMedia={isCarouselMedia}
      />
    </div>
  );
};

export default StepVariablesMapping;
