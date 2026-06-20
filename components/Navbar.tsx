"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import VinylLogo from "@/components/VinylLogo";
import MobileMenu from "@/components/MobileMenu";
import CjIcon from "@/components/CjIcon";
import { Button } from "@/components/ui/button";
import JamStreakWidget from "@/components/JamStreakWidget";
import ThemeToggle from "@/components/ThemeToggle";
import { ICONS } from "@/lib/brand-assets";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/scene", label: "Scene", highlight: true },
  { href: "/jam", label: "Jam" },
  { href: "/profile", label: "Profile" },
];

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <>
      <nav className="cj-tonearm-rail sticky top-0 z-50 flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 md:px-8">
        <div className="relative z-10 flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cj-gold-border text-cj-gold lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <VinylLogo href={isAuthenticated ? "/scene" : "/"} size={40} priority />
        </div>

        <div className="relative z-10 hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(`${link.href}/`)) ||
              (link.href === "/scene" && pathname.startsWith("/community"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-xs uppercase tracking-nav no-underline transition-opacity hover:opacity-80",
                  active || link.highlight
                    ? "font-semibold text-label-cream cj-nav-tab-active"
                    : "text-label-cream/80"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="relative z-10 flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle compact />
          {!loading && isAuthenticated ? (
            <>
              <JamStreakWidget compact />
              <Link
                href="/profile"
                className="relative z-10 flex items-center gap-1 text-xs uppercase tracking-nav text-label-cream no-underline hover:opacity-80"
              >
                <CjIcon src={ICONS.profile} alt="" size={14} />
                {user?.name ?? user?.email?.split("@")[0]}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                aria-label="Log out"
                className="hidden sm:inline-flex"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="cj-sign-in-ghost hidden sm:inline-flex">
                Sign in
              </Link>
              <Link href="/register" className="no-underline">
                <span className="cj-label-sticker px-3 text-[10px] sm:px-4 sm:text-xs">
                  <span className="sm:hidden">Join</span>
                  <span className="hidden sm:inline">Join the rebellion</span>
                </span>
              </Link>
            </>
          )}
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
    </>
  );
}
