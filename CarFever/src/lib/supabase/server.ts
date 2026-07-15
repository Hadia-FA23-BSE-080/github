import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value === 'placeholder') {
    throw new Error(
      `Missing or invalid environment variable: ${name}. ` +
        'Copy env.local.template to .env.local and add your Supabase credentials.'
    );
  }
  return value;
}

function getSupabaseUrl(): string {
  return requireEnv('NEXT_PUBLIC_SUPABASE_URL');
}

/**
 * Server-side client using the anon key.
 * Respects RLS — use for public reads in Server Components / Route Handlers.
 */
export function createServerClient(): SupabaseClient<Database> {
  return createClient<Database>(
    getSupabaseUrl(),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Server-side client using the service role key.
 * Bypasses RLS — use ONLY in Server Actions for admin mutations and trusted writes.
 * NEVER import this in client components.
 */
export function createServiceRoleClient(): SupabaseClient<Database> {
  return createClient<Database>(
    getSupabaseUrl(),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}

/**
 * Returns true when Supabase env vars are configured (not placeholders).
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url && url !== 'placeholder' &&
    anon && anon !== 'placeholder' &&
    service && service !== 'placeholder'
  );
}
