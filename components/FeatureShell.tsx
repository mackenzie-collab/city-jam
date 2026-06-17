"use client";

import { LucideIcon } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import AppTrail from "@/components/AppTrail";
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
  /** Set false when AppChrome is already provided by a parent wrapper */
  withChrome?: boolean;
  showTrail?: boolean;
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
  withChrome = true,
  showTrail = true,
}: FeatureShellProps) {
  const shell = (
    <div className={`min-h-screen ${BG[variant]} ${footer ? "pb-24" : ""}`}>
      <PageHeader
        title={title}
        icon={icon}
        showDot={showDot}
        dark={variant === "hall"}
        backHref="/community"
        rightElement={headerRight}
      />
      <div className={`mx-auto px-6 py-10 ${MAX[maxWidth]}`}>
        {showTrail && <AppTrail />}
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

  return withChrome ? <AppChrome>{shell}</AppChrome> : shell;
}
