import Link from "next/link";
import { Mic, Radio } from "lucide-react";
import FeatureShell from "@/components/FeatureShell";
import VinylCard from "@/components/analog/VinylCard";
import VinylDisc from "@/components/analog/VinylDisc";
import { ICONS } from "@/lib/brand-assets";

const JAM_TOOLS = [
  {
    href: "/blind-echo",
    label: "Blind Echo",
    desc: "Anonymous audio jam sessions — no faces, just sound.",
    icon: Mic,
    room: "The Booth",
  },
  {
    href: "/echo-roulette",
    label: "Echo Roulette",
    desc: "Spin the dial and connect with a random musician.",
    icon: Radio,
    room: "The Dial Room",
  },
];

export default function JamPage() {
  return (
    <FeatureShell
      title="Jam"
      iconSrc={ICONS.frequencyDial}
      badge="Jam"
      heading={
        <>
          Pick Your / <span className="text-cj-gold-bright">Jam Room.</span>
        </>
      }
      subtitle="Each mode is a separate room in the house — enter through the vinyl doorway."
      maxWidth="md"
    >
      <div className="grid gap-6">
        {JAM_TOOLS.map(({ href, label, desc, icon: Icon, room }) => (
          <Link key={href} href={href} className="no-underline">
            <VinylCard showDisc className="group flex items-start gap-5 transition-colors hover:border-cj-gold-bright">
              <div className="relative shrink-0">
                <VinylDisc size={56} />
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-cj-gold-border bg-cj-dark">
                  <Icon className="h-4 w-4 text-cj-gold" />
                </div>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-cj-gold-muted">{room}</p>
                <h2 className="mt-1 font-display text-2xl uppercase text-cj-gold group-hover:text-cj-gold-bright">
                  {label}
                </h2>
                <p className="mt-2 text-sm text-cj-gold-muted">{desc}</p>
              </div>
            </VinylCard>
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
