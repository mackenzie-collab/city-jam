"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const STUDIO_PREFIXES = [
  "/studio",
  "/vault",
  "/collab",
  "/project-match",
  "/circles",
  "/listening-rooms",
];

const LABELS: Record<string, string> = {
  "/community": "Community",
  "/studio": "Studio",
  "/profile": "Profile",
  "/vault": "Vault",
  "/collab": "Collab",
  "/project-match": "Project Match",
  "/circles": "Circles",
  "/listening-rooms": "Listening Rooms",
  "/signal-map": "Signal Map",
  "/blind-echo": "Blind Echo",
  "/echo-roulette": "Echo Roulette",
};

function labelFor(pathname: string): string {
  if (LABELS[pathname]) return LABELS[pathname];
  if (pathname.startsWith("/studio/projects/")) return "Project";
  if (pathname.startsWith("/listening-rooms/")) return "Listening Room";
  if (pathname.startsWith("/circles/")) return "Circle";
  const base = pathname.split("/").filter(Boolean)[0];
  return base ? base.replace(/-/g, " ") : "City Jam";
}

export default function AppTrail() {
  const pathname = usePathname();

  if (pathname === "/" || pathname === "/community") return null;

  const inStudio = STUDIO_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  return (
    <nav
      aria-label="You are here"
      className="mb-6 flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-widest text-cj-gold-muted"
    >
      <span className="text-cj-gold-muted/70">You are here</span>
      <ChevronRight className="h-3 w-3 opacity-50" />
      <Link href="/community" className="transition-colors hover:text-cj-gold">
        Community
      </Link>
      {inStudio && (
        <>
          <ChevronRight className="h-3 w-3 opacity-50" />
          <Link href="/studio" className="transition-colors hover:text-cj-gold">
            Studio
          </Link>
        </>
      )}
      <ChevronRight className="h-3 w-3 opacity-50" />
      <span className="text-cj-gold">{labelFor(pathname)}</span>
    </nav>
  );
}
