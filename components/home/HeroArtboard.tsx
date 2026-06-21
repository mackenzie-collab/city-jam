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

function useHeroVinylSize() {
  const [size, setSize] = useState(240);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 768) setSize(310);
      else if (w >= 640) setSize(280);
      else setSize(Math.min(240, Math.floor(w * 0.62)));
    };
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export default function HeroArtboard({ className }: HeroArtboardProps) {
  const [featured, setFeatured] = useState<AudioPost | null>(null);
  const vinylSize = useHeroVinylSize();
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
        "cj-zine-border relative flex w-full max-w-[min(92vw,460px)] flex-col items-center bg-[var(--royal-purple-deep)] sm:max-w-[min(78vw,520px)]",
        className
      )}
    >
      <div className="w-full border-b border-[var(--cj-zine-border)] px-4 py-3 text-center">
        <span className="font-display text-sm uppercase tracking-[0.14em] text-brand-parchment">
          City Jam
        </span>
        <span className="ml-3 font-mono text-[10px] text-brand-gold">Now spinning</span>
      </div>

      <div className="flex w-full flex-col items-center px-4 py-8 sm:px-6 sm:py-10 md:py-12">
        <InteractiveVinyl
          size={vinylSize}
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
          <div className="mt-6 text-center sm:mt-8">
            <p className="font-display text-lg uppercase leading-tight text-brand-parchment sm:text-xl md:text-2xl">
              {featured.title}
            </p>
            <p className="mt-1 font-mono text-xs text-brand-parchment/70">
              {featured.author_display_name}
            </p>
          </div>
        ) : (
          <div className="mt-6 text-center sm:mt-8">
            <p className="font-display text-lg uppercase leading-tight text-brand-parchment sm:text-xl md:text-2xl">
              Drop the needle
            </p>
            <p className="mt-1 font-mono text-xs text-brand-parchment/60">
              Loading scene feed…
            </p>
          </div>
        )}

        <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-brand-parchment/50 sm:mt-6">
          Tap the vinyl to play
        </p>
      </div>

      <div className="w-full border-t border-[var(--cj-zine-border)] px-4 py-2 text-center">
        <span className="font-mono text-[9px] text-brand-gold">Close your eyes. Listen.</span>
      </div>
    </div>
  );
}
