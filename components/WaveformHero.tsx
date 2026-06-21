import { cn } from "@/lib/utils";

interface WaveformHeroProps {
  className?: string;
}

const BARS = [
  0.35, 0.55, 0.75, 0.95, 0.85, 0.65, 0.45, 0.7, 0.9, 0.8, 0.6, 0.5,
  0.65, 0.85, 1, 0.9, 0.7, 0.55, 0.4, 0.6, 0.8, 0.95, 0.75, 0.5,
  0.45, 0.65, 0.85, 0.7, 0.55, 0.4, 0.6, 0.8,
];

/** Zine-style waveform panel — constructivist, no decorative circles. */
export default function WaveformHero({ className }: WaveformHeroProps) {
  return (
    <div
      className={cn(
        "cj-zine-border relative w-full max-w-md overflow-hidden bg-brand-purple-deep p-6 sm:p-8",
        className
      )}
      aria-hidden
    >
      <div className="mb-4 flex items-center gap-3 border-b border-brand-gold/25 pb-4">
        <div className="flex h-10 w-10 items-center justify-center border border-brand-gold bg-brand-purple">
          <span className="font-display text-sm text-brand-gold">CJ</span>
        </div>
        <div className="flex-1">
          <p className="font-display text-sm uppercase tracking-[0.1em] text-brand-parchment">
            Live session
          </p>
          <p className="font-mono text-[10px] text-brand-parchment/60">Anonymous · Audio only</p>
        </div>
      </div>

      <div className="relative flex h-32 items-end justify-center gap-1 sm:h-40 sm:gap-1.5">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="cj-waveform-bar min-w-[3px] max-w-[8px] flex-1 bg-brand-gold/75"
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between font-mono text-xs text-brand-parchment/60">
        <span>City Jam · Session</span>
        <span className="text-brand-gold">0:00 / 7:00</span>
      </div>
    </div>
  );
}
