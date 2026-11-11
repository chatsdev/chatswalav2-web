/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ApiKeyConfig from "@/src/components/feature/setup/ApiKeyConfig";
import ConfigurationSummary from "@/src/components/feature/setup/ConfigurationSummary";
import ModelSelection from "@/src/components/feature/setup/ModelSelection";
import { Button } from "@/src/elements/ui/button";
import { Skeleton } from "@/src/elements/ui/skeleton";
import { useGetAllModelsQuery, useUpdateUserSettingsMutation } from "@/src/redux/api/settingsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { Form, Formik } from "formik";
import { Loader2, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const SetupManager = () => {
  const { t } = useTranslation();
  const { data: modelsData, isLoading: isLoadingModels } = useGetAllModelsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation();
  const { userSetting } = useAppSelector((state) => state.setting);

  const handleSave = async (values: { ai_model: string; api_key: string }) => {
    try {
      await updateSettings(values).unwrap();
      toast.success(t("setup_update_success"));
    } catch (error: any) {
      toast.error(error?.data?.message || t("setup_update_failed"));
    }
  };

  if (isLoadingModels || !userSetting) {
    return (
      <div className="space-y-8 animate-pulse max-w-4xl">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="p-6 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color) space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="flex items-center justify-between p-6 bg-white dark:bg-(--card-color) rounded-xl border border-slate-200/60 dark:border-(--card-border-color)">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  const initialValues = {
    ai_model: userSetting?.data?.ai_model || "",
    api_key: userSetting?.data?.api_key || "",
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSave} enableReinitialize>
      {({ values, setFieldValue, handleSubmit }) => {
        const currentModel = modelsData?.data?.models.find((m) => m._id === values.ai_model);

        return (
          <Form className="space-y-6 sm:space-y-8 px-4 [@media(max-width:600px)]:px-0 sm:px-6 lg:px-0" onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight text-primary">{t("ai_config_page_title")}</h1>
                <p className="text-slate-500 text-sm dark:text-gray-500">{t("ai_config_page_description")}</p>
              </div>
              <Button type="submit" disabled={isUpdating} className="h-11 px-8 rounded-lg bg-primary text-white font-bold shadow-lg shadow-primary/20 text-sm sm:text-base transition-all hover:scale-[1.02] active:scale-[0.98]">
                {isUpdating ? (
                  <>
                    <Loader2 size={18} className="mr-2 animate-spin" /> {t("updating")}
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" /> {t("save_changes")}
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                <ModelSelection models={modelsData?.data?.models || []} selectedModel={values.ai_model} onSelect={(id) => setFieldValue("ai_model", id)} />

              </div>

              <div className="space-y-6 sm:space-y-8">
                <ApiKeyConfig value={values.api_key} onChange={(val) => setFieldValue("api_key", val)} />
                <ConfigurationSummary currentModel={currentModel} hasApiKey={!!values.api_key} />
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default SetupManager;
