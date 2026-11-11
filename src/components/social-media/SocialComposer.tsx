/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MediaSelectionModal from "@/src/components/chat/MediaSelectionModal";
import { StepIndicator } from "@/src/components/social-automation/StepIndicator";
import { Button } from "@/src/elements/ui/button";
import { Card } from "@/src/elements/ui/card";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import { ArrowRight, Eye, Loader2, Share2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { usePermissions } from "@/src/hooks/usePermissions";
import { getPlatformIcon } from "./SocialMediaUtils";

import { ROUTES } from "@/src/constants";
import { useCreateAttachmentMutation } from "@/src/redux/api/mediaApi";
import { useGetConnectedSocialAccountsQuery } from "@/src/redux/api/socialMediaConnectionApi";
import {
  useGenerateCaptionMutation,
  usePublishContentMutation,
} from "@/src/redux/api/socialPublishApi";
import { Attachment } from "@/src/types/components";

// Modularized components
import {
  AICaptionModal,
  getPlatformStyle,
  LANGUAGES,
  PLATFORM_CONTENT_TYPES,
  StepCaption,
  StepChannels,
  StepMedia,
  StepPublishing,
  TONES
} from "./composer";
import SocialComposerSkeleton from "./SocialComposerSkeleton";


import {
  FacebookPreview,
  InstagramPreview,
  LinkedInPreview,
  ThreadsPreview,
  TwitterPreview,
  YouTubePreview
} from "./SocialPreviews";

export default function SocialComposer() {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const canPublish = hasPermission("publish.social_publish");
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryDate = searchParams?.get("date");
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  // Wizard Step State
  const [currentStep, setCurrentStep] = useState(0);

  // Selected state
  const [selectedAccounts, setSelectedAccounts] = useState<any[]>([]);
  const [caption, setCaption] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<Attachment[]>([]);
  const [selectedContentType, setSelectedContentType] = useState<string>("post");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledAt, setScheduledAt] = useState("");
  const [activePreviewAccountId, setActivePreviewAccountId] = useState<string>("");

  useEffect(() => {
    if (queryDate) {
      setIsScheduled(true);
      const normalizedDate = queryDate.replace(/\s(\d{2}:?\d{2})$/, "+$1");
      if (/^\d{4}-\d{2}-\d{2}$/.test(normalizedDate)) {
        setScheduledAt(`${normalizedDate}T12:00`);
      } else {
        const parsedDate = new Date(normalizedDate);
        if (!isNaN(parsedDate.getTime())) {
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
          const day = String(parsedDate.getDate()).padStart(2, "0");
          const hours = String(parsedDate.getHours()).padStart(2, "0");
          const minutes = String(parsedDate.getMinutes()).padStart(2, "0");
          setScheduledAt(`${year}-${month}-${day}T${hours}:${minutes}`);
        } else {
          setScheduledAt(normalizedDate);
        }
      }
    }
  }, [queryDate]);

  const activePreviewAccount = useMemo(() => {
    return selectedAccounts.find((acc) => acc._id === activePreviewAccountId);
  }, [selectedAccounts, activePreviewAccountId]);

  // Modals state
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCaptionModal, setShowCaptionModal] = useState(false);

  // AI Caption State
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiTone, setAiTone] = useState(TONES[0]);
  const [aiLanguage, setAiLanguage] = useState(LANGUAGES[0]);
  const [aiLimit, setAiLimit] = useState(200);
  const [aiCustomPrompt, setAiCustomPrompt] = useState("");
  const [aiNumCaptions, setAiNumCaptions] = useState(3);
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([]);

  // API mutations
  const [publishContent, { isLoading: isPublishing }] = usePublishContentMutation();
  const [generateCaption, { isLoading: isGeneratingCaption }] = useGenerateCaptionMutation();
  const [createAttachment, { isLoading: isUploadingFile }] = useCreateAttachmentMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch connected channels
  const { data: connectionsRes, isLoading: isLoadingConnections } = useGetConnectedSocialAccountsQuery(
    { workspace_id: workspaceId },
    { skip: !workspaceId }
  );

  const connections = useMemo(() => connectionsRes?.data || [], [connectionsRes]);

  // Compute common intersection of supported content types for selected accounts
  const intersectedContentTypes = useMemo(() => {
    if (selectedAccounts.length === 0) return [];
    let common = PLATFORM_CONTENT_TYPES[selectedAccounts[0].platform] || [];
    for (let i = 1; i < selectedAccounts.length; i++) {
      const platformTypes = PLATFORM_CONTENT_TYPES[selectedAccounts[i].platform] || [];
      common = common.filter((type) => platformTypes.includes(type));
    }
    return common;
  }, [selectedAccounts]);

  const handleAccountToggle = (account: any) => {
    setSelectedAccounts((prev) => {
      const isSelected = prev.some((acc) => acc._id === account._id);
      const updated = isSelected ? prev.filter((acc) => acc._id !== account._id) : [...prev, account];

      // Update active preview account
      if (updated.length > 0) {
        const activeExists = updated.some(
          (acc) => acc._id === activePreviewAccountId
        );
        if (!activeExists) {
          setActivePreviewAccountId(updated[0]._id);
        }
      } else {
        setActivePreviewAccountId("");
      }

      // Update selected content type
      let common = updated.length > 0 ? PLATFORM_CONTENT_TYPES[updated[0].platform] || [] : [];
      for (let i = 1; i < updated.length; i++) {
        const platformTypes = PLATFORM_CONTENT_TYPES[updated[i].platform] || [];
        common = common.filter((type) => platformTypes.includes(type));
      }
      if (common.length > 0 && !common.includes(selectedContentType)) {
        setSelectedContentType(common[0]);
      }

      return updated;
    });
  };

  const handleAddEmoji = (emojiData: any) => {
    setCaption((prev) => prev + emojiData.emoji);
  };

  const handleRemoveMedia = (id: string) => {
    setSelectedMedia((prev) => prev.filter((m) => m._id !== id));
  };

  const handleMediaSelectFromLibrary = (attachments: Attachment[]) => {
    setSelectedMedia((prev) => {
      const existingIds = prev.map((m) => m._id);
      const newItems = attachments.filter((att) => !existingIds.includes(att._id));
      return [...prev, ...newItems];
    });
  };

  const handleLocalFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const isVideoFormat = ["video", "videos", "reels", "reel", "shorts", "short"].includes(selectedContentType?.toLowerCase());
    if (isVideoFormat && !file.type.startsWith("video/")) {
      toast.error("This publishing format only supports video uploads");
      return;
    }

    const formData = new FormData();
    formData.append("attachments", file);

    try {
      const res = await createAttachment(formData).unwrap();
      if (res.success && res.data && res.data.length > 0) {
        const uploaded = res.data[0];
        setSelectedMedia((prev) => [...prev, uploaded]);
        toast.success("File uploaded successfully to media library");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to upload file");
    }
  };

  const handleGenerateCaptionsSubmit = async () => {
    if (!aiKeywords.trim()) {
      toast.error("Please enter a topic or keywords first");
      return;
    }

    try {
      const platform = selectedAccounts.length > 0 ? selectedAccounts[0].platform : "instagram";
      const res = await generateCaption({
        platform,
        content_type: selectedContentType,
        tone: aiTone.toLowerCase(),
        language: aiLanguage,
        character_limit: aiLimit,
        keywords: aiKeywords,
        custom_prompt: aiCustomPrompt,
        num_captions: aiNumCaptions
      }).unwrap();

      if (res.success && res.data?.captions) {
        setGeneratedCaptions(res.data.captions);
      } else {
        toast.error("Failed to generate captions. Please try again.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Error generating captions");
    }
  };

  const handlePublishSubmit = async () => {
    if (selectedAccounts.length === 0) {
      toast.error("Please select at least one social account");
      return;
    }

    const isVideoFormat = ["video", "videos", "reels", "reel", "shorts", "short"].includes(selectedContentType?.toLowerCase());
    const isPostFormat = ["post", "posts", "feed"].includes(selectedContentType?.toLowerCase());
    const validMedia = isVideoFormat
      ? selectedMedia.filter((m) => m.mimeType?.startsWith("video/") || m.fileUrl?.endsWith(".mp4"))
      : isPostFormat
        ? selectedMedia.filter((m) => !m.mimeType?.startsWith("video/") && !m.fileUrl?.endsWith(".mp4"))
        : selectedMedia;

    if (!caption.trim() && validMedia.length === 0) {
      toast.error(
        isVideoFormat
          ? "Please provide a video attachment for this format"
          : "Please provide either a caption or at least one media attachment"
      );
      return;
    }

    if (isScheduled && !scheduledAt) {
      toast.error("Please specify a future date and time for scheduling");
      return;
    }

    if (isScheduled) {
      const schedDate = new Date(scheduledAt);
      if (schedDate <= new Date()) {
        toast.error("Scheduled date must be in the future");
        return;
      }
    }

    const payload = {
      accountIds: selectedAccounts.map((acc) => acc._id),
      mediaUrls: validMedia.map((m) => m.fileUrl),
      caption,
      contentTypes: [selectedContentType],
      scheduled_at: isScheduled ? new Date(scheduledAt).toISOString() : null,
      workspace_id: workspaceId
    };

    try {
      const res = await publishContent(payload).unwrap();
      if (res.success) {
        toast.success(res.message || "Post created successfully!");
        router.push(ROUTES.SocialMediaActivity);
      } else {
        toast.error(res.error || "Failed to publish post");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || "Error creating post");
    }
  };

  const handleNextStep = () => {
    if (currentStep === 0) {
      if (selectedAccounts.length === 0) {
        toast.error("Please select at least one social channel before proceeding");
        return;
      }
      if (intersectedContentTypes.length === 0) {
        toast.error("Selected channels do not share any common content type");
        return;
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const WIZARD_STEPS = [
    { title: "Channels", description: "Select channels" },
    { title: "Caption", description: "Write post body" },
    { title: "Media", description: "Add attachments" },
    { title: "Publishing", description: "Schedule timings" }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <CommonHeader
        title={t("social_media_publish")}
        description="Write, refine, schedule and publish your social media content seamlessly."
      />

      {isLoadingConnections ? (
        <SocialComposerSkeleton />
      ) : connections.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center border-slate-200/60 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) max-w-2xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
            <Share2 size={28} className="text-primary animate-pulse" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
            No Social Channels Connected
          </h3>
          <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
            Connect your Facebook Pages, Instagram Accounts, LinkedIn Profiles, X/Twitter profiles or YouTube channels to start publishing.
          </p>
          <Button
            onClick={() => router.push(ROUTES.SocialMediaConnect)}
            className="bg-primary text-white h-11 px-6 rounded-lg font-bold flex items-center gap-2 border-none"
          >
            Connect Platforms
            <ArrowRight size={16} />
          </Button>
        </Card>
      ) : (
        <>
          {/* Step Indicator */}
          <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) p-6 shadow-sm">
            <StepIndicator
              current={currentStep + 1}
              total={4}
              labels={["Channels", "Caption", "Media", "Publishing"]}
              onStepClick={(s) => {
                const targetStep = s - 1;
                if (targetStep < currentStep) {
                  setCurrentStep(targetStep);
                } else if (targetStep > currentStep) {
                  // Allow clicking forward ONLY if previous steps are valid
                  if (selectedAccounts.length === 0) {
                    toast.error("Please select at least one channel first");
                    return;
                  }
                  if (intersectedContentTypes.length === 0) {
                    toast.error("Selected channels do not share any common content type");
                    return;
                  }
                  setCurrentStep(targetStep);
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT PANEL: Composing Form Wizard */}
            <div className="lg:col-span-2 h-fit bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden flex flex-col justify-between min-h-[500px]">
              <div className="sm:p-6 p-4 space-y-6">
                {/* STEP CONTENT CONTAINER */}
                <div className="transition-all duration-300">
                  {currentStep === 0 && (
                    <StepChannels
                      connections={connections}
                      selectedAccounts={selectedAccounts}
                      handleAccountToggle={handleAccountToggle}
                      intersectedContentTypes={intersectedContentTypes}
                      selectedContentType={selectedContentType}
                      setSelectedContentType={setSelectedContentType}
                      onManageChannels={() => router.push(ROUTES.SocialMediaConnect)}
                    />
                  )}

                  {currentStep === 1 && (
                    <StepCaption
                      caption={caption}
                      setCaption={setCaption}
                      showEmojiPicker={showEmojiPicker}
                      setShowEmojiPicker={setShowEmojiPicker}
                      handleAddEmoji={handleAddEmoji}
                      onWriteWithAI={() => {
                        setGeneratedCaptions([]);
                        setShowCaptionModal(true);
                      }}
                    />
                  )}

                  {currentStep === 2 && (
                    <StepMedia
                      selectedMedia={
                        ["video", "videos", "reels", "reel", "shorts", "short"].includes(selectedContentType?.toLowerCase())
                          ? selectedMedia.filter((m) => m.mimeType?.startsWith("video/") || m.fileUrl?.endsWith(".mp4"))
                          : ["post", "posts", "feed"].includes(selectedContentType?.toLowerCase())
                            ? selectedMedia.filter((m) => !m.mimeType?.startsWith("video/") && !m.fileUrl?.endsWith(".mp4"))
                            : selectedMedia
                      }
                      handleRemoveMedia={handleRemoveMedia}
                      onBrowseLibrary={() => setShowMediaModal(true)}
                      onUploadLocal={() => fileInputRef.current?.click()}
                      isUploadingFile={isUploadingFile}
                      fileInputRef={fileInputRef}
                      handleLocalFileSelect={handleLocalFileSelect}
                      selectedContentType={selectedContentType}
                    />
                  )}

                  {currentStep === 3 && (
                    <StepPublishing
                      isScheduled={isScheduled}
                      setIsScheduled={setIsScheduled}
                      scheduledAt={scheduledAt}
                      setScheduledAt={setScheduledAt}
                    />
                  )}
                </div>
              </div>

              {/* WIZARD ACTIONS NAVIGATION */}
              <div className="sm:px-6 px-4 py-4 border-t border-slate-100 dark:border-(--card-border-color) bg-slate-50/50 dark:bg-(--card-color) flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                  className="flex-1 h-11 rounded-lg font-bold"
                >
                  Back
                </Button>

                {currentStep < 3 ? (
                  <Button
                    onClick={handleNextStep}
                    className="flex-1 h-11 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    Next Step <ArrowRight size={16} className="ml-1.5" />
                  </Button>
                ) : (
                  <Button
                    onClick={handlePublishSubmit}
                    disabled={isPublishing || !canPublish}
                    title={!canPublish ? "Permission required to publish posts" : undefined}
                    className="flex-1 h-11 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="animate-spin mr-1.5" size={16} />
                        Publishing...
                      </>
                    ) : isScheduled ? (
                      "Schedule Post"
                    ) : (
                      "Publish Post"
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* RIGHT PANEL: Sticky Live Previews */}
            <div className="lg:col-span-1 lg:sticky lg:top-6 self-start space-y-4">
              <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden min-h-[500px]">
                <div className="p-0 space-y-5">
                  <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-(--card-border-color) mb-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <Eye size={16} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Live Post Preview</h4>
                        <p className="text-sm text-slate-400 dark:text-slate-600">See how your post appears on selected platform</p>
                      </div>
                    </div>
                  </div>

                  {selectedAccounts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center min-h-[350px]">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center mb-4 text-slate-400 dark:text-slate-600">
                        <Eye size={20} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-slate-300 mb-1">
                        Preview Unavailable
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[240px] leading-relaxed">
                        Select a social media channel on the left to see a live mockup of how your post will render.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Platform tabs switcher */}
                      <div className="px-5 py-3 flex border-b border-slate-200/60 dark:border-(--card-border-color) overflow-x-auto gap-2 table-custom-scrollbar mb-0">
                        {selectedAccounts.map((acc) => {
                          const isActive = acc._id === activePreviewAccountId;
                          const style = getPlatformStyle(acc.platform);
                          const IconComponent = getPlatformIcon(acc.platform);
                          return (
                            <button
                              key={acc._id}
                              type="button"
                              onClick={() => setActivePreviewAccountId(acc._id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap flex items-center gap-1.5 ${
                                isActive
                                  ? `${style.badgeBg} border-transparent text-white`
                                  : "border text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-600"
                              }`}
                            >
                              {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                              <span>{acc.account_name}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Simulated Preview Rendering */}
                      <div className="sm:p-5 p-4 transition-all duration-300">
                        {activePreviewAccount && activePreviewAccount.platform.toLowerCase() === "facebook" && (
                          <FacebookPreview
                            account={activePreviewAccount}
                            caption={caption}
                            mediaList={selectedMedia}
                          />
                        )}
                        {activePreviewAccount && activePreviewAccount.platform.toLowerCase() === "instagram" && (
                          <InstagramPreview
                            account={activePreviewAccount}
                            caption={caption}
                            mediaList={selectedMedia}
                          />
                        )}
                        {activePreviewAccount && activePreviewAccount.platform.toLowerCase() === "linkedin" && (
                          <LinkedInPreview
                            account={activePreviewAccount}
                            caption={caption}
                            mediaList={selectedMedia}
                          />
                        )}
                        {activePreviewAccount && activePreviewAccount.platform.toLowerCase() === "twitter" && (
                          <TwitterPreview
                            account={activePreviewAccount}
                            caption={caption}
                            mediaList={selectedMedia}
                          />
                        )}
                        {activePreviewAccount && activePreviewAccount.platform.toLowerCase() === "youtube" && (
                          <YouTubePreview
                            account={activePreviewAccount}
                            caption={caption}
                            mediaList={selectedMedia}
                          />
                        )}
                        {activePreviewAccount && activePreviewAccount.platform.toLowerCase() === "threads" && (
                          <ThreadsPreview
                            account={activePreviewAccount}
                            caption={caption}
                            mediaList={selectedMedia}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL: Media selection */}
      <MediaSelectionModal
        isOpen={showMediaModal}
        onClose={() => setShowMediaModal(false)}
        onSelect={handleMediaSelectFromLibrary}
        allowedTypes={
          ["video", "videos", "reels", "reel", "shorts", "short"].includes(selectedContentType?.toLowerCase())
            ? "video"
            : ["post", "posts", "feed"].includes(selectedContentType?.toLowerCase())
              ? "image"
              : "all"
        }
      />

      {/* MODAL: AI Caption Generator */}
      <AICaptionModal
        isOpen={showCaptionModal}
        onClose={() => setShowCaptionModal(false)}
        aiKeywords={aiKeywords}
        setAiKeywords={setAiKeywords}
        aiTone={aiTone}
        setAiTone={setAiTone}
        aiLanguage={aiLanguage}
        setAiLanguage={setAiLanguage}
        aiLimit={aiLimit}
        setAiLimit={setAiLimit}
        aiNumCaptions={aiNumCaptions}
        setAiNumCaptions={setAiNumCaptions}
        aiCustomPrompt={aiCustomPrompt}
        setAiCustomPrompt={setAiCustomPrompt}
        generatedCaptions={generatedCaptions}
        setCaption={setCaption}
        isGeneratingCaption={isGeneratingCaption}
        onGenerate={handleGenerateCaptionsSubmit}
      />
    </div>
  );
}
