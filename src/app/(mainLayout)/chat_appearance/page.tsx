/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BackgroundSettings from "@/src/components/components/BackgroundSettings";
import ChatPreview from "@/src/components/components/ChatPreview";
import ColorSettings from "@/src/components/components/ColorSettings";
import ThemePresets from "@/src/components/components/ThemePresets";
import { Button } from "@/src/elements/ui/button";
import { useGetUserSettingsQuery, useUpdateUserSettingsMutation } from "@/src/redux/api/settingsApi";
import { useAppSelector } from "@/src/redux/hooks";
import { FormValues, ThemePreset } from "@/src/types/chatTheme";
import { Loader2, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const ChatThemePage = () => {
  const { t } = useTranslation();
  const { isLoading: isLoadingSettings } = useGetUserSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateUserSettingsMutation();
  const { userSetting } = useAppSelector((state) => state.setting);

  const [formValues, setFormValues] = useState<FormValues>({
    theme_color: null,
    user_bubble_color: null,
    contact_bubble_color: null,
    bg_color: null,
    bg_image: null,
    user_text_color: null,
    contact_text_color: null,
  });

  const [bgType, setBgType] = useState<"color" | "image">("color");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [presetType, setPresetType] = useState<"light" | "dark">("light");

  useEffect(() => {
    if (userSetting?.data) {
      const { theme_color, user_bubble_color, contact_bubble_color, bg_color, bg_image, user_text_color, contact_text_color } = userSetting.data;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormValues({
        theme_color: theme_color || "var(--whatsapp-teal)",
        user_bubble_color: user_bubble_color || "var(--whatsapp-light)",
        contact_bubble_color: contact_bubble_color || "var(--background)",
        bg_color: bg_color || "var(--background)",
        bg_image: bg_image || null,
        user_text_color: user_text_color || "var(--black)",
        contact_text_color: contact_text_color || "var(--black)",
      });
      if (bg_image) {
        setBgType("image");
        const API_URL = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";
        const cleanUrl = bg_image.replace(/\\/g, "/").startsWith("/") ? bg_image.replace(/\\/g, "/") : `/${bg_image.replace(/\\/g, "/")}`;
        const baseUrl = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
        setImagePreview(bg_image.startsWith("http") ? bg_image : `${baseUrl}${cleanUrl}`);
      } else {
        setBgType("color");
      }
    }
  }, [userSetting]);

  const handleColorChange = (key: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleThemeSelect = (theme: ThemePreset) => {
    setFormValues({
      theme_color: theme.theme_color,
      user_bubble_color: theme.user_bubble,
      contact_bubble_color: theme.contact_bubble,
      bg_color: theme.bg_color,
      bg_image: null,
      user_text_color: theme.type === "dark" ? "var(--background)" : "var(--black)",
      contact_text_color: theme.type === "dark" ? "var(--background)" : "var(--black)",
    });
    setBgType("color");
    setImagePreview(null);
  };

  const handleResetDefault = () => {
    setFormValues({
      theme_color: null,
      user_bubble_color: null,
      contact_bubble_color: null,
      bg_color: null,
      bg_image: null,
      user_text_color: null,
      contact_text_color: null,
    });
    setBgType("color");
    setImagePreview(null);
    setPresetType("light");
    toast.info("Theme reset to system defaults. Save to apply.");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormValues((prev) => ({ ...prev, bg_image: file }));
      setImagePreview(URL.createObjectURL(file));
      setBgType("image");
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("theme_color", formValues.theme_color || "null");
      formData.append("user_bubble_color", formValues.user_bubble_color || "null");
      formData.append("contact_bubble_color", formValues.contact_bubble_color || "null");
      formData.append("user_text_color", formValues.user_text_color || "null");
      formData.append("contact_text_color", formValues.contact_text_color || "null");
      formData.append("bg_color", formValues.bg_color || "null");

      if (bgType === "image") {
        if (formValues.bg_image instanceof File) {
          formData.append("bg_image", formValues.bg_image);
        }
      } else {
        formData.append("bg_image", "null");
      }

      await updateSettings(formData).unwrap();
      toast.success(t("save_success") || "Theme saved successfully!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to save theme");
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-primary">{t("chat_theme_page_title")}</h1>
          <p className="text-slate-500 text-sm dark:text-gray-500">{t("chat_theme_page_description")}</p>
        </div>
        <Button onClick={handleSave} disabled={isUpdating} className="bg-primary text-white h-11 px-6 rounded-lg shadow-lg shadow-primary/20 active:scale-95 transition-all">
          {isUpdating ? <Loader2 size={18} className="mr-2 animate-spin" /> : <Save size={18} className="mr-2" />}
          {isUpdating ? t("saving") || "Saving..." : t("save_changes") || "Save Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div className="lg:col-span-7 space-y-6">
          <ThemePresets t={t} presetType={presetType} setPresetType={setPresetType} formValues={formValues} bgType={bgType} handleThemeSelect={handleThemeSelect} onResetDefault={handleResetDefault} />
          <ColorSettings t={t} formValues={formValues} handleColorChange={handleColorChange} />
          <BackgroundSettings t={t} bgType={bgType} setBgType={setBgType} formValues={formValues} imagePreview={imagePreview} setImagePreview={setImagePreview} handleColorChange={handleColorChange} handleImageChange={handleImageChange} setFormValues={setFormValues} />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <ChatPreview formValues={formValues} bgType={bgType} imagePreview={imagePreview} />
        </div>
      </div>
    </div>
  );
};

export default ChatThemePage;
