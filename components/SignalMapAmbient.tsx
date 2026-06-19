"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const SignalMapWorld = dynamic(() => import("@/components/SignalMapWorld"), {
  ssr: false,
  loading: () => null,
});

interface SignalMapAmbientProps {
  className?: string;
  opacity?: number;
}

/** Decorative world map — ambient background, no geolocation or navigation UX. */
export default function SignalMapAmbient({
  className,
  opacity = 0.4,
}: SignalMapAmbientProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-full w-full min-h-[280px] max-w-[1200px]">
          <SignalMapWorld decorative cities={[]} />
        </div>
      </div>
    </div>
  );
}
