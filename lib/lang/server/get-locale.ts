import { headers } from "next/headers";
import { langMap, Locale } from "../locales";

export async function getLocale() {
  const headersList = await headers();
  const locale = (headersList.get("x-locale") || "en") as Locale;
  const t = langMap[locale];

  return {
    t,
    locale,
  };
}
