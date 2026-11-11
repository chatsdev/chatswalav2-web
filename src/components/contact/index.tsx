/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { MultiSelect } from "@/src/elements/ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/elements/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { useContactImportSocket } from "@/src/hooks/useContactImportSocket";
import { useCreateContactMutation, useDeleteContactMutation, useGetContactQuery, useImportContactsMutation, useUpdateContactMutation } from "@/src/redux/api/contactApi";
import { useGetCustomFieldsQuery } from "@/src/redux/api/customFieldApi";
import { useBulkAddContactsToSegmentsMutation, useGetSegmentsQuery } from "@/src/redux/api/segmentApi";
import { useGetWabaPhoneNumbersQuery } from "@/src/redux/api/whatsappApi";
import { useAppSelector } from "@/src/redux/hooks";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import ExportModal from "@/src/shared/ExportModal";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/elements/ui/tooltip";
import WabaRequiredModal from "@/src/shared/WabaRequiredModal";
import { Contact, CustomField } from "@/src/types/components";
import { Column } from "@/src/types/shared";
import { cn, formatDate } from "@/src/utils";
import { exportToCSV, exportToExcel, exportToPrint } from "@/src/utils/exportUtils";
import { maskSensitiveData } from "@/src/utils/masking";
import { Edit2, Layers, LayoutTemplate, Loader2, SquareKanban, Trash2, UserCheck, UserX, Facebook, Instagram, MessageCircle, Filter, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import QuickChatSheet from "../chat/QuickChatSheet";
import Can from "../shared/Can";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import ContactImportModal from "./ContactImportModal";
import ContactModal from "./ContactModal";
import ContactKanbanActionModal from "./ContactKanbanActionModal";
import PlanFeature from "@/src/shared/PlanFeature";
import { CHANNELS } from "@/src/data/components";



const getSourceBadgeClass = (source: string) => {
  const src = source?.toLowerCase() || "";
  if (src === "whatsapp" || src === "baileys") {
    return "bg-[#25D366]/10 text-[#1eaf53] border-[#25D366]/20 dark:bg-[#25D366]/10 dark:text-[#25D366] dark:border-[#25D366]/30";
  }
  if (src === "telegram") {
    return "bg-[#229ED9]/10 text-[#1b7fae] border-[#229ED9]/20 dark:bg-[#229ED9]/10 dark:text-[#229ED9] dark:border-[#229ED9]/30";
  }
  if (src === "facebook") {
    return "bg-[#1877F2]/10 text-[#135fcf] border-[#1877F2]/20 dark:bg-[#1877F2]/10 dark:text-[#1877F2] dark:border-[#1877F2]/30";
  }
  if (src === "instagram") {
    return "bg-[#E1306C]/10 text-[#b42656] border-[#E1306C]/20 dark:bg-[#E1306C]/10 dark:text-[#E1306C] dark:border-[#E1306C]/30";
  }
  return "bg-slate-50 dark:bg-(--card-color) text-slate-600 dark:text-gray-400 border-slate-200 dark:border-(--card-border-color)";
};

const ContactPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { isFeatureEnabled, getEnabledChannels } = useFeatureAccess();
  const enabled = getEnabledChannels();

  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isUnsubscribed, setIsUnsubscribed] = useState<boolean | undefined>(undefined);
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const filteredChannels = useMemo(() => {
    return CHANNELS.filter((channel) => {
      if (channel.value === "all" || channel.value === "whatsapp") return true;
      if (channel.value === "telegram") return enabled.telegram;
      if (channel.value === "facebook") return enabled.facebook;
      if (channel.value === "instagram") return enabled.instagram;
      return true;
    });
  }, [enabled]);

  useEffect(() => {
    if (sourceFilter === "telegram" && !enabled.telegram) setSourceFilter("all");
    if (sourceFilter === "facebook" && !enabled.facebook) setSourceFilter("all");
    if (sourceFilter === "instagram" && !enabled.instagram) setSourceFilter("all");
  }, [sourceFilter, enabled]);

  const handleSourceChange = (value: string) => {
    setSourceFilter(value);
    setPage(1);
  };
  const { selectedWorkspace } = useAppSelector((state) => state.workspace);
  const selectedWabaId = selectedWorkspace?.waba_id;
  const { is_demo_mode } = useAppSelector((state) => state.setting);
  const importStatus = useAppSelector((state) => state.importProgress.status);

  const handleSortChange = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
    setPage(1);
  };

  const {
    data: contactsResult,
    isLoading,
    refetch,
    isFetching,
  } = useGetContactQuery({
    page,
    limit,
    search: searchTerm,
    sort_by: sortBy,
    sort_order: sortOrder,
    is_unsubscribed: isUnsubscribed,
    platform: sourceFilter !== "all" ? sourceFilter : undefined,
  });

  useContactImportSocket(refetch);

  const { data: customFieldsResult, isLoading: isFieldsLoading } = useGetCustomFieldsQuery({ page: 1, limit: 100 });
  const customFields: CustomField[] = useMemo(() => customFieldsResult?.data?.fields || [], [customFieldsResult]);

  const [createContact, { isLoading: isCreating }] = useCreateContactMutation();
  const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
  const [importContacts, { isLoading: isImporting }] = useImportContactsMutation();

  const { data: segmentsData } = useGetSegmentsQuery({ page: 1, limit: 100 });
  const segments = segmentsData?.data?.segments || [];
  const [bulkAddContactsToSegments, { isLoading: isBulkAdding }] = useBulkAddContactsToSegmentsMutation();
  const [selectedSegmentsForBulk, setSelectedSegmentsForBulk] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [quickChatContact, setQuickChatContact] = useState<Contact | null>(null);
  const [quickChatOpen, setQuickChatOpen] = useState(false);
  const [noWabaModalOpen, setNoWabaModalOpen] = useState(false);
  const [noWabaModalSource, setNoWabaModalSource] = useState<string>("whatsapp");
  const [kanbanContact, setKanbanContact] = useState<Contact | null>(null);
  const [kanbanModalOpen, setKanbanModalOpen] = useState(false);

  const { data: phoneNumbersData } = useGetWabaPhoneNumbersQuery(selectedWabaId || "", { skip: !selectedWabaId });
  const phoneNumberId = useMemo(() => {
    const list = (phoneNumbersData as any)?.data || [];
    return list.length > 0 ? String(list[0].id) : undefined;
  }, [phoneNumbersData]);

  const contacts: Contact[] = contactsResult?.data?.contacts || [];
  const totalCount = contactsResult?.data?.pagination?.totalItems || 0;

  const initialColumns = useMemo(
    () => [
      { id: "Name", label: "Name", isVisible: true },
      { id: "Phone", label: "Phone", isVisible: true },
      { id: "Source", label: "Source", isVisible: true },
      { id: "Tag", label: "Tag", isVisible: true },
      { id: "Segments", label: "Segments", isVisible: true },
      { id: "Email", label: "Email", isVisible: true },
      { id: "Status", label: "Status", isVisible: true },
      { id: "Assigned To", label: "Assigned To", isVisible: true },
      { id: "Created At", label: "Created At", isVisible: true },
      { id: "Actions", label: "Actions", isVisible: true },
    ],
    []
  );

  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  useEffect(() => {
    const visibleStaticColumns = initialColumns.filter((col) => {
      if (col.id === "Tag") return isFeatureEnabled("tags");
      if (col.id === "Segments") return isFeatureEnabled("segments");
      return true;
    });

    if (customFields.length > 0 && isFeatureEnabled("custom_fields")) {
      const dynamicColumns = customFields.map((field) => ({
        id: field.label,
        label: field.label,
        isVisible: true,
      }));

      const uniqueDynamicColumns = dynamicColumns.filter((dCol) => !visibleStaticColumns.some((iCol) => iCol.id === dCol.id));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleColumns([...visibleStaticColumns, ...uniqueDynamicColumns]);
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisibleColumns(visibleStaticColumns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customFieldsResult, isFeatureEnabled, initialColumns, customFields]);

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns((prev) => prev.map((col) => (col.id === columnId ? { ...col, isVisible: !col.isVisible } : col)));
  };

  const handleSave = async (data: Partial<Contact>) => {
    try {
      if (editingContact) {
        await updateContact({ id: editingContact._id, ...data }).unwrap();
        toast.success("Contact updated successfully");
      } else {
        await createContact(data).unwrap();
        toast.success("Contact created successfully");
      }
      setModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to save contact");
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      try {
        await deleteContact([deleteId]).unwrap();
        toast.success("Contact deleted successfully");
        setDeleteId(null);
      } catch (error: any) {
        toast.error(error?.data?.message || error?.data?.message || "Failed to delete contacts");
      }
    }
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setBulkConfirmOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await deleteContact(selectedIds).unwrap();
      toast.success(`${selectedIds.length} contacts deleted successfully`);
      setSelectedIds([]);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.message || "Failed to delete contacts");
    } finally {
      setBulkConfirmOpen(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleRefresh = () => {
    refetch();
    toast.success("Successfully refresh table.");
  };

  const handleExport = (type: "csv" | "excel" | "print") => {
    const selectedContacts = contacts.filter((c) => selectedIds.includes(c._id));
    if (selectedContacts.length === 0) {
      toast.error("Please select contacts to export");
      return;
    }

    const headers = visibleColumns.filter((col) => col.id !== "Actions").map((col) => col.label);

    const getRowData = (contact: Contact) => {
      return visibleColumns
        .filter((col) => col.id !== "Actions")
        .map((col) => {
          if (col.id === "Name") return contact.name;
          if (col.id === "Phone") return contact.phone_number;
          if (col.id === "Source") return contact.source;
          if (col.id === "Tag") return contact.tags?.map((t: any) => (t as any).label).join(", ") || "";
          if (col.id === "Segments") return contact.segments?.map((s: any) => s.name).join(", ") || "";
          if (col.id === "Email") return contact.email || "";
          if (col.id === "Status") return contact.status || "";
          if (col.id === "Assigned To") return contact.assigned_to || "";
          if (col.id === "Created At") return formatDate(contact.created_at);

          const field = customFields.find((f) => f.label === col.id);
          if (field) {
            const val = contact.custom_fields?.[field.name];
            if (field.type === "boolean") return val ? "Yes" : "No";
            return val || "";
          }
          return "";
        });
    };

    const data = selectedContacts.map((c) => getRowData(c));

    if (type === "csv") {
      exportToCSV(headers, data, "contacts_export");
    } else if (type === "excel") {
      exportToExcel(headers, data, "contacts_export", "Contacts Export");
    } else if (type === "print") {
      exportToPrint(headers, data, "Contacts Export", `Exported ${selectedContacts.length} contacts`);
    }
    setExportModalOpen(false);
  };

  const handleImport = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result = await importContacts(formData).unwrap();
      toast.info(result?.message || "Import started. You can track progress in the background.");
      setImportModalOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to import contacts");
    }
  };

  const handleBulkAddToSegments = async () => {
    if (selectedIds.length === 0) {
      toast.error("Please select contacts to add to segments");
      return;
    }
    if (selectedSegmentsForBulk.length === 0) {
      toast.error("Please select at least one segment");
      return;
    }
    try {
      await bulkAddContactsToSegments({
        segmentIds: selectedSegmentsForBulk,
        contactIds: selectedIds,
      }).unwrap();
      toast.success("Contacts added to segments successfully");
      setSelectedIds([]);
      setSelectedSegmentsForBulk([]);
      setPopoverOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add contacts to segments");
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const onAddClick = () => {
    setEditingContact(null);
    setModalOpen(true);
  };

  const dynamicColumnDefs: Column<Contact>[] = useMemo(() => {
    if (!isFeatureEnabled("custom_fields")) return [];
    const cols: Column<Contact>[] = customFields.map((field) => {
      return {
        header: field.label,
        cell: (row: Contact) => {
          return <span className="text-gray-600 dark:text-gray-400">{field.type !== "boolean" ? (row.custom_fields as any)?.[field.name] || "-" : Boolean((row.custom_fields as any)?.[field.name]) ? "Yes" : "No"}</span>;
        },
      };
    });
    return cols;
  }, [customFields, isFeatureEnabled]);

  const isBaileys = selectedWorkspace?.waba_type === "baileys";

  const staticColumns: Column<Contact>[] = useMemo(() => {
    const cols: Column<Contact>[] = [
      {
        header: "Name",
        className: "[@media(max-width:1920px)]:min-w-[150px]",
        accessorKey: "name",
        sortable: true,
        sortKey: "name",
        cell: (row: Contact) => (
          <Button
            onClick={() => {
              if (!isFeatureEnabled("conversations")) return;
              const isOmnichannel = ["telegram", "facebook", "instagram"].includes((row.source || "").toLowerCase());
              if (!isOmnichannel && !phoneNumberId) {
                setNoWabaModalSource(row.source || "whatsapp");
                setNoWabaModalOpen(true);
                return;
              }
              setQuickChatContact(row);
              setQuickChatOpen(true);
            }}
            className={cn("font-medium bg-[unset]! p-0! text-gray-900 dark:text-gray-400 transition-colors text-left", isFeatureEnabled("conversations") ? "hover:text-primary cursor-pointer" : "cursor-default")}
          >
            {row.name}
          </Button>
        ),
      },
      {
        header: "Phone",
        className: "[@media(max-width:1920px)]:min-w-[150px]",
        sortable: true,
        sortKey: "phone_number",
        accessorKey: "phone_number",
        cell: (row: Contact) => <span className="text-gray-600 dark:text-gray-400">{maskSensitiveData(row.phone_number, "phone", is_demo_mode) || "-"}</span>,
      },
      {
        header: "Source",
        className: "[@media(max-width:1920px)]:min-w-[150px]",
        accessorKey: "source",
        cell: (row: Contact) => (
          <Badge variant="outline" className={`${getSourceBadgeClass(row.source || "")} capitalize`}>
            {row.source}
          </Badge>
        ),
      },
      {
        header: "Tag",
        className: "[@media(max-width:1920px)]:min-w-[210px]",
        accessorKey: "tags",
        cell: (row: Contact) => {
          return (
            <div className="flex flex-wrap gap-1">
              {row?.tags && row?.tags.length > 0
                ? row.tags?.map((item: any) => {
                  return (
                    <Badge key={item.label} style={{ backgroundColor: item.color }} className="max-w-[200px] overflow-hidden">
                      <span className="truncate whitespace-nowrap">{item.label}</span>
                    </Badge>
                  );
                })
                : "-"}
            </div>
          );
        },
      },
      {
        header: "Segments",
        className: "[@media(max-width:1920px)]:min-w-[210px]",
        accessorKey: "segments",
        cell: (row: Contact) => {
          return (
            <div className="flex flex-wrap gap-1">
              {row?.segments && row?.segments.length > 0
                ? row.segments?.map((item: any) => {
                  return (
                    <Badge key={item._id} variant="outline" className="bg-slate-50 dark:bg-(--card-color) text-slate-600 dark:text-gray-400 border-slate-200 dark:border-(--card-border-color) max-w-[200px] overflow-hidden">
                      <span className="truncate whitespace-nowrap">{item.name}</span>
                    </Badge>
                  );
                })
                : "-"}
            </div>
          );
        },
      },
      {
        header: "Email Address",
        sortable: true,
        sortKey: "email",
        accessorKey: "email",
        cell: (row: Contact) => <span className="text-gray-600 dark:text-gray-400">{maskSensitiveData(row.email, "email", is_demo_mode) || "-"}</span>,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (row: Contact) => <span className="text-gray-600 dark:text-gray-400">{row.status || "-"}</span>,
      },
      {
        header: "Assigned To",
        accessorKey: "assigned_to",
        cell: (row: Contact) => <span className="text-gray-600 dark:text-gray-400">{row.assigned_to || "-"}</span>,
      },
      {
        header: "Created At",
        sortable: true,
        sortKey: "created_at",
        cell: (row: Contact) => <span className="text-gray-500 text-sm dark:text-gray-400">{formatDate(row.created_at)}</span>,
      },
      {
        header: "Actions",
        className: "text-right",
        cell: (row: Contact) => (
          <div className="flex justify-end gap-2">
            <Can permission="create.campaigns">
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-blue-500 hover:text-blue-500 hover:bg-blue-50 rounded-lg dark:hover:bg-blue-50/20 transition-all shadow-xs" onClick={() => router.push(`${ROUTES.MessageCampaignsAdd}?contact_id=${row._id}&redirect_to=${ROUTES.ContactDirectory}`)} title="Send Template">
                <LayoutTemplate size={14} />
              </Button>
            </Can>
            <PlanFeature feature="kanban_funnels">
              <Can permission="update.kanban_funnel">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 border-none text-yellow-600 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg dark:hover:bg-yellow-500/20 transition-all shadow-xs"
                  onClick={() => {
                    setKanbanContact(row);
                    setKanbanModalOpen(true);
                  }}
                  title="Manage Pipeline"
                >
                  <SquareKanban size={14} />
                </Button>
              </Can>
            </PlanFeature>
            <Can permission="update.contacts">
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs"
                onClick={() => {
                  setEditingContact(row);
                  setModalOpen(true);
                }}
                disabled={is_demo_mode}
              >
                <Edit2 size={14} />
              </Button>
            </Can>
            <Can permission="delete.contacts">
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs" onClick={() => setDeleteId(row._id)}>
                <Trash2 size={14} />
              </Button>
            </Can>
          </div>
        ),
      },
    ];

    return cols.filter((col) => {
      if (col.header === "Tag") return isFeatureEnabled("tags");
      if (col.header === "Segments") return isFeatureEnabled("segments");
      return true;
    });
  }, [isFeatureEnabled, is_demo_mode, phoneNumberId, router, isBaileys]);

  const allColumns = useMemo(() => {
    const insertIndex = staticColumns.findIndex((col) => col.header === "Assigned To") + 1 || 8;
    return [...staticColumns.slice(0, insertIndex), ...dynamicColumnDefs, ...staticColumns.slice(insertIndex)];
  }, [staticColumns, dynamicColumnDefs]);

  return (
    <div className="sm:p-8 p-4 space-y-8 pt-0! bg-(--page-body-bg) dark:bg-(--dark-body) min-h-full">
      <CommonHeader
        title={t("contacts_page_title")}
        description={t("contacts_page_description")}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        featureKey="contacts_used"
        searchPlaceholder="Search contacts..."
        onRefresh={handleRefresh}
        onExport={() => setExportModalOpen(true)}
        onImport={() => {
          const isImportRunning = importStatus === "started" || importStatus === "progress";
          if (isImportRunning) {
            toast.warning("Import already running. Please wait for it to complete.");
            return;
          }
          setImportModalOpen(true);
        }}
        isExportDisabled={selectedIds.length === 0}
        onAddClick={onAddClick}
        addLabel="Add Contact"
        addPermission="create.contacts"
        deletePermission="delete.contacts"
        exportPermission="export.contacts"
        importPermission="import.contacts"
        isLoading={isLoading}
        columns={visibleColumns}
        onColumnToggle={handleColumnToggle}
        onBulkDelete={handleBulkDelete}
        selectedCount={selectedIds.length}
        rightContent={
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <Select value={sourceFilter} onValueChange={handleSourceChange}>
              <SelectTrigger className="w-[180px] h-12 py-5.5 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-gray-400 font-medium rounded-lg shadow-xs">
                <SelectValue placeholder="Filter by Channel" />
              </SelectTrigger>
              <SelectContent className="dark:bg-(--card-color)">
                {filteredChannels.map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <SelectItem className="dark:hover:bg-(--table-hover)" key={channel.value} value={channel.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={cn("w-4 h-4", channel.iconColor)} />
                        <span>{channel.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className={`flex items-center gap-2.5 px-4.5! py-5 h-12 rounded-lg font-medium cursor-pointer transition-all active:scale-95 group ml-auto sm:ml-0 ${isUnsubscribed === true ? "bg-light-primary! dark:bg-primary-darker/20! dark:border-primary-darker/20! border-[var(--primary-opacity-30)]! text-primary!" : "bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) text-slate-600 dark:text-gray-400"}`} onClick={() => setIsUnsubscribed(isUnsubscribed === true ? undefined : true)} disabled={isLoading}>
                  {isUnsubscribed === true ? (
                    <UserCheck className="w-5 h-5 text-primary" />
                  ) : (
                    <UserX className="w-5 h-5 text-slate-400 dark:text-amber-50" />
                  )}
                  <span className="inline">{isUnsubscribed === true ? "Subscribe Contact" : "Unsubscribe Contact"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-primary text-white border-primary">
                <p className="font-medium text-[12px] tracking-wider">{isUnsubscribed === true ? "Filter Subscribed Contacts" : "Filter Unsubscribed Contacts"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        }
        extraActions={
          <PlanFeature feature="segments">
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-11 px-4 gap-2 bg-white cursor-pointer dark:bg-(--page-body-bg) border-slate-200 dark:border-none text-slate-600 dark:text-gray-400 rounded-lg font-semibold transition-all shadow-sm" disabled={selectedIds.length === 0 || isBulkAdding}>
                  <Layers className={`w-4 h-4 text-slate-400 dark:text-amber-50 ${isBulkAdding ? "animate-spin" : ""}`} />
                  <span className="inline text-sm">{t("add_to_segment")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-4 rounded-lg border-slate-200/60 dark:border-(--card-border-color) shadow-xl z-1002">
                <div className="space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-gray-500">{t("select_segments")}</h4>
                  <MultiSelect options={segments.map((s: any) => ({ label: s.name, value: s._id }))} selected={selectedSegmentsForBulk} onChange={setSelectedSegmentsForBulk} placeholder="Choose segments..." className="bg-slate-50/50 dark:bg-(--dark-body)" />
                  <Button className="w-full h-10 font-bold" onClick={handleBulkAddToSegments} disabled={isBulkAdding || selectedSegmentsForBulk.length === 0}>
                    {isBulkAdding && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                    {t("add_to_segments")}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </PlanFeature>
        }
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 mt-8 dark:border-(--card-border-color) shadow-sm overflow-hidden">
        <DataTable data={contacts} columns={allColumns.filter((col) => visibleColumns.find((vc) => vc.id === col.header)?.isVisible !== false)} isLoading={isLoading || isFieldsLoading} isFetching={isFetching || isDeleting} totalCount={totalCount} page={page} limit={limit} onPageChange={handlePageChange} onLimitChange={handleLimitChange} enableSelection={true} selectedIds={selectedIds} onSelectionChange={setSelectedIds} getRowId={(item) => item._id} emptyMessage={searchTerm ? `No contacts found matching "${searchTerm}"` : "No contacts found. Add your first contact."} className="border-none shadow-none rounded-none" onSortChange={handleSortChange} actionPermission={['create.campaigns','update.kanban_funnel','update.contacts','delete.contacts']}/>
      </div>

      <ContactModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} contact={editingContact} isLoading={isCreating || isUpdating} />

      <ContactImportModal isOpen={importModalOpen} onClose={() => setImportModalOpen(false)} onImport={handleImport} isLoading={isImporting} />

      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} onExport={handleExport} title="Export Contacts" description={`Select your preferred format to export ${selectedIds.length} selected ${selectedIds.length === 1 ? "contact" : "contacts"}.`} selectedCount={selectedIds.length} />

      <ConfirmModal isOpen={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} isLoading={isDeleting} title="Delete Contact" subtitle="Are you sure you want to delete this contact? This action cannot be undone." confirmText="Delete" variant="danger" />
      <ConfirmModal isOpen={bulkConfirmOpen} onClose={() => setBulkConfirmOpen(false)} onConfirm={confirmBulkDelete} isLoading={isDeleting} title="Bulk Delete Contacts" subtitle={`Are you sure you want to delete ${selectedIds.length} selected contacts? This action cannot be undone.`} confirmText="Delete All" variant="danger" />

      <QuickChatSheet isOpen={quickChatOpen} onClose={() => setQuickChatOpen(false)} contact={quickChatContact} initialPhoneNumberId={phoneNumberId} />

      <WabaRequiredModal isOpen={noWabaModalOpen} onClose={() => setNoWabaModalOpen(false)} platform={noWabaModalSource} />

      <ContactKanbanActionModal isOpen={kanbanModalOpen} onClose={() => setKanbanModalOpen(false)} contact={kanbanContact} />
    </div>
  );
};

export default ContactPage;
