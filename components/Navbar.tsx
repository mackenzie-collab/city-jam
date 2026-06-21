"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import MobileMenu from "@/components/MobileMenu";
import CjIcon from "@/components/CjIcon";
import { Button } from "@/components/ui/button";
import JamStreakWidget from "@/components/JamStreakWidget";
import ThemeToggle from "@/components/ThemeToggle";
import { ICONS } from "@/lib/brand-assets";
import { isNavActive } from "@/lib/nav";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/scene", label: "Scene" },
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
      <nav className="cj-header flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-transparent text-cj-text-muted hover:border-[var(--cj-zine-border)] hover:bg-brand-purple-muted hover:text-brand-parchment lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <BrandLogo href={isAuthenticated ? "/scene" : "/"} size={32} priority />
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          {navLinks.map((link) => {
            const active = isNavActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "font-body text-sm font-medium no-underline transition-colors hover:text-brand-gold",
                  active
                    ? "cj-nav-tab-active text-brand-parchment"
                    : "text-cj-text-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle compact />
          {!loading && isAuthenticated ? (
            <>
              <JamStreakWidget compact />
              <Link
                href="/profile"
                className="hidden items-center gap-1.5 font-body text-sm font-medium text-cj-text-muted no-underline hover:text-brand-parchment sm:flex"
              >
                <CjIcon src={ICONS.profile} alt="" size={16} />
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
                <Button variant="primary" size="sm" className="px-4">
                  <span className="sm:hidden">Join</span>
                  <span className="hidden sm:inline">Join the rebellion</span>
                </Button>
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
