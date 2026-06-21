import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import BarcodeDivider from "@/components/BarcodeDivider";
import GrainOverlay from "@/components/GrainOverlay";

const discoverLinks = [
  { label: "Community", href: "/community" },
  { label: "Blind Echo", href: "/blind-echo" },
  { label: "Echo Roulette", href: "/echo-roulette" },
  { label: "Project Match", href: "/project-match" },
  { label: "Scene", href: "/scene" },
  { label: "Signal Map", href: "/signal-map" },
];

const studioLinks = [
  { label: "Circles", href: "/circles" },
  { label: "Vault", href: "/vault" },
  { label: "Collab", href: "/collab" },
  { label: "Listen Rooms", href: "/listening-rooms" },
  { label: "Studio", href: "/studio" },
  { label: "Jam", href: "/jam" },
];

export default function Footer() {
  return (
    <footer className="cj-footer cj-section-poster relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-8">
      <GrainOverlay warm intensity={0.035} />
      <div className="relative mx-auto max-w-6xl">
        <div className="border-b border-[var(--cj-zine-border)] pb-8">
          <BrandLogo href="/" size={40} />
          <p className="mt-4 max-w-md font-mono text-sm tracking-[0.06em] text-cj-text-muted">
            An app for musicians. Not fans. Not listeners. Make music fun again.
          </p>
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.12em] text-brand-gold">
              Discover
            </h3>
            <ul className="mt-4 space-y-2">
              {discoverLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="cj-link-groove font-mono text-sm uppercase tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm uppercase tracking-[0.12em] text-brand-gold">
              Studio
            </h3>
            <ul className="mt-4 space-y-2">
              {studioLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="cj-link-groove font-mono text-sm uppercase tracking-wide">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link href="/privacy" className="cj-link-groove uppercase tracking-wide">
            Privacy
          </Link>
          <Link href="/terms" className="cj-link-groove uppercase tracking-wide">
            Terms
          </Link>
          <Link href="/contact" className="cj-link-groove uppercase tracking-wide">
            Contact
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[var(--cj-zine-border)] pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BarcodeDivider className="mb-4 max-w-xs opacity-60" />
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-cj-text-muted">
              100% audio-only · 0 photos · No algorithms
            </p>
          </div>
          <p className="font-mono text-xs text-cj-gold-muted">
            © {new Date().getFullYear()} City Jam. Close your eyes. Listen.
          </p>
        </div>
      </div>
    </footer>
  );
}
