"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("tr");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("mt-lang") : null;
    if (saved && (saved === "tr" || saved === "en")) {
      setLang(saved);
    }
  }, []);

  const switchLang = (newLang) => {
    setLang(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("mt-lang", newLang);
    }
  };

  const t = translations[lang] || translations.tr;

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LanguageContext);
  if (!context) {
    return { lang: "tr", switchLang: () => {}, t: translations.tr };
  }
  return context;
}
