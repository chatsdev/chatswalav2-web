"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import {
  useDisconnectWhatsAppMutation,
  useGetWabaPhoneNumbersQuery,
  useSetPrimaryPhoneNumberMutation,
} from "@/src/redux/api/whatsappApi";
import { useLazyGetWorkspacesQuery } from "@/src/redux/api/workspaceApi";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setWorkspace } from "@/src/redux/reducers/workspaceSlice";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { PhoneNumbersProps, WabaPhoneNumber } from "@/src/types/whatsapp";
import { maskSensitiveData } from "@/src/utils/masking";
import { Star, UserStar } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "../shared/Can";

const PhoneNumbers = ({ waba, wabaId }: PhoneNumbersProps) => {
  const { t } = useTranslation();
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const [inputValue, setInputValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [primaryTarget, setPrimaryTarget] = useState<WabaPhoneNumber | null>(
    null,
  );
  const dispatch = useAppDispatch();
  const [triggerGetWorkspaces] = useLazyGetWorkspacesQuery();
  const [disconnectWaba, { isLoading: isDisconnecting }] =
    useDisconnectWhatsAppMutation();
  const [setPrimaryPhone, { isLoading: isSettingPrimary }] =
    useSetPrimaryPhoneNumberMutation();

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleDisconnect = async () => {
    try {
      const response = await disconnectWaba({
        provider: selectedWorkspace?.waba_type || "",
        waba_id: wabaId,
      }).unwrap();
      if (response.success) {
        toast.success("WABA disconnected successfully");
        setIsDeleteModalOpen(false);

        const { data: updatedWorkspaces } =
          await triggerGetWorkspaces().unwrap();
        if (updatedWorkspaces) {
          const currentWs = updatedWorkspaces.find(
            (ws) => ws._id === selectedWorkspace?._id,
          );
          if (currentWs) {
            dispatch(setWorkspace(currentWs));
          }
        }
      } else {
        toast.error(response.message || "Failed to disconnect WABA");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to disconnect WABA");
    }
  };

  const handleSetPrimary = async () => {
    if (!primaryTarget) return;
    try {
      const response = await setPrimaryPhone(primaryTarget.id).unwrap();
      if (response.success) {
        toast.success(
          response.message || "Phone number marked as primary successfully",
        );
        setPrimaryTarget(null);

        const { data: updatedWorkspaces } =
          await triggerGetWorkspaces().unwrap();
        if (updatedWorkspaces) {
          const currentWs = updatedWorkspaces.find(
            (ws) => ws._id === selectedWorkspace?._id,
          );
          if (currentWs) {
            dispatch(setWorkspace(currentWs));
          }
        }
      } else {
        toast.error(response.message || "Failed to set primary phone number");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to set primary phone number");
    }
  };

  const [visibleColumns, setVisibleColumns] = useState([
    { id: "Verified Name", label: "Verified Name", isVisible: true },
    { id: "Phone Number", label: "Phone Number", isVisible: true },
    { id: "Phone Number ID", label: "Phone Number ID", isVisible: true },
    { id: "Display Name Status", label: "Display Name Status", isVisible: true },
    { id: "Operational Status", label: "Operational Status", isVisible: true },
    { id: "Quality", label: "Quality", isVisible: true },
    { id: "Status", label: "Status", isVisible: true },
  ]);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, isVisible: !col.isVisible } : col,
      ),
    );
  };

  const {
    data: phoneNumbersResult,
    isLoading,
    isFetching,
    refetch,
  } = useGetWabaPhoneNumbersQuery(wabaId || "", {
    skip: !wabaId,
  });

  const rawPhoneNumbers = phoneNumbersResult?.data || [];

  const phoneNumbers = sortBy
    ? [...rawPhoneNumbers].sort((a, b) => {
        const aVal = String(
          (a as Record<string, string>)[sortBy] ?? "",
        ).toLowerCase();
        const bVal = String(
          (b as Record<string, string>)[sortBy] ?? "",
        ).toLowerCase();
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      })
    : rawPhoneNumbers;
  const totalCount = phoneNumbers.length;

  const columns: Column<WabaPhoneNumber>[] = [
    {
      header: "Verified Name",
      accessorKey: "verified_name",
      sortable: true,
      sortKey: "verified_name",
    },
    {
      header: "Phone Number",
      sortable: true,
      sortKey: "display_phone_number",
      accessorKey: "display_phone_number",
      cell: (row) => (
        <p>
          {maskSensitiveData(row.display_phone_number, "phone", is_demo_mode)}
        </p>
      ),

      copyable: true,
    },
    {
      header: "Phone Number ID",
      sortable: true,
      sortKey: "phone_number_id",
      accessorKey: "phone_number_id",
      cell: (row) => (
        <p>{maskSensitiveData(row.phone_number_id, "phone", is_demo_mode)}</p>
      ),

      copyable: true,
    },
    {
      header: "Display Name Status",
      cell: (row) => {
        const nameStatus = row.name_status || "APPROVED";
        let badgeColor = "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30";
        if (nameStatus === "PENDING_REVIEW") {
          badgeColor = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30";
        } else if (nameStatus === "DECLINED" || nameStatus === "REJECTED") {
          badgeColor = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30";
        }
        return (
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className={`font-semibold ${badgeColor}`}>
              {nameStatus.replace("_", " ")}
            </Badge>
            {row.rejection_reason && (
              <span className="text-xs text-rose-500 max-w-[200px] break-words mt-1 block">
                {row.rejection_reason}
              </span>
            )}
          </div>
        );
      }
    },
    {
      header: "Operational Status",
      cell: (row) => {
        const opStatus = row.status || "PENDING";
        let badgeColor = "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30";
        if (opStatus === "FLAGGED" || opStatus === "PENDING") {
          badgeColor = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/30";
        } else if (opStatus === "RESTRICTED" || opStatus === "UNVERIFIED" || opStatus === "DISALLOWED_BY_META") {
          badgeColor = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30";
        }
        return (
          <Badge variant="outline" className={`font-semibold ${badgeColor}`}>
            {opStatus}
          </Badge>
        );
      }
    },
    {
      header: "Quality",
      sortable: true,
      sortKey: "quality_rating",
      cell: (row) => (
        <Badge
          variant="outline"
          className={`font-medium ${row.quality_rating === "GREEN" ? "bg-light-primary dark:bg-(--page-body-bg) dark:border-(--card-border-color) text-primary border-[var(--primary-opacity-20)]" : row.quality_rating === "YELLOW" ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 dark:bg-(--page-body-bg) dark:border-(--card-border-color) text-rose-700 border-rose-100"}`}
        >
          {row.quality_rating}
        </Badge>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge
          variant="outline"
          className={`font-medium ${row.is_primary ? "bg-light-primary text-primary border-[var(--primary-opacity-20)]" : "bg-(--input-color) dark:bg-(--page-body-bg) dark:border-(--card-border-color) dark:text-amber-50 text-slate-700 border-slate-100"}`}
        >
          {`${row.is_primary ? "Active" : "Inactive"}`}
        </Badge>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          {row.is_primary ? (
            <Button
              variant="ghost"
              size="sm"
              disabled
              className="w-10 h-10 border-none text-amber-500 dark:text-amber-400 bg-transparent rounded-lg cursor-default disabled:opacity-100"
              title="Primary Phone Number"
            >
              <UserStar className="size-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 border-none text-slate-400 hover:text-amber-500 hover:bg-slate-50 dark:hover:bg-slate-900/40 rounded-lg transition-all"
              onClick={() => setPrimaryTarget(row)}
              title="Set as Primary"
            >
              <Star className="size-5 transition-transform duration-200 active:scale-95" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleRefresh = () => {
    refetch();
    toast.success("Successfully refreshed phone numbers.");
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
  };

  return (
    <div className="sm:p-8 p-4 pt-0! space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body) min-h-full">
      <CommonHeader
        title={t("waba_phone_numbers")}
        description={t("waba_phone_numbers_desc")}
        searchTerm={inputValue}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        isLoading={isLoading}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        rightContent={
          <Can permission="update.waba_configuration">
            <Button
              variant="destructive"
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex items-center gap-2 px-4 h-12 rounded-lg border border-red-500/30 font-semibold bg-red-500/10 dark:bg-red-500/20 hover:bg-red-500/20 text-red-500 transition-all active:scale-95 shadow"
            >
              {t("disconnect_waba_account")}
            </Button>
          </Can>
        }
      />

      <div className="bg-white rounded-lg border border-gray-100 dark:border-(--card-border-color) dark:bg-(--card-color) shadow-sm overflow-hidden mt-8">
        <DataTable
          data={phoneNumbers}
          columns={columns.filter(
            (col) =>
              visibleColumns.find((vc) => vc.id === col.header)?.isVisible !==
              false,
          )}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          enableSelection={false}
          emptyMessage="No phone numbers found for this WABA."
          className="border-none shadow-none rounded-none"
          onSortChange={handleSortChange}
          actionPermission={["update.waba_configuration"]}
        />
      </div>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDisconnect}
        isLoading={isDisconnecting}
        title="Disconnect WABA"
        subtitle="Are you sure you want to disconnect this WABA? This will disable all active campaigns and automations linked to this account."
        confirmText="Disconnect"
        variant="danger"
      />

      <ConfirmModal
        isOpen={!!primaryTarget}
        onClose={() => setPrimaryTarget(null)}
        onConfirm={handleSetPrimary}
        isLoading={isSettingPrimary}
        title="Set Primary Phone Number"
        subtitle={`Are you sure you want to set ${primaryTarget?.display_phone_number || ""} as the primary phone number? This will make it the default sender for all WhatsApp communication.`}
        confirmText="Set Primary"
        variant="primary"
      />
    </div>
  );
};

export default PhoneNumbers;
