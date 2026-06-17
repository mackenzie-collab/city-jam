import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  showWordmark?: boolean;
  iconSize?: number;
}

export default function BrandLogo({
  href,
  className,
  showWordmark = true,
  iconSize = 36,
}: BrandLogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={BRAND.logo}
        alt={BRAND.logoAlt}
        width={iconSize}
        height={iconSize}
        className="object-contain"
        priority
      />
      {showWordmark && (
        <span className="font-display text-2xl font-bold tracking-wide text-cj-gold md:text-3xl">
          CITY<span className="mx-1 opacity-60">/</span>JAM
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="no-underline">
        {content}
      </Link>
    );
  }

  return content;
}
