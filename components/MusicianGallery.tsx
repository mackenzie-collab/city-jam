"use client";

import CoverArtFrame from "@/components/analog/CoverArtFrame";
import VinylDisc from "@/components/analog/VinylDisc";
import { MUSICIAN_PHOTOS } from "@/lib/brand-assets";

const COVER_PLACEHOLDERS = [
  { label: "Midnight Sessions", hue: "from-purple-900 to-cj-purple-card" },
  { label: "Basement Tapes", hue: "from-cj-dark to-cj-purple" },
  { label: "City Frequencies", hue: "from-cj-purple-card to-cj-purple-dark" },
  { label: "Analog Dreams", hue: "from-cj-purple to-cj-dark" },
  { label: "Groove Archive", hue: "from-cj-purple-dark to-cj-purple-card" },
];

export default function MusicianGallery() {
  const slides = MUSICIAN_PHOTOS.map((photo, i) => ({
    ...photo,
    cover: COVER_PLACEHOLDERS[i % COVER_PLACEHOLDERS.length],
  }));

  return (
    <section className="overflow-hidden bg-cj-purple-dark py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <p className="mb-2 text-center font-display text-lg uppercase text-cj-gold">On the scene</p>
        <p className="mb-6 text-center text-xs uppercase tracking-widest text-cj-gold-muted sm:mb-8">
          Every kind of musician. One frequency.
        </p>
      </div>
      <div className="snap-x-mandatory flex items-center gap-4 overflow-x-auto px-4 pb-4 scrollbar-thin sm:gap-6 sm:px-6 md:px-8">
        {slides.map(({ src, alt, cover }) => (
          <div key={src} className="carousel-slide shrink-0 snap-start">
            <div className="relative">
              <CoverArtFrame
                src={src}
                alt={alt}
                aspect="3/4"
                className="h-44 w-32 sm:h-52 sm:w-36 md:h-60 md:w-44"
                sizes="(max-width: 640px) 128px, 176px"
                fallback={
                  <div
                    className={`flex h-full flex-col bg-gradient-to-br ${cover.hue} p-3`}
                  >
                    <VinylDisc size={36} className="opacity-80" />
                    <span className="mt-auto text-[9px] uppercase tracking-widest text-cj-gold/70">
                      {cover.label}
                    </span>
                  </div>
                }
              />
              <div className="pointer-events-none absolute -bottom-2 left-1/2 h-2 w-[85%] -translate-x-1/2 rounded-full bg-black/40 blur-md" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
