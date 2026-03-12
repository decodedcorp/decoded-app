import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "./types";
import { getEnv } from "./env";

const supabaseUrl = getEnv("NEXT_PUBLIC_SUPABASE_URL");
const supabaseAnonKey = getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");

/**
 * Creates a Supabase client for use in Next.js middleware.
 *
 * Uses @supabase/ssr for cookie-based auth. Call getUser() (not getSession())
 * to refresh the session before returning the response.
 */
export function createSupabaseMiddlewareClient(
  req: NextRequest,
  res: NextResponse
) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          req.cookies.set(name, value);
          res.cookies.set(name, value, options);
        });
      },
    },
  });
}
