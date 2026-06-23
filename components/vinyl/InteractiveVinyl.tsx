"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Groove radii as fraction of outer disc radius (0–1). */
const GROOVE_FRACTIONS = [0.96, 0.88, 0.8, 0.72, 0.64, 0.56, 0.48, 0.4, 0.32, 0.24, 0.16];

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
  /** Fill parent container (use with a sized wrapper for responsive scaling) */
  fluid?: boolean;
}

function formatTime(sec: number): string {
  if (!sec || !Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function InteractiveVinyl({
  size = 200,
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
  fluid = false,
}: InteractiveVinylProps) {
  const uid = useId().replace(/:/g, "");
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 1;
  const grooves = GROOVE_FRACTIONS.map((f) => outerR * f);
  const labelR = outerR * 0.58;
  const progressPct = duration > 0 ? progress / duration : 0;
  const arcEnd = progressPct * 360;
  const discClipId = `vinyl-disc-${uid}`;
  const labelClipId = `vinyl-label-${uid}`;
  const discGradId = `vinyl-disc-grad-${uid}`;

  const label = title ? `${title}${artist ? ` by ${artist}` : ""}` : "Vinyl record";

  const disc = (
    <div
      className={cn(
        "cj-vinyl-disc relative shrink-0 rounded-full",
        isPlaying && "cj-vinyl-disc--spinning motion-reduce:animate-none"
      )}
      style={fluid ? { width: "100%", height: "100%" } : { width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="cj-vinyl-graphic block h-full w-full"
        aria-hidden={interactive ? undefined : true}
      >
        <defs>
          <clipPath id={discClipId}>
            <circle cx={cx} cy={cy} r={outerR} />
          </clipPath>
          <clipPath id={labelClipId}>
            <circle cx={cx} cy={cy} r={labelR} />
          </clipPath>
          <radialGradient id={discGradId} cx="38%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#1a0030" />
            <stop offset="55%" stopColor="var(--cj-vinyl-disc-fill, #050508)" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
        </defs>
        <g clipPath={`url(#${discClipId})`}>
          <circle cx={cx} cy={cy} r={outerR} fill={`url(#${discGradId})`} />
          <circle
            cx={cx}
            cy={cy}
            r={outerR - 0.5}
            fill="none"
            stroke="var(--cj-vinyl-accent, #b3a200)"
            strokeWidth={isPlaying ? 1.5 : 1}
            opacity={isPlaying ? 0.7 : 0.4}
            className={isPlaying ? "cj-vinyl-ripple-ring motion-reduce:animate-none" : undefined}
          />
          {grooves.map((r, i) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="currentColor"
              strokeWidth={i < 2 ? 0.75 : 0.5}
              opacity={0.15 + (grooves.length - i) * 0.04}
            />
          ))}
          <circle
            cx={cx}
            cy={cy}
            r={labelR}
            fill="var(--cj-vinyl-label-fill, #b8860b)"
            opacity={coverUrl ? 0.92 : 1}
          />
          {coverUrl && (
            <image
              href={coverUrl}
              x={cx - labelR}
              y={cy - labelR}
              width={labelR * 2}
              height={labelR * 2}
              clipPath={`url(#${labelClipId})`}
              preserveAspectRatio="xMidYMid slice"
            />
          )}
          {duration > 0 && progressPct > 0 && (
            <circle
              cx={cx}
              cy={cy}
              r={outerR - 2}
              fill="none"
              stroke="var(--cj-vinyl-accent, #b3a200)"
              strokeWidth={1.5}
              strokeDasharray={`${(arcEnd / 360) * Math.PI * (outerR - 2) * 2} ${Math.PI * (outerR - 2) * 2}`}
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity={0.75}
            />
          )}
          <circle cx={cx} cy={cy} r={labelR * 0.12} fill="var(--cj-vinyl-spindle, #050508)" />
          <circle cx={cx} cy={cy} r={labelR * 0.05} fill="var(--parchment, #d0cf88)" opacity={0.85} />
        </g>
      </svg>
    </div>
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
        !showTime && "overflow-hidden",
        className
      )}
      style={showTime ? undefined : { width: size, height: size }}
      aria-label={isPlaying ? `Pause ${label}` : `Play ${label}`}
    >
      {disc}
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
