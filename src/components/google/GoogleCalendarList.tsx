/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import {
  useCreateCalendarMutation,
  useDeleteCalendarMutation,
  useFetchCalendarsQuery,
  useLinkCalendarMutation,
} from "@/src/redux/api/googleApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { GoogleCalendar, GoogleCalendarListProps } from "@/src/types/google";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import dayjs from "dayjs";
import {
  Calendar,
  CalendarClock,
  CheckCircle2,
  Link as LinkIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import AddCalendarModal from "./AddCalendarModal";

const GoogleCalendarList: React.FC<GoogleCalendarListProps> = ({
  accountId,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({ key: "created_at", order: "desc" });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [calendarToLink, setCalendarToLink] = useState<GoogleCalendar | null>(
    null,
  );
  const [calendarToDelete, setCalendarToDelete] =
    useState<GoogleCalendar | null>(null);

  const { data, isLoading, isFetching, refetch } = useFetchCalendarsQuery({
    accountId,
    page,
    limit,
    search: debouncedSearchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
  });

  const [createCalendar, { isLoading: isCreating }] =
    useCreateCalendarMutation();
  const [linkCalendar, { isLoading: isLinking }] = useLinkCalendarMutation();
  const [deleteCalendar, { isLoading: isDeleting }] =
    useDeleteCalendarMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleAddCalendar = async (summary: string) => {
    try {
      await createCalendar({ accountId, summary }).unwrap();
      toast.success(t("google_account_calendar_create_success"));
      setIsAddModalOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.message || t("google_account_calendar_create_failed"),
      );
    }
  };

  const handleConfirmLink = async () => {
    if (!calendarToLink) return;
    try {
      await linkCalendar({
        id: calendarToLink._id,
        is_linked: !calendarToLink.is_linked,
      }).unwrap();
      toast.success(
        calendarToLink.is_linked
          ? t("google_account_calendar_unlink_success")
          : t("google_account_calendar_link_success"),
      );
      setCalendarToLink(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message || t("google_account_calendar_link_failed"),
      );
    }
  };

  const handleConfirmDelete = async () => {
    if (!calendarToDelete) return;
    try {
      await deleteCalendar(calendarToDelete._id).unwrap();
      toast.success(t("google_account_calendar_delete_success"));
      setCalendarToDelete(null);
    } catch (error: any) {
      toast.error(
        error?.data?.message || t("google_account_calendar_delete_failed"),
      );
    }
  };

  const initialColumns = [
    { id: "Name", label: t("google_account_calendar_name"), isVisible: true },
    {
      id: "Linked",
      label: t("google_account_calendar_linked_status"),
      isVisible: true,
    },
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

  const columns = useMemo<Column<GoogleCalendar>[]>(
    () => [
      {
        header: t("google_account_calendar_name"),
        className: "min-w-[250px] [@media(max-width:991px)]:min-w-[325px]",
        accessorKey: "name",
        sortable: true,
        sortKey: "name",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center text-slate-500">
              <Calendar size={16} />
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200 break-all whitespace-normal line-clamp-2">
              {item.name}
            </div>
          </div>
        ),
      },
      {
        header: t("google_account_calendar_linked_status"),
        className: "min-w-[150px] [@media(max-width:991px)]:min-w-[190px]",
        accessorKey: "is_linked",
        sortable: true,
        sortKey: "is_linked",
        cell: (item) =>
          item.is_linked ? (
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-2.5 py-0.5 font-bold">
              <CheckCircle2 size={12} /> {t("linked")}
            </Badge>
          ) : (
            <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 gap-1.5 px-2.5 py-0.5 font-bold">
              {t("unlinked")}
            </Badge>
          ),
      },
      {
        header: t("created_at"),
        className: "min-w-[200px] [@media(max-width:991px)]:min-w-[225px]",
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
        className:
          "text-right min-w-[150px] [@media(max-width:991px)]:min-w-[225px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all dark:hover:bg-primary/20 shadow-xs"
              onClick={() =>
                router.push(
                  `${ROUTES.GoogleAccount}/${accountId}/calendars/${item._id}/events`,
                )
              }
              title={t("google_account_calendar_events_title")}
            >
              <CalendarClock size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "w-10 h-10 border-none rounded-lg transition-all shadow-xs",
                item.is_linked
                  ? "text-primary hover:text-primary hover:bg-light-primary dark:hover:bg-primary/10"
                  : "text-slate-600 hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
              )}
              onClick={() => setCalendarToLink(item)}
              title={item.is_linked ? t("unlink") : t("link")}
            >
              <LinkIcon size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs"
              onClick={() => setCalendarToDelete(item)}
              title={t("delete")}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    [t, accountId, router],
  );

  const rightContent = (
    <Button
      onClick={() => setIsAddModalOpen(true)}
      className="flex items-center gap-2.5 px-4.5! py-5 bg-primary text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group"
    >
      <Plus className="w-5 h-5" />
      <span>{t("google_account_add_calendar_btn")}</span>
    </Button>
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("google_account_calendars_title")}
        description={t("google_account_calendars_desc")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
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
        <DataTable<GoogleCalendar>
          data={data?.calendars || []}
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
              : t("google_account_no_calendars")
          }
        />
      </div>

      <AddCalendarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onConfirm={handleAddCalendar}
        isLoading={isCreating}
      />

      <ConfirmModal
        isOpen={!!calendarToLink}
        onClose={() => setCalendarToLink(null)}
        onConfirm={handleConfirmLink}
        isLoading={isLinking}
        title={
          calendarToLink?.is_linked
            ? t("google_account_calendar_unlink_title")
            : t("google_account_calendar_link_title")
        }
        subtitle={
          calendarToLink?.is_linked
            ? t("google_account_calendar_unlink_subtitle")
            : t("google_account_calendar_link_subtitle")
        }
        variant="primary"
      />

      <ConfirmModal
        isOpen={!!calendarToDelete}
        onClose={() => setCalendarToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={t("google_account_calendar_delete_title")}
        subtitle={t("google_account_calendar_delete_subtitle")}
        confirmText={t("delete")}
        variant="danger"
      />
    </div>
  );
};

export default GoogleCalendarList;
