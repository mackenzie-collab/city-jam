import Link from "next/link";
import VinylLogo from "@/components/VinylLogo";

export default function Footer() {
  return (
    <footer className="cj-back-sleeve px-4 py-12 sm:px-6 sm:py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 border-b border-cj-gold-border/30 pb-8">
          <VinylLogo href="/" size={80} spinning={false} />
          <p className="mt-4 max-w-md text-sm text-cj-gold-muted">
            An app for musicians. Not fans. Not listeners. Make music fun again.
          </p>
          <p className="cj-label-stamp mt-3 text-[10px]">
            Side B · City Jam Records · All rights reserved
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-nav text-cj-gold-muted">
          <Link href="/community" className="cj-link-groove hover:text-cj-gold">
            Community
          </Link>
          <Link href="/project-match" className="cj-link-groove hover:text-cj-gold">
            Project Match
          </Link>
          <Link href="/circles" className="cj-link-groove hover:text-cj-gold">
            Circles
          </Link>
          <Link href="/vault" className="cj-link-groove hover:text-cj-gold">
            Vault
          </Link>
          <Link href="/collab" className="cj-link-groove hover:text-cj-gold">
            Collab
          </Link>
          <Link href="/listening-rooms" className="cj-link-groove hover:text-cj-gold">
            Listening Rooms
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 text-xs uppercase tracking-nav text-cj-gold-muted">
          <Link href="/privacy" className="cj-link-groove hover:text-cj-gold">
            Privacy
          </Link>
          <Link href="/terms" className="cj-link-groove hover:text-cj-gold">
            Terms
          </Link>
          <Link href="/contact" className="cj-link-groove hover:text-cj-gold">
            Contact
          </Link>
        </div>

        <div className="mt-12 border-t border-cj-gold-border pt-8">
          <p className="font-mono text-xs uppercase tracking-nav text-cj-gold-muted">
            100% Audio-Only · 0 Photos · No Algorithms
          </p>
          <p className="mt-2 text-xs text-cj-gold-muted/60">
            © {new Date().getFullYear()} City Jam. Close your eyes. Listen.
          </p>
        </div>
      </div>
    </footer>
  );
}
