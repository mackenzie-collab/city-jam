"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "@/components/BrandLogo";
import CjIcon from "@/components/CjIcon";
import { BRAND, ICONS, MOBILE_NAV_ICONS } from "@/lib/brand-assets";
import { isNavActive } from "@/lib/nav";
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
    icon: tab.href === "/" ? BRAND.logo : (MOBILE_NAV_ICONS[tab.href] ?? ICONS.home),
  }));

  return (
    <nav className="cj-mobile-nav">
      <div className="flex justify-around px-2 pt-2">
        {tabs.map(({ href, label, icon }) => {
          const active = isNavActive(pathname, href);
          const profileHref = isAuthenticated ? "/profile" : "/login?returnUrl=/profile";
          const linkHref = href === "/profile" && !isAuthenticated ? profileHref : href;

          return (
            <Link
              key={href}
              href={linkHref}
              className={cn(
                "flex min-h-11 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 py-1 text-[10px] font-medium no-underline sm:text-[11px]",
                active ? "text-cj-gold cj-nav-tab-active" : "text-cj-text-muted"
              )}
            >
              {icon === BRAND.logo ? (
                <BrandLogo size={22} className={cn(!active && "opacity-60")} />
              ) : (
                <CjIcon
                  src={icon}
                  alt=""
                  size={22}
                  className={cn(active ? "opacity-100" : "opacity-60")}
                />
              )}
              <span className="max-w-[3.5rem] truncate leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
