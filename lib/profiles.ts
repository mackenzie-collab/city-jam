import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createCommunityPost } from "@/lib/community";

export type StatusMood = "listening" | "writing" | "recording" | "open-to-collab" | "";

export interface UserProfile {
  user_id: string;
  display_name: string;
  role: string;
  genre: string;
  city: string;
  bio: string;
  avatar_url: string;
  status_text: string;
  status_artist: string;
  status_mood: StatusMood;
  status_updated_at: string | null;
  updated_at: string;
}

export interface ProfileStatusInput {
  status_text: string;
  status_artist?: string;
  status_mood?: StatusMood;
}

export const STATUS_MOODS: { value: StatusMood; label: string }[] = [
  { value: "listening", label: "Listening" },
  { value: "writing", label: "Writing" },
  { value: "recording", label: "Recording" },
  { value: "open-to-collab", label: "Open to collab" },
];

export const STATUS_PRESETS: { text: string; artist?: string; mood?: StatusMood }[] = [
  { text: "Currently deep in Floating Points", artist: "Floating Points", mood: "listening" },
  { text: "Looking for a drummer", mood: "open-to-collab" },
  { text: "In the studio mixing", mood: "recording" },
  { text: "Writing new material", mood: "writing" },
  { text: "Open to remote collab", mood: "open-to-collab" },
];

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
  input: Partial<Omit<UserProfile, "user_id" | "updated_at" | "status_updated_at">>
): Promise<UserProfile> {
  const { data, error } = await db()
    .from("user_profiles")
    .upsert({ user_id: userId, ...input, updated_at: new Date().toISOString() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfileStatus(
  userId: string,
  input: ProfileStatusInput,
  displayName: string
): Promise<UserProfile> {
  const now = new Date().toISOString();
  const payload = {
    status_text: input.status_text.trim(),
    status_artist: (input.status_artist ?? "").trim(),
    status_mood: input.status_mood ?? ("" as StatusMood),
    status_updated_at: now,
    updated_at: now,
  };

  const existing = await fetchProfile(userId);
  let profile: UserProfile;

  if (existing) {
    const { data, error } = await db()
      .from("user_profiles")
      .update(payload)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    profile = data;
  } else {
    profile = await upsertProfile(userId, {
      display_name: displayName,
      ...payload,
    });
  }

  if (payload.status_text) {
    await createCommunityPost(userId, displayName, {
      kind: "milestone",
      title: "Status update",
      body: payload.status_text,
    }).catch(() => undefined);
  }

  return profile;
}

export async function fetchProfiles(userIds: string[]): Promise<Record<string, UserProfile>> {
  if (userIds.length === 0) return {};
  const { data, error } = await db().from("user_profiles").select("*").in("user_id", userIds);
  if (error) throw error;
  const map: Record<string, UserProfile> = {};
  for (const p of data ?? []) map[p.user_id] = p;
  return map;
}

export async function fetchActiveProfiles(limit = 50): Promise<UserProfile[]> {
  const { data, error } = await db()
    .from("user_profiles")
    .select("*")
    .neq("status_text", "")
    .order("status_updated_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export function displayName(profile: UserProfile | null, fallback?: string): string {
  return profile?.display_name || fallback || "Musician";
}

export function formatStatus(profile: UserProfile | null): string | null {
  if (!profile?.status_text) return null;
  return profile.status_text;
}
