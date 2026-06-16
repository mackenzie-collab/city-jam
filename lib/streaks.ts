import { getSupabase } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { evaluateBadges } from "@/lib/badges";

export type WeeklyActivityType =
  | "listening_room"
  | "blind_echo"
  | "echo_roulette"
  | "signal_map"
  | "collab_task_create"
  | "collab_task_complete"
  | "collab_workspace"
  | "community_post"
  | "vault_upload"
  | "circle_post";

export interface JamStreak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_jam_date: string | null;
  total_jams: number;
  current_week_streak: number;
  longest_week_streak: number;
  last_active_week: string | null;
  weekly_activities: Record<string, WeeklyActivityType[]>;
  earned_badges: string[];
}

const STREAK_KEY = "city-jam-streak";

function emptyStreak(userId: string): JamStreak {
  return {
    user_id: userId,
    current_streak: 0,
    longest_streak: 0,
    last_jam_date: null,
    total_jams: 0,
    current_week_streak: 0,
    longest_week_streak: 0,
    last_active_week: null,
    weekly_activities: {},
    earned_badges: [],
  };
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** ISO week string, e.g. "2025-W24" */
export function getWeekISO(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`;
}

export function getPreviousWeekISO(date = new Date()): string {
  const prev = new Date(date);
  prev.setDate(prev.getDate() - 7);
  return getWeekISO(prev);
}

function localStreak(userId: string): JamStreak {
  if (typeof window === "undefined") return emptyStreak(userId);
  try {
    const raw = localStorage.getItem(`${STREAK_KEY}:${userId}`);
    if (raw) return normalizeStreak(JSON.parse(raw) as Partial<JamStreak>, userId);
  } catch {
    /* ignore */
  }
  return emptyStreak(userId);
}

function normalizeStreak(raw: Partial<JamStreak>, userId: string): JamStreak {
  return {
    ...emptyStreak(userId),
    ...raw,
    user_id: userId,
    weekly_activities:
      typeof raw.weekly_activities === "object" && raw.weekly_activities
        ? raw.weekly_activities
        : {},
    earned_badges: Array.isArray(raw.earned_badges) ? raw.earned_badges : [],
  };
}

function saveLocalStreak(streak: JamStreak) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${STREAK_KEY}:${streak.user_id}`, JSON.stringify(streak));
}

function computeDailyStreak(prev: JamStreak): JamStreak {
  const today = todayISO();
  const yesterday = yesterdayISO();
  let current = prev.current_streak;

  if (prev.last_jam_date === today) {
    return { ...prev, total_jams: prev.total_jams + 1 };
  }

  if (prev.last_jam_date === yesterday) {
    current = prev.current_streak + 1;
  } else {
    current = 1;
  }

  const longest = Math.max(prev.longest_streak, current);
  return {
    ...prev,
    current_streak: current,
    longest_streak: longest,
    last_jam_date: today,
    total_jams: prev.total_jams + 1,
  };
}

function computeWeeklyStreak(prev: JamStreak, type: WeeklyActivityType): JamStreak {
  const week = getWeekISO();
  const prevWeek = getPreviousWeekISO();
  const activities = { ...prev.weekly_activities };
  const weekTypes = [...(activities[week] ?? []), type];
  activities[week] = weekTypes;

  let currentWeekStreak = prev.current_week_streak;

  if (prev.last_active_week === week) {
    /* same week — streak unchanged */
  } else if (prev.last_active_week === prevWeek) {
    currentWeekStreak = prev.current_week_streak + 1;
  } else {
    currentWeekStreak = 1;
  }

  const longestWeekStreak = Math.max(prev.longest_week_streak, currentWeekStreak);

  const next: JamStreak = {
    ...prev,
    current_week_streak: currentWeekStreak,
    longest_week_streak: longestWeekStreak,
    last_active_week: week,
    weekly_activities: activities,
    total_jams: prev.total_jams + 1,
  };

  next.earned_badges = evaluateBadges(next);
  return next;
}

async function upsertStreak(streak: JamStreak) {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase.from("jam_streaks").upsert({
    user_id: streak.user_id,
    current_streak: streak.current_streak,
    longest_streak: streak.longest_streak,
    last_jam_date: streak.last_jam_date,
    total_jams: streak.total_jams,
    current_week_streak: streak.current_week_streak,
    longest_week_streak: streak.longest_week_streak,
    last_active_week: streak.last_active_week,
    weekly_activities: streak.weekly_activities,
    earned_badges: streak.earned_badges,
    updated_at: new Date().toISOString(),
  });
}

export async function fetchJamStreak(userId: string): Promise<JamStreak> {
  if (!isSupabaseConfigured()) return localStreak(userId);
  const supabase = getSupabase();
  if (!supabase) return localStreak(userId);

  const { data, error } = await supabase
    .from("jam_streaks")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) return localStreak(userId);
  return normalizeStreak(data as Partial<JamStreak>, userId);
}

/** Record weekly engagement — primary Jam Streak tracking */
export async function recordWeeklyActivity(
  userId: string,
  type: WeeklyActivityType
): Promise<JamStreak> {
  const prev = await fetchJamStreak(userId);
  const next = computeWeeklyStreak(prev, type);
  await upsertStreak(next);
  saveLocalStreak(next);
  return next;
}

/** Fire-and-forget helper for UI hooks */
export function trackWeeklyActivity(userId: string, type: WeeklyActivityType) {
  recordWeeklyActivity(userId, type).catch(() => {});
}

/** Legacy daily jam counter — also bumps weekly engagement */
export async function recordJamActivity(
  userId: string,
  displayName?: string
): Promise<JamStreak> {
  const prev = await fetchJamStreak(userId);
  const withDaily = computeDailyStreak(prev);
  const next = computeWeeklyStreak(withDaily, "blind_echo");

  if (isSupabaseConfigured()) {
    await upsertStreak(next);
    try {
      const { createCommunityPost } = await import("@/lib/community");
      await createCommunityPost(userId, displayName ?? "Musician", {
        kind: "jam",
        title: `${next.current_week_streak}-week Jam Streak`,
        body: `Stayed active on City Jam. ${next.current_week_streak} week Jam Streak and counting.`,
      });
    } catch {
      /* feed optional */
    }
  }

  saveLocalStreak(next);
  return next;
}

export async function fetchStreakLeaderboard(limit = 5): Promise<JamStreak[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("jam_streaks")
    .select("*")
    .order("current_week_streak", { ascending: false })
    .limit(limit);

  if (error) return [];
  return (data ?? []).map((row) => normalizeStreak(row as Partial<JamStreak>, row.user_id as string));
}

export function streakEmoji(weeks: number): string {
  if (weeks >= 12) return "🔥";
  if (weeks >= 7) return "⚡";
  if (weeks >= 3) return "🎸";
  if (weeks >= 1) return "🎵";
  return "✨";
}

export function weekStreakLabel(weeks: number): string {
  if (weeks === 0) return "Engage this week to start your Jam Streak";
  if (weeks === 1) return "1 week in a row";
  return `${weeks} weeks in a row`;
}
