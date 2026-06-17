import Image from "next/image";
import { MUSICIAN_PHOTOS } from "@/lib/brand-assets";

export default function MusicianGallery() {
  return (
    <section className="overflow-hidden bg-cj-purple-dark py-16">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <p className="mb-8 text-center text-xs uppercase tracking-widest text-cj-gold-muted">
          Every kind of musician. One scene.
        </p>
      </div>
      <div className="flex gap-4 overflow-x-auto px-6 pb-2 scrollbar-thin md:justify-center md:px-8">
        {MUSICIAN_PHOTOS.map(({ src, alt }) => (
          <div
            key={src}
            className="relative h-48 w-36 shrink-0 overflow-hidden rounded-lg border border-cj-gold-border md:h-56 md:w-44"
          >
            <Image src={src} alt={alt} fill className="object-cover" sizes="176px" />
          </div>
        ))}
      </div>
    </section>
  );
}
