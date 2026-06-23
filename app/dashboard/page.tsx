"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppChrome from "@/components/AppChrome";
import { getSupabase } from "@/lib/supabase/client";

interface AudioPost {
  id: string;
  title: string;
  caption: string | null;
  genre: string | null;
  audio_url: string;
  cover_url: string | null;
  user_id: string;
  created_at: string;
  play_count: number;
}

interface UserProfile {
  user_id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  city: string | null;
  bio: string | null;
}

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tracks, setTracks] = useState<AudioPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlayer, setActivePlayer] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login?returnUrl=/dashboard");
        return;
      }

      const { data: profileData } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setProfile(profileData);

      const { data: trackData } = await supabase
        .from("audio_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setTracks(trackData ?? []);
      setLoading(false);
    }

    init();
  }, [router]);

  const totalPlays = tracks.reduce((sum, t) => sum + (t.play_count ?? 0), 0);

  async function handleDelete(trackId: string) {
    const supabase = getSupabase();
    if (!supabase) return;
    if (!window.confirm("Delete this track? This cannot be undone.")) return;

    setDeletingId(trackId);
    const { error } = await supabase.from("audio_posts").delete().eq("id", trackId);
    if (!error) {
      setTracks((prev) => prev.filter((t) => t.id !== trackId));
      if (activePlayer === trackId) setActivePlayer(null);
    }
    setDeletingId(null);
  }

  function handlePlay(trackId: string) {
    setActivePlayer((current) => (current === trackId ? null : trackId));
  }

  if (loading) {
    return (
      <AppChrome>
        <main className="flex min-h-[60vh] items-center justify-center bg-cj-purple">
          <div className="animate-pulse font-mono text-sm tracking-widest text-brand-gold">
            LOADING YOUR VAULT...
          </div>
        </main>
      </AppChrome>
    );
  }

  const displayName = profile?.display_name ?? profile?.username ?? "ARTIST";
  const city = profile?.city ?? null;

  return (
    <AppChrome>
      <main className="min-h-screen bg-cj-purple font-body text-cj-parchment">
        <section className="border-b border-brand-gold/20 px-6 pb-6 pt-10">
          <div className="mx-auto max-w-5xl">
            <p className="mb-4 font-mono text-xs tracking-widest text-cj-text-muted">
              YOU ARE HERE &nbsp;›&nbsp; DASHBOARD
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="font-display text-4xl uppercase leading-none md:text-5xl">
                  YOUR / <span className="text-brand-gold">DASHBOARD.</span>
                </h1>
                <p className="mt-2 text-sm text-cj-text-muted">
                  {displayName.toUpperCase()}
                  {city ? (
                    <span className="ml-2 text-brand-gold/70">· {city.toUpperCase()}</span>
                  ) : null}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  href="/scene"
                  className="border border-brand-gold px-4 py-2 font-mono text-xs tracking-widest text-brand-gold transition-colors hover:bg-brand-gold hover:text-cj-purple"
                >
                  ↑ POST TO SCENE
                </Link>
                <Link
                  href="/profile"
                  className="border border-cj-parchment/30 px-4 py-2 font-mono text-xs tracking-widest text-cj-parchment transition-colors hover:border-brand-gold hover:text-brand-gold"
                >
                  EDIT PROFILE
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-brand-gold/10 bg-black/10 px-6 py-6">
          <div className="mx-auto grid max-w-5xl grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-mono text-3xl text-brand-gold">{tracks.length}</p>
              <p className="mt-1 font-mono text-xs tracking-widest text-cj-text-muted">TRACKS</p>
            </div>
            <div>
              <p className="font-mono text-3xl text-brand-gold">{totalPlays.toLocaleString()}</p>
              <p className="mt-1 font-mono text-xs tracking-widest text-cj-text-muted">
                TOTAL PLAYS
              </p>
            </div>
            <div>
              <p className="font-mono text-3xl text-brand-gold">
                {city ? city.toUpperCase().slice(0, 8) : "—"}
              </p>
              <p className="mt-1 font-mono text-xs tracking-widest text-cj-text-muted">
                YOUR CITY
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-10">
          <div className="mx-auto max-w-5xl">
            <h2 className="mb-6 font-display text-2xl uppercase">
              THE <span className="text-brand-gold">VAULT</span>
              <span className="ml-3 font-mono text-sm text-cj-text-muted">
                ({tracks.length} {tracks.length === 1 ? "TRACK" : "TRACKS"})
              </span>
            </h2>

            {tracks.length === 0 ? (
              <div className="border border-brand-gold/20 p-12 text-center">
                <p className="font-mono text-sm tracking-widest text-cj-text-muted">
                  YOUR VAULT IS EMPTY.
                </p>
                <p className="mt-2 text-sm text-cj-text-muted">
                  Post your first track to the Scene to fill it up.
                </p>
                <Link
                  href="/scene"
                  className="mt-6 inline-block border border-brand-gold px-6 py-3 font-mono text-xs tracking-widest text-brand-gold transition-colors hover:bg-brand-gold hover:text-cj-purple"
                >
                  ↑ POST YOUR FIRST TRACK
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {tracks.map((track) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    isPlaying={activePlayer === track.id}
                    isDeleting={deletingId === track.id}
                    onPlay={() => handlePlay(track.id)}
                    onDelete={() => handleDelete(track.id)}
                    onEnded={() => setActivePlayer(null)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </AppChrome>
  );
}

function TrackRow({
  track,
  isPlaying,
  isDeleting,
  onPlay,
  onDelete,
  onEnded,
}: {
  track: AudioPost;
  isPlaying: boolean;
  isDeleting: boolean;
  onPlay: () => void;
  onDelete: () => void;
  onEnded: () => void;
}) {
  const date = new Date(track.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`border bg-black/20 p-4 transition-all duration-200 ${
        isPlaying
          ? "border-brand-gold bg-brand-gold/5"
          : "border-brand-gold/20 hover:border-brand-gold/50"
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden bg-cj-purple/60">
          {track.cover_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={track.cover_url} alt={track.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current text-brand-gold/40">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="3" className="fill-cj-purple" />
              </svg>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-sm uppercase text-cj-parchment">{track.title}</p>
          <p className="mt-0.5 font-mono text-xs text-cj-text-muted">
            {track.genre?.toUpperCase() ?? "—"} &nbsp;·&nbsp; {date}
          </p>
        </div>

        <div className="mr-4 hidden text-right sm:block">
          <p className="font-mono text-sm text-brand-gold">
            {(track.play_count ?? 0).toLocaleString()}
          </p>
          <p className="font-mono text-xs text-cj-text-muted">PLAYS</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onPlay}
            className={`border px-3 py-2 font-mono text-xs tracking-widest transition-colors ${
              isPlaying
                ? "border-brand-gold bg-brand-gold text-cj-purple"
                : "border-brand-gold/50 text-brand-gold hover:bg-brand-gold hover:text-cj-purple"
            }`}
          >
            {isPlaying ? "■ STOP" : "▶ PLAY"}
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting}
            className="border border-red-500/30 px-3 py-2 font-mono text-xs tracking-widest text-red-400/60 transition-colors hover:border-red-500 hover:text-red-400 disabled:opacity-40"
          >
            {isDeleting ? "..." : "DELETE"}
          </button>
        </div>
      </div>

      {isPlaying ? (
        <audio
          controls
          autoPlay
          src={track.audio_url}
          className="mt-3 w-full max-w-md"
          onEnded={onEnded}
        />
      ) : null}
    </div>
  );
}
