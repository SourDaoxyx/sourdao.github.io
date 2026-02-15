"use client";

import { createContext, useContext, ReactNode } from "react";
import { translations } from "@/lib/translations";

interface LanguageContextType {
  language: "en";
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t = (key: string): string => {
    return translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language: "en", t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
