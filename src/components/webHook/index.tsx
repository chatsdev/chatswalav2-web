/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateWebhookMutation, useDeleteWebhookMutation, useListWebhooksQuery, useToggleWebhookMutation, useUpdateWebhookMutation } from "@/src/redux/api/webhookApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Webhook } from "@/src/types/webhook";
import { LayoutGrid } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import WebhookCard from "./WebhookCard";
import WebhookModal from "./WebhookModal";
import WebhookPayloadModal from "./WebhookPayloadModal";
import WebhookTable from "./WebhookTable";

const WebhookPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data, isLoading, refetch } = useListWebhooksQuery({ search: searchTerm, sort_by: sortBy, sort_order: sortOrder, page, limit });
  const webhookData = data?.data?.webhooks;
  const [createWebhook, { isLoading: isCreating }] = useCreateWebhookMutation();
  const [updateWebhook, { isLoading: isUpdating }] = useUpdateWebhookMutation();
  const [deleteWebhook, { isLoading: isDeleting }] = useDeleteWebhookMutation();
  const [toggleWebhook] = useToggleWebhookMutation();
  const [localStatuses, setLocalStatuses] = useState<Record<string, boolean>>({});
  // const [searchTerm, setSearchTerm] = useState(""); // Already moved above
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedWebhook, setSelectedWebhook] = useState<Webhook | null>(null);
  const [viewMode] = useState<"grid" | "table">("table");

  const handleAddClick = () => {
    setSelectedWebhook(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    const webhook = webhookData?.find((w) => {
      const wId = (typeof w._id === "string" ? w._id : w._id?.$oid) || w.id;
      return wId === id;
    });
    if (webhook) {
      setSelectedWebhook(webhook);
      setIsDeleteModalOpen(true);
    }
  };

  const handleViewPayload = (webhook: Webhook) => {
    setSelectedWebhook(webhook);
    setIsPayloadModalOpen(true);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: !currentStatus }));
    try {
      await toggleWebhook(id).unwrap();
      toast.success(t("webhook_status_updated_successfully", "Webhook status updated successfully"));
    } catch (error: any) {
      setLocalStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.error(error?.data?.message || t("failed_to_toggle_status", "Failed to toggle status"));
    }
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleModalSubmit = async (formData: Partial<Webhook>) => {
    try {
      if (selectedWebhook) {
        const id = (typeof selectedWebhook._id === "string" ? selectedWebhook._id : selectedWebhook._id?.$oid) || selectedWebhook.id;
        if (id) {
          await updateWebhook({ id, body: formData }).unwrap();
          toast.success(t("webhook_updated_successfully", "Webhook updated successfully"));
        }
      } else {
        await createWebhook(formData).unwrap();
        toast.success(t("webhook_created_successfully", "Webhook created successfully"));
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("something_went_wrong", "Something went wrong"));
    }
  };

  const confirmDelete = async () => {
    if (!selectedWebhook) return;
    const id = (typeof selectedWebhook._id === "string" ? selectedWebhook._id : selectedWebhook._id?.$oid) || selectedWebhook.id;
    if (!id) return;

    try {
      await deleteWebhook(id).unwrap();
      toast.success(t("webhook_deleted_successfully", "Webhook deleted successfully"));
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_delete_webhook", "Failed to delete webhook"));
    }
  };

  const filteredWebhooks = useMemo(() => {
    if (!webhookData) return [];
    return webhookData?.filter((w) => w.webhook_name.toLowerCase().includes(searchTerm.toLowerCase()) || (w.webhook_url && w.webhook_url.toLowerCase().includes(searchTerm.toLowerCase())));
  }, [webhookData, searchTerm]);

  return (
    <div className="sm:p-8 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) p-4 space-y-8 animate-in fade-in duration-500 min-h-full">
      <CommonHeader
        title={t("webhooks_page_title")}
        description={t("webhooks_page_description")}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        featureKey="whatsapp_webhook_used"
        searchPlaceholder={t("search_webhooks_placeholder", "Search webhooks...")}
        onRefresh={() => {
          refetch();
          toast.success(t("webhooks_refreshed_successfully", "Webhooks refreshed successfully"));
        }}
        onAddClick={handleAddClick}
        addLabel={t("create_event_notification", "Create Event Notification")}
        addPermission="create.ecommerce_webhooks"
        isLoading={isLoading}
      />

      {viewMode === "grid" ? (
        isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-64 bg-slate-100 dark:bg-(--card-color) animate-pulse rounded-lg" />
            ))}
          </div>
        ) : filteredWebhooks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWebhooks.map((webhook) => {
              const wId = ((typeof webhook._id === "string" ? webhook._id : webhook._id?.$oid) || webhook.id || "") as string;
              return <WebhookCard key={wId} webhook={webhook} localStatus={localStatuses[wId]} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggle={handleToggle} onViewPayload={handleViewPayload} />;
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-(--card-color) rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="bg-slate-50 dark:bg-(--dark-sidebar) p-6 rounded-full mb-4">
              <LayoutGrid className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-amber-50">{t("no_webhooks_found", "No webhooks found")}</h3>
            <p className="text-slate-500 dark:text-gray-400 max-w-xs mt-2">{t("no_webhooks_yet_desc", "You haven't created any webhooks yet. Click the button above to get started.")}</p>
          </div>
        )
      ) : (
        <WebhookTable data={webhookData || []} isLoading={isLoading} localStatuses={localStatuses} onEdit={handleEditClick} onDelete={handleDeleteClick} onToggle={handleToggle} onViewPayload={handleViewPayload} onSortChange={handleSortChange} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} totalCount={data?.data?.pagination?.totalItems || 0} />
      )}

      <WebhookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleModalSubmit} webhook={selectedWebhook || undefined} isLoading={isCreating || isUpdating} />

      <WebhookPayloadModal isOpen={isPayloadModalOpen} onClose={() => setIsPayloadModalOpen(false)} webhook={selectedWebhook || undefined} />

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} isLoading={isDeleting} title={t("delete_webhook", "Delete Webhook")} subtitle={t("delete_webhook_confirm", "Are you sure you want to delete \"{{name}}\"? This action cannot be undone.", { name: selectedWebhook?.webhook_name })} confirmText={t("delete", "Delete")} variant="danger" />
    </div>
  );
};

export default WebhookPage;
