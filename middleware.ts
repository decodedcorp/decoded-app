import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { geolocation } from "@vercel/functions";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = new URL(request.url);

  // 지역 정보 확인
  let geoData;
  if (process.env.NODE_ENV === "development") {
    geoData = {
      country: "US",
    };
  } else {
    geoData = geolocation(request);
  }

  // Set locale based on country
  const locale = geoData.country === "KR" ? "ko" : "en";

  // Set default response
  const response = NextResponse.next();

  // Set locale related headers
  response.headers.set("x-locale", locale);
  response.headers.set("Content-Language", locale);

  // Handle URL redirect
  if (pathname === "/details" && searchParams.has("imageId")) {
    const imageId = searchParams.get("imageId");
    const itemId = searchParams.get("itemId");
    const showList = searchParams.get("showList");

    let newUrl = `/details/${imageId}`;

    const newParams = new URLSearchParams();
    if (itemId) newParams.set("itemId", itemId);
    if (showList) newParams.set("showList", showList);

    const queryString = newParams.toString();
    if (queryString) {
      newUrl += `?${queryString}`;
    }

    // Include locale header in redirect response
    const redirectResponse = NextResponse.redirect(
      new URL(newUrl, request.url)
    );
    redirectResponse.headers.set("x-locale", locale);
    redirectResponse.headers.set("Content-Language", locale);

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
