import { createContext, useContext } from "react";
import { langMap, Locale } from "@/lib/lang/locales";

type LocaleContextType = {
  locale: Locale;
  t: (typeof langMap)[Locale];
};

export const LocaleContext = createContext<LocaleContextType>({
  locale: "en",
  t: langMap.en,
});

export const useLocaleContext = () => useContext(LocaleContext);
