"use client";

import { Button } from "@/src/elements/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/src/elements/ui/dropdown-menu";
import { languageApi, useGetAllLanguagesQuery, useLazyGetTranslationsQuery } from "@/src/redux/api/languageApi";
import { useAppDispatch } from "@/src/redux/hooks";
import { setRTL } from "@/src/redux/reducers/layoutSlice";
import { loadTranslations } from "@/src/utils/i18nLoader";
import { Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Flag } from "../shared/Flag";
import { getResolvedImageUrl } from "@/src/utils/image";

const LANGUAGE_STORAGE_KEY = "selected_language";
const ImageBaseUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

const LanguageDropdown = ({ onDark = false }: { onDark?: boolean }) => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const currentLocale = i18n.language || i18n.resolvedLanguage || "en";
  const [isChanging, setIsChanging] = useState(false);

  const { data: languagesData, isLoading: isLoadingLanguages } = useGetAllLanguagesQuery({ status: true });

  const [getTranslations] = useLazyGetTranslationsQuery();

  const activeLanguages = useMemo(() => languagesData?.data?.languages ?? [], [languagesData]);

  const currentLang = useMemo(() => activeLanguages.find((l) => l.locale === currentLocale), [activeLanguages, currentLocale]);

  const handleLanguageChange = async (locale: string, langId: string, isRtl: boolean) => {
    if (locale === currentLocale || isChanging) return;

    setIsChanging(true);
    try {
      const result = await getTranslations(locale).unwrap();
      if (result?.success && result.data) {
        // Only apply 'front' translations for the frontend
        const frontTranslations = result.data.front?.translation || result.data.front || result.data;
        loadTranslations(locale, frontTranslations);
      } else {
        throw new Error("Empty translation response");
      }

      await i18n.changeLanguage(locale);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);

      dispatch(setRTL(isRtl));

      toast.success(`Language changed to ${locale.toUpperCase()}`);
    } catch {
      toast.error("Failed to change language. Please try again.");
    } finally {
      setIsChanging(false);
    }
  };

  const isBusy = isChanging || isLoadingLanguages;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" disabled={isBusy} className={`bg-transparent shadow-sm flex items-center gap-1.5 px-2 sm:px-3 py-2.5 rounded-lg cursor-pointer transition-colors border-none disabled:opacity-50 disabled:cursor-not-allowed ${onDark ? "text-white hover:bg-white/10 hover:text-white!" : "text-slate-900 dark:text-amber-50 hover:bg-gray-100 dark:bg-(--page-body-bg) dark:hover:bg-(--table-hover)"}`}>
          {isBusy ? (
            <Loader2 size={20} className="animate-spin" />
          ) : currentLang?.flag ? (
            <div className="w-6 h-4 relative rounded-xs overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
              <Image src={getResolvedImageUrl(currentLang.flag)} alt={currentLang.name} fill className="object-cover" unoptimized />
            </div>
          ) : (
            <Flag countryCode={currentLang?.locale === "en" ? "us" : currentLang?.locale || ""} size={18} />
          )}
          <span className="text-sm font-medium hidden sm:inline uppercase">{currentLocale}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 max-h-80 overflow-y-auto bg-white dark:bg-(--card-color) custom-scrollbar border border-gray-200 dark:border-(--card-border-color) shadow-xl rounded-lg p-1">
        {activeLanguages.length === 0 ? (
          <div className="px-3 py-4 text-sm text-center text-slate-400">No languages available</div>
        ) : (
          activeLanguages.map((lang) => {
            const isActive = currentLocale.toLowerCase() === lang.locale.toLowerCase();
            return (
              <DropdownMenuItem key={lang._id} disabled={isChanging} onClick={() => handleLanguageChange(lang.locale, lang._id, lang.is_rtl)} className={`cursor-pointer rounded-md flex items-center gap-2.5 p-2 mb-0.5 last:mb-0 transition-colors ${isActive ? "bg-green-50 text-primary dark:bg-primary-darker/20 dark:text-primary focus:bg-green-50 dark:focus:bg-primary-darker/20" : "hover:bg-slate-50 dark:hover:bg-(--dark-sidebar) focus:bg-slate-50 dark:focus:bg-(--focus-bg-color)/30"}`}>
                <div className="w-6 h-4 relative rounded-xs overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">{lang.flag ? <Image src={getResolvedImageUrl(lang.flag)} alt={lang.name} fill className="object-cover" unoptimized /> : <Flag countryCode={lang.locale === "en" ? "us" : lang.locale} size={18} />}</div>

                <span className="flex-1 text-sm font-medium">{lang.name}</span>

                {isActive && <Check size={15} className="text-primary shrink-0" />}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageDropdown;
