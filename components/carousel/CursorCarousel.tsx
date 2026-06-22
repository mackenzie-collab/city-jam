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
        "cj-cursor-carousel cj-cursor-carousel--swiper relative min-h-[24rem] md:min-h-[28rem]",
        "flex items-center justify-center px-4 py-8"
      )}
      aria-busy="true"
      aria-label="Loading carousel"
    >
      <div className="cj-zine-border mx-auto w-full max-w-[min(92vw,400px)] animate-pulse bg-brand-purple-deep sm:max-w-[min(88vw,440px)]">
        <div className="border-b border-[var(--cj-zine-border)] bg-brand-purple p-4">
          <div className="flex items-end justify-center gap-3">
            <div className="aspect-square w-[52%] rounded-2xl bg-cj-surface/50" />
            <div className="h-[170px] w-[170px] shrink-0 rounded-full bg-cj-surface/40 sm:h-[200px] sm:w-[200px]" />
          </div>
        </div>
        <div className="space-y-2 p-3">
          <div className="h-2 w-16 rounded bg-brand-gold/20" />
          <div className="h-5 w-3/4 rounded bg-cj-text/10" />
          <div className="h-3 w-1/2 rounded bg-cj-text/10" />
        </div>
      </div>
    </div>
  );
}

export default function CursorCarousel(props: CursorCarouselProps) {
  return <CursorCarouselInner {...props} />;
}

export type { CursorCarouselProps };
