"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CjIcon from "@/components/CjIcon";
import { MOBILE_NAV_ICONS } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const TABS = [
  { href: "/community", label: "Scene" },
  { href: "/studio", label: "Studio" },
  { href: "/signal-map", label: "Map" },
  { href: "/blind-echo", label: "Jam" },
  { href: "/profile", label: "You" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cj-gold-border bg-cj-purple-dark/95 backdrop-blur-md md:hidden">
      <div className="flex justify-around px-2 py-2">
        {TABS.map(({ href, label }) => {
          const active = pathname === href || (href !== "/community" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[9px] uppercase tracking-wider no-underline",
                active ? "text-cj-gold" : "text-cj-gold-muted"
              )}
            >
              <CjIcon
                src={MOBILE_NAV_ICONS[href]}
                alt=""
                size={22}
                className={cn(active ? "opacity-100" : "opacity-60")}
              />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
