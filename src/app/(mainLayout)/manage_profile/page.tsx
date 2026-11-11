"use client";

import { Button } from "@/src/elements/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import ProfileForm from "@/src/components/profile/ProfileForm";
import ChangePasswordForm from "@/src/components/profile/ChangePasswordForm";
import { useTranslation } from "react-i18next";

const AccountProfilePage = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-lg bg-white dark:bg-(--card-color) shadow-sm border border-slate-200 dark:border-(--card-border-color) hover:bg-slate-50 dark:hover:bg-(--table-hover) transition-all">
          <ArrowLeft size={20} className="text-slate-600 dark:text-gray-400" />
        </Button>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary">{t("manage_profile_page_title")}</h1>
          <p className="text-sm text-slate-500 dark:text-gray-500">{t("manage_profile_page_description")}</p>
        </div>
      </div>

      <ProfileForm />
      <ChangePasswordForm />
    </div>
  );
};

export default AccountProfilePage;
