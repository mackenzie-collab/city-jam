import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cj-gold-border bg-cj-purple-dark px-6 py-16 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="font-display text-4xl tracking-wide text-cj-gold md:text-5xl">
            CITY<span className="mx-1 opacity-60">/</span>JAM
          </p>
          <p className="mt-4 max-w-md text-sm text-cj-gold-muted">
            An app for musicians. Not fans. Not listeners. Make music fun again.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-xs uppercase tracking-widest text-cj-gold-muted">
          <Link href="/signal-map" className="hover:text-cj-gold">
            Signal Map
          </Link>
          <Link href="/project-match" className="hover:text-cj-gold">
            Project Match
          </Link>
          <Link href="/circles" className="hover:text-cj-gold">
            Circles
          </Link>
          <Link href="/vault" className="hover:text-cj-gold">
            Vault
          </Link>
          <Link href="/collab" className="hover:text-cj-gold">
            Collab
          </Link>
          <Link href="/listening-rooms" className="hover:text-cj-gold">
            Listening Rooms
          </Link>
        </div>

        <div className="mt-12 border-t border-cj-gold-border pt-8">
          <p className="text-xs uppercase tracking-widest text-cj-gold-muted">
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
