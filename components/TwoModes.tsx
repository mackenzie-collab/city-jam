import Link from "next/link";
import { Button } from "@/components/ui/button";
import CjIcon from "@/components/CjIcon";
import VinylCard from "@/components/analog/VinylCard";
import GrainOverlay from "@/components/GrainOverlay";
import BarcodeDivider from "@/components/BarcodeDivider";
import PosterMotif from "@/components/PosterMotif";
import { ICONS } from "@/lib/brand-assets";

const modes = [
  {
    side: "A" as const,
    title: "Blind Echo",
    tag: "High intent",
    icon: ICONS.lightning,
    description:
      "7-minute timed session. Deep prompts. A match gate at the end — both sides decide.",
    href: "/blind-echo",
  },
  {
    side: "B" as const,
    title: "Echo Roulette",
    tag: "Casual",
    icon: ICONS.frequencyDial,
    description:
      "Spin the dial, lock into a frequency, and get matched to whoever is live.",
    href: "/echo-roulette",
  },
];

export default function TwoModes() {
  return (
    <section className="cj-section cj-section-poster relative overflow-hidden bg-brand-purple">
      <GrainOverlay warm intensity={0.04} />
      <PosterMotif variant="minimal" opacity={0.3} />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex items-stretch gap-4">
          <BarcodeDivider orientation="vertical" className="w-5 shrink-0 opacity-80" />
          <div>
            <span className="cj-badge mb-4 sm:mb-6">Pick your frequency</span>
            <h2 className="cj-poster-headline text-3xl sm:text-4xl md:text-5xl">
              Two modes.{" "}
              <span className="text-brand-gold">One truth.</span>
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-10">
          {modes.map((mode) => (
            <VinylCard key={mode.title} variant="sleeve" className="relative flex flex-col border-[var(--cj-zine-border)] bg-brand-purple-deep">
              <p className="font-display text-2xl uppercase tracking-[0.12em] text-brand-gold">
                Side {mode.side}
              </p>
              <div className="mb-4 mt-4 flex items-center justify-between">
                <CjIcon src={mode.icon} alt="" size={28} />
                <span className="cj-badge text-[10px]">{mode.tag}</span>
              </div>
              <h3 className="font-display text-2xl uppercase tracking-[0.06em] text-brand-parchment sm:text-3xl">
                {mode.title}
              </h3>
              <p className="mt-3 flex-1 font-mono text-sm leading-relaxed text-brand-parchment/70">
                {mode.description}
              </p>
              <BarcodeDivider className="my-5 max-w-[100px] opacity-45" />
              <Link href={mode.href} className="mt-auto block no-underline">
                <Button variant="secondary" className="w-full border-brand-gold/40 text-brand-parchment hover:border-brand-gold sm:w-auto">
                  Enter Side {mode.side}
                </Button>
              </Link>
            </VinylCard>
          ))}
        </div>
      </div>
    </section>
  );
}
