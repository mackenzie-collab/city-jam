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
    <section className="cj-section cj-section-poster relative overflow-hidden bg-cj-surface">
      <GrainOverlay warm intensity={0.16} />
      <PosterMotif variant="minimal" opacity={0.35} />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6 flex items-stretch gap-4">
          <BarcodeDivider orientation="vertical" className="w-5 shrink-0 opacity-80" />
          <div>
            <span className="cj-badge mb-4 font-headline uppercase tracking-[0.14em] sm:mb-6">
              Pick your frequency
            </span>
            <h2 className="cj-poster-headline text-3xl sm:text-4xl md:text-5xl">
              Two modes.{" "}
              <span className="text-label-amber">One truth.</span>
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 md:gap-10">
          {modes.map((mode) => (
            <VinylCard key={mode.title} variant="sleeve" className="relative flex flex-col border-cj-border/80">
              <p className="font-headline text-2xl font-bold uppercase tracking-[0.2em] text-label-amber">
                Side {mode.side}
              </p>
              <div className="mb-4 mt-4 flex items-center justify-between">
                <CjIcon src={mode.icon} alt="" size={28} />
                <span className="cj-badge font-headline text-[10px] uppercase tracking-[0.14em]">
                  {mode.tag}
                </span>
              </div>
              <h3 className="font-headline text-2xl font-bold uppercase tracking-[0.08em] text-cj-text sm:text-3xl">
                {mode.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-cj-text-muted">
                {mode.description}
              </p>
              <BarcodeDivider className="my-5 max-w-[100px] opacity-45" />
              <Link href={mode.href} className="mt-auto block no-underline">
                <Button variant="secondary" className="w-full sm:w-auto">
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
