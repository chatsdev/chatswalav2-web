/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/elements/ui/select";
import {
  useDeleteTemplateMutation,
  useGetTemplatesQuery,
  usePublishTemplateMutation,
  useSyncTemplatesStatusMutation,
} from "@/src/redux/api/templateApi";
import { useGetConnectionsQuery } from "@/src/redux/api/whatsappApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Template } from "@/src/types/components";
import { MessageTemplatesProps } from "@/src/types/components/template";
import { WABAConnection } from "@/src/types/whatsapp";
import { Database, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { SyncTemplateModal } from "./list/SyncTemplateModal";
import { TemplateCard } from "./list/TemplateCard";
import { TemplatePreviewModal } from "./list/TemplatePreviewModal";

const getPlatformColor = (platform?: string) => {
  switch (platform) {
    case "telegram":
      return "#229ED9";
    case "facebook":
      return "#1877F2";
    case "instagram":
      return "#E1306C";
    case "whatsapp":
      return "var(--primary)";
    default:
      return "var(--primary)";
  }
};

const MessageTemplates = ({
  wabaId,
  statusFilter: statusFilterProp,
  onToggleSidebar,
  platform = "whatsapp",
}: MessageTemplatesProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const isWhatsApp = platform === "whatsapp";

  const { data: connectionsResponse } = useGetConnectionsQuery(
    { limit: 100 },
    { skip: !isWhatsApp },
  );
  const connections: WABAConnection[] = connectionsResponse?.data || [];

  const [syncTemplatesStatus, { isLoading: isSyncingStatus }] =
    useSyncTemplatesStatusMutation();
  const [deleteTemplate, { isLoading: isDeleting }] =
    useDeleteTemplateMutation();
  const [publishTemplate, { isLoading: isPublishing }] =
    usePublishTemplateMutation();

  const resolvedStatus =
    statusFilterProp && statusFilterProp !== "all"
      ? statusFilterProp
      : undefined;

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetTemplatesQuery({
    waba_id: wabaId,
    platform: platform,
    search: searchQuery || undefined,
    category: categoryFilter === "all-categories" ? undefined : categoryFilter,
    status: resolvedStatus,
  });
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);

  const handleRefresh = async () => {
    refetch();
    toast.success("Templates refresh successfully");
  };

  const handleSync = async () => {
    setIsSyncModalOpen(true);
  };

  const handleSyncStatus = async () => {
    try {
      await syncTemplatesStatus({ waba_id: wabaId }).unwrap();
      toast.success("Templates status synced successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to sync templates status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTemplateId) return;
    try {
      const response = await deleteTemplate(deleteTemplateId).unwrap();
      toast.success(response.message || "Template deleted successfully");
      setDeleteTemplateId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete template");
      setDeleteTemplateId(null);
    }
  };

  const [publishTemplateId, setPublishTemplateId] = useState<string | null>(
    null,
  );

  const handleConfirmPublish = async () => {
    if (!publishTemplateId) return;
    try {
      const response = await publishTemplate(publishTemplateId).unwrap();
      toast.success(response.message || "Template published successfully");
      setPublishTemplateId(null);
    } catch (error: any) {
      console.error("Publish error:", error);
      toast.error(
        error?.data?.message ||
          error?.data?.error ||
          error?.error ||
          "Failed to publish template",
      );
      setPublishTemplateId(null);
    }
  };

  const templates: Template[] = response?.data || [];

  const getStatusBadge = (status: string) => {
    const s = status?.toUpperCase();
    switch (s) {
      case "APPROVED":
        return (
          <Badge className="bg-light-primary text-primary border-[var(--primary-opacity-20)] dark:border-primary dark:bg-transparent hover:bg-light-primary px-2 py-0.5 text-[10px] font-bold">
            APPROVED
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-amber-50 dark:bg-(--card-color)! dark:border-(--card-border-color) text-amber-600 border-amber-100 hover:bg-amber-50 px-2 py-0.5 text-[10px] font-bold">
            PENDING
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-rose-50 text-rose-600 border-rose-100 dark:bg-(--card-color)! dark:border-(--card-border-color) hover:bg-rose-50 px-2 py-0.5 text-[10px] font-bold">
            REJECTED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) text-slate-600 border-slate-100 hover:bg-slate-50 px-2 py-0.5 text-[10px] font-bold">
            {s || "DRAFT"}
          </Badge>
        );
    }
  };

  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const currentWaba = connections.find((c) => c.id === wabaId);

  const WabaDisplay = isWhatsApp ? (
    <div className="flex items-center gap-3 px-4 py-2 bg-white/50 dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-xs">
      <div className="p-1.5 bg-primary/10 rounded-md">
        <Database className="w-4 h-4 text-primary" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider leading-none mb-0.5">
          Connected WABA ID
        </span>
        <span className="text-sm font-semibold text-slate-700 dark:text-amber-50 leading-tight">
          {currentWaba?.whatsapp_business_account_id}
        </span>
      </div>
    </div>
  ) : null;

  return (
    <div className="p-4 pt-0! sm:p-6 space-y-8 h-screen flex flex-col min-w-0 overflow-hidden">
      <CommonHeader
        backBtn={true}
        onBack={() => router.push(ROUTES.MessageTemplates)}
        title={t("templates_page_title")}
        titleColor={getPlatformColor(platform)}
        description={t("templates_page_description")}
        featureKey="template_bots_used"
        onRefresh={handleRefresh}
        onSync={isWhatsApp ? handleSync : undefined}
        onSyncStatus={isWhatsApp ? handleSyncStatus : undefined}
        syncStatusPermission="create.template"
        isLoading={isLoading}
        isSyncingStatus={isSyncingStatus}
        onSearch={setSearchQuery}
        searchTerm={searchQuery}
        searchPlaceholder="Search templates..."
        rightContent={
          <div className="flex items-center flex-col sm:flex-row gap-3">
            {WabaDisplay}
            <Button variant="unstyled"
              onClick={() =>
                router.push(
                  `${ROUTES.MessageTemplates}/${wabaId}/create?platform=${platform}`,
                )
              }
              className="flex items-center gap-2.5 px-4.5 h-12 rounded-lg font-bold text-white cursor-pointer transition-all hover:opacity-90 active:scale-95 shadow-sm text-sm"
              style={{ backgroundColor: getPlatformColor(platform) }}
            >
              <Plus className="w-4 h-4 text-white" />
              <span>{t("create_new_template")}</span>
            </Button>
          </div>
        }
        onToggleSidebar={onToggleSidebar}
      >
        <div className="flex gap-2 flex-wrap">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-11 py-5 border-slate-200 dark:border-(--card-border-color) rounded-lg w-40 bg-white/50 dark:bg-(--card-color) transition-all">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200/60 shadow-xl dark:bg-(--page-body-bg) dark:border-(--card-border-color)">
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="UTILITY">Utility</SelectItem>
              <SelectItem value="AUTHENTICATION">Authentication</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CommonHeader>

      <div className="flex-1 overflow-y-auto px-1 pb-10 custom-scrollbar">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm text-slate-500 font-medium tracking-wide">
              Fetching templates...
            </p>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-32 bg-white/50 dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color)">
            <p className="text-sm text-slate-500 dark:text-amber-50">
              No templates found matching your criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 pb-4">
            {templates.map((template) => (
              <TemplateCard
                key={template._id}
                template={template}
                onSelect={(t) => setPreviewTemplate(t)}
                onPreview={(t) => setPreviewTemplate(t)}
                onEdit={(id) =>
                  router.push(
                    `${ROUTES.MessageTemplates}/${wabaId}/edit/${id}?platform=${platform}`,
                  )
                }
                onDelete={(id) => setDeleteTemplateId(id)}
                onPublish={(id) => setPublishTemplateId(id)}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}
      </div>

      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
      />

      <ConfirmModal
        isOpen={!!deleteTemplateId}
        onClose={() => setDeleteTemplateId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Template"
        subtitle="Are you sure you want to delete this template? This action will remove it permanently from WhatsApp."
        confirmText="Yes, delete it"
        variant="danger"
      />

      <ConfirmModal
        isOpen={!!publishTemplateId}
        onClose={() => setPublishTemplateId(null)}
        onConfirm={handleConfirmPublish}
        isLoading={isPublishing}
        title="Publish Template"
        subtitle="Are you sure you want to publish this draft? This will submit it for approval if required."
        confirmText="Yes, publish it"
        variant="primary"
      />

      <SyncTemplateModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        wabaId={wabaId}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default MessageTemplates;
