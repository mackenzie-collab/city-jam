import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface UserProfile {
  user_id: string;
  display_name: string;
  role: string;
  genre: string;
  city: string;
  bio: string;
  avatar_url: string;
  updated_at: string;
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

export function profilesUnavailable() {
  return !isSupabaseConfigured() || !getSupabase();
}

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await db()
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(
  userId: string,
  input: Partial<Omit<UserProfile, "user_id" | "updated_at">>
): Promise<UserProfile> {
  const { data, error } = await db()
    .from("user_profiles")
    .upsert({ user_id: userId, ...input, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchProfiles(userIds: string[]): Promise<Record<string, UserProfile>> {
  if (userIds.length === 0) return {};
  const { data, error } = await db().from("user_profiles").select("*").in("user_id", userIds);
  if (error) throw error;
  const map: Record<string, UserProfile> = {};
  for (const p of data ?? []) map[p.user_id] = p;
  return map;
}

export function displayName(profile: UserProfile | null, fallback?: string): string {
  return profile?.display_name || fallback || "Musician";
}
