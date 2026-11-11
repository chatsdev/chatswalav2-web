/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SubmissionDetailsModal from "@/src/components/form-builder/submissions/SubmissionDetailsModal";
import SubmissionKanbanActionModal from "@/src/components/form-builder/submissions/SubmissionKanbanActionModal";
import UpdateSubmissionStatusModal from "@/src/components/form-builder/submissions/UpdateSubmissionStatusModal";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { useDeleteSubmissionMutation, useGetSubmissionDetailsQuery, useGetSubmissionsQuery, useUpdateSubmissionStatusMutation } from "@/src/redux/api/submissionApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { Submission } from "@/src/types/submission";
import { Eye, SquareKanban, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const SubmissionsPage = () => {
  const params = useParams();
  const formId = params.id as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Modals state
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [subToUpdate] = useState<{ id: string; status: string } | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState<string | null>(null);

  const [kanbanSub, setKanbanSub] = useState<Submission | null>(null);
  const [kanbanModalOpen, setKanbanModalOpen] = useState(false);

  // Queries
  const {
    data: submissionsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetSubmissionsQuery({
    form_id: formId,
    params: {
      page,
      limit,
      search: searchTerm,
    },
  });

  const { data: detailsData, isFetching: isDetailsLoading } = useGetSubmissionDetailsQuery(selectedSubId || "", {
    skip: !selectedSubId || !isDetailsModalOpen,
  });

  // Mutations
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSubmissionStatusMutation();
  const [deleteSubmission, { isLoading: isDeleting }] = useDeleteSubmissionMutation();

  // Handlers
  const handleViewDetails = (id: string) => {
    setSelectedSubId(id);
    setIsDetailsModalOpen(true);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!subToUpdate) return;
    try {
      await updateStatus({ id: subToUpdate.id, status: newStatus }).unwrap();
      toast.success("Status updated successfully");
      setIsStatusModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const handleDeleteClick = (id: string) => {
    setSubToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!subToDelete) return;
    try {
      await deleteSubmission(subToDelete).unwrap();
      toast.success("Submission deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete submission");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      new: { variant: "default", color: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-(--card-border-color)" },
      viewed: { variant: "secondary", color: "bg-indigo-500/10 text-indigo-600 border-indigo-200 dark:border-(--card-border-color)" },
      in_progress: { variant: "outline", color: "bg-amber-500/10 text-amber-600 border-amber-200 dark:border-(--card-border-color)" },
      contacted: { variant: "outline", color: "bg-cyan-500/10 text-cyan-600 border-cyan-200  dark:border-(--card-border-color)" },
      qualified: { variant: "default", color: "bg-primary/10 text-primary border-[var(--primary-opacity-30)]  dark:border-(--card-border-color)" },
      closed: { variant: "secondary", color: "bg-slate-500/10 text-slate-600 border-slate-200  dark:border-(--card-border-color)" },
      failed: { variant: "destructive", color: "bg-red-500/10 text-red-600 border-red-200  dark:border-(--card-border-color)" },
    };

    const config = variants[status] || variants.new;
    return (
      <Badge variant={config.variant} className={`capitalize text-[10px] font-bold ${config.color}`}>
        {status.replace(/_/g, " ")}
      </Badge>
    );
  };

  const columns = [
    {
      header: "Lead / Contact",
      className: "max-w-[260px] [@media(max-width:890px)]:min-w-[200px]",
      accessorKey: "contact_info.name",
      cell: (row: any) => {
        const name = row.contact_info?.name || "Unknown";
        const phone = row.contact_info?.phone || "No phone";
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">{name.substring(0, 2)}</div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-900 dark:text-white">{name}</span>
              <span className="text-[10px] text-slate-500 dark:text-gray-400">{phone}</span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Data Preview",
      className: "max-w-[260px] [@media(max-width:890px)]:min-w-[210px]",
      accessorKey: "preview",
      cell: (row: any) => <span className="text-xs text-slate-600 dark:text-gray-300 max-w-50 truncate block">{row.preview}</span>,
    },
    {
      header: "Submitted At",
      className: "max-w-[260px] [@media(max-width:890px)]:min-w-[430px]",
      accessorKey: "submitted_at",
      cell: (row: any) => (
        <span className="text-xs text-slate-500 dark:text-gray-400 break-all whitespace-normal line-clamp-2">
          {new Date(row.submitted_at).toLocaleDateString()} at {new Date(row.submitted_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
      ),
    },
    {
      header: "Status",
      className: "max-w-[260px] [@media(max-width:890px)]:min-w-[138px]",
      accessorKey: "status",
      cell: (row: any) => getStatusBadge(row.status),
    },
    {
      header: "Actions",
      className: "max-w-[260px] [@media(max-width:890px)]:min-w-[150px]",
      cell: (row: any) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" title="View Details" className="h-10 w-10 dark:bg-(--page-body-bg) shadow-xs text-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 border-none" onClick={() => handleViewDetails(row._id || row.id)}>
            <Eye size={14} />
          </Button>
          {/* <Button variant="outline" size="icon" title="Update Status" className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-light-primary border-none" onClick={() => handleOpenStatusModal(row._id || row.id, row.status)}>
            <Clock size={14} />
          </Button> */}
          <Button
            variant="outline"
            size="icon"
            title="Manage Pipeline"
            className="h-10 w-10 dark:bg-(--page-body-bg) shadow-xs text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50 border-none"
            onClick={() => {
              setKanbanSub(row);
              setKanbanModalOpen(true);
            }}
          >
            <SquareKanban size={14} />
          </Button>
          <Button variant="outline" size="icon" title="Delete" className="h-10 w-10 dark:bg-(--page-body-bg) shadow-xs text-red-600 hover:text-red-600 hover:bg-red-50 border-none" onClick={() => handleDeleteClick(row._id || row.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) sm:p-6 space-y-8 animate-in fade-in duration-500">
      <CommonHeader
        title="Form Submissions"
        description="Manage and track leads captured from your forms"
        backBtn={true}
        searchTerm={searchTerm}
        onSearch={setSearchTerm}
        onRefresh={() => {
          refetch();
        }}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable columns={columns as any} data={submissionsData?.data || []} isLoading={isLoading} isFetching={isFetching || isUpdatingStatus || isDeleting} totalCount={submissionsData?.pagination?.totalForms || 0} page={page} limit={limit} onPageChange={setPage} onLimitChange={setLimit} enableSelection={false} getRowId={(item: any) => (item._id || item.id || "") as string} emptyMessage="No submissions found yet. Share your form to start collected data!" actionPermission={["update.form_builder", "delete.form_builder"]} />
      </div>

      <SubmissionDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} data={detailsData?.data || null} isLoading={isDetailsLoading} />

      {subToUpdate && <UpdateSubmissionStatusModal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} currentStatus={subToUpdate.status} onConfirm={handleUpdateStatus} isLoading={isUpdatingStatus} />}

      <ConfirmModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} isLoading={isDeleting} title="Delete Submission" subtitle="Are you sure you want to delete this submission? This action cannot be undone." />

      <SubmissionKanbanActionModal isOpen={kanbanModalOpen} onClose={() => setKanbanModalOpen(false)} submission={kanbanSub} />
    </div>
  );
};

export default SubmissionsPage;
