import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslation from "@/src/locales/en/translation.json";

const getSavedLanguage = (): string => {
  if (typeof window === "undefined") return "en";
  try {
    return localStorage.getItem("selected_language") || "en";
  } catch {
    return "en";
  }
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslation as Record<string, unknown> },
  },
  lng: getSavedLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
