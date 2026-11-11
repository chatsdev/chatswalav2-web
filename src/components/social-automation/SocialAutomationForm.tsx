/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAppSelector } from "@/src/redux/hooks";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import {
  useCreateSocialAutomationMutation,
  useGetSocialAutomationByIdQuery,
  useUpdateSocialAutomationMutation,
} from "@/src/redux/api/socialAutomationApi";
import { useGetReplyMaterialsQuery } from "@/src/redux/api/replyMaterialApi";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { useGetSequencesQuery } from "@/src/redux/api/sequenceApi";
import { useGetChatbotsQuery } from "@/src/redux/api/chatbotApi";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { REPLY_TYPES } from "@/src/data/KeywordActionData";
import { getTemplateVariables, isMarketingTemplate } from "@/src/utils/template";
import { CampaignCard, CarouselProduct, TemplateCarouselCard } from "@/src/types/campaign";
import TemplateConfig from "../response-resources/sequence-step/TemplateConfig";
import { MaterialPreviewModal } from "../shared/MaterialPreviewModal";
import { Button } from "@/src/elements/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  LayoutTemplate,
  Loader2,
} from "lucide-react";

import { StepIndicator } from "./StepIndicator";
import { Step1KeywordsOptions } from "./Step1KeywordsOptions";
import { Step2ReplyMaterial } from "./Step2ReplyMaterial";
import { SidebarSummary } from "./SidebarSummary";
import { SocialAutomationSkeleton } from "./SocialAutomationSkeleton";
import { CONTACT_SYSTEM_FIELDS } from "@/src/data/campaign";

const SocialAutomationForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL parameters passed from SocialAutomationGrid
  const automationId = searchParams.get("automation_id") || "";
  const [platform, setPlatform] = useState<"facebook" | "instagram">("facebook");
  const [mediaType, setMediaType] = useState<"post" | "story" | "reel">("post");
  const [mediaId, setMediaId] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [permalink, setPermalink] = useState("");
  const [caption, setCaption] = useState("");
  const [suggestedKeywords, setSuggestedKeywords] = useState<string[]>([]);

  // Load target media details from query parameters or sessionStorage on mount or when searchParams change
  useEffect(() => {
    const qPlatform = searchParams.get("platform");
    if (qPlatform) setPlatform(qPlatform as any);

    const qMediaType = searchParams.get("media_type");
    if (qMediaType) setMediaType(qMediaType as any);

    const qMediaId = searchParams.get("media_id");
    if (qMediaId) setMediaId(qMediaId);

    // Try to load detailed media data from sessionStorage to keep the URL clean
    let hasLoadedFromStorage = false;
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("chatswala_setup_media_data");
      if (storedData) {
        try {
          const parsed = JSON.parse(storedData);
          if (parsed.media_id === qMediaId) {
            if (parsed.media_url) setMediaUrl(parsed.media_url);
            if (parsed.permalink) setPermalink(parsed.permalink);
            if (parsed.caption) setCaption(parsed.caption);
            if (parsed.suggested_keywords) setSuggestedKeywords(parsed.suggested_keywords);
            hasLoadedFromStorage = true;
          }
        } catch (err) {
          console.error("Error parsing stored setup media data:", err);
        }
      }
    }

    // Fallback to URL search parameters if not found in sessionStorage
    if (!hasLoadedFromStorage) {
      const qMediaUrl = searchParams.get("media_url");
      if (qMediaUrl) setMediaUrl(qMediaUrl);

      const qPermalink = searchParams.get("permalink");
      if (qPermalink) setPermalink(qPermalink);

      const qCaption = searchParams.get("caption");
      if (qCaption) setCaption(qCaption);

      const qSuggested = searchParams.get("suggested_keywords");
      if (qSuggested) {
        setSuggestedKeywords(qSuggested.split(",").map((k) => k.trim()).filter(Boolean));
      }
    }
  }, [searchParams]);

  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const wabaId = selectedWorkspace?.waba_id || "";
  const workspaceId = selectedWorkspace?._id;

  const { isFeatureEnabled } = useFeatureAccess();

  // Step state
  const [step, setStep] = useState(1);

  // Form Fields
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [matchingMethod, setMatchingMethod] = useState<any>("exact");
  const [partialPercentage, setPartialPercentage] = useState(80);

  // Settings
  const [autoLikeComment, setAutoLikeComment] = useState(false);
  const [autoHideComment, setAutoHideComment] = useState(false);
  const [autoReplyText, setAutoReplyText] = useState("");
  const [hideConditionType, setHideConditionType] = useState<"keywords" | "aimodel">("keywords");
  const [hideKeywords, setHideKeywords] = useState<string[]>([]);
  const [hideKeywordInput, setHideKeywordInput] = useState("");
  const [requiresFollowing, setRequiresFollowing] = useState(false);
  const [followGateMessage, setFollowGateMessage] = useState("");
  const [followGateButtonYes, setFollowGateButtonYes] = useState("");
  const [followGateButtonNo, setFollowGateButtonNo] = useState("");
  const [followGateRejectionMessage, setFollowGateRejectionMessage] = useState("");
  const [delaySeconds, setDelaySeconds] = useState(0);

  // Reply Type and Material selection state
  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [selectedReplyId, setSelectedReplyId] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");

  const [variablesMapping, setVariablesMapping] = useState<Record<string, string>>({});
  const [templateMediaUrl, setTemplateMediaUrl] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [offerExpirationMinutes, setOfferExpirationMinutes] = useState<number | "" | undefined>();
  const [thumbnailProductRetailerId, setThumbnailProductRetailerId] = useState("");
  const [carouselCardsData, setCarouselCardsData] = useState<CampaignCard[]>([]);
  const [carouselProducts, setCarouselProducts] = useState<CarouselProduct[]>([]);
  const [locationData, setLocationData] = useState<{ latitude: string; longitude: string; name?: string; address?: string }>({
    latitude: "",
    longitude: "",
    name: "",
    address: "",
  });

  // Modals / Preview
  const [previewItem, setPreviewItem] = useState<{
    type: string;
    material: any;
  } | null>(null);

  // Filtered Reply Types (Exclude catalog, flow, appointment, sequence)
  const filteredReplyTypes = useMemo(() => {
    return REPLY_TYPES.filter((rt) => {
      if (
        rt.value === "catalog" ||
        rt.value === "flow" ||
        rt.value === "appointment_flow" ||
        rt.value === "sequence"
      ) {
        return false;
      }

      // Hide Template option based on active plan's fb_template or ig_template
      if (rt.value === "template") {
        if (platform === "facebook" && !isFeatureEnabled("fb_template")) {
          return false;
        }
        if (platform === "instagram" && !isFeatureEnabled("ig_template")) {
          return false;
        }
      }

      if (rt.featureKey && !isFeatureEnabled(rt.featureKey)) {
        return false;
      }
      return true;
    });
  }, [isFeatureEnabled, platform]);

  const activeTypeConfig = filteredReplyTypes[activeTypeIndex] || REPLY_TYPES[0];

  const { data: materialsData, isLoading: loadingMaterials } = useGetReplyMaterialsQuery({ waba_id: wabaId || "" });
  const { data: templatesData } = useGetTemplatesQuery({ waba_id: wabaId || "", status: "approved", platform });
  const { data: sequencesData } = useGetSequencesQuery({ waba_id: wabaId || "" });
  const { data: chatbotsData } = useGetChatbotsQuery({ waba_id: wabaId || "" });
  const { data: customFieldsResult } = useGetCustomFieldsQuery({});

  const [createSocialAutomation, { isLoading: isCreating }] = useCreateSocialAutomationMutation();
  const [updateSocialAutomation, { isLoading: isUpdating }] = useUpdateSocialAutomationMutation();
  const isSubmitting = isCreating || isUpdating;

  const { data: existingAutomationData, isLoading: isLoadingExisting, error: existingAutomationError } = useGetSocialAutomationByIdQuery(
    automationId,
    { skip: !automationId }
  );

  useEffect(() => {
    if (automationId) {
      console.log("[SocialAutomationForm] Querying existingAutomationData for ID:", automationId);
    }
  }, [automationId]);

  useEffect(() => {
    if (existingAutomationData) {
      console.log("[SocialAutomationForm] existingAutomationData response:", existingAutomationData);
    }
    if (existingAutomationError) {
      console.error("[SocialAutomationForm] existingAutomationError:", existingAutomationError);
    }
  }, [existingAutomationData, existingAutomationError]);

  const customFields = customFieldsResult?.data?.fields || [];
  const mappingOptions = useMemo(() => {
    const custom = customFields.map((f: any) => ({
      label: `CF: ${f.label}`,
      value: `cf_${f.name}`,
    }));
    return [...CONTACT_SYSTEM_FIELDS, ...custom];
  }, [customFields]);

  // Materials formatting
  const allMaterials = useMemo(() => {
    if (!materialsData?.data) return [];
    const { texts, images, documents, videos, stickers } = materialsData.data;
    return [
      ...texts.items.map((i: any) => ({ ...i, category: "text" })),
      ...images.items.map((i: any) => ({ ...i, category: "image" })),
      ...documents.items.map((i: any) => ({ ...i, category: "document" })),
      ...videos.items.map((i: any) => ({ ...i, category: "video" })),
      ...stickers.items.map((i: any) => ({ ...i, category: "sticker" })),
    ];
  }, [materialsData]);

  const filteredItems = useMemo(() => {
    const s = materialSearch.toLowerCase();
    const cfg = activeTypeConfig;
    switch (cfg.source) {
      case "reply_material":
        return allMaterials.filter((m) => m.category === cfg.materialType && m.name.toLowerCase().includes(s));
      case "template":
        return (templatesData?.data || [])
          .map((t: any) => ({ ...t, name: t.template_name }))
          .filter((t: any) => t.name?.toLowerCase().includes(s));
      case "chatbot":
        return (chatbotsData?.data || []).filter((c: any) => c.name.toLowerCase().includes(s));
      case "sequence":
        return (sequencesData?.data || [])
          .filter((c: any) => (c.platform || "whatsapp") === platform)
          .filter((c: any) => c.name.toLowerCase().includes(s));
      default:
        return [];
    }
  }, [activeTypeConfig, materialSearch, allMaterials, templatesData, chatbotsData, sequencesData, platform]);

  const selectedMaterial = useMemo(() => {
    if (!selectedReplyId) return null;
    const cfg = activeTypeConfig;
    switch (cfg.source) {
      case "reply_material":
        return allMaterials.find((item) => item._id === selectedReplyId);
      case "template":
        return (templatesData?.data || []).find((item: any) => item._id === selectedReplyId);
      case "chatbot":
        return (chatbotsData?.data || []).find((item: any) => item._id === selectedReplyId);
      case "sequence":
        return (sequencesData?.data || []).find((item: any) => item._id === selectedReplyId);
      default:
        return null;
    }
  }, [selectedReplyId, activeTypeConfig, allMaterials, templatesData, chatbotsData, sequencesData]);

  const hasMediaHeader = useMemo(() => {
    if (activeTypeConfig.source !== "template" || !selectedMaterial) return false;
    const components = (selectedMaterial as any).components || [];
    const header = components.find((c: any) => c.type === "HEADER");
    return header?.format === "IMAGE" || header?.format === "VIDEO" || header?.format === "DOCUMENT";
  }, [activeTypeConfig.source, selectedMaterial]);

  const needsStep3 = useMemo(() => {
    if (activeTypeConfig.source !== "template" || !selectedMaterial) return false;

    const vars = getTemplateVariables(selectedMaterial);
    const hasVariables = vars.length > 0;

    const templateType = (selectedMaterial as any).template_type || "";
    const isCarousel = templateType.includes("carousel") || (selectedMaterial as any).carousel_cards?.length > 0;
    const isCatalog = templateType === "catalog";
    const isMarketing = templateType === "coupon" || templateType === "limited_time_offer" || isMarketingTemplate(selectedMaterial);
    const isLocation =
      (selectedMaterial as any)?.header?.format === "location" ||
      ((selectedMaterial as any)?.components || []).find((c: any) => c.type === "HEADER")?.format === "LOCATION";

    return hasVariables || hasMediaHeader || isCarousel || isCatalog || isMarketing || isLocation;
  }, [activeTypeConfig.source, selectedMaterial, hasMediaHeader]);

  const totalSteps = needsStep3 ? 3 : 2;

  const wizardLabels = useMemo(() => {
    return needsStep3
      ? ["Keywords & Options", "Reply Material", "Configure Template"]
      : ["Keywords & Options", "Reply Material"];
  }, [needsStep3]);

  // Prepopulate suggested keywords on mount
  useEffect(() => {
    if (suggestedKeywords.length > 0 && keywords.length === 0 && !automationId) {
      setKeywords(suggestedKeywords);
    }
  }, [suggestedKeywords, automationId]);

  // Load existing automation data when editing
  useEffect(() => {
    if (existingAutomationData?.success && existingAutomationData?.data) {
      const auto = existingAutomationData.data;

      // Update target media details from loaded database record
      if (auto.platform) setPlatform(auto.platform);
      if (auto.automation_type) {
        const typeMap: Record<string, "post" | "story" | "reel"> = {
          post_comment: "post",
          reel_comment: "reel",
          story_reply: "story",
        };
        setMediaType(typeMap[auto.automation_type] || "post");
      }
      if (auto.target_media_id) setMediaId(auto.target_media_id);

      if (auto.post_details) {
        if (auto.post_details.media_url) setMediaUrl(auto.post_details.media_url);
        else if (auto.post_details.thumbnail_url) setMediaUrl(auto.post_details.thumbnail_url);

        if (auto.post_details.permalink) setPermalink(auto.post_details.permalink);
        if (auto.post_details.caption) setCaption(auto.post_details.caption);
        if (auto.post_details.suggested_keywords) {
          setSuggestedKeywords(auto.post_details.suggested_keywords);
        }
      }

      if (auto.keywords && auto.keywords.length > 0) {
        setKeywords(auto.keywords);
      }
      if (auto.matching_method) {
        setMatchingMethod(auto.matching_method);
      }
      if (auto.partial_percentage !== undefined) {
        setPartialPercentage(auto.partial_percentage);
      }
      if (auto.auto_like_comment !== undefined) {
        setAutoLikeComment(auto.auto_like_comment);
      }
      if (auto.auto_hide_comment !== undefined) {
        setAutoHideComment(auto.auto_hide_comment);
      }
      if (auto.auto_reply_text !== undefined) {
        setAutoReplyText(auto.auto_reply_text || "");
      }
      if (auto.hide_condition_type) {
        setHideConditionType(auto.hide_condition_type);
      }
      if (auto.hide_keywords && auto.hide_keywords.length > 0) {
        setHideKeywords(auto.hide_keywords);
      }
      if (auto.requires_following !== undefined) {
        setRequiresFollowing(auto.requires_following);
      }
      if (auto.follow_gate_message !== undefined) {
        setFollowGateMessage(auto.follow_gate_message || "");
      }
      if (auto.follow_gate_button_yes !== undefined) {
        setFollowGateButtonYes(auto.follow_gate_button_yes || "");
      }
      if (auto.follow_gate_button_no !== undefined) {
        setFollowGateButtonNo(auto.follow_gate_button_no || "");
      }
      if (auto.follow_gate_rejection_message !== undefined) {
        setFollowGateRejectionMessage(auto.follow_gate_rejection_message || "");
      }
      if (auto.delay_seconds !== undefined) {
        setDelaySeconds(auto.delay_seconds);
      }

      // Prepopulate reply type and selected material
      if (auto.reply_type) {
        const typeIndex = filteredReplyTypes.findIndex(
          (rt) => rt.value === auto.reply_type
        );
        if (typeIndex !== -1) {
          setActiveTypeIndex(typeIndex);
        }
      }
      if (auto.reply_id) {
        setSelectedReplyId(auto.reply_id);
      }

      // Prepopulate template config mapping
      if (auto.variables_mapping) {
        setVariablesMapping(auto.variables_mapping);
      }
      if (auto.media_url) {
        setTemplateMediaUrl(auto.media_url);
      }
      if (auto.coupon_code) {
        setCouponCode(auto.coupon_code);
      }
      if (auto.product_retailer_id) {
        setThumbnailProductRetailerId(auto.product_retailer_id);
      }
      if (auto.carousel_cards_data && auto.carousel_cards_data.length > 0) {
        setCarouselCardsData(auto.carousel_cards_data);
      }
      if (auto.carousel_products && auto.carousel_products.length > 0) {
        setCarouselProducts(auto.carousel_products);
      }
    }
  }, [existingAutomationData, filteredReplyTypes]);

  const addKeyword = () => {
    const t = keywordInput.trim();
    if (t && !keywords.includes(t)) {
      setKeywords((p) => [...p, t]);
      setKeywordInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword();
    }
  };

  const handleMaterialSelect = useCallback(
    (id: string) => {
      setSelectedReplyId(id);
      if (activeTypeConfig.source === "template") {
        const material = (templatesData?.data || []).find((t: any) => t._id === id);
        if (material) {
          const keys = getTemplateVariables(material);
          const mapping: Record<string, string> = {};
          keys.forEach((k) => (mapping[k] = ""));
          setVariablesMapping(mapping);

          // Initialize carousel card state based on template type
          const marketingType = (material as any)?.template_type || "";
          const templateCards: TemplateCarouselCard[] = (material as any)?.carousel_cards || [];
          const isCarouselProduct = marketingType === "carousel_product" || (
            marketingType === "carousel" &&
            (templateCards?.[0]?.components?.find?.((c: any) => c.type === "header")?.format?.includes("product") ||
              (material as any)?.carousel_cards?.[0]?.components?.[0]?.format === "product")
          );
          const isCarouselMedia = marketingType === "carousel_media" || (marketingType === "carousel" && !isCarouselProduct);

          if (isCarouselMedia) {
            setCarouselCardsData(
              templateCards.map((tc) => ({
                header: {
                  type: tc.components?.find?.((c: any) => c.type === "header")?.format?.toLowerCase() || "image",
                  link: "",
                },
                body: "",
                buttons: (tc.components?.find?.((c: any) => c.type === "buttons")?.buttons || []).map((b: any) => ({
                  type: b.type,
                  text: b.text || "",
                  ...(b.type === "url" ? { url_value: "" } : {}),
                  ...(b.type === "quick_reply" ? { payload: "" } : {}),
                })),
              }))
            );
            setCarouselProducts([]);
          } else if (isCarouselProduct) {
            setCarouselProducts(
              templateCards.map(() => ({
                product_retailer_id: "",
                catalog_id: "",
              }))
            );
            setCarouselCardsData([]);
          } else {
            setCarouselCardsData([]);
            setCarouselProducts([]);
          }
        }
      } else {
        setVariablesMapping({});
        setCarouselCardsData([]);
        setCarouselProducts([]);
      }
    },
    [activeTypeConfig, templatesData]
  );

  const handleTypeChange = (index: number) => {
    setActiveTypeIndex(index);
    setSelectedReplyId("");
    setMaterialSearch("");
    setVariablesMapping({});
    setCarouselCardsData([]);
    setCarouselProducts([]);
  };

  const handlePreview = (e: React.MouseEvent, item: any) => {
    e.stopPropagation();
    setPreviewItem({
      type:
        activeTypeConfig.source === "reply_material"
          ? item.category === "text"
            ? "ReplyMaterial_text"
            : `ReplyMaterial_${item.category}`
          : activeTypeConfig.source === "template"
            ? "Template"
            : activeTypeConfig.source === "chatbot"
              ? "Chatbot"
              : "Sequence",
      material: item,
    });
  };

  const getGridRoute = () => {
    const pluralType = mediaType === "story" ? "stories" : mediaType + "s";
    return `/${platform}_${pluralType}_automation`;
  };

  const handleSubmit = async () => {
    const payload = {
      workspace_id: workspaceId,
      platform,
      automation_type: mediaType === "post" ? "post_comment" : mediaType === "reel" ? "reel_comment" : "story_reply",
      target_media_id: mediaId,
      keywords,
      matching_method: matchingMethod,
      ...(matchingMethod === "partial" ? { partial_percentage: partialPercentage } : {}),
      reply_type: activeTypeConfig.value,
      reply_id: selectedReplyId,
      reply_type_ref:
        activeTypeConfig.source === "reply_material"
          ? "ReplyMaterial"
          : activeTypeConfig.source === "template"
            ? "Template"
            : activeTypeConfig.source === "chatbot"
              ? "Chatbot"
              : "Sequence",
      auto_like_comment: autoLikeComment,
      auto_hide_comment: autoHideComment,
      auto_reply_text: autoReplyText,
      ...(autoHideComment ? {
        hide_condition_type: hideConditionType,
        hide_keywords: hideConditionType === 'keywords' ? hideKeywords : undefined,
      } : {}),
      requires_following: requiresFollowing,
      follow_gate_message: requiresFollowing ? followGateMessage : undefined,
      follow_gate_button_yes: requiresFollowing ? followGateButtonYes : undefined,
      follow_gate_button_no: requiresFollowing ? followGateButtonNo : undefined,
      follow_gate_rejection_message: requiresFollowing ? followGateRejectionMessage : undefined,
      delay_seconds: delaySeconds,
      status: "active",
      media_url: mediaUrl || undefined,
      ...(activeTypeConfig.source === "template"
        ? {
          variables_mapping: variablesMapping,
          media_url: templateMediaUrl || undefined,
          coupon_code: couponCode || undefined,
          product_retailer_id: thumbnailProductRetailerId || undefined,
          carousel_cards_data: carouselCardsData.length > 0 ? carouselCardsData : undefined,
          carousel_products: carouselProducts.length > 0 ? carouselProducts : undefined,
          location_data: (locationData.latitude && locationData.longitude) ? locationData : undefined,
        }
        : {}),
    };

    try {
      const res = automationId
        ? await updateSocialAutomation({ id: automationId, ...payload }).unwrap()
        : await createSocialAutomation(payload).unwrap();
      if (res.success) {
        toast.success(res.message || (automationId ? "Social automation trigger updated successfully!" : "Social automation trigger created successfully!"));
        router.push(getGridRoute());
      } else {
        toast.error(res.error || `Failed to ${automationId ? "update" : "create"} trigger`);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.error || "An error occurred while saving automation.");
    }
  };



  const validateStep = (s: number) => {
    if (s === 1) {
      if (keywords.length === 0) return "Add at least one keyword trigger";
    } else if (s === 2) {
      if (!selectedReplyId) return "Select a reply material";
    } else if (s === 3) {
      if (activeTypeConfig.source === "template" && selectedMaterial) {
        const vars = getTemplateVariables(selectedMaterial);
        for (const v of vars) {
          if (!variablesMapping[v]) return `Variable {{${v}}} is required`;
        }
      }
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(step);
    if (error) {
      toast.error(error);
      return;
    }

    if (step === 2 && !needsStep3) {
      handleSubmit();
    } else if (step === 3) {
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleStepClick = (idx: number) => {
    if (idx === step) return;
    if (idx < step) {
      setStep(idx);
      return;
    }
    for (let i = step; i < idx; i++) {
      const err = validateStep(i);
      if (err) {
        toast.error(err);
        return;
      }
    }
    setStep(idx);
  };

  if (automationId && isLoadingExisting) {
    return <SocialAutomationSkeleton />;
  }

  return (
    <div className="mx-auto p-4 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(getGridRoute())}
          className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {automationId ? "Edit Social Automation" : "Setup Social Automation"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure automated comments and DM replies on {platform === "facebook" ? "Facebook" : "Instagram"}
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-6 shadow-sm">
        <StepIndicator current={step} total={totalSteps} labels={wizardLabels} onStepClick={handleStepClick} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-fit bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
          {/* Step 1: Keywords & Options */}
          {step === 1 && (
            <Step1KeywordsOptions
              keywords={keywords}
              setKeywords={setKeywords}
              keywordInput={keywordInput}
              setKeywordInput={setKeywordInput}
              suggestedKeywords={suggestedKeywords}
              matchingMethod={matchingMethod}
              setMatchingMethod={setMatchingMethod}
              partialPercentage={partialPercentage}
              setPartialPercentage={setPartialPercentage}
              autoLikeComment={autoLikeComment}
              setAutoLikeComment={setAutoLikeComment}
              autoHideComment={autoHideComment}
              setAutoHideComment={setAutoHideComment}
              autoReplyText={autoReplyText}
              setAutoReplyText={setAutoReplyText}
              hideConditionType={hideConditionType}
              setHideConditionType={setHideConditionType}
              hideKeywords={hideKeywords}
              setHideKeywords={setHideKeywords}
              hideKeywordInput={hideKeywordInput}
              setHideKeywordInput={setHideKeywordInput}
              delaySeconds={delaySeconds}
              setDelaySeconds={setDelaySeconds}
              handleKeyDown={handleKeyDown}
              addKeyword={addKeyword}
              mediaType={mediaType}
              requiresFollowing={requiresFollowing}
              setRequiresFollowing={setRequiresFollowing}
              followGateMessage={followGateMessage}
              setFollowGateMessage={setFollowGateMessage}
              followGateButtonYes={followGateButtonYes}
              setFollowGateButtonYes={setFollowGateButtonYes}
              followGateButtonNo={followGateButtonNo}
              setFollowGateButtonNo={setFollowGateButtonNo}
              followGateRejectionMessage={followGateRejectionMessage}
              setFollowGateRejectionMessage={setFollowGateRejectionMessage}
            />
          )}

          {/* Step 2: Reply Material */}
          {step === 2 && (
            <Step2ReplyMaterial
              filteredReplyTypes={filteredReplyTypes}
              activeTypeIndex={activeTypeIndex}
              handleTypeChange={handleTypeChange}
              materialSearch={materialSearch}
              setMaterialSearch={setMaterialSearch}
              loadingMaterials={loadingMaterials}
              filteredItems={filteredItems}
              selectedReplyId={selectedReplyId}
              handleMaterialSelect={handleMaterialSelect}
              handlePreview={handlePreview}
              activeTypeConfig={activeTypeConfig}
              platform={platform}
            />
          )}

          {/* Step 3: Configure Template */}
          {step === 3 && needsStep3 && selectedMaterial && (
            <div className="sm:p-6 p-4 space-y-5">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">Configure Template</h2>
                <p className="text-xs text-slate-400 mt-0.5">Map variables and configure options for this template.</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-none flex items-center gap-3">
                <LayoutTemplate size={16} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{(selectedMaterial as any).name}</p>
                  <p className="text-sm text-slate-400">Selected template</p>
                </div>
              </div>

              <TemplateConfig
                template={selectedMaterial}
                wabaId={wabaId}
                variablesMapping={variablesMapping}
                onVariableChange={(key, val) => setVariablesMapping((prev) => ({ ...prev, [key]: val }))}
                mediaUrl={templateMediaUrl}
                onMediaUrlChange={setTemplateMediaUrl}
                hasMediaHeader={hasMediaHeader}
                couponCode={couponCode}
                onCouponCodeChange={setCouponCode}
                offerExpirationMinutes={offerExpirationMinutes}
                onOfferExpirationMinutesChange={setOfferExpirationMinutes}
                thumbnailProductRetailerId={thumbnailProductRetailerId}
                onThumbnailProductRetailerIdChange={setThumbnailProductRetailerId}
                carouselCardsData={carouselCardsData}
                onCarouselCardsDataChange={setCarouselCardsData}
                carouselProducts={carouselProducts}
                onCarouselProductsChange={setCarouselProducts}
                mappingOptions={mappingOptions}
                locationData={locationData}
                onLocationDataChange={setLocationData}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="sm:px-6 px-4 py-4 border-t border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) flex items-center gap-3">

            <Button
              variant="outline"
              onClick={step === 1 ? () => router.push(getGridRoute()) : () => setStep((s) => (s - 1) as any)}
              className="flex-1 h-11 rounded-lg font-bold"
            >
              {step === 1 ? (
                "Cancel"
              ) : (
                <>
                  <ArrowLeft size={16} className="mr-1.5" /> Back
                </>
              )}
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting || (step === 2 && loadingMaterials)}
              className="flex-1 h-11 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : step === totalSteps ? (
                <>
                  <Check size={16} className="mr-1.5" />
                  {automationId ? "Update Trigger" : "Create Trigger"}
                </>
              ) : (
                <>
                  Next <ArrowRight size={16} className="ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Sidebar Summary */}
        <SidebarSummary
          platform={platform}
          mediaType={mediaType}
          mediaUrl={mediaUrl}
          permalink={permalink}
          caption={caption}
          keywords={keywords}
          matchingMethod={matchingMethod}
          partialPercentage={partialPercentage}
          selectedReplyId={selectedReplyId}
          activeTypeConfig={activeTypeConfig}
          selectedMaterial={selectedMaterial}
          autoLikeComment={autoLikeComment}
          autoHideComment={autoHideComment}
          requiresFollowing={requiresFollowing}
          delaySeconds={delaySeconds}
        />
      </div>

      {previewItem && (
        <MaterialPreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          type={previewItem.type}
          material={previewItem.material}
          platform={platform}
        />
      )}


    </div>
  );
};

export default SocialAutomationForm;
