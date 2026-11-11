"use client";

import { ROUTES } from "@/src/constants/route";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import {
  useDeleteAppointmentConfigMutation,
  useListAppointmentConfigsQuery,
  useUpdateAppointmentConfigMutation,
} from "@/src/redux/api/appointmentApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { AppointmentConfig } from "@/src/types/appointment";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import dayjs from "dayjs";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Plus,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "../shared/Can";

const AppointmentConfigList: React.FC = () => {
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

  const [deleteData, setDeleteData] = useState<AppointmentConfig | null>(null);

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const { data, isLoading, isFetching, refetch } =
    useListAppointmentConfigsQuery(
      {
        page,
        limit,
        search: debouncedSearchTerm,
        sort_by: sortConfig.key,
        sort_order: sortConfig.order,
        waba_id: selectedWorkspace?.waba_id || "",
      },
      {
        skip: !selectedWorkspace?.waba_id,
      },
    );

  const [deleteConfig, { isLoading: isDeleting }] =
    useDeleteAppointmentConfigMutation();

  const [updateConfig, { isLoading: isUpdatingStatus }] =
    useUpdateAppointmentConfigMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      await deleteConfig(deleteData._id).unwrap();
      toast.success(t("appointment_delete_success"));
      setDeleteData(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_delete_appointment"));
    }
  };

  const initialColumns = [
    { id: "name", label: t("appointment_name"), isVisible: true },
    { id: "duration", label: t("appointment_duration"), isVisible: true },
    { id: "status", label: t("appointment_status"), isVisible: true },
    { id: "created_at", label: t("created_at"), isVisible: true },
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

  const columns = useMemo<Column<AppointmentConfig>[]>(
    () => [
      {
        header: t("appointment_name"),
        accessorKey: "name",
        className: "min-w-[250px] [@media(max-width:1920px)]:min-w-[238px] ",
        sortable: true,
        sortKey: "name",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Calendar size={16} />
            </div>
            <div>
              <div className="font-bold text-slate-700 dark:text-slate-200 break-all whitespace-normal line-clamp-2">
                {item.name}
              </div>
              {item.location && (
                <div className="text-xs text-slate-500 break-all whitespace-normal line-clamp-2">
                  {item.location}
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        header: t("appointment_duration"),
        accessorKey: "duration_minutes",
        className: "min-w-[150px] [@media(max-width:1920px)]:min-w-[180px]",
        sortable: true,
        sortKey: "duration_minutes",
        cell: (item) => (
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 dark:text-slate-400">
            <Clock size={14} />
            {item.duration_minutes}{" "}
            {t("minutes_unit", { defaultValue: "mins" })}
          </div>
        ),
      },
      {
        header: t("appointment_status"),
        accessorKey: "status",
        className: "min-w-[150px] [@media(max-width:1920px)]:min-w-[180px]",
        sortable: true,
        sortKey: "status",
        cell: (item) => {
          const handleToggleStatus = async (checked: boolean) => {
            try {
              const newStatus = checked ? "active" : "inactive";
              await updateConfig({ id: item._id, status: newStatus }).unwrap();
              toast.success(
                t("status_updated_success", {
                  defaultValue: "Status updated successfully",
                }),
              );
            } catch (error: any) {
              toast.error(
                error?.data?.message ||
                  t("failed_to_update_status", {
                    defaultValue: "Failed to update status",
                  }),
              );
            }
          };

          return (
            <div className="flex items-center gap-3">
              <Switch
                checked={item.status === "active"}
                onCheckedChange={handleToggleStatus}
                disabled={isUpdatingStatus}
              />
            </div>
          );
        },
      },
      {
        header: t("created_at"),
        accessorKey: "created_at",
        className: "min-w-[150px] [@media(max-width:1920px)]:min-w-[165px]",
        sortable: true,
        sortKey: "created_at",
        cell: (item) => (
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {dayjs(item.created_at).format("DD MMM YYYY")}
          </div>
        ),
      },
      {
        header: t("actions"),
        className:
          "text-right min-w-[120px] [@media(max-width:1920px)]:min-w-[200px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Can permission="view.appointment_booking">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 border-none text-blue-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all dark:hover:bg-blue-500/20 shadow-xs"
                onClick={() =>
                  router.push(
                    `${ROUTES.AppointmentBooking}/${item._id}/records`,
                  )
                }
                title={t("view_bookings")}
              >
                <Users size={16} />
              </Button>
            </Can>
            <Can permission="update.appointment_booking">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all dark:hover:bg-primary/20 shadow-xs"
                onClick={() =>
                  router.push(`${ROUTES.AppointmentBooking}/${item._id}`)
                }
                title={t("edit")}
              >
                <Edit2 size={16} />
              </Button>
            </Can>
            <Can permission="delete.appointment_booking">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs"
                onClick={() => setDeleteData(item)}
                title={t("delete")}
              >
                <Trash2 size={16} />
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [t, router],
  );

  const rightContent = (
    <Can permission="create.appointment_booking">
      <Button
        onClick={() => router.push(`${ROUTES.AppointmentBooking}/add`)}
        className="flex items-center gap-2.5 px-4.5! py-5 bg-primary text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group"
      >
        <Plus className="w-5 h-5" />
        <span>{t("add_appointment_config")}</span>
      </Button>
    </Can>
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("appointment_booking")}
        description={t("appointment_configs_desc")}
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
        rightContent={rightContent}
        isLoading={isLoading || isFetching}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        addPermission="create.appointment_booking"
        deletePermission="delete.appointment_booking"
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable<AppointmentConfig>
          data={data?.data?.configs || []}
          columns={columns.filter(
            (col) =>
              visibleColumns.find((vc) => vc.label === col.header)
                ?.isVisible !== false,
          )}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={data?.data?.pagination?.totalItems || 0}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSortChange={handleSortChange}
          getRowId={(item) => item._id}
          emptyMessage={t("no_appointment_configs")}
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteData}
        onClose={() => setDeleteData(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={t("appointment_delete_title")}
        subtitle={t("appointment_delete_subtitle")}
        variant="danger"
        confirmText={t("delete")}
      />
    </div>
  );
};

export default AppointmentConfigList;
