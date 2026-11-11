"use client";

import { Badge } from "@/src/elements/ui/badge";
import { useListTransactionsQuery } from "@/src/redux/api/paymentGatewayApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import { PaymentTransaction } from "@/src/types/paymentGateway";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import dayjs from "dayjs";
import { Calendar, CircleDollarSign, CreditCard } from "lucide-react";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

const PaymentTransactionList: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({ key: "created_at", order: "desc" });

  const initialColumns = [
    { id: "gateway_order_id", label: t("order_id"), isVisible: true },
    { id: "payment_link", label: t("payment_link"), isVisible: true },
    { id: "context", label: t("context"), isVisible: true },
    { id: "amount", label: t("amount"), isVisible: true },
    { id: "status", label: t("status"), isVisible: true },
    { id: "gateway", label: t("gateway"), isVisible: true },
    { id: "created_at", label: t("payment_date"), isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const { data, isLoading, isFetching } = useListTransactionsQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
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
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const columns = useMemo<Column<PaymentTransaction>[]>(
    () => [
      {
        header: t("order_id"),
        accessorKey: "gateway_order_id",
        className: "min-w-[180px] max-w-[220px]",
        sortable: true,
        sortKey: "gateway_order_id",
        copyable: true,
        copyField: "gateway_order_id",
        cell: (item) => (
          <div className="flex items-center gap-2 min-w-0 max-w-[180px]">
            <span
              className="text-sm text-slate-500 dark:text-slate-400 truncate"
              title={item.gateway_order_id || "N/A"}
            >
              {item.gateway_order_id || "N/A"}
            </span>
          </div>
        ),
      },
      {
        header: t("payment_link"),
        accessorKey: "payment_link",
        className: "min-w-[180px] max-w-[280px]",
        sortable: true,
        sortKey: "payment_link",
        copyable: true,
        copyField: "payment_link",
        cell: (item) => (
          <div className="flex items-center gap-2 min-w-0 max-w-[240px]">
            <span
              className="text-sm text-slate-500 dark:text-slate-400 truncate"
              title={item.payment_link || "N/A"}
            >
              {item.payment_link || "N/A"}
            </span>
          </div>
        ),
      },
      {
        header: t("context"),
        accessorKey: "context",
        className: "min-w-[120px]",
        sortable: true,
        sortKey: "context",
        cell: (item) => (
          <Badge variant="secondary" className="capitalize">
            {t(item.context)}
          </Badge>
        ),
      },
      {
        header: t("amount"),
        accessorKey: "amount",
        className: "min-w-[120px]",
        sortable: true,
        sortKey: "amount",
        cell: (item) => (
          <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100">
            <CircleDollarSign size={14} className="text-slate-400" />
            {item.amount} <span className="text-[10px] text-slate-500 ml-0.5">{item.currency}</span>
          </div>
        ),
      },
      {
        header: t("status"),
        accessorKey: "status",
        className: "min-w-[100px]",
        sortable: true,
        sortKey: "status",
        cell: (item) => {
          const statusColors: Record<string, string> = {
            paid: "bg-primary/10 text-primary border-primary/20",
            pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
            failed: "bg-red-500/10 text-red-600 border-red-500/20",
            refunded: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          };
          return (
            <Badge className={`${statusColors[item.status] || "bg-slate-500/10 text-slate-600"} capitalize px-2 py-0.5 font-bold`}>
              {t(item.status)}
            </Badge>
          );
        },
      },
      {
        header: t("gateway"),
        accessorKey: "gateway",
        className: "min-w-[120px]",
        sortable: true,
        sortKey: "gateway",
        cell: (item) => (
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-slate-400" />
            <span className="capitalize">{item.gateway}</span>
          </div>
        ),
      },
      {
        header: t("payment_date"),
        accessorKey: "created_at",
        className: "min-w-[150px]",
        sortable: true,
        sortKey: "created_at",
        cell: (item) => (
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar size={14} />
            {dayjs(item.created_at).format("DD MMM YYYY, HH:mm")}
          </div>
        ),
      },
    ],
    [t]
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("payment_transactions_title")}
        description={t("payment_transactions_desc")}
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
        <DataTable<PaymentTransaction>
          data={data?.data?.transactions || []}
          columns={columns.filter((col) => visibleColumns.find((vc) => vc.label === col.header)?.isVisible !== false)}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={data?.data?.pagination?.totalItems || 0}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSortChange={handleSortChange}
          getRowId={(item) => item._id}
          emptyMessage={t("no_transactions")}
        />
      </div>
    </div>
  );
};

export default PaymentTransactionList;
