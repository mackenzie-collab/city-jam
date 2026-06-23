"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import CjIcon from "@/components/CjIcon";
import { Button } from "@/components/ui/button";
import { ICONS, TOOL_ICONS } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#affiliates", label: "Affiliates" },
  { href: "/discover", label: "Discover" },
  { href: "/scene", label: "Scene" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/jam", label: "Jam" },
  { href: "/profile", label: "Profile" },
];

const TOOL_LINKS = [
  { href: "/project-match", label: "Project Match" },
  { href: "/collab", label: "Collab" },
  { href: "/circles", label: "Circles" },
  { href: "/listening-rooms", label: "Listening Rooms" },
];

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout?: () => void;
}

export default function MobileMenu({
  open,
  onClose,
  isAuthenticated,
  onLogout,
}: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-cj-border bg-cj-bg shadow-2xl">
        <div className="flex items-center justify-between border-b border-cj-border px-5 py-4">
          <BrandLogo size={32} />
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center text-cj-text-muted hover:text-cj-text"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="mb-2 px-2 text-xs font-medium text-cj-text-muted">
            Main
          </p>
          {PRIMARY_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="mb-1 flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-cj-text no-underline transition-colors hover:bg-cj-surface-elevated"
            >
              {label}
            </Link>
          ))}

          <p className="mb-2 mt-6 px-2 text-xs font-medium text-cj-text-muted">
            Tools
          </p>
          {TOOL_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="mb-1 flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-cj-text no-underline hover:bg-cj-surface-elevated"
            >
              <CjIcon src={TOOL_ICONS[href]} alt="" size={18} className="opacity-80" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="border-t border-cj-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {isAuthenticated ? (
            <div className="space-y-2">
              <Link href="/profile" onClick={onClose} className="block no-underline">
                <Button variant="secondary" className="w-full">
                  Profile
                </Button>
              </Link>
              <Button variant="ghost" className="w-full" onClick={() => { onLogout?.(); onClose(); }}>
                Log out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/login" onClick={onClose} className="block no-underline">
                <Button variant="secondary" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link href="/register" onClick={onClose} className="block no-underline">
                <Button variant="primary" className="w-full">
                  Join the rebellion
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
