import { cn } from "@/lib/utils";

interface CassetteChipProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export default function CassetteChip({ children, active, className }: CassetteChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] uppercase tracking-widest",
        active
          ? "border-cj-gold bg-cj-gold text-cj-purple-card"
          : "border-cj-gold-border bg-cj-dark/60 text-cj-gold",
        className
      )}
    >
      <span className="relative flex h-3 w-5 shrink-0 items-center justify-between px-0.5" aria-hidden>
        <span className="h-2 w-2 rounded-full border border-current opacity-70" />
        <span className="h-2 w-2 rounded-full border border-current opacity-70" />
      </span>
      {children}
    </span>
  );
}
