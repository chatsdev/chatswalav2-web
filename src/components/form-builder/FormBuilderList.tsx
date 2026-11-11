/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { usePermissions } from "@/src/hooks/usePermissions";
import { useDeleteFormMutation, useGetFormsQuery, usePublishFormMutation, useSyncFlowsStatusMutation } from "@/src/redux/api/formBuilderApi";
import { RootState } from "@/src/redux/store";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { cn } from "@/src/utils";
import { ClipboardList, Edit2, Info, LayoutGrid, List, RefreshCw, Rocket, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import Can from "../shared/Can";
import FormCard from "./FormCard";
import SyncMetaFlowModal from "./SyncMetaFlowModal";
import FormDetailsModal from "./FormDetailsModal";

const FormBuilderList = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const selectedWorkspace = useSelector((state: RootState) => state.workspace.selectedWorkspace);
  const { hasPermission } = usePermissions();

  const {
    data: formsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetFormsQuery(
    {
      page,
      limit,
      search: searchTerm,
      waba_id: selectedWorkspace?.waba_id,
      sort_by: sortBy,
      sort_order: sortOrder,
    },
    { skip: !selectedWorkspace?.waba_id }
  );

  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation();
  const [publishForm, { isLoading: isPublishing }] = usePublishFormMutation();
  const [syncStatus, { isLoading: isSyncingStatus }] = useSyncFlowsStatusMutation();

  const handleDelete = (id: string) => {
    setIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;
    try {
      await deleteForm(idToDelete).unwrap();
      toast.success("Form deleted successfully");
      setIsDeleteModalOpen(false);
      setIdToDelete(null);
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete form");
    }
  };

  const handlePublish = async (id: string) => {
    try {
      const response: any = await publishForm(id).unwrap();
      toast.success(response?.data?.message || "Form published to Meta successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to publish form");
    }
  };
  const handleSyncStatus = async () => {
    if (!selectedWorkspace?.waba_id) return;
    try {
      await syncStatus({ waba_id: selectedWorkspace.waba_id }).unwrap();
      toast.success("Flows status synced successfully");
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to sync status");
    }
  };

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  }; 

  const columns = [
    {
      header: "Form Name",
      accessorKey: "name",
      sortable: true,
      sortKey: "name",
      copyable: true,
      copyValue: "name",
      cell: (row: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
      sortable: true,
      sortKey: "category",
      cell: (row: any) => (
        <Badge variant="outline" className="bg-slate-50 dark:bg-(--dark-body) text-[10px] font-bold">
          {row.category?.replace(/_/g, " ")}
        </Badge>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      sortable: true,
      sortKey: "status",
      cell: (row: any) => {
        const status = row.meta_status || row.status;
        return (
          <Badge variant={status == "PUBLISHED" ? "default" : status == "DRAFT" ? "secondary" : status == "ERROR" ? "destructive" : "default"} className="capitalize text-[10px]">
            {status?.toLowerCase()}
          </Badge>
        );
      },
    },
    {
      header: "Submissions",
      accessorKey: "stats.submissions",
      cell: (row: any) => <span className="font-mono">{row.stats?.submissions || 0}</span>,
    },
    {
      header: "Actions",
      id: "actions",
      cell: (row: any) => {
        const status = row.meta_status || row.status || "draft";
        const isDraft = status.toLowerCase() === "draft";
        return (
          <div className="flex items-center gap-2">
            <Can permission="update.form_builder">
              {isDraft && (
                <Button variant="outline" size="icon" title="Edit Form" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all" onClick={() => router.push(`${ROUTES.WhatsappForm}/${row._id}/edit`)}>
                  <Edit2 size={16} />
                </Button>
              )}

              {!(status.toLowerCase() == "published" || status.toLowerCase() == "deprecated" || isPublishing) && (
                <Button variant="outline" size="icon" title="Publish to Meta" className="w-10 h-10 border-none text-yellow-500 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg dark:hover:bg-yellow-900/20 transition-all" onClick={() => handlePublish(row._id)} disabled={status.toLowerCase() == "published" || status.toLowerCase() == "deprecated" || isPublishing}>
                  <Rocket size={16} />
                </Button>
              )}

              <Button variant="outline" size="icon" title="View Submissions" className="h-10 w-10 text-blue-600 hover:text-blue-600 hover:bg-blue-50 border-none" onClick={() => router.push(`${ROUTES.WhatsappForm}/${row._id}/submissions`)}>
                <ClipboardList size={16} />
              </Button>

              <Button variant="outline" size="icon" title="View Info" className="h-10 w-10 text-slate-500 hover:text-slate-700 hover:bg-slate-50 border-none dark:hover:bg-slate-800" onClick={() => { setSelectedForm(row); setIsInfoModalOpen(true); }}>
                <Info size={16} />
              </Button>
            </Can>

            <Can permission="delete.form_builder">
              <Button variant="outline" size="icon" title="Delete Form" className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20" onClick={() => handleDelete(row._id)} disabled={isDeleting}>
                <Trash2 size={16} />
              </Button>
            </Can>
          </div>
        );
      },
    },
  ].filter((col) => col.id !== "actions" || hasPermission("update.form_builder") || hasPermission("delete.form_builder"));

  return (
    <div className="p-4 pt-0! sm:p-6 space-y-8 animate-in fade-in duration-500 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader
        title={t("form_builder_title")}
        description="Design multi-step forms and Meta Flows for WhatsApp"
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        searchPlaceholder="Search forms..."
        onRefresh={() => {
                  refetch();
                  toast.success("Successfully refreshed Forms");
                }}
        onSyncStatus={handleSyncStatus}
        isSyncingStatus={isSyncingStatus}
        onAddClick={() => router.push(ROUTES.WhatsappFormCreate)}
        addLabel={t("create_new_form")}
        addPermission="create.form_builder"
        syncStatusPermission="update.form_builder"
        rightContent={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 dark:bg-(--page-body-bg) p-1 rounded-lg border border-slate-200 dark:border-(--card-border-color) shadow-inner mr-2">
              <Button variant="ghost" size="sm" onClick={() => setViewMode("grid")} className={cn("h-9 px-3 rounded-lg gap-2 transition-all", viewMode === "grid" ? "bg-white dark:bg-(--card-color) text-primary shadow-sm font-bold" : "text-slate-400 hover:text-slate-600")}>
                <LayoutGrid size={16} />
                <span className="text-xs tracking-wider">{t("grid")}</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setViewMode("table")} className={cn("h-9 px-3 rounded-lg gap-2 transition-all", viewMode === "table" ? "bg-white dark:bg-(--card-color) text-primary shadow-sm font-bold" : "text-slate-400 hover:text-slate-600")}>
                <List size={16} />
                <span className="text-xs tracking-wider">{t("table")}</span>
              </Button>
            </div>

            <Can permission="update.form_builder">
              <Button variant="outline" className="flex items-center gap-2.5 px-4.5! py-5 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) h-12 rounded-lg font-bold transition-all active:scale-95 group shadow-sm text-slate-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-(--table-hover)" onClick={() => setIsSyncModalOpen(true)}>
                <RefreshCw size={18} className="transition-transform group-hover:rotate-180" />
                <span>{t("sync_meta_flows")}</span>
              </Button>
            </Can>
          </div>
        }
        selectedCount={0}
      />

      {viewMode === "grid" ? (
        isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-72 bg-slate-100 dark:bg-(--card-color) animate-pulse rounded-lg border border-slate-200 dark:border-slate-700" />
            ))}
          </div>
        ) : (formsData?.data?.length ?? 0) > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {formsData?.data?.map((form: any) => (
              <FormCard key={form._id} form={form} onDelete={handleDelete} onPublish={handlePublish} onViewInfo={(selected) => { setSelectedForm(selected); setIsInfoModalOpen(true); }} isPublishing={isPublishing} isDeleting={isDeleting} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-(--card-color) rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 mt-8">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-full mb-4 ring-1 ring-slate-100 dark:ring-slate-800">
              <ClipboardList className="h-12 w-12 text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">No forms found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mt-2">{searchTerm ? `No forms matching "${searchTerm}"` : "You haven't created any automation forms yet. Click the button above to get started."}</p>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color)  overflow-hidden mt-8">
          <DataTable columns={columns as any} data={formsData?.data || []} isLoading={isLoading} isFetching={isFetching || isDeleting} totalCount={formsData?.pagination?.totalForms || 0} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={false} getRowId={(item) => item._id} emptyMessage="No forms found. Create your first automated interaction form!" onSortChange={handleSortChange} sortBy={sortBy} sortOrder={sortOrder} actionPermission={["update.form_builder", "delete.form_builder"]} />
        </div>
      )}

      {selectedWorkspace?.waba_id && <SyncMetaFlowModal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} wabaId={selectedWorkspace?.waba_id || ""} />}

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={confirmDelete} isLoading={isDeleting} title="Delete Form" subtitle="Are you sure you want to delete this form? This action cannot be undone." variant="danger" />

      <FormDetailsModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} form={selectedForm} />
    </div>
  );
};

export default FormBuilderList;
