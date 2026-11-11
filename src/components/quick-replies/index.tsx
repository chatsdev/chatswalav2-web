/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ConfirmModal from "@/src/shared/ConfirmModal";
import CommonHeader from "@/src/shared/CommonHeader";
import { useCreateQuickReplyMutation, useDeleteQuickReplyMutation, useGetQuickRepliesQuery, useToggleFavoriteQuickReplyMutation, useUpdateQuickReplyMutation, QuickReply } from "@/src/redux/api/quickReplyApi";
import { useAppSelector } from "@/src/redux/hooks";
import { MessageSquareText, Plus, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import QuickReplyCard from "./QuickReplyCard";
import QuickReplyModal from "./QuickReplyModal";
import QuickReplySettingsModal from "./QuickReplySettingsModal";
import { Button } from "@/src/elements/ui/button";
import Can from "../shared/Can";
import { Settings2 } from "lucide-react";
import { FilterTab } from "@/src/types/replyMaterial";



const QuickRepliesContainer = () => {
  const { t } = useTranslation();
  const { user } = useAppSelector((state: any) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<QuickReply | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const { data, isLoading, isFetching } = useGetQuickRepliesQuery({
    search: searchTerm,
    page,
    limit: 50,
    sort: "createdAt",
    order: "desc",
  });

  const [createQuickReply, { isLoading: isCreating }] = useCreateQuickReplyMutation();
  const [updateQuickReply, { isLoading: isUpdating }] = useUpdateQuickReplyMutation();
  const [deleteQuickReply, { isLoading: isDeleting }] = useDeleteQuickReplyMutation();
  const [toggleFavorite] = useToggleFavoriteQuickReplyMutation();

  const { userSetting } = useAppSelector((state) => state.setting);

  const allReplies = data?.data || [];

  const filteredReplies = allReplies.filter((qr) => {
    if (userSetting?.data?.disable_admin_quick_reply && qr.is_admin_reply) return false;
    if (activeTab === "favorites") return qr.is_favorite;
    if (activeTab === "mine") return qr.user_id === user?.id;
    return true;
  });

  const handleSave = async (payload: { content: string }) => {
    try {
      if (editingData) {
        await updateQuickReply({ id: editingData._id, ...payload }).unwrap();
        toast.success(t("quick_reply_success_updated"));
      } else {
        await createQuickReply(payload).unwrap();
        toast.success(t("quick_reply_success_created"));
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("error_occurred"));
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await deleteQuickReply([deleteId]).unwrap();
      toast.success(t("quick_reply_success_deleted"));
      setDeleteId(null);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteId));
    } catch (error: any) {
      toast.error(error?.data?.message || t("error_occurred"));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await deleteQuickReply(selectedIds).unwrap();
      toast.success(t("quick_reply_success_deleted"));
      setSelectedIds([]);
      setIsBulkDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("error_occurred"));
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds((prev) => (selected ? [...prev, id] : prev.filter((i) => i !== id)));
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      await toggleFavorite(id).unwrap();
    } catch (error: any) {
      toast.error(error?.data?.message || t("error_occurred"));
    }
  };

  const isBusy = isLoading || isFetching || isCreating || isUpdating || isDeleting;

  const tabs: { key: FilterTab; label: string; icon?: React.ReactNode }[] = [
    { key: "all", label: t("quick_reply_tab_all") },
    { key: "favorites", label: t("quick_reply_tab_favorites"), icon: <Star size={13} fill="currentColor" className="text-amber-400" /> },
    // { key: "mine", label: t("quick_reply_tab_mine") },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-(--dark-body) overflow-hidden">
      <div className="p-4 sm:p-6 pt-0! pb-0 space-y-6 shrink-0">
        <CommonHeader
          title={t("quick_replies")}
          description={t("quick_reply_description")}
          onSearch={(v) => {
            setSearchTerm(v);
            setPage(1);
          }}
          searchTerm={searchTerm}
          searchPlaceholder={t("quick_reply_search_placeholder")}
          onAddClick={() => {
            setEditingData(null);
            setIsModalOpen(true);
          }}
          addLabel={t("quick_reply_add_reply")}
          isLoading={isBusy}
          selectedCount={selectedIds.length}
          onBulkDelete={() => setIsBulkDeleteModalOpen(true)}
          addPermission="create.quick_replies"
          deletePermission="delete.quick_replies"
          extraActions={
            <Button variant="outline" onClick={() => setIsSettingsModalOpen(true)} className="h-11 px-4 gap-2 bg-white dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-400 rounded-lg font-semibold transition-all shadow-sm" disabled={isBusy} title={t("quick_reply_settings")}>
              <Settings2 size={18} className="text-slate-400 dark:text-amber-50" />
            </Button>
          }
        />

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <Button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.key ? "bg-primary text-white shadow-sm" : "bg-white hover:bg-white dark:hover:bg-(--card-color) dark:bg-(--card-color) text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-(--card-border-color) hover:border-primary/50 hover:text-primary"}`}>
              {tab.icon}
              {tab.label}
              {tab.key === "all" && data?.count !== undefined && <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === "all" ? "bg-white/20" : "bg-slate-100 dark:bg-(--dark-body) text-slate-500"}`}>{data.count}</span>}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-hidden min-h-0 p-4 pt-0! sm:p-6 flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-6 min-h-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) rounded-xl p-4 animate-pulse">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-3 w-2/3" />
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredReplies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquareText size={28} className="text-primary" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{activeTab === "favorites" ? t("quick_reply_no_favorites") : activeTab === "mine" ? t("quick_reply_no_mine") : t("quick_reply_no_replies")}</h3>
              <p className="text-sm text-slate-500 dark:text-gray-400 mb-6 max-w-sm">{t("quick_reply_empty_desc")}</p>
              {activeTab !== "favorites" && (
                <Can permission="create.quick_replies">
                  <Button
                    onClick={() => {
                      setEditingData(null);
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 text-white"
                  >
                    <Plus size={16} />
                    {t("quick_reply_add_reply")}
                  </Button>
                </Can>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredReplies.map((item) => (
                <QuickReplyCard
                  key={item._id}
                  item={item}
                  onEdit={(qr) => {
                    setEditingData(qr);
                    setIsModalOpen(true);
                  }}
                  onDelete={(id) => setDeleteId(id)}
                  onToggleFavorite={handleToggleFavorite}
                  isLoading={isBusy}
                  isSelected={selectedIds.includes(item._id)}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <QuickReplyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} editData={editingData} isLoading={isCreating || isUpdating} />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDeleteConfirm} isLoading={isDeleting} title={t("quick_reply_delete_title")} subtitle={t("quick_reply_delete_subtitle")} confirmText={t("delete")} cancelText={t("cancel")} variant="danger" />

      <QuickReplySettingsModal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} />

      <ConfirmModal isOpen={isBulkDeleteModalOpen} onClose={() => setIsBulkDeleteModalOpen(false)} onConfirm={handleBulkDelete} isLoading={isDeleting} title={t("quick_reply_delete_title")} subtitle={t("quick_reply_delete_subtitle")} confirmText={t("delete")} cancelText={t("cancel")} variant="danger" />
    </div>
  );
};

export default QuickRepliesContainer;
