"use client";

import { Children, useCallback, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, Hand } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCursorCarousel } from "@/hooks/useCursorCarousel";

interface CursorCarouselProps {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Accessible label for the carousel region */
  ariaLabel?: string;
  gap?: "sm" | "md" | "lg";
  /** Full-bleed edge-to-edge track with peek of adjacent slides */
  fullBleed?: boolean;
  /** Narrower slides for compact vinyl cards */
  compact?: boolean;
  /** Prev/next arrows, dot indicators, and slide counter */
  showControls?: boolean;
  /** Animated drag hint until first interaction */
  showDragHint?: boolean;
}

const GAP = {
  sm: "gap-0 sm:gap-1",
  md: "gap-1 sm:gap-2",
  lg: "gap-2 sm:gap-3",
};

const CENTER_GLOW =
  "0 0 0 2px rgba(179, 162, 0, 0.85), 0 12px 32px rgba(0, 0, 0, 0.35)";

function slideContentStyle(
  scale: number,
  opacity: number,
  isCentered: boolean,
  animate: boolean
): CSSProperties {
  return {
    transform: `scale(${scale})`,
    opacity,
    boxShadow: isCentered ? CENTER_GLOW : undefined,
    transition: animate ? "transform 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease" : "none",
    transformOrigin: "center center",
  };
}

export default function CursorCarousel({
  children,
  className,
  trackClassName,
  ariaLabel = "Carousel",
  gap = "md",
  fullBleed = false,
  compact = false,
  showControls = false,
  showDragHint = false,
}: CursorCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const slides = Children.toArray(children);
  const slideCount = slides.length;
  const { activeIndex, isDragging, isScrolling, getSlideTransform, scrollToIndex, handlers } =
    useCursorCarousel(trackRef, { slideCount });
  const allowTransition = !isDragging && isScrolling;

  const markInteracted = useCallback(() => {
    setHasInteracted(true);
  }, []);

  const wrappedHandlers = {
    ...handlers,
    onPointerDown: (e: React.PointerEvent) => {
      markInteracted();
      handlers.onPointerDown(e);
    },
    onWheel: (e: React.WheelEvent) => {
      markInteracted();
      handlers.onWheel(e);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      markInteracted();
      handlers.onKeyDown(e);
    },
  };

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < slideCount - 1;

  return (
    <div
      className={cn(
        "cj-cursor-carousel cj-cursor-carousel--cover-flow relative",
        compact && "cj-cursor-carousel--compact",
        fullBleed ? "w-full" : "overflow-hidden",
        className
      )}
    >
      <div className="relative">
        {showDragHint && !hasInteracted && slideCount > 1 && (
          <div
            className="cj-drag-hint pointer-events-none absolute inset-x-0 top-2 z-10 flex items-center justify-center gap-2 sm:top-4"
            aria-hidden
          >
            <Hand className="h-3.5 w-3.5 text-brand-gold/90" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-brand-gold/90">
              ← Drag →
            </span>
          </div>
        )}

        <div
          ref={trackRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          tabIndex={0}
          className={cn(
            "cj-cursor-carousel-track snap-x-proximity flex items-center overflow-x-auto py-2 scrollbar-thin",
            fullBleed ? "cj-cursor-carousel-track--full-bleed px-0" : "px-4 sm:px-6 md:px-8",
            GAP[gap],
            isDragging ? "cj-cursor-carousel-track--dragging select-none" : "",
            trackClassName
          )}
          {...wrappedHandlers}
          onScroll={() => markInteracted()}
        >
          {fullBleed && <div className="cj-carousel-edge-spacer shrink-0" aria-hidden />}
          {slides.map((child, i) => {
            const { scale, opacity, zIndex, isCentered } = getSlideTransform(i);
            return (
              <div
                key={i}
                data-carousel-slide
                className="carousel-slide shrink-0 snap-center"
                style={{ zIndex }}
              >
                <div
                  className="cj-carousel-slide-content h-full w-full"
                  style={slideContentStyle(scale, opacity, isCentered, allowTransition)}
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
            "mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-3",
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
            <ChevronLeft className="h-4 w-4" />
          </button>

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
            className="min-w-[3.5rem] text-center font-mono text-[11px] uppercase tracking-widest text-brand-gold/80"
            aria-live="polite"
            aria-atomic="true"
          >
            {activeIndex + 1} / {slideCount}
          </span>

          <button
            type="button"
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={!canGoNext}
            aria-label="Next slide"
            className="cj-carousel-nav-btn"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export type { CursorCarouselProps };
