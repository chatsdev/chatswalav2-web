"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useGetMyBillingHistoryQuery } from "@/src/redux/api/subscriptionApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import dayjs from "dayjs";
import { Calendar, CreditCard, Download, Receipt } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface BillingHistoryItem {
  _id: string;
  invoice_number: string;
  amount: number;
  currency: string;
  payment_gateway: string;
  payment_method: string;
  payment_status: string;
  paid_at: string;
  created_at: string;
  plan?: {
    name: string;
    price: number;
    billing_cycle: string;
  };
}

const BillingHistoryList: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({
    key: "created_at",
    order: "desc",
  });

  const initialColumns = [
    { id: "invoice_number", label: t("billing_history_invoice_number"), isVisible: true },
    { id: "plan", label: t("billing_history_plan"), isVisible: true },
    { id: "amount", label: t("billing_history_amount"), isVisible: true },
    { id: "payment_gateway", label: t("billing_history_gateway"), isVisible: true },
    { id: "payment_method", label: t("billing_history_method"), isVisible: true },
    { id: "payment_status", label: t("billing_history_status"), isVisible: true },
    { id: "created_at", label: t("billing_history_payment_date"), isVisible: true },
    { id: "actions", label: t("billing_history_actions"), isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const { data, isLoading, isFetching } = useGetMyBillingHistoryQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    sortField: sortConfig.key,
    sortOrder: sortConfig.order,
  });

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col))
    );
  };

  const handleDownload = async (paymentId: string, invoiceNumber: string) => {
    try {
      const toastId = toast.loading(t("billing_history_downloading") || "Downloading invoice...");
      const response = await fetch(`/api/subscription/payment/${paymentId}/invoice`);
      if (!response.ok) {
        throw new Error("Failed to download invoice");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${invoiceNumber || paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.dismiss(toastId);
      toast.success(t("billing_history_download_success") || "Invoice downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error(t("billing_history_download_failed") || "Failed to download invoice");
    }
  };

  const columns = useMemo<Column<BillingHistoryItem>[]>(
    () => [
      {
        header: t("billing_history_invoice_number"),
        accessorKey: "invoice_number",
        className: "min-w-[150px]",
        sortable: true,
        sortKey: "invoice_number",
        copyable: true,
        copyField: "invoice_number",
        cell: (item) => (
          <div className="flex items-center gap-2">
            <Receipt size={14} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {item.invoice_number || "N/A"}
            </span>
          </div>
        ),
      },
      {
        header: t("billing_history_plan"),
        className: "min-w-[150px]",
        cell: (item) => (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {item.plan?.name || "N/A"}
            </span>
            {item.plan?.billing_cycle && (
              <span className="text-xs text-slate-500 capitalize">
                {t(item.plan.billing_cycle)}
              </span>
            )}
          </div>
        ),
      },
      {
        header: t("billing_history_amount"),
        accessorKey: "amount",
        className: "min-w-[120px]",
        sortable: true,
        sortKey: "amount",
        cell: (item) => (
          <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
            <span>{item.currency || "INR"}</span>
            <span>{item.amount?.toFixed(2)}</span>
          </div>
        ),
      },
      {
        header: t("billing_history_gateway"),
        accessorKey: "payment_gateway",
        className: "min-w-[120px]",
        sortable: true,
        sortKey: "payment_gateway",
        cell: (item) => (
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-slate-400" />
            <span className="capitalize text-sm text-slate-600 dark:text-slate-300">
              {item.payment_gateway}
            </span>
          </div>
        ),
      },
      {
        header: t("billing_history_method"),
        accessorKey: "payment_method",
        className: "min-w-[120px]",
        sortable: true,
        sortKey: "payment_method",
        cell: (item) => (
          <span className="capitalize text-sm text-slate-600 dark:text-slate-300">
            {item.payment_method || "N/A"}
          </span>
        ),
      },
      {
        header: t("billing_history_status"),
        accessorKey: "payment_status",
        className: "min-w-[100px]",
        sortable: true,
        sortKey: "payment_status",
        cell: (item) => {
          const statusColors: Record<string, string> = {
            paid: "bg-primary/10 text-primary border-primary/20",
            pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
            failed: "bg-red-500/10 text-red-600 border-red-500/20",
            refunded: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          };
          return (
            <Badge
              className={`${
                statusColors[item.payment_status?.toLowerCase()] || "bg-slate-500/10 text-slate-600"
              } capitalize px-2 py-0.5 font-bold border`}
            >
              {t(item.payment_status)}
            </Badge>
          );
        },
      },
      {
        header: t("billing_history_payment_date"),
        accessorKey: "created_at",
        className: "min-w-[150px]",
        sortable: true,
        sortKey: "created_at",
        cell: (item) => (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar size={14} />
            {dayjs(item.paid_at || item.created_at).format("DD MMM YYYY, HH:mm")}
          </div>
        ),
      },
      {
        header: t("billing_history_actions"),
        className: "min-w-[80px]",
        cell: (item) => (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDownload(item._id, item.invoice_number)}
            className="p-2 h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            title={t("billing_history_download_invoice")}
          >
            <Download size={16} />
          </Button>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("billing_history_page_title")}
        description={t("billing_history_page_description")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        isLoading={isLoading || isFetching}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg shadow-sm overflow-hidden">
        <DataTable<BillingHistoryItem>
          data={data?.data?.payments || []}
          columns={columns.filter(
            (col) => visibleColumns.find((vc) => vc.label === col.header)?.isVisible !== false
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
          emptyMessage={t("billing_history_no_history")}
        />
      </div>
    </div>
  );
};

export default BillingHistoryList;
