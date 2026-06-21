"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import VinylPhotoFrame from "@/components/vinyl/VinylPhotoFrame";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import { MUSICIAN_PHOTOS } from "@/lib/brand-assets";

export default function MusicianGallery() {
  return (
    <section
      id="musician-gallery"
      className="cj-section relative overflow-hidden bg-cj-surface py-12 sm:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <span className="cj-badge mb-3">Real musicians</span>
        <h2 className="cj-headline text-3xl sm:text-4xl">
          Every kind of musician.{" "}
          <span className="text-brand-gold">One frequency.</span>
        </h2>
        <p className="mt-3 max-w-xl font-body text-sm text-cj-text-muted">
          Drag the gallery — classical to beatbox, bedroom producers to brass sections. This is who City Jam is for.
        </p>
        <Link href="/discover" className="cj-link-groove mt-4 inline-flex items-center gap-2 text-sm">
          Discover artists <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8">
        <CursorCarousel
          ariaLabel="Musician gallery"
          gap="md"
          fullBleed
          showControls
          showDragHint
          trackClassName="py-6"
        >
          {MUSICIAN_PHOTOS.map(({ src, alt }) => (
            <VinylPhotoFrame key={src} src={src} alt={alt} size={180} maxVw={38} />
          ))}
        </CursorCarousel>
      </div>
    </section>
  );
}
