"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dictionaries } from "./dictionary";

const STORAGE_KEY = "lang";
const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: (key) => key });

// Remembers the visitor's choice (English is the default for the first visit)
export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "bn" || saved === "en") setLangState(saved);
    } catch {
      /* storage blocked: stay in English */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key) => dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key, [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
export const useT = () => useContext(LanguageContext).t;
