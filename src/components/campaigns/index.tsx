/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { headers, timeFilterOptions } from "@/src/data/campaign";
import { Button } from "@/src/elements/ui/button";
import { TabsList, TabsTrigger } from "@/src/elements/ui/tabs";
import {
  useDeleteCampaignByIdMutation,
  useGetCampaignsQuery,
  usePublishCampaignMutation,
  useResendCampaignMutation,
  useTogglePauseCampaignMutation,
} from "@/src/redux/api/campaignApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import ExportModal from "@/src/shared/ExportModal";
import { CampaignsPageProps } from "@/src/types/campaign";
import { Campaign } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { formatDateTime } from "@/src/utils";
import {
  exportToCSV,
  exportToExcel,
  exportToPrint,
} from "@/src/utils/exportUtils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import CampaignStats from "./CampaignStats";
import SetupRecurringModal from "./SetupRecurringModal";
import { getCampaignColumns } from "./components/CampaignColumns";
import { CampaignScheduleModal } from "./components/CampaignScheduleModal";

const CampaignsPage = ({ platform }: CampaignsPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportCampaignId, setExportCampaignId] = useState<string | null>(null);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [recurringCampaignId, setRecurringCampaignId] = useState<string | null>(
    null,
  );

  const [togglePauseCampaign, { isLoading: isPausing }] =
    useTogglePauseCampaignMutation();
  const [pauseCampaignItem, setPauseCampaignItem] = useState<{
    id: string;
    isPaused: boolean;
  } | null>(null);

  const [resendCampaign, { isLoading: isResending }] =
    useResendCampaignMutation();
  const [resendCampaignId, setResendCampaignId] = useState<string | null>(null);

  const [publishCampaign, { isLoading: isPublishing }] =
    usePublishCampaignMutation();
  const [publishCampaignId, setPublishCampaignId] = useState<string | null>(
    null,
  );

  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleModalType, setScheduleModalType] = useState<
    "resend" | "publish"
  >("resend");
  const [scheduleModalCampaignId, setScheduleModalCampaignId] = useState<
    string | null
  >(null);

  const openRescheduleModal = (
    type: "resend" | "publish",
    campaignId: string,
  ) => {
    setScheduleModalType(type);
    setScheduleModalCampaignId(campaignId);
    setScheduleModalOpen(true);
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const [timeFilter, setTimeFilter] = useState("all_time");

  const handleTimeFilterChange = (value: string) => {
    setTimeFilter(value);
    setPage(1);
  };

  const {
    data: campaignsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetCampaignsQuery(
    {
      page,
      limit,
      search: searchTerm,
      sort_by: sortBy,
      sort_order: sortOrder,
      time_filter: timeFilter,
      ...(platform ? { platform } : {}),
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [deleteCampaign, { isLoading: isDeleting }] =
    useDeleteCampaignByIdMutation();

  const campaigns: Campaign[] = campaignsResult?.data?.campaigns || [];
  const totalCount = campaignsResult?.data?.pagination?.totalItems || 0;

  const columns = getCampaignColumns({
    onInfo: (id) => {
      router.push(`${ROUTES.MessageCampaigns}/${id}`);
    },
    onDownloadReport: (id) => {
      setExportCampaignId(id);
      setExportModalOpen(true);
    },
    onPauseToggle: (id, isPaused) => {
      setPauseCampaignItem({ id, isPaused });
    },
    onPublish: (id) => {
      setPublishCampaignId(id);
    },
    onSetupRecurring: (id) => {
      setRecurringCampaignId(id);
      setRecurringModalOpen(true);
    },
    onResend: (id, isScheduled) => {
      if (isScheduled) {
        openRescheduleModal("resend", id);
      } else {
        setResendCampaignId(id);
      }
    },
    onDelete: (id) => {
      setDeleteId(id);
    },
  });

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCampaign(deleteId).unwrap();
        toast.success("Campaign deleted successfully");
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete campaign");
      }
    }
  };

  const handlePauseConfirm = async () => {
    if (pauseCampaignItem) {
      try {
        await togglePauseCampaign(pauseCampaignItem.id).unwrap();
        toast.success(
          `Campaign ${!pauseCampaignItem.isPaused ? "paused" : "resumed"} successfully`,
        );
        setPauseCampaignItem(null);
        refetch();
      } catch (error: any) {
        toast.error(
          error?.data?.error ||
            error?.data?.message ||
            "Failed to update campaign pause state",
        );
      }
    }
  };

  const handleResendConfirm = async () => {
    if (resendCampaignId) {
      try {
        await resendCampaign({ id: resendCampaignId }).unwrap();
        toast.success("Campaign resent successfully");
        setResendCampaignId(null);
      } catch (error: any) {
        toast.error(
          error?.data?.error ||
            error?.data?.message ||
            "Failed to resend campaign",
        );
      }
    }
  };

  const handlePublishConfirm = async () => {
    if (publishCampaignId) {
      try {
        await publishCampaign({ id: publishCampaignId }).unwrap();
        toast.success("Campaign published successfully");
        setPublishCampaignId(null);
      } catch (error: any) {
        if (error?.data?.code === "SCHEDULED_TIME_PASSED") {
          setPublishCampaignId(null);
          openRescheduleModal("publish", publishCampaignId);
        } else {
          toast.error(
            error?.data?.error ||
              error?.data?.message ||
              "Failed to publish campaign",
          );
        }
      }
    }
  };

  const handleScheduleModalSubmit = async (
    action: "send_immediately" | "reschedule",
    scheduledTime?: string,
  ) => {
    if (!scheduleModalCampaignId) return;

    if (action === "reschedule" && !scheduledTime) {
      toast.error("Please select a new scheduled time");
      return;
    }

    try {
      if (scheduleModalType === "resend") {
        await resendCampaign({
          id: scheduleModalCampaignId,
          is_scheduled: action === "reschedule",
          scheduled_at:
            action === "reschedule" ? scheduledTime : undefined,
        }).unwrap();
        toast.success("Campaign resent successfully");
      } else {
        await publishCampaign({
          id: scheduleModalCampaignId,
          action,
          scheduled_at:
            action === "reschedule" ? scheduledTime : undefined,
        }).unwrap();
        toast.success("Campaign published successfully");
      }
      setScheduleModalOpen(false);
    } catch (error: any) {
      toast.error(
        error?.data?.error ||
          error?.data?.message ||
          "Failed to process campaign",
      );
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Campaigns refreshed");
  };

  const handleExport = (type: "csv" | "excel" | "print") => {
    const campaignAction = campaigns.find(
      (c) => (c._id || (c as any).id) === exportCampaignId,
    );
    if (!campaignAction) {
      toast.error("Campaign not found");
      return;
    }

    const rowData = [
      [
        campaignAction.name,
        campaignAction.template_name,
        campaignAction.status,
        String(campaignAction.stats?.sent_count || 0),
        String(campaignAction.stats?.delivered_count || 0),
        String(campaignAction.stats?.read_count || 0),
        String(campaignAction.stats?.failed_count || 0),
        campaignAction.sent_at ? formatDateTime(campaignAction.sent_at) : "-",
      ],
    ];

    if (type === "csv") {
      exportToCSV(headers, rowData, "campaign_report");
    } else if (type === "excel") {
      exportToExcel(headers, rowData, "campaign_report", "Campaign Report");
    } else if (type === "print") {
      exportToPrint(
        headers,
        rowData,
        "Campaign Report",
        `Report for campaign: ${campaignAction.name}`,
      );
    }
    setExportModalOpen(false);
  };

  const pageTitle =
    platform === "telegram"
      ? "Telegram Campaigns"
      : platform === "facebook"
        ? "Facebook Campaigns"
        : platform === "instagram"
          ? "Instagram Campaigns"
          : t("campaigns_page_title");

  const pageDescription =
    platform === "telegram"
      ? "Broadcast campaign messages directly to Telegram users."
      : platform === "facebook"
        ? "Reach your Facebook audience directly via Messenger campaigns."
        : platform === "instagram"
          ? "Engage followers directly in their Instagram DMs with campaigns."
          : t("campaigns_page_description");

  return (
    <div className="sm:p-8 pt-0! p-4 space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader
        title={pageTitle}
        description={pageDescription}
        middleContent={
          <CampaignStats
            stats={campaignsResult?.data?.campaignStatistics}
            isLoading={isLoading}
          />
        }
        onSearch={handleSearch}
        searchTerm={searchTerm}
        featureKey="contacts_used"
        searchPlaceholder="Search campaigns..."
        onRefresh={handleRefresh}
        onAddClick={() => {
          if (platform === "telegram") {
            router.push(ROUTES.TelegramCampaignsAdd);
          } else if (platform === "facebook") {
            router.push(ROUTES.FacebookCampaignsAdd);
          } else if (platform === "instagram") {
            router.push(ROUTES.InstagramCampaignsAdd);
          } else {
            router.push(ROUTES.MessageCampaignsAdd);
          }
        }}
        addLabel="Add Campaign"
        addPermission="create.campaigns"
        deletePermission="delete.campaigns"
        isLoading={isLoading}
      >
        <TabsList className="h-11 justify-end flex-wrap gap-2 p-1 bg-transparent dark:bg-transparent!">
          {timeFilterOptions.map((opt) => (
            <TabsTrigger
              key={opt.value}
              active={timeFilter === opt.value}
              onClick={() => handleTimeFilterChange(opt.value)}
              className={`h-9 px-4 text-xs font-semibold rounded-lg transition-all ${
                timeFilter === opt.value
                  ? "bg-primary! text-white! shadow-xs"
                  : "bg-gray-200! dark:bg-(--page-body-bg)! text-slate-600! dark:text-slate-400! hover:bg-slate-200! dark:hover:bg-slate-700! hover:text-slate-800! dark:hover:text-slate-200!"
              }`}
            >
              {opt.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </CommonHeader>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden dark:border-(--card-border-color) dark:bg-(--card-color)">
        <DataTable
          data={campaigns}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          getRowId={(item) => item._id || (item as any).id}
          emptyMessage={
            searchTerm
              ? `No campaigns found matching "${searchTerm}"`
              : "No campaigns created yet."
          }
          className="border-none shadow-none rounded-none"
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          actionPermission={[
            "create.campaigns",
            "update.campaigns",
            "delete.campaigns",
          ]}
        />
      </div>

      <SetupRecurringModal
        isOpen={recurringModalOpen}
        onClose={() => {
          setRecurringModalOpen(false);
          setRecurringCampaignId(null);
        }}
        campaignId={recurringCampaignId}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        title="Download Campaign Report"
        description="Select your preferred format to download the campaign report."
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Delete Campaign"
        subtitle="Are you sure you want to delete this campaign? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />

      <ConfirmModal
        isOpen={!!pauseCampaignItem}
        onClose={() => setPauseCampaignItem(null)}
        onConfirm={handlePauseConfirm}
        isLoading={isPausing}
        title={
          pauseCampaignItem?.isPaused ? "Resume Campaign" : "Pause Campaign"
        }
        subtitle={
          pauseCampaignItem?.isPaused
            ? "Are you sure you want to resume this campaign? It will start sending messages again."
            : "Are you sure you want to pause this campaign? It will temporarily stop sending messages until resumed."
        }
        confirmText={pauseCampaignItem?.isPaused ? "Resume" : "Pause"}
        variant={pauseCampaignItem?.isPaused ? "primary" : "warning"}
      />

      <ConfirmModal
        isOpen={!!resendCampaignId}
        onClose={() => setResendCampaignId(null)}
        onConfirm={handleResendConfirm}
        isLoading={isResending}
        title="Resend Campaign"
        subtitle="Are you sure you want to resend this campaign? This will duplicate the campaign configuration and send it to the recipients again."
        confirmText="Resend"
        variant="primary"
      />

      <ConfirmModal
        isOpen={!!publishCampaignId}
        onClose={() => setPublishCampaignId(null)}
        onConfirm={handlePublishConfirm}
        isLoading={isPublishing}
        title="Publish Campaign"
        subtitle="Are you sure you want to publish this campaign? This action will activate the campaign, starting delivery immediately (or at the scheduled time)."
        confirmText="Publish"
        variant="primary"
      />

      <CampaignScheduleModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSubmit={handleScheduleModalSubmit}
        type={scheduleModalType}
        isLoading={isResending || isPublishing}
      />
    </div>
  );
};

export default CampaignsPage;
