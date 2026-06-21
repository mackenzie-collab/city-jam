import Link from "next/link";
import { cn } from "@/lib/utils";
import BarcodeDivider from "@/components/BarcodeDivider";

interface SideABStripProps {
  sideA: { label: string; value: string; href?: string }[];
  sideB: { label: string; value: string; href?: string }[];
  className?: string;
  compact?: boolean;
}

/** Side A / Side B tracklist metadata — DIJON-style risograph album layout. */
export default function SideABStrip({
  sideA,
  sideB,
  className,
  compact = false,
}: SideABStripProps) {
  return (
    <div className={cn("border-t border-cj-border pt-6", className)}>
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
          "font-headline font-bold uppercase text-label-amber",
          compact ? "text-lg tracking-[0.18em]" : "text-2xl tracking-[0.22em] sm:text-3xl"
        )}
      >
        Side {side}
      </p>
      <ul className={cn("mt-4 space-y-0", compact ? "mt-3" : "mt-5")}>
        {items.map((item, i) => (
          <li
            key={item.label}
            className={cn(
              "grid border-b border-cj-border/60 py-2.5",
              compact ? "grid-cols-[2.5rem_1fr] gap-2 text-sm" : "grid-cols-[2.75rem_1fr] gap-3 sm:grid-cols-[3rem_1fr]"
            )}
          >
            <span className="font-headline text-base font-bold tabular-nums text-cj-text-muted sm:text-lg">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              {item.href ? (
                <Link
                  href={item.href}
                  className="block font-headline font-bold uppercase tracking-wide text-cj-text no-underline transition-colors hover:text-label-amber"
                >
                  <span className={cn(compact ? "text-xs tracking-[0.12em]" : "text-sm tracking-[0.14em] sm:text-base")}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span
                  className={cn(
                    "block font-headline font-bold uppercase tracking-wide text-cj-text",
                    compact ? "text-xs tracking-[0.12em]" : "text-sm tracking-[0.14em] sm:text-base"
                  )}
                >
                  {item.label}
                </span>
              )}
              <span className="mt-0.5 block text-sm text-cj-text-muted">{item.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
