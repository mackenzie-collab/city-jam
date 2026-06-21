"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/** Groove radii as fraction of outer disc radius (0–1). */
const GROOVE_FRACTIONS = [0.98, 0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.34, 0.26, 0.18];

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
  const uid = useId().replace(/:/g, "");
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 1;
  const grooves = GROOVE_FRACTIONS.map((f) => outerR * f);
  const labelR = outerR * 0.48;
  const progressPct = duration > 0 ? progress / duration : 0;
  const arcEnd = progressPct * 360;
  const discClipId = `vinyl-disc-${uid}`;
  const labelClipId = `vinyl-label-${uid}`;

  const label = title ? `${title}${artist ? ` by ${artist}` : ""}` : "Vinyl record";

  const disc = (
    <div
      className={cn(
        "cj-vinyl-disc relative shrink-0 rounded-full",
        isPlaying && "cj-vinyl-disc--spinning motion-reduce:animate-none"
      )}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="cj-vinyl-graphic block h-full w-full text-brand-parchment/80"
        aria-hidden={interactive ? undefined : true}
      >
        <defs>
          <clipPath id={discClipId}>
            <circle cx={cx} cy={cy} r={outerR} />
          </clipPath>
          <clipPath id={labelClipId}>
            <circle cx={cx} cy={cy} r={labelR} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${discClipId})`}>
          <circle cx={cx} cy={cy} r={outerR} className="fill-[var(--cj-vinyl-disc-fill,#1a0030)]" />
          <circle
            cx={cx}
            cy={cy}
            r={outerR - 0.5}
            fill="none"
            stroke="#B3A200"
            strokeWidth={isPlaying ? 2 : 1.5}
            opacity={isPlaying ? 0.95 : 0.55}
          />
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
              stroke="#B3A200"
              strokeWidth={2}
              strokeDasharray={`${(arcEnd / 360) * Math.PI * (outerR - 2) * 2} ${Math.PI * (outerR - 2) * 2}`}
              transform={`rotate(-90 ${cx} ${cy})`}
              opacity={0.85}
            />
          )}
          <circle cx={cx} cy={cy} r={labelR * 0.38} fill="none" stroke="#B3A200" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={labelR * 0.22} fill="var(--royal-purple-deep, #3d0052)" />
          <circle cx={cx} cy={cy} r={labelR * 0.08} fill="var(--parchment, #D0CF88)" />
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
