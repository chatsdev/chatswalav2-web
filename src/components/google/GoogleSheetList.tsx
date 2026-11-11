/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import {
  useBulkDeleteSheetsMutation,
  useCreateSheetMutation,
  useListSheetsQuery,
  useWriteSheetMutation,
} from "@/src/redux/api/googleApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import { GoogleSheet, GoogleSheetListProps } from "@/src/types/google";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import dayjs from "dayjs";
import {
  Edit2,
  Eye,
  FileSpreadsheet,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo, useState, use } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import AddSheetModal from "./AddSheetModal";
import ReadSheetModal from "./ReadSheetModal";
import WriteSheetModal from "./WriteSheetModal";
import SyncSheetsModal from "./SyncSheetsModal";
import DeleteSheetModal from "./DeleteSheetModal";

const GoogleSheetList: React.FC<GoogleSheetListProps> = ({ paramsPromise }) => {
  const params = use(paramsPromise);
  const accountId = params.id as string;
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({ key: "created_at", order: "desc" });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [readSheetId, setReadSheetId] = useState<string | null>(null);
  const [writeSheetId, setWriteSheetId] = useState<string | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data, isLoading, isFetching, refetch } = useListSheetsQuery({
    accountId,
    page,
    limit,
    search: debouncedSearchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
  });

  const [createSheet, { isLoading: isCreating }] = useCreateSheetMutation();
  const [writeSheet, { isLoading: isWriting }] = useWriteSheetMutation();
  const [bulkDeleteSheets, { isLoading: isDeleting }] =
    useBulkDeleteSheetsMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleCreateSheet = async (title: string) => {
    try {
      await createSheet({ accountId, title }).unwrap();
      toast.success(t("google_account_sheet_create_success"));
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_create_sheet"));
    }
  };

  const handleWriteSheet = async (values: string[][]) => {
    if (!writeSheetId) return;
    try {
      await writeSheet({ sheetId: writeSheetId, values }).unwrap();
      toast.success(t("google_account_write_success"));
      setWriteSheetId(null);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_write_sheet"));
    }
  };

  const handleDeleteSheets = async (deleteFrom: "google" | "platform") => {
    if (deleteIds.length === 0) return;
    try {
      await bulkDeleteSheets({
        ids: deleteIds,
        delete_from: deleteFrom,
      }).unwrap();
      toast.success(t("google_account_delete_success"));
      setDeleteIds([]);
      setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_delete_sheets"));
    }
  };

  const initialColumns = [
    { id: "Name", label: t("google_account_sheet_name"), isVisible: true },
    { id: "Sheet ID", label: t("google_account_sheet_id"), isVisible: true },
    { id: "Created At", label: t("created_at"), isVisible: true },
    { id: "Actions", label: t("actions"), isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col,
      ),
    );
  };

  const columns = useMemo<Column<GoogleSheet>[]>(
    () => [
      {
        header: t("google_account_sheet_name"),
        className: "min-w-[250px]",
        accessorKey: "name",
        sortable: true,
        sortKey: "name",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary-opacity-20)] dark:bg-primary-darker/30 flex items-center justify-center text-primary">
              <FileSpreadsheet size={16} />
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">
              {item.name}
            </div>
          </div>
        ),
      },
      {
        header: t("google_account_sheet_id"),
        className: "min-w-[200px]",
        accessorKey: "sheet_id",
        copyable: true,
        copyField: "sheet_id",
        cell: (item) => (
          <div className="text-xs font-mono text-slate-500 break-all">
            {item.sheet_id}
          </div>
        ),
      },
      {
        header: t("created_at"),
        className: "min-w-[150px]",
        accessorKey: "created_at",
        sortable: true,
        sortKey: "created_at",
        cell: (item) => (
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {dayjs(item.created_at).format("DD MMM YYYY, hh:mm A")}
          </div>
        ),
      },
      {
        header: t("actions"),
        className: "text-right min-w-[120px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-blue-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all dark:hover:bg-blue-900/20 shadow-xs"
              onClick={() => setReadSheetId(item._id)}
              title={t("google_account_read_sheet")}
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-light-primary rounded-lg transition-all dark:hover:bg-primary-darker/20 shadow-xs"
              onClick={() => setWriteSheetId(item._id)}
              title={t("google_account_write_sheet")}
            >
              <Edit2 size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-red-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs"
              onClick={() => setDeleteIds([item._id])}
              title={t("delete")}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [t],
  );

  const rightContent = (
    <div className="flex items-center flex-wrap gap-3">
      {selectedIds.length > 0 && (
        <Button
          onClick={() => setDeleteIds(selectedIds)}
          variant="outline"
          className="flex items-center gap-2.5 px-4.5! py-5 border-red-600 text-red-600 hover:bg-red-50 h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group dark:hover:bg-red-900/20 animate-in fade-in zoom-in duration-300"
        >
          <Trash2 className="w-5 h-5" />
          <span>
            {t("google_account_bulk_delete")} ({selectedIds.length})
          </span>
        </Button>
      )}
      <Button
        onClick={() => setIsSyncModalOpen(true)}
        variant="outline"
        className="flex items-center gap-2.5 px-4.5! py-5 border-primary text-primary hover:bg-light-primary h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group dark:hover:bg-primary-darker/20"
      >
        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        <span>{t("google_account_sync_sheets")}</span>
      </Button>
      <Button
        onClick={() => setIsAddModalOpen(true)}
        className="flex items-center gap-2.5 px-4.5! py-5 bg-primary  text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group"
      >
        <Plus className="w-5 h-5" />
        <span>{t("google_account_add_sheet")}</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("google_account_sheets_title")}
        description={t("google_account_sheets_desc")}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        searchPlaceholder={t("google_account_calendar_search_placeholder")}
        onRefresh={() => {
          setPage(1);
          refetch();
          toast.success(t("refresh_success"));
        }}
        rightContent={rightContent}
        isLoading={isLoading || isFetching}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        backBtn={true}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg shadow-sm overflow-hidden">
        <DataTable<GoogleSheet>
          data={data?.sheets || []}
          columns={columns.filter(
            (col) =>
              visibleColumns.find((vc) => vc.label === col.header)
                ?.isVisible !== false,
          )}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={data?.pagination?.totalItems || 0}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSortChange={handleSortChange}
          getRowId={(item) => item._id}
          emptyMessage={
            searchTerm
              ? t("no_results_for", { searchTerm })
              : t("google_account_no_sheets")
          }
          enableSelection={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <AddSheetModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleCreateSheet}
        isLoading={isCreating}
      />

      {readSheetId && (
        <ReadSheetModal
          isOpen={!!readSheetId}
          onClose={() => setReadSheetId(null)}
          sheetId={readSheetId}
        />
      )}

      <WriteSheetModal
        isOpen={!!writeSheetId}
        onClose={() => setWriteSheetId(null)}
        sheetId={writeSheetId || ""}
        onConfirm={handleWriteSheet}
        isLoading={isWriting}
      />

      <SyncSheetsModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        accountId={accountId}
      />

      <DeleteSheetModal
        isOpen={deleteIds.length > 0}
        onClose={() => setDeleteIds([])}
        onConfirm={handleDeleteSheets}
        isLoading={isDeleting}
        count={deleteIds.length}
      />
    </div>
  );
};

export default GoogleSheetList;
