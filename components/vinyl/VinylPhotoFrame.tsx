"use client";

import { cn } from "@/lib/utils";
import InteractiveVinyl from "@/components/vinyl/InteractiveVinyl";

interface VinylPhotoFrameProps {
  src?: string | null;
  alt?: string;
  size?: number;
  /** Max width as vw fraction for mobile clamp, e.g. 42 = min(size, 42vw) */
  maxVw?: number;
  className?: string;
  children?: React.ReactNode;
}

/** Static circular vinyl-framed photo — use for uploaded cover art and portraits. */
export default function VinylPhotoFrame({
  src,
  alt = "",
  size = 220,
  maxVw = 72,
  className,
  children,
}: VinylPhotoFrameProps) {
  const frameSize = `min(${size}px, ${maxVw}vw)`;

  return (
    <div
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: frameSize, height: frameSize }}
    >
      <InteractiveVinyl
        coverUrl={src || undefined}
        title={alt}
        size={size}
        interactive={false}
        fluid
        className="size-full"
      />
      {children ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">{children}</div>
      ) : null}
    </div>
  );
}
