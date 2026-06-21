import { cn } from "@/lib/utils";

interface VinylCardProps extends React.HTMLAttributes<HTMLDivElement> {
  showDisc?: boolean;
  padding?: "none" | "default";
  variant?: "default" | "lp" | "sleeve";
}

export default function VinylCard({
  children,
  className,
  padding = "default",
  variant = "default",
  ...props
}: VinylCardProps) {
  const variantClass =
    variant === "lp" ? "cj-card-lp" : variant === "sleeve" ? "cj-card-sleeve" : "cj-card";

  return (
    <div
      className={cn(
        variantClass,
        padding === "default" && "p-5 sm:p-6",
        padding === "none" && "p-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
