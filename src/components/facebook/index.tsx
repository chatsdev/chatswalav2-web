/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/src/elements/ui/button";
import { useDisconnectFacebookPageMutation, useGetFacebookAdAccountsQuery, useGetFacebookPagesQuery, useSyncFacebookAdAccountsMutation, useSyncFacebookPagesMutation, useUpdateFacebookDefaultsMutation } from "@/src/redux/api/facebookApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import useDebounce from "@/src/utils/hooks/useDebounce";
import { useFacebookLogin } from "@/src/utils/hooks/useFacebookLogin";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useAppSelector } from "@/src/redux/hooks";
import Can from "../shared/Can";
import { getAdAccountColumns, getPageColumns } from "./columns";

const FacebookAccountList: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [activeTab, setActiveTab] = useState<"pages" | "ads">("pages");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const workspaceId = selectedWorkspace?._id;

  // Reset page to 1 when workspace changes
  useEffect(() => {
    setPage(1);
  }, [workspaceId]);

  const queryParams = {
    page,
    limit,
    search: debouncedSearch,
    sortBy,
    sortOrder,
    workspaceId,
  };

  const { data: pagesData, isLoading: isLoadingPages, isFetching: isFetchingPages, refetch: refetchPages } = useGetFacebookPagesQuery(activeTab === "pages" ? queryParams : undefined, { skip: activeTab !== "pages" });
  const { data: adsData, isLoading: isLoadingAds, isFetching: isFetchingAds, refetch: refetchAds } = useGetFacebookAdAccountsQuery(activeTab === "ads" ? queryParams : undefined, { skip: activeTab !== "ads" });

  const [syncPages, { isLoading: isSyncingPages }] = useSyncFacebookPagesMutation();
  const [syncAds, { isLoading: isSyncingAds }] = useSyncFacebookAdAccountsMutation();
  const [updateDefaults, { isLoading: isUpdatingDefaults }] = useUpdateFacebookDefaultsMutation();

  const [disconnectId, setDisconnectId] = useState<string | null>(null);
  const [disconnectFacebookPage, { isLoading: isDisconnectingPage }] = useDisconnectFacebookPageMutation();

  const handleDisconnectConfirm = async () => {
    if (!disconnectId) return;
    try {
      const response = await disconnectFacebookPage(disconnectId).unwrap();
      if (response.success) {
        toast.success(response.message || "Facebook page disconnected successfully!");
        setDisconnectId(null);
        refetchPages();
      } else {
        toast.error((response as any).error || "Failed to disconnect Facebook page");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || "An error occurred while disconnecting the Facebook page");
    }
  };

  const isSyncing = activeTab === "pages" ? isSyncingPages : isSyncingAds;
  const isLoading = activeTab === "pages" ? isLoadingPages : isLoadingAds;
  const isFetching = activeTab === "pages" ? isFetchingPages : isFetchingAds;

  const handleSync = async () => {
    try {
      const mutation = activeTab === "pages" ? syncPages : syncAds;
      const res = await mutation().unwrap();
      toast.success(res.message || t("sync_success"));
    } catch (err: any) {
      toast.error(err?.data?.error || t("sync_failed"));
    }
  };

  const handleToggleDefault = useCallback(
    async (pageId: string, isChecked: boolean) => {
      try {
        if (!isChecked) {
          await updateDefaults({ default_page_id: null }).unwrap();
          toast.success(t("default_page_removed_success"));
        } else {
          await updateDefaults({ default_page_id: pageId }).unwrap();
          toast.success(t("default_page_set_success"));
        }
      } catch (err: any) {
        toast.error(err?.data?.error || t("update_defaults_failed"));
      }
    },
    [updateDefaults, t]
  );

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
  };

  const pageColumns = useMemo(
    () => getPageColumns(t, handleToggleDefault, isUpdatingDefaults, setDisconnectId, isDisconnectingPage ? disconnectId : null),
    [t, handleToggleDefault, isUpdatingDefaults, disconnectId, isDisconnectingPage]
  );
  const adAccountColumns = useMemo(() => getAdAccountColumns(t, router), [t, router]);

  const [columnVisibility, setColumnVisibility] = useState<Record<string, Record<string, boolean>>>({
    pages: {},
    ads: {},
  });

  const visibleColumns = useMemo(() => {
    const cols = activeTab === "pages" ? pageColumns : adAccountColumns;
    const visibility = columnVisibility[activeTab];
    return cols.map((c) => ({
      id: c.header,
      label: c.header,
      isVisible: visibility[c.header] ?? true,
    }));
  }, [activeTab, pageColumns, adAccountColumns, columnVisibility]);

  const activeColumns = useMemo(() => {
    const cols = activeTab === "pages" ? pageColumns : adAccountColumns;
    return cols.filter((col) => {
      const isVisible = columnVisibility[activeTab][col.header] ?? true;
      return isVisible;
    });
  }, [activeTab, pageColumns, adAccountColumns, columnVisibility]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [activeTab]);

  const handleColumnToggle = (columnId: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [columnId]: !(prev[activeTab][columnId] ?? true),
      },
    }));
  };

  const rightContent = (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center bg-slate-100 dark:bg-(--page-body-bg) p-1 rounded-lg border border-slate-200 dark:border-(--card-border-color)">
        <Button onClick={() => setActiveTab("pages")} className={`px-4! py-1.5! rounded-md! text-sm! font-bold! transition-all ${activeTab === "pages" ? "bg-white! dark:bg-(--card-color)! text-blue-600! dark:text-blue-400! shadow-sm!" : "text-slate-500! hover:text-slate-700! bg-[unset]! hover:bg-[unset]! dark:hover:text-slate-300!"}`}>
          {t("pages")}
        </Button>
        <Can permission="view.facebook_ads">
          <Button onClick={() => setActiveTab("ads")} className={`px-4! py-1.5! rounded-md! text-sm! font-bold! transition-all ${activeTab === "ads" ? "bg-white! dark:bg-(--card-color)! text-blue-600! dark:text-blue-400! shadow-sm!" : "text-slate-500! hover:text-slate-700! bg-[unset]!  hover:bg-[unset]! dark:hover:text-slate-300!"}`}>
            {t("ads")}
          </Button>
        </Can>
      </div>

      {(pagesData?.success || adsData?.success) && (
        <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="flex items-center gap-2 px-4 py-5 h-12 rounded-lg font-medium border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all active:scale-95 shadow-sm min-w-35">
          <CheckCircle2 className={`w-4 h-4 text-primary ${isSyncing ? "animate-spin" : ""}`} />
          <span>{isSyncing ? t("common_loading") : activeTab === "pages" ? t("sync_pages") : t("sync_ads")}</span>
        </Button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title={t("facebook_account")}
        description={t("facebook_account_desc")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder={activeTab === "pages" ? t("facebook_account_search_placeholder") : t("facebook_ads_search_placeholder")}
        onRefresh={() => {
          if (activeTab === "pages") refetchPages();
          else refetchAds();
          toast.success(t("refresh_success"));
        }}
        rightContent={rightContent}
        isLoading={isLoading || isFetching}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
      >
      </CommonHeader>

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) overflow-hidden">
        {activeTab === "pages" && (
          <DataTable
            data={pagesData?.data || []}
            columns={activeColumns}
            isLoading={isLoadingPages}
            isFetching={isFetchingPages}
            totalCount={pagesData?.totalCount || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            onSortChange={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            getRowId={(item) => item._id}
            emptyMessage={searchTerm ? t("no_results_for", { searchTerm }) : t("facebook_account_no_pages")}
            actionPermission={["update.waba_configuration"]}
          />
        )}

        {activeTab === "ads" && (
          <DataTable
            data={adsData?.data || []}
            columns={activeColumns}
            isLoading={isLoadingAds}
            isFetching={isFetchingAds}
            totalCount={adsData?.totalCount || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            onSortChange={handleSort}
            sortBy={sortBy}
            sortOrder={sortOrder}
            getRowId={(item) => item._id || item.ad_account_id}
            emptyMessage={searchTerm ? t("no_results_for", { searchTerm }) : t("facebook_account_no_ads")}
            actionPermission={["view.facebook_ads"]}
          />
        )}
      </div>

      {/* Common Confirm Disconnect Modal */}
      <ConfirmModal
        isOpen={!!disconnectId}
        onClose={() => setDisconnectId(null)}
        onConfirm={handleDisconnectConfirm}
        isLoading={isDisconnectingPage}
        title="Disconnect Facebook Page"
        subtitle="Are you sure you want to disconnect this Facebook page? This will stop page lead synchronization and active campaign actions."
        confirmText="Disconnect"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default FacebookAccountList;
