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
        "relative shrink-0 rounded-full border-2 border-cj-gold/60 bg-cj-dark shadow-lg",
        spinning && "animate-spin",
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <circle cx="50" cy="50" r="48" fill="var(--cj-surface, #1a0030)" stroke="var(--cj-text, #c9a800)" strokeWidth="1" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="var(--cj-text, #c9a800)" strokeWidth="0.5" opacity="0.4" />
        <circle cx="50" cy="50" r="25" fill="none" stroke="var(--cj-text, #c9a800)" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="15" fill="none" stroke="var(--cj-text, #c9a800)" strokeWidth="0.5" opacity="0.2" />
        <circle cx="50" cy="50" r="8" fill="var(--cj-text, #c9a800)" />
        <circle cx="50" cy="50" r="3" fill="var(--cj-vinyl, #0d0d0d)" />
      </svg>
    </div>
  );
}
