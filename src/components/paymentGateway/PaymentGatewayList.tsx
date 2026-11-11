/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useCreateGatewayMutation, useDeleteGatewayMutation, useListGatewaysQuery, useUpdateGatewayMutation } from "@/src/redux/api/paymentGatewayApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { PaymentGateway } from "@/src/types/paymentGateway";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import dayjs from "dayjs";
import { CheckCircle2, CreditCard, Edit2, Plus, Settings, Trash2, XCircle } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PaymentGatewayModal from "./PaymentGatewayModal";
import PaymentSettingModal from "./PaymentSettingModal";
import Can from "../shared/Can";

const PaymentGatewayList: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({ key: "created_at", order: "desc" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [editData, setEditData] = useState<PaymentGateway | null>(null);
  const [deleteData, setDeleteData] = useState<PaymentGateway | null>(null);

  const initialColumns = [
    { id: "display_name", label: t("gateway_display_name"), isVisible: true },
    { id: "gateway", label: t("gateway_provider"), isVisible: true },
    { id: "is_active", label: t("gateway_status"), isVisible: true },
    { id: "created_at", label: t("created_at"), isVisible: true },
    { id: "actions", label: t("actions"), isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const { data, isLoading, isFetching } = useListGatewaysQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
  });

  const [createGateway, { isLoading: isCreating }] = useCreateGatewayMutation();
  const [updateGateway, { isLoading: isUpdating }] = useUpdateGatewayMutation();
  const [deleteGateway, { isLoading: isDeleting }] = useDeleteGatewayMutation();

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (editData) {
        await updateGateway({ id: editData._id, ...formData }).unwrap();
        toast.success(t("gateway_update_success"));
      } else {
        await createGateway(formData).unwrap();
        toast.success(t("gateway_create_success"));
      }
      setIsModalOpen(false);
      setEditData(null);
    } catch (error: any) {
      toast.error(error?.data?.message || (editData ? t("failed_to_update_gateway") : t("failed_to_create_gateway")));
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      await deleteGateway(deleteData._id).unwrap();
      toast.success(t("gateway_delete_success"));
      setDeleteData(null);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_delete_gateway"));
    }
  };

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const columns = useMemo<Column<PaymentGateway>[]>(
    () => [
      {
        header: t("gateway_display_name"),
        accessorKey: "display_name",
        className: "min-w-[200px]",
        sortable: true,
        sortKey: "display_name",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
              <CreditCard size={16} />
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">{item.display_name}</div>
          </div>
        ),
      },
      {
        header: t("gateway_provider"),
        accessorKey: "gateway",
        className: "min-w-[150px]",
        sortable: true,
        sortKey: "gateway",
        cell: (item) => (
          <Badge variant="outline" className="capitalize font-semibold border-slate-200 dark:border-slate-800">
            {item.gateway}
          </Badge>
        ),
      },
      {
        header: t("gateway_status"),
        accessorKey: "is_active",
        className: "min-w-[120px]",
        sortable: true,
        sortKey: "is_active",
        cell: (item) =>
          item.is_active ? (
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-2.5 py-0.5 font-bold">
              <CheckCircle2 size={12} /> {t("active")}
            </Badge>
          ) : (
            <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1.5 px-2.5 py-0.5 font-bold">
              <XCircle size={12} /> {t("inactive")}
            </Badge>
          ),
      },
      {
        header: t("created_at"),
        accessorKey: "created_at",
        className: "min-w-[150px]",
        sortable: true,
        sortKey: "created_at",
        cell: (item) => <div className="text-sm text-slate-500 dark:text-slate-400">{dayjs(item.created_at).format("DD MMM YYYY")}</div>,
      },
      {
        header: t("actions"),
        className: "text-right min-w-[120px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Can permission="update.payment_gateways">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all dark:hover:bg-primary/20 shadow-xs"
                onClick={() => {
                  setEditData(item);
                  setIsModalOpen(true);
                }}
                title={t("edit")}
                >
                <Edit2 size={16} />
              </Button>
            </Can>
            <Can permission="delete.payment_gateways">
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs" onClick={() => setDeleteData(item)} title={t("delete")}>
                <Trash2 size={16} />
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [t]
  );

  const rightContent = (
    <div className="flex items-center gap-3 flex-wrap">
      <Can permission="update.payment_gateways">
        <Button
          variant="outline"
          onClick={() => setIsPaymentModalOpen(true)}
          className="flex items-center gap-2.5 px-4.5! py-5 border-primary text-primary hover:text-primary bg-primary/5 hover:bg-primary/10 h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group shadow-none!"
        >
          <Settings className="w-5 h-5" />
          <span>{t("payment_settings") || "Payment Setting"}</span>
        </Button>
      </Can>
      <Can permission="create.payment_gateways">
        <Button
          onClick={() => {
            setEditData(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2.5 px-4.5! py-5 bg-primary text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group shadow-none!"
          >
          <Plus className="w-5 h-5" />
          <span>{t("add_gateway")}</span>
        </Button>
          </Can>
    </div>
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("payment_gateways_title")}
        description={t("payment_gateways_desc")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        rightContent={rightContent}
        isLoading={isLoading || isFetching}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        addPermission="create.payment_gateways"
        deletePermission="delete.payment_gateways"
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg shadow-sm overflow-hidden">
        <DataTable<PaymentGateway> data={data?.configs || []} columns={columns.filter((col) => visibleColumns.find((vc) => vc.label === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching} totalCount={data?.pagination?.totalItems || 0} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} onSortChange={handleSortChange} getRowId={(item) => item._id} emptyMessage={t("no_payment_gateways")} actionPermission={["update.payment_gateways", "delete.payment_gateways"]}/> 
      </div>

      <PaymentGatewayModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        onConfirm={handleCreateOrUpdate}
        isLoading={isCreating || isUpdating}
        editData={editData}
      />

      <PaymentSettingModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} />

      <ConfirmModal isOpen={!!deleteData} onClose={() => setDeleteData(null)} onConfirm={handleDelete} isLoading={isDeleting} title={t("gateway_delete_title")} subtitle={t("gateway_delete_subtitle")} variant="danger" confirmText={t("delete")} />
    </div>
  );
};

export default PaymentGatewayList;
