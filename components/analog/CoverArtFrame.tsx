import Image from "next/image";
import { cn } from "@/lib/utils";

type CoverAspect = "4/3" | "3/4" | "square";

const aspectClass: Record<CoverAspect, string> = {
  "4/3": "aspect-[4/3]",
  "3/4": "aspect-[3/4]",
  square: "aspect-square",
};

interface CoverArtFrameProps {
  src?: string | null;
  alt?: string;
  aspect?: CoverAspect;
  fallback?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  sizes?: string;
}

export default function CoverArtFrame({
  src,
  alt = "",
  aspect = "4/3",
  fallback,
  className,
  children,
  sizes = "(max-width:768px) 100vw, 400px",
}: CoverArtFrameProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-cj-gold/40 bg-cj-dark cj-grain-photo",
        "shadow-[inset_0_0_0_1px_rgba(201,168,0,0.2),0_4px_20px_rgba(0,0,0,0.45)]",
        aspectClass[aspect],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} />
      ) : (
        fallback ?? (
          <div className="flex h-full items-center justify-center bg-cj-purple-card">
            <span className="font-display text-3xl uppercase text-cj-gold/25">♪</span>
          </div>
        )
      )}
      {children}
    </div>
  );
}
