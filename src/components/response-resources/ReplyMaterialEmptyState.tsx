"use client";

import { TYPE_ICON, TYPE_LABEL_KEY } from "@/src/data/responseResource";
import { Button } from "@/src/elements/ui/button";
import {
  ReplyMaterialEmptyStateProps
} from "@/src/types/replyMaterial";
import {
  Plus
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ReplyMaterialEmptyState: React.FC<ReplyMaterialEmptyStateProps> = ({
  type,
  onAdd,
}) => {
  const { t } = useTranslation();
  const label = t(TYPE_LABEL_KEY[type]);

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-6">
      <div className="w-20 h-20 rounded-lg bg-slate-50 dark:bg-(--page-body-bg) flex items-center justify-center text-slate-300 dark:text-gray-500 mb-6 border border-slate-100 dark:border-(--card-border-color)">
        {TYPE_ICON[type]}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 tracking-tight">
        {t("no_items_yet", { type: label })}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs font-medium mb-6">
        {t("add_first_item_desc", { type: label })}
      </p>
      <Button
        onClick={onAdd}
        className="flex items-center gap-2 bg-primary text-white px-5 h-11 rounded-lg font-semibold text-sm active:scale-95 transition-all"
      >
        <Plus size={18} />
        {t("add")} {label}
      </Button>
    </div>
  );
};

export default ReplyMaterialEmptyState;
