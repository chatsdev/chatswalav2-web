"use client";

import { ShieldX } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * Renders a friendly "Access Denied" state when a user lacks the required
 * permission for a page or feature section.
 */
const AccessDenied = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
        <ShieldX className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-800 dark:text-white">
        {t("access_denied_title", "Access Denied")}
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
        {t(
          "access_denied_description",
          "You don't have permission to access this page. Please contact your administrator to request access."
        )}
      </p>
    </div>
  );
};

export default AccessDenied;
