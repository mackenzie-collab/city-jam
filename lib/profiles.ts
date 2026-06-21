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
  username: string;
  manifesto_quote: string;
  cover_image_url: string;
  featured_track_id: string | null;
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

const DEMO_PROFILES: UserProfile[] = [
  {
    user_id: "demo-user-1",
    display_name: "Night Operator",
    username: "nightoperator",
    role: "PRODUCER",
    genre: "ELECTRONIC",
    city: "Berlin",
    bio: "Modular synth. No masters.",
    avatar_url: "",
    status_text: "In the lab layering drones",
    status_artist: "",
    status_mood: "recording",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Sound is the only honest language.",
    cover_image_url: "/images/09_electronic_dj.png",
    featured_track_id: "demo-1",
  },
  {
    user_id: "demo-user-2",
    display_name: "Keys & Smoke",
    username: "keysandsmoke",
    role: "KEYS",
    genre: "JAZZ",
    city: "New Orleans",
    bio: "Piano in dim rooms.",
    avatar_url: "",
    status_text: "Looking for a drummer",
    status_artist: "",
    status_mood: "open-to-collab",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Every note is a confession.",
    cover_image_url: "/images/07_jazz_pianist.png",
    featured_track_id: "demo-2",
  },
  {
    user_id: "demo-user-3",
    display_name: "Beat Architect",
    username: "beatarchitect",
    role: "VOCALS",
    genre: "HIP-HOP",
    city: "London",
    bio: "Beatboxer turned producer.",
    avatar_url: "",
    status_text: "Writing new material",
    status_artist: "",
    status_mood: "writing",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "The city speaks in rhythm.",
    cover_image_url: "/images/05_beatboxer.png",
    featured_track_id: "demo-3",
  },
];

export async function fetchProfile(userId: string): Promise<UserProfile | null> {
  if (profilesUnavailable()) {
    return DEMO_PROFILES.find((p) => p.user_id === userId) ?? null;
  }
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
  if (profilesUnavailable()) {
    return DEMO_PROFILES.slice(0, limit);
  }
  const { data, error } = await db()
    .from("user_profiles")
    .select("*")
    .neq("status_text", "")
    .order("status_updated_at", { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  const rows = data ?? [];
  return rows.length > 0 ? rows : DEMO_PROFILES.slice(0, limit);
}

export async function syncAuthProfile(userId: string, displayName: string): Promise<void> {
  if (profilesUnavailable()) return;
  const existing = await fetchProfile(userId);
  const placeholder = new Set(["", "Musician", "Guest Musician", "Guest"]);
  const name = displayName?.trim();
  if (!name || placeholder.has(name)) return;

  if (!existing || placeholder.has(existing.display_name)) {
    await upsertProfile(userId, { display_name: name });
  }
  if (!existing?.username) {
    await ensureUsername(userId, name);
  }
}

export function displayName(profile: UserProfile | null, fallback?: string): string {
  return profile?.display_name || fallback || "Musician";
}

export function formatStatus(profile: UserProfile | null): string | null {
  if (!profile?.status_text) return null;
  return profile.status_text;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24) || "musician";
}

export async function fetchProfileByUsername(username: string): Promise<UserProfile | null> {
  if (profilesUnavailable()) {
    return DEMO_PROFILES.find((p) => p.username === username) ?? null;
  }
  const { data, error } = await db()
    .from("user_profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function ensureUsername(userId: string, displayName: string): Promise<string> {
  const existing = await fetchProfile(userId);
  if (existing?.username) return existing.username;

  let base = slugify(displayName);
  let candidate = base;
  let attempt = 0;

  while (attempt < 10) {
    const taken = await fetchProfileByUsername(candidate);
    if (!taken || taken.user_id === userId) {
      await upsertProfile(userId, { display_name: displayName, username: candidate });
      return candidate;
    }
    attempt += 1;
    candidate = `${base}${attempt}`;
  }

  const fallback = `${base}${Date.now().toString(36).slice(-4)}`;
  await upsertProfile(userId, { display_name: displayName, username: fallback });
  return fallback;
}

export async function uploadCoverImage(userId: string, file: File): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Storage not configured");

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("covers").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw error;

  const { data } = supabase.storage.from("covers").getPublicUrl(path);
  return data.publicUrl;
}
