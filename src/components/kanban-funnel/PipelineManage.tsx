/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import {
  ArrowLeft,
  Edit2,
  GripVertical,
  Layout,
  MoreVertical,
  PanelRight,
  Plus,
  PlusCircle,
  RefreshCw,
  SearchIcon,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/elements/ui/dropdown-menu";
import { Input } from "@/src/elements/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/src/elements/ui/tabs";
import {
  useDeleteFunnelItemMutation,
  useGetAvailableDataQuery,
  useGetFunnelByIdQuery,
  useGetFunnelItemsQuery,
  useMoveFunnelItemMutation,
  useSyncStagesMutation,
  useUpdateFunnelItemMutation,
} from "@/src/redux/api/kanbanFunnelApi";
import { toast } from "sonner";
import ItemModal from "./ItemModal";

import { Skeleton } from "@/src/elements/ui/skeleton";
import { cn } from "@/src/lib/utils";
import ConfirmModal from "@/src/shared/ConfirmModal";
import {
  KanbanFunnel,
  KanbanStage,
  PipelineManageProps,
} from "@/src/types/kanban-funnel";
import Can from "../shared/Can";
import StageModal from "./StageModal";

const PipelineManage: React.FC<PipelineManageProps> = ({ id }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [sidebarTab, setSidebarTab] = useState<"available" | "archived">(
    "available",
  );
  const [sidebarSearch, setSidebarSearch] = useState("");

  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<Partial<KanbanStage> | null>(
    null,
  );
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [stageToDelete, setStageToDelete] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  const [isSyncingInProgress, setIsSyncingInProgress] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Local state for immediate UI feedback
  const [localStages, setLocalStages] = useState<any[]>([]);
  const [localAvailable, setLocalAvailable] = useState<any[]>([]);
  const [localArchived, setLocalArchived] = useState<any[]>([]);
  const [isDraggingLocal, setIsDraggingLocal] = useState(false);

  const [itemModalOpen, setItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isConfirmDeleteItemOpen, setIsConfirmDeleteItemOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { data: funnelResult, isLoading: funnelLoading } =
    useGetFunnelByIdQuery(id);
  const {
    data: itemsResult,
    isLoading: itemsLoading,
    isFetching: itemsFetching,
    refetch: refetchItems,
  } = useGetFunnelItemsQuery({ id });
  const { data: availableResult, isLoading: availableLoading } =
    useGetAvailableDataQuery(id);

  const [syncStages, { isLoading: isSyncing }] = useSyncStagesMutation();
  const [addItemToStage, { isLoading: isMoving }] = useMoveFunnelItemMutation();
  const [updateItem, { isLoading: isUpdatingItem }] =
    useUpdateFunnelItemMutation();
  const [deleteItem, { isLoading: isDeletingItem }] =
    useDeleteFunnelItemMutation();

  const funnel = funnelResult?.data as KanbanFunnel;
  const stagesWithItems = useMemo(
    () => itemsResult?.data?.stages || [],
    [itemsResult?.data?.stages],
  );
  const availableData = useMemo(
    () => availableResult?.data?.available || [],
    [availableResult?.data?.available],
  );
  const archivedItems = useMemo(
    () => availableResult?.data?.archived || [],
    [availableResult?.data?.archived],
  );

  // Sync control: Clear syncing state only when items refetching settles
  useEffect(() => {
    if (
      isSyncingInProgress &&
      !itemsFetching &&
      !isMoving &&
      !isUpdatingItem &&
      !isDeletingItem &&
      !isSyncing
    ) {
      setIsSyncingInProgress(false);
    }
  }, [
    itemsFetching,
    isMoving,
    isUpdatingItem,
    isDeletingItem,
    isSyncing,
    isSyncingInProgress,
  ]);

  // Sync local state with API data when it changes
  useEffect(() => {
    if (
      !isDraggingLocal &&
      !isMoving &&
      !itemsFetching &&
      !isSyncingInProgress &&
      !isSyncing
    ) {
      setLocalStages(stagesWithItems);
      setLocalAvailable(availableData);
      setLocalArchived(archivedItems);
    }
  }, [
    stagesWithItems,
    availableData,
    archivedItems,
    isDraggingLocal,
    isMoving,
    itemsFetching,
    isSyncingInProgress,
    isSyncing,
  ]);

  const handleAddStage = () => {
    setEditingStage(null);
    setStageModalOpen(true);
  };

  const handleEditStage = (stage: KanbanStage) => {
    setEditingStage(stage);
    setStageModalOpen(true);
  };

  const handleSaveStage = async (data: {
    _id?: string;
    name: string;
    color: string;
  }) => {
    try {
      let newStages = [...(funnel?.stages || [])].map((s) => ({ ...s }));

      if (data._id) {
        newStages = newStages.map((s) =>
          s._id === data._id ? { ...s, name: data.name, color: data.color } : s,
        );
      } else {
        newStages.push({
          name: data.name,
          color: data.color,
          order: newStages.length + 1,
        });
      }

      await syncStages({ id, stages: newStages }).unwrap();
      toast.success(
        data._id ? t("stage_updated_success") : t("stage_created_success"),
      );
      setStageModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save stage");
    }
  };

  const handleDeleteStage = (stageId: string) => {
    setStageToDelete(stageId);
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteStage = async () => {
    if (!stageToDelete) return;
    setIsSyncingInProgress(true);
    try {
      const newStages = funnel.stages.filter((s) => s._id !== stageToDelete);
      await syncStages({ id, stages: newStages }).unwrap();
      toast.success(t("stage_deleted_success"));
    } catch (error: any) {
      setIsSyncingInProgress(false);
      toast.error(error?.data?.message || "Failed to delete stage");
    } finally {
      setIsConfirmDeleteOpen(false);
      setStageToDelete(null);
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setItemModalOpen(true);
  };

  const handleSaveItem = async (data: {
    priority: string;
    isArchived: boolean;
  }) => {
    if (!editingItem) return;
    setIsSyncingInProgress(true);
    try {
      await updateItem({
        id,
        itemId: editingItem._id,
        ...data,
      }).unwrap();
      toast.success(t("item_updated_successfully"));
      setItemModalOpen(false);
    } catch (error: any) {
      setIsSyncingInProgress(false);
      toast.error(error?.data?.message || "Failed to update item");
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItemToDelete(itemId);
    setIsConfirmDeleteItemOpen(true);
  };

  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete) return;
    setIsSyncingInProgress(true);
    try {
      await deleteItem({ id, itemId: itemToDelete }).unwrap();
      toast.success(t("item_deleted_successfully"));
    } catch (error: any) {
      setIsSyncingInProgress(false);
      toast.error(error?.data?.message || "Failed to delete item");
    } finally {
      setIsConfirmDeleteItemOpen(false);
      setItemToDelete(null);
    }
  };

  const handleAddItem = async (globalItemId: string) => {
    if (!localStages || localStages.length === 0) {
      toast.error(t("please_add_at_least_one_stage_first"));
      return;
    }

    const prevStages = [...localStages];
    const prevAvailable = [...localAvailable];
    const prevArchived = [...localArchived];

    setIsSyncingInProgress(true);
    setIsDraggingLocal(true);

    try {
      const firstStageId = localStages[0]._id;

      let itemToAdd: any = null;
      const newAvailable = [...localAvailable];
      const newArchived = [...localArchived];

      const avIndex = newAvailable.findIndex((i) => i._id === globalItemId);
      if (avIndex !== -1) {
        [itemToAdd] = newAvailable.splice(avIndex, 1);
      } else {
        const arcIndex = newArchived.findIndex((i) => i._id === globalItemId);
        if (arcIndex !== -1) [itemToAdd] = newArchived.splice(arcIndex, 1);
      }

      if (itemToAdd) {
        const newStages = [...localStages].map((s, idx) =>
          idx === 0
            ? { ...s, items: [...s.items, itemToAdd] }
            : { ...s, items: [...s.items] },
        );
        setLocalStages(newStages);
        setLocalAvailable(newAvailable);
        setLocalArchived(newArchived);
      }

      await addItemToStage({
        id,
        globalItemId,
        toStageId: firstStageId,
        position: localStages[0].items?.length || 0,
      }).unwrap();

      toast.success(t("item_added_to_pipeline_successfully"));
      setTimeout(() => setIsDraggingLocal(false), 500);
    } catch (error: any) {
      setLocalStages(prevStages);
      setLocalAvailable(prevAvailable);
      setLocalArchived(prevArchived);
      setIsDraggingLocal(false);
      setIsSyncingInProgress(false);
      toast.error(error?.data?.message || "Failed to add item");
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    setIsSyncingInProgress(true);
    setIsDraggingLocal(true);

    const prevStages = [...localStages];
    const prevAvailable = [...localAvailable];
    const prevArchived = [...localArchived];

    try {
      // Handle STAGE reordering
      if (type === "STAGE") {
        const newStages = Array.from(localStages);
        const [reorderedStage] = newStages.splice(source.index, 1);
        newStages.splice(destination.index, 0, reorderedStage);

        const updatedStages = newStages.map((s, idx) => ({
          ...s,
          order: idx + 1,
        }));

        setLocalStages(updatedStages);
        await syncStages({ id, stages: updatedStages }).unwrap();
        toast.success(t("stages_reordered_success"));
        setTimeout(() => setIsDraggingLocal(false), 500);
        return;
      }

      // Handle ITEM movement
      let movedItem: any = null;
      const newStages = [...localStages].map((s) => ({
        ...s,
        items: [...(s.items || [])],
      }));
      let newAvailable = [...localAvailable];
      let newArchived = [...localArchived];

      if (source.droppableId === "sidebar") {
        const list = sidebarTab === "available" ? newAvailable : newArchived;
        const index = list.findIndex((i) => i._id === draggableId);
        if (index !== -1) {
          [movedItem] = list.splice(index, 1);
        }
        if (sidebarTab === "available") newAvailable = [...list];
        else newArchived = [...list];
      } else {
        const sourceStage = newStages.find((s) => s._id === source.droppableId);
        if (sourceStage) {
          [movedItem] = sourceStage.items.splice(source.index, 1);
        }
      }

      if (!movedItem) {
        setIsDraggingLocal(false);
        setIsSyncingInProgress(false);
        return;
      }

      const destStage = newStages.find(
        (s) => s._id === destination.droppableId,
      );
      if (destStage) {
        if (!destStage.items) destStage.items = [];
        destStage.items.splice(destination.index, 0, movedItem);
      }

      setLocalStages(newStages);
      setLocalAvailable(newAvailable);
      setLocalArchived(newArchived);

      const payload: any = {
        id,
        toStageId: destination.droppableId,
        position: destination.index,
      };

      if (source.droppableId === "sidebar") {
        payload.globalItemId = draggableId;
      } else {
        payload.itemId = draggableId;
      }

      await addItemToStage(payload).unwrap();
      toast.success(
        source.droppableId === "sidebar"
          ? t("item_added_successfully")
          : t("item_moved_successfully"),
      );
      setTimeout(() => setIsDraggingLocal(false), 500);
    } catch (error: any) {
      setLocalStages(prevStages);
      setLocalAvailable(prevAvailable);
      setLocalArchived(prevArchived);
      setIsDraggingLocal(false);
      setIsSyncingInProgress(false);
      toast.error(error?.data?.message || "Failed to move");
    }
  };

  const currentSidebarList =
    sidebarTab === "available" ? localAvailable : localArchived;

  const filteredSidebarData = currentSidebarList.filter(
    (item: any) =>
      item.title?.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(sidebarSearch.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-(--dark-body) overflow-hidden">
      <header className="bg-white flex-wrap gap-3 dark:bg-(--card-color) border-b border-slate-200 dark:border-(--card-border-color) px-6 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-4 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="truncate max-w-37.5 sm:max-w-75 md:max-w-125">
                {funnelLoading ? (
                  <Skeleton className="h-6 w-32" />
                ) : (
                  funnel?.name
                )}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant="secondary"
                  className="text-[10px] uppercase tracking-wider bg-slate-100 dark:bg-(--dark-body) dark:text-gray-400 text-slate-500 border-none shrink-0"
                >
                  {funnel?.funnelType?.replace("_", " ")}
                </Badge>
                {funnel?.stages?.length > 0 && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold border-slate-200 dark:border-(--card-border-color) text-slate-400 shrink-0"
                  >
                    {funnel.stages.length} {t("stages")}
                  </Badge>
                )}
              </div>
            </h1>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-62.5 sm:max-w-112.5 md:max-w-175">
              {funnelLoading ? (
                <Skeleton className="h-4 w-48" />
              ) : (
                funnel?.description
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchItems()}
            className="rounded-lg h-10 border-slate-200 dark:border-(--card-border-color)"
          >
            <RefreshCw
              size={16}
              className={cn((itemsLoading || itemsFetching) && "animate-spin")}
            />
            <span className="ml-2 hidden sm:inline">{t("refresh")}</span>
          </Button>
          <Can permission="update.kanban_funnel">
            <Button
              onClick={handleAddStage}
              className="bg-primary text-white hover:bg-primary/90 h-10 px-4 rounded-lg"
            >
              <Plus size={18} />
              <span>{t("add_stage")}</span>
            </Button>
          </Can>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={cn(
              "h-10 w-10 rounded-lg border-slate-200 dark:border-slate-800 min-[1481px]:hidden",
              isSidebarOpen &&
                "bg-primary text-white border-primary hover:bg-primary/90",
            )}
          >
            <PanelRight size={18} />
          </Button>
        </div>
      </header>

      {!hasMounted ? null : (
        <DragDropContext
          onDragStart={() => setIsDraggingLocal(true)}
          onDragEnd={onDragEnd}
        >
          <div className="flex-1 flex overflow-hidden relative">
            {/* Syncing Overlay */}
            {isSyncingInProgress && (
              <div className="absolute inset-0 bg-white/40 dark:bg-(--card-color) backdrop-blur-[1px] z-50 flex items-center justify-center transition-all animate-in fade-in duration-300">
                <div className="bg-white dark:bg-(--card-color) sm:p-6 p-4 rounded-lg shadow-xl flex flex-col items-center gap-4 border border-slate-100 dark:border-(--card-border-color) max-w-xs text-center scale-100 animate-in zoom-in duration-300">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-800 dark:text-white tracking-widest">
                      {t("syncing")}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Please wait while we update the board...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Main Board */}
            <main className="flex-1 overflow-x-auto overflow-y-hidden sm:p-6 p-4 table-custom-scrollbar">
              <Droppable
                droppableId="board"
                type="STAGE"
                direction="horizontal"
              >
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex h-full gap-6 min-w-max"
                  >
                    {itemsLoading && localStages.length === 0 ? (
                      [...Array(4)].map((_, i) => (
                        <div key={i} className="w-80 flex flex-col gap-4">
                          <Skeleton className="h-12 w-full rounded-xl" />
                          <Skeleton className="flex-1 rounded-2xl" />
                        </div>
                      ))
                    ) : Array.isArray(localStages) && localStages.length > 0 ? (
                      <>
                        {localStages.map((stage: any, stageIndex: number) => (
                          <Draggable
                            key={stage._id}
                            draggableId={stage._id}
                            index={stageIndex}
                          >
                            {(provided, snapshot) => (
                              <div
                                {...provided.draggableProps}
                                style={
                                  provided.draggableProps
                                    .style as React.CSSProperties
                                }
                                ref={provided.innerRef}
                                className={cn(
                                  "w-80 flex flex-col rounded-lg bg-white/70 dark:bg-(--card-color) border border-slate-200/60 dark:border-(--card-border-color) group shadow-sm hover:shadow-md transition-shadow h-full",
                                  snapshot.isDragging
                                    ? "shadow-2xl ring-2 ring-primary/20 bg-white dark:bg-(--card-color) border-primary/20 scale-[1.02]"
                                    : "",
                                )}
                              >
                                <div
                                  {...provided.dragHandleProps}
                                  className="p-4 flex items-center justify-between rounded-t-lg border-b border-slate-100 dark:border-(--card-border-color) bg-slate-50/30 dark:bg-(--page-body-bg) cursor-grab active:cursor-grabbing"
                                  style={{
                                    borderTop: `4px solid ${stage.color}`,
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                      {stage.name}
                                    </h3>
                                    <Badge
                                      variant="secondary"
                                      className="rounded-full px-2 py-0 h-5 text-[10px] bg-white dark:bg-(--dark-body) text-slate-500 border-none shadow-sm"
                                    >
                                      {stage.items?.length || 0}
                                    </Badge>
                                  </div>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-lg"
                                      >
                                        <MoreVertical size={14} />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                      align="end"
                                      className="w-40 rounded-xl"
                                    >
                                      <DropdownMenuItem
                                        onClick={() => handleEditStage(stage)}
                                        className="gap-2 rounded-lg cursor-pointer"
                                      >
                                        <Edit2 size={14} />
                                        <span>{t("edit_stage")}</span>
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleDeleteStage(stage._id)
                                        }
                                        className="gap-2 rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                                      >
                                        <Trash2 size={14} />
                                        <span>{t("delete_stage")}</span>
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>

                                <Droppable droppableId={stage._id} type="ITEM">
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.droppableProps}
                                      className={cn(
                                        "flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar transition-colors min-h-37.5",
                                        snapshot.isDraggingOver
                                          ? "bg-primary/5 dark:bg-(--page-body-bg)"
                                          : "",
                                      )}
                                    >
                                      {stage.items?.length === 0 &&
                                      !snapshot.isDraggingOver ? (
                                        <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-(--input-border-color) dark:border-(--card-border-color) rounded-lg bg-slate-50/20 dark:bg-(--table-hover)">
                                          <div className="p-2 bg-slate-50 dark:bg-(--dark-body) rounded-full mb-2">
                                            <Layout
                                              size={20}
                                              className="text-slate-300"
                                            />
                                          </div>
                                          <p className="text-[12px] text-slate-400 font-bold">
                                            {t("no_items")}
                                          </p>
                                        </div>
                                      ) : (
                                        stage.items.map(
                                          (item: any, index: number) => (
                                            <Draggable
                                              key={item._id}
                                              draggableId={item._id}
                                              index={index}
                                            >
                                              {(provided, snapshot) => {
                                                const child = (
                                                  <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={cn(
                                                      "bg-white dark:bg-(--page-body-bg) p-4 rounded-lg border border-slate-100 dark:border-(--card-border-color) shadow-sm hover:shadow-md hover:border-primary/30 dark:hover:border-primary/40 transition-all group/item cursor-pointer relative",
                                                      snapshot.isDragging
                                                        ? "shadow-2xl ring-2 ring-primary/20 scale-105 z-9999 bg-white dark:bg-(--page-body-bg) shadow-primary/10"
                                                        : "",
                                                    )}
                                                    style={{
                                                      ...provided.draggableProps
                                                        .style,
                                                      zIndex:
                                                        snapshot.isDragging
                                                          ? 9999
                                                          : undefined,
                                                    }}
                                                  >
                                                    <div className="flex justify-between items-start gap-2 mb-2">
                                                      <div className="flex-1 flex items-center gap-2 min-w-0">
                                                        <GripVertical
                                                          size={15}
                                                          className="text-slate-400 shrink-0"
                                                        />
                                                        <div className="flex flex-col">
                                                          <h4 className="text-[13px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                                                            {item.title}
                                                          </h4>
                                                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                                            {item.subtitle}
                                                          </p>
                                                        </div>
                                                      </div>
                                                      <div className="flex items-end gap-1">
                                                        <DropdownMenu>
                                                          <DropdownMenuTrigger
                                                            asChild
                                                          >
                                                            <Button
                                                              variant="ghost"
                                                              size="icon"
                                                              className="h-6 w-6 rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                            >
                                                              <MoreVertical
                                                                size={14}
                                                              />
                                                            </Button>
                                                          </DropdownMenuTrigger>
                                                          <DropdownMenuContent
                                                            align="end"
                                                            className="w-32 rounded-xl"
                                                          >
                                                            <DropdownMenuItem
                                                              onClick={() =>
                                                                handleEditItem(
                                                                  item,
                                                                )
                                                              }
                                                              className="gap-2 rounded-lg cursor-pointer"
                                                            >
                                                              <Edit2
                                                                size={14}
                                                              />
                                                              <span>
                                                                {t("edit")}
                                                              </span>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                              onClick={() =>
                                                                handleDeleteItem(
                                                                  item._id,
                                                                )
                                                              }
                                                              className="gap-2 rounded-lg text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                                                            >
                                                              <Trash2
                                                                size={14}
                                                              />
                                                              <span>
                                                                {t("delete")}
                                                              </span>
                                                            </DropdownMenuItem>
                                                          </DropdownMenuContent>
                                                        </DropdownMenu>
                                                      </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                                      {item.label && (
                                                        <Badge className="text-[9px] h-4.5 px-2 bg-slate-100 dark:bg-(--dark-body) text-slate-600 dark:text-slate-400 border-none rounded-full font-medium">
                                                          {item.label}
                                                        </Badge>
                                                      )}
                                                      {item.priority && (
                                                        <div
                                                          className={cn(
                                                            "text-[9px] h-4.5 px-2 flex items-center rounded-full font-bold uppercase tracking-wider",
                                                            item.priority ===
                                                              "high"
                                                              ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                                                              : item.priority ===
                                                                  "medium"
                                                                ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                                                                : "bg-light-primary text-primary dark:bg-primary-darker/30 dark:text-primary",
                                                          )}
                                                        >
                                                          <span
                                                            className={cn(
                                                              "w-1 h-1 rounded-full mr-1.5",
                                                              item.priority ===
                                                                "high"
                                                                ? "bg-red-500"
                                                                : item.priority ===
                                                                    "medium"
                                                                  ? "bg-amber-500"
                                                                  : "bg-primary",
                                                            )}
                                                          />
                                                          {item.priority}
                                                        </div>
                                                      )}
                                                    </div>

                                                    {item.extra &&
                                                      Object.keys(item.extra)
                                                        .length > 0 && (
                                                        <div className="mt-3 pt-3 border-t border-slate-50 dark:border-(--card-border-color) space-y-1.5">
                                                          {Object.entries(
                                                            item.extra,
                                                          ).map(
                                                            ([key, value]) => {
                                                              if (
                                                                !value ||
                                                                (typeof value !==
                                                                  "string" &&
                                                                  typeof value !==
                                                                    "number")
                                                              )
                                                                return null;
                                                              return (
                                                                <div
                                                                  key={key}
                                                                  className="flex items-center gap-2 overflow-hidden"
                                                                >
                                                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter shrink-0 w-16">
                                                                    {key
                                                                      .replace(
                                                                        /([A-Z])/g,
                                                                        " $1",
                                                                      )
                                                                      .replace(
                                                                        "_",
                                                                        " ",
                                                                      )}
                                                                    :
                                                                  </span>
                                                                  <span className="text-[10px] text-slate-600 dark:text-slate-300 truncate font-medium">
                                                                    {String(
                                                                      value,
                                                                    )}
                                                                  </span>
                                                                </div>
                                                              );
                                                            },
                                                          )}
                                                        </div>
                                                      )}

                                                    {item.lastActivity && (
                                                      <div className="mt-4 pt-3 border-t border-slate-50 dark:border-(--card-border-color) text-[10px] text-slate-400 flex items-center gap-1.5 italic">
                                                        <RefreshCw
                                                          size={10}
                                                          className="text-slate-300"
                                                        />
                                                        <span>
                                                          {
                                                            item.lastActivity
                                                              .action
                                                          }{" "}
                                                          •{" "}
                                                          {new Date(
                                                            item.lastActivity
                                                              .timestamp,
                                                          ).toLocaleDateString()}
                                                        </span>
                                                      </div>
                                                    )}
                                                  </div>
                                                );

                                                if (
                                                  snapshot.isDragging &&
                                                  typeof document !==
                                                    "undefined"
                                                ) {
                                                  return createPortal(
                                                    child,
                                                    document.body,
                                                  );
                                                }
                                                return child;
                                              }}
                                            </Draggable>
                                          ),
                                        )
                                      )}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-(--card-color) rounded-lg border border-dashed border-slate-200 dark:border-(--card-border-color) mx-auto max-w-lg h-60 mt-12">
                        <div className="p-4 bg-slate-100 dark:bg-(--page-body-bg) rounded-lg mb-4">
                          <Layout size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          {t("no_stages_found")}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center max-w-50">
                          {t("start_by_adding_your_first_pipeline_stage")}
                        </p>
                        <Button
                          onClick={handleAddStage}
                          className="mt-6 bg-primary text-white h-10 px-6 rounded-lg shadow-lg shadow-primary/20"
                        >
                          <Plus size={18} />
                          {t("add_stage")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </main>

            {/* Right Sidebar */}
            <aside
              className={cn(
                "w-80 bg-white dark:bg-(--card-color) border-l border-slate-200 dark:border-(--card-border-color) flex flex-col z-50 shadow-[-4px_0_15px_rgba(0,0,0,0.02)] transition-all duration-300",
                "max-[1480px]:absolute max-[1480px]:top-0 max-[1480px]:right-0 max-[1480px]:h-full",
                "min-[1481px]:relative min-[1481px]:translate-x-0",
                !isSidebarOpen && "max-[1480px]:translate-x-full",
              )}
            >
              <div className="p-4 border-b border-slate-100 dark:border-(--card-border-color) flex items-center justify-between">
                <h2 className="font-bold text-slate-900 dark:text-white text-sm">
                  {t("data_list")}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="min-[1481px]:hidden h-8 w-8 rounded-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Plus className="rotate-45" size={18} />
                </Button>
              </div>
              <div className="p-4 pt-0">
                <div className="relative group mt-4">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder={t("search_items")}
                    value={sidebarSearch}
                    onChange={(e) => setSidebarSearch(e.target.value)}
                    className="h-10 pl-9 bg-slate-50 dark:bg-(--page-body-bg) border-none focus:ring-2 focus:ring-primary/20 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="px-4 py-3">
                  <Tabs className="w-full">
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/50 hover:bg-slate-100/50! dark:bg-(--page-body-bg)! dark:hover:bg-(--page-body-bg)! rounded-lg h-11">
                      <TabsTrigger
                        active={sidebarTab === "available"}
                        onClick={() => setSidebarTab("available")}
                        className={cn(
                          "rounded-md text-[11px] font-bold transition-all",
                          sidebarTab === "available"
                            ? "bg-primary dark:bg-primary hover:bg-primary! text-white dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 bg-[unset]! hover:bg-[unset]! dark:hover:text-slate-200",
                        )}
                      >
                        {t("all")}
                      </TabsTrigger>
                      <TabsTrigger
                        active={sidebarTab === "archived"}
                        onClick={() => setSidebarTab("archived")}
                        className={cn(
                          "rounded-md text-[11px] font-bold transition-all",
                          sidebarTab === "archived"
                            ? "bg-primary dark:bg-primary hover:bg-primary! text-white dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 bg-[unset]! hover:bg-[unset]! dark:hover:text-slate-200",
                        )}
                      >
                        {t("archive")}
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <Droppable
                  droppableId="sidebar"
                  type="ITEM"
                  isDropDisabled={true}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto p-4 pt-0 space-y-3 custom-scrollbar"
                    >
                      {availableLoading && localAvailable.length === 0 ? (
                        [...Array(6)].map((_, i) => (
                          <Skeleton
                            key={i}
                            className="h-16 w-full rounded-xl"
                          />
                        ))
                      ) : filteredSidebarData.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center">
                          <Layout className="w-8 h-8 text-slate-200 mb-2" />
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                            {t("no_data_found")}
                          </p>
                        </div>
                      ) : (
                        filteredSidebarData.map((item: any, index: number) => (
                          <Draggable
                            key={item._id}
                            draggableId={item._id}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              const usePortal = snapshot.isDragging;
                              const child = (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => handleAddItem(item._id)}
                                  className={cn(
                                    "group relative bg-white dark:bg-(--page-body-bg) p-3 rounded-lg border border-slate-100 dark:border-(--card-border-color) hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer shadow-sm active:scale-95",
                                    snapshot.isDragging
                                      ? "shadow-2xl ring-2 ring-primary/20 scale-105 z-9999 bg-white dark:bg-slate-900 shadow-primary/10"
                                      : "",
                                  )}
                                  style={{
                                    ...provided.draggableProps.style,
                                    // When in portal, ensure it stays above everything
                                    zIndex: snapshot.isDragging
                                      ? 9999
                                      : undefined,
                                  }}
                                >
                                  <div className="flex-1 min-w-0 pr-6">
                                    <h4 className="text-[12px] font-bold text-slate-800 dark:text-slate-200 truncate">
                                      {item.title}
                                    </h4>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                      {item.subtitle}
                                    </p>
                                  </div>
                                  <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlusCircle
                                      size={14}
                                      className="text-primary"
                                    />
                                  </div>
                                </div>
                              );

                              if (
                                usePortal &&
                                typeof document !== "undefined"
                              ) {
                                return createPortal(child, document.body);
                              }

                              return child;
                            }}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-(--page-body-bg) border-t border-slate-100 dark:border-(--card-border-color)">
                <p className="text-[10px] text-slate-400 text-center">
                  {t("drag_items_to_board")}
                </p>
              </div>
            </aside>
          </div>
        </DragDropContext>
      )}

      <StageModal
        isOpen={stageModalOpen}
        onClose={() => setStageModalOpen(false)}
        onSave={handleSaveStage}
        stage={editingStage}
        isLoading={isSyncing}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDeleteStage}
        isLoading={isSyncing}
        title={t("delete_stage")}
        subtitle={t("are_you_sure_you_want_to_delete_this_stage")}
        confirmText={t("delete")}
        variant="danger"
      />

      <ItemModal
        key={editingItem?._id || "item-modal"}
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSave={handleSaveItem}
        item={editingItem}
        isLoading={isUpdatingItem}
      />

      <ConfirmModal
        isOpen={isConfirmDeleteItemOpen}
        onClose={() => setIsConfirmDeleteItemOpen(false)}
        onConfirm={handleConfirmDeleteItem}
        isLoading={isDeletingItem}
        title={t("delete_item")}
        subtitle={t("are_you_sure_you_want_to_delete_this_item")}
        confirmText={t("delete")}
        variant="danger"
      />
    </div>
  );
};

export default PipelineManage;
