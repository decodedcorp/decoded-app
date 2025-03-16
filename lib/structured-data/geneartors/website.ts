import { WebsiteSchema } from "../types/schema";
import { Locale } from "@/lib/lang/locales";

const SITE_URL = "https://decoded.style";

const websiteContent = {
  ko: {
    name: "DECODED - 패션 아이템 검색 플랫폼",
    description: "궁금한 패션 아이템을 찾고 공유하세요",
  },
  en: {
    name: "DECODED - Item Search Platform",
    description: "Discover and share items",
  },
} as const;

export function generateWebsiteSchema(): WebsiteSchema {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DECODED",
    url: SITE_URL,
    // TODO: After implement Search page, activate this
    // potentialAction: {
    //   "@type": "SearchAction",
    //   target: `${SITE_URL}/search?q={search_term_string}`,
    //   "query-input": "required name=search_term_string",
    // },
  };
}
