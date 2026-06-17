import Image from "next/image";
import { MUSICIAN_PHOTOS } from "@/lib/brand-assets";

export default function MusicianGallery() {
  return (
    <section className="overflow-hidden bg-cj-purple-dark py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <p className="mb-6 text-center text-xs uppercase tracking-widest text-cj-gold-muted sm:mb-8">
          Every kind of musician. One scene.
        </p>
      </div>
      <div className="snap-x-mandatory flex gap-3 overflow-x-auto px-4 pb-3 scrollbar-thin sm:gap-4 sm:px-6 md:justify-center md:px-8">
        {MUSICIAN_PHOTOS.map(({ src, alt }) => (
          <div
            key={src}
            className="relative h-40 w-28 shrink-0 snap-start overflow-hidden rounded-lg border border-cj-gold-border sm:h-48 sm:w-36 md:h-56 md:w-44"
          >
            <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 640px) 112px, 176px" />
          </div>
        ))}
      </div>
    </section>
  );
}
