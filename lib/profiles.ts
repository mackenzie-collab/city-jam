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
  {
    user_id: "demo-user-4",
    display_name: "Aria Volkov",
    username: "ariavolkov",
    role: "STRINGS",
    genre: "CLASSICAL",
    city: "Vienna",
    bio: "Violinist. Rehearsal hall regular.",
    avatar_url: "",
    status_text: "Currently deep in Bach partitas",
    status_artist: "Bach",
    status_mood: "listening",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Precision is rebellion.",
    cover_image_url: "/images/04_classical_violinist.png",
    featured_track_id: "demo-4",
  },
  {
    user_id: "demo-user-5",
    display_name: "Low End Theory",
    username: "lowendtheory",
    role: "PRODUCER",
    genre: "HIP-HOP",
    city: "Detroit",
    bio: "Sample digger. MPC purist.",
    avatar_url: "",
    status_text: "In the studio mixing",
    status_artist: "",
    status_mood: "recording",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Dust is data.",
    cover_image_url: "/images/06_hiphop_producer.png",
    featured_track_id: "demo-5",
  },
  {
    user_id: "demo-user-6",
    display_name: "Meadow Lark",
    username: "meadowlark",
    role: "VOCALS",
    genre: "FOLK",
    city: "Asheville",
    bio: "Songwriter. Porch sessions only.",
    avatar_url: "",
    status_text: "Writing new material",
    status_artist: "",
    status_mood: "writing",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Quiet rooms, loud truths.",
    cover_image_url: "/images/08_folk_songwriter.png",
    featured_track_id: "demo-6",
  },
  {
    user_id: "demo-user-7",
    display_name: "Soprano Null",
    username: "soprano_null",
    role: "VOCALS",
    genre: "CLASSICAL",
    city: "Milan",
    bio: "Opera singer. Dry room recordings.",
    avatar_url: "",
    status_text: "Currently deep in Puccini",
    status_artist: "Puccini",
    status_mood: "listening",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Voice without vanity.",
    cover_image_url: "/images/10_opera_singer.png",
    featured_track_id: "demo-7",
  },
  {
    user_id: "demo-user-8",
    display_name: "Carmen Reyes",
    username: "carmenreyes",
    role: "GUITAR",
    genre: "WORLD",
    city: "Seville",
    bio: "Flamenco guitarist. Duende chaser.",
    avatar_url: "",
    status_text: "Open to remote collab",
    status_artist: "",
    status_mood: "open-to-collab",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Fire in the fingers.",
    cover_image_url: "/images/11_flamenco_guitarist.png",
    featured_track_id: "demo-8",
  },
  {
    user_id: "demo-user-9",
    display_name: "Section Eight",
    username: "sectioneight",
    role: "BRASS",
    genre: "JAZZ",
    city: "Chicago",
    bio: "Brass section. Subway platform jams.",
    avatar_url: "",
    status_text: "Looking for a drummer",
    status_artist: "",
    status_mood: "open-to-collab",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Horns up, ego down.",
    cover_image_url: "/images/12_brass_ensemble.png",
    featured_track_id: "demo-9",
  },
  {
    user_id: "demo-user-10",
    display_name: "Sleepwalker",
    username: "sleepwalker",
    role: "PRODUCER",
    genre: "ELECTRONIC",
    city: "Tokyo",
    bio: "Bedroom producer. 2AM sessions.",
    avatar_url: "",
    status_text: "In the lab layering drones",
    status_artist: "",
    status_mood: "recording",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Loops until dawn.",
    cover_image_url: "/images/13_bedroom_producer.png",
    featured_track_id: "demo-10",
  },
  {
    user_id: "demo-user-11",
    display_name: "Dev Sharma",
    username: "devsharma",
    role: "PERCUSSION",
    genre: "WORLD",
    city: "Mumbai",
    bio: "Tabla player. Polyrhythm obsessive.",
    avatar_url: "",
    status_text: "Writing new material",
    status_artist: "",
    status_mood: "writing",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Every beat has a name.",
    cover_image_url: "/images/14_tabla_player.png",
    featured_track_id: "demo-11",
  },
  {
    user_id: "demo-user-12",
    display_name: "Static Saint",
    username: "staticsaint",
    role: "BASS",
    genre: "ROCK",
    city: "Portland",
    bio: "Bassist. Distortion as prayer.",
    avatar_url: "",
    status_text: "In the studio mixing",
    status_artist: "",
    status_mood: "recording",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Volume is honesty.",
    cover_image_url: "/images/15_rock_bassist.png",
    featured_track_id: "demo-12",
  },
  {
    user_id: "demo-user-13",
    display_name: "The Collective",
    username: "thecollective",
    role: "VOCALS",
    genre: "CLASSICAL",
    city: "London",
    bio: "Choir conductor. Unfinished is fine.",
    avatar_url: "",
    status_text: "Currently deep in Arvo Pärt",
    status_artist: "Arvo Pärt",
    status_mood: "listening",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Many voices, one signal.",
    cover_image_url: "/images/16_choir_conductor.png",
    featured_track_id: "demo-13",
  },
  {
    user_id: "demo-user-14",
    display_name: "Volt Crawler",
    username: "voltcrawler",
    role: "PRODUCER",
    genre: "ELECTRONIC",
    city: "Amsterdam",
    bio: "Modular synth. No computer.",
    avatar_url: "",
    status_text: "In the lab layering drones",
    status_artist: "",
    status_mood: "recording",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Patch until it screams.",
    cover_image_url: "/images/17_modular_synth.png",
    featured_track_id: "demo-14",
  },
  {
    user_id: "demo-user-15",
    display_name: "East River Strings",
    username: "eastriverstrings",
    role: "STRINGS",
    genre: "CLASSICAL",
    city: "New York",
    bio: "String quartet. First read-throughs only.",
    avatar_url: "",
    status_text: "Open to remote collab",
    status_artist: "",
    status_mood: "open-to-collab",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Four bows, one breath.",
    cover_image_url: "/images/18_string_quartet.png",
    featured_track_id: "demo-15",
  },
  {
    user_id: "demo-user-16",
    display_name: "Global Jam",
    username: "globaljam",
    role: "PRODUCER",
    genre: "ELECTRONIC",
    city: "Remote",
    bio: "Cross-city sessions. Musicians worldwide.",
    avatar_url: "",
    status_text: "Open to remote collab",
    status_artist: "",
    status_mood: "open-to-collab",
    status_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    manifesto_quote: "Distance is just latency.",
    cover_image_url: "/images/musician_jamming_global_v2.png",
    featured_track_id: "demo-16",
  },
];

const DEMO_COVER_BY_USER_ID = Object.fromEntries(
  DEMO_PROFILES.map((p) => [p.user_id, p.cover_image_url])
) as Record<string, string>;

const DEMO_COVER_BY_USERNAME = Object.fromEntries(
  DEMO_PROFILES.map((p) => [p.username, p.cover_image_url])
) as Record<string, string>;

/** Resolve cover art from demo seed data when DB rows omit cover_image_url. */
export function demoCoverForProfile(profile: Pick<UserProfile, "user_id" | "username" | "cover_image_url">): string {
  if (profile.cover_image_url) return profile.cover_image_url;
  return DEMO_COVER_BY_USER_ID[profile.user_id] ?? DEMO_COVER_BY_USERNAME[profile.username] ?? "";
}

function enrichProfileCovers(profiles: UserProfile[]): UserProfile[] {
  return profiles.map((p) => ({
    ...p,
    cover_image_url: demoCoverForProfile(p),
  }));
}

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
  const merged = rows.length > 0 ? enrichProfileCovers(rows) : DEMO_PROFILES.slice(0, limit);
  return merged.length > 0 ? merged : DEMO_PROFILES.slice(0, limit);
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
