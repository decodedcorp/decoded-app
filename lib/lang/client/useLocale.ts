"use client";

import { useParams } from "next/navigation";
import { langMap, Locale } from "@/lib/lang/locales";

export function useLocale() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "ko";
  const t = langMap[locale];

  return {
    t,
    locale,
  };
}
