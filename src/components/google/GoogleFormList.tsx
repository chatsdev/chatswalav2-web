"use client";

import React, { use, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  useListFormsQuery,
  useBulkDeleteFormsMutation,
  useSyncFormsMutation,
} from "@/src/redux/api/googleApi";
import CommonHeader from "@/src/shared/CommonHeader";
import { Button } from "@/src/elements/ui/button";
import { Checkbox } from "@/src/elements/ui/checkbox";
import { Badge } from "@/src/elements/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/src/elements/ui/card";
import useDebounce from "@/src/utils/hooks/useDebounce";
import {
  Plus,
  RefreshCw,
  Trash2,
  Eye,
  ExternalLink,
  Edit,
  ClipboardList,
  Search,
  MessageSquare,
} from "lucide-react";
import SyncFormsModal from "./SyncFormsModal";
import DeleteFormModal from "./DeleteFormModal";
import ReadFormModal from "./ReadFormModal";
import dayjs from "dayjs";

interface GoogleFormListProps {
  paramsPromise: Promise<{ id: string }>;
}

const GoogleFormList: React.FC<GoogleFormListProps> = ({ paramsPromise }) => {
  const params = use(paramsPromise);
  const accountId = params.id as string;
  const router = useRouter();
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [deleteIds, setDeleteIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewFormId, setPreviewFormId] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useListFormsQuery({
    accountId,
    search: debouncedSearchTerm,
  });

  const [bulkDeleteForms, { isLoading: isDeleting }] = useBulkDeleteFormsMutation();

  const handleDeleteForms = async (deleteFrom: "google" | "platform") => {
    if (deleteIds.length === 0) return;
    try {
      await bulkDeleteForms({
        ids: deleteIds,
        delete_from: deleteFrom,
      }).unwrap();
      toast.success("Form(s) deleted successfully");
      setDeleteIds([]);
      setSelectedIds((prev) => prev.filter((id) => !deleteIds.includes(id)));
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete form(s)");
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  const rightContent = (
    <div className="flex items-center flex-wrap justify-end gap-3">
      {selectedIds.length > 0 && (
        <Button
          onClick={() => setDeleteIds(selectedIds)}
          variant="outline"
          className="flex items-center gap-2.5 px-4.5! py-5 border-red-600 text-red-600 hover:bg-red-50 h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group dark:hover:bg-red-900/20 animate-in fade-in zoom-in duration-300"
        >
          <Trash2 className="w-5 h-5" />
          <span>
            Bulk Delete ({selectedIds.length})
          </span>
        </Button>
      )}
      <Button
        onClick={() => setIsSyncModalOpen(true)}
        variant="outline"
        className="flex items-center gap-2.5 px-4.5! py-5 border-purple-600 text-purple-600 hover:bg-purple-50 h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group dark:hover:bg-purple-900/20"
      >
        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
        <span>Sync Forms</span>
      </Button>
      <Button
        onClick={() => router.push(`/google_account/${accountId}/forms/create`)}
        className="flex items-center gap-2.5 px-4.5! py-5 bg-purple-600 hover:bg-purple-700 text-white h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group"
      >
        <Plus className="w-5 h-5" />
        <span>Create Form</span>
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <CommonHeader
        title="Google Forms"
        description="Manage, sync and build Google Forms directly from your workspace."
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        searchPlaceholder="Search by form name..."
        onRefresh={() => {
          refetch();
          toast.success(t("refresh_success"));
        }}
        rightContent={rightContent}
        isLoading={isLoading || isFetching}
        backBtn={true}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="animate-pulse dark:bg-(--card-color)">
              <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-t-lg" />
              <CardHeader className="space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </CardHeader>
              <CardContent className="h-10" />
              <CardFooter className="border-t dark:border-slate-800 h-14" />
            </Card>
          ))}
        </div>
      ) : data?.forms && data.forms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.forms.map((form) => {
            const isSelected = selectedIds.includes(form._id);
            return (
              <Card
                key={form._id}
                className={`relative flex flex-col justify-between overflow-hidden transition-all duration-200 dark:bg-(--card-color) border hover:shadow-md ${
                  isSelected
                    ? "border-purple-600 dark:border-purple-500 bg-purple-50/10"
                    : "border-slate-100 dark:border-(--card-border-color)"
                }`}
              >
                {/* Selection Checkbox */}
                <div className="absolute top-4 right-4 rtl:right-[unset] rtl:left-4 z-10">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleSelect(form._id)}
                    className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 text-purple-600 focus:ring-purple-500"
                  />
                </div>

                <CardHeader className="pb-3 flex-row items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 mt-1 shrink-0">
                    <ClipboardList size={20} />
                  </div>
                  <div className="space-y-1 min-w-0 pr-6">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate text-lg" title={form.name}>
                      {form.name}
                    </h3>
                    <p className="text-sm  text-slate-500 truncate" title={form.form_id}>
                      ID: {form.form_id}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="pb-4 pt-0!">
                  <div className="flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                    <div className="flex gap-2">
                      <span>Created At:</span>
                      <span>{dayjs(form.created_at).format("DD MMM YYYY, hh:mm A")}</span>
                    </div>
                    <div className="flex gap-2 items-center mt-1">
                      <span>Status:</span>
                      {form.is_linked ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20 font-bold px-2 py-0.5">
                          Synced
                        </Badge>
                      ) : (
                        <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 font-bold px-2 py-0.5">
                          Platform Only
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-t border-slate-100 dark:border-(--card-border-color) pt-3 pb-3 flex items-center justify-between bg-slate-50/50 dark:bg-(--card-color) gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 border-none text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30 gap-1.5 font-semibold"
                      onClick={() => setPreviewFormId(form._id)}
                    >
                      <Eye size={15} />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 border-none text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/30 gap-1.5 font-semibold"
                      onClick={() => router.push(`/google_account/${accountId}/forms/edit/${form._id}`)}
                    >
                      <Edit size={15} />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 border-none text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 gap-1.5 font-semibold"
                      onClick={() => router.push(`/google_account/${accountId}/forms/${form._id}/responses`)}
                    >
                      <MessageSquare size={15} />
                      Responses
                    </Button>
                    <a
                      href={`https://docs.google.com/forms/d/${form.form_id}/edit`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex"
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-9 px-3 border-none text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-(--table-hover) dark:hover:text-slate-200 gap-1.5 font-semibold"
                      >
                        <ExternalLink size={14} />
                        Google
                      </Button>
                    </a>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 border-none text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 shrink-0"
                    onClick={() => setDeleteIds([form._id])}
                  >
                    <Trash2 size={15} />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-(--card-color) border border-slate-100 dark:border-slate-800 rounded-xl shadow-xs text-slate-500 gap-4">
          <ClipboardList className="w-16 h-16 text-slate-200" />
          <div className="text-center space-y-1.5">
            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-200">No Forms Found</h4>
            <p className="text-sm text-slate-400 max-w-sm">
              {searchTerm
                ? `No search results for "${searchTerm}". Try a different term.`
                : "Get started by creating your first Google Form or sync existing forms."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsSyncModalOpen(true)}
              variant="outline"
              className="gap-2 border-purple-600 text-purple-600 hover:bg-purple-50"
            >
              <RefreshCw size={15} />
              Sync Forms
            </Button>
            <Button
              onClick={() => router.push(`/google_account/${accountId}/forms/create`)}
              className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
              <Plus size={15} />
              Create Form
            </Button>
          </div>
        </div>
      )}

      {/* Sync Forms Modal */}
      <SyncFormsModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        accountId={accountId}
      />

      {/* Delete Form Confirmation Modal */}
      <DeleteFormModal
        isOpen={deleteIds.length > 0}
        onClose={() => setDeleteIds([])}
        onConfirm={handleDeleteForms}
        isLoading={isDeleting}
        count={deleteIds.length}
      />

      {/* Form Preview Modal */}
      {previewFormId && (
        <ReadFormModal
          isOpen={!!previewFormId}
          onClose={() => setPreviewFormId(null)}
          formId={previewFormId}
        />
      )}
    </div>
  );
};

export default GoogleFormList;
