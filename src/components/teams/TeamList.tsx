/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Can from "@/src/components/shared/Can";
import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { useDeleteTeamsMutation, useGetTeamsQuery, useToggleTeamStatusMutation } from "@/src/redux/api/teamApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Team } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { formatDate } from "@/src/utils";
import { Edit2, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const TeamList = () => {
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

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const initialColumns = [
    { id: "Team Info", label: t("team_info"), isVisible: true },
    { id: "Note", label: t("note"), isVisible: true },
    { id: "Status", label: t("status"), isVisible: true },
    { id: "Created", label: t("created"), isVisible: true },
    { id: "Actions", label: t("actions"), isVisible: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const {
    data: teamsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetTeamsQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
  });

  const [toggleTeamStatus] = useToggleTeamStatusMutation();
  const [deleteTeams, { isLoading: isDeleting }] = useDeleteTeamsMutation();

  const teams: Team[] = teamsResult?.data?.teams || [];
  const totalCount = teamsResult?.data?.pagination?.totalItems || 0;

  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    setLocalStatuses((prev) => ({ ...prev, [id]: newStatus }));
    try {
      await toggleTeamStatus(id).unwrap();
      toast.success(currentStatus === "active" ? t("team_deactivated_success") : t("team_activated_success"));
    } catch (error: any) {
      setLocalStatuses((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.error(error?.data?.message || t("fetch_failed"));
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        const res = await deleteTeams([deleteId]).unwrap();
        toast.success(t(res.message ||"team_delete_success"));
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || t("team_delete_failed"));
      }
    }
  };

  const confirmBulkDelete = async () => {
    try {
      const res = await deleteTeams(selectedIds).unwrap();
      toast.success(t(res.message || "teams_deleted_success", { count: selectedIds.length }));
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || t("teams_delete_failed"));
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const columns: Column<Team>[] = [
    {
      header: t("team_info"),
      className: "[@media(max-width:1199px)]:min-w-[265px]",
      sortable: true,
      sortKey: "name",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 dark:bg-(--page-body-bg) dark:border-none flex items-center justify-center text-primary font-bold border border-primary/20 shrink-0">
            <Users size={22} />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-slate-700 dark:text-white text-base">{row.name}</span>
            <span className="text-xs text-slate-500 font-medium line-clamp-1">{row.description || t("no_description")}</span>
          </div>
        </div>
      ),
    },
    {
      header: t("note"),
      className: "[@media(max-width:1199px)]:min-w-[225px]",
      cell: (row) => <span className="text-slate-500 dark:text-slate-300 font-medium py-0.5 rounded-md break-all whitespace-normal line-clamp-1">{row.description || "-"}</span>,
    },
    {
      header: t("status"),
      className: "[@media(max-width:1199px)]:min-w-[130px]",
      sortable: true,
      sortKey: "status",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Switch checked={(localStatuses[row._id] || row.status) === "active"} onCheckedChange={() => handleStatusToggle(row._id, row.status)} className="data-[state=checked]:bg-primary shadow-xs" />
        </div>
      ),
    },
    {
      header: t("created"),
      className: "[@media(max-width:1199px)]:min-w-[155px]",
      sortable: true,
      sortKey: "created_at",
      cell: (row) => (
        <div className="flex items-center gap-2 text-slate-500 text-sm font-semibold">
          <span className="dark:text-gray-400">{formatDate(row.created_at)}</span>
        </div>
      ),
    },
    {
      header: t("actions"),
      className: "[@media(max-width:1199px)]:min-w-[153px]",
      cell: (row) => (
        <div className="flex justify-end gap-3">
          <Can permission="update.teams">
            <Button variant="outline" size="icon" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-light-primary rounded-lg dark:hover:bg-primary/20 transition-all" onClick={() => router.push(`${ROUTES.Teams}/${row._id}/edit`)}>
              <Edit2 size={16} />
            </Button>
          </Can>
          <Can permission="delete.teams">
            <Button variant="outline" size="icon" className="w-10 h-10 text-red-500 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 border-none" onClick={() => setDeleteId(row._id)}>
              <Trash2 size={16} />
            </Button>
          </Can>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full flex flex-col p-4 sm:p-8 bg-(--page-body-bg) dark:bg-(--dark-body) animate-in fade-in duration-500  pt-0!">
      <CommonHeader
        title={t("teams_page_title")}
        description={t("teams_page_description")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder={t("find_teams_placeholder")}
        onRefresh={() => {
          refetch();
          toast.success(t("teams_synced"));
        }}
        onAddClick={() => router.push(ROUTES.TeamsCreate)}
        addLabel={t("add_new_team")}
        addPermission="create.teams"
        deletePermission="delete.teams"
        isLoading={isLoading}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onBulkDelete={() => setBulkConfirmOpen(true)}
        selectedCount={selectedIds.length}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow-sm">
        <DataTable data={teams} columns={columns.filter((col) => visibleColumns.find((vc) => vc.id === col.header)?.isVisible !== false)} isLoading={isLoading} isFetching={isFetching || isDeleting} totalCount={totalCount} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? t("no_teams_found_matching", { searchTerm }) : t("no_teams_found")} className="border-none shadow-none rounded-none" onSortChange={handleSortChange} />
      </div>

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title={t("remove_team_title")} subtitle={t("remove_team_desc")} confirmText={t("confirm_remove_team")} variant="danger" />

      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title={t("delete_selected_teams_title")} subtitle={t("delete_selected_teams_desc", { count: selectedIds.length })} confirmText={t("delete_selected")} variant="danger" />
    </div>
  );
};

export default TeamList;
