"use client";

import Link from "next/link";
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
  const track = toTrack(post);
  const isActive = currentTrack?.id === post.id;
  const profileHref = post.author_username
    ? `/profile/${post.author_username}`
    : `/profile?user=${post.user_id}`;
  const postHref = `/scene/post/${post.id}`;
  const progressPct = isActive && duration > 0 ? (progress / duration) * 100 : 0;

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

  return (
    <article
      className={cn(
        "cj-zine-border group relative mx-auto flex w-[280px] max-w-[78vw] flex-col bg-brand-purple-deep transition-shadow hover:shadow-lg sm:w-[320px] md:w-[360px]",
        compact && "w-[240px] max-w-[72vw] sm:w-[280px]",
        isActive && "ring-1 ring-brand-gold/40",
        className
      )}
    >
      <div className="relative border-b border-[var(--cj-zine-border)] bg-brand-purple p-2.5 sm:p-3">
        <div className="flex items-end justify-center gap-2 sm:gap-2.5">
          <CoverArtFrame
            src={post.cover_url}
            alt=""
            aspect="square"
            className={cn(
              "cj-sleeve-cover w-[52%] shrink-0 transition-transform duration-300 sm:w-[55%]",
              isActive && "-translate-y-0.5"
            )}
            sizes="(max-width: 640px) 200px, 240px"
          />
          <div className="relative isolate shrink-0 overflow-visible">
            <InteractiveVinyl
              size={compact ? 150 : 170}
              className="sm:hidden"
              coverUrl={post.cover_url || undefined}
              title={post.title}
              artist={post.author_display_name}
              isPlaying={isActive && isPlaying}
              interactive
              onPlayToggle={() => {
                if (isActive) toggle();
                else {
                  const tracks = (queue ?? [post]).map(toTrack);
                  play(track, tracks);
                  incrementPlayCount(post.id).catch(() => undefined);
                }
              }}
            />
            <InteractiveVinyl
              size={compact ? 165 : 200}
              className="hidden sm:block"
              coverUrl={post.cover_url || undefined}
              title={post.title}
              artist={post.author_display_name}
              isPlaying={isActive && isPlaying}
              interactive
              onPlayToggle={() => {
                if (isActive) toggle();
                else {
                  const tracks = (queue ?? [post]).map(toTrack);
                  play(track, tracks);
                  incrementPlayCount(post.id).catch(() => undefined);
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <p className="font-mono text-[9px] uppercase tracking-widest text-brand-gold">{post.genre}</p>
        <Link
          href={postHref}
          className="mt-0.5 font-display text-lg uppercase leading-tight text-brand-parchment line-clamp-2 hover:text-brand-gold sm:text-xl"
        >
          {post.title}
        </Link>
        <div className="mt-0.5 flex items-center gap-2">
          <Link href={profileHref} className="truncate font-body text-xs text-cj-text-muted hover:text-brand-gold">
            {post.author_display_name ?? "Musician"}
          </Link>
          {post.created_at && (
            <span className="shrink-0 font-mono text-[9px] text-cj-text-muted/70">
              · {formatRelativeTime(post.created_at)}
            </span>
          )}
        </div>
        {post.caption && !compact && (
          <p className="mt-1.5 line-clamp-2 font-body text-xs text-cj-text-muted">{post.caption}</p>
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
