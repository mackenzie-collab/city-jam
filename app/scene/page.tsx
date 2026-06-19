"use client";

import Link from "next/link";
import { Users, Zap } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import SceneFeed from "@/components/SceneFeed";
import SceneComposer from "@/components/SceneComposer";
import AuthBanner from "@/components/AuthBanner";
import { ICONS } from "@/lib/brand-assets";
import { useAuth } from "@/hooks/useAuth";

export default function ScenePageContent() {
  const { isAuthenticated } = useAuth();

  return (
    <FeatureShell
      title="Scene"
      iconSrc={ICONS.band}
      badge="The Scene"
      heading={
        <>
          Audio / <span className="text-cj-gold-bright">Social Feed.</span>
        </>
      }
      subtitle="Drop tracks, discover artists, build your manifesto — the magazine cover for underground sound."
      maxWidth="xl"
      headerRight={
        isAuthenticated ? (
          <Link href="/jam" className="cj-btn-secondary px-4 py-2 text-xs no-underline">
            Quick Jam
          </Link>
        ) : undefined
      }
    >
      {!isAuthenticated && <AuthBanner message="Join to post tracks and follow artists." />}

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <SceneFeed />
        </div>

        <aside className="space-y-6">
          <SceneComposer />

          <div className="cj-card space-y-3">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-cj-gold-muted">
              <Users className="h-4 w-4" /> Circles
            </p>
            <p className="text-sm text-cj-gold-muted">
              Small crews for deeper collab — invite-only groups built around a sound.
            </p>
            <Link href="/circles" className="cj-btn-ghost text-xs no-underline">
              Browse Circles →
            </Link>
          </div>

          <div className="cj-card space-y-3">
            <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-cj-gold-muted">
              <Zap className="h-4 w-4" /> Quick Jam
            </p>
            <p className="text-sm text-cj-gold-muted">
              Blind Echo and Echo Roulette — connect through sound in seconds.
            </p>
            <Link href="/jam" className="cj-btn-primary inline-block text-xs no-underline">
              Open Jam Hub
            </Link>
          </div>
        </aside>
      </div>
    </FeatureShell>
  );
}
