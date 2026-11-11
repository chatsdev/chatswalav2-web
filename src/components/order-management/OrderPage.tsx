/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Order, OrderItem, useBulkDeleteOrdersMutation, useGetOrdersQuery, useSendOrderPaymentLinkMutation } from "@/src/redux/api/orderApi";
import { useGetUserSettingsQuery } from "@/src/redux/api/settingsApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { format } from "date-fns";
import { Edit3, Eye, MessageSquareCode, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import OrderItemsModal from "./OrderItemsModal";
import UpdateStatusModal from "./UpdateStatusModal";
import { maskSensitiveData } from "@/src/utils/masking";
import { useAppSelector } from "@/src/redux/hooks";
import Can from "@/src/components/shared/Can";
import { ROUTES } from "@/src/constants";

const OrderPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const [selectedOrderItems, setSelectedOrderItems] = useState<OrderItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusOrderId, setStatusOrderId] = useState<string | null>(null);
  const [statusOrderCurrentStatus, setStatusOrderCurrentStatus] = useState<string>("");

  const { data, isLoading, isFetching, refetch } = useGetOrdersQuery({ page, limit, search, sort_by: sortBy, sort_order: sortOrder });
  const [bulkDelete, { isLoading: isDeleting }] = useBulkDeleteOrdersMutation();
  const { data: userSettingsData } = useGetUserSettingsQuery();
  const [sendPaymentLink, { isLoading: isSendingPaymentLink }] = useSendOrderPaymentLinkMutation();

  const handleSendPaymentLink = async (orderId: string) => {
    try {
      const res = await sendPaymentLink(orderId).unwrap();
      if (res.success) {
        toast.success(res.message || "Payment link sent successfully");
      }
    } catch (error: any) {
      toast.error(error?.data?.error || error?.data?.message || "Failed to send payment link");
    }
  };

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleDelete = async () => {
    try {
      const res = await bulkDelete({ ids: selectedIds }).unwrap();
      if (res.success) {
        toast.success(res.message || t("orders_deleted_success"));
        setSelectedIds([]);
        setIsDeleteModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("orders_delete_failed"));
    }
  };

  const handleViewItems = (order: Order) => {
    setSelectedOrderItems(order.items);
    setSelectedOrderId(order.wa_order_id || order._id);
    setIsItemsModalOpen(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setStatusOrderId(order._id);
    setStatusOrderCurrentStatus(order.status);
    setIsStatusModalOpen(true);
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "shipped":
        return "success";
      case "pending":
        return "warning";
      case "ready_to_ship":
        return "info";
      case "on_the_way":
        return "indigo";
      default:
        return "secondary";
    }
  };

  const columns: Column<Order>[] = [
    {
      header: t("order_id_label"),
      sortable: true,
      sortKey: "wa_order_id",
      accessorKey: "wa_order_id",
      copyable: true,
      cell: (row) => row.wa_order_id || "N/A",
    },
    {
      header: t("customer_label"),
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-700 dark:text-slate-200">{maskSensitiveData(row.contact_id?.name, "phone", is_demo_mode)}</span>
          <span className="text-xs text-slate-400">{maskSensitiveData(row.contact_id?.email, "email", is_demo_mode) || t("no_email")}</span>
        </div>
      ),
    },
    {
      header: t("contact_label"),
      sortable: true,
      sortKey: "phone_number",
      cell: (row) => maskSensitiveData(row.contact_id?.phone_number, "phone", is_demo_mode),
    },
    {
      header: t("amount_label"),
      sortable: true,
      sortKey: "total_price",
      cell: (row) => (
        <span className="font-black text-primary">
          {row?.total_price?.toFixed(2)} {row.currency || "INR"}
        </span>
      ),
    },
    {
      header: t("status"),
      sortable: true,
      sortKey: "status",
      cell: (row) => (
        <Badge variant={getStatusVariant(row?.status) as any} className="capitalize font-semibold px-3 py-1 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover)">
          {t(`status_${row?.status}`) || row?.status?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      header: t("payment_status") || "Payment Status",
      sortable: true,
      sortKey: "payment_status",
      cell: (row) => {
        const isPaid = row?.payment_status === "paid";
        return (
          <Badge
            className={`capitalize font-semibold px-3 py-1 border ${
              isPaid
                ? "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                : "bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/20"
            }`}
          >
            {row?.payment_status
              ? t(`payment_status_${row.payment_status}`) || row.payment_status
              : t("payment_status_unpaid") || "Unpaid"}
          </Badge>
        );
      },
    },
    {
      header: t("payment_link") || "Payment Link",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <Badge
            className={`capitalize font-semibold px-2.5 py-0.5 border ${
              row?.payment_link_sent
                ? "bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20"
                : "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20"
            }`}
          >
            {row?.payment_link_sent ? t("sent") || "Sent" : t("unsent") || "Unsent"}
          </Badge>
          {row?.payment_link && (
            <a
              href={row.payment_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-focus transition-colors"
              onClick={(e) => e.stopPropagation()}
              title={t("open_payment_link") || "Open Payment Link"}
            >
              <CreditCard size={14} className="stroke-[2.5]" />
            </a>
          )}
        </div>
      ),
    },
    {
      header: t("date_label"),
      sortable: true,
      sortKey: "created_at",
      cell: (row) => <span className="text-xs font-medium text-slate-500">{row?.created_at ? format(new Date(row.created_at), "MMMM dd, yyyy HH:mm") : "—"}</span>,
    },
    {
      header: t("actions_label") || "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Can permission="view.ecommerce_orders">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleViewItems(row);
              }}
              className="w-10 h-10 flex items-center justify-center p-2 rounded-lg bg-primary/8 dark:bg-primary/15 hover:bg-primary/15 dark:hover:bg-primary/25 text-primary transition-all group"
              title={t("view_items_titles", { count: row.items?.length || 0 })}
            >
              <Eye size={16} className="group-hover:scale-110 transition-transform" />
            </Button>
          </Can>
          <Can permission="update.ecommerce_orders">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateStatus(row);
              }}
              className="w-10 h-10 flex items-center justify-center p-2 rounded-lg bg-amber-500/8 dark:bg-amber-500/15 hover:bg-amber-500/15 dark:hover:bg-amber-500/25 text-amber-600 dark:text-amber-500 transition-all group"
              title={t("update_status_title") || "Update Status"}
            >
              <Edit3 size={16} className="group-hover:scale-110 transition-transform" />
            </Button>
          </Can>
          {userSettingsData?.data?.catalog_payment_link_enabled && (
            <Can permission="update.ecommerce_orders">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendPaymentLink(row._id);
                }}
                disabled={isSendingPaymentLink}
                className="w-10 h-10 flex items-center justify-center p-2 rounded-lg bg-primary/8 dark:bg-primary/15 hover:bg-primary/15 dark:hover:bg-primary/25 text-primary dark:text-primary transition-all group"
                title={t("send_payment_link") || "Send Payment Link"}
              >
                <CreditCard size={16} className="group-hover:scale-110 transition-transform" />
              </Button>
            </Can>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) pt-0!">
      <CommonHeader
        title={t("orders_page_title")}
        description={t("orders_page_description")}
        onSearch={handleSearch}
        searchTerm={search}
        onRefresh={refetch}
        selectedCount={selectedIds.length}
        onBulkDelete={() => setIsDeleteModalOpen(true)}
        deletePermission="delete.ecommerce_orders"
        isLoading={isLoading || isFetching}
        rightContent={
          <Can permission="update.ecommerce_orders">
            <Button onClick={() => router.push(ROUTES.OrdersAutoMessage)} className="flex items-center gap-2 px-6 bg-primary text-white h-12 rounded-lg font-bold transition-all active:scale-95">
              <MessageSquareCode size={20} />
              {t("auto_message")}
            </Button>
          </Can>
        }
      />

      <DataTable data={data?.data?.orders || []} columns={columns as any} isLoading={isLoading} isFetching={isFetching} totalCount={data?.data?.pagination?.totalItems} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(row: Order) => row._id} emptyMessage={t("no_orders_found")} onSortChange={handleSortChange} />

      <OrderItemsModal isOpen={isItemsModalOpen} onClose={() => setIsItemsModalOpen(false)} items={selectedOrderItems} orderId={selectedOrderId} />

      <UpdateStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} orderId={statusOrderId} currentStatus={statusOrderCurrentStatus} />

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDelete} title={t("delete_orders_title")} subtitle={t("delete_orders_desc", { count: selectedIds.length })} confirmText={t("delete")} isLoading={isDeleting} variant="danger" />
    </div>
  );
};

export default OrderPage;
