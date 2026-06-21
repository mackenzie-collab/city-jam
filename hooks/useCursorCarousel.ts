"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

interface UseCursorCarouselOptions {
  /** Pixels per frame decay for momentum (0–1) */
  friction?: number;
  enabled?: boolean;
}

export function useCursorCarousel(
  trackRef: RefObject<HTMLElement | null>,
  options: UseCursorCarouselOptions = {}
) {
  const { friction = 0.92, enabled = true } = options;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartX = useRef(0);
  const scrollStart = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const rafId = useRef<number | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const getSlides = useCallback(() => {
    const track = trackRef.current;
    if (!track) return [];
    return Array.from(track.querySelectorAll<HTMLElement>("[data-carousel-slide]"));
  }, [trackRef]);

  const snapToNearest = useCallback(() => {
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
    const target = slides[nearest];
    const scrollTarget = target.offsetLeft - (track.clientWidth - target.offsetWidth) / 2;
    track.scrollTo({ left: scrollTarget, behavior: reducedMotion.current ? "auto" : "smooth" });
  }, [getSlides, trackRef]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const slides = getSlides();
      if (!track || slides.length === 0) return;
      const i = Math.max(0, Math.min(slides.length - 1, index));
      const slide = slides[i];
      const scrollTarget = slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2;
      track.scrollTo({ left: scrollTarget, behavior: reducedMotion.current ? "auto" : "smooth" });
      setActiveIndex(i);
    },
    [getSlides, trackRef]
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
      rafId.current = requestAnimationFrame(step);
    };
    rafId.current = requestAnimationFrame(step);
  }, [friction, snapToNearest, trackRef]);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled) return;
      const target = e.target as HTMLElement;
      if (target.closest("button, a, [role='button'], input, textarea, select")) return;
      const track = trackRef.current;
      if (!track) return;
      stopMomentum();
      setIsDragging(true);
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
      if (!isDragging) return;
      const track = trackRef.current;
      if (!track) return;
      const dx = e.clientX - dragStartX.current;
      track.scrollLeft = scrollStart.current - dx;

      const now = performance.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        velocity.current = ((e.clientX - lastX.current) / dt) * 16;
      }
      lastX.current = e.clientX;
      lastTime.current = now;
    },
    [isDragging, trackRef]
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const track = trackRef.current;
      setIsDragging(false);
      track?.releasePointerCapture(e.pointerId);
      if (Math.abs(velocity.current) > 1 && !reducedMotion.current) {
        runMomentum();
      } else {
        snapToNearest();
      }
    },
    [isDragging, runMomentum, snapToNearest, trackRef]
  );

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const track = trackRef.current;
      if (!track || !enabled) return;
      const horizontal = e.shiftKey || Math.abs(e.deltaX) > Math.abs(e.deltaY);
      if (!horizontal) return;
      e.preventDefault();
      track.scrollLeft += e.deltaX || e.deltaY;
      snapToNearest();
    },
    [enabled, snapToNearest, trackRef]
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
    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(snapToNearest, 80);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
      stopMomentum();
    };
  }, [snapToNearest, stopMomentum, trackRef]);

  return {
    activeIndex,
    isDragging,
    scrollToIndex,
    snapToNearest,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerLeave: onPointerUp,
      onWheel,
      onKeyDown,
    },
  };
}
