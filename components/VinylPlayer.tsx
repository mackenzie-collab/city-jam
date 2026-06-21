"use client";

import { SkipBack, Pause, Play, SkipForward } from "lucide-react";
import InteractiveVinyl from "@/components/vinyl/InteractiveVinyl";
import { cn } from "@/lib/utils";

interface VinylPlayerProps {
  title: string;
  artist: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek?: (seconds: number) => void;
  compact?: boolean;
  coverUrl?: string;
}

function formatTime(sec: number): string {
  if (!sec || !Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function VinylPlayer({
  title,
  artist,
  isPlaying,
  progress,
  duration,
  onToggle,
  onPrev,
  onNext,
  onSeek,
  compact = false,
  coverUrl,
}: VinylPlayerProps) {
  const pct = duration > 0 ? (progress / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(duration, ratio * duration)));
  };

  return (
    <div className={cn("flex items-center gap-3", compact ? "w-full" : "max-w-md")}>
      <InteractiveVinyl
        size={compact ? 48 : 80}
        coverUrl={coverUrl}
        title={title}
        artist={artist}
        isPlaying={isPlaying}
        progress={progress}
        duration={duration}
        interactive
        onPlayToggle={onToggle}
        className="shrink-0"
      />

      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "cj-badge mb-1 inline-block uppercase",
            compact ? "text-[8px] leading-tight" : "mb-2 text-[9px]"
          )}
        >
          Now Playing
        </span>
        <p className="truncate font-display text-sm uppercase text-cj-gold">{title}</p>
        <p className="truncate text-xs text-cj-gold-muted">{artist}</p>

        <div
          className="mt-2 h-1 cursor-pointer rounded-full bg-cj-gold/20"
          onClick={handleSeek}
          role="slider"
          aria-valuenow={progress}
          aria-valuemax={duration}
          aria-label="Seek"
        >
          <div
            className="h-full rounded-full bg-cj-gold transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10px] text-cj-gold-muted">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center text-cj-gold hover:opacity-80"
          aria-label="Previous track"
        >
          <SkipBack className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onToggle}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cj-gold bg-cj-gold/10 text-cj-gold hover:bg-cj-gold/20"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center text-cj-gold hover:opacity-80"
          aria-label="Next track"
        >
          <SkipForward className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
