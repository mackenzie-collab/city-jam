import { cn } from "@/lib/utils";
import BarcodeDivider from "@/components/BarcodeDivider";

interface PosterMotifProps {
  className?: string;
  /** 0–1 opacity multiplier */
  opacity?: number;
  variant?: "hero" | "section" | "minimal";
  /** When true, fills container as dominant graphic */
  dominant?: boolean;
}

const GROOVES = [340, 310, 280, 250, 220, 190, 160, 130, 100, 72, 48];

/**
 * Cohesive vinyl artboard — constructivist zine layout.
 * One intentional composition: sleeve grid + disc + track strip. Not scattered circles.
 */
export default function PosterMotif({
  className,
  opacity = 1,
  variant = "hero",
  dominant = false,
}: PosterMotifProps) {
  if (variant === "section") {
    return <SectionDivider className={className} opacity={opacity} />;
  }

  if (variant === "minimal") {
    return <MinimalEdge className={className} opacity={opacity} />;
  }

  return (
    <div
      className={cn(
        "pointer-events-none select-none",
        dominant
          ? "relative flex h-full w-full items-center justify-center"
          : "absolute inset-0 overflow-hidden",
        className
      )}
      style={{ opacity }}
      aria-hidden
    >
      <div
        className={cn(
          "cj-zine-border relative flex flex-col bg-[var(--royal-purple-deep)]",
          dominant
            ? "aspect-[4/5] w-[min(92vw,420px)] sm:w-[min(78vw,480px)]"
            : "aspect-[4/5] w-full max-w-[480px]"
        )}
      >
        {/* Top strip — Side A header */}
        <div className="flex items-stretch border-b border-[var(--cj-zine-border)]">
          <div className="flex w-8 shrink-0 items-center justify-center border-r border-[var(--cj-zine-border)] bg-[var(--royal-purple)]">
            <span className="font-display text-lg text-brand-gold">A</span>
          </div>
          <div className="flex flex-1 items-center justify-between px-3 py-2">
            <span className="font-display text-sm uppercase tracking-[0.14em] text-brand-parchment">
              City Jam
            </span>
            <span className="font-mono text-[10px] text-brand-gold">LP · 2026</span>
          </div>
          <div className="hidden w-6 shrink-0 border-l border-[var(--cj-zine-border)] sm:block">
            <BarcodeDivider orientation="vertical" className="h-full w-full opacity-90" />
          </div>
        </div>

        {/* Main artboard — asymmetric grid */}
        <div className="relative flex flex-1 flex-col sm:flex-row">
          {/* Left: track metadata */}
          <div className="flex flex-1 flex-col justify-between border-b border-[var(--cj-zine-border)] p-4 sm:border-b-0 sm:border-r">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-brand-gold">
                Side A
              </p>
              <p className="mt-3 font-display text-2xl uppercase leading-none text-brand-parchment sm:text-3xl">
                Find
                <br />
                your noise
              </p>
            </div>
            <ul className="mt-6 space-y-2 font-mono text-[11px] text-brand-parchment/70">
              <li className="flex justify-between border-b border-brand-gold/20 pb-1">
                <span>01 · Blind Echo</span>
                <span className="text-brand-gold">7:00</span>
              </li>
              <li className="flex justify-between border-b border-brand-gold/20 pb-1">
                <span>02 · Echo Roulette</span>
                <span className="text-brand-gold">∞</span>
              </li>
              <li className="flex justify-between pb-1">
                <span>03 · Project Match</span>
                <span className="text-brand-gold">—</span>
              </li>
            </ul>
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.16em] text-brand-parchment/50">
              Close your eyes. Listen.
            </p>
          </div>

          {/* Right: vinyl disc — single intentional graphic */}
          <div className="relative flex items-center justify-center bg-[var(--royal-purple)] p-6 sm:w-[55%]">
            <VinylDisc size={dominant ? 220 : 180} />
            {/* Tonearm — purposeful anchor */}
            <svg
              className="absolute right-[12%] top-[8%] h-16 w-16 text-brand-parchment/80 sm:h-20 sm:w-20"
              viewBox="0 0 80 80"
              aria-hidden
            >
              <line x1="8" y1="68" x2="62" y2="14" stroke="currentColor" strokeWidth="2" />
              <circle cx="62" cy="14" r="4" fill="currentColor" />
              <circle cx="8" cy="68" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Bottom barcode strip */}
        <div className="flex items-center gap-3 border-t border-[var(--cj-zine-border)] px-3 py-2">
          <BarcodeDivider className="flex-1 opacity-80" />
          <span className="shrink-0 font-mono text-[9px] text-brand-gold">CJ-001</span>
        </div>
      </div>
    </div>
  );
}

function VinylDisc({ size }: { size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const grooves = GROOVES.map((r) => (r * size) / 340);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="cj-vinyl-graphic animate-vinyl-spin"
      style={{ width: size, height: size }}
      aria-hidden
    >
      <circle cx={cx} cy={cy} r={grooves[0] + 4} className="fill-[var(--cj-vinyl-disc-fill)]" />
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
      {/* Center label — gold ring only, no random overlapping circles */}
      <circle cx={cx} cy={cy} r={size * 0.14} fill="none" stroke="#B3A200" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={size * 0.08} fill="var(--royal-purple-deep)" />
      <circle cx={cx} cy={cy} r={size * 0.025} fill="var(--parchment)" />
    </svg>
  );
}

/** Section divider — partial disc edge, not full scattered motif */
function SectionDivider({ className, opacity }: { className?: string; opacity?: number }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity: (opacity ?? 0.5) * 0.6 }}
      aria-hidden
    >
      <svg
        className="absolute -right-[30%] top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-y-1/2 text-brand-parchment/10"
        viewBox="0 0 520 520"
      >
        {[480, 420, 360, 300, 240].map((r) => (
          <circle key={r} cx="260" cy="260" r={r} fill="none" stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--cj-zine-border)]" />
    </div>
  );
}

/** Minimal edge accent for secondary sections */
function MinimalEdge({ className, opacity }: { className?: string; opacity?: number }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity: (opacity ?? 0.35) * 0.5 }}
      aria-hidden
    >
      <div className="absolute right-0 top-0 h-full w-px bg-brand-gold/20" />
      <svg
        className="absolute -right-16 bottom-8 h-32 w-32 text-brand-parchment/8"
        viewBox="0 0 128 128"
      >
        <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="64" cy="64" r="40" fill="none" stroke="currentColor" strokeWidth="0.75" />
      </svg>
    </div>
  );
}
