"use client";

import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CursorCarouselProps {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
  fullBleed?: boolean;
  compact?: boolean;
  variant?: "default" | "gallery";
  showControls?: boolean;
  /** Reset scroll position when filtered content changes */
  contentKey?: string;
  /** Wrap prev/next at ends when more than 4 slides */
  loop?: boolean;
}

function visibleDotIndices(active: number, total: number, max = 7): number[] {
  if (total <= max) return Array.from({ length: total }, (_, i) => i);
  const half = Math.floor(max / 2);
  let start = Math.max(0, active - half);
  const end = Math.min(total - 1, start + max - 1);
  start = Math.max(0, end - max + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Native scroll-snap carousel — no Swiper, no dynamic import, no third-party runtime.
 * Touch swipe and arrow buttons use the browser scroll APIs only.
 */
export default function CursorCarousel({
  children,
  className,
  trackClassName,
  ariaLabel = "Carousel",
  fullBleed = false,
  compact = false,
  variant = "default",
  showControls = false,
  contentKey,
  loop = false,
}: CursorCarouselProps) {
  const slides = Children.toArray(children);
  const slideCount = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const useLoop = loop && slideCount > 4;

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const slide = slideRefs.current[index];
    if (!slide) return;
    slide.scrollIntoView({ behavior, inline: "center", block: "nearest" });
    setSelectedIndex(index);
  }, []);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, slideCount);
  }, [slideCount]);

  useEffect(() => {
    setSelectedIndex(0);
    const frame = requestAnimationFrame(() => {
      scrollToIndex(0, "instant");
    });
    return () => cancelAnimationFrame(frame);
  }, [contentKey, slideCount, scrollToIndex]);

  useEffect(() => {
    const root = trackRef.current;
    if (!root || slideCount < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestIndex = -1;
        let bestRatio = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = Number((entry.target as HTMLElement).dataset.slideIndex);
          if (Number.isNaN(idx)) continue;
          if (entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestIndex = idx;
          }
        }
        if (bestIndex >= 0 && bestRatio >= 0.35) {
          setSelectedIndex(bestIndex);
        }
      },
      { root, threshold: [0.35, 0.5, 0.65, 0.8] }
    );

    slideRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [slideCount, contentKey]);

  const goTo = useCallback(
    (index: number) => scrollToIndex(index),
    [scrollToIndex]
  );

  const goPrev = useCallback(() => {
    if (selectedIndex <= 0) {
      if (useLoop) scrollToIndex(slideCount - 1);
      return;
    }
    scrollToIndex(selectedIndex - 1);
  }, [selectedIndex, slideCount, scrollToIndex, useLoop]);

  const goNext = useCallback(() => {
    if (selectedIndex >= slideCount - 1) {
      if (useLoop) scrollToIndex(0);
      return;
    }
    scrollToIndex(selectedIndex + 1);
  }, [selectedIndex, slideCount, scrollToIndex, useLoop]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      }
    };

    track.addEventListener("keydown", onKeyDown);
    return () => track.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (slideCount === 0) return null;

  if (slideCount === 1) {
    return (
      <div className={cn("cj-cursor-carousel relative", className)}>
        {slides[0]}
      </div>
    );
  }

  const dots = visibleDotIndices(selectedIndex, slideCount);
  const atStart = !useLoop && selectedIndex === 0;
  const atEnd = !useLoop && selectedIndex === slideCount - 1;

  return (
    <div
      className={cn(
        "cj-cursor-carousel relative",
        compact && "cj-cursor-carousel--compact",
        variant === "gallery" && "cj-cursor-carousel--gallery",
        className
      )}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        className={cn(
          "cj-carousel-track scrollbar-thin snap-x-mandatory",
          fullBleed ? "cj-carousel-track--full-bleed" : "cj-carousel-track--inset",
          trackClassName
        )}
      >
        {slides.map((child, index) => {
          const isActive = index === selectedIndex;
          const isAdjacent = Math.abs(index - selectedIndex) === 1;

          return (
            <div
              key={contentKey ? `${contentKey}-${index}` : index}
              ref={(el) => {
                slideRefs.current[index] = el;
              }}
              data-slide-index={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${slideCount}`}
              aria-hidden={!isActive && !isAdjacent}
              className={cn(
                "carousel-slide snap-start",
                isActive && "carousel-slide--active",
                isAdjacent && "carousel-slide--adjacent"
              )}
            >
              <div className="cj-carousel-slide-content h-full w-full">{child}</div>
            </div>
          );
        })}
      </div>

      {showControls && slideCount > 1 && (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
          <div className="cj-carousel-controls mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
            <button
              type="button"
              aria-label="Previous slide"
              className={cn("cj-carousel-nav-btn", atStart && "cj-carousel-nav-btn--disabled")}
              onClick={goPrev}
              disabled={atStart}
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
            </button>

            <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
              <div
                className="cj-carousel-dots flex max-w-[12rem] items-center justify-center gap-1.5 overflow-hidden sm:max-w-none"
                role="tablist"
                aria-label={`${ariaLabel} slides`}
              >
                {dots.map((index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={index === selectedIndex}
                    aria-label={`Go to slide ${index + 1}`}
                    className={cn(
                      "cj-carousel-dot",
                      index === selectedIndex
                        ? "cj-carousel-dot--active"
                        : "cj-carousel-dot--inactive"
                    )}
                    onClick={() => goTo(index)}
                  />
                ))}
              </div>
              <span
                className="font-mono text-[10px] uppercase tracking-[0.22em] text-brand-gold/75 sm:text-[11px]"
                aria-live="polite"
                aria-atomic="true"
              >
                {String(selectedIndex + 1).padStart(2, "0")} /{" "}
                {String(slideCount).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              aria-label="Next slide"
              className={cn("cj-carousel-nav-btn", atEnd && "cj-carousel-nav-btn--disabled")}
              onClick={goNext}
              disabled={atEnd}
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
