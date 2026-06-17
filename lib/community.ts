import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { fetchProjectNeeds, fetchListeningRooms, type ProjectNeed, type ListeningRoom } from "@/lib/studio";

export type FeedKind = "post" | "jam" | "project" | "need" | "milestone";

export interface FeedItem {
  id: string;
  user_id: string;
  display_name: string;
  kind: FeedKind;
  title: string;
  body: string;
  ref_id?: string;
  href?: string;
  created_at: string;
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

export function communityUnavailable() {
  return !isSupabaseConfigured() || !getSupabase();
}

export async function createCommunityPost(
  userId: string,
  displayName: string,
  input: { kind?: FeedKind; title?: string; body: string; ref_id?: string }
): Promise<FeedItem> {
  const { data, error } = await db()
    .from("community_posts")
    .insert({
      user_id: userId,
      display_name: displayName,
      kind: input.kind ?? "post",
      title: input.title ?? "",
      body: input.body,
      ref_id: input.ref_id ?? "",
    })
    .select()
    .single();
  if (error) throw error;
  return mapPost(data);
}

export async function fetchCommunityPosts(limit = 30): Promise<FeedItem[]> {
  const { data, error } = await db()
    .from("community_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapPost);
}

export async function fetchUserPosts(userId: string, limit = 8): Promise<FeedItem[]> {
  const { data, error } = await db()
    .from("community_posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map(mapPost);
}

function mapPost(row: Record<string, unknown>): FeedItem {
  const kind = (row.kind as FeedKind) ?? "post";
  const ref = (row.ref_id as string) || undefined;
  let href: string | undefined;
  if (kind === "need" && ref) href = "/project-match";
  if (kind === "project" && ref) href = `/studio/projects/${ref}`;
  if (kind === "jam") href = "/blind-echo";
  if (kind === "milestone") href = "/community";

  return {
    id: row.id as string,
    user_id: row.user_id as string,
    display_name: (row.display_name as string) || "Musician",
    kind,
    title: (row.title as string) || "",
    body: row.body as string,
    ref_id: ref,
    href,
    created_at: row.created_at as string,
  };
}

function needToFeed(n: ProjectNeed): FeedItem {
  return {
    id: `need-${n.id}`,
    user_id: n.author_id,
    display_name: "Musician",
    kind: "need",
    title: n.title,
    body: `Looking for ${n.role}${n.genre ? ` · ${n.genre}` : ""}`,
    ref_id: n.id,
    href: "/project-match",
    created_at: n.created_at,
  };
}

function roomToFeed(r: ListeningRoom): FeedItem {
  return {
    id: `room-${r.id}`,
    user_id: r.creator_id,
    display_name: "Musician",
    kind: "post",
    title: `Listening room: ${r.title}`,
    body: [r.artist, r.album].filter(Boolean).join(" · ") || "Join the session",
    ref_id: r.id,
    href: `/listening-rooms/${r.id}`,
    created_at: r.created_at,
  };
}

/** Unified community feed: posts + recent needs + rooms */
export async function fetchCommunityFeed(limit = 40): Promise<FeedItem[]> {
  if (communityUnavailable()) return [];

  const [posts, needs, rooms] = await Promise.all([
    fetchCommunityPosts(limit).catch(() => [] as FeedItem[]),
    fetchProjectNeeds().catch(() => [] as ProjectNeed[]),
    fetchListeningRooms().catch(() => [] as ListeningRoom[]),
  ]);

  const merged: FeedItem[] = [
    ...posts,
    ...needs.filter((n) => n.status === "open").slice(0, 8).map(needToFeed),
    ...rooms.slice(0, 5).map(roomToFeed),
  ];

  merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return merged.slice(0, limit);
}

export const FEED_KIND_LABEL: Record<FeedKind, string> = {
  post: "Update",
  jam: "Jam",
  project: "Project",
  need: "Need",
  milestone: "Milestone",
};

export const FEED_KIND_COLOR: Record<FeedKind, string> = {
  post: "border-cj-gold-border text-cj-gold-muted",
  jam: "border-orange-500/40 text-orange-300",
  project: "border-blue-500/40 text-blue-300",
  need: "border-green-500/40 text-green-300",
  milestone: "border-cj-gold/60 text-cj-gold-bright",
};
