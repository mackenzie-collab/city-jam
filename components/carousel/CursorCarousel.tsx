"use client";

import {
  Children,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCoverflow,
  Navigation,
  Pagination,
  Keyboard,
  A11y,
} from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { cn } from "@/lib/utils";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  const uid = useId().replace(/:/g, "");
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
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
      <div
        className={cn(
          "cj-cursor-carousel cj-cursor-carousel--swiper relative",
          className
        )}
      >
        {slides[0]}
      </div>
    );
  }

  const useCoverflow = !reducedMotion;

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
          modules={[EffectCoverflow, Navigation, Pagination, Keyboard, A11y]}
          effect={useCoverflow ? "coverflow" : undefined}
          grabCursor
          centeredSlides
          slidesPerView="auto"
          spaceBetween={-24}
          slideToClickedSlide
          watchSlidesProgress
          keyboard={{ enabled: true }}
          a11y={{
            enabled: true,
            containerRoleDescriptionMessage: "carousel",
            itemRoleDescriptionMessage: "slide",
          }}
          coverflowEffect={
            useCoverflow
              ? {
                  rotate: 0,
                  stretch: 0,
                  depth: 120,
                  modifier: 1.5,
                  slideShadows: false,
                }
              : undefined
          }
          breakpoints={{
            0: {
              spaceBetween: -16,
              ...(useCoverflow
                ? {
                    coverflowEffect: {
                      rotate: 0,
                      stretch: 0,
                      depth: 80,
                      modifier: 1.2,
                      slideShadows: false,
                    },
                  }
                : {}),
            },
            640: {
              spaceBetween: -24,
              ...(useCoverflow
                ? {
                    coverflowEffect: {
                      rotate: 0,
                      stretch: 0,
                      depth: 120,
                      modifier: 1.5,
                      slideShadows: false,
                    },
                  }
                : {}),
            },
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
              <div className="cj-carousel-slide-content h-full w-full">
                {child}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {showControls && slideCount > 1 && (
        <div
          className={cn(
            "cj-carousel-controls mt-4 flex items-center justify-center gap-3 sm:gap-4",
            fullBleed ? "px-4 sm:px-6 md:px-8" : "px-4 sm:px-6 md:px-8"
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

export type { CursorCarouselProps };
