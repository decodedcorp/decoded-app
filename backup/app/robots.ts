import { MetadataRoute } from "next";

const SITE_URL = "https://decoded.style";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/private/",
        "/details?*", // URL 파라미터가 있는 상세 페이지
        "/*.json$", // JSON 파일
        "/temp/", // 임시 페이지
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
