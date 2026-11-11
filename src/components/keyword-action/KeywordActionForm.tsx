/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { CONTACT_SYSTEM_FIELDS } from "@/src/data/campaign";
import {
  MATCHING_METHODS,
  platforms,
  recipientOptions,
  REPLY_TYPES,
} from "@/src/data/KeywordActionData";
import { Button } from "@/src/elements/ui/button";
import { Input } from "@/src/elements/ui/input";
import { Label } from "@/src/elements/ui/label";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import { useListAppointmentConfigsQuery } from "@/src/redux/api/appointmentApi";
import { useGetLinkedCatalogsQuery } from "@/src/redux/api/catalogueApi";
import { useGetChatbotsQuery } from "@/src/redux/api/chatbotApi";
import { useGetContactQuery } from "@/src/redux/api/contactApi";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import {
  useCreateKeywordActionMutation,
  useGetKeywordActionByIdQuery,
  useUpdateKeywordActionMutation,
} from "@/src/redux/api/keywordActionApi";
import { useGetReplyMaterialsQuery } from "@/src/redux/api/replyMaterialApi";
import { useGetSegmentsQuery } from "@/src/redux/api/segmentApi";
import { useGetSequencesQuery } from "@/src/redux/api/sequenceApi";
import { useGetTagsQuery } from "@/src/redux/api/tagsApi";
import { useGetTemplatesQuery } from "@/src/redux/api/templateApi";
import { useAppSelector } from "@/src/redux/hooks";
import {
  CampaignCard,
  CarouselProduct,
  TemplateCarouselCard,
} from "@/src/types/campaign";
import {
  KeywordActionCreatePayload,
  KeywordActionFormProps,
  MatchingMethod,
} from "@/src/types/keywordAction";
import { maskSensitiveData } from "@/src/utils/masking";
import {
  getTemplateVariables,
  isMarketingTemplate,
} from "@/src/utils/template";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Eye,
  Info,
  LayoutTemplate,
  Loader2,
  Mailbox,
  Plus,
  Search,
  Sparkles,
  Users,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { RecipientSelectionField } from "../campaigns/wizard/components/RecipientSelectionField";
import TemplateConfig from "../response-resources/sequence-step/TemplateConfig";
import { MaterialPreviewModal } from "../shared/MaterialPreviewModal";

const StepIndicator: React.FC<{
  current: number;
  total: number;
  labels: string[];
  onStepClick: (index: number) => void;
}> = ({ current, total, labels, onStepClick }) => (
  <div className="flex items-center">
    {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
      <React.Fragment key={s}>
        <div
          className={cn(
            "flex items-center gap-2 cursor-pointer group transition-all",
            s > current && "opacity-60 hover:opacity-100",
          )}
          onClick={() => onStepClick(s)}
        >
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all shrink-0",
              s < current
                ? "bg-primary text-white"
                : s === current
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-slate-100 dark:bg-(--dark-body) text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700",
            )}
          >
            {s < current ? <Check size={14} strokeWidth={3} /> : s}
          </div>
          <span
            className={cn(
              "text-sm font-semibold hidden sm:block",
              s === current
                ? "text-primary"
                : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300",
            )}
          >
            {labels[s - 1]}
          </span>
        </div>
        {s < total && (
          <div
            className={cn(
              "flex-1 h-0.5 mx-4 rounded-full min-w-8",
              s < current
                ? "bg-primary"
                : "bg-slate-100 dark:bg-(--page-body-bg)",
            )}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

const PercentageSlider: React.FC<{
  value: number;
  onChange: (v: number) => void;
}> = ({ value, onChange }) => (
  <div className="space-y-3 p-4 bg-amber-50/60 dark:bg-amber-500/5 rounded-lg border border-amber-100 dark:border-amber-500/20">
    <div className="flex items-center justify-between">
      <Label className="text-xs font-bold text-amber-700 dark:text-amber-400">
        Match Sensitivity
      </Label>
      <span className="text-sm font-black text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1 rounded-lg">
        {value}%
      </span>
    </div>
    <div className="relative h-2.5">
      <div className="absolute inset-0 bg-amber-100 dark:bg-amber-900/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 dark:bg-amber-500 rounded-full transition-all"
          style={{ width: `${value}%` }}
        />
      </div>
      <Input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-2.5"
      />
    </div>
    <div className="flex justify-between text-[10px] text-amber-500/70 font-bold">
      <span>0% — Any similar</span>
      <span>100% — Exact</span>
    </div>
  </div>
);

const KeywordActionForm: React.FC<KeywordActionFormProps> = ({ editId }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const wabaId = selectedWorkspace?.waba_id || "";

  const { isFeatureEnabled, getEnabledChannels } = useFeatureAccess();
  const enabled = getEnabledChannels();
  const { is_demo_mode } = useAppSelector((state) => state.setting);

  const [selectedPlatform, setSelectedPlatform] = useState<string>("whatsapp");

  const filteredReplyTypes = REPLY_TYPES.filter((rt) => {
    if (
      isBaileys &&
      (rt.value === "template" ||
        rt.value === "catalog" ||
        rt.value === "flow" ||
        rt.value === "appointment_flow" ||
        rt.value === "sequence")
    ) {
      return false;
    }
    if (rt.featureKey && !isFeatureEnabled(rt.featureKey)) {
      return false;
    }
    if (selectedPlatform !== "whatsapp") {
      if (
        rt.value === "catalog" ||
        rt.value === "flow" ||
        rt.value === "appointment_flow"
      ) {
        return false;
      }
    }
    return true;
  });
  const isEdit = !!editId;

  const [step, setStep] = useState(1);

  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [matchingMethod, setMatchingMethod] = useState<MatchingMethod>("exact");
  const [partialPercentage, setPartialPercentage] = useState(80);

  const [activeTypeIndex, setActiveTypeIndex] = useState(0);
  const [selectedReplyId, setSelectedReplyId] = useState("");
  const [materialSearch, setMaterialSearch] = useState("");

  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatform(platformId);
    if (platformId !== "whatsapp") {
      const cfg = REPLY_TYPES[activeTypeIndex];
      if (
        cfg.value === "catalog" ||
        cfg.value === "flow" ||
        cfg.value === "appointment_flow"
      ) {
        setActiveTypeIndex(0); // reset to text type
        setSelectedReplyId("");
      }
    }
  };

  const [variablesMapping, setVariablesMapping] = useState<
    Record<string, string>
  >({});
  const [mediaUrl, setMediaUrl] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [offerExpirationMinutes, setOfferExpirationMinutes] = useState<
    number | "" | undefined
  >();
  const [thumbnailProductRetailerId, setThumbnailProductRetailerId] =
    useState("");
  const [carouselCardsData, setCarouselCardsData] = useState<CampaignCard[]>(
    [],
  );
  const [carouselProducts, setCarouselProducts] = useState<CarouselProduct[]>(
    [],
  );

  const [recipientType, setRecipientType] = useState<
    "all_contacts" | "specific_contacts" | "tags" | "segments"
  >("specific_contacts");
  const [specificContacts, setSpecificContacts] = useState<string[]>([]);
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [segmentIds, setSegmentIds] = useState<string[]>([]);

  const [previewItem, setPreviewItem] = useState<{
    type: string;
    material: any;
  } | null>(null);

  const { data: materialsData, isLoading: loadingMaterials } =
    useGetReplyMaterialsQuery({ waba_id: wabaId || "" });
  const { data: contactsResult } = useGetContactQuery({
    platform: selectedPlatform,
  });
  const contacts = (contactsResult as any)?.data?.contacts || [];

  const { data: tagsResult } = useGetTagsQuery({});
  const tags = (tagsResult as any)?.data?.tags || [];

  const { data: segmentsResult } = useGetSegmentsQuery({});
  const segments = (segmentsResult as any)?.data?.segments || [];
  const { data: templatesData, isLoading: loadingTemplates } =
    useGetTemplatesQuery(
      { waba_id: wabaId || "", status: "approved", platform: selectedPlatform }
    );
  const { data: catalogsData, isLoading: loadingCatalogs } =
    useGetLinkedCatalogsQuery({ waba_id: wabaId || "" });
  const { data: chatbotsData, isLoading: loadingChatbots } =
    useGetChatbotsQuery({ waba_id: wabaId || "" });
  const { data: sequencesData, isLoading: loadingSequences } =
    useGetSequencesQuery({ waba_id: wabaId || "" });
  const { data: appointmentsData, isLoading: loadingAppointments } =
    useListAppointmentConfigsQuery({ waba_id: wabaId || "" });
  const { data: editData, isLoading: loadingEdit } =
    useGetKeywordActionByIdQuery(editId || "", { skip: !editId });
  const { data: customFieldsResult } = useGetCustomFieldsQuery({});

  const [createAction, { isLoading: isCreating }] =
    useCreateKeywordActionMutation();
  const [updateAction, { isLoading: isUpdating }] =
    useUpdateKeywordActionMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const customFields = customFieldsResult?.data?.fields || [];
  const mappingOptions = useMemo(() => {
    const custom = customFields.map((f: any) => ({
      label: `CF: ${f.label}`,
      value: `cf_${f.name}`,
    }));
    return [...CONTACT_SYSTEM_FIELDS, ...custom];
  }, [customFields]);

  useEffect(() => {
    if (editData?.data) {
      const d = editData.data;
      setKeywords(d.keywords || []);
      setMatchingMethod(d.matching_method || "exact");
      setPartialPercentage(d.partial_percentage || 80);
      setSelectedPlatform(d.platform || "whatsapp");
      setRecipientType(d.recipient_type || "all_contacts");

      const extractIds = (arr: any[] | undefined) => {
        if (!arr) return [];
        return arr
          .map((item) => (typeof item === "object" && item ? item._id : item))
          .filter(Boolean);
      };

      setSpecificContacts(extractIds(d.specific_contacts));
      setTagIds(extractIds(d.tag_ids));
      setSegmentIds(extractIds(d.segment_ids));

      const replyObj = d.reply_id as any;
      const type = d.reply_type;
      const replyId =
        typeof replyObj === "string" ? replyObj : replyObj?._id || "";

      let index = 0;
      if (type === "template")
        index = REPLY_TYPES.findIndex((r) => r.value === "template");
      else if (type === "catalog")
        index = REPLY_TYPES.findIndex((r) => r.value === "catalog");
      else if (type === "sequence")
        index = REPLY_TYPES.findIndex((r) => r.value === "sequence");
      else if (type === "chatbot")
        index = REPLY_TYPES.findIndex((r) => r.value === "chatbot");
      else if (type === "text")
        index = REPLY_TYPES.findIndex((r) => r.value === "text");
      else if (type === "media") {
        const materialType = replyObj?.type || "";
        index = REPLY_TYPES.findIndex(
          (r) => r.value === "media" && r.materialType === materialType,
        );
      } else if (type === "flow") {
        index = REPLY_TYPES.findIndex((r) => r.value === "flow");
      } else if (type === "appointment_flow") {
        index = REPLY_TYPES.findIndex((r) => r.value === "appointment_flow");
      }

      if (index !== -1) setActiveTypeIndex(index);
      setSelectedReplyId(replyId);

      setVariablesMapping(d.variables_mapping || {});
      setMediaUrl(d.media_url || "");
      setCouponCode(d.coupon_code || "");
      setCarouselCardsData(d.carousel_cards_data || []);
    }
  }, [editData]);

  const activeTypeConfig = REPLY_TYPES[activeTypeIndex];

  const allMaterials = useMemo(() => {
    if (!materialsData?.data) return [];
    const { texts, images, documents, videos, stickers, flows } =
      materialsData.data;
    return [
      ...texts.items.map((i) => ({ ...i, category: "text" })),
      ...images.items.map((i) => ({ ...i, category: "image" })),
      ...documents.items.map((i) => ({ ...i, category: "document" })),
      ...videos.items.map((i) => ({ ...i, category: "video" })),
      ...stickers.items.map((i) => ({ ...i, category: "sticker" })),
      ...(flows?.items || []).map((i) => ({ ...i, category: "flow" })),
    ];
  }, [materialsData]);

  const filteredItems = useMemo(() => {
    const s = materialSearch.toLowerCase();
    const cfg = activeTypeConfig;
    switch (cfg.source) {
      case "reply_material":
        return allMaterials.filter(
          (m) =>
            m.category === cfg.materialType && m.name.toLowerCase().includes(s),
        );
      case "template":
        return (templatesData?.data || [])
          .map((t) => ({ ...t, name: t.template_name }))
          .filter((t) => t.name?.toLowerCase().includes(s));
      case "catalog":
        return (catalogsData?.data?.catalogs || []).filter((c) =>
          c.name.toLowerCase().includes(s),
        );
      case "chatbot":
        return (chatbotsData?.data || []).filter((c) =>
          c.name.toLowerCase().includes(s),
        );
      case "sequence":
        return (sequencesData?.data || [])
          .filter((c) => (c.platform || "whatsapp") === selectedPlatform)
          .filter((c) => c.name.toLowerCase().includes(s));
      case "appointment":
        return (appointmentsData?.data?.configs || [])
          .map((a) => ({ ...a, name: a.name || "" }))
          .filter((a) => a.name.toLowerCase().includes(s));
      default:
        return [];
    }
  }, [
    activeTypeConfig,
    materialSearch,
    allMaterials,
    templatesData,
    catalogsData,
    chatbotsData,
    sequencesData,
    appointmentsData,
    selectedPlatform,
  ]);

  const isLoadingMaterials =
    loadingMaterials ||
    loadingTemplates ||
    loadingCatalogs ||
    loadingChatbots ||
    loadingSequences ||
    loadingAppointments;

  const selectedMaterial = useMemo(() => {
    if (!selectedReplyId) return null;

    if (
      editData?.data?.reply_id &&
      typeof editData.data.reply_id === "object"
    ) {
      if ((editData.data.reply_id as any)._id === selectedReplyId) {
        return editData.data.reply_id;
      }
    }

    const cfg = activeTypeConfig;
    switch (cfg.source) {
      case "reply_material":
        return allMaterials.find((item) => item._id === selectedReplyId);
      case "template":
        return (templatesData?.data || []).find(
          (item) => item._id === selectedReplyId,
        );
      case "catalog":
        return (catalogsData?.data?.catalogs || []).find(
          (item) => item._id === selectedReplyId,
        );
      case "chatbot":
        return (chatbotsData?.data || []).find(
          (item) => item._id === selectedReplyId,
        );
      case "sequence":
        return (sequencesData?.data || []).find(
          (item) => item._id === selectedReplyId,
        );
      case "appointment":
        return (appointmentsData?.data?.configs || []).find(
          (item) => item._id === selectedReplyId,
        );
      default:
        return null;
    }
  }, [
    selectedReplyId,
    activeTypeConfig,
    allMaterials,
    templatesData,
    catalogsData,
    chatbotsData,
    sequencesData,
    editData,
    appointmentsData,
  ]);

  const hasMediaHeader = useMemo(() => {
    if (activeTypeConfig.source !== "template" || !selectedMaterial)
      return false;
    const components = (selectedMaterial as any).components || [];
    const header = components.find((c: any) => c.type === "HEADER");
    return (
      header?.format === "IMAGE" ||
      header?.format === "VIDEO" ||
      header?.format === "DOCUMENT"
    );
  }, [activeTypeConfig.source, selectedMaterial]);

  const needsStep3 = useMemo(() => {
    if (activeTypeConfig.source !== "template" || !selectedMaterial)
      return false;

    const vars = getTemplateVariables(selectedMaterial);
    const hasVariables = vars.length > 0;

    const templateType = (selectedMaterial as any).template_type || "";
    const isCarousel =
      templateType.includes("carousel") ||
      (selectedMaterial as any).carousel_cards?.length > 0;
    const isCatalog = templateType === "catalog";
    const isMarketing =
      templateType === "coupon" ||
      templateType === "limited_time_offer" ||
      isMarketingTemplate(selectedMaterial);

    return (
      hasVariables || hasMediaHeader || isCarousel || isCatalog || isMarketing
    );
  }, [activeTypeConfig.source, selectedMaterial, hasMediaHeader]);

  const totalSteps = needsStep3 ? 4 : 3;

  const wizardLabels = useMemo(() => {
    return needsStep3
      ? [
          t("step_keywords", "Keywords"),
          t("step_reply_material", "Reply Material"),
          t("step_configure_template", "Configure Template"),
          t("step_recipients", "Recipients"),
        ]
      : [
          t("step_keywords", "Keywords"),
          t("step_reply_material", "Reply Material"),
          t("step_recipients", "Recipients"),
        ];
  }, [needsStep3, t]);

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
        const material = (templatesData?.data || []).find((t) => t._id === id);
        if (material) {
          const keys = getTemplateVariables(material);
          const mapping: Record<string, string> = {};
          keys.forEach((k) => (mapping[k] = ""));
          setVariablesMapping(mapping);

          const marketingType = (material as any)?.template_type || "";
          const templateCards: TemplateCarouselCard[] =
            (material as any)?.carousel_cards || [];
          const isCarouselMedia =
            marketingType === "carousel_media" ||
            (marketingType === "carousel" &&
              !templateCards?.[0]?.components
                ?.find?.((c: any) => c.type === "header")
                ?.format?.includes("product"));
          const isCarouselProduct =
            marketingType === "carousel_product" ||
            (marketingType === "carousel" && !isCarouselMedia);

          if (isCarouselMedia) {
            setCarouselCardsData(
              templateCards.map((tc) => ({
                header: {
                  type:
                    tc.components?.find?.((c: any) => c.type === "header")
                      ?.format || "image",
                  link: "",
                },
                body: "",
                buttons: (
                  tc.components?.find?.((c: any) => c.type === "buttons")
                    ?.buttons || []
                ).map((b: any) => ({
                  type: b.type,
                  text: b.text || "",
                  ...(b.type === "url" ? { url_value: "" } : {}),
                  ...(b.type === "quick_reply" ? { payload: "" } : {}),
                })),
              })),
            );
          }
          if (isCarouselProduct) {
            setCarouselProducts(
              templateCards.map(() => ({
                product_retailer_id: "",
                catalog_id: "",
              })),
            );
          }
        }
      } else {
        setVariablesMapping({});
      }
    },
    [
      activeTypeConfig,
      templatesData,
      setSelectedReplyId,
      setVariablesMapping,
      setCarouselCardsData,
      setCarouselProducts,
    ],
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
            : activeTypeConfig.source === "catalog"
              ? "EcommerceCatalog"
              : activeTypeConfig.source === "chatbot"
                ? "Chatbot"
                : "Sequence",
      material: item,
    });
  };

  const handleSubmit = async () => {
    const payload: KeywordActionCreatePayload = {
      waba_id: wabaId,
      keywords,
      matching_method: matchingMethod,
      ...(matchingMethod === "partial"
        ? { partial_percentage: partialPercentage }
        : {}),
      reply_type: activeTypeConfig.value,
      reply_id: selectedReplyId,
      platform: selectedPlatform as any,
      recipient_type: recipientType,
      specific_contacts:
        recipientType === "specific_contacts" ? specificContacts : [],
      tag_ids: recipientType === "tags" ? tagIds : [],
      segment_ids: recipientType === "segments" ? segmentIds : [],
      ...(activeTypeConfig.source === "template"
        ? {
            variables_mapping: variablesMapping,
            media_url: mediaUrl || undefined,
            carousel_cards_data:
              carouselCardsData.length > 0 ? carouselCardsData : undefined,
            coupon_code: couponCode || undefined,
            product_retailer_id: thumbnailProductRetailerId || undefined,
          }
        : {}),
    };

    if (payload.reply_type === "template" && selectedMaterial) {
      const vars = getTemplateVariables(selectedMaterial);
      for (const v of vars) {
        if (!variablesMapping[v]) {
          toast.error(t("variable_required_template_error", "Variable {{variable}} is required for this template", { variable: v }));
          return;
        }
      }
    }

    try {
      if (isEdit) {
        const res = await updateAction({ id: editId!, data: payload }).unwrap();
        toast.success(res.message || t("keyword_action_updated", "Keyword action updated"));
      } else {
        const res = await createAction(payload).unwrap();
        toast.success(res.message || t("keyword_action_created", "Keyword action created"));
      }
      router.push(ROUTES.KeywordAction);
    } catch (err: any) {
      toast.error(err?.data?.message || t("failed_save_keyword_action", "Failed to save keyword action"));
    }
  };

  const validateStep = (s: number) => {
    if (s === 1) {
      if (keywords.length === 0) return t("add_at_least_one_keyword", "Add at least one keyword");
    } else if (s === 2) {
      if (!selectedReplyId) return t("select_reply_material", "Select a reply material");
    } else if (s === 3) {
      if (activeTypeConfig.source === "template" && selectedMaterial) {
        const vars = getTemplateVariables(selectedMaterial);
        for (const v of vars) {
          if (!variablesMapping[v]) return t("variable_required_error", "Variable {{variable}} is required", { variable: v });
        }
      }
    } else if (s === (needsStep3 ? 4 : 3)) {
      if (
        recipientType === "specific_contacts" &&
        specificContacts.length === 0
      )
        return t("select_contact_error", "Please select at least one contact");
      if (recipientType === "tags" && tagIds.length === 0)
        return t("select_tag_error", "Please select at least one tag");
      if (recipientType === "segments" && segmentIds.length === 0)
        return t("select_segment_error", "Please select at least one segment");
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
      setStep(3);
    } else if (step === 3 && needsStep3) {
      setStep(4);
    } else if (step === totalSteps) {
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
    // Validate forward jumps
    for (let i = step; i < idx; i++) {
      const err = validateStep(i);
      if (err) {
        toast.error(err);
        return;
      }
    }
    setStep(idx);
  };

  const isSubmitting = isCreating || isUpdating;

  if (loadingEdit) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 sm:p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(ROUTES.KeywordAction)}
          className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isEdit ? t("edit_keyword_action") : t("new_keyword_action")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Automatically reply to messages matching keywords
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-6 shadow-sm">
        <StepIndicator
          current={step}
          total={totalSteps}
          labels={wizardLabels}
          onStepClick={handleStepClick}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
          {step === 1 && (
            <div className="sm:p-6 p-4 space-y-7">
              {/* Select Channel */}
              <div className="space-y-3">
                <Label className="text-sm font-bold text-slate-500">
                  {t("select_channel", "Select Channel")}
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                  {platforms
                    .filter((p) => {
                      if (p.id === "whatsapp") return true;
                      if (p.id === "telegram")
                        return (
                          enabled.telegram && isFeatureEnabled("tg_keyword")
                        );
                      if (p.id === "facebook")
                        return (
                          enabled.facebook && isFeatureEnabled("fb_keyword")
                        );
                      if (p.id === "instagram")
                        return (
                          enabled.instagram && isFeatureEnabled("ig_keyword")
                        );
                      return true;
                    })
                    .map((p) => {
                      const isSelected = selectedPlatform === p.id;
                      return (
                        <Button
                          key={p.id}
                          type="button"
                          onClick={() => handlePlatformChange(p.id)}
                          className={cn(
                            "flex flex-col items-center h-[140px] gap-0 justify-center p-4 rounded-lg border text-center transition-all duration-300 relative group cursor-pointer select-none",
                            isSelected
                              ? `${p.border} ${p.activeBorder} shadow-md scale-[1.02] hover:bg-gray-50 dark:hover:bg-(--table-hover) ring-2 ring-primary/10`
                              : "border-slate-100 dark:hover:bg-(--table-hover)! dark:bg-(--page-body-bg) bg-gray-50 hover:bg-gray-50! dark:border-(--card-border-color) hover:border-primary/20 hover:bg-slate-50/50 dark:hover:bg-(--table-hover)",
                          )}
                        >
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110",
                              p.bg,
                            )}
                          >
                            {p.icon}
                          </div>
                          <span
                            className={cn(
                              "text-sm font-bold transition-colors",
                              isSelected
                                ? "text-slate-800 dark:text-white"
                                : "text-slate-500 dark:text-slate-300",
                            )}
                          >
                            {t("platform_" + p.id, p.name)}
                          </span>
                          <span className="text-xs text-slate-500 mt-1 break-all whitespace-normal line-clamp-1 max-w-full px-1">
                            {t("platform_" + p.id + "_desc", p.desc)}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2.5 right-2.5 rtl:right-[unset] rtl:left-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-sm">
                              <Check
                                size={10}
                                strokeWidth={4}
                                className="text-white"
                              />
                            </div>
                          )}
                        </Button>
                      );
                    })}
                </div>
              </div>

              <div className="mb-3!">
                <h2 className="text-sm font-medium text-slate-900 dark:text-white">
                  Keywords
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Add keywords that will trigger this reply action.
                </p>
              </div>

              {/* Keyword Tag Input */}
              <div className="space-y-2">
                <div
                  className={cn(
                    "min-h-10 p-3 rounded-lg border transition-all cursor-text flex flex-wrap gap-2 items-center",
                    "bg-slate-50 dark:bg-(--page-body-bg) focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10",
                    keywords.length
                      ? "border-primary/20"
                      : "border-slate-200 dark:border-none",
                  )}
                  onClick={() => document.getElementById("kw-input")?.focus()}
                >
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex break-all whitespace-normal line-clamp-1 items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-xs font-bold bg-primary text-white"
                    >
                      {kw}
                      <Button
                        type="button"
                        onClick={() =>
                          setKeywords((p) => p.filter((k) => k !== kw))
                        }
                        className="w-4 h-4 rounded-full bg-[unset]! p-0! hover:bg-white/30 flex items-center justify-center text-white"
                      >
                        <X size={9} strokeWidth={3} />
                      </Button>
                    </span>
                  ))}
                  <Input
                    id="kw-input"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      keywords.length === 0
                        ? "Type a keyword and press Enter or comma..."
                        : "Add another..."
                    }
                    className="flex-1 min-w-32 bg-transparent outline-none border-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>
                {keywordInput && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={addKeyword}
                    variant="outline"
                    className="h-8 p-3 text-xs rounded-lg gap-1.5"
                  >
                    <Plus size={12} />{" "}
                    <span className="break-all whitespace-normal">
                      Add &ldquo;{keywordInput}&rdquo;
                    </span>
                  </Button>
                )}
                <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                  <Info size={11} /> Press{" "}
                  <kbd className="bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded text-[10px] font-bold">
                    Enter
                  </kbd>{" "}
                  to add each keyword.
                </p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Matching Method
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MATCHING_METHODS.map((m) => (
                    <Button
                      key={m.value}
                      type="button"
                      onClick={() => setMatchingMethod(m.value)}
                      className={cn(
                        "flex h-18 justify-start items-start gap-3 p-4 rounded-lg border text-left transition-all",
                        matchingMethod === m.value
                          ? "border-primary bg-primary/5! ring-1 ring-primary/10 shadow-sm"
                          : "border-slate-100 dark:border-(--card-border-color) hover:border-primary/20 hover:bg-slate-50/50! bg-[unset]! dark:hover:bg-(--table-hover)!",
                      )}
                    >
                      <div
                        className={cn(
                          "w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all",
                          matchingMethod === m.value
                            ? "border-primary bg-primary"
                            : "border-slate-300 dark:border-(--card-border-color)",
                        )}
                      >
                        {matchingMethod === m.value && (
                          <Check size={5} className="text-white" />
                        )}
                      </div>
                      <div className="min-w-0 ">
                        <p
                          className={cn(
                            "text-sm font-bold",
                            matchingMethod === m.value
                              ? "text-primary"
                              : "text-slate-800 dark:text-white",
                          )}
                        >
                          {t("matching_method_" + m.value, m.label)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {t("matching_method_" + m.value + "_desc", m.description)}
                        </p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {matchingMethod === "partial" && (
                <PercentageSlider
                  value={partialPercentage}
                  onChange={setPartialPercentage}
                />
              )}
            </div>
          )}

          {step === 2 && (
            <div className="sm:p-6 p-4 space-y-5">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {t("step_reply_material", "Reply Material")}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t("choose_send_trigger", "Choose what to send when a keyword is triggered.")}
                </p>
              </div>

              <div className="flex items-center gap-2.5 p-3.5 bg-primary/5 rounded-xl border border-primary/10">
                <Sparkles size={16} className="text-primary shrink-0" />
                <p className="text-xs text-primary font-semibold">
                  {t("select_material_autosend", "Select the material to auto-send when any keyword matches.")}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t("reply_type", "Reply Type")}
                  </Label>
                  <Button
                    type="button"
                    onClick={() => {
                      const route =
                        activeTypeConfig.value === "flow"
                          ? ROUTES.WhatsappFormCreate
                          : activeTypeConfig.value === "appointment_flow"
                            ? "/whatsapp_appointment/add"
                            : ROUTES.ReplyMaterials;
                      window.open(route, "_blank");
                    }}
                    className="flex items-center bg-[unset]! gap-1.5 text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest px-1"
                  >
                    <Plus size={12} strokeWidth={3} />
                    {t("add_reply_type_btn", "Add {{type}}", { type: t("reply_type_" + activeTypeConfig.label.toLowerCase().replace(" ", "_"), activeTypeConfig.label) })}
                    <ExternalLink size={10} className="ml-0.5 opacity-50" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredReplyTypes.map((rt) => {
                    const idx = REPLY_TYPES.indexOf(rt);
                    return (
                      <Button
                        key={`${rt.value}-${rt.label}`}
                        type="button"
                        onClick={() => handleTypeChange(idx)}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border transition-all",
                          activeTypeIndex === idx
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "border-slate-200 bg-[unset]! dark:border-(--card-border-color) text-slate-500 hover:border-primary/30 hover:text-primary hover:bg-primary/5",
                        )}
                      >
                        <span
                          className={cn(
                            "transition-colors",
                            activeTypeIndex === idx ? "text-white" : rt.color,
                          )}
                        >
                          {rt.icon}
                        </span>
                        {t("reply_type_" + rt.label.toLowerCase().replace(" ", "_"), rt.label)}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <Input
                  value={materialSearch}
                  onChange={(e) => setMaterialSearch(e.target.value)}
                  placeholder={t("search_materials_placeholder", "Search {{type}} materials...", { type: t("reply_type_" + activeTypeConfig.label.toLowerCase().replace(" ", "_"), activeTypeConfig.label) })}
                  className="pl-10 h-11 rounded-xl border-slate-200 dark:border-(--card-border-color) bg-slate-50 dark:bg-(--dark-body)"
                />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {isLoadingMaterials ? (
                  <div className="py-14 flex flex-col items-center gap-2 text-slate-400">
                    <Loader2 size={24} className="animate-spin text-primary" />
                    <span className="text-xs font-medium">
                      {t("loading_materials", "Loading materials...")}
                    </span>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="py-14 text-center space-y-2">
                    <div className="text-slate-300 dark:text-slate-600 flex justify-center">
                      <Mailbox className="w-10 h-10 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">
                      {t("no_materials_found", "No {{type}} materials found", { type: t("reply_type_" + activeTypeConfig.label.toLowerCase().replace(" ", "_"), activeTypeConfig.label) })}
                    </p>
                  </div>
                ) : (
                  filteredItems.map((item: any) => (
                    <div
                      key={item._id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleMaterialSelect(item._id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleMaterialSelect(item._id);
                        }
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left group cursor-pointer",
                        selectedReplyId === item._id
                          ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/10"
                          : "border-slate-100 dark:border-(--card-border-color) hover:border-primary/30 hover:bg-slate-50/50 dark:hover:bg-(--table-hover)",
                      )}
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-slate-800 dark:text-white truncate">
                            {item.name}
                          </p>
                          {activeTypeConfig.value !== "appointment_flow" && (
                            <Button
                              type="button"
                              onClick={(e) => handlePreview(e, item)}
                              className="p-1! bg-[unset]! h-[unset]! rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                            >
                              <Eye size={18} />
                            </Button>
                          )}
                        </div>
                        {item.category && (
                          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 break-all whitespace-normal line-clamp-1">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all border",
                          selectedReplyId === item._id
                            ? "bg-primary border-primary"
                            : "border-slate-200 dark:border-(--card-border-color)",
                        )}
                      >
                        {selectedReplyId === item._id && (
                          <Check
                            size={11}
                            strokeWidth={4}
                            className="text-white"
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {step === 3 && needsStep3 && selectedMaterial && (
            <div className="sm:p-6 p-4 space-y-5">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {t("configure_template", "Configure Template")}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {t("configure_template_desc", "Map variables and configure options for this template.")}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-(--page-body-bg) rounded-lg border border-slate-100 dark:border-none flex items-center gap-3">
                <LayoutTemplate
                  size={16}
                  className="text-indigo-500 shrink-0"
                />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">
                    {(selectedMaterial as any).name}
                  </p>
                  <p className="text-sm text-slate-400">{t("selected_template", "Selected template")}</p>
                </div>
              </div>

              <TemplateConfig
                template={selectedMaterial}
                wabaId={wabaId}
                variablesMapping={variablesMapping}
                onVariableChange={(key, val) =>
                  setVariablesMapping((prev) => ({ ...prev, [key]: val }))
                }
                mediaUrl={mediaUrl}
                onMediaUrlChange={setMediaUrl}
                hasMediaHeader={hasMediaHeader}
                couponCode={couponCode}
                onCouponCodeChange={setCouponCode}
                offerExpirationMinutes={offerExpirationMinutes}
                onOfferExpirationMinutesChange={setOfferExpirationMinutes}
                thumbnailProductRetailerId={thumbnailProductRetailerId}
                onThumbnailProductRetailerIdChange={
                  setThumbnailProductRetailerId
                }
                carouselCardsData={carouselCardsData}
                onCarouselCardsDataChange={setCarouselCardsData}
                carouselProducts={carouselProducts}
                onCarouselProductsChange={setCarouselProducts}
                mappingOptions={mappingOptions}
              />
            </div>
          )}

          {step === totalSteps && (
            <div className="sm:p-6 p-4 space-y-7 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4">
                <div className="p-2.5 sm:p-3.5 bg-primary/10 rounded-lg">
                  <Users className="text-primary w-6 h-6" />
                </div>
                <div>
                  <h2 className="sm:text-lg text-sm font-black text-slate-800 dark:text-white tracking-tight">
                    {t("recipients_selection", "Recipients Selection")}
                  </h2>
                  <p className="text-slate-500 font-medium text-xs">
                    {t("recipients_selection_desc", "Choose who will receive this keyword message flow.")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                {recipientOptions.map((type) => {
                  const isSelected = recipientType === type.id;
                  return (
                    <Button variant="unstyled"
                      key={type.id}
                      type="button"
                      onClick={() => setRecipientType(type.id as any)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 relative group cursor-pointer h-32 select-none",
                        isSelected
                          ? `${type.border} ${type.activeBorder} shadow-md scale-[1.02] ring-2 ring-primary/10`
                          : "border-slate-100 dark:border-(--card-border-color) hover:border-primary/20 hover:bg-slate-50/50 dark:hover:bg-(--table-hover)",
                      )}
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-2.5 transition-transform duration-300 group-hover:scale-110",
                          type.bg,
                        )}
                      >
                        {type.icon}
                      </div>
                      <span
                        className={cn(
                          "text-xs sm:text-sm font-bold transition-colors",
                          isSelected
                            ? "text-slate-800 dark:text-white"
                            : "text-slate-600 dark:text-slate-300",
                        )}
                      >
                        {t("recipient_option_" + type.id + "_title", type.title)}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 line-clamp-1 max-w-full px-1">
                        {t("recipient_option_" + type.id + "_desc", type.desc)}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center shadow-sm">
                          <Check
                            size={10}
                            strokeWidth={4}
                            className="text-white"
                          />
                        </div>
                      )}
                    </Button>
                  );
                })}
              </div>

              <div className="min-h-25 animate-in fade-in slide-in-from-top-4 mt-5">
                {recipientType === "specific_contacts" && (
                  <RecipientSelectionField
                    label={t("search_select_contacts", "Search & Select Contacts")}
                    placeholder={t("start_typing_contact_placeholder", "Start typing contact name...")}
                    options={contacts.map((c: any) => ({
                      label: `${c.name} ${c.phone_number ? `(${maskSensitiveData(c.phone_number, "phone", is_demo_mode)})` : ""}`,
                      value: c._id,
                    }))}
                    selectedValues={specificContacts}
                    onChange={setSpecificContacts}
                  />
                )}

                {recipientType === "tags" && (
                  <RecipientSelectionField
                    label={t("select_customer_tags", "Select Customer Tags")}
                    placeholder={t("select_tags_placeholder", "Select one or more tags...")}
                    options={tags.map((t: any) => ({
                      label: t.label,
                      value: t._id,
                      color: t.color,
                    }))}
                    selectedValues={tagIds}
                    onChange={setTagIds}
                  />
                )}

                {recipientType === "segments" && (
                  <RecipientSelectionField
                    label={t("select_customer_segments", "Select Customer Segments")}
                    placeholder={t("select_segments_placeholder", "Select one or more segments...")}
                    options={segments.map((s: any) => ({
                      label: s.name,
                      value: s._id,
                    }))}
                    selectedValues={segmentIds}
                    onChange={setSegmentIds}
                  />
                )}

                {recipientType === "all_contacts" && (
                  <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20 shadow-xs text-primary-darker dark:text-primary">
                    <Users size={20} className="shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold">
                        {t("targeting_all_contacts", "Targeting all eligible contacts")}
                      </h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        {t("targeting_all_contacts_desc", "Your keyword action will automatically trigger and reply to all active contacts in your database (total: {{count}} contact{{plural}}).", { count: contacts.length, plural: contacts.length !== 1 ? "s" : "" })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="sm:px-6 px-4 py-4 border-t border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) flex items-center gap-3">
            <Button
              variant="outline"
              onClick={
                step === 1
                  ? () => router.push(ROUTES.KeywordAction)
                  : () => setStep((s) => (s - 1) as any)
              }
              className="flex-1 h-11 rounded-lg font-bold"
            >
              {step === 1 ? (
                t("cancel", "Cancel")
              ) : (
                <>
                  <ArrowLeft size={16} className="mr-1.5" /> {t("back", "Back")}
                </>
              )}
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting || (step === 2 && isLoadingMaterials)}
              className="flex-1 h-11 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : step === totalSteps ? (
                <>
                  <Check size={16} className="mr-1.5" />
                  {isEdit ? t("update_action", "Update Action") : t("create_action", "Create Action")}
                </>
              ) : (
                <>
                  {t("next", "Next")} <ArrowRight size={16} className="ml-1.5" />
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) sm:p-5 p-4 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-500">{t("summary", "Summary")}</h3>

            <div className="space-y-1.5">
              <p className="text-sm font-bold text-slate-400">{t("column_header_keywords", "Keywords")}</p>
              {keywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary break-all whitespace-normal line-clamp-1"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">{t("no_keywords_yet", "No keywords yet")}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-slate-400">{t("matching", "Matching")}</p>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                {t("matching_method_" + matchingMethod, MATCHING_METHODS.find((m) => m.value === matchingMethod)?.label || matchingMethod)}
                {matchingMethod === "partial" && (
                  <span className="ml-1.5 text-amber-500">
                    ({partialPercentage}%)
                  </span>
                )}
              </p>
            </div>

            {selectedReplyId && (
              <div className="space-y-1.5">
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  {t("reply", "Reply")}
                </p>
                <div className="flex items-center gap-2">
                  <span className={cn("shrink-0", activeTypeConfig.color)}>
                    {activeTypeConfig.icon}
                  </span>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                    {(selectedMaterial as any)?.name || "—"}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-(--card-border-color)">
              <p className="text-sm font-bold text-slate-400">{t("recipients", "Recipients")}</p>
              <div className="flex items-center gap-2">
                <span className="text-primary">
                  <Users size={16} />
                </span>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 capitalize">
                  {t("recipient_option_" + recipientType + "_title", recipientType.replace("_", " "))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/10 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles size={14} className="text-primary" />
              <p className="text-xs font-black text-primary uppercase tracking-wider">
                {t("tips", "Tips")}
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 list-disc list-inside leading-relaxed">
              <li>{t("tip_multiple_keywords", "Add multiple keywords for broader coverage")}</li>
              <li>
                {t("tip_partial_match", "Use Partial Match for typo tolerance")}
              </li>
              <li>{t("tip_variable_substitution", "Templates support variable substitution")}</li>
            </ul>
          </div>
        </div>
      </div>
      {previewItem && (
        <MaterialPreviewModal
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
          type={previewItem.type}
          material={previewItem.material}
          platform={selectedPlatform}
        />
      )}
    </div>
  );
};

export default KeywordActionForm;
