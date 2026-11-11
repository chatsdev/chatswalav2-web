/* eslint-disable @typescript-eslint/no-explicit-any */
import { ROUTES } from "@/src/constants";
import { Badge } from "@/src/elements/ui/badge";
import { Button } from "@/src/elements/ui/button";
import { Switch } from "@/src/elements/ui/switch";
import { cn } from "@/src/lib/utils";
import { Column } from "@/src/types/shared";
import { formatDateTime } from "@/src/utils";
import { TFunction } from "i18next";
import { BarChart3, CheckCircle2, Edit2, Facebook, Layers, LayoutGrid, Megaphone, MousePointer2, RotateCw, Settings2, Target, Trash2, Link2Off, Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import Can from "../shared/Can";

export const getPageColumns = (
  t: TFunction,
  onToggleDefault?: (id: string, isDefault: boolean) => void,
  isUpdating?: boolean,
  onDisconnect?: (id: string) => void,
  isDisconnectingId?: string | null
): Column<any>[] => [
    {
      header: t("page_name"),
      className: "min-w-[250px] [@media(max-width:1755px)]:min-w-[495px] ",
      accessorKey: "page_name",
      sortable: true,
      cell: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0">
            {item.picture_url ? (
              <Image src={item.picture_url} alt={item.page_name} className="w-full h-full object-cover" width={100} height={100} unoptimized />
            ) : (
              <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <Facebook size={20} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-slate-700 dark:text-slate-200 break-all whitespace-normal line-clamp-2">{item.page_name}</span>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider break-all whitespace-normal">{item.category}</div>
          </div>
        </div>
      ),
    },
    {
      header: t("page_id"),
      className: "min-w-[150px] [@media(max-width:1755px)]:min-w-[200px]",
      accessorKey: "page_id",
      cell: (item) => <code className="text-xs bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{item.page_id}</code>,
    },
    {
      header: t("instagram_connected"),
      className: "min-w-[140px] [@media(max-width:1755px)]:min-w-[220px]",
      accessorKey: "is_instagram_connected",
      cell: (item) => <div className="flex items-center gap-2">{item.is_instagram_connected ? <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-2.5 py-0.5 font-bold">{t("yes")}</Badge> : <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5 px-2.5 py-0.5 font-bold">{t("no")}</Badge>}</div>,
    },
    {
      header: t("whatsapp_connected"),
      className: "min-w-[140px] [@media(max-width:1755px)]:min-w-[220px]",
      accessorKey: "is_whatsapp_connected",
      cell: (item) => <div className="flex items-center gap-2">{item.is_whatsapp_connected ? <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-2.5 py-0.5 font-bold">{t("yes")}</Badge> : <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5 px-2.5 py-0.5 font-bold">{t("no")}</Badge>}</div>,
    },
    {
      header: t("instagram_username"),
      className: "min-w-[160px] [@media(max-width:1755px)]:min-w-[180px]",
      accessorKey: "instagram_username",
      cell: (item) => <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.instagram_username || "-"}</span>,
    },
    {
      header: t("default"),
      className: "w-[100px] [@media(max-width:1755px)]:min-w-[150px]",
      accessorKey: "is_default",
      cell: (item) => (
        <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
          <Switch checked={!!item.is_default} onCheckedChange={(checked) => onToggleDefault?.(item._id, checked)} disabled={isUpdating} />
        </div>
      ),
    },
    {
      header: t("status"),
      className: "min-w-[180px] [@media(max-width:1755px)]:min-w-[180px]",
      accessorKey: "is_active",
      cell: (item) => (
        <div className="flex items-center gap-2">
          {item.is_active ? (
            <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-2.5 py-0.5 font-bold">
              <CheckCircle2 size={12} /> {t("connected")}
            </Badge>
          ) : (
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5 px-2.5 py-0.5 font-bold">{t("not_configured")}</Badge>
          )}
        </div>
      ),
    },
    {
      header: t("created_at"),
      className: "min-w-[200px] [@media(max-width:1755px)]:min-w-[190px]",
      accessorKey: "created_at",
      sortable: true,
      cell: (item) => <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{formatDateTime(item.created_at)}</div>,
    },
    {
      header: t("actions"),
      className: "w-[100px] [@media(max-width:1755px)]:min-w-[150px]",
      cell: (item) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {onDisconnect && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => onDisconnect(item._id)}
              disabled={isDisconnectingId === item._id}
              className="h-10 w-10 flex items-center border-none dark:bg-(--page-body-bg) justify-center rounded-lg bg-white dark:bg-(--card-color) text-slate-500 dark:text-slate-400 hover:text-red-600 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all active:scale-95 shadow-xs shrink-0"
              title="Disconnect Facebook Page"
            >
              {isDisconnectingId === item._id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link2Off className="w-4.5 h-4.5" />
              )}
            </Button>
          )}
        </div>
      ),
    },
  ];

export const getAdAccountColumns = (t: any, router: AppRouterInstance): Column<any>[] => [
  {
    header: t("account_name"),
    className: "min-w-[250px] [@media(max-width:1755px)]:min-w-[455px] ",
    accessorKey: "name",
    sortable: true,
    cell: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100 dark:border-indigo-800">
          <Facebook size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-700 dark:text-slate-200 break-all whitespace-normal">{item.name}</span>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider break-all whitespace-normal">{item.currency} Account</div>
        </div>
      </div>
    ),
  },
  {
    header: t("account_id"),
    className: "min-w-[150px] [@media(max-width:1755px)]:min-w-[270px]",
    accessorKey: "ad_account_id",
    cell: (item) => <code className="text-xs bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{item.ad_account_id}</code>,
  },
  {
    header: t("currency"),
    className: "min-w-[120px] [@media(max-width:1755px)]:min-w-[140px]",
    accessorKey: "currency",
    cell: (item) => <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.currency}</span>,
  },
  {
    header: t("balance"),
    className: "min-w-[150px] [@media(max-width:1755px)]:min-w-[140px]",
    accessorKey: "balance",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {item.balance} {item.currency}
        </span>
      </div>
    ),
  },
  {
    header: t("has_payment_method"),
    className: "min-w-[180px] [@media(max-width:1755px)]:min-w-[215px]",
    accessorKey: "has_payment_method",
    cell: (item) => (
      <div className="flex items-center gap-2">
        {item.has_payment_method ? (
          <Badge className="bg-primary/10 text-primary border-primary/20 gap-1.5 px-2.5 py-0.5 font-bold">
            <CheckCircle2 size={12} /> {t("yes")}
          </Badge>
        ) : (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5 px-2.5 py-0.5 font-bold">{t("no")}</Badge>
        )}
      </div>
    ),
  },
  {
    header: t("status"),
    className: "min-w-[120px] [@media(max-width:1755px)]:min-w-[140px]",
    accessorKey: "account_status",
    cell: (item) => <Badge className={cn("font-bold px-2.5 py-0.5", item.account_status === 1 ? "bg-primary/10 text-primary border-primary/20" : "bg-red-500/10 text-red-600 border-red-500/20")}>{item.status_label || (item.account_status === 1 ? t("active") : t("disabled"))}</Badge>,
  },
  {
    header: t("actions"),
    className: "w-[150px] [@media(max-width:1755px)]:min-w-[170px]",
    accessorKey: "actions",
    cell: (item) => (
      <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/campaigns/${item.ad_account_id}`)} className="py-5 border-none text-blue-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all dark:hover:bg-blue-500/20 shadow-xs">
        <LayoutGrid size={14} />
        {t("manage_campaigns")}
      </Button>
    ),
  },
];

export const getCampaignColumns = (t: any, router: AppRouterInstance, onDelete: (id: string) => void, onUpdateStatus: (item: any) => void): Column<any>[] => [
  {
    header: t("campaign_name"),
    className: "min-w-[250px] [@media(max-width:1530px)]:min-w-[440px]",
    accessorKey: "name",
    sortable: true,
    cell: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100 dark:border-blue-800">
          <Megaphone size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-700 dark:text-slate-200 break-all whitespace-normal line-clamp-2">{item.name}</span>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider break-all whitespace-normal line-clamp-2">{item.objective}</div>
        </div>
      </div>
    ),
  },
  {
    header: t("campaign_id"),
    className: "min-w-[150px] [@media(max-width:1530px)]:min-w-[175px]",
    accessorKey: "fb_campaign_id",
    cell: (item) => <code className="text-xs bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{item.fb_campaign_id || item.campaign_id || item.id || item._id || "-"}</code>,
  },
  {
    header: t("status"),
    className: "min-w-[120px] [@media(max-width:1530px)]:min-w-[130px]",
    accessorKey: "status",
    cell: (item) => {
      const status = item.status?.toUpperCase();
      const styles: Record<string, string> = {
        ACTIVE: "bg-primary/10 text-primary border-primary/20",
        PAUSED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        ARCHIVED: "bg-slate-500/10 text-slate-600 border-slate-500/20",
        DELETED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        ERROR: "bg-red-500/10 text-red-600 border-red-500/20",
      };
      return (
        <Badge className={cn("font-bold px-2.5 py-0.5 capitalize", styles[status] || styles.ARCHIVED)}>
          {status?.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    header: t("budget"),
    className: "min-w-[130px] [@media(max-width:1530px)]:min-w-[140px]",
    accessorKey: "daily_budget",
    cell: (item) => (
      <div className="flex flex-col">
        <span className="font-bold text-slate-700 dark:text-slate-200">{item.daily_budget ? `${item.daily_budget}` : item.lifetime_budget ? `${item.lifetime_budget}` : "-"}</span>
        <span className="text-[10px] text-slate-400 uppercase">{item.daily_budget ? t("daily") : t("lifetime")}</span>
      </div>
    ),
  },
  {
    header: t("actions"),
    className: "w-[150px] [@media(max-width:1530px)]:min-w-[389px]",
    accessorKey: "actions",
    cell: (item) => (
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/adsets/${item._id}`)} className="py-5 border-none text-blue-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all dark:hover:bg-blue-500/20 shadow-xs">
          <Layers size={14} />
          {t("view_ad_sets")}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/insights?id=${item._id}&level=campaign`)} className="w-10 h-10 border-none text-yellow-600 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all dark:hover:bg-yellow-500/20 shadow-sm">
          <BarChart3 size={16} />
        </Button>
        <Can permission="update.facebook_ads">
          <Button type="button" variant="ghost" size="sm" onClick={() => onUpdateStatus(item)} className="w-10 h-10 border-none text-slate-500 hover:text-slate-500 hover:bg-slate-500/10 rounded-lg transition-all dark:hover:bg-slate-500/20 shadow-sm">
            <Settings2 size={16} />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/wizard?accountId=${item.ad_account_id}&id=${item._id}&type=CAMPAIGN`)} className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all dark:hover:bg-primary/20 shadow-sm">
            <Edit2 size={16} />
          </Button>
        </Can>
        <Can permission="delete.facebook_ads">
          <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(item._id)} className="w-10 h-10 border-none text-red-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all dark:hover:bg-red-500/20 shadow-sm">
            {item.is_deleting ? <RotateCw className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
          </Button>
        </Can>
      </div>
    ),
  },
];

export const getAdSetColumns = (t: any, router: AppRouterInstance, onDelete: (id: string) => void): Column<any>[] => [
  {
    header: t("ad_set_name"),
    className: "min-w-[250px] [@media(max-width:1199px)]:min-w-[269px]",
    accessorKey: "name",
    sortable: true,
    cell: (item) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 shrink-0 border border-purple-100 dark:border-purple-800">
          <Target size={20} />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="font-bold text-slate-700 dark:text-slate-200 break-all whitespace-normal line-clamp-2">{item.name}</span>
          <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider break-all whitespace-normal lien-clamp-2">{item.optimization_goal}</div>
        </div>
      </div>
    ),
  },
  {
    header: t("ad_set_id"),
    className: "min-w-[150px] [@media(max-width:1199px)]:min-w-[180px]",
    accessorKey: "fb_adset_id",
    cell: (item) => <code className="text-[13px] bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{item.fb_adset_id || item.adset_id || item.id || item._id || "-"}</code>,
  },
  {
    header: t("status"),
    className: "min-w-[120px] [@media(max-width:1199px)]:min-w-[125px]",
    accessorKey: "status",
    cell: (item) => (
      <Badge variant="outline" className={cn("capitalize font-bold border-none px-0", item.status === "ACTIVE" ? "text-primary" : "text-slate-400")}>
        <div className={cn("w-1.5 h-1.5 rounded-full mr-2", item.status === "ACTIVE" ? "bg-primary" : "bg-slate-300")} />
        {item.status?.toLowerCase()}
      </Badge>
    ),
  },
  {
    header: t("actions"),
    className: "w-[240px] [@media(max-width:1199px)]:min-w-[320px]",
    accessorKey: "actions",
    cell: (item) => (
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/ads/${item._id}`)} className="py-5 border-none text-blue-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all dark:hover:bg-blue-500/20 shadow-xs">
          <MousePointer2 size={14} />
          {t("view_ads")}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/insights?id=${item._id}&level=adset`)} className="w-10 h-10 border-none text-yellow-600 hover:text-yellow-600 hover:bg-yellow-600/10 rounded-lg transition-all dark:hover:bg-yellow-600/20 shadow-xs">
          <BarChart3 size={16} />
        </Button>
        <Can permission="update.facebook_ads">
          <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/wizard?id=${item._id}&type=ADSET`)} className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all dark:hover:bg-primary/20 shadow-xs">
            <Edit2 size={16} />
          </Button>
        </Can>
        <Can permission="delete.facebook_ads">
          <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(item._id)} className="w-10 h-10 border-none text-red-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all dark:hover:bg-red-500/20 shadow-xs">
            {item.is_deleting ? <RotateCw className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
          </Button>
        </Can>
      </div>
    ),
  },
];

export const getAdColumns = (t: any, router: AppRouterInstance, onDelete: (id: string) => void): Column<any>[] => [
  {
    header: t("ad_name"),
    className: "min-w-[250px]",
    accessorKey: "name",
  },
  {
    header: t("ad_id"),
    className: "min-w-[150px]",
    accessorKey: "fb_ad_id",
    cell: (item) => <code className="text-xs bg-slate-100 dark:bg-(--dark-body) px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400">{item.fb_ad_id || item.ad_id || item.id || item._id || "-"}</code>,
  },
  {
    header: t("status"),
    className: "min-w-[120px]",
    accessorKey: "status",
    cell: (item) => (
      <Badge variant="outline" className={cn("capitalize font-bold border-none px-0", item.status === "ACTIVE" ? "text-primary" : "text-slate-400")}>
        <div className={cn("w-1.5 h-1.5 rounded-full mr-2", item.status === "ACTIVE" ? "bg-primary" : "bg-slate-300")} />
        {item.status?.toLowerCase()}
      </Badge>
    ),
  },
  {
    header: t("actions"),
    className: "w-[160px]",
    accessorKey: "actions",
    cell: (item) => (
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/insights?id=${item._id}&level=ad`)} className="w-10 h-10 border-none text-yellow-600 hover:text-yellow-600 hover:bg-yellow-600/10 rounded-lg transition-all dark:hover:bg-yellow-600/20 shadow-xs">
          <BarChart3 size={16} />
        </Button>
        <Can permission="update.facebook_ads">
          <Button type="button" variant="ghost" size="sm" onClick={() => router.push(`${ROUTES.FacebookAccount}/wizard?id=${item._id}&type=AD`)} className="w-10 h-10 border-none text-primary hover:text-primary hover:bg-primary/10 rounded-lg transition-all dark:hover:bg-primary/20 shadow-xs">
            <Edit2 size={16} />
          </Button>
        </Can>
        <Can permission="delete.facebook_ads">
          <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(item._id)} className="w-10 h-10 border-none text-red-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all dark:hover:bg-red-500/20 shadow-xs">
            {item.is_deleting ? <RotateCw className="w-4 h-4 animate-spin" /> : <Trash2 size={16} />}
          </Button>
        </Can>
      </div>
    ),
  },
];
