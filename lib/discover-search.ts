import { getSupabaseDataClient } from "@/lib/supabase/data-client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchActiveProfiles, type UserProfile } from "@/lib/profiles";
import { DEMO_POSTS, type AudioPost } from "@/lib/scene";

export interface DiscoverArtistHit {
  user_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  city: string;
  genre: string;
}

function db() {
  const supabase = getSupabaseDataClient();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

function searchUnavailable() {
  return !isSupabaseConfigured() || !getSupabaseDataClient();
}

function escapeIlike(value: string): string {
  return value.replace(/[%_\\]/g, "");
}

function matchesQuery(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

function filterDemoTracks(query: string, genre: string): AudioPost[] {
  const q = query.toLowerCase();
  return DEMO_POSTS.filter((post) => {
    const matchGenre = genre === "ALL" || post.genre === genre;
    const matchQuery =
      matchesQuery(post.title, q) ||
      matchesQuery(post.genre, q) ||
      matchesQuery(post.author_display_name ?? "", q) ||
      matchesQuery(post.author_username ?? "", q);
    return matchGenre && matchQuery;
  });
}

function filterDemoArtists(profiles: UserProfile[], query: string, genre: string): DiscoverArtistHit[] {
  const q = query.toLowerCase();
  return profiles
    .filter((profile) => {
      const matchGenre = genre === "ALL" || profile.genre === genre;
      const matchQuery =
        matchesQuery(profile.display_name, q) ||
        matchesQuery(profile.username, q) ||
        matchesQuery(profile.city, q) ||
        matchesQuery(profile.genre, q);
      return matchGenre && matchQuery;
    })
    .map(toArtistHit);
}

function toArtistHit(profile: UserProfile): DiscoverArtistHit {
  return {
    user_id: profile.user_id,
    username: profile.username,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url || profile.cover_image_url,
    city: profile.city,
    genre: profile.genre,
  };
}

export async function searchDiscoverTracks(query: string, genre: string): Promise<AudioPost[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  if (searchUnavailable()) {
    return filterDemoTracks(trimmed, genre);
  }

  const pattern = `%${escapeIlike(trimmed)}%`;
  let request = db()
    .from("audio_posts")
    .select("*")
    .or(`title.ilike.${pattern},genre.ilike.${pattern}`)
    .order("created_at", { ascending: false })
    .limit(24);

  if (genre !== "ALL") {
    request = request.eq("genre", genre);
  }

  const { data, error } = await request;
  if (error) throw error;

  const rows = data ?? [];
  if (rows.length === 0) {
    return filterDemoTracks(trimmed, genre);
  }

  const userIds = Array.from(new Set(rows.map((row) => row.user_id)));
  const { data: profiles } = await db()
    .from("user_profiles")
    .select("user_id, username, display_name")
    .in("user_id", userIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));

  return rows.map((row) => {
    const profile = profileMap.get(row.user_id);
    return {
      ...row,
      author_username: profile?.username ?? undefined,
      author_display_name: profile?.display_name ?? undefined,
    };
  });
}

export async function searchDiscoverArtists(query: string, genre: string): Promise<DiscoverArtistHit[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const demoProfiles = await fetchActiveProfiles(50);

  if (searchUnavailable()) {
    return filterDemoArtists(demoProfiles, trimmed, genre);
  }

  const pattern = `%${escapeIlike(trimmed)}%`;
  let request = db()
    .from("user_profiles")
    .select("user_id, username, display_name, avatar_url, city, genre, cover_image_url")
    .or(`username.ilike.${pattern},display_name.ilike.${pattern},city.ilike.${pattern}`)
    .order("display_name", { ascending: true })
    .limit(24);

  if (genre !== "ALL") {
    request = request.eq("genre", genre);
  }

  const { data, error } = await request;
  if (error) throw error;

  const rows = (data ?? []) as (DiscoverArtistHit & { cover_image_url?: string })[];
  if (rows.length === 0) {
    return filterDemoArtists(demoProfiles, trimmed, genre);
  }

  return rows.map((row) => ({
    user_id: row.user_id,
    username: row.username,
    display_name: row.display_name,
    avatar_url: row.avatar_url || row.cover_image_url || "",
    city: row.city,
    genre: row.genre,
  }));
}
