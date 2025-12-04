'use client';

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { getEnv } from './env';

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');

// Singleton client for browser usage
// This client can be used in Client Components and will be reused across the app
export const supabaseBrowserClient = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

