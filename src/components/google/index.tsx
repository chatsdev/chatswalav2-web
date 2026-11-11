/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useDisconnectGoogleAccountMutation, useLazyConnectGoogleQuery, useListGoogleAccountsQuery } from "@/src/redux/api/googleApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { GoogleAccount } from "@/src/types/google";
import { Column } from "@/src/types/shared";
import useDebounce from "@/src/utils/hooks/useDebounce";
import dayjs from "dayjs";
import { Calendar, CheckCircle2, Clock, FileSpreadsheet, Link2, Mail, Trash2, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "../shared/Can";
import PlanFeature from "@/src/shared/PlanFeature";

const GoogleAccountList: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortConfig, setSortConfig] = useState<{ key: string; order: "asc" | "desc" }>({ key: "created_at", order: "desc" });
  const [deleteAccount, setDeleteAccount] = useState<GoogleAccount | null>(null);

  const { data, isLoading, isFetching, refetch } = useListGoogleAccountsQuery({
    page,
    limit,
    search: debouncedSearchTerm,
    sort_by: sortConfig.key,
    sort_order: sortConfig.order,
  });

  const [disconnectAccount, { isLoading: isDisconnecting }] = useDisconnectGoogleAccountMutation();
  const [triggerConnect] = useLazyConnectGoogleQuery();

  const handleConnect = async () => {
    try {
      const response = await triggerConnect().unwrap();
      if (response.success && response.url) {
        window.location.href = response.url;
      }
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_connect_google"));
    }
  };

  const handleConfirmDisconnect = async () => {
    if (!deleteAccount) return;
    try {
      await disconnectAccount(deleteAccount._id).unwrap();
      toast.success(t("account_disconnected_success"));
      setDeleteAccount(null);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_to_disconnect_account"));
    }
  };

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortConfig({ key, order });
  };

  const initialColumns = [
    { id: "Email", label: t("email"), isVisible: true },
    { id: "Status", label: t("status"), isVisible: true },
    { id: "Created At", label: t("created_at"), isVisible: true },
    { id: "Actions", label: t("actions"), isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const columns = useMemo<Column<GoogleAccount>[]>(
    () => [
      {
        header: t("email"),
        className: "min-w-[250px]",
        accessorKey: "email",
        sortable: true,
        sortKey: "email",
        cell: (item) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-(--dark-body) flex items-center justify-center text-slate-500">
              <Mail size={16} />
            </div>
            <div className="font-bold text-slate-700 dark:text-slate-200">{item.email}</div>
          </div>
        ),
      },
      {
        header: t("status"),
        className: "min-w-[150px]",
        accessorKey: "status",
        sortable: true,
        sortKey: "status",
        cell: (item) =>
          item.status === "active" ? (
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-2.5 py-0.5 font-bold">
              <CheckCircle2 size={12} /> {t("google_account_active")}
            </Badge>
          ) : (
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5 px-2.5 py-0.5 font-bold">
              <Clock size={12} /> {t("google_account_inactive")}
            </Badge>
          ),
      },
      {
        header: t("created_at"),
        className: "min-w-[200px]",
        accessorKey: "created_at",
        sortable: true,
        sortKey: "created_at",
        cell: (item) => <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{dayjs(item.created_at).format("DD MMM YYYY, hh:mm A")}</div>,
      },
      {
        header: t("actions"),
        className: "text-right min-w-[100px]",
        cell: (item) => (
          <div className="flex items-center justify-end gap-2">
            <Can permission="update.google_account">
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all dark:hover:bg-primary/20 shadow-xs" onClick={() => router.push(`${ROUTES.GoogleAccount}/${item._id}/calendars`)} title={t("google_account_view_calendars")}>
                <Calendar size={16} />
              </Button>
            </Can>
            <Can permission="update.google_account">
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-light-primary rounded-lg transition-all dark:hover:bg-primary-darker/20 shadow-xs" onClick={() => router.push(`${ROUTES.GoogleAccount}/${item._id}/sheets`)} title={t("google_account_view_sheets")}>
                <FileSpreadsheet size={16} />
              </Button>
            </Can>
            <Can permission="update.google_account">
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-purple-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all dark:hover:bg-purple-900/20 shadow-xs" onClick={() => router.push(`${ROUTES.GoogleAccount}/${item._id}/forms`)} title={t("google_account_view_forms")}>
                <ClipboardList size={16} />
              </Button>
            </Can>
            <Can permission="delete.google_account">
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs" onClick={() => setDeleteAccount(item)} title={t("delete")}>
                <Trash2 size={16} />
              </Button>
            </Can>
          </div>
        ),
      },
    ],
    [t, router]
  );

  const rightContent = (
    <Can permission="create.google_account">
      <Button onClick={handleConnect} className="flex items-center gap-2.5 px-4.5! py-5 bg-primary text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group">
        <Link2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
        <span>{t("google_account_connect_btn")}</span>
      </Button>
    </Can>
  );

  return (
    <PlanFeature feature="google_account">
      <div className="space-y-6">
        <CommonHeader
          title={t("google_account")}
          description={t("google_account_desc")}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
          searchPlaceholder={t("google_account_search_placeholder")}
          onRefresh={() => {
            refetch();
            toast.success(t("refresh_success"));
          }}
          rightContent={rightContent}
          isLoading={isLoading || isFetching}
          columns={visibleColumns}
          onColumnToggle={handleColumnToggle}
          addPermission="create.google_account"
          deletePermission="delete.google_account"
        />

        <div className="bg-white dark:bg-(--card-color) rounded-lg shadow-sm overflow-hidden">
          <DataTable<GoogleAccount> data={data?.accounts || []} columns={columns.filter((col) => visibleColumns.find((vc) => vc.label === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching} totalCount={data?.pagination?.totalItems || 0} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} onSortChange={handleSortChange} getRowId={(item) => item._id} emptyMessage={searchTerm ? t("no_results_for", { searchTerm }) : t("google_account_no_accounts")} />
        </div>

        <ConfirmModal isOpen={!!deleteAccount} onClose={() => setDeleteAccount(null)} onConfirm={handleConfirmDisconnect} isLoading={isDisconnecting} title={t("google_account_disconnect_title")} subtitle={t("google_account_disconnect_subtitle")} confirmText={t("google_account_disconnect_btn")} variant="danger" />
      </div>
    </PlanFeature>
  );
};

export default GoogleAccountList;
