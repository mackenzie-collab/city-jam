interface WaveformHeroProps {
  className?: string;
}

const BARS = [
  0.35, 0.55, 0.75, 0.95, 0.85, 0.65, 0.45, 0.7, 0.9, 0.8, 0.6, 0.5,
  0.65, 0.85, 1, 0.9, 0.7, 0.55, 0.4, 0.6, 0.8, 0.95, 0.75, 0.5,
  0.45, 0.65, 0.85, 0.7, 0.55, 0.4, 0.6, 0.8,
];

export default function WaveformHero({ className }: WaveformHeroProps) {
  return (
    <div
      className={`relative w-full max-w-md overflow-hidden rounded-lg border border-cj-border bg-cj-purple-card p-6 sm:p-8 ${className ?? ""}`}
      aria-hidden
    >
      {/* Flat groove ripples behind waveform */}
      <svg
        className="pointer-events-none absolute right-4 top-4 h-32 w-32 text-label-cream opacity-[0.06]"
        viewBox="0 0 128 128"
        aria-hidden
      >
        {[56, 44, 32, 20].map((r) => (
          <circle key={r} cx="64" cy="64" r={r} fill="none" stroke="currentColor" strokeWidth="1" />
        ))}
      </svg>

      <div className="relative mb-4 flex items-center gap-3">
        <div className="h-10 w-10 rounded-md bg-label-amber/20" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-3/4 rounded bg-label-cream/20" />
          <div className="h-2 w-1/2 rounded bg-label-cream/10" />
        </div>
      </div>

      <div className="relative flex h-32 items-end justify-center gap-1 sm:h-40 sm:gap-1.5">
        {BARS.map((h, i) => (
          <div
            key={i}
            className="cj-waveform-bar min-w-[3px] flex-1 max-w-[8px] bg-label-amber/70 transition-all"
            style={{ height: `${h * 100}%` }}
          />
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between text-xs text-cj-text-muted">
        <span>City Jam · Live session</span>
        <span className="font-medium text-label-amber">0:00 / 7:00</span>
      </div>
    </div>
  );
}
