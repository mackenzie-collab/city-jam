"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

interface UseCursorCarouselOptions {
  /** Pixels per frame decay for momentum (0–1) */
  friction?: number;
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

const DRAG_THRESHOLD = 6;

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
  const { friction = 0.92, enabled = true, slideCount = 0 } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [slideTransforms, setSlideTransforms] = useState<SlideTransform[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);

  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number | null>(null);
  const transformRafId = useRef<number | null>(null);
  const reducedMotion = useRef(false);
  const centerScaleRef = useRef(CENTER_SCALE_DESKTOP);
  const isDraggingRef = useRef(false);
  const isTrackingRef = useRef(false);
  const hasExceededThresholdRef = useRef(false);
  const startedOnInteractiveRef = useRef(false);
  const useNativeScrollRef = useRef(false);
  const programmaticScrollRef = useRef(false);
  const programmaticScrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    useNativeScrollRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches;
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

  const snapToNearest = useCallback(() => {
    if (isDraggingRef.current || programmaticScrollRef.current) return;
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

    setActiveIndex(nearest);
    updateSlideTransforms();

    if (useNativeScrollRef.current) return;

    const target = slides[nearest];
    const scrollTarget = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
    const delta = Math.abs(track.scrollLeft - scrollTarget);

    if (delta < 2) return;

    beginProgrammaticScroll();
    setIsScrolling(true);
    track.scrollTo({
      left: scrollTarget,
      behavior: reducedMotion.current || delta < 8 ? "auto" : "smooth",
    });

    window.setTimeout(() => setIsScrolling(false), reducedMotion.current ? 0 : 400);
  }, [beginProgrammaticScroll, getSlides, trackRef, updateSlideTransforms]);

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

  const stopMomentum = useCallback(() => {
    if (rafId.current != null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
  }, []);

  const runMomentum = useCallback(() => {
    const track = trackRef.current;
    if (!track || reducedMotion.current) {
      snapToNearest();
      return;
    }

    const step = () => {
      if (Math.abs(velocity.current) < 0.5) {
        rafId.current = null;
        snapToNearest();
        return;
      }
      track.scrollLeft -= velocity.current;
      velocity.current *= friction;
      scheduleTransformUpdate();
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
  }, [friction, scheduleTransformUpdate, snapToNearest, trackRef]);

  const suppressClickAfterDrag = useCallback((track: HTMLElement) => {
    const preventClick = (ev: MouseEvent) => {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    };
    track.addEventListener("click", preventClick, true);
    window.setTimeout(() => track.removeEventListener("click", preventClick, true), 300);
  }, []);

  const endDrag = useCallback(
    (e: React.PointerEvent) => {
      if (!isTrackingRef.current) return;
      const track = trackRef.current;
      const didDrag = hasExceededThresholdRef.current;

      isTrackingRef.current = false;
      isDraggingRef.current = false;
      setIsDragging(false);
      track?.releasePointerCapture(e.pointerId);

      if (didDrag && startedOnInteractiveRef.current && track) {
        suppressClickAfterDrag(track);
      }

      if (didDrag && Math.abs(velocity.current) > 1 && !reducedMotion.current) {
        runMomentum();
      } else if (didDrag) {
        snapToNearest();
      }
    },
    [runMomentum, snapToNearest, suppressClickAfterDrag, trackRef]
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || useNativeScrollRef.current) return;
      const target = e.target as HTMLElement;
      const track = trackRef.current;
      if (!track) return;

      startedOnInteractiveRef.current = !!target.closest(
        "button, a, [role='button'], input, textarea, select"
      );
      stopMomentum();
      isTrackingRef.current = true;
      hasExceededThresholdRef.current = false;
      dragStartX.current = e.clientX;
      scrollStart.current = track.scrollLeft;
      lastX.current = e.clientX;
      lastTime.current = performance.now();
      velocity.current = 0;
      track.setPointerCapture(e.pointerId);
    },
    [enabled, stopMomentum, trackRef]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isTrackingRef.current) return;
      const track = trackRef.current;
      if (!track) return;

      const dx = e.clientX - dragStartX.current;
      if (!hasExceededThresholdRef.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD) return;
        hasExceededThresholdRef.current = true;
        isDraggingRef.current = true;
        setIsDragging(true);
      }

      e.preventDefault();
      track.scrollLeft = scrollStart.current - dx;
      scheduleTransformUpdate();

      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        velocity.current = ((e.clientX - lastX.current) / dt) * 16;
      }
      lastX.current = e.clientX;
      lastTime.current = now;
    },
    [scheduleTransformUpdate, trackRef]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      endDrag(e);
    },
    [endDrag]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const track = trackRef.current;
      if (!track || !enabled) return;
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

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScrollEnd = () => {
      if (isDraggingRef.current || programmaticScrollRef.current) return;
      if (useNativeScrollRef.current) {
        updateSlideTransforms();
        return;
      }
      snapToNearest();
    };

    const onScroll = () => {
      scheduleTransformUpdate();
      if (isDraggingRef.current || programmaticScrollRef.current) return;
      if (useNativeScrollRef.current) return;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 180);
    };

    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("scrollend", handleScrollEnd);
    scheduleTransformUpdate();

    const ro = new ResizeObserver(() => scheduleTransformUpdate());
    ro.observe(track);

    return () => {
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("scrollend", handleScrollEnd);
      clearTimeout(scrollTimeout);
      if (programmaticScrollTimer.current) {
        clearTimeout(programmaticScrollTimer.current);
      }
      ro.disconnect();
      stopMomentum();
      if (transformRafId.current != null) {
        cancelAnimationFrame(transformRafId.current);
      }
    };
  }, [scheduleTransformUpdate, snapToNearest, stopMomentum, trackRef, updateSlideTransforms]);

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
    isDragging,
    isScrolling,
    slideTransforms,
    getSlideTransform,
    scrollToIndex,
    snapToNearest,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onPointerLeave: onPointerUp,
      onWheel,
      onKeyDown,
    },
  };
}
