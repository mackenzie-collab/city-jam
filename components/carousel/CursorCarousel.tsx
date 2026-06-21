"use client";

import { Children, useRef, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCursorCarousel } from "@/hooks/useCursorCarousel";

interface CursorCarouselProps {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Accessible label for the carousel region */
  ariaLabel?: string;
  /** Full-bleed edge-to-edge track with peek of adjacent slides */
  fullBleed?: boolean;
  /** Narrower slides for compact vinyl cards */
  compact?: boolean;
  /** Prev/next arrows, dot indicators, and slide counter */
  showControls?: boolean;
}

function slideContentStyle(
  scale: number,
  opacity: number,
  animate: boolean
): CSSProperties {
  return {
    transform: `scale(${scale})`,
    opacity,
    transition: animate
      ? "transform 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.32s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      : "none",
    transformOrigin: "center center",
  };
}

export default function CursorCarousel({
  children,
  className,
  trackClassName,
  ariaLabel = "Carousel",
  fullBleed = false,
  compact = false,
  showControls = false,
}: CursorCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const slideCount = slides.length;
  const { activeIndex, getSlideTransform, scrollToIndex, handlers } =
    useCursorCarousel(trackRef, { slideCount });
  const allowTransition = true;

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < slideCount - 1;

  return (
    <div
      className={cn(
        "cj-cursor-carousel cj-cursor-carousel--cover-flow relative",
        compact && "cj-cursor-carousel--compact",
        fullBleed ? "w-full" : undefined,
        className
      )}
    >
      <div className="relative">
        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          tabIndex={0}
          className={cn(
            "cj-cursor-carousel-track snap-x-mandatory flex items-center gap-0",
            fullBleed ? "cj-cursor-carousel-track--full-bleed px-0" : "px-4 sm:px-6 md:px-8",
            trackClassName
          )}
          {...handlers}
        >
          {fullBleed && <div className="cj-carousel-edge-spacer shrink-0" aria-hidden />}
          {slides.map((child, i) => {
            const { scale, opacity, zIndex, isCentered } = getSlideTransform(i);
            return (
              <div
                key={i}
                data-carousel-slide
                className="carousel-slide shrink-0 snap-center snap-always"
                style={{ zIndex }}
              >
                <div
                  className={cn(
                    "cj-carousel-slide-content h-full w-full",
                    isCentered && "cj-carousel-slide-content--centered"
                  )}
                  style={slideContentStyle(scale, opacity, allowTransition)}
                >
                  {child}
                </div>
              </div>
            );
          })}
          {fullBleed && <div className="cj-carousel-edge-spacer shrink-0" aria-hidden />}
        </div>
      </div>

      {showControls && slideCount > 1 && (
        <div
          className={cn(
            "cj-carousel-controls mt-4 flex items-center justify-center gap-3 sm:gap-4",
            fullBleed ? "px-4 sm:px-6 md:px-8" : "px-4 sm:px-6 md:px-8"
          )}
        >
          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={!canGoPrev}
            aria-label="Previous slide"
            className="cj-carousel-nav-btn"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
          </button>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <div
              className="flex items-center gap-1.5"
              role="tablist"
              aria-label={`${ariaLabel} slides`}
            >
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => scrollToIndex(i)}
                  className={cn(
                    "cj-carousel-dot",
                    activeIndex === i ? "cj-carousel-dot--active" : "cj-carousel-dot--inactive"
                  )}
                />
              ))}
            </div>

            <span
              className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-gold/75 sm:text-[11px]"
              aria-live="polite"
              aria-atomic="true"
            >
              {String(activeIndex + 1).padStart(2, "0")} / {String(slideCount).padStart(2, "0")}
            </span>
          </div>

          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={!canGoNext}
            aria-label="Next slide"
            className="cj-carousel-nav-btn"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
          </button>
        </div>
      )}
    </div>
  );
}

export type { CursorCarouselProps };
