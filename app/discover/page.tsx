"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import CjIcon from "@/components/CjIcon";
import { ICONS } from "@/lib/brand-assets";
import {
  searchDiscoverArtists,
  searchDiscoverTracks,
  type DiscoverArtistHit,
} from "@/lib/discover-search";
import { incrementPlayCount, type AudioPost } from "@/lib/scene";
import { useAudioPlayer, type Track } from "@/contexts/AudioPlayerContext";
import { cn } from "@/lib/utils";

const GENRES = ["ALL", "ELECTRONIC", "JAZZ", "HIP-HOP", "ROCK", "FOLK", "CLASSICAL"] as const;

function toTrack(post: AudioPost): Track {
  return {
    id: post.id,
    title: post.title,
    artist: post.author_display_name ?? "Musician",
    audioUrl: post.audio_url,
    postId: post.id,
    coverUrl: post.cover_url || undefined,
  };
}

function TrackResultCard({ post, queue }: { post: AudioPost; queue: AudioPost[] }) {
  const { play } = useAudioPlayer();
  const username = post.author_username ?? post.author_display_name ?? "Musician";
  const profileHref = post.author_username
    ? `/profile/${post.author_username}`
    : `/profile?user=${post.user_id}`;

  const handlePlay = () => {
    play(toTrack(post), queue.map(toTrack));
    incrementPlayCount(post.id).catch(() => undefined);
  };

  return (
    <article className="cj-card flex gap-4 p-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden border border-cj-gold-border/30 bg-brand-purple-deep">
        {post.cover_url ? (
          <Image src={post.cover_url} alt="" fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand-purple-deep">
            <CjIcon src={ICONS.vinyl} alt="" size={28} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base uppercase tracking-wide text-cj-parchment">
              {post.title}
            </h3>
            <Link href={profileHref} className="mt-0.5 block truncate font-mono text-xs text-cj-text-muted hover:text-brand-gold">
              @{username}
            </Link>
          </div>
          <button
            type="button"
            onClick={handlePlay}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-brand-gold/50 bg-brand-purple text-brand-gold transition-colors hover:bg-brand-gold hover:text-cj-purple"
            aria-label={`Play ${post.title}`}
          >
            <Play className="h-4 w-4 pl-0.5" />
          </button>
        </div>
        {post.genre ? <span className="cj-badge mt-2 text-[10px]">{post.genre}</span> : null}
      </div>
    </article>
  );
}

function ArtistResultCard({ artist }: { artist: DiscoverArtistHit }) {
  const href = artist.username ? `/profile/${artist.username}` : `/profile?user=${artist.user_id}`;

  return (
    <Link href={href} className="cj-card flex gap-4 p-4 no-underline transition-shadow hover:shadow-md">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-cj-gold-border/30 bg-brand-purple-deep">
        {artist.avatar_url ? (
          <Image src={artist.avatar_url} alt="" fill className="object-cover" sizes="64px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <CjIcon src={ICONS.profile} alt="" size={28} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-base uppercase tracking-wide text-cj-parchment">
          {artist.display_name}
        </h3>
        <p className="mt-0.5 truncate font-mono text-xs text-cj-text-muted">
          @{artist.username || "musician"}
          {artist.city ? ` · ${artist.city}` : ""}
        </p>
        {artist.genre ? <span className="cj-badge mt-2 text-[10px]">{artist.genre}</span> : null}
      </div>
    </Link>
  );
}

export default function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [genre, setGenre] = useState<(typeof GENRES)[number]>("ALL");
  const [tracks, setTracks] = useState<AudioPost[]>([]);
  const [artists, setArtists] = useState<DiscoverArtistHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!debouncedQuery) {
      setTracks([]);
      setArtists([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      searchDiscoverTracks(debouncedQuery, genre),
      searchDiscoverArtists(debouncedQuery, genre),
    ])
      .then(([trackResults, artistResults]) => {
        if (cancelled) return;
        setTracks(trackResults);
        setArtists(artistResults);
      })
      .catch((err) => {
        if (cancelled) return;
        setTracks([]);
        setArtists([]);
        setError(err instanceof Error ? err.message : "Search failed");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, genre]);

  const hasQuery = debouncedQuery.length > 0;
  const noResults = hasQuery && !loading && tracks.length === 0 && artists.length === 0;

  return (
    <FeatureShell
      title="Discover"
      iconSrc={ICONS.search}
      badge="Discovery"
      heading={
        <>
          Find Your / <span className="text-cj-gold-bright">Next Collab.</span>
        </>
      }
      subtitle="Search artists by genre, city, and vibe — find tracks and musicians in one place."
      maxWidth="xl"
    >
      <div className="space-y-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search artists, genres, cities..."
          className="cj-input !pl-4 w-full text-base"
          autoComplete="off"
          spellCheck={false}
        />

        <div className="flex flex-wrap gap-2">
          {GENRES.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenre(g)}
              className={cn("cj-pill", genre === g && "cj-pill-active")}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10">
        {!hasQuery ? (
          <div className="cj-card flex flex-col items-center px-6 py-16 text-center">
            <CjIcon src={ICONS.lightning} alt="" size={48} className="mb-5 opacity-90" />
            <p className="font-body text-base text-cj-text-muted">
              Start typing to find your next collab.
            </p>
          </div>
        ) : loading ? (
          <p className="font-mono text-xs uppercase tracking-widest text-cj-text-muted">Searching…</p>
        ) : error ? (
          <p className="font-mono text-sm text-red-400">{error}</p>
        ) : noResults ? (
          <div className="cj-card px-6 py-12 text-center">
            <p className="font-body text-base text-cj-text-muted">
              No matches for <span className="text-brand-gold">&ldquo;{debouncedQuery}&rdquo;</span>. Try a
              different genre or city.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <section>
              <h2 className="mb-4 font-display text-lg uppercase tracking-[0.08em] text-brand-gold">
                Tracks
              </h2>
              {tracks.length === 0 ? (
                <p className="font-mono text-sm text-cj-text-muted">No tracks found.</p>
              ) : (
                <div className="space-y-3">
                  {tracks.map((post) => (
                    <TrackResultCard key={post.id} post={post} queue={tracks} />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-4 font-display text-lg uppercase tracking-[0.08em] text-brand-gold">
                Artists
              </h2>
              {artists.length === 0 ? (
                <p className="font-mono text-sm text-cj-text-muted">No artists found.</p>
              ) : (
                <div className="space-y-3">
                  {artists.map((artist) => (
                    <ArtistResultCard key={artist.user_id} artist={artist} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </FeatureShell>
  );
}
