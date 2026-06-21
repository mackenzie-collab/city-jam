"use client";

import CoverArtFrame from "@/components/analog/CoverArtFrame";
import { MUSICIAN_PHOTOS } from "@/lib/brand-assets";

export default function MusicianGallery() {
  return (
    <section className="overflow-hidden bg-cj-surface py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <p className="mb-2 text-center text-lg font-semibold text-cj-text">On the scene</p>
        <p className="cj-label-stamp mb-6 text-center sm:mb-8">
          Every kind of musician. One frequency.
        </p>
      </div>
      <div className="mx-4 overflow-hidden rounded-lg border border-cj-border sm:mx-6 md:mx-8">
        <div className="snap-x-mandatory flex items-center gap-4 overflow-x-auto px-4 py-6 scrollbar-thin sm:gap-6 sm:px-6 md:px-8">
          {MUSICIAN_PHOTOS.map(({ src, alt }) => (
            <div key={src} className="carousel-slide shrink-0 snap-start">
              <CoverArtFrame
                src={src}
                alt={alt}
                aspect="3/4"
                className="h-44 w-32 sm:h-52 sm:w-36 md:h-60 md:w-44"
                sizes="(max-width: 640px) 128px, 176px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
