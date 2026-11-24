"use client";

import {
  createContext,
  cloneElement,
  useContext,
  useEffect,
  isValidElement,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/src/i18n/config";
import type en from "@/src/i18n/locales/en.json";
import enMessages from "@/src/i18n/locales/en.json";

export type Locale = "en" | "ar";
export type Theme = "light" | "dark";
type MessageKey = keyof typeof en;
type Preferences = {
  locale: Locale;
  theme: Theme;
  setLocale: (locale: Locale) => void;
  toggleTheme: () => void;
};
const Context = createContext<Preferences | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { i18n: translator } = useTranslation();
  const [theme, setThemeState] = useState<Theme>("light");
  const [preferencesReady, setPreferencesReady] = useState(false);
  const locale: Locale = translator.resolvedLanguage?.startsWith("ar")
    ? "ar"
    : "en";

  useEffect(() => {
    let cancelled = false;
    async function loadPreferences() {
      let savedLocale: string | null = null;
      let savedTheme: string | null = null;
      try {
        savedLocale = localStorage.getItem("ecommerce-locale");
        savedTheme = localStorage.getItem("ecommerce-theme");
      } catch {
        // Keep the default language and theme when browser storage is unavailable.
      }
      if (savedLocale === "ar" || savedLocale === "en")
        await i18n.changeLanguage(savedLocale);
      if (cancelled) return;
      if (savedTheme === "dark" || savedTheme === "light")
        setThemeState(savedTheme);
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        setThemeState("dark");
      setPreferencesReady(true);
    }
    void loadPreferences();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    try { localStorage.setItem("ecommerce-locale", locale); } catch { /* storage can be disabled */ }
  }, [locale, preferencesReady]);

  useEffect(() => {
    if (!preferencesReady) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    try { localStorage.setItem("ecommerce-theme", theme); } catch { /* storage can be disabled */ }
  }, [theme, preferencesReady]);

  const value: Preferences = {
    locale,
    theme,
    setLocale: (nextLocale) => {
      void i18n.changeLanguage(nextLocale);
    },
    toggleTheme: () =>
      setThemeState((current) => (current === "dark" ? "light" : "dark")),
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function usePreferences() {
  const value = useContext(Context);
  const { t } = useTranslation();
  if (!value)
    throw new Error("usePreferences must be used within PreferencesProvider");
  return { ...value, t };
}

export function LocalizedText({
  k,
  className,
}: {
  k: MessageKey;
  className?: string;
}) {
  const { t } = useTranslation();
  return <span className={className}>{t(k)}</span>;
}

const messageKeyByEnglish = new Map(
  Object.entries(enMessages).map(([key, value]) => [value, key]),
);

/** Translates static UI copy throughout server-rendered pages while leaving product/user data intact. */
export function LocalizedContent({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const localize = (value: ReactNode): ReactNode => {
    if (typeof value === "string") {
      const leading = value.match(/^\s*/)?.[0] ?? "";
      const trailing = value.match(/\s*$/)?.[0] ?? "";
      const content = value.trim();
      if (!content) return value;
      const key = messageKeyByEnglish.get(content);
      return key ? `${leading}${t(key as MessageKey)}${trailing}` : value;
    }
    if (Array.isArray(value)) return value.map((child) => localize(child));
    if (!isValidElement<Record<string, unknown>>(value)) return value;

    const props = value.props;
    const nextProps: Record<string, unknown> = {};
    for (const attribute of ["aria-label", "title", "placeholder"]) {
      const text = props[attribute];
      if (typeof text === "string") {
        const key = messageKeyByEnglish.get(text);
        if (key) nextProps[attribute] = t(key as MessageKey);
      }
    }
    if ("children" in props) nextProps.children = localize(props.children as ReactNode);
    return cloneElement(value, nextProps);
  };

  return <>{localize(children)}</>;
}
