"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { cn, formatRelativeTime } from "@/lib/utils";
import CoverArtFrame from "@/components/analog/CoverArtFrame";
import InteractiveVinyl from "@/components/vinyl/InteractiveVinyl";
import { useAudioPlayer, type Track } from "@/contexts/AudioPlayerContext";
import { incrementPlayCount, type AudioPost } from "@/lib/scene";

interface VinylSleeveCardProps {
  post: AudioPost;
  queue?: AudioPost[];
  className?: string;
  compact?: boolean;
}

function toTrack(p: AudioPost): Track {
  return {
    id: p.id,
    title: p.title,
    artist: p.author_display_name ?? "Musician",
    audioUrl: p.audio_url,
    postId: p.id,
    coverUrl: p.cover_url || undefined,
  };
}

export default function VinylSleeveCard({ post, queue, className, compact = false }: VinylSleeveCardProps) {
  const { play, currentTrack, isPlaying, toggle, progress, duration } = useAudioPlayer();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const track = toTrack(post);
  const isActive = currentTrack?.id === post.id;
  const profileHref = post.author_username
    ? `/profile/${post.author_username}`
    : `/profile?user=${post.user_id}`;
  const postHref = `/scene/post/${post.id}`;
  const progressPct = isActive && duration > 0 ? (progress / duration) * 100 : 0;

  const mobileVinylSize = compact ? 88 : 100;
  const desktopVinylSize = compact ? 96 : 112;

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isActive) {
      toggle();
      return;
    }
    const tracks = (queue ?? [post]).map(toTrack);
    play(track, tracks);
    incrementPlayCount(post.id).catch(() => undefined);
  };

  const handleVinylToggle = () => {
    if (isActive) toggle();
    else {
      const tracks = (queue ?? [post]).map(toTrack);
      play(track, tracks);
      incrementPlayCount(post.id).catch(() => undefined);
    }
  };

  return (
    <article
      className={cn(
        "cj-vinyl-sleeve-card cj-zine-border group relative mx-auto flex flex-col bg-brand-purple-deep transition-shadow hover:shadow-lg",
        isActive && "ring-1 ring-brand-gold/40",
        className
      )}
    >
      <div className="cj-vinyl-sleeve-art relative border-b border-[var(--cj-zine-border)] bg-brand-purple/40">
        <div className="cj-vinyl-sleeve-header relative z-[2] border-b border-[var(--cj-zine-border)] px-2.5 py-2 sm:px-3 sm:py-2.5">
          <Link
            href={profileHref}
            className="block truncate font-display text-sm uppercase leading-tight tracking-[0.08em] text-cj-text hover:text-brand-gold sm:text-base"
          >
            {post.author_display_name ?? "Musician"}
          </Link>
          <Link
            href={postHref}
            className="mt-0.5 block truncate font-display text-base uppercase leading-tight tracking-[0.06em] text-brand-gold hover:text-brand-parchment sm:text-lg"
          >
            {post.title}
          </Link>
        </div>

        <div className="cj-vinyl-sleeve-photo relative px-2.5 pb-2.5 pt-2 sm:px-3 sm:pb-3 sm:pt-2.5">
          <CoverArtFrame
            src={post.cover_url}
            alt=""
            aspect="square"
            warmFilter
            className="w-full rounded-xl border-brand-gold/30"
            sizes="(max-width: 640px) 280px, 360px"
          />
          <div className="cj-vinyl-sleeve-disc">
            <InteractiveVinyl
              size={mobileVinylSize}
              className="sm:hidden"
              coverUrl={post.cover_url || undefined}
              title={post.title}
              artist={post.author_display_name}
              isPlaying={isActive && isPlaying}
              interactive
              onPlayToggle={handleVinylToggle}
            />
            <InteractiveVinyl
              size={desktopVinylSize}
              className="hidden sm:block"
              coverUrl={post.cover_url || undefined}
              title={post.title}
              artist={post.author_display_name}
              isPlaying={isActive && isPlaying}
              interactive
              onPlayToggle={handleVinylToggle}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <p className="font-mono text-[9px] uppercase tracking-widest text-brand-gold">{post.genre}</p>
        {post.caption && !compact && (
          <p className="mt-1 line-clamp-2 font-body text-xs text-cj-text-muted">{post.caption}</p>
        )}
        {mounted && post.created_at && (
          <p className="mt-0.5 font-mono text-[9px] text-cj-text-muted/70">
            {formatRelativeTime(post.created_at)}
          </p>
        )}
        {isActive && duration > 0 && (
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-brand-gold/15">
            <div
              className="h-full rounded-full bg-brand-gold transition-[width] duration-150 ease-linear"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
        <div className="mt-auto flex items-center justify-between pt-2.5">
          <span className="font-mono text-[10px] text-cj-text-muted">
            {post.play_count} plays · {post.like_count} likes
          </span>
          <button
            type="button"
            onClick={handlePlay}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10"
            aria-label={isActive && isPlaying ? "Pause" : "Play"}
          >
            <Play className="h-4 w-4" fill="currentColor" />
          </button>
        </div>
      </div>
    </article>
  );
}
