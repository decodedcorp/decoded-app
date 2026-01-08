"use client";

import { initSupabase, getSupabaseClient } from "@decoded/shared";

// In client components, NEXT_PUBLIC_* env vars are available at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file."
  );
}

// Initialize and export the browser client
export const supabaseBrowserClient = initSupabase(supabaseUrl, supabaseAnonKey);

// Re-export for convenience
export { getSupabaseClient };
