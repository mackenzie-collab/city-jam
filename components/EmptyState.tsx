import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  dark?: boolean;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  dark = false,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div
        className={`mb-6 flex h-16 w-16 items-center justify-center rounded-xl border border-cj-gold-border ${
          dark ? "bg-cj-purple-card" : "bg-cj-purple-card"
        }`}
      >
        <Icon className="h-8 w-8 text-cj-gold-muted" />
      </div>
      <p className="font-display text-2xl uppercase tracking-widest text-cj-gold-muted">
        {title}
      </p>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-cj-gold-muted/80">{description}</p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
