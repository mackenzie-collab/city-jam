import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

interface VinylLogoProps {
  href?: string;
  className?: string;
  /** Square logo size in px */
  size?: number;
  priority?: boolean;
  /** Enable 3rpm spin (20s), faster on hover */
  spinning?: boolean;
}

export default function VinylLogo({
  href,
  className,
  size = 36,
  priority = false,
  spinning = true,
}: VinylLogoProps) {
  const platter = (
    <span
      className={cn(
        "group inline-flex shrink-0 items-center justify-center",
        className
      )}
    >
      <span
        className={cn(
          "cj-vinyl-platter relative flex items-center justify-center",
          spinning && "cj-vinyl-platter-spin"
        )}
        style={{ width: size, height: size }}
        role="img"
        aria-label="City Jam vinyl logo"
      >
        <Image
          src={BRAND.logo}
          alt=""
          width={Math.round(size * 0.38)}
          height={Math.round(size * 0.38)}
          className="relative z-10 aspect-square rounded-full object-contain"
          priority={priority}
          aria-hidden
        />
        <span
          className="pointer-events-none absolute inset-[18%] rounded-full border border-cj-gold/30"
          aria-hidden
        />
      </span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline" aria-label="City Jam home">
        {platter}
      </Link>
    );
  }

  return platter;
}
