import Link from "next/link";
import { Mic, Radio } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import { ICONS } from "@/lib/brand-assets";

const JAM_TOOLS = [
  {
    href: "/blind-echo",
    label: "Blind Echo",
    desc: "Anonymous audio jam sessions — no faces, just sound.",
    icon: Mic,
  },
  {
    href: "/echo-roulette",
    label: "Echo Roulette",
    desc: "Spin the dial and connect with a random musician.",
    icon: Radio,
  },
];

export default function JamPage() {
  return (
    <FeatureShell
      title="Jam"
      iconSrc={ICONS.frequencyDial}
      badge="Quick Jam"
      heading={
        <>
          Pick Your / <span className="text-cj-gold-bright">Jam Mode.</span>
        </>
      }
      subtitle="Blind Echo and Echo Roulette — two ways to connect through sound."
      maxWidth="md"
    >
      <div className="grid gap-4 sm:grid-cols-1">
        {JAM_TOOLS.map(({ href, label, desc, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="cj-card cj-gold-frame group flex items-start gap-4 no-underline transition-colors hover:border-cj-gold"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-cj-gold-border bg-cj-dark">
              <Icon className="h-6 w-6 text-cj-gold" />
            </div>
            <div>
              <h2 className="font-display text-xl uppercase text-cj-gold group-hover:text-cj-gold-bright">
                {label}
              </h2>
              <p className="mt-1 text-sm text-cj-gold-muted">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/listening-rooms" className="cj-btn-secondary text-xs no-underline">
          Listening Rooms
        </Link>
        <Link href="/studio" className="cj-btn-ghost text-xs no-underline">
          Studio Tools →
        </Link>
      </div>
    </FeatureShell>
  );
}
