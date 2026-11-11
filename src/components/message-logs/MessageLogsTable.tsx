/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useGetMessageLogsQuery } from "@/src/redux/api/whatsappApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { Eye, Smartphone } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  getDirectionBadge,
  getPlatformBadge,
  getStatusBadge,
} from "./MessageLogsBadges";
import { MessageLogsDetailsModal } from "./MessageLogsDetailsModal";
import { MessageLogsFilter } from "./MessageLogsFilter";

import { initialMessageLogColumns } from "@/src/data/messageLogs";
import { useAppSelector } from "@/src/redux/hooks";

const MessageLogsTable: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all_status");
  const [platformFilter, setPlatformFilter] = useState("all_platforms");
  const [timeFilter, setTimeFilter] = useState("all_time");

  // Selected message for details preview modal
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  // Reset page to 1 when workspace changes
  React.useEffect(() => {
    setPage(1);
  }, [workspaceId]);

  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetMessageLogsQuery({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== "all_status" ? statusFilter : undefined,
    platform: platformFilter !== "all_platforms" ? platformFilter : undefined,
    timeFilter: timeFilter !== "all_time" ? timeFilter : undefined,
    workspaceId,
  });

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all_status");
    setPlatformFilter("all_platforms");
    setTimeFilter("all_time");
    setPage(1);
    toast.success("Filters cleared successfully");
  };

  const [visibleColumns, setVisibleColumns] = useState(
    initialMessageLogColumns,
  );

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col,
      ),
    );
  };

  const columns = useMemo<Column<any>[]>(
    () => [
      {
        header: "Recipient",
        className: "min-w-[210px]",
        accessorKey: "phone_number",
        copyable: true,
        copyField: "phone_number",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200 dark:border-(--card-border-color)">
              {item.contact ? (
                item.contact.charAt(0).toUpperCase()
              ) : (
                <Smartphone size={14} />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-700 dark:text-slate-200 leading-tight">
                {item.contact || "Unknown Contact"}
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {item.phone_number}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: "Platform",
        className: "min-w-[140px]",
        accessorKey: "platform",
        cell: (item) => getPlatformBadge(item.platform),
      },
      {
        header: "Direction",
        className: "min-w-[130px]",
        accessorKey: "direction",
        cell: (item) => getDirectionBadge(item.direction),
      },
      {
        header: "Type",
        className: "min-w-[110px]",
        accessorKey: "type",
        cell: (item) => (
          <Badge
            variant="outline"
            className="border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 capitalize font-medium px-2 py-0.5 text-xs"
          >
            {item.type || "text"}
          </Badge>
        ),
      },
      {
        header: "Content",
        className: "min-w-[260px] max-w-[340px]",
        accessorKey: "content",
        cell: (item) => {
          const content = item.content || "";
          return (
            <div
              className="max-w-xs truncate text-slate-500 dark:text-slate-400 text-sm font-medium pr-4 break-words"
              title={content}
            >
              {content}
            </div>
          );
        },
      },
      {
        header: "Status",
        className: "min-w-[140px]",
        accessorKey: "status",
        cell: (item) => getStatusBadge(item.status, item.error),
      },
      {
        header: "Sent At",
        className: "min-w-[185px]",
        accessorKey: "sent_at",
        cell: (item) => (
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            {new Date(item.sent_at).toLocaleString()}
          </div>
        ),
      },
      {
        header: "Actions",
        className: "text-right min-w-[100px]",
        cell: (item) => (
          <div className="flex items-center justify-end">
            <Button
              onClick={() => setSelectedMessage(item)}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-xs dark:bg-(--page-body-bg) hover:bg-primary/10 dark:hover:bg-primary/20 text-slate-400 hover:text-primary transition-all cursor-pointer"
              title="View Detailed Payload"
            >
              <Eye size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("message_logs_page_title")}
        description={t("message_logs_page_description")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Search by number or content..."
        onRefresh={() => {
          refetch();
          toast.success("Logs updated in real-time");
        }}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
      />

      {/* Advanced Filters Section */}
      <MessageLogsFilter
        platformFilter={platformFilter}
        setPlatformFilter={(val) => {
          setPlatformFilter(val);
          setPage(1);
        }}
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        timeFilter={timeFilter}
        setTimeFilter={(val) => {
          setTimeFilter(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        handleClearFilters={handleClearFilters}
      />

      {/* Data Table Grid */}
      <div className="bg-white dark:bg-(--card-color) rounded-lg shadow-sm overflow-hidden">
        <DataTable<any>
          data={response?.data?.logs || []}
          columns={columns.filter(
            (col) =>
              visibleColumns.find((vc) => vc.label === col.header)
                ?.isVisible !== false,
          )}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={response?.data?.pagination?.totalItems || 0}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          enableSelection={false}
          emptyMessage={
            searchTerm ||
            platformFilter !== "all_platforms" ||
            statusFilter !== "all_status" ||
            timeFilter !== "all_time"
              ? "No message logs found matching these filters."
              : "No message log history available."
          }
          actionPermission={["view.message_logs"]}
        />
      </div>

      {/* Details View Modal */}
      <MessageLogsDetailsModal
        selectedMessage={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </div>
  );
};

export default MessageLogsTable;
