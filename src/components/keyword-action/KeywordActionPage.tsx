/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import {
  MATCHING_METHOD_COLORS,
  MATCHING_METHOD_LABELS,
} from "@/src/data/KeywordActionData";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import {
  useBulkDeleteKeywordActionsMutation,
  useDeleteKeywordActionMutation,
  useGetKeywordActionsQuery,
} from "@/src/redux/api/keywordActionApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { KeywordAction } from "@/src/types/keywordAction";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const KeywordActionPage: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const wabaId = selectedWorkspace?.waba_id || "";

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, isFetching } = useGetKeywordActionsQuery(
    {
      waba_id: wabaId,
      page,
      limit,
      search,
      sort_by: sortBy,
      sort_order: sortOrder,
    },
    { skip: !wabaId },
  );
  const [deleteAction, { isLoading: isDeleting }] =
    useDeleteKeywordActionMutation();
  const [bulkDelete, { isLoading: isBulkDeleting }] =
    useBulkDeleteKeywordActionsMutation();

  const items = data?.data || [];
  const pagination = data?.pagination;

  const columns = useMemo(
    () => [
      {
        header: t("column_header_keywords", "Keywords"),
        sortable: true,
        sortKey: "keywords",
        cell: (row: KeywordAction) => (
          <div className="flex flex-wrap gap-1.5">
            {row.keywords.slice(0, 3).map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/5 text-primary border border-primary/10"
              >
                {kw}
              </span>
            ))}
            {row.keywords.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-(--dark-body)">
                +{row.keywords.length - 3}
              </span>
            )}
          </div>
        ),
      },
      {
        header: t("column_header_channel", "Channel"),
        sortable: true,
        sortKey: "platform",
        cell: (row: KeywordAction) => {
          const platform = row.platform || "whatsapp";
          let color =
            "bg-light-primary text-primary border-[var(--primary-opacity-20)] dark:bg-primary/10 dark:text-primary dark:border-primary/20";
          let label = t("platform_whatsapp", "WhatsApp");
          if (platform === "telegram") {
            color =
              "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20";
            label = t("platform_telegram", "Telegram");
          } else if (platform === "facebook") {
            color =
              "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
            label = t("platform_facebook", "Facebook");
          } else if (platform === "instagram") {
            color =
              "bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20";
            label = t("platform_instagram", "Instagram");
          }
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${color}`}
            >
              {label}
            </span>
          );
        },
      },
      {
        header: t("column_header_method", "Method"),
        sortable: true,
        sortKey: "matching_method",
        cell: (row: KeywordAction) => (
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${MATCHING_METHOD_COLORS[row.matching_method] || ""}`}
          >
            {t("matching_method_" + row.matching_method, MATCHING_METHOD_LABELS[row.matching_method] || row.matching_method)}
            {row.matching_method === "partial" &&
              row.partial_percentage !== undefined && (
                <span className="ml-1 opacity-60">
                  ({row.partial_percentage}%)
                </span>
              )}
          </span>
        ),
      },
      {
        header: t("column_header_reply_type", "Reply Type"),
        sortable: true,
        sortKey: "reply_type",
        cell: (row: KeywordAction) => (
          <Badge
            variant="outline"
            className="capitalize font-semibold text-slate-500 dark:text-slate-400"
          >
            {row.reply_type}
          </Badge>
        ),
      },
      {
        header: t("column_header_reply", "Reply"),
        cell: (row: KeywordAction) => {
          const name =
            (row.reply_id as any)?.name ||
            (row.reply_id as any)?.template_name ||
            (row.reply_id as any)?.display_name ||
            (row.reply_id as any)?.title ||
            "—";
          return (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate max-w-xs block">
              {name}
            </span>
          );
        },
      },
      {
        header: t("column_header_status", "Status"),
        sortable: true,
        sortKey: "status",
        cell: (row: KeywordAction) => (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${row.status === "active" ? "bg-light-primary text-primary dark:bg-primary/10 dark:text-primary" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${row.status === "active" ? "bg-primary" : "bg-slate-400"}`}
            />
            {row.status === "active" ? t("keyword_status_active", "Active") : t("keyword_status_inactive", "Inactive")}
          </span>
        ),
      },
      {
        header: t("column_header_actions", "Actions"),
        cell: (row: KeywordAction) => (
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`${ROUTES.KeywordAction}/${row._id}/edit`);
              }}
              className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 dark:bg-(--page-body-bg) rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs"
            >
              <Edit2 size={14} />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                setItemToDelete(row._id);
              }}
              className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 dark:bg-(--page-body-bg) hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ),
        className: "w-24",
      },
    ],
    [router, t],
  );

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      const res = await deleteAction(itemToDelete).unwrap();
      toast.success(res.message || "Deleted successfully");
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete");
    }
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const handleBulkDelete = async () => {
    try {
      const res = await bulkDelete(selectedIds).unwrap();
      toast.success(res.message || "Deleted successfully");
      setSelectedIds([]);
      setItemToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to bulk delete");
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader
        title={t("keyword_action_page_title")}
        description={t("keyword_action_page_description")}
        searchTerm={search}
        onSearch={setSearch}
        searchPlaceholder={t("search_by_keyword_placeholder", "Search by keyword...")}
        onAddClick={() => router.push(ROUTES.KeywordActionCreate)}
        addLabel={t("add_keyword_trigger", "Add Keyword Trigger")}
        addPermission="update.message_bots"
        isLoading={isLoading || isFetching}
        onBulkDelete={
          selectedIds.length > 0 ? () => setItemToDelete("bulk") : undefined
        }
        selectedCount={selectedIds.length}
      />

      <DataTable<KeywordAction>
        data={items}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyMessage={t("no_keyword_actions_empty", "No keyword actions found. Create one to automate keyword-based replies.")}
        enableSelection
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        totalCount={pagination?.totalItems}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(val) => {
          setLimit(val);
          setPage(1);
        }}
        onSortChange={handleSortChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        actionPermission={["update.message_bots"]}
      />

      <ConfirmModal
        isOpen={!!itemToDelete && itemToDelete !== "bulk"}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={t("delete_keyword_trigger_title", "Delete Keyword Trigger?")}
        subtitle={t("delete_keyword_trigger_subtitle", "This will permanently remove this keyword action. This action cannot be undone.")}
      />

      <ConfirmModal
        isOpen={itemToDelete === "bulk"}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleBulkDelete}
        isLoading={isBulkDeleting}
        title={t("bulk_delete_keyword_triggers_title", "Bulk Delete Keyword Triggers?")}
        subtitle={t("bulk_delete_keyword_triggers_subtitle", "You are about to delete {{count}} keyword action(s). This action cannot be undone.", { count: selectedIds.length })}
      />
    </div>
  );
};

export default KeywordActionPage;
