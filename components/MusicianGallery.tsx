"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import VinylPhotoFrame from "@/components/vinyl/VinylPhotoFrame";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import GrainOverlay from "@/components/GrainOverlay";
import { MUSICIAN_PHOTOS } from "@/lib/brand-assets";

export default function MusicianGallery() {
  return (
    <section
      id="musician-gallery"
      className="relative overflow-x-visible border-y border-brand-gold/10 bg-cj-surface py-8 sm:py-10"
    >
      <GrainOverlay className="opacity-[0.035]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <span className="cj-badge mb-2">Real musicians</span>
        <h2 className="cj-headline text-3xl sm:text-4xl">
          Every kind of musician.{" "}
          <span className="text-brand-gold">One frequency.</span>
        </h2>
        <p className="mt-2 max-w-xl font-body text-sm text-cj-text-muted">
          Classical to beatbox, bedroom producers to brass sections — this is who City Jam is for.
        </p>
        <Link href="/discover" className="cj-link-groove mt-3 inline-flex items-center gap-2 text-sm">
          Discover artists <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="cj-carousel-band relative mt-5">
        <CursorCarousel ariaLabel="Musician gallery" fullBleed showControls loop trackClassName="py-3">
          {MUSICIAN_PHOTOS.map(({ src, alt }) => (
            <VinylPhotoFrame key={src} src={src} alt={alt} size={260} maxVw={58} />
          ))}
        </CursorCarousel>
      </div>
    </section>
  );
}
