"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import { WebhookCardProps } from "@/src/types/webhook";
import { format } from "date-fns";
import { Check, CheckCircle2, Clock, Copy, Edit2, LayoutTemplate, MoreVertical, Trash2, Zap } from "lucide-react";
import Can from "@/src/components/shared/Can";
import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { ROUTES } from "@/src/constants";

const WebhookCard = ({ webhook, onEdit, onToggle, onDelete, onViewPayload, localStatus }: WebhookCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const { is_demo_mode } = useAppSelector((state) => state.setting);

  const id = (typeof webhook._id === "string" ? webhook._id : webhook._id?.$oid) || webhook.id;
  const createdAt = webhook.created_at ? (typeof webhook.created_at === "string" ? new Date(webhook.created_at) : new Date(webhook.created_at.$date)) : new Date();

  const webhookUrl = webhook.webhook_url;

  const handleCopy = () => {
    if (!webhookUrl || is_demo_mode) return;
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    toast.success(t("webhook_url_copied"));
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusLabel = () => {
    if (!webhook.is_template_mapped) return t("not_configured");
    return t("configured");
  };

  const status = getStatusLabel();
  const hasFirstPayload = !!webhook.first_payload;
  const isConfigured = status === t("configured");

  return (
    <div className="group relative h-full flex flex-col bg-white dark:bg-(--card-color) border border-slate-200/60 dark:border-(--card-border-color) rounded-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4">
      <div className="sm:p-6 p-4 pb-4 flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-primary transition-colors">{webhook?.webhook_name}</h3>
            <Badge variant="outline" className="text-[10px] font-bold h-5 px-2 bg-slate-50 dark:bg-(--page-body-bg) text-slate-400 border-slate-100 dark:border-(--card-border-color) tracking-widest uppercase">
              {webhook?.platform || "CUSTOM"}
            </Badge>
          </div>
          <p className="text-[12px] text-slate-400 font-bold  flex items-center gap-1.5">
            <Clock size={12} className="text-slate-300" />
            {t("created_on")} {format(createdAt, "MMMM dd, yyyy")}
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border-none shadow-none">
                <MoreVertical size={20} className="text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 py-2">Webhook Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <Can permission="view.ecommerce_webhooks">
                <DropdownMenuItem onClick={() => onViewPayload(webhook)} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                  <Zap size={16} className="text-amber-500" />
                  <span className="font-semibold text-sm">{t("show_payload")}</span>
                </DropdownMenuItem>
              </Can>

              <Can permission="update.ecommerce_webhooks">
                <DropdownMenuItem onClick={() => onEdit(webhook)} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                  <Edit2 size={16} className="text-blue-500" />
                  <span className="font-semibold text-sm">{t("edit")}</span>
                </DropdownMenuItem>
              </Can>

              <Can permission="update.ecommerce_webhooks">
                <DropdownMenuItem disabled={!hasFirstPayload} onClick={() => router.push(`${ROUTES.WebhooksMapTemplate}/${id}`)} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                  <LayoutTemplate size={16} className="text-primary" />
                  <span className="font-semibold text-sm">{isConfigured ? t("edit_template") : t("map_template")}</span>
                </DropdownMenuItem>
              </Can>

              <DropdownMenuSeparator />

              <Can permission="update.ecommerce_webhooks">
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 size={16} className={webhook.is_active ? "text-primary" : "text-slate-400"} />
                    <span className="font-semibold text-sm">{t("status")}</span>
                  </div>
                  <Switch checked={localStatus ?? webhook.is_active} onCheckedChange={() => id && onToggle(id, webhook.is_active)} className="data-[state=checked]:bg-primary scale-90" />
                </div>
              </Can>

              <DropdownMenuSeparator />

              <Can permission="delete.ecommerce_webhooks">
                <DropdownMenuItem variant="destructive" onClick={() => id && onDelete(id)} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                  <Trash2 size={16} />
                  <span className="font-semibold text-sm">{t("delete")}</span>
                </DropdownMenuItem>
              </Can>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="sm:px-6 px-4 space-y-6 flex-1">
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary" className={cn("border-none font-extrabold text-[10px] px-3 py-1 rounded-full tracking-wider shadow-sm", (localStatus ?? webhook.is_active) ? "bg-primary/10 text-primary dark:text-primary" : "bg-slate-100 text-slate-400 dark:bg-(--page-body-bg)")}>
            {(localStatus ?? webhook.is_active) ? t("active").toUpperCase() : t("inactive").toUpperCase()}
          </Badge>
          <Badge variant="secondary" className={cn("border-none font-extrabold text-[10px] px-3 py-1 rounded-full tracking-wider shadow-sm", !isConfigured ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400")}>
            {status.toUpperCase()}
          </Badge>
          {webhook?.template?.name && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-500/5 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100/50 dark:border-indigo-500/20 text-[10px] font-extrabold tracking-wider animate-in fade-in slide-in-from-left-2 duration-500">
              <LayoutTemplate size={12} />
              {webhook.template.name.toUpperCase()}
            </div>
          )}
        </div>

        <div className="space-y-3 relative group/endpoint">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{t("webhook_url")}</span>
            <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter opacity-0 group-hover/endpoint:opacity-100 transition-opacity">Endpoint Address</span>
          </div>
          <div className="relative overflow-hidden group/copy">
            <div className="w-full bg-slate-900/5 dark:bg-(--page-body-bg) p-4 py-4 rounded-lg border border-slate-100/80 dark:border-(--card-border-color) font-mono text-[11px] text-slate-600 dark:text-slate-400 break-all pr-12 leading-relaxed shadow-inner group-hover/copy:border-primary/30 transition-colors">{webhookUrl}</div>
            <div className="absolute right-2 top-1.5 bottom-1.5 flex items-center">
              <Button variant="ghost" size="icon" onClick={() => !is_demo_mode && handleCopy()} disabled={is_demo_mode} className={cn("h-8 w-8 bg-white dark:bg-(--page-body-bg) text-slate-400 hover:text-primary hover:bg-light-primary dark:hover:bg-primary/10 rounded-lg transition-all border border-slate-100 dark:border-(--card-border-color) shadow-md transform translate-x-1 group-hover/copy:translate-x-0 opacity-0 group-hover/copy:opacity-100", is_demo_mode && "cursor-not-allowed")}>
                {copied ? <Check size={14} className="text-primary animate-in zoom-in-50" /> : <Copy size={14} />}
              </Button>
            </div>
          </div>
        </div>

        <div className="pb-6">
          {!hasFirstPayload ? (
            <div className="p-4 rounded-2xl bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-500/5 dark:to-orange-500/5 border border-amber-100/50 dark:border-amber-500/10 flex items-center justify-between shadow-sm group-hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white dark:bg-(--dark-body) flex items-center justify-center text-amber-500 shadow-sm ring-1 ring-amber-100 dark:ring-amber-500/20">
                  <Clock size={18} className="animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-extrabold text-amber-700 dark:text-amber-500 uppercase">{t("waiting_first_response")}</p>
                  <p className="text-[9px] text-amber-600/60 dark:text-amber-500/40 font-medium">Listening for events...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-linear-to-br from-emerald-50/50 to-teal-50/50 dark:from-primary/5 dark:to-teal-500/5 border border-[var(--primary-opacity-20)]/50 dark:border-primary/10 flex items-center justify-between shadow-sm group-hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white dark:bg-(--dark-body) flex items-center justify-center text-primary shadow-sm ring-1 ring-[var(--primary-opacity-20)] dark:ring-primary/20">
                  <CheckCircle2 size={18} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] font-extrabold text-primary-dark dark:text-primary uppercase">{t("successfully_receiving_data")}</p>
                  <p className="text-[9px] text-primary/60 dark:text-primary/40 font-medium tracking-tight">Active synchronization</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pb-2" />
    </div>
  );
};

export default WebhookCard;
