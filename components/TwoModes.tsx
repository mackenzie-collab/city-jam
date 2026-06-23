import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import CjIcon from "@/components/CjIcon";
import VinylCard from "@/components/analog/VinylCard";
import GrainOverlay from "@/components/GrainOverlay";
import PosterMotif from "@/components/PosterMotif";
import { ICONS } from "@/lib/brand-assets";

export default function TwoModes() {
  return (
    <section className="cj-section cj-section-poster relative overflow-hidden bg-brand-purple">
      <GrainOverlay warm intensity={0.04} />
      <PosterMotif variant="minimal" opacity={0.3} />
      <div className="relative mx-auto max-w-6xl">
        <div className="mb-6">
          <span className="cj-badge mb-4 sm:mb-6">Casual mode</span>
          <h2 className="cj-poster-headline text-3xl sm:text-4xl md:text-5xl">
            Echo{" "}
            <span className="text-brand-gold">Roulette</span>
          </h2>
          <p className="mt-4 max-w-xl font-body text-base text-cj-text-muted">
            Want something lighter? Spin the dial and get matched to whoever is live.
            Blind Echo is featured above for high-intent sessions.
          </p>
        </div>

        <div className="mt-10 max-w-xl">
          <VinylCard variant="sleeve" className="relative flex flex-col border-[var(--cj-zine-border)] bg-brand-purple-deep">
            <div className="mb-4 flex items-center justify-between">
              <CjIcon src={ICONS.frequencyDial} alt="" size={28} />
              <span className="cj-badge text-[10px]">Casual</span>
            </div>
            <h3 className="font-display text-2xl uppercase tracking-[0.06em] text-brand-parchment sm:text-3xl">
              Echo Roulette
            </h3>
            <p className="mt-3 flex-1 font-mono text-sm leading-relaxed text-cj-text-muted">
              Spin the dial, lock into a frequency, and get matched to whoever is live.
              No timer, no gate — just vibes.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <ButtonLink href="/echo-roulette" variant="secondary" className="border-brand-gold/40 text-brand-parchment hover:border-brand-gold">
                Enter Echo Roulette
              </ButtonLink>
              <Link href="/blind-echo" className="font-mono text-xs uppercase tracking-widest text-cj-text-muted hover:text-brand-gold">
                ← Back to Blind Echo
              </Link>
            </div>
          </VinylCard>
        </div>
      </div>
    </section>
  );
}
