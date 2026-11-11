/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useGetWebhookMessageLogsQuery, useGetTriggerLogsQuery } from "@/src/redux/api/webhookApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { WebhookLog } from "@/src/types/webhook";
import { cn, formatDateTime } from "@/src/utils";
import { CheckCircle2, FileJson, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import WebhookPayloadModal from "../WebhookPayloadModal";

const WebhookLogs = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"trigger" | "message">("trigger");
  const [selectedWebhookId, setSelectedWebhookId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedLog, setSelectedLog] = useState<WebhookLog | null>(null);
  const [isPayloadModalOpen, setIsPayloadModalOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tab === "message") setActiveTab("message");
    else setActiveTab("trigger");

    const webhookId = searchParams.get("webhook_id");
    if (webhookId) setSelectedWebhookId(webhookId);
  }, [searchParams]);

  const { data: triggerLogsResult, isLoading: isTriggerLoading, isFetching: isTriggerFetching, refetch: refetchTrigger } = useGetTriggerLogsQuery({ id: selectedWebhookId, page, limit, search: searchTerm }, { skip: !selectedWebhookId || activeTab !== "trigger" });

  const { data: messageLogsResult, isLoading: isMessageLoading, isFetching: isMessageFetching, refetch: refetchMessage } = useGetWebhookMessageLogsQuery({ id: selectedWebhookId, page, limit, search: searchTerm }, { skip: !selectedWebhookId || activeTab !== "message" });

  const handleRefresh = () => {
    if (activeTab === "trigger") refetchTrigger();
    else refetchMessage();
    toast.success("Logs refreshed");
  };

  const getStatusBadge = (status: string) => {
    let badgeClass = "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700";
    let icon = null;
    let label = status;

    if (status === "success" || status === "sent" || status === "delivered" || status === "read") {
      badgeClass = "bg-light-primary dark:bg-primary/10 text-primary-dark dark:text-primary border-[var(--primary-opacity-20)] dark:border-primary/20";
      icon = <CheckCircle2 size={12} />;
      label = status.charAt(0).toUpperCase() + status.slice(1);
    } else if (status === "failed") {
      badgeClass = "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-500/20";
      icon = <XCircle size={12} />;
      label = "Failed";
    } else if (status === "pending") {
      badgeClass = "bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-500/20";
      icon = <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />;
      label = "Pending";
    } else {
      label = status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";
    }

    return (
      <Badge variant="outline" className={badgeClass}>
        <div className="flex items-center gap-1.5 px-1 font-bold">
          {icon}
          {label}
        </div>
      </Badge>
    );
  };

  const handleViewPayload = (log: WebhookLog) => {
    setSelectedLog(log);
    setIsPayloadModalOpen(true);
  };

  const triggerColumns: Column<WebhookLog>[] = [
    {
      header: "Method",
      accessorKey: "method",
      cell: (row) => <span className={cn("text-[10px] font-black px-2 py-0.5 rounded uppercase", row.method === "GET" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-[var(--primary-opacity-20)] text-primary-dark dark:bg-primary-darker/30 dark:text-primary")}>{row.method || "POST"}</span>,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: "Error Message",
      accessorKey: "error_message",
      cell: (row) => (
        <span className="text-red-500 text-xs font-medium max-w-50 truncate block" title={row.error_message || (row as any).error}>
          {row.error_message || (row as any).error || "-"}
        </span>
      ),
    },
    {
      header: "Triggered At",
      accessorKey: "created_at",
      cell: (row) => <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{formatDateTime(row.created_at || (row as any).sent_at)}</span>,
    },
    {
      header: "Payload",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end">
          <Button variant="outline" size="icon" className="h-9 w-9 text-blue-600 dark:text-blue-400 border-none hover:bg-blue-50 dark:hover:bg-blue-500/10" onClick={() => handleViewPayload(row)}>
            <FileJson size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const messageColumns: Column<WebhookLog>[] = [
    {
      header: "Recipient",
      className: "[@media(max-width:1345px)]:min-w-[200px]",
      accessorKey: "phone_number",
      cell: (row) => (
        <div className="flex flex-col text-start">
          <span className="font-semibold text-slate-900 dark:text-slate-200">{row.phone_number || "-"}</span>
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{row.recipient_type || "N/A"}</span>
        </div>
      ),
    },
    {
      header: "Template",
      className: "[@media(max-width:1345px)]:min-w-[200px]",
      accessorKey: "template_name",
      cell: (row) => <span className="text-slate-600 dark:text-slate-300 font-medium">{row.template_name || "-"}</span>,
    },
    {
      header: "Status",
      className: "[@media(max-width:1345px)]:min-w-[200px]",
      accessorKey: "status",
      cell: (row) => getStatusBadge(row.status),
    },
    {
      header: "Error",
      className: "[@media(max-width:1345px)]:min-w-[340px]",
      accessorKey: "error_message",
      cell: (row) => (
        <span className="text-red-500 text-xs font-medium  block break-word whitespace-normal" title={row.error_message || (row as any).error}>
          {row.error_message || (row as any).error || "-"}
        </span>
      ),
    },
    {
      header: "Sent At",
      className: "[@media(max-width:1345px)]:min-w-[200px]",
      accessorKey: "created_at",
      cell: (row) => <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">{formatDateTime(row.created_at || (row as any).sent_at)}</span>,
    },
  ];

  const rightContent = (
    <div className="flex items-center gap-4 flex-wrap justify-end">
      <div className="flex items-center bg-slate-100 dark:bg-(--page-body-bg) p-1 rounded-lg border border-slate-200 dark:border-(--card-border-color)">
        <Button
          onClick={() => {
            setActiveTab("trigger");
            setPage(1);
            router.push(`${ROUTES.WebhooksLogs}?tab=trigger&webhook_id=${selectedWebhookId}`);
          }}
          className={`px-4! py-1.5! h-9! rounded-md! text-sm! font-bold! transition-all ${activeTab === "trigger" ? "bg-white! dark:bg-(--card-color)! text-primary! dark:text-primary! shadow-sm!" : "text-slate-500! hover:text-slate-700! bg-[unset]! hover:bg-[unset]! dark:hover:text-slate-300!"}`}
        >
          Trigger Logs
        </Button>
        <Button
          onClick={() => {
            setActiveTab("message");
            setPage(1);
            router.push(`${ROUTES.WebhooksLogs}?tab=message&webhook_id=${selectedWebhookId}`);
          }}
          className={`px-4! py-1.5! h-9! rounded-md! text-sm! font-bold! transition-all ${activeTab === "message" ? "bg-white! dark:bg-(--card-color)! text-primary! dark:text-primary! shadow-sm!" : "text-slate-500! hover:text-slate-700! bg-[unset]! hover:bg-[unset]! dark:hover:text-slate-300!"}`}
        >
          Message Logs
        </Button>
      </div>
    </div>
  );

  return (
    <div className="sm:p-8 pt-0! p-4 space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body) animate-in fade-in duration-500">
      <CommonHeader
        title={t("event_notification_logs")}
        description="Monitor and troubleshoot your event notification triggers and outgoing messages."
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder="Search logs..."
        onRefresh={handleRefresh}
        isLoading={isTriggerLoading || isMessageLoading}
        rightContent={rightContent}
        backBtn={true}
        onBack={() => router.push(ROUTES.Webhooks)}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) overflow-hidden shadow-sm">
        {activeTab === "trigger" && (
          <DataTable
            data={triggerLogsResult?.data?.logs || []}
            columns={triggerColumns}
            isLoading={isTriggerLoading}
            isFetching={isTriggerFetching}
            totalCount={triggerLogsResult?.data?.pagination?.totalItems || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            getRowId={(item) => item._id || item.id || ""}
            emptyMessage={searchTerm ? `No trigger logs found matching "${searchTerm}"` : "No trigger logs found for this webhook."}
            className="border-none shadow-none rounded-none"
            actionPermission={["view.ecommerce_webhooks"]}
          />
        )}

        {activeTab === "message" && (
          <DataTable
            data={messageLogsResult?.data?.logs || []}
            columns={messageColumns}
            isLoading={isMessageLoading}
            isFetching={isMessageFetching}
            totalCount={messageLogsResult?.data?.pagination?.totalItems || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            getRowId={(item) => item._id || item.id || ""}
            emptyMessage={searchTerm ? `No message logs found matching "${searchTerm}"` : "No message logs found for this webhook."}
            className="border-none shadow-none rounded-none"
          />
        )}
      </div>

      <WebhookPayloadModal
        isOpen={isPayloadModalOpen}
        onClose={() => setIsPayloadModalOpen(false)}
        webhook={
          selectedLog
            ? ({
              webhook_name: "Log Payload",
              first_payload: selectedLog.payload,
              first_payload_flattened: selectedLog.payload_flattened,
            } as any)
            : undefined
        }
      />
    </div>
  );
};

export default WebhookLogs;
