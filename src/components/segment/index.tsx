/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import {
  useBulkDeleteSegmentsMutation,
  useCreateSegmentMutation,
  useDeleteSegmentMutation,
  useGetSegmentsQuery,
  useUpdateSegmentMutation,
} from "@/src/redux/api/segmentApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Segment } from "@/src/types/segment";
import { Column } from "@/src/types/shared";
import { formatDate } from "@/src/utils";
import { Edit2, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "../shared/Can";
import SegmentModal from "./SegmentModal";
import SegmentContactsModal from "./SegmentsContactsModal";

const SegmentPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection state for bulk delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

  const {
    data: segmentsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetSegmentsQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [createSegment, { isLoading: isCreating }] = useCreateSegmentMutation();
  const [updateSegment, { isLoading: isUpdating }] = useUpdateSegmentMutation();
  const [deleteSegment, { isLoading: isDeleting }] = useDeleteSegmentMutation();
  const [bulkDeleteSegments, { isLoading: isBulkDeleting }] =
    useBulkDeleteSegmentsMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [contactsModalOpen, setContactsModalOpen] = useState(false);
  const [selectedSegmentForContacts, setSelectedSegmentForContacts] =
    useState<Segment | null>(null);

  const segments = segmentsResult?.data?.segments || [];
  const totalCount = segmentsResult?.data?.pagination?.totalItems || 0;

  const handleSave = async (data: {
    name: string;
    description?: string;
    contactIds?: string[];
  }) => {
    try {
      if (editingSegment) {
        await updateSegment({ id: editingSegment._id, ...data }).unwrap();
        toast.success("Segment updated successfully");
      } else {
        await createSegment(data).unwrap();
        toast.success("Segment created successfully");
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save segment");
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteSegment(deleteId).unwrap();
        toast.success(t("segment_success_deleted"));
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || t("common_error"));
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    try {
      await bulkDeleteSegments(selectedIds).unwrap();
      toast.success(
        t("segment_success_bulk_deleted", { count: selectedIds.length }),
      );
      setSelectedIds([]);
      setShowBulkDeleteModal(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("common_error"));
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const columns: Column<Segment>[] = [
    {
      header: "Name",
      className: "[@media(max-width:1440px)]:min-w-[200px]",
      accessorKey: "name",
      sortable: true,
      sortKey: "name",
    },
    {
      header: "Description",
      accessorKey: "description",
      cell: (row) => (
        <span className="text-gray-600 dark:text-gray-400 break-all whitespace-normal line-clamp-2">
          {row.description || "-"}
        </span>
      ),
    },
    {
      header: "Contacts",
      cell: (row) => (
        <Button
          onClick={() => {
            setSelectedSegmentForContacts(row);
            setContactsModalOpen(true);
          }}
          className="flex items-center gap-2 transition-colors cursor-pointer bg-transparent hover:bg-transparent text-gray-600 hover:text-primary"
        >
          <Users size={14} className="text-gray-400" />
          <span className="font-medium">{row.member_count || 0}</span>
        </Button>
      ),
    },
    {
      header: "Created At",
      sortable: true,
      sortKey: "created_at",
      cell: (row) => (
        <span className="text-gray-500 text-sm dark:text-gray-400">
          {formatDate(row.created_at)}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Can permission="update.segments">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs"
              onClick={() => {
                setEditingSegment(row);
                setModalOpen(true);
              }}
            >
              <Edit2 size={14} />
            </Button>
          </Can>
          <Can permission="delete.segments">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs"
              onClick={() => setDeleteId(row._id)}
            >
              <Trash2 size={14} />
            </Button>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <div className="sm:p-8 p-4 space-y-8 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) min-h-full">
      <CommonHeader
        title={t("segments_page_title")}
        description={t("segments_page_description")}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        searchPlaceholder="Search segments..."
        onRefresh={() => refetch()}
        onAddClick={() => {
          setEditingSegment(null);
          setModalOpen(true);
        }}
        addLabel="Add Segment"
        addPermission="create.segments"
        isLoading={isLoading}
        selectedCount={selectedIds.length}
        onBulkDelete={
          selectedIds.length > 0
            ? () => setShowBulkDeleteModal(true)
            : undefined
        }
        deletePermission="delete.segments"
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 mt-8 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable
          data={segments}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching || isDeleting}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
          getRowId={(item) => item._id}
          emptyMessage={
            searchTerm
              ? `No segments found matching "${searchTerm}"`
              : "No segments found. Add your first segment."
          }
          className="border-none shadow-none rounded-none"
          onSortChange={(key, order) => {
            setSortBy(key);
            setSortOrder(order);
          }}
          enableSelection={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          actionPermission={["update.segments", "delete.segments"]}
        />
      </div>

      <SegmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        segment={editingSegment}
        isLoading={isCreating || isUpdating}
      />

      {/* Single delete confirm */}
      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Segment"
        subtitle="Are you sure you want to delete this segment? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      {/* Bulk delete confirm */}
      <ConfirmModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={handleBulkDelete}
        isLoading={isBulkDeleting}
        title={`Delete ${selectedIds.length} Segment${selectedIds.length > 1 ? "s" : ""}`}
        subtitle={`Are you sure you want to delete ${selectedIds.length} selected segment${selectedIds.length > 1 ? "s" : ""}? This action cannot be undone.`}
        confirmText="Delete All"
        variant="danger"
      />

      <SegmentContactsModal
        isOpen={contactsModalOpen}
        onClose={() => {
          setContactsModalOpen(false);
          setSelectedSegmentForContacts(null);
        }}
        segment={selectedSegmentForContacts}
      />
    </div>
  );
};

export default SegmentPage;
