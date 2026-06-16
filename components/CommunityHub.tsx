"use client";

import Link from "next/link";
import { Users, Map, Flame } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import ToolsStrip from "@/components/ToolsStrip";
import JamStreakWidget from "@/components/JamStreakWidget";
import CommunityFeed from "@/components/CommunityFeed";
import DiscoveryPanel from "@/components/DiscoveryPanel";
import ProjectKanban from "@/components/ProjectKanban";
import AuthBanner from "@/components/AuthBanner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { fetchStreakLeaderboard, type JamStreak } from "@/lib/streaks";

export default function CommunityHub() {
  const { user, isAuthenticated } = useAuth();
  const [leaders, setLeaders] = useState<JamStreak[]>([]);

  useEffect(() => {
    fetchStreakLeaderboard(5).then(setLeaders);
  }, []);

  return (
    <FeatureShell
      title="Community"
      icon={Users}
      badge="The Scene"
      heading={
        <>
          Your Scene / <span className="text-cj-gold-bright">Live Now.</span>
        </>
      }
      subtitle="Feed, jam streaks, project board, and every tool — one connected home for musicians."
      maxWidth="xl"
      headerRight={
        isAuthenticated ? (
          <Link href="/studio">
            <Button variant="secondary" size="sm">
              Studio
            </Button>
          </Link>
        ) : (
          <Link href="/register">
            <Button variant="primary" size="sm">
              Join
            </Button>
          </Link>
        )
      }
      footer={
        !isAuthenticated ? (
          <AuthBanner message="Sign in to post, jam, and build your streak." returnUrl="/community" />
        ) : undefined
      }
    >
      <div className="mb-10">
        <ToolsStrip title="All Tools — Jump In" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          {isAuthenticated && (
            <div className="grid gap-4 sm:grid-cols-2">
              <JamStreakWidget />
              <Link
                href="/signal-map"
                className="cj-card flex flex-col justify-between no-underline transition-colors hover:border-cj-gold/50"
              >
                <div>
                  <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">
                    <Map className="h-3 w-3" /> Live Map
                  </p>
                  <p className="mt-3 font-display text-2xl uppercase text-cj-gold">Who&apos;s Online</p>
                  <p className="mt-2 text-xs text-cj-gold-muted">See musicians on the map near you</p>
                </div>
                <span className="mt-4 text-xs uppercase tracking-widest text-cj-gold">Open Map →</span>
              </Link>
            </div>
          )}

          {isAuthenticated && <ProjectKanban />}

          {isAuthenticated && <DiscoveryPanel />}

          <CommunityFeed showComposer={isAuthenticated} />
        </div>

        <aside className="space-y-6">
          <div className="cj-card">
            <p className="mb-4 flex items-center gap-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">
              <Flame className="h-3 w-3" /> Jam Streak Leaders
            </p>
            {leaders.length === 0 ? (
              <p className="text-xs text-cj-gold-muted">Stay active each week to claim the top spot.</p>
            ) : (
              <ol className="space-y-2">
                {leaders.map((s, i) => (
                  <li key={s.user_id} className="flex items-center justify-between text-sm">
                    <span className="text-cj-gold-muted">#{i + 1}</span>
                    <span className="flex-1 px-2 text-cj-gold">Musician</span>
                    <span className="font-display text-cj-gold-bright">{s.current_week_streak}w</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="cj-card space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">Quick Jam</p>
            <Link href="/blind-echo" className="cj-btn-primary block text-center text-xs no-underline">
              Blind Echo
            </Link>
            <Link href="/echo-roulette" className="cj-btn-secondary block text-center text-xs no-underline">
              Echo Roulette
            </Link>
          </div>

          <ToolsStrip variant="compact" title="Tools" />
        </aside>
      </div>
    </FeatureShell>
  );
}
