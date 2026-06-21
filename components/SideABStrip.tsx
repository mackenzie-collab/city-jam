import Link from "next/link";
import { cn } from "@/lib/utils";
import BarcodeDivider from "@/components/BarcodeDivider";

interface SideABStripProps {
  sideA: { label: string; value: string; href?: string }[];
  sideB: { label: string; value: string; href?: string }[];
  className?: string;
  compact?: boolean;
}

/** Side A / Side B tracklist — zine album layout with Bebas headers + Courier metadata. */
export default function SideABStrip({
  sideA,
  sideB,
  className,
  compact = false,
}: SideABStripProps) {
  return (
    <div className={cn("border-t border-[var(--cj-zine-border)] pt-6", className)}>
      <div className="mb-6 flex items-stretch gap-4">
        <BarcodeDivider orientation="vertical" className="w-5 shrink-0 opacity-90" />
        <BarcodeDivider className="flex-1 opacity-70" />
      </div>
      <div className={cn("grid gap-10", compact ? "sm:grid-cols-2" : "md:grid-cols-2 md:gap-16")}>
        <Side side="A" items={sideA} compact={compact} />
        <Side side="B" items={sideB} compact={compact} />
      </div>
    </div>
  );
}

function Side({
  side,
  items,
  compact,
}: {
  side: "A" | "B";
  items: { label: string; value: string; href?: string }[];
  compact?: boolean;
}) {
  return (
    <div>
      <p
        className={cn(
          "font-display uppercase text-brand-gold",
          compact ? "text-xl tracking-[0.12em]" : "text-2xl tracking-[0.14em] sm:text-3xl"
        )}
      >
        Side {side}
      </p>
      <ul className={cn("mt-4 space-y-0", compact ? "mt-3" : "mt-5")}>
        {items.map((item, i) => (
          <li
            key={item.label}
            className={cn(
              "grid border-b border-[var(--cj-zine-border)] py-2.5",
              compact ? "grid-cols-[2.5rem_1fr] gap-2 text-sm" : "grid-cols-[2.75rem_1fr] gap-3 sm:grid-cols-[3rem_1fr]"
            )}
          >
            <span className="font-mono text-sm tabular-nums text-cj-text-muted sm:text-base">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              {item.href ? (
                <Link
                  href={item.href}
                  className="block font-display text-sm uppercase tracking-[0.08em] text-cj-text no-underline transition-colors hover:text-brand-gold sm:text-base"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="block font-display text-sm uppercase tracking-[0.08em] text-cj-text sm:text-base">
                  {item.label}
                </span>
              )}
              <span className="mt-0.5 block font-mono text-xs text-cj-text-muted sm:text-sm">
                {item.value}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
