import { cn } from "@/lib/utils";

interface VinylCardProps extends React.HTMLAttributes<HTMLDivElement> {
  showDisc?: boolean;
  padding?: "none" | "default";
}

export default function VinylCard({
  children,
  className,
  showDisc = false,
  padding = "default",
  ...props
}: VinylCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-cj-gold-border bg-cj-purple-card",
        "shadow-[inset_0_0_0_1px_rgba(201,168,0,0.12),0_6px_28px_rgba(0,0,0,0.35)]",
        padding === "default" && "p-5 sm:p-6 md:p-8",
        padding === "none" && "p-0",
        className
      )}
      {...props}
    >
      {showDisc && (
        <div
          className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full border border-cj-gold/20 opacity-30"
          aria-hidden
        />
      )}
      {children}
    </div>
  );
}
