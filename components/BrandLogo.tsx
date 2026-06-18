import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  /** Square logo size in px (logo is 1:1). */
  size?: number;
  priority?: boolean;
}

export default function BrandLogo({
  href,
  className,
  size = 36,
  priority = false,
}: BrandLogoProps) {
  const content = (
    <span className={cn("inline-flex shrink-0", className)}>
      <Image
        src={BRAND.logo}
        alt={BRAND.logoAlt}
        width={size}
        height={size}
        className="aspect-square object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
        priority={priority}
      />
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
