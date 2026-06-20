"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import CjIcon from "@/components/CjIcon";
import { BRAND, ICONS, MOBILE_NAV_ICONS } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const TABS = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/scene", label: "Scene" },
  { href: "/jam", label: "Jam" },
  { href: "/profile", label: "Profile" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  const tabs = TABS.map((tab) => ({
    ...tab,
    icon:
      tab.href === "/"
        ? BRAND.logo
        : MOBILE_NAV_ICONS[tab.href] ?? ICONS.home,
  }));

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-cj-gold-border bg-cj-purple-dark/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      <div className="flex justify-around px-1 pt-2">
        {tabs.map(({ href, label, icon }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href)) ||
            (href === "/scene" && pathname.startsWith("/community"));
          const profileHref = isAuthenticated ? "/profile" : "/login?returnUrl=/profile";
          const linkHref = href === "/profile" && !isAuthenticated ? profileHref : href;

          return (
            <Link
              key={href}
              href={linkHref}
              className={cn(
                "flex min-h-11 min-w-[3.5rem] flex-1 flex-col items-center justify-center gap-0.5 px-1 py-1 text-[9px] uppercase tracking-wider no-underline",
                active ? "text-cj-gold-bright cj-nav-tab-active" : "text-cj-gold-muted"
              )}
            >
              {icon === BRAND.logo ? (
                <BrandLogo size={26} className={cn(active ? "opacity-100" : "opacity-60")} />
              ) : (
                <CjIcon
                  src={icon}
                  alt=""
                  size={24}
                  className={cn(active ? "opacity-100" : "opacity-60")}
                />
              )}
              <span className="max-w-[4rem] truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
