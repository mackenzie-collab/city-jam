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
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <div className="relative mb-6 flex h-16 w-16 items-center justify-center">
        <div className="cj-record-spinner" aria-hidden />
        <Icon className="absolute h-6 w-6 text-cj-gold-muted" aria-hidden />
      </div>
      <p className="font-headline text-2xl uppercase tracking-nav text-cj-gold-muted">
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
