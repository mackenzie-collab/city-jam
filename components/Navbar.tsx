"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/signal-map", label: "Signal Map" },
  { href: "/project-match", label: "Projects" },
  { href: "/vault", label: "Vault" },
  { href: "/collab", label: "Collab" },
  { href: "/circles", label: "Circles" },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-cj-purple-dark px-6 py-4 md:px-8">
      <Link
        href="/"
        className="font-display text-2xl font-bold tracking-wide text-cj-gold md:text-3xl"
      >
        CITY<span className="mx-1 opacity-60">/</span>JAM
      </Link>

      <div className="hidden items-center gap-6 lg:flex">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-xs uppercase tracking-widest text-cj-gold no-underline transition-opacity hover:opacity-70"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="hidden text-xs uppercase tracking-widest text-cj-gold transition-opacity hover:opacity-70 sm:inline"
        >
          Sign in
        </Link>
        <Link href="/register">
          <Button variant="primary" size="sm">
            Join the rebellion
          </Button>
        </Link>
      </div>
    </nav>
  );
}
