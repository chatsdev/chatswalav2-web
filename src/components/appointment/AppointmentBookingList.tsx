"use client";

import { paymentColors, statusColors } from "@/src/data/appointment";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import {
  useBulkDeleteBookingsMutation,
  useListBookingsQuery,
} from "@/src/redux/api/appointmentApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { AppointmentBooking } from "@/src/types/appointment";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { maskSensitiveData } from "@/src/utils/masking";
import dayjs from "dayjs";
import {
  Calendar as CalendarIcon,
  Clock,
  CreditCard,
  Eye,
  Phone,
  RefreshCcw,
  Trash2,
  User,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import BookingDetailsModal from "./modals/BookingDetailsModal";
import BookingStatusModal from "./modals/BookingStatusModal";
import SendPaymentLinkModal from "./modals/SendPaymentLinkModal";

const AppointmentBookingList: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const configId = (Array.isArray(id) ? id[0] : id) || "";
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    order: "asc" | "desc";
  }>({ key: "created_at", order: "desc" });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewBooking, setViewBooking] = useState<AppointmentBooking | null>(
    null,
  );
  const [statusBooking, setStatusBooking] = useState<AppointmentBooking | null>(
    null,
  );
  const [paymentBooking, setPaymentBooking] =
    useState<AppointmentBooking | null>(null);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);

  const { data, isLoading, isFetching, refetch } = useListBookingsQuery({
    id: configId,
    page,
    limit,
    search: debouncedSearchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
  });

  const [bulkDelete, { isLoading: isDeleting }] =
    useBulkDeleteBookingsMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleDelete = async () => {
    if (deleteIds.length === 0) return;
    try {
      await bulkDelete(deleteIds).unwrap();
      toast.success(
        t("booking_delete_success", {
          defaultValue: "Bookings deleted successfully.",
        }),
      );
      setDeleteIds([]);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
          t("failed_to_delete_bookings", {
            defaultValue: "Failed to delete bookings.",
          }),
      );
    }
  };

  const columns = useMemo<Column<AppointmentBooking>[]>(
    () => [
      {
        id: "customer_name",
        header: t("customer_name"),
        accessorKey: "answers",
        className: "min-w-[180px]",
        sortable: true,
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center text-slate-500">
              <User size={14} />
            </div>
            <div>
              <div className="font-bold text-slate-700 dark:text-slate-200 break-all whitespace-normal line-clamp-1">
                {item.contact_id?.name || "N/A"}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-1 break-all whitespace-normal line-clamp-1">
                <Phone size={10} />{" "}
                {maskSensitiveData(
                  item.contact_id?.phone_number,
                  "phone",
                  is_demo_mode,
                ) || "N/A"}
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "appointment_date",
        header: t("appointment_date"),
        accessorKey: "start_time",
        className: "min-w-[150px]",
        sortable: true,
        cell: (item) => (
          <div className="space-y-1">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <CalendarIcon size={14} className="text-slate-400" />
              {dayjs(item.start_time).format("DD MMM YYYY")}
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <Clock size={14} className="text-slate-400" />
              {dayjs(item.start_time).format("hh:mm A")} -{" "}
              {dayjs(item.end_time).format("hh:mm A")}
            </div>
          </div>
        ),
      },
      {
        id: "status",
        header: t("status"),
        accessorKey: "status",
        className: "min-w-[120px]",
        sortable: true,
        cell: (item) => (
          <Badge
            className={`${statusColors[item.status]} px-2.5 py-0.5 font-bold`}
          >
            {t(`booking_status_${item.status}`)}
          </Badge>
        ),
      },
      {
        id: "payment_status",
        header: t("payment_status"),
        accessorKey: "payment_status",
        className: "min-w-[120px]",
        sortable: true,
        cell: (item) => (
          <Badge
            className={`${paymentColors[item.payment_status]} px-2.5 py-0.5 font-bold`}
          >
            {t(`payment_status_${item.payment_status}`)}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: t("actions"),
        className: "text-right min-w-[180px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-9 h-9 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
              onClick={() => setViewBooking(item)}
              title={t("view_details")}
            >
              <Eye size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-9 h-9 border-none text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              onClick={() => setStatusBooking(item)}
              title={t("update_status")}
            >
              <RefreshCcw size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-9 h-9 border-none text-primary hover:text-primary hover:bg-light-primary rounded-lg transition-all"
              onClick={() => setPaymentBooking(item)}
              title={t("send_payment_link")}
            >
              <CreditCard size={16} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-9 h-9 border-none text-red-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              onClick={() => setDeleteIds([item._id])}
              title={t("delete")}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, paymentColors],
  );

  const initialColumns = [
    { id: "customer_name", label: t("customer_name"), isVisible: true },
    { id: "appointment_date", label: t("appointment_date"), isVisible: true },
    { id: "status", label: t("status"), isVisible: true },
    { id: "payment_status", label: t("payment_status"), isVisible: true },
    { id: "actions", label: t("actions"), isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("booking_records")}
        description={t("bookings_list_desc")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        onRefresh={() => {
          setPage(1);
          refetch();
          toast.success(t("refresh_success"));
        }}
        isLoading={isLoading || isFetching}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        backBtn
        selectedCount={selectedIds.length}
        onBulkDelete={() => setDeleteIds(selectedIds)}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable<AppointmentBooking>
          data={data?.bookings || []}
          columns={columns.filter(
            (col) =>
              visibleColumns.find((vc) => vc.id === col.id)?.isVisible !==
              false,
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
          emptyMessage={t("no_bookings_found")}
          enableSelection
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      <BookingDetailsModal
        isOpen={!!viewBooking}
        onClose={() => setViewBooking(null)}
        bookingId={viewBooking?._id}
      />

      <BookingStatusModal
        isOpen={!!statusBooking}
        onClose={() => setStatusBooking(null)}
        booking={statusBooking}
      />

      <SendPaymentLinkModal
        isOpen={!!paymentBooking}
        onClose={() => setPaymentBooking(null)}
        booking={paymentBooking}
      />

      <ConfirmModal
        isOpen={deleteIds.length > 0}
        onClose={() => setDeleteIds([])}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={
          deleteIds.length > 1
            ? t("bulk_booking_delete_title")
            : t("booking_delete_title")
        }
        subtitle={
          deleteIds.length > 1
            ? t("bulk_booking_delete_confirm")
            : t("booking_delete_confirm")
        }
        variant="danger"
        confirmText={t("delete")}
      />
    </div>
  );
};

export default AppointmentBookingList;
