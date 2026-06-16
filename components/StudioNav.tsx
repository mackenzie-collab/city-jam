"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  Briefcase,
  Headphones,
  LayoutDashboard,
  Users,
  FolderKanban,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/community", label: "Community", icon: Users },
  { href: "/studio", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/project-match", label: "Project Match", icon: Briefcase },
  { href: "/vault", label: "Vault", icon: Archive },
  { href: "/collab", label: "Collab", icon: FolderKanban },
  { href: "/listening-rooms", label: "Listening Rooms", icon: Headphones },
  { href: "/echo-roulette", label: "Echo Roulette", icon: Radio },
];

export default function StudioNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-cj-gold-border pb-6 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
      <p className="mb-2 hidden w-full text-[10px] uppercase tracking-widest text-cj-gold-muted lg:block">
        Navigate
      </p>
      {LINKS.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs uppercase tracking-wide transition-colors no-underline",
              active
                ? "border-cj-gold bg-cj-purple-card text-cj-gold"
                : "border-transparent text-cj-gold-muted hover:border-cj-gold/40 hover:text-cj-gold"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
