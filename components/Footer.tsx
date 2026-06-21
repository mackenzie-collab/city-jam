import Link from "next/link";
import BrandLogo from "@/components/BrandLogo";
import BarcodeDivider from "@/components/BarcodeDivider";
import GrainOverlay from "@/components/GrainOverlay";
import SideABStrip from "@/components/SideABStrip";

const sideA = [
  { label: "Community", value: "Feed, streaks, project board", href: "/community" },
  { label: "Blind Echo", value: "7-min anonymous sessions", href: "/blind-echo" },
  { label: "Echo Roulette", value: "Spin and go live", href: "/echo-roulette" },
  { label: "Project Match", value: "Find collaborators by intent", href: "/project-match" },
];

const sideB = [
  { label: "Circles", value: "Invite-only groups", href: "/circles" },
  { label: "Vault", value: "Private demos and stems", href: "/vault" },
  { label: "Collab", value: "Boards, files, chord sheets", href: "/collab" },
  { label: "Listen Rooms", value: "Shared listening sessions", href: "/listening-rooms" },
];

export default function Footer() {
  return (
    <footer className="cj-footer cj-section-poster relative overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:px-8">
      <GrainOverlay warm intensity={0.18} />
      <div className="relative mx-auto max-w-6xl">
        <div className="flex gap-6 border-b border-cj-border pb-8">
          <BarcodeDivider orientation="vertical" className="hidden w-5 shrink-0 sm:flex" />
          <div className="min-w-0 flex-1">
            <BrandLogo href="/" size={40} />
            <p className="mt-4 max-w-md font-headline text-sm uppercase tracking-[0.12em] text-cj-text-muted">
              An app for musicians. Not fans. Not listeners. Make music fun again.
            </p>
          </div>
        </div>

        <SideABStrip sideA={sideA} sideB={sideB} compact className="mt-8 border-t-0 pt-0" />

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm">
          <Link href="/privacy" className="cj-link-groove font-headline uppercase tracking-wide">
            Privacy
          </Link>
          <Link href="/terms" className="cj-link-groove font-headline uppercase tracking-wide">
            Terms
          </Link>
          <Link href="/contact" className="cj-link-groove font-headline uppercase tracking-wide">
            Contact
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-cj-border pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <BarcodeDivider className="mb-4 max-w-xs opacity-60" />
            <p className="font-headline text-xs uppercase tracking-[0.14em] text-cj-text-muted">
              100% audio-only · 0 photos · No algorithms
            </p>
          </div>
          <p className="text-xs text-cj-gold-muted">
            © {new Date().getFullYear()} City Jam. Close your eyes. Listen.
          </p>
        </div>
      </div>
    </footer>
  );
}
