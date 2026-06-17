"use client";

import Link from "next/link";
import { ArrowLeft, LucideIcon } from "lucide-react";
import CjIcon from "@/components/CjIcon";

interface PageHeaderProps {
  title: string;
  backHref?: string;
  icon?: LucideIcon;
  iconSrc?: string;
  rightElement?: React.ReactNode;
  showDot?: boolean;
  dark?: boolean;
}

export default function PageHeader({
  title,
  backHref = "/",
  icon: Icon,
  iconSrc,
  rightElement,
  showDot = false,
  dark = false,
}: PageHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-6 py-4 ${
        dark ? "bg-cj-dark border-b border-cj-gold-border" : "bg-cj-purple-dark"
      }`}
    >
      <Link
        href={backHref}
        className="flex h-10 w-10 items-center justify-center text-cj-gold transition-opacity hover:opacity-70"
        aria-label="Go back"
      >
        <ArrowLeft className="h-5 w-5" />
      </Link>

      <div className="flex items-center gap-2">
        {iconSrc ? (
          <CjIcon src={iconSrc} alt="" size={16} />
        ) : (
          Icon && <Icon className="h-4 w-4 text-cj-gold" />
        )}
        {showDot && (
          <span className="h-2 w-2 rounded-full bg-cj-gold-bright animate-pulse-dot" />
        )}
        <h1 className="font-display text-sm uppercase tracking-widest text-cj-gold">
          {title}
        </h1>
      </div>

      <div className="min-w-[40px] flex justify-end">{rightElement}</div>
    </header>
  );
}
