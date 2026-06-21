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
  {
    id: "demo-4",
    user_id: "demo-user-4",
    title: "Violin Breakdown",
    caption: "Solo étude recorded in one take, no edits.",
    genre: "CLASSICAL",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    cover_url: "/images/04_classical_violinist.png",
    play_count: 67,
    like_count: 14,
    comment_count: 2,
    created_at: new Date(Date.now() - 172800000).toISOString(),
    author_username: "ariavolkov",
    author_display_name: "Aria Volkov",
  },
  {
    id: "demo-5",
    user_id: "demo-user-5",
    title: "Crate Digger",
    caption: "Dusty samples flipped on an SP-404.",
    genre: "HIP-HOP",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    cover_url: "/images/06_hiphop_producer.png",
    play_count: 198,
    like_count: 32,
    comment_count: 6,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    author_username: "lowendtheory",
    author_display_name: "Low End Theory",
  },
  {
    id: "demo-6",
    user_id: "demo-user-6",
    title: "Porch Light",
    caption: "Acoustic demo written on a back porch in Asheville.",
    genre: "FOLK",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    cover_url: "/images/08_folk_songwriter.png",
    play_count: 54,
    like_count: 19,
    comment_count: 4,
    created_at: new Date(Date.now() - 345600000).toISOString(),
    author_username: "meadowlark",
    author_display_name: "Meadow Lark",
  },
  {
    id: "demo-7",
    user_id: "demo-user-7",
    title: "Glass Cathedral",
    caption: "Operatic vocal run-through, dry room.",
    genre: "CLASSICAL",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    cover_url: "/images/10_opera_singer.png",
    play_count: 41,
    like_count: 11,
    comment_count: 1,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    author_username: "soprano_null",
    author_display_name: "Soprano Null",
  },
  {
    id: "demo-8",
    user_id: "demo-user-8",
    title: "Duende Rising",
    caption: "Flamenco guitar with hand percussion.",
    genre: "WORLD",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    cover_url: "/images/11_flamenco_guitarist.png",
    play_count: 73,
    like_count: 22,
    comment_count: 3,
    created_at: new Date(Date.now() - 518400000).toISOString(),
    author_username: "carmenreyes",
    author_display_name: "Carmen Reyes",
  },
  {
    id: "demo-9",
    user_id: "demo-user-9",
    title: "Brass Commute",
    caption: "Horn section jam recorded on a subway platform.",
    genre: "JAZZ",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    cover_url: "/images/12_brass_ensemble.png",
    play_count: 112,
    like_count: 28,
    comment_count: 5,
    created_at: new Date(Date.now() - 604800000).toISOString(),
    author_username: "sectioneight",
    author_display_name: "Section Eight",
  },
  {
    id: "demo-10",
    user_id: "demo-user-10",
    title: "2AM Loops",
    caption: "Bedroom producer session — no plan, just vibes.",
    genre: "ELECTRONIC",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    cover_url: "/images/13_bedroom_producer.png",
    play_count: 301,
    like_count: 47,
    comment_count: 9,
    created_at: new Date(Date.now() - 691200000).toISOString(),
    author_username: "sleepwalker",
    author_display_name: "Sleepwalker",
  },
  {
    id: "demo-11",
    user_id: "demo-user-11",
    title: "Tabla Pulse",
    caption: "Polyrhythmic tabla patterns over a drone.",
    genre: "WORLD",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    cover_url: "/images/14_tabla_player.png",
    play_count: 88,
    like_count: 16,
    comment_count: 2,
    created_at: new Date(Date.now() - 777600000).toISOString(),
    author_username: "devsharma",
    author_display_name: "Dev Sharma",
  },
  {
    id: "demo-12",
    user_id: "demo-user-12",
    title: "Distortion Prayer",
    caption: "Bass-heavy rock demo, live room mic.",
    genre: "ROCK",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    cover_url: "/images/15_rock_bassist.png",
    play_count: 167,
    like_count: 35,
    comment_count: 7,
    created_at: new Date(Date.now() - 864000000).toISOString(),
    author_username: "staticsaint",
    author_display_name: "Static Saint",
  },
  {
    id: "demo-13",
    user_id: "demo-user-13",
    title: "Mass in D Minor",
    caption: "Choir rehearsal take — unfinished, raw.",
    genre: "CLASSICAL",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    cover_url: "/images/16_choir_conductor.png",
    play_count: 29,
    like_count: 8,
    comment_count: 1,
    created_at: new Date(Date.now() - 950400000).toISOString(),
    author_username: "thecollective",
    author_display_name: "The Collective",
  },
  {
    id: "demo-14",
    user_id: "demo-user-14",
    title: "Patch Bay Dreams",
    caption: "Modular synth jam — no computer, all analog.",
    genre: "ELECTRONIC",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    cover_url: "/images/17_modular_synth.png",
    play_count: 214,
    like_count: 39,
    comment_count: 6,
    created_at: new Date(Date.now() - 1036800000).toISOString(),
    author_username: "voltcrawler",
    author_display_name: "Volt Crawler",
  },
  {
    id: "demo-15",
    user_id: "demo-user-15",
    title: "Quartet No. 7",
    caption: "String quartet movement — first read-through.",
    genre: "CLASSICAL",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    cover_url: "/images/18_string_quartet.png",
    play_count: 45,
    like_count: 12,
    comment_count: 2,
    created_at: new Date(Date.now() - 1123200000).toISOString(),
    author_username: "eastriverstrings",
    author_display_name: "East River Strings",
  },
  {
    id: "demo-16",
    user_id: "demo-user-16",
    title: "Frequency Shift",
    caption: "Global jam session — musicians across three cities.",
    genre: "ELECTRONIC",
    audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    cover_url: "/images/musician_jamming_global_v2.png",
    play_count: 389,
    like_count: 62,
    comment_count: 11,
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    author_username: "globaljam",
    author_display_name: "Global Jam",
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
