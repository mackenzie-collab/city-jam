import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface AudioPost {
  id: string;
  user_id: string;
  title: string;
  caption: string;
  genre: string;
  audio_url: string;
  cover_url: string;
  play_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  author_username?: string;
  author_display_name?: string;
}

export interface AudioComment {
  id: string;
  post_id: string;
  user_id: string;
  display_name: string;
  body: string;
  created_at: string;
}

function db() {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

export function sceneUnavailable() {
  return !isSupabaseConfigured() || !getSupabase();
}

export const DEMO_POSTS: AudioPost[] = [
  {
    id: "demo-1",
    user_id: "demo-user-1",
    title: "Midnight Signal",
    caption: "Late-night synth sketch from the vault.",
    genre: "ELECTRONIC",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover_url: "/images/09_electronic_dj.png",
    play_count: 142,
    like_count: 23,
    comment_count: 5,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    author_username: "nightoperator",
    author_display_name: "Night Operator",
  },
  {
    id: "demo-2",
    user_id: "demo-user-2",
    title: "Basement Tape #4",
    caption: "Raw jazz piano — unmixed, unapologetic.",
    genre: "JAZZ",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover_url: "/images/07_jazz_pianist.png",
    play_count: 89,
    like_count: 17,
    comment_count: 3,
    created_at: new Date(Date.now() - 7200000).toISOString(),
    author_username: "keysandsmoke",
    author_display_name: "Keys & Smoke",
  },
  {
    id: "demo-3",
    user_id: "demo-user-3",
    title: "City Static",
    caption: "Beatbox loop layered with field recordings.",
    genre: "HIP-HOP",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover_url: "/images/05_beatboxer.png",
    play_count: 256,
    like_count: 41,
    comment_count: 8,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    author_username: "beatarchitect",
    author_display_name: "Beat Architect",
  },
];

async function enrichPosts(posts: AudioPost[]): Promise<AudioPost[]> {
  if (posts.length === 0) return posts;
  const userIds = Array.from(new Set(posts.map((p) => p.user_id)));
  const { data: profiles } = await db()
    .from("user_profiles")
    .select("user_id, username, display_name")
    .in("user_id", userIds);
  const map = new Map((profiles ?? []).map((p) => [p.user_id, p]));
  return posts.map((p) => {
    const prof = map.get(p.user_id);
    return {
      ...p,
      author_username: prof?.username ?? undefined,
      author_display_name: prof?.display_name ?? undefined,
    };
  });
}

export async function fetchSceneFeed(opts?: {
  genre?: string;
  userId?: string;
  limit?: number;
}): Promise<AudioPost[]> {
  if (sceneUnavailable()) return DEMO_POSTS;

  let q = db()
    .from("audio_posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 50);

  if (opts?.genre) q = q.eq("genre", opts.genre);
  if (opts?.userId) q = q.eq("user_id", opts.userId);

  const { data, error } = await q;
  if (error) throw error;
  const enriched = await enrichPosts(data ?? []);
  return enriched.length > 0 ? enriched : DEMO_POSTS;
}

export async function fetchAudioPost(id: string): Promise<AudioPost | null> {
  if (sceneUnavailable()) {
    return DEMO_POSTS.find((p) => p.id === id) ?? null;
  }
  const { data, error } = await db().from("audio_posts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [enriched] = await enrichPosts([data]);
  return enriched;
}

export async function createAudioPost(
  userId: string,
  input: { title: string; caption?: string; genre?: string; audio_url: string; cover_url?: string }
): Promise<AudioPost> {
  const { data, error } = await db()
    .from("audio_posts")
    .insert({
      user_id: userId,
      title: input.title,
      caption: input.caption ?? "",
      genre: input.genre ?? "",
      audio_url: input.audio_url,
      cover_url: input.cover_url ?? "",
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function likePost(postId: string, userId: string): Promise<void> {
  const { error: reactErr } = await db()
    .from("audio_reactions")
    .insert({ post_id: postId, user_id: userId });
  if (reactErr && reactErr.code !== "23505") throw reactErr;

  const { data: post } = await db().from("audio_posts").select("like_count").eq("id", postId).single();
  if (post) {
    await db()
      .from("audio_posts")
      .update({ like_count: (post.like_count ?? 0) + 1 })
      .eq("id", postId);
  }
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  await db().from("audio_reactions").delete().eq("post_id", postId).eq("user_id", userId);
  const { data: post } = await db().from("audio_posts").select("like_count").eq("id", postId).single();
  if (post && post.like_count > 0) {
    await db()
      .from("audio_posts")
      .update({ like_count: post.like_count - 1 })
      .eq("id", postId);
  }
}

export async function hasLikedPost(postId: string, userId: string): Promise<boolean> {
  if (sceneUnavailable()) return false;
  const { data } = await db()
    .from("audio_reactions")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function fetchComments(postId: string): Promise<AudioComment[]> {
  if (sceneUnavailable()) return [];
  const { data, error } = await db()
    .from("audio_comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function addComment(
  postId: string,
  userId: string,
  displayName: string,
  body: string
): Promise<AudioComment> {
  const { data, error } = await db()
    .from("audio_comments")
    .insert({ post_id: postId, user_id: userId, display_name: displayName, body })
    .select()
    .single();
  if (error) throw error;

  const { data: post } = await db().from("audio_posts").select("comment_count").eq("id", postId).single();
  if (post) {
    await db()
      .from("audio_posts")
      .update({ comment_count: (post.comment_count ?? 0) + 1 })
      .eq("id", postId);
  }
  return data;
}

export async function followUser(followerId: string, followingId: string): Promise<void> {
  const { error } = await db()
    .from("follows")
    .insert({ follower_id: followerId, following_id: followingId });
  if (error && error.code !== "23505") throw error;
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
  const { error } = await db()
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);
  if (error) throw error;
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
  if (sceneUnavailable()) return false;
  const { data } = await db()
    .from("follows")
    .select("follower_id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();
  return !!data;
}

export async function incrementPlayCount(postId: string): Promise<void> {
  if (sceneUnavailable()) return;
  const { data: post } = await db().from("audio_posts").select("play_count").eq("id", postId).maybeSingle();
  if (post) {
    await db()
      .from("audio_posts")
      .update({ play_count: (post.play_count ?? 0) + 1 })
      .eq("id", postId);
  }
}

export async function fetchUserAudioPosts(userId: string): Promise<AudioPost[]> {
  return fetchSceneFeed({ userId });
}

export { fetchProfileByUsername } from "@/lib/profiles";

export function subscribeToAudioPosts(onChange: () => void) {
  const supabase = getSupabase();
  if (!supabase) return () => {};
  const channel = supabase
    .channel("audio_posts_feed")
    .on("postgres_changes", { event: "*", schema: "public", table: "audio_posts" }, onChange)
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}
