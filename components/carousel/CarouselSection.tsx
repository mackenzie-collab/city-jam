import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AffiliateSectionHeader from "@/components/affiliate/AffiliateSectionHeader";
import FadeIn from "@/components/affiliate/FadeIn";
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
  theme?: "default" | "affiliate";
}

/** Shared homepage carousel section — header aligned to grid, track full-bleed with rhythm. */
function titleToString(title: ReactNode): string {
  if (typeof title === "string") return title;
  if (Array.isArray(title)) return title.map(titleToString).join("");
  if (title && typeof title === "object" && "props" in title) {
    return titleToString((title as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

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
  theme = "default",
}: CarouselSectionProps) {
  if (theme === "affiliate") {
    const sectionTone =
      variant === "deep" ? "affiliate-section--deep" : "affiliate-section--brand";

    return (
      <>
        <hr className="affiliate-divider" />
        <FadeIn
          as="section"
          id={id}
          className={cn("affiliate-section affiliate-carousel-section", sectionTone, className)}
        >
          <GrainOverlay intensity={variant === "deep" ? 0.05 : 0.04} warm={variant === "deep"} />
          <div className="affiliate-container affiliate-section__inner">
            <AffiliateSectionHeader label={badge} title={titleToString(title)} lead={description} />
            {link ? (
              <Link href={link.href} className="affiliate-btn-ghost affiliate-carousel-link">
                {link.label}
                <ArrowRight size={16} aria-hidden />
              </Link>
            ) : null}
            {filters ? <div className="affiliate-carousel-filters">{filters}</div> : null}
          </div>
          <div className="affiliate-carousel-stage">{children}</div>
        </FadeIn>
      </>
    );
  }

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
