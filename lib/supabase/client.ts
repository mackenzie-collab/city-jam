import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseConfig, isSupabaseConfigured } from "./config";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    const { url, anonKey } = getSupabaseConfig();
    client = createClient(url, anonKey, {
      realtime: { params: { eventsPerSecond: 10 } },
    });
  }
  return client;
}
