"use client";

import { LucideIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";

type ShellVariant = "purple" | "map" | "hall";

const BG: Record<ShellVariant, string> = {
  purple: "bg-cj-purple",
  map: "bg-cj-purple-map",
  hall: "bg-cj-dark",
};

interface FeatureShellProps {
  title: string;
  icon?: LucideIcon;
  showDot?: boolean;
  variant?: ShellVariant;
  headerRight?: React.ReactNode;
  badge?: string;
  heading: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "md" | "lg" | "xl" | "full";
}

const MAX = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-7xl",
};

export default function FeatureShell({
  title,
  icon,
  showDot,
  variant = "purple",
  headerRight,
  badge,
  heading,
  subtitle,
  children,
  footer,
  maxWidth = "lg",
}: FeatureShellProps) {
  return (
    <div className={`min-h-screen ${BG[variant]} ${footer ? "pb-24" : ""}`}>
      <PageHeader
        title={title}
        icon={icon}
        showDot={showDot}
        dark={variant === "hall"}
        rightElement={headerRight}
      />
      <div className={`mx-auto px-6 py-10 ${MAX[maxWidth]}`}>
        {badge && <span className="cj-badge mb-6">{badge}</span>}
        <div className="cj-heading-display text-4xl md:text-5xl lg:text-6xl">{heading}</div>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cj-gold-muted md:text-base">
            {subtitle}
          </p>
        )}
        <div className="mt-10">{children}</div>
      </div>
      {footer}
    </div>
  );
}
