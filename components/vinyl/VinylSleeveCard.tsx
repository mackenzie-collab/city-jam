"use client";

import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
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
  const { play, currentTrack, isPlaying, toggle } = useAudioPlayer();
  const track = toTrack(post);
  const isActive = currentTrack?.id === post.id;
  const profileHref = post.author_username
    ? `/profile/${post.author_username}`
    : `/profile?user=${post.user_id}`;

  const handlePlay = () => {
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
        "cj-zine-border group relative flex w-full max-w-[min(90vw,360px)] flex-col bg-brand-purple-deep transition-shadow hover:shadow-lg",
        compact && "max-w-[min(88vw,320px)]",
        isActive && "ring-1 ring-brand-gold/50",
        className
      )}
    >
      <div className="relative border-b border-[var(--cj-zine-border)] bg-brand-purple p-2 sm:p-2.5">
        <div className="flex items-end justify-center gap-1 sm:gap-1.5">
          <CoverArtFrame
            src={post.cover_url}
            alt=""
            aspect="square"
            className={cn(
              "cj-sleeve-cover w-[50%] shrink-0 transition-transform duration-300 sm:w-[52%]",
              isActive && "-translate-y-0.5"
            )}
            sizes="(max-width: 640px) 180px, 220px"
          />
          <div className="relative isolate shrink-0 overflow-visible">
            <InteractiveVinyl
              size={compact ? 130 : 150}
              className="sm:hidden"
              coverUrl={post.cover_url || undefined}
              title={post.title}
              artist={post.author_display_name}
              isPlaying={isActive && isPlaying}
              interactive
              onPlayToggle={handlePlay}
            />
            <InteractiveVinyl
              size={compact ? 145 : 170}
              className="hidden sm:block"
              coverUrl={post.cover_url || undefined}
              title={post.title}
              artist={post.author_display_name}
              isPlaying={isActive && isPlaying}
              interactive
              onPlayToggle={handlePlay}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-2 sm:p-2.5">
        <p className="font-mono text-[9px] uppercase tracking-widest text-brand-gold">{post.genre}</p>
        <h3 className="mt-0.5 font-display text-lg uppercase leading-tight text-brand-parchment line-clamp-2">
          {post.title}
        </h3>
        <Link href={profileHref} className="mt-0.5 truncate font-body text-xs text-cj-text-muted hover:text-brand-gold">
          {post.author_display_name ?? "Musician"}
        </Link>
        {post.caption && !compact && (
          <p className="mt-1.5 line-clamp-1 font-body text-xs text-cj-text-muted">{post.caption}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-mono text-[10px] text-cj-text-muted">
            {post.play_count} plays · {post.like_count} likes
          </span>
          <button
            type="button"
            onClick={handlePlay}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-gold/40 text-brand-gold hover:bg-brand-gold/10"
            aria-label={isActive && isPlaying ? "Pause" : "Play"}
          >
            <Play className="h-3.5 w-3.5" fill="currentColor" />
          </button>
        </div>
      </div>
    </article>
  );
}
