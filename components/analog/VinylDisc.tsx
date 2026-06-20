import { cn } from "@/lib/utils";

interface VinylDiscProps {
  size?: number;
  spinning?: boolean;
  className?: string;
}

export default function VinylDisc({ size = 80, spinning = false, className }: VinylDiscProps) {
  return (
    <div
      className={cn(
        "cj-vinyl-platter relative shrink-0",
        spinning && "cj-vinyl-platter-spin",
        className
      )}
      style={{ width: size, height: size }}
      role="img"
      aria-label={spinning ? "Spinning vinyl record" : "Vinyl record"}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <circle cx="50" cy="50" r="48" fill="var(--cj-vinyl)" stroke="var(--cj-text)" strokeWidth="1" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="var(--cj-text)" strokeWidth="0.5" opacity="0.4" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="var(--cj-text)" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="var(--cj-text)" strokeWidth="0.5" opacity="0.2" />
        <circle cx="50" cy="50" r="8" fill="var(--label-amber)" />
        <circle cx="50" cy="50" r="3" fill="var(--cj-vinyl)" />
      </svg>
    </div>
  );
}
