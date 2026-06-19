"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Mic, Briefcase, User, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { discoverMusicians, discoveryUnavailable, type DiscoverMatch } from "@/lib/discovery";
import { displayName, type StatusMood } from "@/lib/profiles";

const MOOD_LABEL: Record<StatusMood, string> = {
  listening: "Listening",
  writing: "Writing",
  recording: "Recording",
  "open-to-collab": "Open to collab",
  "": "",
};

export default function DiscoveryPanel() {
  const { user } = useAuth();
  const [matches, setMatches] = useState<DiscoverMatch[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user?.id || discoveryUnavailable()) {
      setLoading(false);
      return;
    }
    try {
      setMatches(await discoverMusicians(user.id, 8));
    } catch {
      setMatches([]);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user?.id) return null;

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cj-gold-muted">
            <Compass className="h-3 w-3" /> Discovery
          </p>
          <h2 className="font-display text-lg uppercase text-cj-gold">In Your Orbit</h2>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={load}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-cj-gold-muted">Finding musicians like you...</p>
      ) : matches.length === 0 ? (
        <div className="cj-card py-6 text-center">
          <p className="text-sm text-cj-gold-muted">
            Set your status on your profile to unlock discovery matches.
          </p>
          <Link href="/profile" className="mt-3 inline-block text-xs uppercase tracking-widest text-cj-gold underline">
            Set status →
          </Link>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {matches.map(({ profile, reason, onlineOnMap }) => (
            <li key={profile.user_id} className="cj-card flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-display uppercase text-cj-gold">{displayName(profile)}</p>
                  <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">
                    {profile.role}
                    {profile.genre ? ` · ${profile.genre}` : ""}
                    {profile.city ? ` · ${profile.city}` : ""}
                  </p>
                </div>
                {onlineOnMap && (
                  <span className="cj-tag border-green-500/40 text-green-300">
                    <Radio className="mr-1 inline h-3 w-3" />
                    Live
                  </span>
                )}
              </div>

              {profile.status_text && (
                <p className="text-sm leading-relaxed text-cj-gold-bright">&ldquo;{profile.status_text}&rdquo;</p>
              )}

              <div className="flex flex-wrap gap-2">
                {profile.status_mood && (
                  <span className="cj-tag border-cj-gold/40 text-cj-gold">
                    {MOOD_LABEL[profile.status_mood as StatusMood]}
                  </span>
                )}
                {profile.status_artist && (
                  <span className="cj-tag border-cj-gold-border text-cj-gold-muted">{profile.status_artist}</span>
                )}
              </div>

              <p className="text-[10px] text-cj-gold-muted">{reason}</p>

              <div className="mt-auto flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/profile?user=${profile.user_id}`}
                  className="cj-btn-secondary inline-flex items-center gap-1 px-3 py-1.5 text-[10px] no-underline"
                >
                  <User className="h-3 w-3" /> Profile
                </Link>
                <Link
                  href="/project-match"
                  className="cj-btn-secondary inline-flex items-center gap-1 px-3 py-1.5 text-[10px] no-underline"
                >
                  <Briefcase className="h-3 w-3" /> Match
                </Link>
                <Link
                  href="/blind-echo"
                  className="cj-btn-secondary inline-flex items-center gap-1 px-3 py-1.5 text-[10px] no-underline"
                >
                  <Mic className="h-3 w-3" /> Echo
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
