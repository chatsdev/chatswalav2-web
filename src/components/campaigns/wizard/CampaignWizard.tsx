"use client";

import { ROUTES } from "@/src/constants";
import { ALL_STEPS, DIRECT_STEPS } from "@/src/data/campaign";
import { Button } from "@/src/elements/ui/button";
import { Card } from "@/src/elements/ui/card";
import { cn } from "@/src/lib/utils";
import { useCreateCampaignMutation } from "@/src/redux/api/campaignApi";
import { chatApi } from "@/src/redux/api/chatApi";
import { useGetContactsByIdQuery } from "@/src/redux/api/contactApi";
import { useGetTemplateQuery } from "@/src/redux/api/templateApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { CampaignWizardProps } from "@/src/types/campaign";
import { CampaignFormValues, Template } from "@/src/types/components";
import { useFormik } from "formik";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Send,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CampaignWizardSidebar } from "./components/CampaignWizardSidebar";
import StepBasicInfo from "./StepBasicInfo";
import StepRecipients from "./StepRecipients";
import StepScheduling from "./StepScheduling";
import StepSummary from "./StepSummary";
import StepVariablesMapping from "./StepVariablesMapping";
import StepWhatsAppConfig from "./StepWhatsAppConfig";
import {
  prepareCampaignFormData,
  sanitizeCampaignPayload,
} from "./utils/payload";
import { validateWizardStep } from "./utils/validation";

const CampaignWizard = ({ platform: platformProp }: CampaignWizardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const contactId = searchParams.get("contact_id");
  const platformParam =
    platformProp || searchParams.get("platform") || "whatsapp";
  const isDirectMode = !!contactId;

  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useAppDispatch();
  const [createCampaign, { isLoading: isCreating }] =
    useCreateCampaignMutation();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaIdFromWorkspace = selectedWorkspace?.waba_id || "";

  const [isPublishMode, setIsPublishMode] = useState(true);

  const formik = useFormik<CampaignFormValues>({
    initialValues: {
      name: isDirectMode
        ? `Direct Message - ${new Date().toLocaleString()}`
        : "",
      description: "",
      waba_id: wabaIdFromWorkspace,
      template_id: "",
      platform: platformParam,
      variables_mapping: {},
      recipient_type: "specific_contacts",
      specific_contacts: isDirectMode && contactId ? [contactId] : [],
      tag_ids: [],
      segment_ids: [],
      media_url: "",
      media_file: undefined,
      is_scheduled: false,
      is_published: true,
      avoid_unsubscribers: true,
      scheduled_at: "",
      is_recurring: false,
      recurring_pattern: "daily",
      cron_expression: "",
      recurring_end_date: "",
      batch_size: "",
      pause_between_batches: "",
      coupon_code: "",
      offer_expiration_minutes: "",
      thumbnail_product_retailer_id: "",
      carousel_cards_data: [],
      carousel_products: [],
      location_data: {
        latitude: "",
        longitude: "",
        name: "",
        address: "",
      },
    },
    onSubmit: async (values) => {
      try {
        const payload = sanitizeCampaignPayload(
          values,
          template,
          isPublishMode,
        );
        const finalPayload = prepareCampaignFormData(payload, values);

        const response = await createCampaign(finalPayload).unwrap();
        if (response.success) {
          toast.success(t("campaign_wizard_created_success"));
          if (isDirectMode) {
            dispatch(chatApi.util.invalidateTags(["Messages", "Chats"]));
          }
        } else {
          toast.error(t("campaign_wizard_created_failed"));
        }

        const redirectTo = searchParams.get("redirect_to");
        if (redirectTo) {
          router.push(redirectTo);
        } else if (isDirectMode) {
          router.push(ROUTES.WAChat);
        } else {
          if (platformParam === "telegram") {
            router.push(ROUTES.TelegramCampaigns);
          } else if (platformParam === "facebook") {
            router.push(ROUTES.FacebookCampaigns);
          } else if (platformParam === "instagram") {
            router.push(ROUTES.InstagramCampaigns);
          } else {
            router.push(ROUTES.MessageCampaigns);
          }
        }
      } catch (error) {
        const err = error as { data?: { error?: string } } | undefined;
        toast.error(err?.data?.error || t("campaign_wizard_failed_to_create"));
      }
    },
  });

  const { data: contactResponse } = useGetContactsByIdQuery(
    contactId as string,
    { skip: !contactId },
  );
  let contactSource = contactResponse?.data?.source || contactResponse?.source;

  if (contactSource === "baileys") {
    contactSource = "whatsapp";
  }

  if (contactSource === "baileys") {
    contactSource = "whatsapp";
  }

  useEffect(() => {
    if (
      isDirectMode &&
      contactSource &&
      formik.values.platform !== contactSource
    ) {
      formik.setFieldValue("platform", contactSource);
      toast.warning(
        t("campaign_wizard_adjust_platform_warning", { source: contactSource })
      );
    }
  }, [isDirectMode, contactSource, formik.values.platform, formik, t]);

  const { data: templateResult } = useGetTemplateQuery(
    formik.values.template_id,
    {
      skip: !formik.values.template_id,
    },
  );
  const template = templateResult?.data;

  const platformLabel =
    formik.values.platform === "telegram"
      ? t("platform_telegram", "Telegram")
      : formik.values.platform === "facebook"
        ? t("platform_facebook", "Facebook")
        : formik.values.platform === "instagram"
          ? t("platform_instagram", "Instagram")
          : t("platform_whatsapp", "WhatsApp");

  const STEPS = useMemo(() => {
    const baseSteps = isDirectMode ? DIRECT_STEPS : ALL_STEPS;
    return baseSteps.map((step) => {
      if (step.id === "config") {
        return {
          ...step,
          title: t("campaign_wizard_step_config_title", { platform: platformLabel }),
          description:
            formik.values.platform === "whatsapp"
              ? t("campaign_wizard_step_config_description_whatsapp")
              : t("campaign_wizard_step_config_description_other"),
        };
      }
      return {
        ...step,
        title: t(`campaign_wizard_step_${step.id}_title`),
        description: t(`campaign_wizard_step_${step.id}_description`),
      };
    });
  }, [isDirectMode, platformLabel, formik.values.platform, t]);

  const nextStep = () => {
    const error = validateCurrentStep(currentStep);
    if (error) {
      toast.error(error);
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const validateCurrentStep = (stepIdx: number) => {
    const stepId = STEPS[stepIdx]?.id;
    return validateWizardStep(stepId, formik.values, template);
  };

  const handleStepClick = (index: number) => {
    if (index === currentStep) return;

    if (index < currentStep) {
      setCurrentStep(index);
      return;
    }

    // Validate forward jumps
    for (let i = currentStep; i < index; i++) {
      const error = validateCurrentStep(i);
      if (error) {
        toast.error(error);
        return;
      }
    }
    setCurrentStep(index);
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className=" mx-auto space-y-8 sm:p-6 p-4 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <div className="flex md:flex-row md:items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
          onClick={() => router.back()}
        >
          <ArrowLeft size={24} className="text-slate-600 dark:text-slate-300" />
        </Button>
        <div className="space-y-2">
          {/* <h1 className="text-2xl font-bold tracking-tight text-primary">{t("create_campaign")}</h1> */}
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            {contactId ? t("campaign_wizard_send_template") : t("create_campaign")}
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {t("campaign_wizard_follow_steps")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 [@media(min-width:1427px)]:grid-cols-12 gap-10">
        <CampaignWizardSidebar
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={handleStepClick}
        />

        <div className="[@media(min-width:1427px)]:col-span-9">
          <Card className="sm:p-6 p-4 pb-0 rounded-lg border border-slate-100 dark:border-(--card-border-color) bg-white/50 dark:bg-(--card-color) backdrop-blur-xl shadow-md shadow-slate-200/20">
            <div className="min-h-100">
              {STEPS[currentStep]?.id === "basic" && (
                <StepBasicInfo
                  formik={formik}
                  hideChannelSelector={
                    !!platformProp || !!searchParams.get("platform")
                  }
                />
              )}
              {STEPS[currentStep]?.id === "config" && (
                <StepWhatsAppConfig formik={formik} />
              )}
              {STEPS[currentStep]?.id === "variables" && (
                <StepVariablesMapping formik={formik} />
              )}
              {STEPS[currentStep]?.id === "recipients" && (
                <StepRecipients formik={formik} />
              )}
              {STEPS[currentStep]?.id === "schedule" && (
                <StepScheduling formik={formik} />
              )}
              {STEPS[currentStep]?.id === "summary" && (
                <StepSummary formik={formik} template={template} />
              )}
            </div>

            <div className="mt-6 p-5 pb-0 flex-wrap gap-3 border-t dark:border-(--card-border-color) flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="gap-2 rounded-lg bg-gray-200 dark:hover:bg-(--table-hover) h-12 px-4.5! py-5 dark:bg-(--dark-sidebar) font-bold hover:bg-slate-100"
              >
                <ChevronLeft size={20} /> {t("campaign_wizard_back")}
              </Button>

              <div className="flex flex-wrap pb-3 items-center gap-3">
                {isLastStep && !isDirectMode && (
                  <Button
                    type="button"
                    disabled={isCreating}
                    onClick={() => {
                      const error = validateCurrentStep(currentStep);
                      if (error) {
                        toast.error(error);
                        return;
                      }
                      setIsPublishMode(false);
                      formik.handleSubmit();
                    }}
                    className="gap-2 rounded-lg h-12 px-6 font-bold border border-red-200 dark:bg-red-900/20! text-red-500 shadow-xs bg-transparent! dark:border-red-950/20!"
                  >
                    {isCreating && !isPublishMode ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      t("campaign_wizard_save_draft")
                    )}
                  </Button>
                )}

                {isLastStep ? (
                  <Button
                    type="button"
                    onClick={() => {
                      const error = validateCurrentStep(currentStep);
                      if (error) {
                        toast.error(error);
                        return;
                      }
                      setIsPublishMode(true);
                      formik.handleSubmit();
                    }}
                    disabled={isCreating}
                    className="gap-2 rounded-lg h-12 px-8 font-bold dark:text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                  >
                    {isCreating && isPublishMode ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <>
                        <Send size={20} />{" "}
                        {contactId ? t("campaign_wizard_send_template") : t("campaign_wizard_launch_campaign")}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    className="gap-2 rounded-lg h-12 px-4.5! py-5 font-bold dark:text-white bg-primary hover:bg-primary  dark:hover:bg-primary/90"
                  >
                    {t("campaign_wizard_next_step")} <ChevronRight size={20} />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CampaignWizard;
