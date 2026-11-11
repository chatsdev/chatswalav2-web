/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/src/elements/ui/dialog";
import { Input } from "@/src/elements/ui/input";
import { ApiKey, useCreateApiKeyMutation, useDeleteApiKeyMutation, useGetApiKeysQuery } from "@/src/redux/api/apiKeyApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { formatDate } from "@/src/utils";
import { Clock, Eye, EyeOff, Key, Plus, Trash2 } from "lucide-react";
import Can from "../shared/Can";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { maskSensitiveData } from "@/src/utils/masking";
import { useAppSelector } from "@/src/redux/hooks";
import { Label } from "@/src/elements/ui/label";

const ApiKeyManager = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const { is_demo_mode } = useAppSelector((state) => state.setting);

  const {
    data: result,
    isLoading,
    refetch,
    isFetching,
  } = useGetApiKeysQuery({
    page,
    limit,
  });

  const [createApiKey, { isLoading: isCreating }] = useCreateApiKeyMutation();
  const [deleteApiKeys, { isLoading: isDeleting }] = useDeleteApiKeyMutation();

  const apiKeys = result?.data || [];
  const totalCount = result?.pagination?.totalItems || 0;

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      toast.error(t("enter_key_name_error"));
      return;
    }

    try {
      const res = await createApiKey({ name: newKeyName }).unwrap();
      if (res.success) {
        setNewKeyName("");
        setIsCreateModalOpen(false);
        toast.success(t("create_success"));

        if ((res as any).api_key) {
          navigator.clipboard.writeText((res as any).api_key);
          toast.info(t("api_key_copied"));
        }
      }
    } catch (error: any) {
      toast.error(error.data?.message || t("create_key_failed"));
    }
  };

  const handleDelete = async (ids: string[]) => {
    try {
      const res = await deleteApiKeys({ ids }).unwrap();
      if (res.success) {
        toast.success(ids.length > 1 ? t("delete_success") : t("delete_key_success"));
        setSelectedIds([]);
        setDeleteId(null);
        setBulkConfirmOpen(false);
      }
    } catch (error: any) {
      toast.error(error.data?.message || t("delete_key_failed"));
    }
  };

  const handleSearch = (val: string) => {
    setSearchTerm(val);
    setPage(1);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const columns: Column<ApiKey>[] = [
    {
      header: t("key_name"),
      accessorKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-light-primary dark:bg-primary/10 text-primary flex items-center justify-center">
            <Key size={14} />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white uppercase tracking-tight">{row.name}</span>
        </div>
      ),
    },
    {
      header: t("api_key"),
      accessorKey: "prefix",
      copyable: true,
      cell: (row) => {
        const isRevealed = revealedIds.includes(row.id);
        return (
          <div className="flex items-center gap-2">
            <code className="text-xs font-mono bg-slate-100 dark:bg-(--dark-body) px-2 py-1 rounded text-slate-600 dark:text-primary min-w-30">{isRevealed ? `${maskSensitiveData(row.prefix, "phone", is_demo_mode)}` : `${maskSensitiveData(row.prefix.slice(0, 4), "phone", is_demo_mode)}••••••••••••`}</code>
            {!is_demo_mode && <Button
              onClick={(e) => {
                e.stopPropagation();
                toggleReveal(row.id);
              }}
              className="p-1.5 rounded-lg hover:bg-slate-200 bg-[unset]! p-0!  dark:hover:bg-white/10 text-slate-400 transition-all flex items-center justify-center"
              title={isRevealed ? t("hide_prefix") : t("show_prefix")}
            >
              {isRevealed ? <EyeOff size={14} className="text-primary" /> : <Eye size={14} />}
            </Button>}
          </div>
        );
      },
    },
    {
      header: t("created_at"),
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-sm text-slate-700 dark:text-gray-300">
          <Clock size={12} className="text-slate-400" />
          {formatDate(row.created_at)}
        </div>
      ),
    },
    {
      header: t("actions"),
      className: "text-right",
      cell: (row) => (
        <Can permission="delete.api_key">
          <Button variant="outline" size="sm" className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs dark:bg-(--page-body-bg)" onClick={() => setDeleteId(row.id)}>
            <Trash2 size={14} />
          </Button>
        </Can>
      ),
    },
  ];

  const filteredData = apiKeys.filter((k) => k.name?.toLowerCase().includes(searchTerm.toLowerCase()) || k.prefix?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 md:p-8 pb-20 pt-0! overflow-y-auto h-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 custom-scrollbar">
      <CommonHeader
        title={t("api_keys_title")}
        description={t("api_keys_subtitle")}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        searchPlaceholder={t("search_placeholder")}
        onRefresh={() => {
          refetch();
          toast.success(t("refresh_success"));
        }}
        onAddClick={() => setIsCreateModalOpen(true)}
        addLabel={t("create_key")}
        addPermission="create.api_key"
        deletePermission="delete.api_key"
        isLoading={isLoading}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setBulkConfirmOpen(true)}
      />

      <DataTable
        data={filteredData}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        totalCount={searchTerm ? filteredData.length : totalCount}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(l) => {
          setLimit(l);
          setPage(1);
        }}
        enableSelection={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        getRowId={(item) => item.id}
        emptyMessage={searchTerm ? t("no_keys_found_matching", { searchTerm }) : t("no_keys_found_desc")}
      />

      <Dialog
        open={isCreateModalOpen}
        onOpenChange={(open) => {
          setIsCreateModalOpen(open);
          if (!open) {
            setNewKeyName("");
          }
        }}
      >
        <DialogContent className="sm:max-w-106.25 dark:bg-(--card-color) dark:border-(--card-border-color)">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-light-primary dark:bg-(--dark-body) text-primary flex items-center justify-center">
                <Plus size={18} />
              </div>
              {t("create_key")}
            </DialogTitle>
            <DialogDescription>{t("create_key_desc")}</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-2 flex flex-col">
              <Label className="text-sm font-semibold text-slate-700 dark:text-gray-300">{t("key_name_label")}</Label>
              <Input placeholder={t("key_name_placeholder")} value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} className="rounded-lg h-11 border-(--input-border-color) bg-(--input-color) dark:border-(--card-border-color)" autoFocus />
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-2 w-full">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="flex-1 rounded-lg h-11 border-slate-200">
                {t("cancel")}
              </Button>
              <Button onClick={handleCreate} disabled={isCreating} className="flex-1 rounded-lg text-white h-11">
                {isCreating ? t("creating") : t("create_key")}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) handleDelete([deleteId]);
        }}
        isLoading={isDeleting}
        title={t("delete_key_title")}
        subtitle={t("delete_confirm")}
        confirmText={t("delete")}
        variant="danger"
      />

      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={() => handleDelete(selectedIds)} isLoading={isDeleting} title={t("bulk_delete_keys_title")} subtitle={t("bulk_delete_confirm")} confirmText={t("delete_all")} variant="danger" />
    </div>
  );
};

export default ApiKeyManager;
