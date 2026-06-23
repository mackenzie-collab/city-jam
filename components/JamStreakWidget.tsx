"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import StreakIcon from "@/components/StreakIcon";
import { badgesForUser, BADGES } from "@/lib/badges";
import {
  fetchJamStreak,
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
  const earned = badgesForUser(streak.earned_badges);

  if (compact) {
    return (
      <Link
        href="/community"
        title="Jam Streak — consecutive weeks of engagement"
        className="flex items-center gap-1.5 border border-brand-gold/40 bg-brand-gold/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-cj-parchment no-underline hover:border-brand-gold/60"
      >
        <StreakIcon size={14} />
        {weeks}w
      </Link>
    );
  }

  return (
    <div className="cj-card border-brand-gold/30 bg-gradient-to-br from-brand-purple-deep to-cj-bg">
      <div className="flex items-start justify-between">
        <div>
          <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brand-gold">
            <StreakIcon size={16} />
            Jam Streak
          </p>
          <p className="mt-1 font-mono text-[10px] text-cj-text-muted">Consecutive weeks engaged</p>
          <p className="mt-2 font-display text-5xl text-brand-gold">
            {weeks}
            <span className="ml-2 text-lg uppercase text-cj-text-muted">wk</span>
          </p>
          <p className="mt-1 font-mono text-xs text-cj-text-muted">{weekStreakLabel(weeks)}</p>
        </div>
        <div className="text-right font-mono text-[10px] uppercase tracking-widest text-cj-text-muted">
          <p>Best: {streak.longest_week_streak}w</p>
          <p className="mt-1">Total jams: {streak.total_jams}</p>
        </div>
      </div>

      {showBadges && (
        <div className="mt-4">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-cj-text-muted">
            Badges
          </p>
          {earned.length === 0 ? (
            <p className="font-mono text-xs text-cj-text-muted">Jam, collab, or post to earn badges.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {earned.map((b) => (
                <span
                  key={b.id}
                  title={b.description}
                  className="inline-flex items-center gap-1 border border-cj-gold-border bg-brand-purple/40 px-2 py-1 font-mono text-xs text-brand-gold"
                >
                  {b.id.startsWith("streak_") || b.id === "first_jam" ? (
                    <StreakIcon size={14} />
                  ) : (
                    <span>{b.emoji}</span>
                  )}
                  {b.name}
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
      <p className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-cj-text-muted">
        <StreakIcon size={14} />
        Jam Streak Badges
      </p>
      <p className="mb-4 font-mono text-xs text-cj-text-muted">
        Earn badges by staying active week after week — events, collabs, and reels all count.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {BADGES.map((b) => {
          const unlocked = earnedSet.has(b.id);
          const isStreakBadge = b.id.startsWith("streak_") || b.id === "first_jam";
          return (
            <div
              key={b.id}
              className={`flex items-start gap-3 border px-3 py-2 ${
                unlocked
                  ? "border-brand-gold/50 bg-brand-purple/30"
                  : "border-cj-gold-border/40 opacity-50"
              }`}
            >
              {isStreakBadge ? (
                <StreakIcon size={24} className={unlocked ? "" : "opacity-40"} />
              ) : (
                <span className="text-2xl">{b.emoji}</span>
              )}
              <div>
                <p className="font-display text-sm uppercase tracking-wide text-brand-gold">{b.name}</p>
                <p className="font-mono text-xs text-cj-text-muted">{b.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
