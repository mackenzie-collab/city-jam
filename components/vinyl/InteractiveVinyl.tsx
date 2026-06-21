"use client";

import { cn } from "@/lib/utils";

const GROOVES = [340, 310, 280, 250, 220, 190, 160, 130, 100, 72, 48];

export interface InteractiveVinylProps {
  size?: number;
  coverUrl?: string;
  title?: string;
  artist?: string;
  isPlaying?: boolean;
  progress?: number;
  duration?: number;
  interactive?: boolean;
  onPlayToggle?: () => void;
  className?: string;
  /** Show time readout for a11y */
  showTime?: boolean;
}

function formatTime(sec: number): string {
  if (!sec || !Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function InteractiveVinyl({
  size = 180,
  coverUrl,
  title,
  artist,
  isPlaying = false,
  progress = 0,
  duration = 0,
  interactive = true,
  onPlayToggle,
  className,
  showTime = false,
}: InteractiveVinylProps) {
  const cx = size / 2;
  const cy = size / 2;
  const grooves = GROOVES.map((r) => (r * size) / 340);
  const progressPct = duration > 0 ? progress / duration : 0;
  const arcEnd = progressPct * 360;

  const label = title ? `${title}${artist ? ` by ${artist}` : ""}` : "Vinyl record";

  const disc = (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={cn(
        "cj-vinyl-graphic text-brand-parchment/80",
        isPlaying && "animate-vinyl-spin motion-reduce:animate-none"
      )}
      style={{ width: size, height: size }}
      aria-hidden={interactive ? undefined : true}
    >
      <defs>
        <clipPath id={`vinyl-cover-${size}`}>
          <circle cx={cx} cy={cy} r={size * 0.38} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={grooves[0] + 4} className="fill-[var(--cj-vinyl-disc-fill,#1a0030)]" />
      {grooves.map((r, i) => (
        <circle
          key={r}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={i < 3 ? 1.5 : 1}
          opacity={i < 4 ? 0.9 : 0.35 + (grooves.length - i) * 0.05}
        />
      ))}
      {coverUrl && (
        <image
          href={coverUrl}
          x={cx - size * 0.38}
          y={cy - size * 0.38}
          width={size * 0.76}
          height={size * 0.76}
          clipPath={`url(#vinyl-cover-${size})`}
          preserveAspectRatio="xMidYMid slice"
        />
      )}
      {duration > 0 && progressPct > 0 && (
        <circle
          cx={cx}
          cy={cy}
          r={grooves[0] + 2}
          fill="none"
          stroke="#B3A200"
          strokeWidth={2}
          strokeDasharray={`${(arcEnd / 360) * Math.PI * (grooves[0] + 2) * 2} ${Math.PI * (grooves[0] + 2) * 2}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          opacity={0.85}
        />
      )}
      <circle cx={cx} cy={cy} r={size * 0.14} fill="none" stroke="#B3A200" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={size * 0.08} fill="var(--royal-purple-deep, #3d0052)" />
      <circle cx={cx} cy={cy} r={size * 0.025} fill="var(--parchment, #D0CF88)" />
    </svg>
  );

  if (!interactive) {
    return (
      <div className={cn("relative inline-flex", className)} aria-hidden>
        {disc}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onPlayToggle}
      className={cn(
        "group relative inline-flex flex-col items-center rounded-full border-0 bg-transparent p-0",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold",
        className
      )}
      aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
    >
      <div
        className={cn(
          "rounded-full border-2 border-brand-gold/60 transition-transform",
          isPlaying && "border-brand-gold"
        )}
      >
        {disc}
      </div>
      {showTime && duration > 0 && (
        <span className="mt-2 font-mono text-[10px] text-brand-gold" aria-live="polite">
          {formatTime(progress)} / {formatTime(duration)}
        </span>
      )}
      {title && (
        <span className="sr-only">
          {title}
          {artist ? ` — ${artist}` : ""}
        </span>
      )}
    </button>
  );
}
