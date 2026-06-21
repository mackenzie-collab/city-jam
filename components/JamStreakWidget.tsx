"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { badgesForUser, BADGES } from "@/lib/badges";
import {
  fetchJamStreak,
  streakEmoji,
  weekStreakLabel,
  type JamStreak,
} from "@/lib/streaks";

interface JamStreakWidgetProps {
  compact?: boolean;
  showBadges?: boolean;
}

export default function JamStreakWidget({ compact, showBadges = true }: JamStreakWidgetProps) {
  const { user } = useAuth();
  const [streak, setStreak] = useState<JamStreak | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    fetchJamStreak(user.id).then(setStreak);
  }, [user?.id]);

  if (!user || !streak) return null;

  const weeks = streak.current_week_streak;
  const emoji = streakEmoji(weeks);
  const earned = badgesForUser(streak.earned_badges);

  if (compact) {
    return (
      <Link
        href="/community"
        title="Jam Streak — consecutive weeks of engagement"
        className="flex items-center gap-1.5 rounded-full border border-label-amber/40 bg-label-amber/10 px-3 py-1 text-xs font-medium text-label-cream no-underline hover:border-label-amber/60"
      >
        <Flame className="h-3 w-3" />
        {weeks}w {emoji}
      </Link>
    );
  }

  return (
    <div className="cj-card border-label-amber/30 bg-gradient-to-br from-cj-purple-card to-wax-burgundy/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-label-amber/80">Jam Streak</p>
          <p className="mt-1 text-[10px] text-cj-gold-muted/80">Consecutive weeks engaged</p>
          <p className="mt-2 font-display text-5xl text-cj-gold">
            {weeks}
            <span className="ml-2 text-lg uppercase text-cj-gold-muted">wk</span>
            <span className="ml-2 text-2xl">{emoji}</span>
          </p>
          <p className="mt-1 text-xs text-cj-gold-muted">{weekStreakLabel(weeks)}</p>
        </div>
        <div className="text-right text-[10px] uppercase tracking-widest text-cj-gold-muted">
          <p>Best: {streak.longest_week_streak}w</p>
          <p className="mt-1">Total jams: {streak.total_jams}</p>
        </div>
      </div>

      {showBadges && (
        <div className="mt-4">
          <p className="mb-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">Badges</p>
          {earned.length === 0 ? (
            <p className="text-xs text-cj-gold-muted">Jam, collab, or post to earn badges.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {earned.map((b) => (
                <span
                  key={b.id}
                  title={b.description}
                  className="inline-flex items-center gap-1 rounded-full border border-cj-gold-border bg-cj-purple/40 px-2 py-1 text-xs text-cj-gold"
                >
                  {b.emoji} {b.name}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Link href="/blind-echo" className="cj-btn-primary !px-4 !py-2 text-xs no-underline">
          Jam Now
        </Link>
        <Link href="/echo-roulette" className="cj-btn-secondary !px-4 !py-2 text-xs no-underline">
          Echo Roulette
        </Link>
      </div>
    </div>
  );
}

interface BadgeGalleryProps {
  earnedIds: string[];
}

export function BadgeGallery({ earnedIds }: BadgeGalleryProps) {
  const earnedSet = new Set(earnedIds);

  return (
    <div className="cj-card">
      <p className="mb-1 text-[10px] uppercase tracking-widest text-cj-gold-muted">Jam Streak Badges</p>
      <p className="mb-4 text-xs text-cj-gold-muted">
        Earn badges by staying active week after week — events, collabs, and reels all count.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {BADGES.map((b) => {
          const unlocked = earnedSet.has(b.id);
          return (
            <div
              key={b.id}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2 ${
                unlocked
                  ? "border-cj-gold/50 bg-cj-purple/30"
                  : "border-cj-gold-border/40 opacity-50"
              }`}
            >
              <span className="text-2xl">{b.emoji}</span>
              <div>
                <p className="text-sm font-medium text-cj-gold">{b.name}</p>
                <p className="text-xs text-cj-gold-muted">{b.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
