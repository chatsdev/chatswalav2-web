/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Can from "@/src/components/shared/Can";
import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { useDeleteCallAgentsMutation, useGetCallAgentsQuery, useUpdateCallAgentMutation } from "@/src/redux/api/whatsappCallingApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Column } from "@/src/types/shared";
import { WhatsappCallAgent } from "@/src/types/whatsappCalling";
import { formatDate } from "@/src/utils";
import { Bot, Edit2, History, Mic, Settings2, Trash2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import BulkAssignAgentModal from "./BulkAssignAgentModal";
import CallSettingsModal from "./CallSettingsModal";

const CallAgentList = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
  const [bulkAssignAgent, setBulkAssignAgent] = useState<{ id: string; name: string } | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState([
    { id: "Agent Name", label: t("column_header_agent_name", "Agent Name"), isVisible: true },
    { id: "AI Model", label: t("column_header_ai_model", "AI Model"), isVisible: true },
    { id: "Voice config", label: t("column_header_voice_config", "Voice config"), isVisible: true },
    { id: "Status", label: t("column_header_status", "Status"), isVisible: true },
    { id: "Created", label: t("column_header_created", "Created"), isVisible: true },
    { id: "Actions", label: t("column_header_actions", "Actions"), isVisible: true },
  ]);

  const {
    data: agentsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetCallAgentsQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [updateCallAgent] = useUpdateCallAgentMutation();
  const [deleteCallAgents, { isLoading: isDeleting }] = useDeleteCallAgentsMutation();
  const [localStatuses, setLocalStatuses] = useState<Record<string, boolean>>({});

  const agents: WhatsappCallAgent[] = agentsResult?.data || [];
  const totalCount = agentsResult?.pagination?.totalItems || agentsResult?.total || agents.length;

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    setLocalStatuses((prev) => ({ ...prev, [id]: !currentStatus }));
    try {
      await updateCallAgent({ id, body: { is_active: !currentStatus } }).unwrap();
      toast.success(
        !currentStatus
          ? t("agent_activated_success", "Agent activated successfully")
          : t("agent_deactivated_success", "Agent deactivated successfully")
      );
    } catch (error: any) {
      setLocalStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.error(error?.data?.message || t("failed_update_status", "Failed to update status"));
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteCallAgents([deleteId]).unwrap();
        toast.success(t("agent_deleted_success", "Agent deleted successfully"));
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || t("failed_delete_agent", "Failed to delete agent"));
      }
    }
  };

  const confirmBulkDelete = async () => {
    try {
      await deleteCallAgents(selectedIds).unwrap();
      toast.success(t("agents_deleted_success", "{{count}} agents deleted successfully", { count: selectedIds.length }));
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || t("failed_delete_agents", "Failed to delete agents"));
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const columns: Column<WhatsappCallAgent>[] = [
    {
      header: t("column_header_agent_name", "Agent Name"),
      sortable: true,
      sortKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
            <Bot size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-700 dark:text-white">{row.name}</span>
            <span className="text-xs text-slate-500 line-clamp-1">{row.welcome_message}</span>
          </div>
        </div>
      ),
    },
    {
      header: t("column_header_ai_model", "AI Model"),
      cell: (row) => (
        <Badge variant="outline" className="bg-blue-50 text-blue-600 dark:border-(--card-border-color) border-blue-100 dark:bg-blue-500/10 dark:text-blue-400">
          {row.ai_config.model_id}
        </Badge>
      ),
    },
    {
      header: t("column_header_voice_config", "Voice config"),
      cell: (row) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 italic">
            <Mic size={12} /> {row.voice_config.stt_provider}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 italic">
            <Bot size={12} /> {row.voice_config.tts_provider}
          </div>
        </div>
      ),
    },
    {
      header: t("column_header_status", "Status"),
      sortable: true,
      sortKey: "is_active",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Switch checked={localStatuses[row._id] ?? row.is_active} onCheckedChange={() => handleStatusToggle(row._id, row.is_active)} />
        </div>
      ),
    },
    {
      header: t("column_header_created", "Created"),
      sortable: true,
      sortKey: "created_at",
      cell: (row) => <span className="text-slate-500 text-sm">{formatDate(row.created_at)}</span>,
    },
    {
      header: t("column_header_actions", "Actions"),
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="icon" className="shadow-xs h-10 w-10 dark:bg-(--page-body-bg) text-primary hover:text-primary hover:bg-primary/10 border-none" onClick={() => router.push(`${ROUTES.AICallLogs}?agentId=${row._id}`)} title={t("call_recording_history_tooltip", "Call Recording History")}>
            <History size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 text-indigo-600 shadow-xs dark:bg-(--page-body-bg) hover:text-indigo-600 hover:bg-indigo-50 border-none"
            onClick={() => {
              setBulkAssignAgent({ id: row._id, name: row.name });
              setIsBulkAssignOpen(true);
            }}
            title={t("bulk_assign_tooltip", "Bulk Assign to Contacts/Tags")}
          >
            <UserPlus size={16} />
          </Button>
          <Can permission="update.whatsapp_calling">
            <Button variant="outline" size="icon" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs dark:bg-(--page-body-bg)" onClick={() => router.push(`${ROUTES.AICallAgentsEdit}/${row._id}`)}>
              <Edit2 size={16} />
            </Button>
          </Can>
          <Can permission="delete.whatsapp_calling">
            <Button variant="outline" size="icon" className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs dark:bg-(--page-body-bg)" onClick={() => setDeleteId(row._id)}>
              <Trash2 size={16} />
            </Button>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) sm:p-6 space-y-8 animate-in fade-in duration-500">
      <CommonHeader
        title={t("ai_calling_page_title")}
        description={t("ai_calling_page_description")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder={t("search_agents_placeholder", "Search agents by name...")}
        onRefresh={refetch}
        onAddClick={() => router.push(ROUTES.AICallAgentsCreate)}
        addLabel={t("create_call_assistant", "Create Call Assistant")}
        addPermission="create.whatsapp_calling"
        rightContent={
          <Can permission="update.whatsapp_calling">
            <Button variant="outline" onClick={() => setIsSettingsOpen(true)} className="flex items-center gap-2.5 px-4.5! py-5 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) h-12 rounded-lg font-bold transition-all active:scale-95 group shadow-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-(--table-hover)">
              <Settings2 className="w-5 h-5 transition-transform group-hover:rotate-45" />
              <span className="inline">{t("call_settings_btn", "Call Settings")}</span>
            </Button>
          </Can>
        }
        deletePermission="delete.whatsapp_calling"
        isLoading={isLoading}
        columns={visibleColumns}
        onColumnToggle={(id) => setVisibleColumns((prev) => prev.map((col) => (col.id === id ? { ...col, isVisible: !col.isVisible } : col)))}
        onBulkDelete={() => setBulkConfirmOpen(true)}
        selectedCount={selectedIds.length}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden mt-8">
        <DataTable
          data={agents}
          columns={columns.filter((col, idx) => visibleColumns[idx]?.isVisible !== false)}
          isLoading={isLoading}
          isFetching={isFetching || isDeleting}
          totalCount={totalCount}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
          enableSelection={true}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          getRowId={(item) => item._id}
          emptyMessage={searchTerm ? t("no_agents_found_matching", 'No agents found matching "{{search}}"', { search: searchTerm }) : t("no_agents_configured", "No AI call agents configured. Start by creating one!")}
          onSortChange={(key, order) => {
            setSortBy(key);
            setSortOrder(order);
            setPage(1);
          }}
          actionPermission={["update.whatsapp_calling", "delete.whatsapp_calling"]}
        />
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title={t("delete_call_agent_title", "Delete Call Agent?")} subtitle={t("delete_call_agent_subtitle", "This will permanently delete the agent. You won't be able to recover it.")} confirmText={t("delete_agent_confirm", "Delete Agent")} variant="danger" />

      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title={t("bulk_delete_agents_title", "Bulk Delete Agents?")} subtitle={t("bulk_delete_agents_subtitle", "You are about to delete {{count}} call agents. This action cannot be undone.", { count: selectedIds.length })} confirmText={t("delete_selected_confirm", "Delete Selected")} variant="danger" />

      {bulkAssignAgent && <BulkAssignAgentModal isOpen={isBulkAssignOpen} onClose={() => setIsBulkAssignOpen(false)} agentId={bulkAssignAgent.id} agentName={bulkAssignAgent.name} />}

      <CallSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default CallAgentList;
