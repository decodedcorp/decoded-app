'use client';

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Singleton client for browser usage
// This client can be used in Client Components and will be reused across the app
export const supabaseBrowserClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

