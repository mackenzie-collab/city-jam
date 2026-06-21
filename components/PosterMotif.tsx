import { cn } from "@/lib/utils";

interface PosterMotifProps {
  className?: string;
  /** 0–1 opacity multiplier */
  opacity?: number;
  variant?: "hero" | "section" | "minimal";
  /** When true, fills container as dominant graphic */
  dominant?: boolean;
}

const GROOVES_HERO = [
  380, 350, 320, 290, 260, 230, 200, 170, 140, 110, 80, 52,
];
const GROOVES_SECTION = [240, 210, 180, 150, 120, 90, 62];

/** Bold concentric groove circles — constructivist editorial poster vinyl. */
export default function PosterMotif({
  className,
  opacity = 1,
  variant = "hero",
  dominant = false,
}: PosterMotifProps) {
  const size = variant === "hero" ? 840 : variant === "minimal" ? 520 : 560;
  const cx = size / 2;
  const cy = size / 2;
  const grooves = variant === "hero" ? GROOVES_HERO : GROOVES_SECTION;
  const grooveStroke = variant === "hero" ? 2.5 : 2;

  return (
    <div
      className={cn(
        "pointer-events-none select-none",
        dominant
          ? "relative flex h-full w-full items-center justify-center"
          : "absolute inset-0 overflow-hidden",
        className
      )}
      aria-hidden
    >
      {/* Main disc — high-contrast flat graphic */}
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className={cn(
          "cj-vinyl-graphic",
          dominant
            ? "h-[min(92vw,640px)] w-[min(92vw,640px)] sm:h-[min(78vw,720px)] sm:w-[min(78vw,720px)]"
            : variant === "hero"
              ? "absolute -right-[12%] top-1/2 h-[min(105vw,840px)] w-[min(105vw,840px)] -translate-y-1/2"
              : variant === "minimal"
                ? "absolute right-[5%] top-1/2 h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-y-1/2 opacity-90"
                : "absolute -right-[20%] top-1/2 h-[min(80vw,560px)] w-[min(80vw,560px)] -translate-y-1/2"
        )}
        style={{ opacity: (dominant ? 1 : variant === "hero" ? 0.92 : 0.75) * opacity }}
      >
        {/* Disc fill */}
        <circle
          cx={cx}
          cy={cy}
          r={grooves[0] + 8}
          className="fill-[var(--cj-vinyl-disc-fill)]"
        />

        {/* Bold groove rings */}
        {grooves.map((r, i) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={i < 3 ? grooveStroke + 1 : grooveStroke}
            opacity={i < 4 ? 1 : 0.55 + (grooves.length - i) * 0.04}
          />
        ))}

        {/* Overlapping label circles — constructivist offset */}
        <circle
          cx={cx - 42}
          cy={cy - 28}
          r={variant === "hero" ? 88 : 58}
          fill="#C9962A"
          opacity={0.95}
        />
        <circle
          cx={cx + 36}
          cy={cy + 44}
          r={variant === "hero" ? 64 : 42}
          fill="#5C1F2E"
          opacity={0.88}
        />
        <circle
          cx={cx - 8}
          cy={cy + 12}
          r={variant === "hero" ? 48 : 32}
          fill="#F5EDD6"
          opacity={0.35}
        />

        {/* Center spindle */}
        <circle cx={cx} cy={cy} r={14} className="fill-[var(--cj-vinyl-spindle)]" />
        <circle cx={cx} cy={cy} r={5} fill="#C9962A" />
      </svg>

      {/* Flat tonearm — minimalist ref */}
      <svg
        className={cn(
          "cj-vinyl-graphic absolute",
          dominant
            ? "right-[8%] top-[18%] h-40 w-40 sm:h-52 sm:w-52"
            : variant === "hero"
              ? "right-[18%] top-[22%] h-36 w-36 sm:h-48 sm:w-48"
              : "right-[12%] top-[28%] h-28 w-28"
        )}
        viewBox="0 0 140 140"
        style={{ opacity: 0.55 * opacity }}
      >
        <line
          x1="18"
          y1="118"
          x2="108"
          y2="28"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="108"
          y1="28"
          x2="118"
          y2="22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="118" cy="22" r="5" fill="currentColor" />
        <circle cx="18" cy="118" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>

      {/* Curved manifesto arc — constructivist ref */}
      {(variant === "hero" || dominant) && (
        <svg
          className={cn(
            "absolute text-label-amber",
            dominant
              ? "left-[6%] top-[62%] h-32 w-64 sm:left-[10%] sm:top-[58%] sm:h-40 sm:w-80"
              : "left-[4%] top-[55%] h-28 w-56 sm:h-36 sm:w-72"
          )}
          viewBox="0 0 320 120"
          style={{ opacity: 0.85 * opacity }}
        >
          <defs>
            <path
              id="cj-arc-quote"
              d="M 20 90 Q 160 10 300 90"
              fill="none"
            />
          </defs>
          <text
            className="fill-current font-headline text-[11px] font-bold uppercase tracking-[0.22em] sm:text-xs"
            fontSize="11"
            letterSpacing="3"
          >
            <textPath href="#cj-arc-quote" startOffset="8%">
              Close your eyes · Listen · Make noise
            </textPath>
          </text>
        </svg>
      )}
    </div>
  );
}
