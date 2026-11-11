/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useDeleteFbAdMutation,
  useGetAdsByAdSetQuery,
} from "@/src/redux/api/facebookApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import useDebounce from "@/src/utils/hooks/useDebounce";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getAdColumns } from "../columns";

import { AdListProps } from "@/src/types/facebook";
import { useRouter } from "next/navigation";

const AdList: React.FC<AdListProps> = ({ adsetId, rightContent, backBtn }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const [deleteAd, { isLoading: isDeleting }] = useDeleteFbAdMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetAdsByAdSetQuery({
    adsetId,
    params: {
      page,
      limit,
      search: debouncedSearch,
      sortBy,
      sortOrder,
    },
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAd(deleteId).unwrap();
      toast.success(t("ad_deleted_success"));
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.data?.error || t("delete_failed"));
    }
  };

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const sourceColumns = useMemo(
    () => getAdColumns(t, router, (id) => setDeleteId(id)),
    [t, router],
  );

  const visibleColumnsState = useMemo(
    () =>
      sourceColumns.map((c) => ({
        id: c.header,
        label: c.header,
        isVisible: columnVisibility[c.header] ?? true,
      })),
    [sourceColumns, columnVisibility],
  );

  const activeColumns = useMemo(
    () => sourceColumns.filter((c) => columnVisibility[c.header] ?? true),
    [sourceColumns, columnVisibility],
  );

  const handleColumnToggle = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnId]: !(prev[columnId] ?? true),
    }));
  };

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("ads")}
        description={t("manage_your_facebook_ads")}
        backBtn={backBtn}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder={t("ad_search_placeholder")}
        onRefresh={() => {
          refetch();
          toast.success(t("refresh_success"));
        }}
        rightContent={rightContent}
        isLoading={isLoading || isFetching}
        columns={visibleColumnsState}
        onColumnToggle={handleColumnToggle}
      />

      <DataTable
        data={data?.data?.ads || []}
        columns={activeColumns}
        isLoading={isLoading}
        isFetching={isFetching}
        totalCount={data?.data?.pagination?.totalItems || 0}
        page={page}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={(newLimit) => {
          setLimit(newLimit);
          setPage(1);
        }}
        onSortChange={(key, order) => {
          setSortBy(key);
          setSortOrder(order);
        }}
        sortBy={sortBy}
        sortOrder={sortOrder}
        getRowId={(item) => item.id || item._id}
        emptyMessage={
          searchTerm ? t("no_results_for", { searchTerm }) : t("no_ads_found")
        }
        actionPermission={["update.facebook_ads", "delete.facebook_ads"]}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("delete_ad")}
        subtitle={t("delete_ad_confirm")}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default AdList;
