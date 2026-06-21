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
      className={`cj-header flex items-center justify-between px-4 py-3 sm:px-6 ${
        dark ? "bg-cj-bg" : "bg-cj-bg"
      }`}
    >
      <Link
        href={backHref}
        className="flex h-10 w-10 items-center justify-center text-cj-text-muted transition-colors hover:text-cj-text"
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
        <h1 className="text-sm font-semibold text-cj-text">
          {title}
        </h1>
      </div>

      <div className="min-w-[40px] flex justify-end">{rightElement}</div>
    </header>
  );
}
