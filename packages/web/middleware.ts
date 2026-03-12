import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";
import { checkIsAdmin } from "@/lib/supabase/admin";

/**
 * Auth middleware:
 * - Refreshes Supabase session on matched routes (required for cookie-based auth)
 * - Protects /admin/*: redirects to home if not authenticated or not is_admin
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(req, res);

  // Must call getUser() to refresh session (updates cookies if needed)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Admin route protection
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    const isAdmin = await checkIsAdmin(supabase, user.id);
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    // Match all except static assets — session refresh + /admin protection
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
