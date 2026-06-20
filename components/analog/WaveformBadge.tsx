import { cn } from "@/lib/utils";

interface WaveformBadgeProps {
  label?: string;
  animate?: boolean;
  className?: string;
}

export default function WaveformBadge({ label, animate = false, className }: WaveformBadgeProps) {
  const bars = [3, 6, 4, 8, 5, 7, 3];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-cj-gold-border bg-cj-purple-card/80 px-3 py-1",
        className
      )}
    >
      <svg viewBox="0 0 28 12" className="h-3 w-7 text-cj-gold" aria-hidden>
        {bars.map((h, i) => (
          <rect
            key={i}
            x={i * 4}
            y={(12 - h) / 2}
            width="2"
            height={h}
            fill="currentColor"
            className={animate ? "animate-pulse-dot" : undefined}
            style={animate ? { animationDelay: `${i * 0.08}s` } : undefined}
          />
        ))}
      </svg>
      {label && (
        <span className="text-[9px] uppercase tracking-widest text-cj-gold-muted">{label}</span>
      )}
    </span>
  );
}
