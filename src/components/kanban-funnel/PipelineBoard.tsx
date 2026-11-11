/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { tabItems } from "@/src/data/kanubanFunnel";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/elements/ui/dropdown-menu";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/src/elements/ui/tabs";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { cn } from "@/src/lib/utils";
import {
  useCreateFunnelMutation,
  useDeleteFunnelMutation,
  useGetFunnelsQuery,
  useUpdateFunnelMutation,
} from "@/src/redux/api/kanbanFunnelApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { Pagination } from "@/src/shared/Pagination";
import { KanbanFunnel } from "@/src/types/kanban-funnel";
import {
  Contact,
  Edit2,
  FormInput,
  Layout,
  MoreVertical,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import Can from "../shared/Can";
import PipelineModal from "./PipelineModal";

const PipelineBoard: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingFunnel, setEditingFunnel] = useState<KanbanFunnel | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: funnelsResult,
    isLoading,
    isFetching,
    refetch,
  } = useGetFunnelsQuery({
    page,
    limit,
    search: debouncedSearch,
    funnelType: activeTab,
    sort_by: "createdAt",
    sort_order: "DESC",
  });

  const [createFunnel, { isLoading: isCreating }] = useCreateFunnelMutation();
  const [updateFunnel, { isLoading: isUpdating }] = useUpdateFunnelMutation();
  const [deleteFunnel, { isLoading: isDeleting }] = useDeleteFunnelMutation();

  const funnels = funnelsResult?.data || [];
  const totalCount = funnelsResult?.pagination?.totalFunnels || 0;

  const handleSave = async (data: Partial<KanbanFunnel>) => {
    try {
      if (editingFunnel) {
        await updateFunnel({ id: editingFunnel._id, ...data }).unwrap();
        toast.success(t("pipeline_updated_success"));
      } else {
        await createFunnel(data).unwrap();
        toast.success(t("pipeline_created_success"));
      }
      setModalOpen(false);
      setEditingFunnel(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save pipeline");
      throw error; // Re-throw so PipelineModal's onSubmit knows it failed
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteFunnel(deleteId).unwrap();
        toast.success(t("pipeline_deleted_success"));
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete pipeline");
      }
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "contact":
        return <Contact size={14} />;
      case "form_submission":
        return <FormInput size={14} />;
      case "agent":
        return <User size={14} />;
      default:
        return <Layout size={14} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "contact":
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
      case "form_submission":
        return "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400";
      case "agent":
        return "bg-[var(--primary-opacity-20)] text-primary-dark dark:bg-primary/10 dark:text-primary";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400";
    }
  };

  const { isFeatureEnabled } = useFeatureAccess();

  const filteredTabItems = useMemo(() => {
    return tabItems.filter((tab) => {
      if (tab.id === "agent") {
        return isFeatureEnabled("staff");
      }
      return true;
    });
  }, [isFeatureEnabled]);

  useEffect(() => {
    if (!isFeatureEnabled("staff") && activeTab === "agent") {
      setActiveTab("all");
    }
  }, [isFeatureEnabled, activeTab]);

  return (
    <div className="sm:p-8 p-4 space-y-6 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) min-h-screen">
      <CommonHeader
        title={t("pipeline_board")}
        description={t("manage_your_automated_funnels")}
        onSearch={setSearchTerm}
        searchTerm={searchTerm}
        searchPlaceholder={t("search_pipelines")}
        onRefresh={refetch}
        onAddClick={() => {
          setEditingFunnel(null);
          setModalOpen(true);
        }}
        addLabel={t("add_new_pipeline")}
        isLoading={isLoading}
        addPermission="create.kanban_funnel"
        deletePermission="delete.kanban_funnel"
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs className="w-full sm:w-auto overflow-hidden">
          <TabsList className="bg-white w-full justify-start overflow-x-auto overflow-y-hidden table-custom-scrollbar dark:bg-(--card-color) border border-slate-200 dark:border-(--card-border-color) h-11 p-1 flex-nowrap flex">
            {filteredTabItems.map((tab) => (
              <TabsTrigger
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={cn(
                  "capitalize px-4 py-1.5 h-full rounded-md text-sm font-medium transition-all shrink-0",
                  activeTab === tab.id
                    ? "bg-slate-100 dark:hover:bg-(--table-hover)! dark:bg-(--page-body-bg) hover:bg-slate-100 text-primary shadow-sm"
                    : "text-slate-500 bg-[unset]! hover:text-slate-700 dark:text-slate-400",
                )}
              >
                {t(tab.tKey)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="hidden sm:block text-sm text-slate-500 font-medium">
          {t("showing")}{" "}
          <span className="text-slate-900 dark:text-white">
            {funnels.length}
          </span>{" "}
          {t("of")}{" "}
          <span className="text-slate-900 dark:text-white">{totalCount}</span>{" "}
          {t("pipelines")}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-(--card-color) rounded-2xl p-6 border border-slate-100 dark:border-(--card-border-color) space-y-4"
            >
              <div className="flex justify-between items-start">
                <Skeleton className="w-10 h-10 rounded-xl" />
                <Skeleton className="w-8 h-8 rounded-full" />
              </div>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="pt-4 flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : funnels.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-(--card-color) rounded-3xl border border-dashed border-slate-200 dark:border-(--card-border-color)">
          <div className="p-4 bg-slate-50 dark:bg-(--page-body-bg) rounded-full mb-4">
            <Layout className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {t("no_pipelines_found")}
          </h3>
          <p className="text-slate-500 mt-1 max-w-xs text-center">
            {t("start_by_creating_your_first_automated_pipeline_board")}
          </p>
          <Button
            className="mt-6 bg-primary hover:bg-primary/90 text-white px-6 rounded-xl shadow-lg shadow-primary/20"
            onClick={() => {
              setEditingFunnel(null);
              setModalOpen(true);
            }}
          >
            {t("create_first_pipeline")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {funnels.map((funnel: KanbanFunnel) => (
            <div
              key={funnel._id}
              className="group bg-white dark:bg-(--card-color) rounded-lg sm:p-6 p-4 border border-slate-100 dark:border-(--card-border-color) transition-all shadow hover:shadow-lg hover:shadow-slate-200/40 dark:hover:shadow-none space-y-4 relative"
            >
              <div className="flex justify-between items-start">
                <div
                  className={cn(
                    "p-3 rounded-lg shadow-sm",
                    getTypeColor(funnel.funnelType),
                  )}
                >
                  {getTypeIcon(funnel.funnelType)}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                    >
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-40 p-1.5 rounded-lg border-slate-200 dark:border-(--card-border-color)"
                  >
                    <Can permission="update.kanban_funnel">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/pipeline_board/${funnel._id}`)
                        }
                        className="rounded-lg gap-2 cursor-pointer font-bold text-primary focus:text-primary focus:bg-primary/5"
                      >
                        <Layout size={14} />
                        <span>{t("manage")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setEditingFunnel(funnel);
                          setModalOpen(true);
                        }}
                        className="rounded-lg gap-2 cursor-pointer"
                      >
                        <Edit2 size={14} />
                        <span>{t("edit")}</span>
                      </DropdownMenuItem>
                    </Can>
                    <Can permission="delete.kanban_funnel">
                      <DropdownMenuItem
                        onClick={() => setDeleteId(funnel._id)}
                        className="rounded-lg gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                      >
                        <Trash2 size={14} className="text-red-600" />
                        <span>{t("delete")}</span>
                      </DropdownMenuItem>
                    </Can>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors">
                  {funnel.name}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 ">
                  {funnel.description || t("no_description_provided")}
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="rounded-lg px-2.5 py-1 dark:hover:bg-(--table-hover) bg-slate-100 dark:bg-(--page-body-bg) text-slate-600 dark:text-slate-400 border-none font-medium text-[11px]"
                >
                  {funnel.stages?.length || 0} {t("stages")}
                </Badge>
                <div
                  className={cn(
                    "inline-flex items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize",
                    getTypeColor(funnel.funnelType),
                  )}
                >
                  {funnel.funnelType.replace("_", " ")}
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-500 pt-2 flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-(--page-body-bg)" />
                {t("created_at")}:{" "}
                {new Date(funnel.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalCount > limit && (
        <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) shadow overflow-hidden mt-8">
          <Pagination
            totalCount={totalCount}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            isLoading={isLoading || isFetching}
            total={totalCount}
          />
        </div>
      )}

      <PipelineModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingFunnel(null);
        }}
        onSave={handleSave}
        funnel={editingFunnel}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title={t("delete_pipeline")}
        subtitle={t(
          "are_you_sure_you_want_to_delete_this_pipeline_this_action_cannot_be_undone",
        )}
        confirmText={t("delete")}
        variant="danger"
      />
    </div>
  );
};

export default PipelineBoard;
