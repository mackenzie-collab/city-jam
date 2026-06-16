"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const navLinks = [
  { href: "/studio", label: "Studio" },
  { href: "/signal-map", label: "Signal Map" },
  { href: "/blind-echo", label: "Blind Echo" },
  { href: "/echo-roulette", label: "Echo Roulette" },
  { href: "/project-match", label: "Projects" },
  { href: "/listening-rooms", label: "Rooms" },
];

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-cj-purple-dark px-6 py-4 md:px-8">
      <Link
        href="/"
        className="font-display text-2xl font-bold tracking-wide text-cj-gold md:text-3xl"
      >
        CITY<span className="mx-1 opacity-60">/</span>JAM
      </Link>

      <div className="hidden items-center gap-5 xl:flex">
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

      <div className="flex items-center gap-3">
        {!loading && isAuthenticated ? (
          <>
            <Link
              href="/profile"
              className="hidden items-center gap-1 text-xs uppercase tracking-widest text-cj-gold sm:flex"
            >
              <User className="h-3 w-3" />
              {user?.name ?? user?.email?.split("@")[0]}
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} aria-label="Log out">
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}
