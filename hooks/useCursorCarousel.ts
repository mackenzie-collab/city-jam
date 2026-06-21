"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

interface UseCursorCarouselOptions {
  enabled?: boolean;
  /** Slide count — triggers transform recalc when children mount */
  slideCount?: number;
}

export interface SlideTransform {
  scale: number;
  opacity: number;
  zIndex: number;
  isCentered: boolean;
}

const CENTER_SCALE_DESKTOP = 1.04;
const CENTER_SCALE_MOBILE = 1.02;
const SIDE_SCALE = 0.92;
const MOBILE_BREAKPOINT = 640;

function getCenterScale(): number {
  if (typeof window === "undefined") return CENTER_SCALE_DESKTOP;
  return window.innerWidth < MOBILE_BREAKPOINT ? CENTER_SCALE_MOBILE : CENTER_SCALE_DESKTOP;
}

const CENTER_OPACITY = 1;
const SIDE_OPACITY = 0.58;

const DEFAULT_TRANSFORM: SlideTransform = {
  scale: SIDE_SCALE,
  opacity: SIDE_OPACITY,
  zIndex: 1,
  isCentered: false,
};

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function computeTransform(
  slideCenter: number,
  trackCenter: number,
  slideWidth: number,
  centerScale: number
): SlideTransform {
  const distance = Math.abs(slideCenter - trackCenter);
  const normalized = slideWidth > 0 ? distance / (slideWidth * 0.72) : 0;
  const t = smoothstep(Math.min(1, normalized));

  return {
    scale: centerScale + (SIDE_SCALE - centerScale) * t,
    opacity: CENTER_OPACITY + (SIDE_OPACITY - CENTER_OPACITY) * t,
    zIndex: t < 0.2 ? 3 : t < 0.55 ? 2 : 1,
    isCentered: t < 0.12,
  };
}

export function useCursorCarousel(
  trackRef: RefObject<HTMLElement | null>,
  options: UseCursorCarouselOptions = {}
) {
  const { enabled = true, slideCount = 0 } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideTransforms, setSlideTransforms] = useState<SlideTransform[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);

  const transformRafId = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const centerScaleRef = useRef(CENTER_SCALE_DESKTOP);
  const programmaticScrollRef = useRef(false);
  const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finePointerRef = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    finePointerRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches;
    centerScaleRef.current = getCenterScale();
  }, []);

  const beginProgrammaticScroll = useCallback((durationMs = 400) => {
    programmaticScrollRef.current = true;
    if (programmaticScrollTimer.current) {
      clearTimeout(programmaticScrollTimer.current);
    }
    programmaticScrollTimer.current = setTimeout(() => {
      programmaticScrollRef.current = false;
      programmaticScrollTimer.current = null;
    }, reducedMotion.current ? 0 : durationMs);
  }, []);

  const getSlides = useCallback(() => {
    const track = trackRef.current;
    if (!track) return [];
    return Array.from(track.querySelectorAll<HTMLElement>("[data-carousel-slide]"));
  }, [trackRef]);

  const updateSlideTransforms = useCallback(() => {
    const track = trackRef.current;
    const slides = getSlides();
    if (!track || slides.length === 0) return;

    const trackCenter = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let minDist = Infinity;

    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(slideCenter - trackCenter);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });

    if (reducedMotion.current) {
      setSlideTransforms(
        slides.map((_, i) => ({
          scale: 1,
          opacity: 1,
          zIndex: i === nearest ? 10 : 1,
          isCentered: i === nearest,
        }))
      );
      setActiveIndex(nearest);
      return;
    }

    const transforms: SlideTransform[] = slides.map((slide) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      return computeTransform(slideCenter, trackCenter, slide.offsetWidth, centerScaleRef.current);
    });

    setActiveIndex(nearest);
    setSlideTransforms(transforms);
  }, [getSlides, trackRef]);

  const scheduleTransformUpdate = useCallback(() => {
    if (transformRafId.current != null) return;
    transformRafId.current = requestAnimationFrame(() => {
      transformRafId.current = null;
      updateSlideTransforms();
    });
  }, [updateSlideTransforms]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const slides = getSlides();
      if (!track || slides.length === 0) return;
      const i = Math.max(0, Math.min(slides.length - 1, index));
      const slide = slides[i];
      const scrollTarget = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;

      beginProgrammaticScroll();
      setIsScrolling(true);
      track.scrollTo({
        left: scrollTarget,
        behavior: reducedMotion.current ? "auto" : "smooth",
      });
      setActiveIndex(i);
      scheduleTransformUpdate();
      window.setTimeout(() => setIsScrolling(false), reducedMotion.current ? 0 : 400);
    },
    [beginProgrammaticScroll, getSlides, scheduleTransformUpdate, trackRef]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const track = trackRef.current;
      if (!track || !enabled || !finePointerRef.current) return;
      const horizontal = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontal) return;
      e.preventDefault();
      track.scrollLeft += e.deltaX || e.deltaY;
      scheduleTransformUpdate();
    },
    [enabled, scheduleTransformUpdate, trackRef]
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollToIndex(activeIndex - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollToIndex(activeIndex + 1);
      }
    },
    [activeIndex, scrollToIndex]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScrollEnd = () => {
      if (programmaticScrollRef.current) return;
      updateSlideTransforms();
    };

    const onScroll = () => {
      scheduleTransformUpdate();
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("scrollend", handleScrollEnd);
    scheduleTransformUpdate();

    const ro = new ResizeObserver(() => scheduleTransformUpdate());
    ro.observe(track);

    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", handleScrollEnd);
      if (programmaticScrollTimer.current) {
        clearTimeout(programmaticScrollTimer.current);
      }
      ro.disconnect();
      if (transformRafId.current != null) {
        cancelAnimationFrame(transformRafId.current);
      }
    };
  }, [scheduleTransformUpdate, trackRef, updateSlideTransforms]);

  useEffect(() => {
    const onResize = () => {
      centerScaleRef.current = getCenterScale();
      scheduleTransformUpdate();
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [scheduleTransformUpdate]);

  useEffect(() => {
    if (slideCount > 0) {
      scheduleTransformUpdate();
    }
  }, [slideCount, scheduleTransformUpdate]);

  const getSlideTransform = useCallback(
    (index: number): SlideTransform => slideTransforms[index] ?? DEFAULT_TRANSFORM,
    [slideTransforms]
  );

  return {
    activeIndex,
    isDragging: false,
    isScrolling,
    slideTransforms,
    getSlideTransform,
    scrollToIndex,
    handlers: {
      onWheel,
      onKeyDown,
    },
  };
}
