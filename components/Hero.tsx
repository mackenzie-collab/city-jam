import GrainOverlay from "@/components/GrainOverlay";
import BrandLogo from "@/components/BrandLogo";
import { ButtonLink } from "@/components/ui/button";
import CjIcon from "@/components/CjIcon";
import InteractiveVinyl from "@/components/vinyl/InteractiveVinyl";
import { ICONS } from "@/lib/brand-assets";

export default function Hero() {
  return (
    <section className="cj-hero-section cj-section-poster relative flex min-h-[88dvh] flex-col justify-center overflow-hidden px-0 py-10 sm:py-12 md:py-16">
      <div className="absolute inset-0 bg-cj-bg" aria-hidden />
      <div className="absolute inset-0 bg-cj-surface/45" aria-hidden />
      <GrainOverlay warm intensity={0.04} />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 md:px-8">
        <div className="grid items-center gap-6 lg:grid-cols-12 lg:gap-6">
          <div className="cj-page-enter relative z-[2] lg:col-span-7">
            <BrandLogo size={44} className="mb-6 sm:mb-8" priority />
            <span className="cj-badge mb-5 sm:mb-6">
              7-minute anonymous audio match
            </span>

            <h1 className="cj-poster-headline">
              Hear someone{" "}
              <span className="text-brand-gold">before you see them</span>
            </h1>

            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-cj-text-muted sm:mt-8 md:text-lg">
              Blind Echo is City Jam&apos;s high-intent matchmaking mode. Deep prompts,
              timed sessions, and a mutual gate at the end — connect by sound alone.
            </p>

            <div className="cj-mobile-cta-stack mt-8 sm:mt-10">
              <ButtonLink href="/blind-echo" variant="primary" size="lg" className="w-full sm:w-auto">
                Enter Blind Echo
              </ButtonLink>
              <ButtonLink href="/#affiliates" variant="secondary" size="lg" className="w-full sm:w-auto">
                Affiliate waitlist
              </ButtonLink>
              <ButtonLink href="/scene" variant="secondary" size="lg" className="w-full sm:w-auto">
                Enter the scene
              </ButtonLink>
            </div>
          </div>

          <div className="relative z-[1] flex w-full items-center justify-center lg:col-span-5">
            <div className="cj-zine-border relative flex w-full max-w-[min(94vw,420px)] flex-col items-center bg-brand-purple-deep sm:max-w-[min(82vw,440px)] lg:-mr-4">
              <div className="w-full border-b border-[var(--cj-zine-border)] px-3 py-2 text-center">
                <span className="font-display text-sm uppercase tracking-[0.14em] text-cj-text">
                  Blind Echo
                </span>
                <span className="ml-3 font-mono text-[10px] text-brand-gold">Featured</span>
              </div>

              <div className="flex w-full flex-col items-center px-4 py-6 sm:py-8">
                <CjIcon src={ICONS.lightning} alt="" size={36} className="mb-4 opacity-90" />
                <InteractiveVinyl size={220} interactive={false} className="sm:hidden" />
                <InteractiveVinyl size={260} interactive={false} className="hidden sm:block" />
                <p className="mt-5 text-center font-display text-lg uppercase leading-tight text-cj-text sm:text-xl">
                  7 minutes. One match.
                </p>
                <p className="mt-1 font-mono text-xs text-cj-text-muted">
                  Anonymous audio · mutual decision
                </p>
              </div>

              <div className="w-full border-t border-[var(--cj-zine-border)] px-3 py-1.5 text-center">
                <span className="font-mono text-[9px] text-brand-gold">Close your eyes. Listen.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
