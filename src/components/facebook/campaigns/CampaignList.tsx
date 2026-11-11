/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useDeleteFbAdCampaignMutation,
  useGetFbAdCampaignsQuery,
  useUpdateFbAdCampaignStatusMutation,
} from "@/src/redux/api/facebookApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import useDebounce from "@/src/utils/hooks/useDebounce";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { getCampaignColumns } from "../columns";
import CampaignStatusModal from "./CampaignStatusModal";

import { CampaignListProps } from "@/src/types/facebook";
import { useRouter } from "next/navigation";

const CampaignList: React.FC<CampaignListProps> = ({
  accountId,
  rightContent,
  backBtn,
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const [deleteCampaign, { isLoading: isDeleting }] =
    useDeleteFbAdCampaignMutation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [updateStatus, { isLoading: isUpdatingStatus }] =
    useUpdateFbAdCampaignStatusMutation();
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  const { data, isLoading, isFetching, refetch } = useGetFbAdCampaignsQuery({
    ad_account_id: accountId,
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCampaign(deleteId).unwrap();
      toast.success(t("campaign_deleted_success"));
      setDeleteId(null);
    } catch (err: any) {
      toast.error(err?.data?.error || t("delete_failed"));
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedCampaign) return;
    try {
      await updateStatus({ id: selectedCampaign._id, status }).unwrap();
      toast.success(
        t("status_updated_success", "Campaign status updated successfully"),
      );
      setSelectedCampaign(null);
    } catch (err: any) {
      toast.error(
        err?.data?.message ||
          t("status_update_failed", "Failed to update status"),
      );
    }
  };

  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({});

  const sourceColumns = useMemo(
    () =>
      getCampaignColumns(
        t,
        router,
        (id) => setDeleteId(id),
        (item) => setSelectedCampaign(item),
      ),
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
        title={t("campaigns")}
        description={t("manage_your_facebook_ad_campaigns")}
        backBtn={backBtn}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder={t("campaign_search_placeholder")}
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
        data={data?.data?.campaigns || []}
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
          searchTerm
            ? t("no_results_for", { searchTerm })
            : t("no_campaigns_found")
        }
        actionPermission={["update.facebook_ads", "delete.facebook_ads"]}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t("delete_campaign")}
        subtitle={t("delete_campaign_confirm")}
        isLoading={isDeleting}
      />

      <CampaignStatusModal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        onConfirm={handleUpdateStatus}
        isLoading={isUpdatingStatus}
        currentStatus={selectedCampaign?.status}
      />
    </div>
  );
};

export default CampaignList;
