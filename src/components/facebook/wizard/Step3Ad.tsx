/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MediaSelectionModal from "@/src/components/chat/MediaSelectionModal";
import { CREATIVE_TYPES, WELCOME_TYPES } from "@/src/data/facebook";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import { Textarea } from "@/src/elements/ui/textarea";
import { cn } from "@/src/lib/utils";
import { useGetAutomationFlowsQuery } from "@/src/redux/api/automationApi";
import { useGetConnectedFacebookLeadFormsQuery } from "@/src/redux/api/facebookApi";
import PlanFeature from "@/src/shared/PlanFeature";
import { FieldArray, useFormikContext } from "formik";
import {
  Image as ImageIcon,
  Loader2,
  PlayCircle,
  Plus,
  Trash2,
} from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { AdPreview } from "../preview/AdPreview";

const Step3Ad: React.FC = () => {
  const { t } = useTranslation();
  const { values, errors, touched, setFieldValue, handleBlur } =
    useFormikContext<any>();

  const [isMediaModalOpen, setIsMediaModalOpen] = React.useState(false);
  const [activeCardIndex, setActiveCardIndex] = React.useState<number | null>(
    null,
  );
  const [mediaTarget, setMediaTarget] = React.useState<
    "video_url" | "image_url" | null
  >(null);

  const { data: flowsData, isLoading: isLoadingFlows } =
    useGetAutomationFlowsQuery({ limit: 100 });
  const { data: leadFormsData, isLoading: isLoadingLeadForms } =
    useGetConnectedFacebookLeadFormsQuery();

  const ad = values?.ad_sets?.[0]?.ads?.[0];
  const adPath = "ad_sets[0].ads[0]";

  if (!ad) return null;

  const handleMediaSelect = (selectedMedia: any[]) => {
    if (selectedMedia.length > 0) {
      const media = selectedMedia[0];

      if (activeCardIndex !== null) {
        setFieldValue(
          `${adPath}.ad_creative.carousel_cards[${activeCardIndex}].image_url`,
          media.fileUrl,
        );
        if (media.localFile) {
          setFieldValue(
            `${adPath}.ad_creative.carousel_cards[${activeCardIndex}].local_file`,
            media.localFile,
          );
        } else {
          setFieldValue(
            `${adPath}.ad_creative.carousel_cards[${activeCardIndex}].local_file`,
            null,
          );
        }
      } else {
        const field =
          ad.creative_type === "VIDEO"
            ? mediaTarget || "video_url"
            : "image_url";
        setFieldValue(`${adPath}.ad_creative.${field}`, media.fileUrl);

        if (media.localFile) {
          if (field === "video_url") {
            setFieldValue(`${adPath}.local_file`, media.localFile);
          } else if (field === "image_url" && ad.creative_type === "VIDEO") {
            setFieldValue(`${adPath}.thumbnail_local_file`, media.localFile);
          } else {
            setFieldValue(`${adPath}.local_file`, media.localFile);
          }
        } else {
          if (field === "video_url") {
            setFieldValue(`${adPath}.local_file`, null);
          } else if (field === "image_url" && ad.creative_type === "VIDEO") {
            setFieldValue(`${adPath}.thumbnail_local_file`, null);
          } else {
            setFieldValue(`${adPath}.local_file`, null);
          }
        }
      }
    }
    setActiveCardIndex(null);
    setMediaTarget(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-10 items-start animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="space-y-6 sm:space-y-8 lg:col-span-6">
        <div className="flex flex-col gap-1 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 text-primary dark:text-primary">
            <PlayCircle size={18} className="sm:w-5 sm:h-5" />
            <h2 className="text-lg sm:text-xl font-bold">{t("ad_info")}</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t("ad_info_desc")}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          <div className="space-y-2.5 sm:col-span-2">
            <Label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("ad_name")} <span className="text-red-500">*</span>
            </Label>
            <Input
              name={`${adPath}.name`}
              placeholder={t("enter_ad_name")}
              value={ad.name || ""}
              onChange={(e) => setFieldValue(`${adPath}.name`, e.target.value)}
              onBlur={handleBlur}
              className={cn(
                "h-10 sm:h-11 bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm sm:text-base",
                (touched.ad_sets as any)?.[0]?.ads?.[0]?.name &&
                  (errors.ad_sets as any)?.[0]?.ads?.[0]?.name
                  ? "border-red-500 bg-red-50/10"
                  : "",
              )}
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("creative_type")}
            </Label>
            <Select
              value={ad.creative_type || "IMAGE"}
              onValueChange={(val) =>
                setFieldValue(`${adPath}.creative_type`, val)
              }
            >
              <SelectTrigger className="h-10 sm:h-11 py-5 sm:py-5.5 mb-0! bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) text-sm sm:text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)">
                {CREATIVE_TYPES.map((type) => (
                  <SelectItem
                    className="dark:hover:bg-(--table-hover) text-sm"
                    key={type.value}
                    value={type.value}
                  >
                    {t(type.label)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {values.objective === "OUTCOME_LEADS" && (
          <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              {t("lead_gen_form", "Lead Generation Form")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={ad.lead_gen_form_id || ""}
              onValueChange={(val) =>
                setFieldValue(`${adPath}.lead_gen_form_id`, val)
              }
            >
              <SelectTrigger className="py-6 h-10 sm:h-11 bg-slate-50/50 dark:bg-(--page-body-bg) border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-blue-600/20 transition-all text-sm sm:text-base">
                <SelectValue
                  placeholder={t("select_lead_form", "Select Lead Form")}
                />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-slate-800">
                {isLoadingLeadForms ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                ) : (
                  leadFormsData?.data?.map((form: any) => (
                    <SelectItem
                      className="dark:hover:bg-(--table-hover) text-sm"
                      key={form.form_id}
                      value={form.form_id}
                    >
                      <div className="flex flex-col text-start">
                        <span className="font-medium">{form.form_name}</span>
                        <span className="text-[10px] text-slate-500">
                          {form.form_id}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
              {t(
                "lead_form_help",
                "Select a form to collect lead information from this ad.",
              )}
            </p>
          </div>
        )}

        <div className="sm:p-6 p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) bg-blue-50/5 dark:bg-(--card-color) space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 sm:w-1.5 sm:h-6 bg-blue-600 rounded-full"></div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 ">
              {t("ad_creative")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2.5">
                <Label className="text-xs sm:text-sm font-medium text-slate-500 ">
                  {t("ad_title")}
                </Label>
                <Input
                  value={ad.ad_creative?.title || ""}
                  onChange={(e) =>
                    setFieldValue(`${adPath}.ad_creative.title`, e.target.value)
                  }
                  placeholder={t("enter_ad_title")}
                  className="h-10 sm:h-11 bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-slate-800 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2.5">
                <Label className="text-xs sm:text-sm font-medium text-slate-500 ">
                  {t("ad_body")}
                </Label>
                <Textarea
                  value={ad.ad_creative?.body || ""}
                  onChange={(e) =>
                    setFieldValue(`${adPath}.ad_creative.body`, e.target.value)
                  }
                  placeholder={t("enter_ad_body")}
                  rows={5}
                  className="bg-(--input-color) dark:bg-(--page-body-bg) border-slate-200 dark:border-slate-800 resize-none text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {ad.creative_type !== "CAROUSEL" ? (
                <>
                  {ad.creative_type === "VIDEO" ? (
                    <>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                          <Label className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                            {t("video_url", "Video URL")}
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 sm:h-8 text-[10px] sm:text-xs font-bold gap-1 sm:gap-2 text-primary hover:text-primary-dark hover:bg-light-primary shrink-0"
                            onClick={() => {
                              setActiveCardIndex(null);
                              setMediaTarget("video_url");
                              setIsMediaModalOpen(true);
                            }}
                          >
                            <ImageIcon size={14} />{" "}
                            <span className="hidden sm:inline">
                              {t("open_media_library", "Media Library")}
                            </span>
                            <span className="sm:hidden">
                              {t("library", "Library")}
                            </span>
                          </Button>
                        </div>
                        <Input
                          value={ad.ad_creative?.video_url || ""}
                          onChange={(e) => {
                            setFieldValue(
                              `${adPath}.ad_creative.video_url`,
                              e.target.value,
                            );
                            setFieldValue(`${adPath}.local_file`, null);
                          }}
                          placeholder="https://.../video.mp4"
                          className="h-10 sm:h-11 bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) text-sm sm:text-base"
                        />
                      </div>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                          <Label className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                            {t("thumbnail_url", "Thumbnail URL")}
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 sm:h-8 text-[10px] sm:text-xs font-bold gap-1 sm:gap-2 text-primary hover:text-primary-dark hover:bg-light-primary shrink-0"
                            onClick={() => {
                              setActiveCardIndex(null);
                              setMediaTarget("image_url");
                              setIsMediaModalOpen(true);
                            }}
                          >
                            <ImageIcon size={14} />{" "}
                            <span className="hidden sm:inline">
                              {t("open_media_library", "Media Library")}
                            </span>
                            <span className="sm:hidden">
                              {t("library", "Library")}
                            </span>
                          </Button>
                        </div>
                        <Input
                          value={ad.ad_creative?.image_url || ""}
                          onChange={(e) => {
                            setFieldValue(
                              `${adPath}.ad_creative.image_url`,
                              e.target.value,
                            );
                            setFieldValue(
                              `${adPath}.thumbnail_local_file`,
                              null,
                            );
                          }}
                          placeholder="https://.../thumbnail.jpg"
                          className="h-10 sm:h-11 bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) text-sm sm:text-base"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between gap-2 overflow-hidden">
                        <Label className="text-xs sm:text-sm font-medium text-slate-500 truncate">
                          {t("media_url")}
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 sm:h-8 text-[10px] sm:text-xs font-bold gap-1 sm:gap-2 text-primary hover:text-primary-dark hover:bg-light-primary shrink-0"
                          onClick={() => {
                            setActiveCardIndex(null);
                            setMediaTarget("image_url");
                            setIsMediaModalOpen(true);
                          }}
                        >
                          <ImageIcon size={14} />{" "}
                          <span className="hidden sm:inline">
                            {t("open_media_library", "Media Library")}
                          </span>
                          <span className="sm:hidden">
                            {t("library", "Library")}
                          </span>
                        </Button>
                      </div>
                      <Input
                        value={ad.ad_creative?.image_url || ""}
                        onChange={(e) => {
                          setFieldValue(
                            `${adPath}.ad_creative.image_url`,
                            e.target.value,
                          );
                          setFieldValue(`${adPath}.local_file`, null);
                        }}
                        placeholder="https://..."
                        className="h-10 sm:h-11 bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) text-sm sm:text-base"
                      />
                    </div>
                  )}
                </>
              ) : (
                <FieldArray
                  name={`${adPath}.ad_creative.carousel_cards`}
                  render={(arrayHelpers) => (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs sm:text-sm font-medium text-slate-500">
                          {t("carousel_cards")}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 sm:h-8 text-[10px] sm:text-xs font-bold gap-1 sm:gap-2 border-blue-200 dark:border-blue-800 text-blue-600 hover:bg-blue-50"
                          onClick={() =>
                            arrayHelpers.push({
                              image_url: "",
                              headline: "",
                              description: "",
                            })
                          }
                        >
                          <Plus size={14} /> {t("add_card")}
                        </Button>
                      </div>
                      <div className="space-y-3 max-h-75 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar ">
                        {(ad.ad_creative?.carousel_cards || []).map(
                          (card: any, index: number) => (
                            <div
                              key={index}
                              className="p-3 sm:p-4 rounded-lg border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--dark-body) space-y-3 relative group"
                            >
                              <div className="flex items-center justify-between pr-8">
                                <Label className="text-[10px] sm:text-xs font-bold text-slate-400">
                                  {t("card")} #{index + 1}
                                </Label>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 sm:h-8 text-[10px] sm:text-xs font-bold gap-1 text-primary hover:bg-light-primary"
                                  onClick={() => {
                                    setActiveCardIndex(index);
                                    setIsMediaModalOpen(true);
                                  }}
                                >
                                  <ImageIcon size={14} />{" "}
                                  {t("library", "Library")}
                                </Button>
                              </div>
                              <Input
                                placeholder={t("image_url")}
                                value={card.image_url}
                                onChange={(e) => {
                                  setFieldValue(
                                    `${adPath}.ad_creative.carousel_cards[${index}].image_url`,
                                    e.target.value,
                                  );
                                  setFieldValue(
                                    `${adPath}.ad_creative.carousel_cards[${index}].local_file`,
                                    null,
                                  );
                                }}
                                className="h-9 sm:h-10 text-xs sm:text-sm border-slate-100 dark:border-slate-800"
                              />
                              <Input
                                placeholder={t("headline")}
                                value={card.headline}
                                onChange={(e) =>
                                  setFieldValue(
                                    `${adPath}.ad_creative.carousel_cards[${index}].headline`,
                                    e.target.value,
                                  )
                                }
                                className="h-9 sm:h-10 text-xs sm:text-sm border-slate-100 dark:border-slate-800"
                              />
                              <Input
                                placeholder={t("description")}
                                value={card.description}
                                onChange={(e) =>
                                  setFieldValue(
                                    `${adPath}.ad_creative.carousel_cards[${index}].description`,
                                    e.target.value,
                                  )
                                }
                                className="h-9 sm:h-10 text-xs sm:text-sm border-slate-100 dark:border-slate-800"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-50 text-red-600 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100 dark:hover:bg-red-900/20 dark:bg-red-900/20"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
          </div>

          <MediaSelectionModal
            isOpen={isMediaModalOpen}
            onClose={() => {
              setIsMediaModalOpen(false);
              setActiveCardIndex(null);
            }}
            onSelect={handleMediaSelect}
          />
        </div>

        <div className="sm:p-6 p-4 rounded-lg border border-slate-200/60 dark:border-(--card-border-color) bg-amber-50/5 dark:bg-(--card-color) space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 sm:w-1.5 sm:h-6 bg-amber-500 rounded-full"></div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 ">
              {t("welcome_experience")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="space-y-2.5">
                <Label className="text-xs sm:text-sm font-medium text-slate-500">
                  {t("greeting_text")}
                </Label>
                <Input
                  value={ad.welcome_experience?.text || ""}
                  onChange={(e) =>
                    setFieldValue(
                      `${adPath}.welcome_experience.text`,
                      e.target.value,
                    )
                  }
                  placeholder={t("welcome_greeting_placeholder")}
                  className="h-10 sm:h-11 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color) text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-xs sm:text-sm font-medium text-slate-500">
                  {t("experience_type")}
                </Label>
                <Select
                  value={ad.welcome_experience?.type || "prefilled"}
                  onValueChange={(val) =>
                    setFieldValue(`${adPath}.welcome_experience.type`, val)
                  }
                >
                  <SelectTrigger className="h-10 sm:h-11 bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-(--card-color) dark:border-(--card-border-color)">
                    {WELCOME_TYPES.map((type) => (
                      <SelectItem
                        className="dark:hover:bg-(--table-hover) text-sm"
                        key={type.value}
                        value={type.value}
                      >
                        {t(type.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <PlanFeature feature="bot_flow">
                <div className="space-y-2.5">
                  <Label className="text-xs sm:text-sm font-medium text-slate-500">
                    {t("automation_trigger")}
                  </Label>
                  <Select
                    value={ad.automation_trigger?.id || "none"}
                    onValueChange={(val) => {
                      if (val === "none") {
                        setFieldValue(`${adPath}.automation_trigger`, {
                          type_name: "none",
                          id: null,
                        });
                      } else {
                        setFieldValue(`${adPath}.automation_trigger`, {
                          type_name: "workflow",
                          id: val,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="h-10 sm:h-11 bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) text-sm sm:text-base">
                      <SelectValue
                        placeholder={t(
                          "select_automation_flow",
                          "Select Automation Flow",
                        )}
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-(--card-border-color)">
                      <SelectItem
                        className="dark:hover:bg-(--table-hover) text-sm"
                        value="none"
                      >
                        {t("none", "None")}
                      </SelectItem>
                      {isLoadingFlows ? (
                        <div className="flex items-center justify-center p-4">
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        </div>
                      ) : (
                        flowsData?.data?.map((flow: any) => (
                          <SelectItem
                            className="dark:hover:bg-(--table-hover) text-sm"
                            key={flow._id}
                            value={flow._id}
                          >
                            {flow.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </PlanFeature>

              {ad.welcome_experience?.type === "prefilled" && (
                <div className="space-y-2.5 animate-in fade-in duration-300">
                  <Label className="text-xs sm:text-sm font-medium text-slate-500 ">
                    {t("prefilled_text")}
                  </Label>
                  <Input
                    value={ad.welcome_experience?.prefilled_text || ""}
                    onChange={(e) =>
                      setFieldValue(
                        `${adPath}.welcome_experience.prefilled_text`,
                        e.target.value,
                      )
                    }
                    placeholder={t("prefilled_text_placeholder")}
                    className="h-10 sm:h-11 bg-(--input-color) dark:bg-(--page-body-bg) border-(--input-border-color) dark:border-(--card-border-color) text-sm sm:text-base"
                  />
                </div>
              )}

              {ad.welcome_experience?.type === "faq" && (
                <FieldArray
                  name={`${adPath}.welcome_experience.questions`}
                  render={(arrayHelpers) => (
                    <div className="space-y-4 animate-in fade-in duration-300">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs sm:text-sm font-medium text-slate-500 ">
                          {t("questions")}
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 sm:h-8 text-[10px] sm:text-xs font-bold gap-1 sm:gap-2 border-amber-200 dark:border-amber-800 text-amber-600 hover:bg-amber-50"
                          onClick={() =>
                            arrayHelpers.push({
                              question: "",
                              automated_response: "",
                            })
                          }
                        >
                          <Plus size={14} /> {t("add_question")}
                        </Button>
                      </div>
                      <div className="space-y-3 max-h-75 overflow-y-auto pr-1 sm:pr-2 custom-scrollbar ">
                        {(ad.welcome_experience?.questions || []).map(
                          (q: any, index: number) => (
                            <div
                              key={index}
                              className="p-3 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 relative group"
                            >
                              <Input
                                placeholder={t("question_placeholder")}
                                value={q.question}
                                onChange={(e) =>
                                  setFieldValue(
                                    `${adPath}.welcome_experience.questions[${index}].question`,
                                    e.target.value,
                                  )
                                }
                                className="h-9 sm:h-10 text-xs sm:text-sm border-slate-100 dark:border-slate-800"
                              />
                              <Input
                                placeholder={t("response_placeholder")}
                                value={q.automated_response}
                                onChange={(e) =>
                                  setFieldValue(
                                    `${adPath}.welcome_experience.questions[${index}].automated_response`,
                                    e.target.value,
                                  )
                                }
                                className="h-9 sm:h-10 text-xs sm:text-sm border-slate-100 dark:border-slate-800"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-red-50 text-red-600 sm:opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"
                                onClick={() => arrayHelpers.remove(index)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 sticky top-4 sm:top-8">
        <div className="flex items-center gap-3 mb-4 sm:mb-6 lg:hidden">
          <div className="w-1 h-5 sm:w-1.5 sm:h-6 bg-slate-800 rounded-full"></div>
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 ">
            {t("live_preview", "Live Preview")}
          </h3>
        </div>
        <AdPreview ad={ad} platform={["facebook", "instagram"]} />
      </div>
    </div>
  );
};

export default Step3Ad;
