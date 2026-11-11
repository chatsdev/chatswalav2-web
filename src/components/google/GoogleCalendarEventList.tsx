/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { cn } from "@/src/lib/utils";
import {
  useCreateEventMutation,
  useDeleteEventMutation,
  useListEventsQuery,
  useUpdateEventMutation,
} from "@/src/redux/api/googleApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { GoogleCalendarEventListProps, GoogleEvent } from "@/src/types/google";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs from "dayjs";
import {
  Calendar as CalendarIcon,
  Edit2,
  LayoutGrid,
  List,
  Plus,
  Trash2,
} from "lucide-react";
import { useAppSelector } from "@/src/redux/hooks";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import EventModal from "./EventModal";

const GoogleCalendarEventList: React.FC<GoogleCalendarEventListProps> = ({
  calendarId,
}) => {
  const { t } = useTranslation();
  const { sidebarToggle } = useAppSelector((state) => state.layout);
  const [viewMode, setViewMode] = useState<"table" | "calendar">("table");
  const calendarRef = useRef<FullCalendar | null>(null);

  useEffect(() => {
    if (viewMode === "calendar" && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const timer = setTimeout(() => {
        calendarApi.updateSize();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [sidebarToggle, viewMode]);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({ key: "start", order: "desc" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<GoogleEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<GoogleEvent | null>(null);

  const { data, isLoading, isFetching, refetch } = useListEventsQuery({
    calendarId,
    page,
    limit: viewMode === "calendar" ? 1000 : limit,
    search: debouncedSearchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
  });

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();
  const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleOpenModal = (event: GoogleEvent | null = null) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleConfirmEvent = async (formData: {
    summary: string;
    description?: string;
    start: string;
    end: string;
  }) => {
    try {
      if (selectedEvent && selectedEvent.id) {
        await updateEvent({
          calendarId,
          eventId: selectedEvent.id,
          ...formData,
        }).unwrap();
        toast.success(t("google_account_event_update_success"));
      } else {
        await createEvent({ calendarId, ...formData }).unwrap();
        toast.success(t("google_account_event_create_success"));
      }
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_save_event"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEvent({ calendarId, eventId: eventToDelete.id }).unwrap();
      toast.success(t("google_account_event_delete_success"));
      setEventToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_delete_event"));
    }
  };

  const calendarEvents = useMemo(() => {
    return (data?.events || []).map((event) => ({
      id: event.id,
      title: event.summary || "(No Title)",
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      extendedProps: event,
      backgroundColor: "var(--primary)",
      borderColor: "var(--primary)",
    }));
  }, [data?.events]);

  const handleDateClick = (arg: any) => {
    const start = dayjs(arg.date).format("YYYY-MM-DDTHH:mm");
    const end = dayjs(arg.date).add(1, "hour").format("YYYY-MM-DDTHH:mm");
    setSelectedEvent({
      id: "",
      summary: "",
      start: { dateTime: start },
      end: { dateTime: end },
    } as any);
    setIsModalOpen(true);
  };

  const handleEventClick = (arg: any) => {
    setSelectedEvent(arg.event.extendedProps as GoogleEvent);
    setIsModalOpen(true);
  };

  const initialColumns = [
    {
      id: "Summary",
      label: t("google_account_event_summary"),
      isVisible: true,
    },
    { id: "Start", label: t("google_account_event_start"), isVisible: true },
    { id: "End", label: t("google_account_event_end"), isVisible: true },
    { id: "Status", label: t("google_account_event_status"), isVisible: true },
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

  const columns = useMemo<Column<GoogleEvent>[]>(
    () => [
      {
        header: t("google_account_event_summary"),
        className: "min-w-[200px] [@media(max-width:991px)]:min-w-[270px]",
        accessorKey: "summary",
        sortable: true,
        sortKey: "summary",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center text-slate-500">
              <CalendarIcon size={16} />
            </div>
            <div>
              <div className="font-bold text-slate-700 dark:text-slate-200 break-words whitespace-normal line-clamp-2">
                {item.summary || "(No Title)"}
              </div>
              {item.description && (
                <div className="text-xs text-slate-500 line-clamp-1 break-all whitespace-normal">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        header: t("google_account_event_start"),
        className: "min-w-[150px] [@media(max-width:991px)]:min-w-[225px]",
        accessorKey: "start",
        sortable: true,
        sortKey: "start",
        cell: (item) => {
          const start = item.start.dateTime || item.start.date;
          return (
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {dayjs(start).format("DD MMM YYYY, hh:mm A")}
            </div>
          );
        },
      },
      {
        header: t("google_account_event_end"),
        className: "min-w-[150px] [@media(max-width:991px)]:min-w-[225px]",
        accessorKey: "end",
        sortable: true,
        sortKey: "end",
        cell: (item) => {
          const end = item.end.dateTime || item.end.date;
          return (
            <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {dayjs(end).format("DD MMM YYYY, hh:mm A")}
            </div>
          );
        },
      },
      {
        header: t("google_account_event_status"),
        className: "min-w-[100px] [@media(max-width:991px)]:min-w-[180px]",
        accessorKey: "status",
        sortable: true,
        sortKey: "status",
        cell: (item) => (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20 px-2 py-0.5 capitalize font-bold">
            {item.status || "confirmed"}
          </Badge>
        ),
      },
      {
        header: t("actions"),
        className:
          "text-right min-w-[120px] [@media(max-width:991px)]:min-w-[180px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all dark:hover:bg-primary/20 shadow-xs"
              onClick={() => handleOpenModal(item)}
              title={t("edit")}
            >
              <Edit2 size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs"
              onClick={() => setEventToDelete(item)}
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
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center bg-slate-100 dark:bg-(--page-body-bg) p-1 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-sm mr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("table")}
          className={cn(
            "px-3 py-3 h-auto rounded-md transition-all gap-2",
            viewMode === "table"
              ? "bg-white dark:bg-(--card-color) text-primary shadow-sm font-bold"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          <List size={16} />
          <span className="text-xs">{t("list_view")}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setViewMode("calendar")}
          className={cn(
            "px-3 py-3 h-auto rounded-md transition-all gap-2",
            viewMode === "calendar"
              ? "bg-white dark:bg-(--card-color) text-primary shadow-sm font-bold"
              : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
          )}
        >
          <LayoutGrid size={16} />
          <span className="text-xs">{t("calendar_view")}</span>
        </Button>
      </div>
      <Button
        onClick={() => handleOpenModal()}
        className="flex items-center gap-2.5 px-4.5! py-5 bg-primary hover:bg-primary text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group"
      >
        <Plus className="w-5 h-5" />
        <span>{t("google_account_calendar_add_event_btn")}</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mt-[-27px] sticky mb-5! pt-0! pb-2! bg-(--page-body-bg) pt-0! top-0 z-20 dark:bg-(--dark-body) -mx-4 sm:-mx-8 px-4 sm:px-8 transition-all duration-300">
        <CommonHeader
          title={t("google_account_calendar_events_title")}
          description={t("google_account_calendar_events_desc")}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
          searchPlaceholder={t(
            "google_account_calendar_event_search_placeholder",
          )}
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
      </div>

      <div className="bg-white dark:bg-(--card-color) rounded-lg  shadow-sm overflow-hidden p-0">
        {viewMode === "table" ? (
          <DataTable<GoogleEvent>
            data={data?.events || []}
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
            getRowId={(item) => item.id}
            emptyMessage={
              searchTerm
                ? t("no_results_for", { searchTerm })
                : t("google_account_no_events")
            }
          />
        ) : (
          <div className="sm:p-6 p-4 full-calendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={calendarEvents}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              height="auto"
              eventTimeFormat={{
                hour: "numeric",
                minute: "2-digit",
                meridiem: "short",
              }}
              dayMaxEvents={true}
            />
          </div>
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmEvent}
        isLoading={isCreating || isUpdating}
        event={selectedEvent}
      />

      <ConfirmModal
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title={t("google_account_event_delete_title")}
        subtitle={t("google_account_event_delete_subtitle")}
        confirmText={t("delete")}
        variant="danger"
      />
    </div>
  );
};

export default GoogleCalendarEventList;
