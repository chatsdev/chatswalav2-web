/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/src/elements/ui/button";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Step1Campaign from "./Step1Campaign";
import Step2AdSet from "./Step2AdSet";
import Step3Ad from "./Step3Ad";
import { toast } from "sonner";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useCreateFbAdCampaignMutation,
  useCreateFbAdSetMutation,
  useCreateFbAdMutation,
  useGetFbAdCampaignByIdQuery,
  useUpdateFbAdCampaignMutation,
  useUpdateFbAdSetMutation,
  useUpdateFbAdMutation,
  useGetFbAdByIdQuery,
  useGetFbAdSetByIdQuery,
} from "@/src/redux/api/facebookApi";
import { cn } from "@/src/lib/utils";
import { Skeleton } from "@/src/elements/ui/skeleton";
import {
  Check,
  ChevronRight,
  LayoutGrid,
  MousePointer2,
  Megaphone,
  RotateCw,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { ROUTES } from "@/src/constants";
import { AdCampaignWizardProps } from "@/src/types/facebook";

const validationSchema = [
  Yup.object().shape({
    name: Yup.string().required("Campaign name is required"),
    objective: Yup.string().required("Objective is required"),
    daily_budget: Yup.number()
      .required("Budget is required")
      .min(100, "Minimum budget is 100"),
  }),
  Yup.object().shape({
    ad_sets: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().required("Ad Set name is required"),
        targeting: Yup.object().shape({
          genders: Yup.array().min(1, "Please select at least one gender"),
          publisher_platforms: Yup.array().min(
            1,
            "Please select at least one platform",
          ),
          age_range: Yup.array()
            .of(
              Yup.number()
                .nullable()
                .typeError("Age must be a number")
                .min(13, "Minimum age is 13")
                .max(65, "Maximum age is 65"),
            )
            .test("age-range", "Min age must be less than max age", (val) => {
              if (!val || val.length < 2) return true;
              if (
                val[0] === null ||
                val[1] === null ||
                typeof val[0] === "undefined" ||
                typeof val[1] === "undefined"
              )
                return true;
              return Number(val[0]) <= Number(val[1]);
            }),
        }),
      }),
    ),
  }),
  Yup.object().shape({
    ad_sets: Yup.array().of(
      Yup.object().shape({
        ads: Yup.array().of(
          Yup.object().shape({
            name: Yup.string().required("Ad name is required"),
          }),
        ),
      }),
    ),
  }),
];

const AdCampaignWizard: React.FC<AdCampaignWizardProps> = ({
  adAccountId,
  campaignId: propCampaignId,
  adsetId: propAdsetId,
  initialData: propInitialData,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params
  const queryId = searchParams.get("id");
  const queryType = searchParams.get("type"); // CAMPAIGN, ADSET, AD
  const campaignId =
    propCampaignId ||
    (queryType === "CAMPAIGN" ? queryId : searchParams.get("campaignId"));
  const adsetId =
    propAdsetId ||
    (queryType === "ADSET" ? queryId : searchParams.get("adsetId"));
  const editId = queryId;
  const editType = queryType;
  const isEditMode = !!editId && !!editType;

  // Context Fetching for shortened URLs
  const { data: adDetailData, isFetching: isFetchingAd } = useGetFbAdByIdQuery(
    editId || "",
    {
      skip: !editId || editType !== "AD" || !!campaignId,
      refetchOnMountOrArgChange: true,
    },
  );
  const { data: adsetDetailData, isFetching: isFetchingAdSet } =
    useGetFbAdSetByIdQuery(editId || "", {
      skip: !editId || editType !== "ADSET" || !!campaignId,
      refetchOnMountOrArgChange: true,
    });

  const effectiveCampaignId =
    campaignId ||
    adDetailData?.data?.campaign_id ||
    adsetDetailData?.data?.campaign_id;
  const effectiveAdAccountId =
    adAccountId ||
    adDetailData?.data?.ad_account_id ||
    adsetDetailData?.data?.ad_account_id;

  const isResolvingContext =
    isEditMode &&
    editType !== "CAMPAIGN" &&
    !effectiveCampaignId &&
    (isFetchingAd || isFetchingAdSet);

  // Data Fetching for Edit Mode
  const { data: campaignData, isFetching: isFetchingCampaign } =
    useGetFbAdCampaignByIdQuery(
      (editType === "CAMPAIGN" ? editId : effectiveCampaignId) || "",
      {
        skip: !editId || (editType !== "CAMPAIGN" && !effectiveCampaignId),
        refetchOnMountOrArgChange: true,
      },
    );

  const isFetching = isFetchingCampaign || isResolvingContext;

  // Mode detection
  const isAdMode = !!adsetId || editType === "AD";
  const isAdSetMode =
    (!!effectiveCampaignId && !isAdMode) || editType === "ADSET";
  const isCampaignMode = !isAdSetMode && !isAdMode;

  const [step, setStep] = useState(() => {
    if (editType === "AD") return 2;
    if (editType === "ADSET") return 1;
    if (editType === "CAMPAIGN") return 0;
    return isAdMode ? 2 : isAdSetMode ? 1 : 0;
  });

  const [createCampaign, { isLoading: isCampaignLoading }] =
    useCreateFbAdCampaignMutation();
  const [createAdSet, { isLoading: isAdSetLoading }] =
    useCreateFbAdSetMutation();
  const [createAd, { isLoading: isAdLoading }] = useCreateFbAdMutation();

  const [updateCampaign, { isLoading: isUpdatingCampaign }] =
    useUpdateFbAdCampaignMutation();
  const [updateAdSet, { isLoading: isUpdatingAdSet }] =
    useUpdateFbAdSetMutation();
  const [updateAd, { isLoading: isUpdatingAd }] = useUpdateFbAdMutation();

  const isLoading =
    isCampaignLoading ||
    isAdSetLoading ||
    isAdLoading ||
    isFetching ||
    isUpdatingCampaign ||
    isUpdatingAdSet ||
    isUpdatingAd;
  const isLastStep = isCampaignMode ? step === 2 : true;
  const isFirstStepOfMode = isEditMode || (isCampaignMode ? step === 0 : true);

  const initialValues = React.useMemo(() => {
    if (propInitialData) return propInitialData;
    if (campaignData?.success && campaignData.data) {
      const d = campaignData.data;

      const adSets = (d.adsets || []).map((as: any) => ({
        _id: as._id,
        campaign_id: d._id,
        name: as.name,
        billing_event: as.billing_event,
        optimization_goal: as.optimization_goal,
        daily_budget: as.daily_budget,
        targeting: as.targeting || {},
        ads: (as.ads || []).map((adDoc: any) => ({
          _id: adDoc._id,
          ad_set_id: as._id,
          name: adDoc.name,
          creative_type: adDoc.creative_type,
          ad_creative:
            adDoc.ad_creative && Object.keys(adDoc.ad_creative).length > 0
              ? adDoc.ad_creative
              : {
                  title: adDoc.headline || "",
                  body: adDoc.ad_message || "",
                  image_url: adDoc.local_media?.image || "",
                  video_url: adDoc.local_media?.video || "",
                  carousel_cards: (adDoc.local_media?.carousel || []).map(
                    (url: string) => ({
                      image_url: url,
                      headline: "",
                      description: "",
                    }),
                  ),
                },
          welcome_experience:
            adDoc.welcome_experience &&
            Object.keys(adDoc.welcome_experience).length > 0
              ? adDoc.welcome_experience
              : {
                  text: t(
                    "hi_how_can_we_help",
                    "Hi! How can we help you today?",
                  ),
                  type: "prefilled",
                  prefilled_text: t(
                    "im_interested_in_learning_more",
                    "I'm interested in learning more.",
                  ),
                  questions: [],
                },
          automation_trigger: adDoc.automation_trigger || {
            type_name: "none",
            id: null,
          },
          lead_gen_form_id: adDoc.lead_gen_form_id || null,
        })),
      }));

      // Handle Create mode within existing campaign/adset
      if (!isEditMode) {
        if (isAdMode && adsetId) {
          const targetAs = adSets.find((as: any) => as._id === adsetId);
          if (targetAs) {
            targetAs.ads.unshift({
              name: "",
              creative_type: "IMAGE",
              ad_creative: {
                title: "",
                body: "",
                image_url: "",
                video_url: "",
                carousel_cards: [],
              },
              welcome_experience: {
                text: t("hi_how_can_we_help", "Hi! How can we help you today?"),
                type: "prefilled",
                prefilled_text: t(
                  "im_interested_in_learning_more",
                  "I'm interested in learning more.",
                ),
                questions: [],
              },
              automation_trigger: { type_name: "none", id: null },
              lead_gen_form_id: null,
            });
            const idx = adSets.indexOf(targetAs);
            adSets.splice(idx, 1);
            adSets.unshift(targetAs);
          }
        } else if (isAdSetMode && campaignId) {
          adSets.unshift({
            campaign_id: campaignId,
            name: "",
            billing_event: "IMPRESSIONS",
            optimization_goal: "REACH",
            targeting: {
              geo_locations: { countries: ["US"] },
              genders: [1, 2],
              publisher_platforms: ["facebook", "instagram"],
              facebook_positions: ["feed"],
              instagram_positions: ["stream"],
              age_range: [18, 65],
            },
            ads: [
              {
                name: "",
                creative_type: "IMAGE",
                ad_creative: {
                  title: "",
                  body: "",
                  image_url: "",
                  video_url: "",
                  carousel_cards: [],
                },
                welcome_experience: {
                  text: t(
                    "hi_how_can_we_help",
                    "Hi! How can we help you today?",
                  ),
                  type: "prefilled",
                  prefilled_text: t(
                    "im_interested_in_learning_more",
                    "I'm interested in learning more.",
                  ),
                  questions: [],
                },
                automation_trigger: { type_name: "none", id: null },
                lead_gen_form_id: null,
              },
            ],
          });
        }
      }

      // Optimization for Edit Mode: Move relevant resource to index 0
      if (editType === "ADSET" && editId) {
        const idx = adSets.findIndex(
          (as: any) => String(as._id) === String(editId),
        );
        if (idx > -1) {
          const target = adSets.splice(idx, 1)[0];
          adSets.unshift(target);
        }
      } else if (editType === "AD" && editId) {
        // Find adset containing the ad
        let targetAsIdx = -1;
        let targetAdIdx = -1;
        adSets.forEach((as: any, asIdx: number) => {
          const adIdx = as.ads.findIndex(
            (a: any) => String(a._id) === String(editId),
          );
          if (adIdx > -1) {
            targetAsIdx = asIdx;
            targetAdIdx = adIdx;
          }
        });

        if (targetAsIdx > -1) {
          const adset = adSets.splice(targetAsIdx, 1)[0];
          const ad = adset.ads.splice(targetAdIdx, 1)[0];
          adset.ads.unshift(ad);
          adSets.unshift(adset);
        }
      }

      return {
        ad_account_id: effectiveAdAccountId,
        name: d.name,
        objective: d.objective,
        daily_budget: d.daily_budget,
        is_cbo: d.is_cbo,
        ad_sets: adSets,
      };
    }

    // In edit mode, if we reach here, it means campaignData is not yet available
    if (isEditMode) return null;

    return {
      ad_account_id: effectiveAdAccountId,
      name: "",
      objective: "OUTCOME_TRAFFIC",
      daily_budget: 100,
      is_cbo: true,
      ad_sets: [
        {
          campaign_id: effectiveCampaignId || "",
          name: "",
          billing_event: "IMPRESSIONS",
          optimization_goal: "REACH",
          targeting: {
            geo_locations: { countries: ["US"] },
            genders: [1, 2],
            publisher_platforms: ["facebook", "instagram"],
            facebook_positions: ["feed"],
            instagram_positions: ["stream"],
            age_range: [18, 65],
          },
          ads: [
            {
              ad_set_id: adsetId || "",
              name: "",
              creative_type: "IMAGE",
              ad_creative: {
                title: "",
                body: "",
                image_url: "",
                video_url: "",
                carousel_cards: [],
              },
              welcome_experience: {
                text: t("hi_how_can_we_help", "Hi! How can we help you today?"),
                type: "prefilled",
                prefilled_text: t(
                  "im_interested_in_learning_more",
                  "I'm interested in learning more.",
                ),
                questions: [],
              },
              automation_trigger: {
                type_name: "none",
                id: null,
              },
              lead_gen_form_id: null,
            },
          ],
        },
      ],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    propInitialData,
    campaignData,
    adAccountId,
    campaignId,
    adsetId,
    effectiveAdAccountId,
    effectiveCampaignId,
    isEditMode,
    editType,
    editId,
    t,
  ]);

  const handleNext = async (values: any, actions: any) => {
    if (!isEditMode && isCampaignMode && !isLastStep) {
      setStep(step + 1);
      actions.setTouched({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      try {
        if (isEditMode) {
          if (editType === "CAMPAIGN") {
            await updateCampaign({
              id: editId as string,
              body: {
                name: values.name,
                objective: values.objective,
                daily_budget: values.daily_budget,
                is_cbo: values.is_cbo,
              },
            }).unwrap();
            toast.success(
              t(
                "campaign_updated_successfully",
                "Campaign updated successfully",
              ),
            );
            router.push(`${ROUTES.FacebookAccount}/campaigns/${adAccountId}`);
          } else if (editType === "ADSET") {
            const adSet = values.ad_sets[0];
            await updateAdSet({
              id: editId as string,
              body: {
                name: adSet.name,
                daily_budget: adSet.daily_budget,
                targeting: adSet.targeting,
              },
            }).unwrap();
            toast.success(
              t("ad_set_updated_successfully", "Ad Set updated successfully"),
            );
            router.push(`${ROUTES.FacebookAccount}/adsets/${campaignId}`);
          } else if (editType === "AD") {
            const ad = values.ad_sets[0].ads[0];
            const hasLocalFiles =
              ad.local_file ||
              (ad.ad_creative?.carousel_cards || []).some(
                (card: any) => card.local_file,
              );

            if (hasLocalFiles) {
              const formData = new FormData();
              formData.append("name", ad.name);
              formData.append("creative_type", ad.creative_type);

              if (ad.local_file && ad.creative_type !== "CAROUSEL") {
                const fileField =
                  ad.creative_type === "VIDEO" ? "video" : "image";
                formData.append(fileField, ad.local_file);
              }

              if (ad.creative_type === "CAROUSEL") {
                ad.ad_creative.carousel_cards.forEach((card: any) => {
                  if (card.local_file)
                    formData.append("carousel_images", card.local_file);
                });
              }

              const cleanCreative = { ...ad.ad_creative };
              if (cleanCreative.carousel_cards) {
                cleanCreative.carousel_cards = cleanCreative.carousel_cards.map(
                  (card: any) => {
                    const { local_file, ...rest } = card;
                    return { ...rest, _has_local_file: !!local_file };
                  },
                );
              }

              formData.append("ad_creative", JSON.stringify(cleanCreative));
              formData.append(
                "welcome_experience",
                JSON.stringify(ad.welcome_experience),
              );
              formData.append(
                "automation_trigger",
                JSON.stringify(ad.automation_trigger),
              );
              if (ad.lead_gen_form_id) {
                formData.append("lead_gen_form_id", ad.lead_gen_form_id);
              }

              await updateAd({ id: editId as string, body: formData }).unwrap();
            } else {
              await updateAd({
                id: editId as string,
                body: {
                  name: ad.name,
                  ad_creative: ad.ad_creative,
                  welcome_experience: ad.welcome_experience,
                  automation_trigger: ad.automation_trigger,
                  lead_gen_form_id: ad.lead_gen_form_id,
                },
              }).unwrap();
            }
            toast.success(
              t("ad_updated_successfully", "Ad updated successfully"),
            );
            router.push(
              `${ROUTES.FacebookAccount}/ads/${adsetId || queryId || editId}`,
            );
          }
          return;
        }

        if (isCampaignMode) {
          const firstAd = values.ad_sets?.[0]?.ads?.[0];
          if (firstAd?.local_file) {
            const formData = new FormData();
            formData.append("ad_account_id", values.ad_account_id);
            formData.append("name", values.name);
            formData.append("objective", values.objective);
            formData.append("daily_budget", values.daily_budget);
            formData.append("is_cbo", String(values.is_cbo));

            const fileField =
              firstAd.creative_type === "VIDEO" ? "video" : "image";
            formData.append(fileField, firstAd.local_file);
            formData.append("ad_sets", JSON.stringify(values.ad_sets));

            await createCampaign(formData).unwrap();
          } else {
            await createCampaign(values).unwrap();
          }
          toast.success(t("campaign_created_successfully"));
          router.push(`${ROUTES.FacebookAccount}/campaigns/${adAccountId}`);
        } else if (isAdSetMode) {
          const adSetPayload = {
            ...values.ad_sets[0],
            ad_account_id: adAccountId,
          };
          await createAdSet(adSetPayload).unwrap();
          toast.success(
            t("ad_set_created_successfully", "Ad Set created successfully"),
          );
          router.push(`${ROUTES.FacebookAccount}/adsets/${campaignId}`);
        } else if (isAdMode) {
          const ad = values.ad_sets[0].ads[0];
          const hasLocalFiles =
            ad.local_file ||
            (ad.ad_creative?.carousel_cards || []).some(
              (card: any) => card.local_file,
            );

          if (hasLocalFiles) {
            const formData = new FormData();
            formData.append("ad_account_id", adAccountId as string);
            formData.append("ad_set_id", adsetId as string);
            formData.append("name", ad.name);
            formData.append("creative_type", ad.creative_type);

            if (ad.local_file && ad.creative_type !== "CAROUSEL") {
              const fileField =
                ad.creative_type === "VIDEO" ? "video" : "image";
              formData.append(fileField, ad.local_file);
            }

            if (ad.creative_type === "CAROUSEL") {
              ad.ad_creative.carousel_cards.forEach((card: any) => {
                if (card.local_file)
                  formData.append("carousel_images", card.local_file);
              });
            }

            const cleanCreative = { ...ad.ad_creative };
            if (cleanCreative.carousel_cards) {
              cleanCreative.carousel_cards = cleanCreative.carousel_cards.map(
                (card: any) => {
                  const { local_file, ...rest } = card;
                  return { ...rest, _has_local_file: !!local_file };
                },
              );
            }

            formData.append("ad_creative", JSON.stringify(cleanCreative));
            if (ad.welcome_experience) {
              formData.append(
                "welcome_experience",
                JSON.stringify(ad.welcome_experience),
              );
            }
            if (ad.lead_gen_form_id) {
              formData.append("lead_gen_form_id", ad.lead_gen_form_id);
            }

            await createAd(formData).unwrap();
          } else {
            const adPayload = {
              ...ad,
              ad_account_id: adAccountId,
              ad_set_id: adsetId,
            };
            await createAd(adPayload).unwrap();
          }
          toast.success(
            t("ad_created_successfully", "Ad created successfully"),
          );
          router.push(`${ROUTES.FacebookAccount}/ads/${adsetId}`);
        }
      } catch (err: any) {
        toast.error(
          err?.data?.error ||
            t("failed_to_process_request", "Failed to process request"),
        );
      }
    }
  };

  const handleStepClick = async (
    targetStep: number,
    validateForm: any,
    setTouched: any,
  ) => {
    if (!isCampaignMode || isEditMode) return;
    if (targetStep === step) return;

    if (targetStep < step) {
      setStep(targetStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const errors: any = await validateForm();
    if (Object.keys(errors).length === 0) {
      setStep(targetStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setTouched(errors);
      const adSetErrors = errors.ad_sets?.[0];
      if (adSetErrors?.targeting?.genders) {
        toast.error(t("error_select_gender"));
      } else if (adSetErrors?.targeting?.publisher_platforms) {
        toast.error(t("error_select_platform"));
      } else {
        toast.error(t("please_fill_required_fields"));
      }
    }
  };

  const handleFooterNext = async (
    validateForm: any,
    submitForm: any,
    setTouched: any,
  ) => {
    const errors: any = await validateForm();
    if (Object.keys(errors).length === 0) {
      if (isLastStep || isEditMode) {
        submitForm();
      } else {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      setTouched(errors);
      const adSetErrors = errors.ad_sets?.[0];
      if (adSetErrors?.targeting?.genders) {
        toast.error(
          t("error_select_gender", "Please select at least one gender"),
        );
      } else if (adSetErrors?.targeting?.publisher_platforms) {
        toast.error(
          t("error_select_platform", "Please select at least one platform"),
        );
      } else if (adSetErrors?.targeting?.age_range) {
        const ageError = Array.isArray(adSetErrors.targeting.age_range)
          ? adSetErrors.targeting.age_range.find((e: any) => e)
          : adSetErrors.targeting.age_range;
        toast.error(
          ageError || t("error_invalid_age_range", "Invalid age range"),
        );
      } else {
        toast.error(
          t("please_fill_required_fields", "Please fill all required fields"),
        );
      }
    }
  };

  const steps = [
    { title: t("broadcast_campaigns"), icon: Megaphone, id: "campaign" },
    { title: t("ad_set"), icon: LayoutGrid, id: "ad_set" },
    { title: t("ad"), icon: MousePointer2, id: "ad" },
  ];

  const getPageTitle = () => {
    if (isEditMode) {
      if (editType === "CAMPAIGN") return t("edit_campaign", "Edit Campaign");
      if (editType === "ADSET") return t("edit_ad_set", "Edit Ad Set");
      if (editType === "AD") return t("edit_ad", "Edit Ad");
    }
    if (isAdMode) return t("create_ad");
    if (isAdSetMode) return t("create_ad_set");
    return t("create_campaign");
  };

  const getPageDesc = () => {
    if (isEditMode)
      return t(
        "edit_resource_desc",
        "Update the details of your selected resource.",
      );
    if (isAdMode) return t("ad_info_desc");
    if (isAdSetMode) return t("ad_set_info_desc");
    return t("campaign_wizard_desc");
  };

  if (isFetching || (isEditMode && !initialValues)) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>

        <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg p-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                {i < 2 && <Skeleton className="flex-1 h-0.5 mx-4" />}
              </React.Fragment>
            ))}
          </div>
          <div className="space-y-8 p-4">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full rounded-lg" />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-(--card-border-color) flex items-center justify-between">
          <Skeleton className="h-11 w-32 rounded-lg" />
          <Skeleton className="h-11 w-40 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary dark:text-primary truncate">
              {getPageTitle()}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate sm:whitespace-normal">
              {getPageDesc()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="h-9 sm:h-10 text-xs sm:text-sm rounded-lg bg-white dark:bg-(--card-color)"
          >
            {t("cancel")}
          </Button>
        </div>
      </div>

      <Formik
        key={`${editId}-${editType}-${effectiveCampaignId}`}
        initialValues={initialValues}
        validationSchema={validationSchema[step]}
        onSubmit={handleNext}
        enableReinitialize
      >
        {({ submitForm, validateForm, setTouched }) => (
          <div className="flex-1 overflow-hidden flex flex-col min-h-125">
            {isCampaignMode && !isEditMode && (
              <div className="mb-6 sm:mb-10">
                <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg p-3 sm:p-6 overflow-x-auto table-custom-scrollbar">
                  <div className="flex items-center justify-between min-w-85 gap-2 mx-auto">
                    {steps.map((s, i) => {
                      const isActive = step === i;
                      const isCompleted = step > i;

                      return (
                        <React.Fragment key={s.id}>
                          <div
                            className={cn(
                              "flex flex-col sm:flex-row items-center gap-1 sm:gap-3 cursor-pointer group transition-all duration-300",
                              !isActive && "hover:opacity-80",
                              isEditMode && "cursor-default opacity-50",
                            )}
                            onClick={() =>
                              handleStepClick(i, validateForm, setTouched)
                            }
                          >
                            <div
                              className={cn(
                                "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 shrink-0",
                                isActive
                                  ? "bg-primary text-white ring-4 ring-primary/15 shadow-lg shadow-primary/20"
                                  : isCompleted
                                    ? "bg-primary text-white"
                                    : "bg-white dark:bg-(--dark-body) text-slate-400 border border-slate-200 dark:border-(--card-border-color) font-bold group-hover:border-[var(--primary-opacity-30)] dark:group-hover:border-(--table-hover)",
                              )}
                            >
                              {isCompleted ? (
                                <Check
                                  size={16}
                                  className="sm:w-4.5"
                                  strokeWidth={3}
                                />
                              ) : (
                                i + 1
                              )}
                            </div>
                            <div className="flex flex-col items-center sm:items-start">
                              <p
                                className={cn(
                                  "text-[8px] sm:text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 sm:mb-1",
                                  isActive || isCompleted
                                    ? "text-primary dark:text-primary"
                                    : "text-slate-400 group-hover:text-slate-500",
                                )}
                              >
                                {t("step")} {i + 1}
                              </p>
                              <p
                                className={cn(
                                  "text-[10px] sm:text-sm font-bold whitespace-nowrap transition-colors",
                                  isActive
                                    ? "text-slate-900 dark:text-white"
                                    : isCompleted
                                      ? "text-primary/80"
                                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
                                )}
                              >
                                {s.title}
                              </p>
                            </div>
                          </div>
                          {i < steps.length - 1 && (
                            <div
                              className={cn(
                                "flex-1 h-px sm:h-0.5 mx-2 sm:mx-6 rounded-full min-w-5 transition-colors duration-500",
                                isCompleted
                                  ? "bg-primary"
                                  : "bg-slate-200 dark:bg-(--page-body-bg)",
                              )}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg">
              <Form
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    (e.target as HTMLElement).tagName !== "TEXTAREA"
                  ) {
                    e.preventDefault();
                  }
                }}
                className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 p-4 sm:p-6 overflow-hidden flex flex-col"
              >
                {step === 0 && <Step1Campaign />}
                {step === 1 && <Step2AdSet />}
                {step === 2 && <Step3Ad />}
              </Form>

              <div className="sm:p-6 p-4 flex-wrap gap-3 border-t border-slate-200 dark:border-(--card-border-color) flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    !isFirstStepOfMode ? setStep(step - 1) : router.back()
                  }
                  className="rounded-lg gap-2 h-11 hover:bg-white dark:hover:bg-(--table-hover) shadow-sm border border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--page-body-bg) text-slate-600 dark:text-slate-400 font-bold px-6"
                >
                  <ChevronLeft size={18} />{" "}
                  {isFirstStepOfMode ? t("cancel") : t("previous")}
                </Button>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() =>
                      handleFooterNext(validateForm, submitForm, setTouched)
                    }
                    disabled={isLoading}
                    className="rounded-lg px-10 h-11 gap-2 bg-primary text-white hover:bg-primary shadow-lg shadow-primary/20 transition-all active:scale-95 font-bold"
                  >
                    {isLoading ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : isLastStep || isEditMode ? (
                      isEditMode ? (
                        t("save_changes", "Save Changes")
                      ) : (
                        t("publish_campaign")
                      )
                    ) : (
                      <>
                        {t("next_step")}
                        <ChevronRight size={18} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default AdCampaignWizard;
