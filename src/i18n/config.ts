import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: { en: { translation: en }, ar: { translation: ar } },
    lng: "en",
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    initAsync: false,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

// Refresh bundled resources during development HMR without reinitializing the singleton.
i18n.addResourceBundle("en", "translation", en, true, true);
i18n.addResourceBundle("ar", "translation", ar, true, true);

export default i18n;
