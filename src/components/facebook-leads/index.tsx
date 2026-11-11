/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/elements/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/elements/ui/tooltip";
import { useConnectLeadFormMutation, useDisconnectFacebookLeadFormMutation, useGetConnectedFacebookLeadFormsQuery, useGetFacebookLeadFormsQuery, useGetFacebookPagesQuery } from "@/src/redux/api/facebookApi";
import CommonHeader from "@/src/shared/CommonHeader";
import ConfirmModal from "@/src/shared/ConfirmModal";
import { DataTable } from "@/src/shared/DataTable";
import { ConnectedFacebookLeadForm, FacebookLeadForm, FacebookPage } from "@/src/types/facebookLead";
import { Column } from "@/src/types/shared";
import { formatDateTime } from "@/src/utils";
import { CheckCircle2, Layout, Link, Trash2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import ConnectFormModal from "./ConnectFormModal";

const FacebookLeads = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"instant" | "connected">("instant");
  const [selectedPageId, setSelectedPageId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "connected") {
      setActiveTab("connected");
    } else if (tab === "instant") {
      setActiveTab("instant");
    }
  }, [searchParams]);

  // Connect Modal State
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [selectedFormForConnect, setSelectedFormForConnect] = useState<FacebookLeadForm | null>(null);

  // Confirm Modal State
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formIdToDelete, setFormIdToDelete] = useState<string | null>(null);

  const { data: pagesResult, isLoading: isPagesLoading } = useGetFacebookPagesQuery();
  const pages: FacebookPage[] = pagesResult?.data || [];

  useEffect(() => {
    if (pages.length > 0 && !selectedPageId) {
      setSelectedPageId(pages[0].page_id);
    }
  }, [pages, selectedPageId]);

  const { data: formsResult, isLoading: isFormsLoading, isFetching: isFormsFetching, refetch: refetchForms } = useGetFacebookLeadFormsQuery({ page_id: selectedPageId }, { skip: !selectedPageId || activeTab !== "instant" });

  const [connectLeadForm, { isLoading: isConnectingForm }] = useConnectLeadFormMutation();

  const { data: connectedFormsResult, isLoading: isConnectedFormsLoading, isFetching: isConnectedFormsFetching, refetch: refetchConnected } = useGetConnectedFacebookLeadFormsQuery(undefined, { skip: activeTab !== "connected" });

  const [disconnectForm, { isLoading: isDisconnecting }] = useDisconnectFacebookLeadFormMutation();

  const forms: FacebookLeadForm[] = formsResult?.data || [];
  const connectedForms: ConnectedFacebookLeadForm[] = connectedFormsResult?.data || [];

  const currentData = useMemo(() => {
    if (activeTab === "instant") {
      return forms.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return connectedForms.filter((f) => f.form_name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeTab, forms, connectedForms, searchTerm]);

  const paginatedData = currentData.slice((page - 1) * limit, page * limit);

  const instantColumns: Column<FacebookLeadForm>[] = [
    {
      header: "Form Name",
      accessorKey: "name",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-200">{row.name}</span>
          <span className="text-xs text-gray-400">ID: {row.id}</span>
        </div>
      ),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (row) => (
        <Badge variant="outline" className={row.status === "ACTIVE" ? "bg-light-primary dark:bg-(--table-hover) dark:border-(--card-border-color) text-primary-dark border-[var(--primary-opacity-20)]" : "bg-gray-50 dark:bg-(--card-color) dark:border-(--card-border-color) text-gray-600 border-gray-200"}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: "Created At",
      accessorKey: "created_time",
      cell: (row) => <span className="text-gray-500 dark:text-gray-400 text-xs">{formatDateTime(row.created_time)}</span>,
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs"
                onClick={() => {
                  setSelectedFormForConnect(row);
                  setIsConnectModalOpen(true);
                }}
              >
                <Link size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-white border-primary">
              <p className="font-medium text-[11px] tracking-wider uppercase">Connect Form</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  const connectedColumns: Column<ConnectedFacebookLeadForm>[] = [
    {
      header: "Form Name",
      accessorKey: "form_name",
      cell: (row) => (
        <div className="flex flex-col text-start">
          <span className="font-semibold text-gray-900 dark:text-gray-200">{row.form_name}</span>
          <span className="text-xs text-gray-400">ID: {row.form_id}</span>
        </div>
      ),
    },
    {
      header: "Page",
      cell: (row) => (
        <div className="flex flex-col text-start">
          <span className="font-medium text-gray-700 dark:text-gray-300">{row.facebook_page_id?.page_name}</span>
          <span className="text-[10px] text-gray-500">ID: {row.page_id}</span>
        </div>
      ),
    },
    {
      header: "Webhook",
      accessorKey: "webhook_subscribed",
      cell: (row) => (
        <Badge variant="outline" className={row.webhook_subscribed ? "bg-light-primary dark:bg-(--table-hover) text-primary-dark dark:border-(--card-border-color) border-[var(--primary-opacity-20)]" : "bg-red-50 text-red-700 border-red-100"}>
          <div className="flex items-center gap-1">
            {row.webhook_subscribed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {row.webhook_subscribed ? "Subscribed" : "Failed"}
          </div>
        </Badge>
      ),
    },
    {
      header: "Tags",
      cell: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.tag_ids && row.tag_ids.length > 0 ? (
            row.tag_ids.map((tag) => (
              <Badge key={tag._id} style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }} className="text-[10px] border">
                {tag.label}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-gray-400">-</span>
          )}
        </div>
      ),
    },
    {
      header: "Connected At",
      accessorKey: "created_at",
      cell: (row) => <span className="text-gray-500 dark:text-gray-400 text-xs">{formatDateTime(row.created_at)}</span>,
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs" onClick={() => router.push(ROUTES.FacebookLeadMapping.replace(":id", row._id))}>
                <Layout size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-primary text-white border-primary">
              <p className="font-medium text-[11px] tracking-wider uppercase">Form Mapping</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="w-10 h-10 border-none text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg dark:hover:bg-red-900/20 transition-all shadow-xs" onClick={() => handleDelete(row._id)} disabled={isDisconnecting}>
                <Trash2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-red-500 text-white border-red-500">
              <p className="font-medium text-[11px] tracking-wider uppercase">Disconnect Form</p>
            </TooltipContent>
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleRefresh = () => {
    if (activeTab === "instant") refetchForms();
    else refetchConnected();
    toast.success("Data refreshed");
  };

  const handleConnectForm = async (formData: { form_name: string; tag_ids: string[] }) => {
    if (!selectedFormForConnect || !selectedPageId) return;

    try {
      const res = await connectLeadForm({
        page_id: selectedPageId,
        form_id: selectedFormForConnect.id,
        form_name: formData.form_name,
        tag_ids: formData.tag_ids,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Form connected successfully");
        setIsConnectModalOpen(false);
        // Switch to connected forms tab to see the new connection
        setActiveTab("connected");
        router.push(`${ROUTES.FacebookLead}?tab=connected`);
      } else {
        toast.error(res.message || "Failed to connect form");
      }
    } catch (err: any) {
      console.error("Connect form error:", err);
      toast.error(err?.data?.error || err?.data?.message || "Failed to connect form");
    }
  };

  const handleDelete = (id: string) => {
    setFormIdToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const onConfirmDelete = async () => {
    if (!formIdToDelete) return;

    try {
      const res = await disconnectForm(formIdToDelete).unwrap();
      if (res.success) {
        toast.success(res.message || "Form disconnected successfully");
        setIsConfirmModalOpen(false);
        setFormIdToDelete(null);
      } else {
        toast.error(res.message || "Failed to disconnect form");
      }
    } catch (err: any) {
      toast.error(err?.data?.error || err?.data?.message || "Failed to disconnect form");
    }
  };

  const rightContent = (
    <div className="flex items-center gap-4 flex-wrap justify-end">
      <div className="flex items-center bg-slate-100 dark:bg-(--page-body-bg) p-1 rounded-lg border border-slate-200 dark:border-(--card-border-color)">
        <Button
          onClick={() => {
            setActiveTab("instant");
            setPage(1);
            router.push(`${ROUTES.FacebookLead}?tab=instant`);
          }}
          className={`px-4! py-5.5! rounded-md! text-sm! font-bold! transition-all ${activeTab === "instant" ? "bg-white! dark:bg-(--card-color)! text-primary! dark:text-primary! shadow-sm!" : "text-slate-500! hover:text-slate-700! bg-[unset]! hover:bg-[unset]! dark:hover:text-slate-300!"}`}
        >
          {t("instant_forms")}
        </Button>
        <Button
          onClick={() => {
            setActiveTab("connected");
            setPage(1);
            router.push(`${ROUTES.FacebookLead}?tab=connected`);
          }}
          className={`px-4! py-1.5! rounded-md! text-sm! font-bold! transition-all ${activeTab === "connected" ? "bg-white! dark:bg-(--card-color)! text-primary! dark:text-primary! shadow-sm!" : "text-slate-500! hover:text-slate-700! bg-[unset]! hover:bg-[unset]! dark:hover:text-slate-300!"}`}
        >
          {t("connected_forms")}
        </Button>
      </div>

      {activeTab === "instant" && (
        <div className="w-64">
          <Select
            value={selectedPageId}
            onValueChange={(val) => {
              setSelectedPageId(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full h-12 py-6 bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) rounded-md shadow-sm">
              <SelectValue placeholder={t("select_facebook_page")} />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-(--card-color) border-slate-200 dark:border-(--card-border-color) rounded-lg shadow-xl">
              {pages.map((p) => (
                <SelectItem key={p.page_id} value={p.page_id} className="cursor-pointer hover:bg-slate-50 dark:hover:bg-(--table-hover)">
                  <div className="flex flex-col text-start py-2 px-2">
                    <span className="font-medium">{p.page_name}</span>
                    <span className="text-xs text-gray-500">{p.category}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );

  return (
    <div className="sm:p-8 pt-0! p-4 space-y-8 bg-(--page-body-bg) dark:bg-(--dark-body)">
      <CommonHeader
        title={t("facebook_lead_page_title")}
        description={t("facebook_lead_page_description")}
        onSearch={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        searchPlaceholder={activeTab === "instant" ? "Search instant forms..." : "Search connected forms..."}
        onRefresh={handleRefresh}
        isLoading={isFormsLoading || isPagesLoading || isConnectedFormsLoading}
        rightContent={rightContent}
      />

      <div className="bg-white dark:bg-(--card-color) rounded-lg border border-slate-200/60 dark:border-(--card-border-color) overflow-hidden">
        {activeTab === "instant" && (
          <DataTable
            data={paginatedData as FacebookLeadForm[]}
            columns={instantColumns}
            isLoading={isFormsLoading}
            isFetching={isFormsFetching}
            totalCount={currentData.length}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            getRowId={(item) => item.id}
            emptyMessage={searchTerm ? `No forms found matching "${searchTerm}"` : "No forms found for this page."}
            className="border-none shadow-none rounded-none"
            actionPermission={["update.facebook_leads"]}
          />
        )}

        {activeTab === "connected" && (
          <DataTable
            data={paginatedData as ConnectedFacebookLeadForm[]}
            columns={connectedColumns}
            isLoading={isConnectedFormsLoading}
            isFetching={isConnectedFormsFetching}
            totalCount={currentData.length}
            page={page}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
            getRowId={(item) => item._id}
            emptyMessage={searchTerm ? `No forms found matching "${searchTerm}"` : "No forms connected yet."}
            className="border-none shadow-none rounded-none"
            actionPermission={["update.facebook_leads", "delete.facebook_leads"]}
          />
        )}
      </div>

      <ConnectFormModal isOpen={isConnectModalOpen} onClose={() => setIsConnectModalOpen(false)} onConnect={handleConnectForm} form={selectedFormForConnect} isLoading={isConnectingForm} />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setFormIdToDelete(null);
        }}
        onConfirm={onConfirmDelete}
        isLoading={isDisconnecting}
        title="Disconnect Lead Form"
        subtitle="Are you sure you want to disconnect this form? This will stop receiving new leads from this form."
        confirmText="Disconnect"
        variant="danger"
      />

    </div>
  );
};

export default FacebookLeads;
