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
  Music,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WORKSPACE_LINKS = [
  { href: "/studio", label: "Studio", icon: Music, exact: true },
  { href: "/vault", label: "Audio Vault", icon: Archive, exact: true },
  { href: "/dashboard", label: "My Tracks", icon: LayoutDashboard, exact: true },
] as const;

const COLLABORATE_LINKS = [
  { href: "/project-match", label: "Project Match", icon: Briefcase },
  { href: "/collab", label: "Collab", icon: FolderKanban },
  { href: "/listening-rooms", label: "Listening Rooms", icon: Headphones },
  { href: "/circles", label: "Circles", icon: Users },
  { href: "/echo-roulette", label: "Echo Roulette", icon: Radio },
] as const;

function NavGroup({
  title,
  links,
  pathname,
}: {
  title: string;
  links: readonly {
    href: string;
    label: string;
    icon: typeof Music;
    exact?: boolean;
  }[];
  pathname: string;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 hidden w-full text-[10px] uppercase tracking-widest text-cj-gold-muted lg:block">
        {title}
      </p>
      {links.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "mb-1 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs uppercase tracking-wide transition-colors no-underline",
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
    </div>
  );
}

export default function StudioNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-cj-gold-border pb-6 lg:flex-col lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
      <NavGroup title="Workspace" links={WORKSPACE_LINKS} pathname={pathname} />
      <NavGroup title="Collaborate" links={COLLABORATE_LINKS} pathname={pathname} />
      <div className="w-full lg:mt-2">
        <Link
          href="/community"
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs uppercase tracking-wide transition-colors no-underline",
            pathname.startsWith("/community")
              ? "border-cj-gold bg-cj-purple-card text-cj-gold"
              : "border-transparent text-cj-gold-muted hover:border-cj-gold/40 hover:text-cj-gold"
          )}
        >
          <Users className="h-4 w-4 shrink-0" />
          Community
        </Link>
      </div>
    </nav>
  );
}
