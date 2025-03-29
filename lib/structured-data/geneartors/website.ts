import { WebsiteSchema } from "../types/schema";

const SITE_URL = "https://decoded.style";

const websiteContent = {
  ko: {
    name: "DECODED - 아이템 검색 플랫폼",
    description: "궁금한 아이템을 요청하고 공유하세요",
  },
  en: {
    name: "DECODED - Item Search Platform",
    description: "Request and share items you're curious about",
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
