"use client";

import useEmblaCarousel from "embla-carousel-react";
import {
  Children,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface SlideTransform {
  scale: number;
  opacity: number;
  zIndex: number;
  isCentered: boolean;
}

const CENTER_SCALE = 1.04;
const SIDE_SCALE = 0.94;
const FAR_SCALE = 0.88;
const CENTER_OPACITY = 1;
const SIDE_OPACITY = 0.65;
const FAR_OPACITY = 0.5;

const DEFAULT_TRANSFORM: SlideTransform = {
  scale: FAR_SCALE,
  opacity: FAR_OPACITY,
  zIndex: 1,
  isCentered: false,
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * Math.max(0, Math.min(1, t));
}

function computeCoverFlowTransform(distance: number): SlideTransform {
  const d = Math.abs(distance);

  if (d <= 1) {
    return {
      scale: lerp(CENTER_SCALE, SIDE_SCALE, d),
      opacity: lerp(CENTER_OPACITY, SIDE_OPACITY, d),
      zIndex: d < 0.35 ? 3 : 2,
      isCentered: d < 0.12,
    };
  }

  const t = Math.min(1, d - 1);
  return {
    scale: lerp(SIDE_SCALE, FAR_SCALE, t),
    opacity: lerp(SIDE_OPACITY, FAR_OPACITY, t),
    zIndex: 1,
    isCentered: false,
  };
}

function getFloatIndex(snapList: number[], scrollProgress: number): number {
  if (snapList.length === 0) return 0;
  if (snapList.length === 1) return 0;
  if (scrollProgress <= snapList[0]) return 0;
  if (scrollProgress >= snapList[snapList.length - 1]) return snapList.length - 1;

  for (let i = 0; i < snapList.length - 1; i++) {
    if (scrollProgress >= snapList[i] && scrollProgress <= snapList[i + 1]) {
      const range = snapList[i + 1] - snapList[i];
      const t = range > 0 ? (scrollProgress - snapList[i]) / range : 0;
      return i + t;
    }
  }

  return snapList.length - 1;
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
  const slides = Children.toArray(children);
  const slideCount = slides.length;
  const reducedMotion = useRef(false);
  const finePointer = useRef(false);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: false,
    duration: 28,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [slideTransforms, setSlideTransforms] = useState<SlideTransform[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    finePointer.current =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
  }, []);

  const updateCarousel = useCallback(() => {
    if (!emblaApi) return;

    const snapList = emblaApi.scrollSnapList();
    const scrollProgress = emblaApi.scrollProgress();
    const floatIndex = getFloatIndex(snapList, scrollProgress);

    if (reducedMotion.current) {
      const nearest = emblaApi.selectedScrollSnap();
      setSlideTransforms(
        snapList.map((_, i) => ({
          scale: 1,
          opacity: 1,
          zIndex: i === nearest ? 10 : 1,
          isCentered: i === nearest,
        }))
      );
    } else {
      setSlideTransforms(
        snapList.map((_, i) => computeCoverFlowTransform(Math.abs(i - floatIndex)))
      );
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    updateCarousel();
    emblaApi.on("scroll", updateCarousel);
    emblaApi.on("select", updateCarousel);
    emblaApi.on("reInit", updateCarousel);

    return () => {
      emblaApi.off("scroll", updateCarousel);
      emblaApi.off("select", updateCarousel);
      emblaApi.off("reInit", updateCarousel);
    };
  }, [emblaApi, updateCarousel]);

  useEffect(() => {
    emblaApi?.reInit();
  }, [emblaApi, slideCount]);

  const scrollToIndex = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      const i = Math.max(0, Math.min(slideCount - 1, index));
      emblaApi.scrollTo(i);
    },
    [emblaApi, slideCount]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!emblaApi || !finePointer.current) return;
      const horizontal = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontal) return;
      e.preventDefault();
      if (e.deltaX > 0 || e.deltaY > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    },
    [emblaApi]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!emblaApi) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        emblaApi.scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        emblaApi.scrollNext();
      }
    },
    [emblaApi]
  );

  const allowTransition = true;

  return (
    <div
      className={cn(
        "cj-cursor-carousel cj-cursor-carousel--cover-flow relative",
        compact && "cj-cursor-carousel--compact",
        fullBleed ? "w-full" : undefined,
        className
      )}
    >
      <div className="relative overflow-x-visible bg-inherit">
        <div
          ref={emblaRef}
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          tabIndex={0}
          onWheel={onWheel}
          onKeyDown={onKeyDown}
          className={cn(
            "cj-embla-viewport",
            fullBleed ? "cj-embla-viewport--full-bleed" : "px-4 sm:px-6 md:px-8",
            trackClassName
          )}
        >
          <div className="cj-embla-container flex items-center">
            {slides.map((child, i) => {
              const { scale, opacity, zIndex, isCentered } =
                slideTransforms[i] ?? DEFAULT_TRANSFORM;
              return (
                <div
                  key={i}
                  data-carousel-slide
                  className="carousel-slide shrink-0"
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
          </div>
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
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
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
                  aria-selected={selectedIndex === i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => scrollToIndex(i)}
                  className={cn(
                    "cj-carousel-dot",
                    selectedIndex === i
                      ? "cj-carousel-dot--active"
                      : "cj-carousel-dot--inactive"
                  )}
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
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
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
