import { cn } from "@/lib/utils";

interface BarcodeDividerProps {
  className?: string;
  /** Vertical constructivist strip (ref 1) vs horizontal rule */
  orientation?: "vertical" | "horizontal";
}

/** Constructivist barcode accent — vertical editorial strip or horizontal divider. */
export default function BarcodeDivider({
  className,
  orientation = "horizontal",
}: BarcodeDividerProps) {
  const bars = [4, 2, 3, 1, 5, 2, 1, 4, 2, 3, 1, 6, 2, 1, 3, 2, 5, 1, 3, 2, 4, 1, 2];

  if (orientation === "vertical") {
    return (
      <div
        className={cn(
          "flex h-full min-h-[120px] flex-col items-center justify-stretch gap-px py-1",
          className
        )}
        aria-hidden
        role="presentation"
      >
        {bars.map((w, i) => (
          <span
            key={i}
            className="shrink-0 bg-[var(--cj-barcode-fill)]"
            style={{
              height: `${w * 3 + 2}px`,
              width: i % 4 === 0 ? "5px" : i % 2 === 0 ? "3px" : "2px",
              opacity: i % 5 === 0 ? 1 : 0.72,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-end gap-px", className)}
      aria-hidden
      role="presentation"
    >
      {bars.map((w, i) => (
        <span
          key={i}
          className="bg-[var(--cj-barcode-fill)] opacity-80"
          style={{
            width: `${w}px`,
            height: i % 3 === 0 ? "22px" : i % 2 === 0 ? "16px" : "12px",
          }}
        />
      ))}
    </div>
  );
}
