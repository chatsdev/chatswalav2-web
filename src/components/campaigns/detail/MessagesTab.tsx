import { Badge } from "@/src/elements/ui/badge";
import { TabsContent } from "@/src/elements/ui/tabs";
import { useAppSelector } from "@/src/redux/hooks";
import { Button } from "@/src/elements/ui/button";
import ExportModal from "@/src/shared/ExportModal";
import { Recipient } from "@/src/types/components";
import { cn } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { FileDown, AlertCircle } from "lucide-react";
import {
  exportToCSV,
  exportToExcel,
  exportToPrint,
} from "@/src/utils/exportUtils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { useGetCampaignByIdQuery, useLazyGetCampaignByIdQuery } from "@/src/redux/api/campaignApi";

const getFailureReason = (reason: Recipient["failure_reason"]): string => {
  if (!reason) return "";
  if (typeof reason === "string") return reason;
  return reason.friendly || reason.original || "";
};

export const MessagesTab = ({
  campaignId,
  active,
}: {
  campaignId: string;
  active: boolean;
}) => {
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [triggerGetCampaignById] = useLazyGetCampaignByIdQuery();

  const {
    data: campaignResult,
    isLoading,
    isFetching,
  } = useGetCampaignByIdQuery(
    { id: campaignId, params: { page, limit } },
    { skip: !campaignId || !active },
  );

  const campaign = campaignResult?.data;
  const recipients = campaign?.recipients || [];
  const totalCount = campaign?.recipients_pagination?.totalItems || 0;
  const isRecurring = campaign?.is_recurring ?? false;

  const handlePageChange = (newPage: number) => setPage(newPage);
  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleExport = async (type: "csv" | "excel" | "print") => {
    const toastId = toast.loading("Preparing report for download...");
    try {
      const result = await triggerGetCampaignById({
        id: campaignId,
        params: { all_recipients: true }
      }).unwrap();

      const exportRecipients = result?.data?.recipients || [];

      if (!exportRecipients || exportRecipients.length === 0) {
        toast.error("No data to export", { id: toastId });
        return;
      }

      const headers = [
        "Recipient",
        "Status",
        "Sent At",
        "Delivered At",
        "Read At",
        "Error Info",
      ];
      const rowData = exportRecipients.map((rec: Recipient) => [
        rec.phone_number,
        rec.status,
        rec.sent_at ? new Date(rec.sent_at).toLocaleString() : "-",
        rec.delivered_at ? new Date(rec.delivered_at).toLocaleString() : "-",
        rec.read_at ? new Date(rec.read_at).toLocaleString() : "-",
        getFailureReason(rec.failure_reason) || "-",
      ]);

      if (type === "csv") {
        exportToCSV(headers, rowData, "message_logs");
      } else if (type === "excel") {
        exportToExcel(headers, rowData, "message_logs", "Message Delivery Logs");
      } else if (type === "print") {
        exportToPrint(
          headers,
          rowData,
          "Message Delivery Logs",
          "Complete list of message deliveries for this campaign.",
        );
      }
      toast.success("Report downloaded successfully", { id: toastId });
      setExportModalOpen(false);
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Failed to prepare report for download", { id: toastId });
    }
  };

  const columns = useMemo<Column<Recipient>[]>(
    () => [
      // "Run #" column — only shown for recurring campaigns
      ...(isRecurring
        ? [
            {
              header: "Run",
              className: "px-6 py-4 min-w-[90px]",
              cell: (rec: Recipient) =>
                rec.run_number !== undefined ? (
                  <div className="flex flex-col gap-0.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full w-fit">
                      Run #{rec.run_number}
                    </span>
                    {rec.run_sent_at && (
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(rec.run_sent_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-300">-</span>
                ),
            } as Column<Recipient>,
          ]
        : []),
      {
        header: "Recipient",
        className: "px-6 py-4",
        cell: (rec: Recipient) => (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
              {maskSensitiveData(rec.phone_number, "phone", is_demo_mode) ||
                "Unknown"}
            </span>
            <span className="text-sm text-slate-400 font-bold">Mobile</span>
          </div>
        ),
      },
      {
        header: "Status",
        className: "px-6 py-4 [@media(max-width:1920px)]:min-w-[150px]",
        cell: (rec: Recipient) => {
          const displayStatus = campaign?.status === "failed" && rec.status === "pending" ? "failed" : rec.status;
          return (
            <Badge
              variant="outline"
              className={cn(
                "uppercase text-[10px] font-black py-0.5 px-2 border-2",
                displayStatus === "sent"
                  ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/30 dark:border-blue-900/50"
                  : displayStatus === "delivered"
                    ? "bg-light-primary text-primary border-[var(--primary-opacity-20)] dark:bg-primary-darker/30 dark:border-primary-darker/50"
                    : displayStatus === "read"
                      ? "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:border-purple-900/50"
                      : displayStatus === "failed"
                        ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:border-red-900/50"
                        : "bg-slate-50 text-slate-600 dark:text-gray-400 border-slate-100 dark:bg-(--page-body-bg) dark:border-(--card-border-color)",
              )}
            >
              {displayStatus}
            </Badge>
          );
        },
      },
      {
        header: "Sent At",
        className:
          "px-6 py-4 text-xs text-slate-500 font-bold text-center [@media(max-width:1920px)]:min-w-[150px] [@media(max-width:750px)]:min-w-25",
        cell: (rec: Recipient) =>
          rec.sent_at ? new Date(rec.sent_at).toLocaleTimeString() : "-",
      },
      {
        header: "Delivered",
        className:
          "px-6 py-4 text-xs text-slate-500 font-bold text-center [@media(max-width:1920px)]:min-w-[150px]",
        cell: (rec: Recipient) =>
          rec.delivered_at
            ? new Date(rec.delivered_at).toLocaleTimeString()
            : "-",
      },
      {
        header: "Read",
        className:
          "px-6 py-4 text-xs text-slate-500 font-bold text-center [@media(max-width:1920px)]:min-w-[150px]",
        cell: (rec: Recipient) =>
          rec.read_at ? new Date(rec.read_at).toLocaleTimeString() : "-",
      },
      {
        header: "Error Info",
        className: "px-6 py-4 text-left min-w-[250px] max-w-[320px]",
        cell: (rec: Recipient) => {
          const reason = getFailureReason(rec.failure_reason);
          return reason ? (
            <div className="flex items-start gap-1.5 text-red-600 dark:text-red-400 text-[11px] font-semibold whitespace-normal break-words leading-relaxed">
              <span>{reason}</span>
            </div>
          ) : (
            <span className="text-slate-300">-</span>
          );
        },
      },
    ],
    [is_demo_mode, isRecurring],
  );

  return (
    <TabsContent
      active={active}
      className="space-y-4 mt-0 focus:outline-none min-h-52"
    >
      <div className="flex items-center justify-end mb-2 flex-wrap gap-3">
        
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-lg border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) text-slate-600 dark:text-slate-300 hover:text-primary transition-all font-bold text-xs"
          onClick={() => setExportModalOpen(true)}
          disabled={!recipients || recipients.length === 0}
        >
          <FileDown size={14} />
          Download Report
        </Button>
      </div>
      <div className="bg-white dark:bg-(--card-color) rounded-lg shadow-sm overflow-hidden">
        <DataTable<Recipient>
          data={recipients}
          columns={columns}
          isLoading={isLoading}
          isFetching={isFetching}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          emptyMessage="No message logs found for this campaign."
          enableSelection={false}
        />
      </div>
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExport}
        title="Download Message Logs"
        description="Select your preferred format to download the message delivery logs."
        selectedCount={recipients?.length || 0}
      />
    </TabsContent>
  );
};
