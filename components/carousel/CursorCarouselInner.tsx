"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, A11y } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export interface CursorCarouselProps {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
  fullBleed?: boolean;
  compact?: boolean;
  showControls?: boolean;
  /** Infinite loop when more than 4 slides */
  loop?: boolean;
}

function CarouselCardSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "cj-zine-border mx-auto flex w-full max-w-[min(92vw,400px)] flex-col bg-brand-purple-deep animate-pulse sm:max-w-[min(88vw,440px)]",
        compact && "max-w-[min(90vw,360px)]"
      )}
      aria-hidden
    >
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
  );
}

export default function CursorCarouselInner({
  children,
  className,
  trackClassName,
  ariaLabel = "Carousel",
  fullBleed = false,
  compact = false,
  showControls = false,
  loop = false,
}: CursorCarouselProps) {
  const slides = Children.toArray(children);
  const slideCount = slides.length;
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!swiper || !showControls) return;

    if (prevRef.current && nextRef.current) {
      swiper.params.navigation = {
        prevEl: prevRef.current,
        nextEl: nextRef.current,
        disabledClass: "cj-carousel-nav-btn--disabled",
      };
      swiper.navigation.destroy();
      swiper.navigation.init();
      swiper.navigation.update();
    }

    if (paginationRef.current) {
      swiper.params.pagination = {
        el: paginationRef.current,
        clickable: true,
        bulletClass: "cj-carousel-dot cj-carousel-dot--inactive",
        bulletActiveClass: "cj-carousel-dot--active",
      };
      swiper.pagination.destroy();
      swiper.pagination.init();
      swiper.pagination.render();
      swiper.pagination.update();
    }
  }, [swiper, showControls, slideCount]);

  if (slideCount === 0) return null;

  if (slideCount === 1) {
    return (
      <div className={cn("cj-cursor-carousel cj-cursor-carousel--swiper relative", className)}>
        {slides[0]}
      </div>
    );
  }

  const useLoop = loop && slideCount > 4;

  if (!mounted) {
    return (
      <div
        className={cn(
          "cj-cursor-carousel cj-cursor-carousel--swiper relative min-h-[24rem] md:min-h-[28rem]",
          compact && "cj-cursor-carousel--compact",
          fullBleed ? "w-full" : undefined,
          className
        )}
        aria-label={ariaLabel}
        aria-busy="true"
      >
        <div className="flex items-center justify-center px-4 py-8">
          <CarouselCardSkeleton compact={compact} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "cj-cursor-carousel cj-cursor-carousel--swiper relative",
        compact && "cj-cursor-carousel--compact",
        fullBleed ? "w-full" : undefined,
        className
      )}
    >
      <div className="relative overflow-visible bg-inherit">
        <Swiper
          modules={[Navigation, Pagination, Keyboard, A11y]}
          grabCursor
          centeredSlides
          slidesPerView="auto"
          spaceBetween={-20}
          slideToClickedSlide
          loop={useLoop}
          keyboard={{ enabled: true }}
          a11y={{
            enabled: true,
            containerRoleDescriptionMessage: "carousel",
            itemRoleDescriptionMessage: "slide",
          }}
          breakpoints={{
            0: { spaceBetween: -16 },
            640: { spaceBetween: -24 },
          }}
          navigation={false}
          pagination={false}
          onSwiper={setSwiper}
          onSlideChange={(instance) => setSelectedIndex(instance.realIndex)}
          className={cn(
            "cj-swiper",
            fullBleed ? "cj-swiper--full-bleed" : "px-4 sm:px-6 md:px-8",
            trackClassName
          )}
          aria-label={ariaLabel}
        >
          {slides.map((child, i) => (
            <SwiperSlide key={i} className="carousel-slide">
              <div className="cj-carousel-slide-content h-full w-full">{child}</div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showControls && slideCount > 1 && (
        <div
          className={cn(
            "cj-carousel-controls mt-4 flex items-center justify-center gap-3 sm:gap-4",
            "px-4 sm:px-6 md:px-8"
          )}
        >
          <button
            ref={prevRef}
            type="button"
            aria-label="Previous slide"
            className="cj-carousel-nav-btn"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={2.25} />
          </button>

          <div className="flex min-w-0 flex-1 flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-4">
            <div
              ref={paginationRef}
              className="cj-swiper-pagination flex items-center gap-1.5"
              role="tablist"
              aria-label={`${ariaLabel} slides`}
            />
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
            ref={nextRef}
            type="button"
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
