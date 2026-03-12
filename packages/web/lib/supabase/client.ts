"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
}

/**
 * Typed Supabase client for browser use.
 * Uses createBrowserClient from @supabase/ssr — stores session in cookies
 * so the server middleware can read it for /admin protection.
 */
export const supabaseBrowserClient: SupabaseClient<Database> =
  createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Get the Supabase client instance
 * @deprecated Use supabaseBrowserClient directly
 */
export function getSupabaseClient(): SupabaseClient<Database> {
  return supabaseBrowserClient;
}
