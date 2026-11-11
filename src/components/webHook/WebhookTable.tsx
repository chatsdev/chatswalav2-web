/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ROUTES } from "@/src/constants";
import { Button } from "@/src/elements/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { Switch } from "@/src/elements/ui/switch";
import { DataTable } from "@/src/shared/DataTable";
import { Webhook, WebhookTableProps } from "@/src/types/webhook";
import { cn } from "@/src/utils";
import { ClipboardList, Edit2, LayoutTemplate, Trash2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const WebhookTable = ({ data, isLoading, localStatuses, onEdit, onDelete, onToggle, onViewPayload, onSortChange, page, limit, onPageChange, onLimitChange, totalCount }: WebhookTableProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const columns = [
    {
      header: t("name", "Name"),
      accessorKey: "webhook_name",
      copyable: true,
      copyValue: "webhook_name",
      sortable: true,
      sortKey: "webhook_name",
      cell: (row: Webhook) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 dark:text-white break-all whitespace-normal">{row.webhook_name}</span>
          {row.platform && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{row.platform}</span>}
        </div>
      ),
    },
    {
      header: t("url", "URL"),
      accessorKey: "webhook_url",
      copyable: true,
      copyValue: "webhook_url",
      sortable: true,
      sortKey: "webhook_url",
      cell: (row: Webhook) => (
        <span className="text-slate-500 dark:text-slate-400 truncate max-w-62.5 block font-mono text-[12px]" title={row.webhook_url}>
          {row.webhook_url}
        </span>
      ),
    },
    {
      header: t("method", "Method"),
      accessorKey: "method",
      sortable: true,
      sortKey: "method",
      cell: (row: Webhook) => (
        <span className={cn("text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider", row.method === "GET" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-[var(--primary-opacity-20)] text-primary-dark dark:bg-primary-darker/30 dark:text-primary")}>
          {row.method || "POST"}
        </span>
      ),
    },
    {
      header: t("status", "Status"),
      accessorKey: "is_active",
      sortable: true,
      sortKey: "is_active",
      cell: (row: Webhook) => {
        const id = (typeof row._id === "string" ? row._id : row._id?.$oid) || row.id;
        return (
          <div className="flex items-center gap-2">
            <Switch checked={localStatuses[id || ""] ?? row.is_active} onCheckedChange={() => id && onToggle(id, row.is_active)} className="data-[state=checked]:bg-primary" />
          </div>
        );
      },
    },
    {
      header: t("actions", "Actions"),
      id: "actions",
      cell: (row: Webhook) => {
        const id = (typeof row._id === "string" ? row._id : row._id?.$oid) || row.id;
        const isConfigured = row.is_template_mapped;
        return (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" title={t("view_logs", "View Logs")} className="h-10 w-10 text-slate-600 dark:text-slate-400 hover:text-primary border-none hover:bg-slate-100 dark:hover:bg-(--table-hover)" onClick={() => router.push(`${ROUTES.WebhooksLogs}?webhook_id=${id}`)}>
              <ClipboardList size={16} />
            </Button>
            <Button variant="outline" size="icon" title={t("view_payload", "View Payload")} className="h-10 w-10   text-blue-600 dark:text-slate-400 hover:text-blue-600 border-none hover:bg-blue-100 dark:hover:bg-blue-500/20" onClick={() => onViewPayload(row)}>
              <Zap size={16} />
            </Button>
            <Button variant="outline" size="icon" title={t("edit_webhook", "Edit Webhook")} className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg dark:hover:bg-primary/20 transition-all shadow-xs" onClick={() => onEdit(row)}>
              <Edit2 size={16} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" title={isConfigured ? t("edit_template") : t("map_template")} className={cn("h-10 w-10   text-amber-600 border-none", row.first_payload ? "hover:text-amber-600 hover:bg-amber-50" : "opacity-50 cursor-not-allowed")} disabled={!row.first_payload}>
                  <LayoutTemplate size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2 border-slate-100 dark:border-(--card-border-color) shadow-xl rounded-xl">
                <DropdownMenuItem onClick={() => router.push(`${ROUTES.WebhooksMapTemplate}/${id}?type=customer`)} className="gap-2.5 px-3 py-2.5 cursor-pointer text-slate-800 dark:text-slate-200 font-medium text-xs hover:bg-light-primary dark:hover:bg-primary/10 hover:text-primary transition-colors">
                  {t("map_for_customer", "Map for Customer")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push(`${ROUTES.WebhooksMapTemplate}/${id}?type=owner`)} className="gap-2.5 px-3 py-2.5 cursor-pointer text-slate-800 dark:text-slate-200 font-medium text-xs hover:bg-light-primary dark:hover:bg-primary/10 hover:text-primary transition-colors border-t border-slate-50 dark:border-white/5">
                  {t("map_for_owner", "Map for Owner")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="icon" title={t("delete_webhook", "Delete Webhook")} className="w-10 h-10 border-none text-red-600 hover:text-red-600 dark:text-red-500 hover:bg-red-50 rounded-lg transition-all dark:hover:bg-red-900/20 shadow-xs" onClick={() => id && onDelete(id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) shadow-sm overflow-hidden">
      <DataTable columns={columns as any} data={data} isLoading={isLoading} totalCount={totalCount} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} enableSelection={false} getRowId={(item) => ((typeof item._id === "string" ? item._id : item._id?.$oid) || item.id || "") as string} emptyMessage={t("no_webhooks_found_create_first", "No webhooks found. Create your first webhook!")} onSortChange={onSortChange} actionPermission={["update.ecommerce_webhooks", "delete.ecommerce_webhooks"]} />
    </div>
  );
};

export default WebhookTable;
