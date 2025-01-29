import { home as koHome } from "./ko/home";
import { home as enHome } from "./en/home";

export const langMap = {
  ko: { home: koHome },
  en: { home: enHome },
} as const;

export type Locale = keyof typeof langMap;
