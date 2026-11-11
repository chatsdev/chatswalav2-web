/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateTagMutation, useDeleteTagMutation, useGetTagsQuery, useUpdateTagMutation } from "@/src/redux/api/tagsApi";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Tag } from "@/src/types/components";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import TagModal from "./TagModal";
import TagGrid from "./TagGrid";
import CommonHeader from "@/src/shared/CommonHeader";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Label } from "@/src/elements/ui/label";

const TagsPage = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const searchTerm = useDebounce(inputValue, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);

  const {
    data: tagsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetTagsQuery({
    page,
    limit,
    search: searchTerm,
  });
  const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
  const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
  const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const tags: Tag[] = tagsResult?.data?.tags || [];
  const totalCount = tagsResult?.data?.pagination?.totalItems || 0;

  const currentPageIds = tags.map((tag) => tag._id);
  const isAllSelected = tags.length > 0 && currentPageIds.every((id) => selectedIds.includes(id));
  const isSomeSelected = currentPageIds.some((id) => selectedIds.includes(id)) && !isAllSelected;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelectedIds = Array.from(new Set([...selectedIds, ...currentPageIds]));
      setSelectedIds(newSelectedIds);
    } else {
      const newSelectedIds = selectedIds.filter((id) => !currentPageIds.includes(id));
      setSelectedIds(newSelectedIds);
    }
  };

  const handleSave = async (name: string, color: string) => {
    try {
      if (editingTag) {
        await updateTag({ id: editingTag._id, label: name, color }).unwrap();
        toast.success("Tag updated successfully");
      } else {
        await createTag({ label: name, color: color }).unwrap();
        toast.success("Tag created successfully");
      }
      setModalOpen(false);
      return { success: true };
    } catch (error: any) {
      toast.error(error?.data?.message);
      return { success: false };
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const response = await deleteTag([deleteId]).unwrap();
        toast.success(response.message || "Tag deleted successfully");
      } catch {
        toast.error("Failed to delete tag");
      } finally {
        setDeleteId(null);
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setBulkConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      const res = await deleteTag(selectedIds).unwrap();
      toast.success(res.message || "Tags deleted successfully");
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete tags");
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Successfully refreshed tags.");
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const onAddClick = () => {
    setEditingTag(null);
    setModalOpen(true);
  };

  return (
    <div className="sm:p-8 pt-0! p-4 space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader
        title={t("tags_page_title")}
        description={t("tags_page_description")}
        onSearch={handleSearch}
        searchTerm={inputValue}
        featureKey="tags_used"
        searchPlaceholder="Search tags..."
        onRefresh={handleRefresh}
        onAddClick={onAddClick}
        addLabel="Add New Badge"
        addPermission="create.tags"
        deletePermission="delete.tags"
        isLoading={isLoading}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedIds.length}
      >
        <div className="flex items-center gap-3 bg-white dark:bg-(--page-body-bg) px-4 h-11 rounded-lg border border-slate-200 dark:border-none shadow-sm transition-all duration-300">
          <Checkbox
            id="select-all"
            checked={isAllSelected ? true : isSomeSelected ? "indeterminate" : false}
            onCheckedChange={(checked) => handleSelectAll(checked === true)}
            className="h-5 w-5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <Label
            htmlFor="select-all"
            className="text-sm font-semibold text-slate-600 dark:text-gray-400 cursor-pointer select-none whitespace-nowrap"
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </Label>
        </div>
      </CommonHeader>

      <div className="mt-8">
        <TagGrid
          tags={tags}
          isLoading={isLoading}
          isFetching={isFetching || isDeleting}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={(tag) => {
            setEditingTag(tag);
            setModalOpen(true);
          }}
          onDelete={(id) => setDeleteId(id)}
          emptyMessage={searchTerm ? `No tags found matching "${searchTerm}"` : "No tags found. Add your first tag to filter chats."}
        />
      </div>

      <TagModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} tag={editingTag} isLoading={isCreating || isUpdating} />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Tag" subtitle="Are you sure you want to delete this tag? This action cannot be undone." confirmText="Delete" variant="danger" />
      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title="Bulk Delete Tags" subtitle={`Are you sure you want to delete ${selectedIds.length} selected tags? This action cannot be undone.`} confirmText="Delete All" variant="danger" />
    </div>
  );
};

export default TagsPage;

