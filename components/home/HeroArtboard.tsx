"use client";

import { useEffect, useState } from "react";
import InteractiveVinyl from "@/components/vinyl/InteractiveVinyl";
import { useAudioPlayer, type Track } from "@/contexts/AudioPlayerContext";
import { fetchSceneFeed, incrementPlayCount, type AudioPost } from "@/lib/scene";
import { cn } from "@/lib/utils";

interface HeroArtboardProps {
  className?: string;
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

export default function HeroArtboard({ className }: HeroArtboardProps) {
  const [featured, setFeatured] = useState<AudioPost | null>(null);
  const { play, toggle, currentTrack, isPlaying, progress, duration } = useAudioPlayer();

  useEffect(() => {
    fetchSceneFeed({ limit: 1 }).then((posts) => {
      if (posts[0]) setFeatured(posts[0]);
    });
  }, []);

  const isActive = featured && currentTrack?.id === featured.id;

  const handleVinylToggle = () => {
    if (!featured) return;
    if (isActive) {
      toggle();
      return;
    }
    const track = toTrack(featured);
    play(track, [track]);
    incrementPlayCount(featured.id).catch(() => undefined);
  };

  return (
    <div
      className={cn(
        "cj-zine-border relative flex flex-col items-center bg-[var(--royal-purple-deep)]",
        "w-[min(92vw,420px)] sm:w-[min(78vw,480px)]",
        className
      )}
    >
      <div className="w-full border-b border-[var(--cj-zine-border)] px-4 py-3 text-center">
        <span className="font-display text-sm uppercase tracking-[0.14em] text-brand-parchment">
          City Jam
        </span>
        <span className="ml-3 font-mono text-[10px] text-brand-gold">Now spinning</span>
      </div>

      <div className="flex w-full flex-col items-center px-6 py-10 sm:py-12">
        <InteractiveVinyl
          size={260}
          coverUrl={featured?.cover_url}
          title={featured?.title}
          artist={featured?.author_display_name}
          isPlaying={!!isActive && isPlaying}
          progress={isActive ? progress : 0}
          duration={isActive ? duration : 0}
          interactive={!!featured}
          onPlayToggle={handleVinylToggle}
          showTime={!!isActive}
        />

        {featured ? (
          <div className="mt-8 text-center">
            <p className="font-display text-xl uppercase leading-tight text-brand-parchment sm:text-2xl">
              {featured.title}
            </p>
            <p className="mt-1 font-mono text-xs text-brand-parchment/70">
              {featured.author_display_name}
            </p>
          </div>
        ) : (
          <div className="mt-8 text-center">
            <p className="font-display text-xl uppercase leading-tight text-brand-parchment sm:text-2xl">
              Drop the needle
            </p>
            <p className="mt-1 font-mono text-xs text-brand-parchment/60">
              Loading scene feed…
            </p>
          </div>
        )}

        <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.16em] text-brand-parchment/50">
          Tap the vinyl to play
        </p>
      </div>

      <div className="w-full border-t border-[var(--cj-zine-border)] px-4 py-2 text-center">
        <span className="font-mono text-[9px] text-brand-gold">Close your eyes. Listen.</span>
      </div>
    </div>
  );
}
