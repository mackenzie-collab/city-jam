import type { JamStreak, WeeklyActivityType } from "@/lib/streaks";

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export const BADGES: Badge[] = [
  {
    id: "first_jam",
    name: "First Jam",
    emoji: "✨",
    description: "Logged your first weekly engagement",
  },
  {
    id: "streak_3",
    name: "On the Beat",
    emoji: "🎵",
    description: "3-week Jam Streak",
  },
  {
    id: "streak_7",
    name: "Groove Keeper",
    emoji: "🎸",
    description: "7-week Jam Streak",
  },
  {
    id: "streak_12",
    name: "Scene Legend",
    emoji: "🔥",
    description: "12-week Jam Streak",
  },
  {
    id: "scene_regular",
    name: "Scene Regular",
    emoji: "🎤",
    description: "3+ live events in one week",
  },
  {
    id: "collab_king",
    name: "Collab King",
    emoji: "👑",
    description: "3+ collab actions in one week",
  },
  {
    id: "reel_dropper",
    name: "Reel Dropper",
    emoji: "📀",
    description: "2+ reels posted in one week",
  },
  {
    id: "all_rounder",
    name: "All-Rounder",
    emoji: "🌟",
    description: "Event, collab, and reel in the same week",
  },
];

const EVENT_TYPES: WeeklyActivityType[] = [
  "listening_room",
  "blind_echo",
  "echo_roulette",
  "signal_map",
];

const COLLAB_TYPES: WeeklyActivityType[] = [
  "collab_task_create",
  "collab_task_complete",
  "collab_workspace",
];

const REEL_TYPES: WeeklyActivityType[] = [
  "community_post",
  "vault_upload",
  "circle_post",
];

function weekTypes(streak: JamStreak, week: string): WeeklyActivityType[] {
  return streak.weekly_activities[week] ?? [];
}

function countCategory(types: WeeklyActivityType[], category: WeeklyActivityType[]): number {
  return types.filter((t) => category.includes(t)).length;
}

export function evaluateBadges(streak: JamStreak): string[] {
  const earned = new Set(streak.earned_badges);
  const maxWeeks = Math.max(streak.current_week_streak, streak.longest_week_streak);

  if (streak.current_week_streak > 0 || Object.keys(streak.weekly_activities).length > 0) {
    earned.add("first_jam");
  }
  if (maxWeeks >= 3) earned.add("streak_3");
  if (maxWeeks >= 7) earned.add("streak_7");
  if (maxWeeks >= 12) earned.add("streak_12");

  const week = streak.last_active_week;
  if (week) {
    const types = weekTypes(streak, week);
    if (countCategory(types, EVENT_TYPES) >= 3) earned.add("scene_regular");
    if (countCategory(types, COLLAB_TYPES) >= 3) earned.add("collab_king");
    if (countCategory(types, REEL_TYPES) >= 2) earned.add("reel_dropper");

    const hasEvent = countCategory(types, EVENT_TYPES) > 0;
    const hasCollab = countCategory(types, COLLAB_TYPES) > 0;
    const hasReel = countCategory(types, REEL_TYPES) > 0;
    if (hasEvent && hasCollab && hasReel) earned.add("all_rounder");
  }

  return Array.from(earned);
}

export function badgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

export function badgesForUser(earnedIds: string[]): Badge[] {
  return earnedIds
    .map((id) => badgeById(id))
    .filter((b): b is Badge => !!b);
}
