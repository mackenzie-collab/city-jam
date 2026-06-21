import { cn } from "@/lib/utils";

interface GrainOverlayProps {
  className?: string;
  /** Warm risograph tint on hero / photo sections */
  warm?: boolean;
  /** Override default intensity (0–1) */
  intensity?: number;
}

/** Risograph grain — warm, photographic overlay for poster sections. */
export default function GrainOverlay({
  className,
  warm = false,
  intensity,
}: GrainOverlayProps) {
  return (
    <div
      className={cn(
        "cj-grain pointer-events-none absolute inset-0",
        warm && "cj-grain-warm",
        className
      )}
      style={intensity !== undefined ? { opacity: intensity } : undefined}
      aria-hidden
    />
  );
}
