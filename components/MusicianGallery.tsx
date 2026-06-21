"use client";

import VinylPhotoFrame from "@/components/vinyl/VinylPhotoFrame";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import { MUSICIAN_PHOTOS } from "@/lib/brand-assets";

export default function MusicianGallery() {
  return (
    <section className="overflow-hidden bg-cj-surface py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <p className="mb-2 text-center text-lg font-semibold text-cj-text">Real musicians</p>
        <p className="cj-label-stamp mb-6 text-center sm:mb-8">
          Every kind of musician. One frequency.
        </p>
      </div>
      <div className="mx-4 overflow-hidden rounded-lg border border-cj-border sm:mx-6 md:mx-8">
        <CursorCarousel ariaLabel="Musician gallery" gap="md" trackClassName="py-6">
          {MUSICIAN_PHOTOS.map(({ src, alt }) => (
            <VinylPhotoFrame
              key={src}
              src={src}
              alt={alt}
              size={144}
            />
          ))}
        </CursorCarousel>
      </div>
    </section>
  );
}
