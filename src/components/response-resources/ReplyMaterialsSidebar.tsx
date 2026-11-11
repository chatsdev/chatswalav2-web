"use client";

import { usePermissions } from "@/src/hooks/usePermissions";
import { cn } from "@/src/lib/utils";
import { useAppSelector } from "@/src/redux/hooks";
import {
  ReplyMaterialsSidebarProps
} from "@/src/types/replyMaterial";
import {
  FileText,
  X
} from "lucide-react";

import {
  REPLY_MATERIAL_SIDEBAR_ITEMS,
  TYPE_ICONS,
} from "@/src/data/responseResource";
import { Button } from "@/src/elements/ui/button";
import { useFeatureAccess } from "@/src/hooks/useFeatureAccess";
import { useTranslation } from "react-i18next";
const ReplyMaterialsSidebar: React.FC<ReplyMaterialsSidebarProps> = ({
  activeType,
  onTypeChange,
  onClose,
}) => {
  const { t } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { selectedWorkspace } = useAppSelector((state: any) => state.workspace);
  const isBaileys = selectedWorkspace?.waba_type === "baileys";
  const { isFeatureEnabled } = useFeatureAccess();

  const { hasPermission } = usePermissions();
  const filteredItems = REPLY_MATERIAL_SIDEBAR_ITEMS.filter((item) => {
    if (
      isBaileys &&
      (item.type === "catalog" ||
        item.type === "flow" ||
        item.type === "sequence")
    ) {
      return false;
    }
    if (item.permission && !hasPermission(item.permission)) {
      return false;
    }
    if (item.featureKey && !isFeatureEnabled(item.featureKey)) {
      return false;
    }
    return true;
  });

  return (
    <div className="w-68 lg:w-76 ltr:border-r rtl:border-l border-slate-200 dark:border-(--card-border-color) bg-white dark:bg-(--card-color) flex flex-col h-full overflow-hidden shadow-sm shrink-0 relative">
      <div className="p-6 pb-2 flex flex-col items-center text-center space-y-3 relative">
        {onClose && (
          <Button
            onClick={onClose}
            className="absolute top-4! ltr:right-4! rtl:left-4! text-slate-400! hover:text-slate-600! dark:hover:text-white! transition-colors bg-[unset]! [@media(min-width:1600px)]:hidden"
          >
            <X size={22} />
          </Button>
        )}
        <div className="w-14 h-14 rounded-xl bg-primary/10 dark:bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
          <FileText size={28} />
        </div>
        <div>
          <h2 className="text-[17px] font-bold text-slate-900 dark:text-white">
            {t("reply_materials_title")}
          </h2>
          <p className="text-[12px] text-slate-500 dark:text-gray-400 mt-0.5">
            {t("reply_materials_desc")}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1 custom-scrollbar">
        <p className="text-[10px] font-black text-slate-400 dark:text-gray-500 px-3 mb-3 tracking-widest uppercase">
          {t("content_types")}
        </p>

        {filteredItems.map((item) => {
          const isActive = activeType === item.type;
          return (
            <Button
              key={item.type}
              onClick={() => {
                onTypeChange(item.type);
                onClose?.();
              }}
              className={cn(
                "w-full! text-start! p-3! rounded-lg! h-16.5 flex items-center gap-3.5! transition-all duration-200 group relative",
                isActive
                  ? "bg-primary/5! dark:bg-primary/10! border! border-primary/20! dark:border-primary/20!"
                  : "text-slate-600! dark:text-gray-400! bg-[unset]! hover:bg-slate-50! dark:hover:bg-(--table-hover)!",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shadow-xs shrink-0",
                  isActive
                    ? "bg-white dark:bg-primary/20 text-primary"
                    : "bg-slate-100 dark:bg-(--dark-body) text-slate-400 dark:text-gray-500 group-hover:bg-white dark:group-hover:bg-(--card-color)",
                )}
              >
                {TYPE_ICONS[item.type]}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-semibold text-sm truncate",
                    isActive
                      ? "text-primary"
                      : "text-slate-900 dark:text-white",
                  )}
                >
                  {t(item.label)}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-gray-500 truncate mt-0.5">
                  {t(item.description)}
                </p>
              </div>

              {isActive && (
                <div className="absolute ltr:right-0 rtl:left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary ltr:rounded-l-full rtl:rounded-r-full" />
              )}
            </Button>
          );
        })}
      </div>

      {onClose && (
        <div className="p-3 border-t border-slate-100 dark:border-(--card-border-color) [@media(min-width:1600px)]:hidden">
          <Button
            onClick={onClose}
            className="w-full h-10 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 dark:text-gray-400 bg-slate-50 dark:bg-(--dark-body) hover:bg-slate-100 dark:hover:bg-(--table-hover) transition-colors"
          >
            <X size={15} />
            {t("close_menu")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ReplyMaterialsSidebar;
