"use client";

import { cn } from "@/lib/utils";
import InteractiveVinyl from "@/components/vinyl/InteractiveVinyl";

interface VinylPhotoFrameProps {
  src?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  children?: React.ReactNode;
}

/** Static circular vinyl-framed photo — use for uploaded cover art and portraits. */
export default function VinylPhotoFrame({
  src,
  alt = "",
  size = 180,
  className,
  children,
}: VinylPhotoFrameProps) {
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <InteractiveVinyl coverUrl={src || undefined} title={alt} size={size} interactive={false} />
      {children ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">{children}</div>
      ) : null}
    </div>
  );
}
