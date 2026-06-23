import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabase } from "@/lib/supabase/client";
import { getSupabaseConfig, isSupabaseConfigured } from "@/lib/supabase/config";

let serverDataClient: SupabaseClient | null = null;

/**
 * Shared read/write Supabase client for data modules.
 * Uses the browser SSR client in the client bundle and a cookie-less anon
 * client during Server Components / route handlers to avoid RSC crashes.
 */
export function getSupabaseDataClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (typeof window !== "undefined") {
    return getSupabase();
  }

  if (!serverDataClient) {
    const { url, anonKey } = getSupabaseConfig();
    serverDataClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return serverDataClient;
}
