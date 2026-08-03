import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client with Service Role key.
 * Use ONLY on the server side for privileged operations
 * (bypasses RLS, full database access).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
