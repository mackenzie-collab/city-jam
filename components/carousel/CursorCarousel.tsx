"use client";

import dynamic from "next/dynamic";
import type { CursorCarouselProps } from "@/components/carousel/CursorCarouselInner";
import { cn } from "@/lib/utils";

const CursorCarouselInner = dynamic(
  () => import("@/components/carousel/CursorCarouselInner"),
  {
    ssr: false,
    loading: () => <CarouselLoadingFallback />,
  }
);

function CarouselLoadingFallback() {
  return (
    <div
      className={cn(
        "cj-cursor-carousel cj-cursor-carousel--swiper relative min-h-[280px]",
        "flex items-center justify-center px-4 py-8"
      )}
      aria-busy="true"
      aria-label="Loading carousel"
    >
      <div className="h-48 w-48 max-w-[52vw] animate-pulse rounded-full bg-cj-surface/40" />
    </div>
  );
}

export default function CursorCarousel(props: CursorCarouselProps) {
  return <CursorCarouselInner {...props} />;
}

export type { CursorCarouselProps };
