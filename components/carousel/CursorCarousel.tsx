"use client";

import { Children, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useCursorCarousel } from "@/hooks/useCursorCarousel";

interface CursorCarouselProps {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  /** Accessible label for the carousel region */
  ariaLabel?: string;
  gap?: "sm" | "md" | "lg";
}

const GAP = {
  sm: "gap-3",
  md: "gap-4 sm:gap-6",
  lg: "gap-6 sm:gap-8",
};

export default function CursorCarousel({
  children,
  className,
  trackClassName,
  ariaLabel = "Carousel",
  gap = "md",
}: CursorCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const { activeIndex, isDragging, handlers } = useCursorCarousel(trackRef);
  const slides = Children.toArray(children);

  return (
    <div className={cn("cj-cursor-carousel overflow-hidden", className)}>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={0}
        className={cn(
          "cj-cursor-carousel-track snap-x-mandatory flex items-stretch overflow-x-auto px-4 py-4 scrollbar-thin sm:px-6 md:px-8",
          GAP[gap],
          isDragging ? "cj-cursor-carousel-track--dragging cursor-grabbing select-none" : "cursor-grab",
          trackClassName
        )}
        {...handlers}
      >
        {slides.map((child, i) => (
          <div
            key={i}
            data-carousel-slide
            className={cn(
              "carousel-slide shrink-0 snap-center",
              activeIndex === i ? "cj-carousel-active" : "cj-carousel-inactive"
            )}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
