"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CjIcon from "@/components/CjIcon";
import { ICONS, MOBILE_NAV_ICONS } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const AUTH_TABS = [
  { href: "/community", label: "Scene" },
  { href: "/studio", label: "Studio" },
  { href: "/signal-map", label: "Map" },
  { href: "/blind-echo", label: "Jam" },
  { href: "/profile", label: "You" },
];

const GUEST_TABS = [
  { href: "/", label: "Home", icon: ICONS.home },
  { href: "/community", label: "Scene", icon: ICONS.band },
  { href: "/signal-map", label: "Map", icon: ICONS.globeSound },
  { href: "/echo-roulette", label: "Jam", icon: ICONS.frequencyDial },
  { href: "/register", label: "Join", icon: ICONS.jamMatch },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const tabs = isAuthenticated
    ? AUTH_TABS.map((tab) => ({ ...tab, icon: MOBILE_NAV_ICONS[tab.href] }))
    : GUEST_TABS;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cj-gold-border bg-cj-purple-dark/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="flex justify-around px-1 pt-2">
        {tabs.map(({ href, label, icon }) => {
          const active =
            pathname === href ||
            (href !== "/" && href !== "/community" && pathname.startsWith(href)) ||
            (href === "/community" && pathname.startsWith("/community"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-11 min-w-[3.5rem] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1 text-[9px] uppercase tracking-wider no-underline",
                active ? "text-cj-gold" : "text-cj-gold-muted"
              )}
            >
              <CjIcon
                src={icon}
                alt=""
                size={24}
                className={cn(active ? "opacity-100" : "opacity-60")}
              />
              <span className="max-w-[4rem] truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
