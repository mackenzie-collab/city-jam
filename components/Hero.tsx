import Link from "next/link";
import GrainOverlay from "@/components/GrainOverlay";
import HeroArtboard from "@/components/home/HeroArtboard";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";

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
              The rebellion starts here
            </span>

            <h1 className="cj-poster-headline">
              Make music{" "}
              <span className="text-brand-gold">fun again</span>
            </h1>

            <p className="mt-6 max-w-lg font-body text-base leading-relaxed text-cj-text-muted sm:mt-8 md:text-lg">
              An app for musicians. Not fans. Not listeners. Musicians. Meet your
              people. Build your band. Make noise together.
            </p>

            <div className="cj-mobile-cta-stack mt-8 sm:mt-10">
              <Link href="/scene" className="no-underline">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Enter the scene
                </Button>
              </Link>
              <Link href="/echo-roulette" className="no-underline">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                  Try as guest
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative z-[1] flex w-full items-center justify-center lg:col-span-5">
            <HeroArtboard className="lg:-mr-4" />
          </div>
        </div>
      </div>
    </section>
  );
}
