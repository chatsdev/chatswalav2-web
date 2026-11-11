/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useGetCallLogsQuery } from "@/src/redux/api/whatsappCallingApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { CallLog } from "@/src/types/whatsappCalling";
import { formatDateTime } from "@/src/utils";
import { maskSensitiveData } from "@/src/utils/masking";
import { Calendar, Clock, FileText, Mic, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import CallLogDetailModal from "./CallLogDetailModal";

const CallLogList = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const { is_demo_mode } = useAppSelector((state) => state.setting);

  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"recording" | "transcript">("recording");
  const [selectedLogId, setSelectedLogId] = useState<string>("");

  const openModal = (id: string, type: "recording" | "transcript") => {
    setSelectedLogId(id);
    setModalType(type);
    setDetailModalOpen(true);
  };

  const {
    data: logsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetCallLogsQuery({
    page,
    limit,
    agentId: agentId || undefined,
    search: searchTerm,
  });

  const logs: CallLog[] = logsResult?.data || [];
  const totalCount = logsResult?.pagination?.totalItems || logs.length;

  const columns: Column<CallLog>[] = [
    {
      header: "User ID",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-md">
            <User size={14} className="text-slate-500" />
          </div>
          <span className="font-medium text-sm">{maskSensitiveData(row.contact_id?.phone_number || "N/A", "phone", is_demo_mode)}</span>
        </div>
      ),
    },
    {
      header: "Agent",
      cell: (row) => <span className="text-sm">{(row.agent_id as any)?.name || "Call Agent"}</span>,
    },
    {
      header: "Call Type",
      cell: (row) => <span className="text-sm capitalize">{row.call_type}</span>,
    },
    {
      header: "Status",
      cell: (row) => (
        <Badge variant="outline" className={cn("capitalize", row.status === "completed" ? "bg-light-primary text-primary border-primary/50" : "bg-amber-50 text-amber-600 border-amber-100")}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Duration",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <Clock size={14} />
          {row.duration}s
        </div>
      ),
    },
    {
      header: "Timestamp",
      cell: (row) => (
        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
          <Calendar size={14} />
          {formatDateTime(row.created_at)}
        </div>
      ),
    },
    {
      header: "Recording & Transcript",
      cell: (row) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="h-9 w-9 text-slate-500 hover:text-primary hover:bg-primary/5 border-none" onClick={() => openModal(row._id, "recording")} title="Recording">
            <Mic size={14} />
          </Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 text-slate-500 hover:text-primary hover:bg-primary/5 border-none" onClick={() => openModal(row._id, "transcript")} title="Transcript">
            <FileText size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) sm:p-6 space-y-8 animate-in fade-in duration-500">
      <CommonHeader backBtn title={t("ai_call_logs_page_title")} description={t("ai_call_logs_page_description")} onSearch={setSearchTerm} searchTerm={searchTerm} onRefresh={refetch} isLoading={isLoading} />

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 shadow-sm overflow-hidden mt-8">
        <DataTable data={logs} columns={columns} isLoading={isLoading} isFetching={isFetching} totalCount={totalCount} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} getRowId={(item) => item._id} emptyMessage="No call logs found." />
      </div>

      <CallLogDetailModal isOpen={detailModalOpen} onClose={() => setDetailModalOpen(false)} callLogId={selectedLogId} type={modalType} />
    </div>
  );
};

// Helper for class names
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

export default CallLogList;
