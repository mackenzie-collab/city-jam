"use client";

import { LucideIcon } from "lucide-react";
import AppChrome from "@/components/AppChrome";
import AppTrail from "@/components/AppTrail";
import PageHeader from "@/components/PageHeader";
import { cn } from "@/lib/utils";

type ShellVariant = "purple" | "map" | "hall";

const ROOM_ACCENTS: Partial<Record<string, string>> = {
  Jam: "border-cj-gold/50",
  Scene: "border-cj-gold-bright/60",
  Studio: "border-cj-gold/40",
  Vault: "border-cj-gold/35",
  Collab: "border-cj-gold/45",
  "Blind Echo": "border-orange-400/40",
  "Echo Roulette": "border-cj-gold/55",
  "Listening Rooms": "border-cj-gold/40",
};

const BG: Record<ShellVariant, string> = {
  purple: "bg-cj-purple",
  map: "bg-cj-purple-map",
  hall: "bg-cj-dark",
};

interface FeatureShellProps {
  title: string;
  icon?: LucideIcon;
  iconSrc?: string;
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
  iconSrc,
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
        iconSrc={iconSrc}
        showDot={showDot}
        dark={variant === "hall"}
        backHref="/community"
        rightElement={headerRight}
      />
      <div className={`mx-auto px-4 py-8 sm:px-6 sm:py-10 ${MAX[maxWidth]}`}>
        {showTrail && <AppTrail />}
        {badge && (
          <span className={cn("cj-badge mb-6", ROOM_ACCENTS[badge] && `border-2 ${ROOM_ACCENTS[badge]}`)}>
            {badge}
          </span>
        )}
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
