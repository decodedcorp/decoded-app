import { headers } from "next/headers";
import { langMap, Locale } from "../locales";

export async function getLocale() {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const locale = pathname.startsWith("/en") ? "en" : "ko";
  const t = langMap[locale as Locale];

  return {
    t,
    locale,
  };
}
