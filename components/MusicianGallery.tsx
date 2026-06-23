"use client";

import VinylPhotoFrame from "@/components/vinyl/VinylPhotoFrame";
import CursorCarousel from "@/components/carousel/CursorCarousel";
import CarouselSection from "@/components/carousel/CarouselSection";
import { MUSICIAN_PHOTOS } from "@/lib/brand-assets";

export default function MusicianGallery() {
  return (
    <CarouselSection
      id="musician-gallery"
      badge="Real musicians"
      title={
        <>
          Every kind of musician. <span className="text-brand-gold">One frequency.</span>
        </>
      }
      description="Classical to beatbox, bedroom producers to brass sections — this is who City Jam is for."
      link={{ href: "/discover", label: "Discover artists" }}
      variant="surface"
    >
      <CursorCarousel ariaLabel="Musician gallery" showControls loop variant="gallery">
        {MUSICIAN_PHOTOS.map(({ src, alt }) => (
          <VinylPhotoFrame key={src} src={src} alt={alt} size={260} maxVw={44} className="mx-auto w-full max-w-full" />
        ))}
      </CursorCarousel>
    </CarouselSection>
  );
}
