import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GrainOverlay from "@/components/GrainOverlay";
import { cn } from "@/lib/utils";

interface CarouselSectionProps {
  id?: string;
  badge: string;
  title: ReactNode;
  description?: string;
  link?: { href: string; label: string };
  filters?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  variant?: "deep" | "surface";
}

/** Shared homepage carousel section — header aligned to grid, track full-bleed with rhythm. */
export default function CarouselSection({
  id,
  badge,
  title,
  description,
  link,
  filters,
  children,
  className,
  variant = "deep",
}: CarouselSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "cj-carousel-section relative overflow-x-clip border-t border-brand-gold/12",
        variant === "deep" ? "bg-brand-purple-deep" : "bg-cj-surface",
        className
      )}
    >
      <GrainOverlay className="opacity-[0.03]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 md:px-8">
        <header className="pt-10 pb-6 sm:pt-12 sm:pb-8">
          <span className="cj-badge mb-3 block">{badge}</span>
          <h2 className="cj-headline text-3xl sm:text-4xl md:text-[2.75rem] md:leading-none">
            {title}
          </h2>
          {description && (
            <p className="mt-3 max-w-xl font-body text-sm leading-relaxed text-cj-text-muted sm:text-base">
              {description}
            </p>
          )}
          {link && (
            <Link
              href={link.href}
              className="cj-link-groove mt-4 inline-flex items-center gap-2 text-sm"
            >
              {link.label} <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </header>

        {filters && (
          <div className="border-t border-brand-gold/10 pb-6 pt-5">
            {filters}
          </div>
        )}
      </div>

      <div className="cj-carousel-stage">{children}</div>
    </section>
  );
}
