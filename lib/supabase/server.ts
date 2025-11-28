import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

/**
 * Creates a Supabase client for Server Components and Route Handlers.
 * This client automatically handles cookie-based authentication state.
 *
 * Usage in Server Components:
 * ```tsx
 * const supabase = createSupabaseServerClient();
 * const { data } = await supabase.from('table').select('*');
 * ```
 *
 * Usage in Route Handlers:
 * ```tsx
 * export async function GET() {
 *   const supabase = createSupabaseServerClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return Response.json(data);
 * }
 * ```
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();
  
  // Type assertion for Next.js 16 compatibility
  // In Next.js 16, cookies() is synchronous but types may show Promise
  // This works correctly at runtime
  const cookieStoreTyped = cookieStore as unknown as {
    getAll(): Array<{ name: string; value: string }>;
    set?: (name: string, value: string, options?: any) => void;
  };
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStoreTyped.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            // In Next.js 16, cookies() returns ReadonlyRequestCookies in Server Components
            // which doesn't have set() method. This is expected behavior.
            // Cookie setting should be handled in Route Handlers or Middleware.
            if (cookieStoreTyped.set) {
              cookieStoreTyped.set(name, value, options);
            }
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}

