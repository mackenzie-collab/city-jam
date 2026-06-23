import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import CjIcon from "@/components/CjIcon";
import GrainOverlay from "@/components/GrainOverlay";
import PosterMotif from "@/components/PosterMotif";
import InteractiveVinyl from "@/components/vinyl/InteractiveVinyl";
import { ICONS } from "@/lib/brand-assets";

const highlights = [
  "7-minute timed session — no endless scrolling",
  "Deep prompts that cut through small talk",
  "Mutual match gate — both sides decide",
];

export default function BlindEchoFeature() {
  return (
    <section className="cj-section cj-section-poster relative overflow-hidden border-y border-[var(--cj-zine-border)] bg-brand-purple-deep">
      <GrainOverlay warm intensity={0.05} />
      <PosterMotif variant="minimal" opacity={0.2} />
      <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-7">
          <span className="cj-badge mb-4 sm:mb-5">Featured · High intent</span>
          <h2 className="cj-poster-headline text-3xl sm:text-4xl md:text-5xl">
            Blind{" "}
            <span className="text-brand-gold">Echo</span>
          </h2>
          <p className="mt-4 max-w-xl font-body text-base leading-relaxed text-cj-text-muted sm:mt-5">
            Anonymous audio matchmaking for musicians who want to connect by sound alone.
            Close your eyes. Listen. Decide together.
          </p>
          <ul className="mt-6 space-y-3 sm:mt-8">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 font-mono text-sm text-cj-text">
                <CjIcon src={ICONS.lightning} alt="" size={18} className="mt-0.5 shrink-0 opacity-90" />
                {item}
              </li>
            ))}
          </ul>
          <div className="cj-mobile-cta-stack mt-8 sm:mt-10">
            <ButtonLink href="/blind-echo" variant="primary" size="lg" className="w-full sm:w-auto">
              Enter Blind Echo
            </ButtonLink>
            <Link
              href="/echo-roulette"
              className="text-center font-mono text-xs uppercase tracking-widest text-cj-text-muted hover:text-brand-gold sm:text-left"
            >
              or try Echo Roulette →
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5">
          <div className="cj-zine-border relative flex flex-col items-center bg-brand-purple-deep px-6 py-8 sm:px-8 sm:py-10">
            <div className="mb-4 flex items-center gap-3">
              <CjIcon src={ICONS.lightning} alt="" size={32} />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-brand-gold">
                07:00 session
              </span>
            </div>
            <InteractiveVinyl size={180} interactive={false} className="sm:hidden" />
            <InteractiveVinyl size={220} interactive={false} className="hidden sm:block" />
            <p className="mt-5 text-center font-display text-xl uppercase tracking-[0.08em] text-brand-parchment">
              Match by sound
            </p>
            <p className="mt-1 text-center font-mono text-xs text-cj-text-muted">
              No faces. No bios. Just the signal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
