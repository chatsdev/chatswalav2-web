/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { cn } from "@/src/lib/utils";
import { ClipboardList, Edit2, Info, Layout, MoreVertical, Rocket, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Can from "../shared/Can";
import { ROUTES } from "@/src/constants";
import { FormCardProps } from "@/src/types/formBuilder";



const FormCard = ({ form, onDelete, onPublish, onViewInfo, isPublishing, isDeleting }: FormCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();

  const status = form.meta_status || form.status || "draft";
  const isPublished = status.toLowerCase() === "published";
  const isDeprecated = status.toLowerCase() === "deprecated";

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "bg-primary/10 text-primary dark:text-primary";
      case "draft":
        return "bg-slate-100 text-slate-400 dark:bg-(--page-body-bg) dark:text-gray-500";
      case "deprecated":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      default:
        return "bg-slate-100 text-slate-400 dark:bg-(--page-body-bg) dark:text-gray-500";
    }
  };

  return (
    <div className="group relative h-full flex flex-col bg-white dark:bg-(--card-color) border border-slate-200/60 dark:border-(--card-border-color) rounded-lg overflow-hidden transition-all duration-500 hover:shadow-sm hover:shadow-slate-200 dark:hover:shadow-slate-900 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4">
      <div className="sm:p-6 p-4 pb-4 flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase group-hover:text-primary transition-colors truncate">{form.name}</h3>
          </div>
          <p className="text-[12px] text-slate-400 font-medium flex items-center gap-1.5">
            <Layout size={12} className="text-slate-300" />
            {form.category?.replace(/_/g, " ") || "GENERAL"}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-slate-100 dark:hover:bg-(--table-hover) transition-all border-none shadow-none shrink-0">
              <MoreVertical size={20} className="text-slate-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-[11px] font-medium text-slate-400 px-3 py-2">{t("form_actions")}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <Can permission="update.form_builder">
              {status.toLowerCase() === "draft" && (
                <DropdownMenuItem onClick={() => router.push(`${ROUTES.WhatsappForm}/${form._id}/edit`)} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                  <Edit2 size={16} className="text-blue-500" />
                  <span className="font-semibold text-sm">{t("edit")}</span>
                </DropdownMenuItem>
              )}
              

              {!(isPublished || isDeprecated || isPublishing) && <DropdownMenuItem onClick={() => onPublish(form._id)} disabled={isPublished || isDeprecated || isPublishing} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                <Rocket size={16} className={cn("text-primary", (isPublished || isDeprecated) && "text-slate-300")} />
                <span className="font-semibold text-sm">{t("publish_to_meta")}</span>
              </DropdownMenuItem>}

              <DropdownMenuItem onClick={() => router.push(`${ROUTES.WhatsappForm}/${form._id}/submissions`)} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                <ClipboardList size={16} className="text-blue-500" />
                <span className="font-semibold text-sm">{t("view_submissions")}</span>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => onViewInfo && onViewInfo(form)} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                <Info size={16} className="text-slate-500" />
                <span className="font-semibold text-sm">{t("info")}</span>
              </DropdownMenuItem>
            </Can>

            <DropdownMenuSeparator />

            <Can permission="delete.form_builder">
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(form._id)} disabled={isDeleting} className="gap-2.5 px-3 py-2.5 cursor-pointer">
                <Trash2 size={16} />
                <span className="font-semibold text-sm">{t("delete")}</span>
              </DropdownMenuItem>
            </Can>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="sm:px-6 px-4 space-y-6 flex-1">
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge variant="secondary" className={cn("border-none font-extrabold text-[10px] px-3 py-1 rounded-full tracking-wider shadow-sm uppercase", getStatusColor(status))}>
            {status}
          </Badge>
          {form.is_multi_step && (
            <Badge variant="secondary" className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-none font-extrabold text-[10px] px-3 py-1 rounded-full tracking-wider shadow-sm uppercase">
              MULTI-STEP
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 p-3 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border border-slate-100/80 dark:border-(--card-border-color) transition-colors ">
            <p className="text-[12px] font-medium text-slate-400 ">{t("submissions")}</p>
            <div className="flex items-center gap-2">
              <ClipboardList size={14} className="text-primary" />
              <span className="font-mono text-lg font-bold text-slate-700 dark:text-slate-300">{form.stats?.submissions || 0}</span>
            </div>
          </div>

          <div className="space-y-1.5 p-3 rounded-lg bg-slate-50/50 dark:bg-(--page-body-bg) border border-slate-100/80 dark:border-(--card-border-color) transition-colors ">
            <p className="text-[12px] font-medium text-slate-400 ">{t("fields")}</p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1">
                <div className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 bg-primary/10 dark:bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary dark:text-primary">{form.fields?.length || 0}</div>
              </div>
              <span className="text-sm font-bold text-slate-500">Active Fields</span>
            </div>
          </div>
        </div>

        <div className="pb-6">
          <div className="p-4 rounded-lg bg-linear-to-br from-slate-50 to-slate-100/50 dark:from-(--card-color) dark:to-(--card-color) border border-slate-100/50 dark:border-(--card-border-color) flex items-center justify-between shadow-sm group-hover:shadow-md transition-all duration-500">
            <div className="flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shadow-sm ring-1", isPublished ? "bg-light-primary text-primary ring-[var(--primary-opacity-20)] dark:bg-(--dark-body) dark:ring-(--card-border-color)" : "bg-slate-100 text-slate-400 ring-slate-200 dark:bg-(--dark-body) dark:ring-(--card-border-color)")}>{isPublished ? <Rocket size={18} className="animate-bounce" style={{ animationDuration: "3s" }} /> : <Edit2 size={18} />}</div>
              <div className="space-y-0.5">
                <p className={cn("text-[12px] font-medium", isPublished ? "text-primary" : "text-slate-600 dark:text-slate-400")}>{isPublished ? t("published_to_meta") : t("draft_status")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-none">{isPublished ? t("sync_with_meta_desc") : t("not_live_on_meta_desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
